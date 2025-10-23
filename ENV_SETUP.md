# Налаштування .env файлу

## Створіть файл .env в корені проекту з наступним вмістом:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=ваш_токен_бота_тут
TELEGRAM_CHAT_ID=ваш_chat_id_тут

# WebSocket Server Configuration
WEBSOCKET_PORT=3001

# Next.js Configuration
NEXT_PUBLIC_CMS_URL=http://localhost:1337
```

## Як отримати токен бота:
1. Відкрийте Telegram
2. Знайдіть @BotFather
3. Надішліть /newbot
4. Введіть назву бота
5. Введіть username бота
6. Скопіюйте токен

## Як отримати Chat ID:
1. Надішліть будь-яке повідомлення вашому боту
2. Відкрийте в браузері: https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
3. Знайдіть "chat":{"id":123456789} - це ваш Chat ID
