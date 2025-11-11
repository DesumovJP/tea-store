# 🍵 Guru Tea

> Premium E-commerce Platform for Tea Retail

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-5.0-purple)](https://strapi.io/)

A modern, full-stack e-commerce web application built with Next.js 15, TypeScript, Material-UI, and Strapi CMS.

## 📖 Documentation

For detailed project documentation, architecture, and portfolio information, see **[PORTFOLIO.md](./PORTFOLIO.md)**.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Yarn package manager
- PostgreSQL (or SQLite for development)

### Installation

1. **Backend (Strapi CMS)**
```bash
cd cms
yarn install
cp .env.example .env
yarn dev
# Access admin panel at http://localhost:1337/admin
```

2. **Frontend (Next.js)**
```bash
cd frontend
yarn install
cp .env.local.example .env.local
yarn dev
# Access website at http://localhost:3000
```

## 🌟 Key Features

- 🛒 Full-featured e-commerce platform
- 📱 Fully responsive design
- 💳 Stripe payment integration
- ⭐ Customer reviews and ratings
- 💬 Real-time chat support
- 📊 Admin analytics dashboard
- 🎨 Modern glassmorphism UI
- ⚡ Optimized performance

## 🛠️ Tech Stack

**Frontend**: Next.js 15, TypeScript, Material-UI, Zustand  
**Backend**: Strapi 5, PostgreSQL, GraphQL  
**Payment**: Stripe  
**Real-time**: WebSocket, Telegram Bot API

## 📂 Project Structure

```
tea-store/
├── cms/              # Strapi CMS (Backend)
│   ├── config/       # Configuration files
│   └── src/          # API endpoints, content types
│
├── frontend/         # Next.js App (Frontend)
│   ├── src/
│   │   ├── app/      # Next.js pages
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/      # Utilities
│   │   └── store/    # State management
│   └── public/       # Static assets
│
└── PORTFOLIO.md      # Detailed documentation
```

## 📸 Screenshots

[Add screenshots here]

## 🤝 Contributing

This is a portfolio project. If you have suggestions, feel free to open an issue.

## 📄 License

This project is part of my portfolio. Please contact for usage rights.

## 📞 Contact

**Oleksandr Simchenko**  
GitHub: [@DesumovJP](https://github.com/DesumovJP)

---

*See [PORTFOLIO.md](./PORTFOLIO.md) for detailed technical documentation*

