import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
};

function calculateShippingUSD(items: CartItem[]): number {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const freeShippingThreshold = 100;
    const baseShipping = 10;
    return items.length === 0 || subtotal >= freeShippingThreshold ? 0 : baseShipping;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            name,
            email,
            phone,
            notes,
            items,
            delivery,
        }: {
            name: string;
            email: string;
            phone?: string;
            notes?: string;
            items: CartItem[];
            delivery: { address: string; city: string; postalCode: string; country: string };
        } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
        }

        const stripe = new Stripe(secretKey, { apiVersion: "2025-08-27.basil" });

        const origin = (req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
            quantity: item.quantity,
            price_data: {
                currency: "usd",
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.name,
                    images: item.imageUrl ? [item.imageUrl] : undefined,
                    metadata: { id: item.id },
                },
            },
        }));

        const shippingCost = calculateShippingUSD(items);
        if (shippingCost > 0) {
            lineItems.push({
                quantity: 1,
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(shippingCost * 100),
                    product_data: { name: "Shipping" },
                },
            });
        }

        const metadata: Record<string, string> = {
            name: name || "",
            email: email || "",
            phone: phone || "",
            notes: notes || "",
            delivery: JSON.stringify(delivery || {}),
        };

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            customer_email: email,
            line_items: lineItems,
            success_url: `${origin}/cart?success=1&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart?canceled=1`,
            allow_promotion_codes: true,
            metadata,
        });

        return NextResponse.json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe checkout error", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}



