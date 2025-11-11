# Frontend - Guru Tea

Next.js 15 application with TypeScript and Material-UI.

## 🚀 Development

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Strapi URL and API keys

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## 🔑 Environment Variables

Create `.env.local` file with:

```env
NEXT_PUBLIC_CMS_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=your_api_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
TELEGRAM_BOT_TOKEN=your_telegram_token
TELEGRAM_CHAT_ID=your_chat_id
```

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router pages
│   ├── about/     # About page
│   ├── admin/     # Admin dashboard
│   ├── api/       # API routes
│   ├── cart/      # Shopping cart
│   └── catalog/   # Product catalog
├── components/    # React components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and API clients
├── store/         # Zustand stores
├── theme/         # MUI theme
└── types/         # TypeScript types
```

## 🎨 Key Components

- **ProductCard** - Product display card
- **CartDrawer** - Shopping cart sidebar
- **FeedbackChat** - Real-time support chat
- **CategoryCarousel** - Category navigation
- **ReviewList** - Customer reviews display

## 📦 Tech Stack

- Next.js 15.5 (App Router)
- React 19
- TypeScript 5
- Material-UI 6
- Zustand (State Management)
- GraphQL & REST
- Stripe SDK
- Framer Motion

## 🔗 API Integration

The frontend connects to Strapi CMS at `localhost:1337` for:
- Product data (GraphQL)
- Categories (REST)
- Reviews (REST)
- Orders (REST)
- Real-time chat (WebSocket)

---

See [main README](../README.md) for full project documentation.
