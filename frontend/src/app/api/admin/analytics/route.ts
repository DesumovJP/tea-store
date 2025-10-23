import { NextResponse } from "next/server";

export async function GET() {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL;
    const token = process.env.STRAPI_API_TOKEN as string;
    if (!strapiUrl || !token) {
      return NextResponse.json({ success: false, error: 'Missing Strapi env vars' }, { status: 500 });
    }

    // Count orders via GraphQL
    const query = `
      query { orders { documentId } }
    `;
    const res = await fetch(`${strapiUrl}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });
    const json = await res.json();
    const orders = json?.data?.orders?.length ?? 0;

    return NextResponse.json({ success: true, stats: { orders } });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


