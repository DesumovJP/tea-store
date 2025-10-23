import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL;
        const token = process.env.STRAPI_API_TOKEN as string;
        
        if (process.env.NODE_ENV !== 'production') {
            console.log("🔍 Environment check:");
            console.log("- Strapi URL:", strapiUrl);
            console.log("- Token exists:", !!token);
        }
        
        if (!strapiUrl || !token) {
            console.error("❌ Missing environment variables");
            return NextResponse.json({ 
                error: "Missing Strapi env vars",
                details: {
                    strapiUrl: !!strapiUrl,
                    token: !!token
                }
            }, { status: 500 });
        }

        // 1) Handle multiple image uploads
        const uploadedImageIds: number[] = [];
        const files = formData.getAll("images") as File[];
        
        if (process.env.NODE_ENV !== 'production') {
            console.log("📁 Multiple file upload check:");
            console.log("- Files count:", files.length);
            console.log("- Files:", files.map(f => ({ name: f.name, size: f.size, type: f.type })));
        }
        
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
                
                if (process.env.NODE_ENV !== 'production') {
                    console.log(`✅ File validation passed for: ${file.name}`);
                    console.log(`🚀 Starting upload for: ${file.name}`);
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
                
                if (process.env.NODE_ENV !== 'production') console.log(`📥 Upload response for ${file.name}:`, uploadRes.status);
                
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
                
                const uploaded: Array<{ id: number }> = await uploadRes.json();
                if (process.env.NODE_ENV !== 'production') console.log(`✅ Upload successful for ${file.name}:`, uploaded);
                const imageId = uploaded?.[0]?.id;
                if (imageId) {
                    uploadedImageIds.push(imageId);
                    if (process.env.NODE_ENV !== 'production') console.log(`🆔 Uploaded image ID for ${file.name}:`, imageId);
                }
            }
        }
        
        if (process.env.NODE_ENV !== 'production') console.log("📋 All uploaded image IDs:", uploadedImageIds);

        // 2) Create product entry
        const payload = {
            data: {
                title: formData.get("title"),
                slug: formData.get("slug"),
                description: formData.get("description"),
                shortDescription: formData.get("shortDescription") || null,
                price: Number(formData.get("price")),
                category: formData.get("categoryId") || null,
                images: uploadedImageIds, // Use array of uploaded image IDs
            },
        };

        // Log if files were provided but upload failed
        if (files.length > 0 && uploadedImageIds.length === 0) {
            console.log("⚠️ Files were provided but upload failed, creating product without images");
        }

        if (process.env.NODE_ENV !== 'production') console.log("📦 Creating product with payload:", payload);

        const createRes = await fetch(`${strapiUrl}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (process.env.NODE_ENV !== 'production') console.log("📥 Product creation response status:", createRes.status);

        const json = await createRes.json();
        if (!createRes.ok) {
            console.error("❌ Product creation failed:", json);
            return NextResponse.json({ 
                error: "Create failed", 
                details: json,
                status: createRes.status,
                url: `${strapiUrl}/api/products`
            }, { status: createRes.status });
        }

        if (process.env.NODE_ENV !== 'production') console.log("✅ Product created successfully:", json);
        return NextResponse.json(json);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


