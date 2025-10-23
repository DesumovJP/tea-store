import { NextRequest } from 'next/server';

// Простий in-memory store для WebSocket з'єднань
const connections = new Map<string, WebSocket>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return new Response('Chat ID required', { status: 400 });
  }

  // Створюємо WebSocket з'єднання
  const upgradeHeader = request.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 426 });
  }

  const webSocket = new WebSocket('ws://localhost:3001/ws');
  
  // Зберігаємо з'єднання
  connections.set(chatId, webSocket);

  webSocket.onopen = () => {
    console.log(`WebSocket connected for chat: ${chatId}`);
  };

  webSocket.onmessage = (event) => {
    // Тут буде логіка для обробки повідомлень від Telegram бота
    console.log('Message from Telegram bot:', event.data);
  };

  webSocket.onclose = () => {
    console.log(`WebSocket disconnected for chat: ${chatId}`);
    connections.delete(chatId);
  };

  webSocket.onerror = (error) => {
    console.error(`WebSocket error for chat ${chatId}:`, error);
    connections.delete(chatId);
  };

  return new Response(null, {
    status: 101,
    headers: {
      'Upgrade': 'websocket',
      'Connection': 'Upgrade',
    },
  });
}

// Функція для відправки повідомлення конкретному користувачу
export function sendMessageToUser(chatId: string, message: string) {
  const connection = connections.get(chatId);
  if (connection && connection.readyState === WebSocket.OPEN) {
    connection.send(JSON.stringify({
      type: 'admin_message',
      message: message,
      timestamp: new Date().toISOString()
    }));
  }
}
