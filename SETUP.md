# 🔧 Setup Guide

This guide will help you set up the Guru Tea project for development.

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Yarn** package manager (`npm install -g yarn`)
- **PostgreSQL** (optional, SQLite works for development)
- **Stripe Account** ([Sign up](https://stripe.com/))
- **Telegram Bot** (optional, for chat feature)

## 🚀 Installation Steps

### 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/guru-tea.git
cd guru-tea
```

### 2️⃣ Backend Setup (Strapi CMS)

```bash
cd cms
yarn install
```

Create `.env` file in `cms/` directory:

```env
HOST=0.0.0.0
PORT=1337

# Generate random strings for these:
APP_KEYS=your_app_key_1,your_app_key_2,your_app_key_3,your_app_key_4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (SQLite for development)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For production, use PostgreSQL:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=strapi_db
# DATABASE_USERNAME=strapi_user
# DATABASE_PASSWORD=your_password
```

Start Strapi:

```bash
yarn dev
```

**First time setup:**
1. Open `http://localhost:1337/admin`
2. Create admin account
3. Go to Settings → API Tokens → Create new API Token
4. Copy the token (you'll need it for frontend)

**Configure permissions:**
1. Settings → Roles → Public
2. Enable these permissions:
   - Product: `find`, `findOne`
   - Category: `find`, `findOne`
   - Review: `find`, `create`
   - Block-img: `find`, `findOne`

### 3️⃣ Frontend Setup (Next.js)

```bash
cd ../frontend
yarn install
```

Create `.env.local` file in `frontend/` directory:

```env
# Strapi CMS
NEXT_PUBLIC_CMS_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=paste_your_api_token_here

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Telegram Bot (optional, for chat feature)
# Create bot: https://t.me/BotFather
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WebSocket (for real-time chat)
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

Start Next.js:

```bash
yarn dev
```

**Access the application:**
- Frontend: `http://localhost:3000`
- Backend Admin: `http://localhost:1337/admin`

## 🎨 Add Sample Data

### Option 1: Manual via Admin Panel

1. Go to `http://localhost:1337/admin`
2. Create Categories:
   - Black Tea
   - Green Tea
   - Herbal Tea
   - White Tea
   - Oolong Tea

3. Create Products:
   - Add title, description, price
   - Upload product images
   - Select category
   - Mark as featured (optional)

### Option 2: Use Scripts (if available)

```bash
cd frontend/scripts
node create-tea-products.js
```

## 🔑 Getting API Keys

### Stripe

1. Sign up at [Stripe](https://stripe.com/)
2. Go to Developers → API keys
3. Copy **Publishable key** and **Secret key**
4. Use **Test mode** keys for development

### Telegram Bot (Optional)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow instructions
3. Copy the bot token
4. To get your Chat ID:
   - Message your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `chat.id` in the response

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 1337 (Strapi)
lsof -ti:1337 | xargs kill -9

# Kill process on port 3000 (Next.js)
lsof -ti:3000 | xargs kill -9
```

### Strapi Admin Won't Load

```bash
cd cms
rm -rf .cache build
yarn build
yarn dev
```

### Database Connection Error

- Check DATABASE_* variables in `.env`
- For SQLite, ensure `.tmp/` directory exists
- For PostgreSQL, verify database is running

### Frontend Can't Connect to Strapi

1. Check `NEXT_PUBLIC_CMS_URL` in `.env.local`
2. Verify Strapi is running on port 1337
3. Check API token is correct
4. Verify permissions are set in Strapi admin

### Images Not Displaying

1. Check uploads folder: `cms/public/uploads/`
2. Verify `NEXT_PUBLIC_CMS_URL` includes protocol (http://)
3. Check Strapi permissions for media library

## 📦 Production Deployment

### Strapi (Backend)

```bash
cd cms
yarn build
NODE_ENV=production yarn start
```

**Environment variables to set:**
- Use PostgreSQL database
- Set secure random strings for secrets
- Configure file upload provider (S3, Cloudinary, etc.)

### Next.js (Frontend)

```bash
cd frontend
yarn build
yarn start
```

**Environment variables to set:**
- Production Stripe keys
- Production Strapi URL
- Production site URL

### Recommended Platforms

- **Strapi**: Railway, Render, Heroku, DigitalOcean
- **Next.js**: Vercel, Netlify, Railway
- **Database**: Railway PostgreSQL, Supabase, Amazon RDS

## 🔐 Security Checklist

- [ ] Change all default secrets in `.env`
- [ ] Use strong admin password
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS in production
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Use production Stripe keys
- [ ] Enable database backups

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Strapi Documentation](https://docs.strapi.io/)
- [Material-UI Documentation](https://mui.com/)
- [Stripe Documentation](https://stripe.com/docs)

## 🆘 Need Help?

- Check [PORTFOLIO.md](./PORTFOLIO.md) for technical details
- Review component documentation in code
- Check console for error messages
- Open an issue on GitHub

---

**Ready to develop!** 🎉

Start both servers and visit `http://localhost:3000`

