# 🖼️ Діагностика проблем з завантаженням зображень

## Проблема
Продукти створюються успішно з існуючими зображеннями, але не вдається завантажити нові зображення.

## Крок 1: Перевірка валідації файлів

### Підтримувані типи файлів:
- ✅ **JPEG** (.jpg, .jpeg)
- ✅ **PNG** (.png)
- ✅ **GIF** (.gif)
- ✅ **WebP** (.webp)

### Ліміти:
- ✅ **Максимальний розмір:** 10MB
- ✅ **Мінімальний розмір:** 1 byte

## Крок 2: Діагностика через консоль браузера

1. **Відкрийте Developer Tools** (F12)
2. **Перейдіть на вкладку Console**
3. **Спробуйте створити продукт** з новим зображенням
4. **Перевірте логи** - тепер ви побачите детальну інформацію:

```
📁 File upload check:
- File exists: true
- File size: 2048576
- File type: image/jpeg
- File name: photo.jpg
✅ File validation passed
🚀 Starting file upload to Strapi...
📤 Upload URL: http://localhost:1337/api/upload
🔑 Using token: Yes
📥 Upload response status: 200
✅ Upload successful: {...}
🆔 Uploaded image ID: 123
```

## Крок 3: Типові помилки та рішення

### ❌ "Invalid file type"
**Проблема:** Файл не є зображенням
**Рішення:** Використовуйте JPEG, PNG, GIF або WebP

### ❌ "File too large"
**Проблема:** Файл більше 10MB
**Рішення:** Стисніть зображення або використовуйте менший файл

### ❌ "No permission to upload files"
**Проблема:** Немає дозволів в Strapi
**Рішення:**
1. Відкрийте Strapi Admin Panel
2. Settings → Users & Permissions Plugin → Roles → Public
3. Увімкніть дозволи для Upload:
   - ✅ upload (POST /api/upload)
   - ✅ find (GET /api/upload/files)
   - ✅ findOne (GET /api/upload/files/:id)
   - ✅ destroy (DELETE /api/upload/files/:id)

### ❌ "Server error during upload"
**Проблема:** Помилка на сервері Strapi
**Рішення:**
1. Перевірте логи Strapi
2. Перезапустіть Strapi
3. Перевірте налаштування Upload plugin

### ❌ "File was provided but upload failed"
**Проблема:** Файл не завантажився, але продукт створюється
**Рішення:** Перевірте дозволи та налаштування Strapi

## Крок 4: Перевірка налаштувань Strapi

### 1. Upload Plugin Configuration
Перевірте `cms/config/plugins.ts`:
```typescript
upload: {
    config: {
        sizeLimit: 10 * 1024 * 1024, // 10MB
        breakpoints: {
            xlarge: 1920,
            large: 1000,
            medium: 750,
            small: 500,
            xsmall: 64
        },
    },
},
```

### 2. API Token
Перевірте `.env.local`:
```env
STRAPI_API_TOKEN=your_token_here
```

### 3. CORS Settings
Перевірте `cms/config/middlewares.ts`:
```typescript
export default [
    'strapi::errors',
    'strapi::security',
    {
        name: 'strapi::cors',
        config: {
            enabled: true,
            headers: '*',
            origin: ['http://localhost:3000', 'http://localhost:1337']
        }
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
```

## Крок 5: Тестування

### Тест 1: Простий файл
1. Створіть простий JPEG файл (менше 1MB)
2. Спробуйте завантажити через адмінку
3. Перевірте консоль на помилки

### Тест 2: Різні типи файлів
1. Спробуйте JPEG, PNG, GIF
2. Перевірте, які типи працюють

### Тест 3: Різні розміри
1. Спробуйте файли різних розмірів
2. Перевірте ліміти

## Крок 6: Альтернативні рішення

### Варіант A: Завантаження через Media Library
1. Відкрийте Strapi Admin Panel
2. Media Library → Add new assets
3. Завантажте зображення
4. Скопіюйте ID зображення
5. Використовуйте ID в API

### Варіант B: Пряме завантаження
1. Завантажте файл напряму в Strapi
2. Отримайте ID файлу
3. Використовуйте ID при створенні продукту

## Крок 7: Логування

Тепер API надає детальну інформацію:
- ✅ Тип та розмір файлу
- ✅ Статус завантаження
- ✅ Детальні помилки
- ✅ ID завантаженого зображення

## Результат

Після налаштування:
- ✅ Валідація файлів працює
- ✅ Детальні помилки в консолі
- ✅ Продукти створюються навіть якщо зображення не завантажилося
- ✅ Краща діагностика проблем
