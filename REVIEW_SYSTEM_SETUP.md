# Система рейтингу та відгуків - Налаштування

## Огляд

Система рейтингу та відгуків дозволяє користувачам:
- Оцінювати продукти від 1 до 5 зірок
- Залишати текстові відгуки (опціонально)
- Переглядати відгуки інших користувачів
- Бачити середній рейтинг продуктів

## Архітектура системи

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Next.js API   │    │   Strapi CMS    │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ StarRating  │ │    │ │ /api/review │ │    │ │ Review      │ │
│ │ Component   │ │◄──►│ │ Route       │ │◄──►│ │ ContentType │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │                 │    │ ┌─────────────┐ │
│ │ ReviewList  │ │    │                 │    │ │ Product     │ │
│ │ Component   │ │◄───┼─────────────────┼───►│ │ ContentType │ │
│ └─────────────┘ │    │                 │    │ │ (with       │ │
│                 │    │                 │    │ │  reviews)   │ │
│ ┌─────────────┐ │    │                 │    │ └─────────────┘ │
│ │ AddReview   │ │    │                 │    │                 │
│ │ Component   │ │    │                 │    │                 │
│ └─────────────┘ │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Потік даних:

1. **Відображення рейтингу**: GraphQL запит → Strapi → Frontend компоненти
2. **Додавання відгуку**: AddReview → Next.js API → Strapi → Модерація
3. **Модерація**: Strapi Admin → isApproved: true → Публікація

## Структура бази даних

### Content Type: Review

Створено новий content type `review` у Strapi з наступними полями:

- `rating` (integer, 1-5, обов'язкове) - рейтинг від 1 до 5 зірок
- `comment` (text, опціональне) - текстовий відгук
- `authorName` (string, обов'язкове) - ім'я автора відгуку
- `authorEmail` (email, обов'язкове) - email автора
- `product` (relation, manyToOne) - зв'язок з продуктом
- `isApproved` (boolean, default: false) - чи схвалений відгук модератором

### Оновлення Product

Додано поле `reviews` (relation, oneToMany) до існуючого content type `product`.

## Файли, що були створені/оновлені

### Backend (Strapi)

```
cms/src/api/review/
├── content-types/review/schema.json
├── controllers/review.ts
├── routes/review.ts
└── services/review.ts
```

### Frontend

```
frontend/src/
├── types/review.ts                    # Спільний тип Review
├── components/
│   ├── StarRating.tsx                 # Оновлено - додано інтерактивність
│   ├── ReviewList.tsx                 # Новий - відображення списку відгуків
│   └── AddReview.tsx                  # Новий - форма додавання відгуку
├── app/
│   ├── api/review/route.ts            # Новий - API endpoint для відгуків
│   ├── catalog/[productId]/page.tsx   # Оновлено - додано рейтинг та відгуки
│   └── catalog/page.tsx               # Оновлено - додано рейтинг до карток
└── lib/graphql.ts                     # Оновлено - додано reviews до запитів
```

## Налаштування

### 1. Перезапуск Strapi

Після додавання нових content types потрібно перезапустити Strapi:

```bash
cd cms
yarn develop
```

### 2. Налаштування дозволів у Strapi

1. Відкрийте Strapi Admin Panel
2. Перейдіть до Settings > Users & Permissions Plugin > Roles
3. Для ролі "Public":
   - Дозвольте `find` та `findOne` для `review`
   - Дозвольте `create` для `review` (щоб користувачі могли залишати відгуки)
4. Для ролі "Authenticated" (якщо використовується):
   - Дозвольте всі операції з `review`

### 3. Налаштування дозволів для Product

Переконайтеся, що для ролі "Public" дозволено:
- `find` та `findOne` для `product`
- Доступ до поля `reviews` у продуктах

## Використання

### Відображення рейтингу

```tsx
import StarRating from "@/components/StarRating";

<StarRating 
  rating={4} 
  reviewCount={12} 
  size="medium"
  interactive={false}  // тільки для відображення
/>
```

### Інтерактивний рейтинг

```tsx
<StarRating 
  rating={selectedRating} 
  reviewCount={0} 
  size="medium"
  interactive={true}
  onRatingChange={setSelectedRating}
  showReviewCount={false}
/>
```

### Відображення списку відгуків

```tsx
import ReviewList from "@/components/ReviewList";

<ReviewList 
  reviews={product.reviews}
  averageRating={calculateAverageRating(product.reviews)}
  totalReviews={product.reviews.length}
/>
```

### Форма додавання відгуку

```tsx
import AddReview from "@/components/AddReview";

<AddReview 
  productId={product.documentId}
  onReviewAdded={() => {
    // Оновити дані після додавання відгуку
  }}
/>
```

## Модерація відгуків

Всі відгуки створюються з `isApproved: false` і потребують модерації:

1. Відкрийте Strapi Admin Panel
2. Перейдіть до Content Manager > Review
3. Знайдіть відгуки з `isApproved: false`
4. Відредагуйте відгук і встановіть `isApproved: true`
5. Збережіть зміни

Тільки схвалені відгуки (`isApproved: true`) відображаються на сайті.

## GraphQL запити

Система автоматично включає відгуки в GraphQL запити:

```graphql
query {
  products {
    documentId
    title
    price
    reviews(filters: { isApproved: { eq: true } }) {
      documentId
      rating
      comment
      authorName
      createdAt
    }
  }
}
```

## Безпека

- Всі відгуки проходять валідацію на сервері
- Email перевіряється на коректність формату
- Рейтинг обмежений значеннями 1-5
- Відгуки потребують модерації перед публікацією

## Стилізація

Компоненти використовують Material-UI та відповідають дизайну сайту:
- Мінімалістична кольорова схема
- Золоті зірки для рейтингу (#FFD700)
- Світло-сірі зірки для порожніх (#BDBDBD)
- Адаптивний дизайн для мобільних пристроїв
