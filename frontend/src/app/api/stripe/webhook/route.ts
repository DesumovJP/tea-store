import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!secret || !key) {
        return NextResponse.json({ error: "Missing Stripe secrets" }, { status: 500 });
    }

    const stripe = new Stripe(key, { apiVersion: "2025-08-27.basil" });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const buf = await req.arrayBuffer();
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(Buffer.from(buf), signature, secret);
    } catch (err) {
        return NextResponse.json({ error: `Webhook Error: ${(err as Error).message}` }, { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            const items = lineItems.data
                .filter((li) => li.price?.product && li.description !== "Shipping")
                .map((li) => ({
                    name: li.description || "Item",
                    quantity: li.quantity || 1,
                    price: ((li.amount_total || 0) / (li.quantity || 1)) / 100,
                }));

            const total = (lineItems.data.reduce((sum, li) => sum + (li.amount_total || 0), 0) / 100);

            const meta = session.metadata || {};

            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/api/order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: meta.name,
                    email: session.customer_email,
                    phone: meta.phone,
                    notes: meta.notes,
                    items,
                    total,
                    delivery: JSON.parse(meta.delivery || "{}"),
                    payment: { method: "card_online" },
                }),
            });
        }
    } catch (e) {
        console.error("Webhook handling error", e);
        return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
}



