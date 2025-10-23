import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    let name: string = '';
    let email: string = '';
    let message: string = '';
    let chatId: string = '';

    // Спробуємо прочитати як form-data (для надсилання зображень)
    let file: File | null = null;
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('multipart/form-data')) {
        const form = await request.formData();
        name = String(form.get('name') || '');
        email = String(form.get('email') || '');
        message = String(form.get('message') || '');
        chatId = String(form.get('chatId') || '');
        const maybeFile = form.get('image');
        if (maybeFile && maybeFile instanceof File) {
          file = maybeFile as File;
        }
      } else {
        const json = await request.json();
        name = json.name || '';
        email = json.email || '';
        message = json.message || '';
        chatId = json.chatId || '';
      }
    } catch {}

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: 'Telegram bot not configured' },
        { status: 500 }
      );
    }

    // Форматуємо повідомлення для Telegram
    const telegramMessage = `
🆕 Нове повідомлення з сайту

👤 Ім'я: ${name}
📧 Email: ${email}
💬 Повідомлення: ${message}
🆔 Chat ID: ${chatId}

---
Відповідь на це повідомлення буде відправлена користувачу на сайт.
    `.trim();

    let telegramResponse: Response;
    if (file) {
      // Якщо є зображення — спочатку відправляємо фото
      const fd = new FormData();
      fd.append('chat_id', TELEGRAM_CHAT_ID!);
      fd.append('photo', file);
      fd.append('caption', telegramMessage);
      telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: fd,
      });
    } else {
      // Інакше — звичайне текстове повідомлення
      telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'HTML',
        }),
      });
    }

    if (!telegramResponse.ok) {
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
