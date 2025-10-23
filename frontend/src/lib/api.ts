export async function getProducts() {
    const url = `${process.env.NEXT_PUBLIC_CMS_URL}/api/products?populate=*`;

    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    return res.json();
}