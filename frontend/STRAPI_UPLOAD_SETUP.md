# 📁 Налаштування Upload Plugin в Strapi

## Проблема
Не бачите секцію "Upload" в налаштуваннях дозволів Strapi. Це означає, що Upload plugin не активний або не налаштований.

## Крок 1: Перевірка наявності Upload Plugin

1. **Відкрийте Strapi Admin Panel:**
   - Перейдіть на `http://localhost:1337/admin`

2. **Перевірте в Settings:**
   - **Settings** → **Plugins**
   - Шукайте **Upload** plugin
   - Якщо його немає, він не встановлений

## Крок 2: Встановлення Upload Plugin

Upload plugin зазвичай встановлений за замовчуванням, але якщо його немає:

1. **Встановіть plugin:**
   ```bash
   cd cms
   npm install @strapi/plugin-upload
   ```

2. **Перезапустіть Strapi:**
   ```bash
   npm run develop
   ```

## Крок 3: Активація Upload Plugin

1. **В Strapi Admin Panel:**
   - **Settings** → **Plugins**
   - Знайдіть **Upload** plugin
   - Натисніть **Configure** або **Settings**

2. **Налаштуйте Upload:**
   - **Size limit**: 10 MB (або більше)
   - **Allowed file types**: `image/*` (або всі типи)
   - **Provider**: Local (за замовчуванням)

## Крок 4: Альтернативне рішення - Ручне налаштування

Якщо Upload plugin все ще не з'являється, додайте його вручну:

1. **Відкрийте файл `cms/config/plugins.ts`:**
   ```typescript
   export default {
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
   };
   ```

2. **Або в `cms/config/plugins.js`:**
   ```javascript
   module.exports = {
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
   };
   ```

## Крок 5: Перевірка в package.json

Переконайтеся, що Upload plugin встановлений:

1. **Відкрийте `cms/package.json`:**
   ```json
   {
     "dependencies": {
       "@strapi/plugin-upload": "^4.x.x"
     }
   }
   ```

2. **Якщо його немає, встановіть:**
   ```bash
   cd cms
   npm install @strapi/plugin-upload
   ```

## Крок 6: Перезапуск та перевірка

1. **Перезапустіть Strapi:**
   ```bash
   cd cms
   npm run develop
   ```

2. **Перевірте в Admin Panel:**
   - **Settings** → **Users & Permissions Plugin** → **Roles**
   - Тепер повинна з'явитися секція **Upload**

## Крок 7: Налаштування дозволів

Після появи секції Upload:

1. **Виберіть роль Public:**
   - **Settings** → **Users & Permissions Plugin** → **Roles** → **Public**

2. **Увімкніть дозволи для Upload:**
   - ✅ **upload** (POST /api/upload)
   - ✅ **find** (GET /api/upload/files)
   - ✅ **findOne** (GET /api/upload/files/:id)
   - ✅ **destroy** (DELETE /api/upload/files/:id)

## Крок 8: Альтернативне рішення - Використання Media Library

Якщо Upload plugin все ще не працює, використовуйте Media Library:

1. **В Admin Panel:**
   - **Media Library** → **Add new assets**
   - Завантажте зображення

2. **Скопіюйте ID зображення** та використовуйте в API

## Крок 9: Тестування

Після налаштування:

1. **Спробуйте завантажити файл** через адмінку
2. **Перевірте консоль** на наявність помилок
3. **Перевірте Media Library** - чи з'явилося зображення

## Типові проблеми та рішення

### "Upload plugin not found"
- ❌ Проблема: Plugin не встановлений
- ✅ Рішення: `npm install @strapi/plugin-upload`

### "No permissions for upload"
- ❌ Проблема: Немає дозволів
- ✅ Рішення: Налаштуйте дозволи в Roles

### "File too large"
- ❌ Проблема: Файл перевищує ліміт
- ✅ Рішення: Збільшіть sizeLimit в налаштуваннях

### "Invalid file type"
- ❌ Проблема: Тип файлу не дозволений
- ✅ Рішення: Додайте тип файлу в allowedTypes

## Діагностика

Якщо все ще не працює:

1. **Перевірте логи Strapi:**
   ```bash
   cd cms
   npm run develop
   ```

2. **Перевірте версію Strapi:**
   ```bash
   npm list @strapi/strapi
   ```

3. **Перевірте конфігурацію:**
   - `cms/config/plugins.ts`
   - `cms/config/middlewares.ts`
   - `cms/config/database.ts`
