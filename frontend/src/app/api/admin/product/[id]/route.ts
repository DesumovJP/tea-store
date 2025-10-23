import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const formData = await req.formData();
        const productDocumentId = resolvedParams.id;

        const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL;
        const token = process.env.STRAPI_API_TOKEN as string;
        if (!strapiUrl || !token) {
            return NextResponse.json({ error: "Missing Strapi env vars" }, { status: 500 });
        }

        // 1) Handle multiple image uploads
        const uploadedImageIds: number[] = [];
        const files = formData.getAll("images") as File[];
        
        
        // Validate and upload each file
        for (const file of files) {
            if (file && file.size > 0) {
                // File type validation
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    console.error("❌ Invalid file type:", file.type);
                    return NextResponse.json({ 
                        error: `Invalid file type: ${file.name}. Only JPG, PNG, and WebP images are allowed.`,
                        fileType: file.type,
                        fileName: file.name,
                        allowedTypes: allowedTypes
                    }, { status: 400 });
                }
                
                // File size validation (10MB)
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                    console.error("❌ File too large:", file.size, "bytes");
                    return NextResponse.json({ 
                        error: `File too large: ${file.name}. Maximum size is 10MB.`,
                        fileSize: file.size,
                        fileName: file.name,
                        maxSize: maxSize
                    }, { status: 400 });
                }
                
                
                const uploadFd = new FormData();
                uploadFd.append("files", file);
                
                const uploadRes = await fetch(`${strapiUrl}/api/upload`, {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                    body: uploadFd,
                });
                
                
                if (!uploadRes.ok) {
                    const errorText = await uploadRes.text();
                    console.error(`❌ Upload error for ${file.name}:`, uploadRes.status, errorText);
                    
                    let errorMessage = `Upload failed for ${file.name}`;
                    if (uploadRes.status === 403) {
                        errorMessage = "No permission to upload files. Check Strapi permissions.";
                    } else if (uploadRes.status === 413) {
                        errorMessage = `File too large for server: ${file.name}`;
                    } else if (uploadRes.status === 415) {
                        errorMessage = `Unsupported media type: ${file.name}`;
                    } else if (uploadRes.status === 500) {
                        errorMessage = `Server error during upload: ${file.name}`;
                    }
                    
                    return NextResponse.json({ 
                        error: errorMessage,
                        details: errorText,
                        status: uploadRes.status,
                        fileName: file.name
                    }, { status: uploadRes.status });
                }
                
                const uploaded = await uploadRes.json();
                const imageId = uploaded?.[0]?.id;
                if (imageId) {
                    uploadedImageIds.push(imageId);
                }
            }
        }
        
        // Resolve numeric Strapi ID (optional; used for preserving publishedAt)
        const resolveUrlDoc = `${strapiUrl}/api/products?filters[documentId][$eq]=${productDocumentId}&populate=images`;
        
        let resolveRes = await fetch(resolveUrlDoc, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        
        let resolved = resolveRes.ok ? await resolveRes.json() : null;
        let resolvedItem = resolved?.data?.[0];
        
        // Fallback: resolve by slug (REST supports filtering by scalar fields)
        if (!resolvedItem) {
            const slug = String(formData.get("slug") || "");
            if (slug) {
                const resolveUrlSlug = `${strapiUrl}/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=images`;
                resolveRes = await fetch(resolveUrlSlug, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: "no-store",
                });
                resolved = resolveRes.ok ? await resolveRes.json() : null;
                resolvedItem = resolved?.data?.[0];
            }
        }

        if (!resolvedItem) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const productId = resolvedItem.id; // numeric id
        const currentAttributes: Record<string, unknown> = resolvedItem.attributes || {};
        const payload: { data: Record<string, unknown> } = {
            data: {
                title: formData.get("title"),
                slug: formData.get("slug"),
                description: formData.get("description"),
                shortDescription: formData.get("shortDescription") || null,
                price: Number(formData.get("price")),
            },
        };

        // Category relation: resolve numeric id from documentId (use REST v5 set syntax)
        const categoryDocumentId = formData.get("categoryId") as string | null;
        if (categoryDocumentId) {
            try {
                const resolveCatUrl = `${strapiUrl}/api/categories?filters[documentId][$eq]=${categoryDocumentId}`;
                const catRes = await fetch(resolveCatUrl, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
                if (catRes.ok) {
                    const catJson = await catRes.json();
                    const cat = catJson?.data?.[0];
                    if (cat?.id) {
                        payload.data.category = { set: cat.id };
                    } else {
                        console.warn("⚠️ Category not found by documentId, skipping category update", categoryDocumentId);
                    }
                } else {
                    console.warn("⚠️ Category resolve failed:", catRes.status);
                }
            } catch (err) {
                console.warn("⚠️ Category resolve error:", err);
            }
        }

        // Preserve publishedAt (keep published status). If it's already published, keep as-is
        if (currentAttributes.publishedAt) {
            payload.data.publishedAt = currentAttributes.publishedAt;
        }

        // Always include images in payload to ensure the field is properly set
        // If no new images uploaded, keep existing ones; if new ones uploaded, replace them
        if (uploadedImageIds.length > 0) {
            // Strapi v5 REST relation update uses set
            payload.data.images = { set: uploadedImageIds };
        } else {
            // If no new images, we need to preserve existing ones
            // Get current product to preserve existing images
            try {
                const currentProductRes = await fetch(`${strapiUrl}/api/products/${productId}?populate=images`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (currentProductRes.ok) {
                    const currentProduct = await currentProductRes.json();
                    if (currentProduct.data?.attributes?.images?.data) {
                        const existingImageIds = currentProduct.data.attributes.images.data.map((img: { id: number }) => img.id);
                        payload.data.images = { set: existingImageIds };
                    }
                }
            } catch (error) {
                console.error("Failed to fetch current product for image preservation:", error);
            }
        }

        const updateRes = await fetch(`${strapiUrl}/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        let json: unknown = null;
        try {
            json = await updateRes.json();
        } catch (err) {
            const txt = await updateRes.text().catch(() => "");
            console.error("❌ Update response not JSON:", txt);
            return NextResponse.json({ error: "Update failed (non-JSON)", details: txt }, { status: updateRes.status });
        }
        if (!updateRes.ok) {

            // GraphQL fallback for Strapi v5
            const mutation = `
              mutation UpdateProduct($documentId: ID!, $data: ProductInput!) {
                updateProduct(documentId: $documentId, data: $data) {
                  documentId
                  title
                  slug
                  price
                  images { url }
                  category { documentId }
                }
              }
            `;

            // Build GraphQL-friendly data (Strapi v5 GraphQL expects scalar IDs)
            const gqlData: Record<string, unknown> = {
                title: payload.data.title,
                slug: payload.data.slug,
                description: payload.data.description,
                shortDescription: payload.data.shortDescription,
                price: payload.data.price,
            };

            // Category can be number or { set: number }
            if (payload.data.category) {
                const catId = typeof payload.data.category === 'object' && 'set' in (payload.data.category as { set?: number })
                    ? (payload.data.category as { set?: number }).set
                    : payload.data.category;
                gqlData.category = catId;
            }

            // Images can be number[] or { set: number[] }
            if (payload.data.images) {
                const imgIds = typeof payload.data.images === 'object' && 'set' in (payload.data.images as { set?: number[] })
                    ? (payload.data.images as { set?: number[] }).set as number[]
                    : (payload.data.images as unknown as number[]);
                gqlData.images = imgIds;
            }

            const gqlRes = await fetch(`${strapiUrl}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ query: mutation, variables: { documentId: productDocumentId, data: gqlData } }),
            });

            const gqlJson: { data?: { updateProduct?: unknown }; errors?: unknown } = await gqlRes.json();
            if (!gqlRes.ok || gqlJson.errors) {
                return NextResponse.json({ error: "Update failed", details: json, graphql: gqlJson }, { status: updateRes.status });
            }
            return NextResponse.json(gqlJson.data?.updateProduct ?? { success: true });
        }
        return NextResponse.json(json);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const productDocumentId = resolvedParams.id;

        const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL;
        const token = process.env.STRAPI_API_TOKEN as string;
        if (!strapiUrl || !token) {
            return NextResponse.json({ error: "Missing Strapi env vars" }, { status: 500 });
        }

        // Resolve numeric id first
        const resolveRes = await fetch(`${strapiUrl}/api/products?filters[documentId][$eq]=${productDocumentId}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (!resolveRes.ok) {
            const t = await resolveRes.text();
            return NextResponse.json({ error: "Resolve failed", details: t }, { status: resolveRes.status });
        }
        const resolved = await resolveRes.json();
        const resolvedItem = resolved?.data?.[0];
        if (!resolvedItem) {
            return NextResponse.json({ error: "Product not found by documentId" }, { status: 404 });
        }
        const productId = resolvedItem.id;

        const deleteRes = await fetch(`${strapiUrl}/api/products/${productId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!deleteRes.ok) {
            const json = await deleteRes.json();
            return NextResponse.json({ error: "Delete failed", details: json }, { status: deleteRes.status });
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
