import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	const body = await req.json();
	const { name, email, phone, notes, items, total, delivery, payment } = body;

	// Генеруємо унікальний номер замовлення
	const orderNumber = `GT-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

	const itemList = (items as Array<{ name: string; quantity: number; price: number }>)
		.map((i) => `• ${i.name} × ${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`)
		.join("\n");

	const deliveryText = (() => {
		if (!delivery) return "";
		if (delivery.method === "courier") {
			const address = [delivery.city, delivery.street, `буд. ${delivery.house}`, delivery.apartment ? `кв. ${delivery.apartment}` : null]
				.filter(Boolean)
				.join(", ");
			return `Доставка: Кур'єр\nАдреса: ${address}`;
		}
		if (delivery.method === "nova_poshta") {
			return `Доставка: Нова Пошта (відділення)\nМісто: ${delivery.city}\nВідділення: ${delivery.npBranch}`;
		}
		return "";
	})();

	const paymentText = (() => {
		if (!payment) return "";
		if (payment.method === "card_online") {
			const masked = payment.cardNumber ? String(payment.cardNumber).replace(/\s+/g, "").slice(-4) : "****";
			return `Оплата: Онлайн карткою (**** **** **** ${masked})`;
		}
		if (payment.method === "card_on_delivery") return "Оплата: Карткою при отриманні";
		if (payment.method === "cash") return "Оплата: Готівка";
		return "";
	})();

	// HTML шаблон для email
	const htmlTemplate = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<title>Нове замовлення - GURU TEA</title>
			<style>
				body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
				.container { max-width: 600px; margin: 0 auto; padding: 20px; }
				.header { background: #2C2C2C; color: white; padding: 20px; text-align: center; }
				.content { background: #f9f9f9; padding: 20px; }
				.order-info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2C2C2C; }
				.items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
				.items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
				.items-table th { background: #f5f5f5; }
				.total { font-size: 18px; font-weight: bold; color: #2C2C2C; }
				.footer { background: #2C2C2C; color: white; padding: 15px; text-align: center; font-size: 12px; }
			</style>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>🍵 GURU TEA</h1>
					<h2>Нове замовлення #${orderNumber}</h2>
				</div>
				
				<div class="content">
					<div class="order-info">
						<h3>📋 Інформація про замовлення</h3>
						<p><strong>Номер замовлення:</strong> ${orderNumber}</p>
						<p><strong>Дата:</strong> ${new Date().toLocaleString('uk-UA')}</p>
					</div>

					<div class="order-info">
						<h3>👤 Контактні дані</h3>
						<p><strong>Ім'я:</strong> ${name}</p>
						<p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || "-"}</p>
                        ${notes ? `<p><strong>Comment:</strong> ${notes}</p>` : ""}
					</div>

					<div class="order-info">
						<h3>🚚 Доставка</h3>
						${deliveryText.split('\n').map(line => `<p>${line}</p>`).join('')}
					</div>

					<div class="order-info">
						<h3>💳 Оплата</h3>
						<p>${paymentText}</p>
					</div>

					<div class="order-info">
						<h3>🛍️ Товари</h3>
						<table class="items-table">
							<thead>
								<tr>
									<th>Товар</th>
									<th>Кількість</th>
									<th>Ціна</th>
									<th>Сума</th>
								</tr>
							</thead>
							<tbody>
				${(items as Array<{ name: string; quantity: number; price: number }>).map((item) => `
									<tr>
										<td>${item.name}</td>
										<td>${item.quantity}</td>
										<td>$${item.price.toFixed(2)}</td>
										<td>$${(item.price * item.quantity).toFixed(2)}</td>
									</tr>
								`).join('')}
							</tbody>
						</table>
						<div class="total" style="text-align: right; margin-top: 15px;">
							Загальна сума: $${total.toFixed(2)}
						</div>
					</div>
				</div>

				<div class="footer">
					<p>GURU TEA - Високоякісний чай з усього світу</p>
					<p>Це автоматичне повідомлення, будь ласка, не відповідайте на нього</p>
				</div>
			</div>
		</body>
		</html>
	`;

	// Текстова версія email
	const textTemplate = `
Нове замовлення #${orderNumber}

📋 ІНФОРМАЦІЯ ПРО ЗАМОВЛЕННЯ
Номер замовлення: ${orderNumber}
Дата: ${new Date().toLocaleString('uk-UA')}

👤 КОНТАКТНІ ДАНІ
Ім'я: ${name}
Email: ${email}
Phone: ${phone || "-"}
${notes ? `Comment: ${notes}\n` : ""}

🚚 ДОСТАВКА
${deliveryText}

💳 ОПЛАТА
${paymentText}

🛍️ ТОВАРИ
${itemList}

💰 ЗАГАЛЬНА СУМА: $${total.toFixed(2)}

---
GURU TEA - Високоякісний чай з усього світу
Це автоматичне повідомлення, будь ласка, не відповідайте на нього
	`;

	try {
		// Визначаємо from адресу в залежності від середовища
		const fromEmail = process.env.NODE_ENV === 'production' 
			? "orders@gurutea.com" 
			: "onboarding@resend.dev";

		// Відправляємо email адміністратору
		await resend.emails.send({
			from: fromEmail,
			to: process.env.ADMIN_EMAIL || "admin@gurutea.com",
			subject: `🍵 Нове замовлення #${orderNumber} - GURU TEA`,
			html: htmlTemplate,
			text: textTemplate,
		});

        // Send confirmation to the client
		const clientHtmlTemplate = `
			<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<title>Підтвердження замовлення - GURU TEA</title>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: #2C2C2C; color: white; padding: 20px; text-align: center; }
					.content { background: #f9f9f9; padding: 20px; }
					.order-info { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2C2C2C; }
					.items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
					.items-table th, .items-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
					.items-table th { background: #f5f5f5; }
					.total { font-size: 18px; font-weight: bold; color: #2C2C2C; }
					.footer { background: #2C2C2C; color: white; padding: 15px; text-align: center; font-size: 12px; }
					.thank-you { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🍵 GURU TEA</h1>
						<h2>Дякуємо за ваше замовлення!</h2>
					</div>
					
					<div class="content">
						<div class="thank-you">
							<h3>✅ Замовлення прийнято!</h3>
							<p>Ваше замовлення #${orderNumber} успішно прийнято та обробляється. Ми зв'яжемося з вами найближчим часом для підтвердження деталей доставки.</p>
						</div>

						<div class="order-info">
							<h3>📋 Деталі замовлення</h3>
							<p><strong>Номер замовлення:</strong> ${orderNumber}</p>
							<p><strong>Дата:</strong> ${new Date().toLocaleString('uk-UA')}</p>
						</div>

						<div class="order-info">
							<h3>🛍️ Ваші товари</h3>
							<table class="items-table">
								<thead>
									<tr>
										<th>Товар</th>
										<th>Кількість</th>
										<th>Ціна</th>
										<th>Сума</th>
									</tr>
								</thead>
								<tbody>
				${(items as Array<{ name: string; quantity: number; price: number }>).map((item) => `
										<tr>
											<td>${item.name}</td>
											<td>${item.quantity}</td>
											<td>$${item.price.toFixed(2)}</td>
											<td>$${(item.price * item.quantity).toFixed(2)}</td>
										</tr>
									`).join('')}
								</tbody>
							</table>
							<div class="total" style="text-align: right; margin-top: 15px;">
								Загальна сума: $${total.toFixed(2)}
							</div>
						</div>

						<div class="order-info">
							<h3>📞 Контакти</h3>
							<p>Якщо у вас є питання щодо замовлення, будь ласка, зв'яжіться з нами:</p>
							<p>📧 Email: info@gurutea.com</p>
							<p>📱 Телефон: +380 (XX) XXX-XX-XX</p>
						</div>
					</div>

					<div class="footer">
						<p>GURU TEA - Високоякісний чай з усього світу</p>
						<p>Дякуємо, що обрали нас! 🙏</p>
					</div>
				</div>
			</body>
			</html>
		`;

		const clientTextTemplate = `
Дякуємо за ваше замовлення!

✅ ЗАМОВЛЕННЯ ПРИЙНЯТО!
Ваше замовлення #${orderNumber} успішно прийнято та обробляється. Ми зв'яжемося з вами найближчим часом для підтвердження деталей доставки.

📋 ДЕТАЛІ ЗАМОВЛЕННЯ
Номер замовлення: ${orderNumber}
Дата: ${new Date().toLocaleString('uk-UA')}

🛍️ ВАШІ ТОВАРИ
${itemList}

💰 ЗАГАЛЬНА СУМА: $${total.toFixed(2)}

📞 КОНТАКТИ
Якщо у вас є питання щодо замовлення, будь ласка, зв'яжіться з нами:
📧 Email: info@gurutea.com
📱 Телефон: +380 (XX) XXX-XX-XX

---
GURU TEA - Високоякісний чай з усього світу
Дякуємо, що обрали нас! 🙏
		`;

		await resend.emails.send({
			from: fromEmail,
			to: email,
			subject: `✅ Підтвердження замовлення #${orderNumber} - GURU TEA`,
			html: clientHtmlTemplate,
			text: clientTextTemplate,
		});

        console.log(`✅ Замовлення #${orderNumber} успішно відправлено на email`);

        // Persist order in Strapi (GraphQL) for analytics
        try {
            const createMutation = `
              mutation CreateOrder($data: OrderInput!) {
                createOrder(data: $data) { documentId }
              }
            `;
            const strapiUrl = process.env.NEXT_PUBLIC_CMS_URL;
            const token = process.env.STRAPI_API_TOKEN as string;
            if (strapiUrl && token) {
                await fetch(`${strapiUrl}/graphql`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: createMutation,
                        variables: {
                            data: {
                                orderNumber,
                                email,
                                name,
                                total: Math.round(total),
                                items,
                                meta: { delivery, payment },
                            },
                        },
                    }),
                });
            }
        } catch (e) {
            // non-blocking
        }
		return NextResponse.json({ 
			success: true, 
			orderNumber: orderNumber,
			message: "Замовлення успішно відправлено на email"
		});
	} catch (error) {
		console.error("❌ Помилка надсилання email:", error);
		return NextResponse.json({ 
			success: false, 
			error: "Помилка надсилання email. Спробуйте ще раз або зв'яжіться з нами безпосередньо." 
		}, { status: 500 });
	}
}
