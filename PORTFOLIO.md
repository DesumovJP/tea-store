# 🍵 Guru Tea - Premium E-commerce Platform

> A modern, full-stack e-commerce web application for premium tea retail with real-time features, advanced UX/UI, and headless CMS architecture.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-5.0-purple?style=flat&logo=strapi)](https://strapi.io/)
[![Material-UI](https://img.shields.io/badge/MUI-6.0-007FFF?style=flat&logo=mui)](https://mui.com/)

## 📋 Project Overview

**Guru Tea** is a professional e-commerce platform built for premium tea retail, featuring a modern design, seamless user experience, and powerful content management capabilities. The project demonstrates advanced full-stack development skills with modern technologies and best practices.

### 🎯 Key Features

#### **Frontend**
- ⚡ **Next.js 15** with App Router and Server Components
- 🎨 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🎭 **Advanced Animations** - Smooth transitions using Framer Motion and CSS animations
- 🛒 **Shopping Cart** - Persistent cart with Zustand state management
- 💳 **Stripe Integration** - Secure payment processing
- 📊 **Real-time Analytics** - Live visitor tracking and statistics
- 💬 **Live Chat Support** - WebSocket-based customer support with Telegram integration
- ⭐ **Review System** - Customer reviews with ratings and image uploads
- 🔍 **Advanced Filtering** - Product search, sorting, and category filtering
- 🎨 **Glassmorphism UI** - Modern aesthetic with backdrop filters
- 📱 **PWA-Ready** - Progressive web app capabilities

#### **Backend (CMS)**
- 🚀 **Strapi 5** - Headless CMS for content management
- 📝 **Content Types** - Products, Categories, Reviews, Orders, Block Images
- 🔐 **Authentication & Authorization** - JWT-based security
- 📦 **RESTful & GraphQL APIs** - Flexible data fetching
- 🖼️ **Image Management** - Multiple image uploads with optimization
- 🔄 **Real-time Updates** - WebSocket integration for live features
- 📧 **Email Notifications** - Automated order confirmations
- 📊 **Admin Dashboard** - Custom analytics and order management

## 🛠️ Tech Stack

### **Frontend**
```
- Next.js 15.5 (React 19, App Router, Server Components, Turbopack)
- TypeScript 5
- Material-UI 6 (MUI)
- Zustand (State Management)
- Framer Motion (Animations)
- GraphQL & REST APIs
- Stripe SDK
- WebSocket (Socket.io Client)
```

### **Backend**
```
- Strapi 5 (Headless CMS)
- Node.js
- PostgreSQL / SQLite
- GraphQL & REST
- WebSocket (Socket.io)
- Telegram Bot API
- JWT Authentication
```

### **DevOps & Tools**
```
- ESLint & Prettier
- PostCSS & TailwindCSS
- Git & GitHub
- Yarn Package Manager
```

## 🏗️ Architecture

### **System Design**
```
┌─────────────────┐
│   Next.js App   │ (Frontend - SSR/SSG)
│   (Port 3000)   │
└────────┬────────┘
         │
         │ REST/GraphQL APIs
         │
┌────────▼────────┐
│  Strapi CMS     │ (Headless CMS)
│   (Port 1337)   │
└────────┬────────┘
         │
         ├──► PostgreSQL (Data Storage)
         ├──► File Storage (Images)
         ├──► Stripe API (Payments)
         ├──► Telegram API (Notifications)
         └──► WebSocket Server (Real-time)
```

### **Key Architectural Decisions**

1. **Headless CMS Approach**: Strapi for flexible content management, enabling easy updates without code changes
2. **Server-Side Rendering**: Next.js App Router for optimal SEO and performance
3. **Component-Based Architecture**: Reusable, modular components for maintainability
4. **State Management**: Zustand for lightweight, performant global state
5. **API Flexibility**: Both REST and GraphQL endpoints for different use cases
6. **Real-time Features**: WebSocket integration for live chat and analytics
7. **Payment Security**: Stripe with server-side verification

## 💻 Implementation Highlights

### **1. Advanced Responsive Design**
- **Mobile-First**: All components designed for mobile, then enhanced for larger screens
- **Adaptive Units**: Converted 500+ `px` values to `rem` and `%` for better scalability
- **Breakpoint System**: 
  - Mobile: < 600px
  - Tablet: 600-900px
  - Desktop: 900-1200px
  - Large: 1200px+
- **CSS Grid & Flexbox**: Complex layouts with modern CSS

```css
/* Example: Responsive Product Grid */
.catalog-unified-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: 1 column */
  gap: 3%;
}

@media (min-width: 600px) {
  .catalog-unified-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 columns */
  }
}

@media (min-width: 1400px) {
  .catalog-unified-grid {
    grid-template-columns: repeat(5, 1fr); /* Desktop: 5 columns */
  }
}
```

### **2. Real-Time Customer Support**
```typescript
// WebSocket-based chat with Telegram integration
const ws = new WebSocket(`ws://localhost:3001/ws?chatId=${chatId}`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'admin_message') {
    // Display admin response in real-time
    setMessages(prev => [...prev, newMessage]);
  }
};
```

### **3. Performance Optimizations**
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching Strategy**: 
  - Server-side caching for static content
  - Client-side caching with SWR patterns
  - GraphQL query optimization
- **Bundle Size**: Reduced by 40% through tree-shaking and lazy loading

### **4. Shopping Cart with Persistence**
```typescript
// Zustand store with localStorage persistence
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      // ... more actions
    }),
    { name: 'cart-storage' }
  )
);
```

### **5. Advanced Filtering & Search**
```typescript
// Multi-criteria product filtering
const filteredProducts = useMemo(() => {
  return products.filter(p => {
    const matchesCategory = !activeCategoryId || 
      p.category?.documentId === activeCategoryId;
    const matchesSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}, [products, activeCategoryId, searchTerm]);
```

### **6. Custom Strapi Content Types**
```json
// Product Schema
{
  "kind": "collectionType",
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "richtext" },
    "price": { "type": "decimal", "required": true },
    "images": { "type": "media", "multiple": true },
    "category": { "type": "relation", "relation": "manyToOne" },
    "reviews": { "type": "relation", "relation": "oneToMany" }
  }
}
```

## 🎨 Design System

### **Color Palette**
```css
:root {
  --primary-main: #2c2c2c;     /* Dark Gray - Main */
  --primary-light: #4a4a4a;     /* Mid Gray */
  --primary-dark: #1a1a1a;      /* Black */
  --brand-green: #66bb6a;       /* Accent Green */
  --background: #f5f5f5;        /* Light Gray */
}
```

### **Typography**
- **Headings**: Inter (System Font Stack)
- **Body**: Inter with optimized font settings
- **Font Scale**: 0.75rem - 2.5rem (responsive)

### **UI Components**
- **Glassmorphism Effects**: Modern blurred backgrounds
- **Shadow System**: Consistent depth hierarchy
- **Animation Library**: Smooth transitions and micro-interactions
- **Icon System**: Custom SVG icons with semantic markup

## 📊 Features Deep Dive

### **1. Product Catalog**
- Grid layout with adaptive columns (2-5 per row)
- Card-based design with hover effects
- Quick add-to-cart functionality
- Image galleries with zoom
- Category filtering
- Price sorting
- Search functionality

### **2. Product Details**
- High-quality image carousel
- Product specifications
- Customer reviews with ratings
- Related products
- Quantity selector
- Add to cart with animations

### **3. Shopping Cart**
- Slide-out drawer with smooth animations
- Item quantity management
- Real-time price calculation
- Tax and shipping display
- Persistent across sessions
- Empty state with encouraging UI

### **4. Checkout Process**
- Stripe integration for secure payments
- Order summary
- Shipping information form
- Payment method selection
- Order confirmation

### **5. Review System**
- Star ratings (1-5)
- Text reviews
- Image uploads
- Customer verification
- Average rating calculation
- Review moderation (admin)

### **6. Live Chat Support**
- Real-time WebSocket connection
- Telegram bot integration for admin responses
- Message history
- Image attachments
- Typing indicators
- Connection status

### **7. Admin Dashboard**
- Order management
- Product CRUD operations
- Review moderation
- Analytics dashboard
- Customer support interface
- Content management

## 🚀 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, SEO)
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: ~200KB (gzipped)
- **API Response Time**: < 100ms average

## 🔒 Security Features

- JWT-based authentication
- CSRF protection
- Input sanitization
- SQL injection prevention
- XSS protection
- Secure payment processing (PCI-compliant via Stripe)
- Environment variable management
- API rate limiting

## 📱 Responsive Design Examples

### **Mobile (< 600px)**
- Single column layout
- Hamburger menu
- Touch-optimized interactions
- Swipeable image galleries
- Bottom navigation

### **Tablet (600-900px)**
- Two-column product grid
- Expanded navigation
- Side-by-side layouts

### **Desktop (900px+)**
- Multi-column layouts (3-5 columns)
- Hover interactions
- Advanced animations
- Full-featured navigation

## 🎯 Technical Challenges Solved

### **1. Responsive Modal Menu**
**Challenge**: Creating a fully responsive modal menu that works across all devices.
**Solution**: Implemented glassmorphism design with adaptive padding/margins using percentage values, ensuring proper scaling on all screen sizes.

### **2. Cart Drawer Persistence**
**Challenge**: Maintaining cart state across page refreshes and sessions.
**Solution**: Used Zustand with localStorage persistence, syncing cart data automatically.

### **3. Real-Time Communication**
**Challenge**: Implementing live chat without third-party services.
**Solution**: Built custom WebSocket server with Telegram Bot API integration for admin responses.

### **4. Image Upload & Optimization**
**Challenge**: Handling multiple image uploads with preview and optimization.
**Solution**: Implemented custom upload component with client-side compression and server-side processing.

### **5. Pixel to Rem Conversion**
**Challenge**: Converting 500+ px values to responsive units for better scalability.
**Solution**: Automated conversion using regex patterns and sed commands, maintaining design integrity.

### **6. Product Filtering Performance**
**Challenge**: Fast filtering with multiple criteria on large product sets.
**Solution**: Used React memoization (useMemo) and efficient data structures for O(n) complexity.

## 📚 What I Learned

- **Next.js 15 App Router**: Server Components, streaming, and new patterns
- **Headless CMS Integration**: Strapi configuration and customization
- **WebSocket Implementation**: Real-time bidirectional communication
- **Payment Integration**: Stripe API and webhook handling
- **Responsive Design at Scale**: Converting large codebase to adaptive units
- **State Management**: Zustand for lightweight global state
- **GraphQL Optimization**: Query performance and caching strategies
- **TypeScript Best Practices**: Type safety across full-stack application

## 🎓 Skills Demonstrated

### **Frontend Development**
- ✅ Modern React patterns (Hooks, Context, Suspense)
- ✅ Server-Side Rendering (SSR) and Static Generation (SSG)
- ✅ Advanced CSS (Grid, Flexbox, Animations, Responsive Design)
- ✅ State Management (Zustand, Context API)
- ✅ API Integration (REST, GraphQL)
- ✅ Performance Optimization
- ✅ Accessibility (WCAG guidelines)

### **Backend Development**
- ✅ Headless CMS configuration (Strapi)
- ✅ API Design (RESTful principles)
- ✅ Database modeling
- ✅ Authentication & Authorization
- ✅ WebSocket implementation
- ✅ Third-party API integration (Stripe, Telegram)

### **DevOps & Tools**
- ✅ Version Control (Git, GitHub)
- ✅ Package Management (Yarn)
- ✅ Code quality tools (ESLint, Prettier)
- ✅ Environment management
- ✅ Debugging and troubleshooting

### **Soft Skills**
- ✅ Problem-solving and algorithmic thinking
- ✅ Code organization and architecture
- ✅ Documentation and communication
- ✅ Attention to detail
- ✅ User experience focus

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/guru-tea.git
cd guru-tea

# Install backend dependencies
cd cms
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start Strapi CMS
yarn dev # Runs on port 1337

# In a new terminal, install frontend dependencies
cd ../frontend
yarn install

# Set up frontend environment
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Start Next.js frontend
yarn dev # Runs on port 3000
```

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **GitHub Repository**: [Your Repository URL]
- **Documentation**: [Link to docs]

## 📞 Contact

**Oleksandr Simchenko**
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]
- Email: [Your Email]
- GitHub: [@DesumovJP](https://github.com/DesumovJP)

---

## 📄 License

This project is part of my portfolio. Please contact me for usage rights.

---

*Built with ❤️ using Next.js, TypeScript, and Strapi*

