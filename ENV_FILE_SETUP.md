# Налаштування .env.local файлу

## Проблема
Отримуєте помилку 401 "Missing or invalid credentials" при спробі схвалити відгук.

## Причина
Відсутній файл `.env.local` з API токеном Strapi.

## Рішення

### 1. Створіть файл `.env.local` в папці `frontend/`

Створіть файл `frontend/.env.local` з наступним вмістом:

```env
# Strapi Configuration
NEXT_PUBLIC_CMS_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 2. Отримайте API токен з Strapi

#### Варіант A: Використовуйте існуючий токен
1. Відкрийте Strapi Admin Panel: `http://localhost:1337/admin`
2. **Settings** → **API Tokens**
3. Скопіюйте існуючий токен

#### Варіант B: Створіть новий токен
1. **Settings** → **API Tokens** → **Create new token**
2. **Name**: "Admin Token"
3. **Description**: "Token for admin operations"
4. **Token duration**: "Unlimited"
5. **Token type**: "Full access"
6. Скопіюйте згенерований токен

### 3. Оновіть .env.local файл

Замініть `your_strapi_api_token_here` на ваш реальний токен:

```env
STRAPI_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Перезапустіть Next.js

```bash
cd frontend
yarn dev
```

## Перевірка

Після налаштування:
1. Спробуйте схвалити відгук в адмін панелі
2. Перевірте консоль браузера (F12) - має з'явитися лог "Using API token: Present"
3. Помилка 401 має зникнути

## Альтернативне рішення

Якщо не хочете створювати .env.local файл, можете додати токен безпосередньо в код:

```typescript
// В frontend/src/app/admin/page.tsx
const API_TOKEN = 'your_token_here';

// Замініть
'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
// На
'Authorization': `Bearer ${API_TOKEN}`,
```

**⚠️ УВАГА: Не комітьте токен в код! Використовуйте .env.local файл для безпеки.**

