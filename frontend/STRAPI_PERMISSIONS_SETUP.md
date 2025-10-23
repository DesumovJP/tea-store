# 🔐 Налаштування дозволів в Strapi

## Проблема
Отримуєте помилку 500 при завантаженні файлів через адмінку. Це зазвичай пов'язано з неправильними налаштуваннями дозволів в Strapi.

## Крок 1: Перевірка дозволів для Upload

1. **Відкрийте Strapi Admin Panel:**
   - Перейдіть на `http://localhost:1337/admin`
   - Увійдіть в систему

2. **Налаштування дозволів для Upload:**
   - Перейдіть в **Settings** → **Users & Permissions Plugin** → **Roles**
   - Виберіть роль **Public** (або **Authenticated** якщо використовуєте авторизацію)
   - Знайдіть секцію **Upload**
   - Увімкніть дозволи:
     - ✅ **find** (GET /api/upload/files)
     - ✅ **findOne** (GET /api/upload/files/:id)
     - ✅ **upload** (POST /api/upload)
     - ✅ **destroy** (DELETE /api/upload/files/:id)

## Крок 2: Налаштування дозволів для Product

1. **В тому ж розділі Roles:**
   - Знайдіть секцію **Product**
   - Увімкніть дозволи:
     - ✅ **find** (GET /api/products)
     - ✅ **findOne** (GET /api/products/:id)
     - ✅ **create** (POST /api/products)
     - ✅ **update** (PUT /api/products/:id)
     - ✅ **delete** (DELETE /api/products/:id)

## Крок 3: Налаштування дозволів для Category

1. **В тому ж розділі Roles:**
   - Знайдіть секцію **Category**
   - Увімкніть дозволи:
     - ✅ **find** (GET /api/categories)
     - ✅ **findOne** (GET /api/categories/:id)
     - ✅ **create** (POST /api/categories)
     - ✅ **update** (PUT /api/categories/:id)
     - ✅ **delete** (DELETE /api/categories/:id)

## Крок 4: Перевірка API Token

1. **Створення API Token:**
   - Перейдіть в **Settings** → **API Tokens**
   - Натисніть **Create new API Token**
   - Назва: `Admin API Token`
   - Опис: `Token for admin operations`
   - Token duration: `Unlimited`
   - Token type: `Full access` (або `Custom` з усіма дозволами)

2. **Скопіюйте токен** та додайте в `.env.local`:
   ```env
   STRAPI_API_TOKEN=your_token_here
   ```

## Крок 5: Альтернативне рішення (якщо не працює)

Якщо проблема залишається, спробуйте:

### Варіант A: Використання Public дозволів
1. В **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**
2. Увімкніть **всі дозволи** для Upload, Product, Category

### Варіант B: Створення користувача
1. **Settings** → **Administration Panel** → **Users**
2. Створіть нового користувача з правами **Super Admin**
3. Використовуйте цього користувача для API запитів

## Крок 6: Перевірка CORS (якщо потрібно)

1. **Settings** → **Security**
2. Переконайтеся, що CORS налаштований правильно:
   ```json
   {
     "enabled": true,
     "headers": "*",
     "origin": ["http://localhost:3000", "http://localhost:1337"]
   }
   ```

## Крок 7: Тестування

Після налаштування:

1. **Перезапустіть Strapi:**
   ```bash
   cd cms
   npm run develop
   ```

2. **Перезапустіть Next.js:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Спробуйте створити продукт** через адмінку

## Діагностика помилок

Якщо все ще є проблеми, перевірте:

1. **Консоль браузера** - чи є помилки JavaScript
2. **Консоль Strapi** - чи є помилки на сервері
3. **Network tab** - який саме запит падає з помилкою

## Типові помилки та рішення

### "Forbidden" (403)
- ❌ Проблема: Немає дозволів
- ✅ Рішення: Увімкніть дозволи в Strapi

### "Unauthorized" (401)
- ❌ Проблема: Неправильний токен
- ✅ Рішення: Перевірте STRAPI_API_TOKEN

### "Not Found" (404)
- ❌ Проблема: Неправильний URL або API не існує
- ✅ Рішення: Перевірте NEXT_PUBLIC_CMS_URL

### "Internal Server Error" (500)
- ❌ Проблема: Помилка на сервері Strapi
- ✅ Рішення: Перевірте логи Strapi та дозволи
