# Виправлення помилки "Forbidden access" в Strapi

## Проблема
Отримуєте помилку `{message: 'Forbidden access', path: Array(3), extensions: {…}}` при спробі отримати дані через GraphQL.

## Рішення

### 1. Відкрийте Strapi Admin Panel
Перейдіть до `http://localhost:1337/admin` (або ваш URL Strapi)

### 2. Налаштуйте дозволи для Public ролі

#### Для Product:
1. Перейдіть до **Settings** → **Users & Permissions Plugin** → **Roles**
2. Натисніть на **Public** роль
3. У розділі **Product** встановіть:
   - ✅ **find** (дозволити читання списку продуктів)
   - ✅ **findOne** (дозволити читання одного продукту)
4. Натисніть **Save**

#### Для Category:
1. У тій же **Public** ролі
2. У розділі **Category** встановіть:
   - ✅ **find** (дозволити читання списку категорій)
   - ✅ **findOne** (дозволити читання однієї категорії)
3. Натисніть **Save**

#### Для Review (новий content type):
1. У тій же **Public** ролі
2. У розділі **Review** встановіть:
   - ✅ **find** (дозволити читання списку відгуків)
   - ✅ **findOne** (дозволити читання одного відгуку)
   - ✅ **create** (дозволити створення відгуків)
3. Натисніть **Save**

### 3. Перевірте GraphQL дозволи

#### Для Product:
1. Перейдіть до **Settings** → **Users & Permissions Plugin** → **Roles**
2. Натисніть на **Public** роль
3. У розділі **Product** перевірте:
   - ✅ **find** (GraphQL query)
   - ✅ **findOne** (GraphQL query)
4. Натисніть **Save**

#### Для Category:
1. У тій же **Public** ролі
2. У розділі **Category** перевірте:
   - ✅ **find** (GraphQL query)
   - ✅ **findOne** (GraphQL query)
3. Натисніть **Save**

#### Для Review:
1. У тій же **Public** ролі
2. У розділі **Review** перевірте:
   - ✅ **find** (GraphQL query)
   - ✅ **findOne** (GraphQL query)
   - ✅ **create** (GraphQL mutation)
3. Натисніть **Save**

### 4. Перезапустіть Strapi
Після зміни дозволів перезапустіть Strapi:

```bash
cd cms
yarn develop
```

### 5. Перевірте GraphQL Playground
Відкрийте `http://localhost:1337/graphql` і спробуйте виконати запит:

```graphql
query {
  products {
    documentId
    title
    price
    category {
      name
    }
  }
}
```

## Альтернативне рішення (якщо не працює)

Якщо проблема залишається, можна тимчасово дозволити всі операції:

### Для Product:
- ✅ **find**
- ✅ **findOne**
- ✅ **create**
- ✅ **update**
- ✅ **delete**

### Для Category:
- ✅ **find**
- ✅ **findOne**
- ✅ **create**
- ✅ **update**
- ✅ **delete**

### Для Review:
- ✅ **find**
- ✅ **findOne**
- ✅ **create**
- ✅ **update**
- ✅ **delete**

## Перевірка

Після налаштування дозволів:
1. Відкрийте фронтенд: `http://localhost:3000`
2. Перевірте, чи завантажуються продукти на головній сторінці
3. Перевірте, чи працює каталог
4. Перевірте, чи відображаються відгуки на сторінках продуктів

## Логування помилок

Якщо проблема залишається, перевірте консоль браузера та логи Strapi для детальної інформації про помилку.
