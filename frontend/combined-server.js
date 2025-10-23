require('dotenv').config({ path: '.env.local' });
const WebSocket = require('ws');
const http = require('http');
const TelegramBot = require('node-telegram-bot-api');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3001;

if (!TELEGRAM_BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

console.log('🚀 Запуск комбінованого сервера...\n');

// Зберігаємо активні з'єднання
const connections = new Map();

// Функція для відправки повідомлення конкретному користувачу
function sendMessageToUser(chatId, message) {
  console.log(`🔍 Пошук з'єднання для Chat ID: ${chatId}`);
  console.log(`📊 Активні з'єднання: ${connections.size}`);
  console.log(`📋 Список активних Chat ID: ${Array.from(connections.keys()).join(', ')}`);
  
  const connection = connections.get(chatId);
  if (connection) {
    console.log(`✅ Знайдено з'єднання для ${chatId}, стан: ${connection.readyState}`);
    if (connection.readyState === WebSocket.OPEN) {
      const messageData = {
        type: 'admin_message',
        message: message,
        timestamp: new Date().toISOString()
      };
      console.log(`📤 Відправляю повідомлення:`, messageData);
      connection.send(JSON.stringify(messageData));
      return true;
    } else {
      console.log(`❌ З'єднання для ${chatId} не відкрите, стан: ${connection.readyState}`);
    }
  } else {
    console.log(`❌ З'єднання для ${chatId} не знайдено`);
  }
  return false;
}

// Створюємо HTTP сервер
const server = http.createServer();

// Створюємо WebSocket сервер
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const chatId = url.searchParams.get('chatId');
  
  if (!chatId) {
    ws.close(1008, 'Chat ID required');
    return;
  }

  console.log(`📡 New WebSocket connection for chat: ${chatId}`);
  
  // Зберігаємо з'єднання
  connections.set(chatId, ws);
  console.log(`✅ Додано з'єднання для ${chatId}. Всього з'єднань: ${connections.size}`);

  // Відправляємо підтвердження підключення
  ws.send(JSON.stringify({
    type: 'connected',
    chatId: chatId,
    timestamp: new Date().toISOString()
  }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`📨 Message from chat ${chatId}:`, message);
      
      if (message.type === 'ping') {
        ws.send(JSON.stringify({
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`❌ WebSocket connection closed for chat: ${chatId}`);
    connections.delete(chatId);
    console.log(`📊 Всього з'єднань: ${connections.size}`);
  });

  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for chat ${chatId}:`, error);
    connections.delete(chatId);
    console.log(`📊 Всього з'єднань: ${connections.size}`);
  });
});

// Створюємо Telegram бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  console.log(`📨 Отримано повідомлення від ${chatId}: ${messageText}`);

  // Перевіряємо, чи це повідомлення від адміна
  if (chatId.toString() !== TELEGRAM_CHAT_ID) {
    console.log(`❌ Повідомлення не від адміна. Очікував: ${TELEGRAM_CHAT_ID}, отримав: ${chatId}`);
    return;
  }

  // Перевіряємо, чи це відповідь на повідомлення користувача
  if (msg.reply_to_message) {
    const replyText = msg.reply_to_message.text;
    console.log(`🔄 Це відповідь на повідомлення: ${replyText}`);
    
    // Витягуємо Chat ID з оригінального повідомлення
    const chatIdMatch = replyText.match(/🆔 Chat ID: (.+)/);
    if (chatIdMatch) {
      const userChatId = chatIdMatch[1];
      console.log(`🎯 Знайдено Chat ID користувача: ${userChatId}`);
      
      // Відправляємо відповідь користувачу через WebSocket
      console.log(`📤 Спроба відправити повідомлення користувачу ${userChatId}: ${messageText}`);
      const success = sendMessageToUser(userChatId, messageText);
      
      if (success) {
        console.log(`✅ Відповідь успішно відправлена користувачу ${userChatId}`);
        bot.sendMessage(chatId, `✅ Відповідь відправлена користувачу ${userChatId}`);
      } else {
        console.log(`❌ Не вдалося відправити відповідь користувачу ${userChatId}`);
        bot.sendMessage(chatId, `❌ Користувач ${userChatId} не онлайн або WebSocket сервер не працює`);
      }
    } else {
      console.log(`❌ Не вдалося знайти Chat ID в повідомленні: ${replyText}`);
      bot.sendMessage(chatId, '❌ Не вдалося знайти Chat ID в повідомленні');
    }
  } else {
    console.log(`💬 Отримано звичайне повідомлення (не reply)`);
    // Якщо це не відповідь, показуємо інструкції
    bot.sendMessage(chatId, `
🤖 Бот зворотного зв'язку активний!

📝 Для відповіді користувачу:
1. Натисніть "Reply" на повідомлення користувача
2. Напишіть вашу відповідь
3. Відповідь буде відправлена користувачу на сайт

💡 Порада: Користувачі отримають відповідь тільки якщо вони онлайн на сайті.

🔍 Статус WebSocket сервера: ${connections.size > 0 ? '🟢 Активні з\'єднання: ' + connections.size : '🔴 Немає активних з\'єднань'}
    `);
  }
});

// Обробляємо помилки
bot.on('error', (error) => {
  console.error('❌ Telegram bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Telegram bot polling error:', error);
});

// Запускаємо сервер
server.listen(WEBSOCKET_PORT, () => {
  console.log(`📡 WebSocket server running on port ${WEBSOCKET_PORT}`);
  console.log(`🤖 Telegram bot started...`);
  console.log(`\n✅ Всі сервіси запущені!`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`📡 WebSocket: ws://localhost:${WEBSOCKET_PORT}`);
  console.log(`🤖 Telegram bot: активний`);
});
