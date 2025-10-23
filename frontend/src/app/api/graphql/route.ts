import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendOrderVariables = {
    name: string;
    email: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
};

export async function POST(req: Request) {
    const { query, variables } = await req.json() as { query: string; variables: SendOrderVariables };

    if (query.includes("sendOrder")) {
        const { name, email, items, total } = variables;

        const itemList = items
            .map((i) => `• ${i.name} × ${i.quantity} — $${i.price * i.quantity}`)
            .join("\n");

        try {
            await resend.emails.send({
                from: "orders@gurutea.com",
                to: process.env.ADMIN_EMAIL!,
                subject: "Нове замовлення на GURU TEA",
                text: `
Нове замовлення:

Ім'я: ${name}
Email: ${email}

Товари:
${itemList}

Загальна сума: $${total}
        `,
            });

            return NextResponse.json({ data: { success: true } });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            return NextResponse.json({ errors: [message] }, { status: 500 });
        }
    }

    return NextResponse.json({ errors: ["Unknown query"] }, { status: 400 });
}
