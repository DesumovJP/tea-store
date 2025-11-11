# CMS Backend - Guru Tea

Strapi 5 headless CMS for content management.

## 🚀 Development

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API configuration

# Start development server
yarn dev

# Build admin panel
yarn build

# Start production server
yarn start
```

## 🔑 Environment Variables

Create `.env` file with:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_token_salt
ADMIN_JWT_SECRET=your_admin_secret
TRANSFER_TOKEN_SALT=your_transfer_salt
JWT_SECRET=your_jwt_secret

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Or PostgreSQL
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=strapi
# DATABASE_PASSWORD=strapi
```

## 📁 Content Types

### **Product**
- Title, Description, Price
- Multiple Images
- Category Relation
- Reviews Relation
- Featured Flag

### **Category**
- Name, Slug
- Description
- Products Relation

### **Review**
- Rating (1-5)
- Comment, Author, Email
- Images (optional)
- Product Relation
- Approved Flag

### **Order**
- Customer Info
- Items (JSON)
- Total Amount
- Status (pending, paid, shipped, delivered)
- Stripe Session ID

### **Block Image**
- Image ID
- Image File
- Alternative Text

## 🛠️ API Endpoints

### REST API
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product
- `POST /api/reviews` - Create review
- `POST /api/orders` - Create order

### GraphQL API
- Endpoint: `/graphql`
- Playground: `http://localhost:1337/graphql`

Example query:
```graphql
query {
  products {
    documentId
    title
    price
    images {
      url
    }
    category {
      name
    }
  }
}
```

## 🔐 Permissions

Configure in: Settings → Roles → Public

**Public Access:**
- Products: `find`, `findOne`
- Categories: `find`, `findOne`  
- Reviews: `find`, `create`
- Block Images: `find`

**Authenticated Access:**
- Orders: `create`, `find` (own)

## 📦 Custom Routes

Located in `src/api/*/routes/`:
- Custom review moderation
- Order processing with Stripe
- Product lifecycle hooks

## 🗄️ Database

Development: SQLite (`.tmp/data.db`)  
Production: PostgreSQL recommended

## 🔌 Integrations

- **Stripe**: Payment processing
- **Telegram Bot**: Order notifications
- **WebSocket**: Real-time chat

## 📸 Media Library

Uploaded files stored in: `public/uploads/`

Supported formats:
- Images: JPEG, PNG, WebP, GIF
- Max size: 10MB

---

Access admin panel at: `http://localhost:1337/admin`

See [main README](../README.md) for full project documentation.
