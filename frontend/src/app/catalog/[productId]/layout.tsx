import { fetchProductBySlug } from "@/lib/graphql";
import type { Metadata } from "next";

// Next.js 15: dynamic route params are async in generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    const { productId } = await params;
    const product = productId ? await fetchProductBySlug(productId) : null;
    const title = product?.title ? `guru tea - ${product.title}` : "guru tea - product";
    return { title };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children as React.ReactElement;
}


