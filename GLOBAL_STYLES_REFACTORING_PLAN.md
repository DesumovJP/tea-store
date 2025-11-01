# План рефакторингу стилів на глобальні (MUI Theme)

## Мета
Перевести всі inline стилі (`sx`, `style`) на глобальну тему MUI, щоб всі стилі керувалися з одного місця.

## Структура роботи

### Фаза 1: Розширення MUI Theme
1. Розширити `frontend/src/theme/index.ts`:
   - Додати всі кольори з CSS змінних
   - Додати типографію (fontFamily, letterSpacing, textTransform)
   - Додати spacing, shadows, transitions
   - Додати компоненти стилізації для всіх використаних MUI компонентів

### Фаза 2: Визначення патернів стилів
- Повторювані стилі які використовуються в кількох місцях
- Унікальні стилі для конкретних компонентів
- Responsive стилі
- Hover/focus стани

### Фаза 3: Рефакторинг компонентів (порядок важливості)
1. **Core Layout Components:**
   - ClientLayout.tsx
   - Navbar.tsx
   - Footer.tsx

2. **Catalog Pages:**
   - catalog/page.tsx
   - catalog/[productId]/page.tsx

3. **Home Page:**
   - page.tsx

4. **Cart & Other Pages:**
   - cart/page.tsx
   - about/page.tsx

5. **Reusable Components:**
   - FilterButton.tsx
   - AddToCartButton.tsx
   - CartDrawer.tsx
   - StarRating.tsx
   - AddReview.tsx
   - ReviewList.tsx
   - MarketingIntro.tsx
   - TeaProcess.tsx
   - HappyCustomers.tsx
   - AboutBanner.tsx
   - FeatureTriplet.tsx
   - HomeCatalogSection.tsx
   - CategoryCarousel.tsx
   - ToTopButton.tsx
   - FeedbackChat.tsx
   - PromoStrip.tsx
   - PageSkeleton.tsx

### Фаза 4: Перевірка та тестування
1. Перевірити всі сторінки на правильне відображення
2. Перевірити responsive поведінку
3. Перевірити інтерактивні елементи (hover, focus, active)
4. Перевірити що немає inline стилів (`grep` для `sx={` та `style={`)

## Детальні патерни стилів для теми

### Кольори (з CSS змінних та поточних використань)
- Primary: #2c2c2c, #1a1a1a, #4a4a4a
- Brand Green: #66bb6a, rgb(102, 187, 106)
- Text: #1a1a1a, #2c2c2c, #4a4a4a, #666666, #999999
- Borders: #2c2c2c, #e0e0e0
- Backgrounds: #ffffff, #f8f8f8, #f8f9fa, #f5f9f5

### Типографія
- Font Family: var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif
- Letter Spacing: -0.02em, -0.01em
- Text Transform: lowercase (для hipster стилю)
- Font Weight: 300, 400, 500, 600, 700, 800

### Spacing & Layout
- Padding: responsive (xs: '1rem', md: '10%', lg: '15%')
- Border Radius: 0 (мінімалістичний стиль)
- Borders: 1px, 2px, 3px solid

### Shadows & Effects
- Box Shadow: '2px 2px 0px', '3px 3px 0px', '4px 4px 0px'
- Transitions: 'all 0.2s ease', 'all 0.3s ease'
- Transform: translateY, translateX, scale

### Компоненти для стилізації в темі
- MuiButton (outlined, contained, text variants)
- MuiBox
- MuiTypography
- MuiOutlinedInput
- MuiSelect
- MuiMenuItem
- MuiCard
- MuiAppBar
- MuiModal
- MuiDrawer
- MuiIconButton
- MuiBadge
- MuiGrid
- MuiContainer

## Кроки виконання
1. Розширити theme/index.ts з усіма стилями
2. Послідовно рефакторити кожен файл
3. Видаляти sx props після перевірки
4. Видаляти style props
5. Тестувати після кожної зміни

## Критерії успіху
- ✅ Жодних `sx={}` props в компонентах (крім динамічних значень)
- ✅ Жодних `style={}` props
- ✅ Всі стилі в theme/index.ts
- ✅ Всі сторінки працюють коректно
- ✅ Responsive дизайн працює
- ✅ Hover/focus стани працюють
