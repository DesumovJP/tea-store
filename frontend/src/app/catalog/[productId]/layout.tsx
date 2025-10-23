import { fetchProductBySlug } from "@/lib/graphql";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const slug = params?.productId;
    const product = slug ? await fetchProductBySlug(slug) : null;
    const title = product?.title ? `guru tea - ${product.title}` : "guru tea - product";
    return { title };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return children as React.ReactElement;
}


