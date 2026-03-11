# NextRun

A production-ready Next.js template with pre-configured authentication, payments, and modern UI components. Skip the setup headaches and focus on building your next big idea.

## ✨ Features

### 🚀 **Next.js 16 + TypeScript**

- **App Router**: Latest Next.js routing with Server Components
- **TypeScript**: Full type safety out of the box
- **Turbopack**: Lightning-fast development builds

### 🔐 **Authentication Ready**

- **Better Auth Integration**: Secure authentication with Google OAuth
- **Session Management**: Persistent user sessions and protected routes
- **User Management**: Complete user account system

### 💳 **Payment Processing**

- **Stripe Integration**: Complete payment processing setup
- **Subscription Management**: Handle recurring payments
- **Webhook Support**: Secure payment event handling

### 🤖 **Telegram Bot**

- **Grammy Framework**: Lightweight and type-safe bot framework
- **Session & Conversations**: Stateful multi-step bot flows
- **Rate Limiting**: Built-in API throttling

### 🎨 **Modern UI Components**

- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Dark Mode**: Built-in theme switching
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites

- Node.js 24+
- Bun (recommended) or npm/yarn/pnpm
- PostgreSQL database (e.g., Neon, Supabase)
- Stripe account (for payments)
- Google OAuth credentials (for authentication)
- Telegram Bot Token (for the bot)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hamanovich/nextrun.git
   cd nextrun
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"

   # Authentication
   BETTER_AUTH_SECRET="min-32-chars-secret-key-generate-with-openssl"
   BETTER_AUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   # Stripe
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

   # Telegram Bot
   TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
   ```

4. **Set up the database**

   ```bash
   bun run db:push
   ```

5. **Start the development server**

   ```bash
   bun run dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Available Scripts

- `bun run dev` - Start development server with Turbopack
- `bun run build` - Build for production with Turbopack
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run db:push` - Push database schema changes
- `bun run db:studio` - Open Drizzle Studio
- `bun run stripe:listen` - Listen to Stripe webhooks locally
- `bun run bot:dev` - Start the Telegram bot in watch mode

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend

- **Next.js API Routes** - Serverless API
- **Better Auth** - Authentication with Google OAuth
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Server Actions** - Type-safe server-side logic

### Telegram Bot

- **Grammy** - Telegram bot framework
- **@grammyjs/conversations** - Stateful conversation flows
- **@grammyjs/files** - File handling
- **@grammyjs/transformer-throttler** - API rate limiting

### Payments & Infrastructure

- **Stripe** - Payment processing
- **Vercel** - Deployment platform

## 📁 Project Structure

```
src/
├── actions/           # Server actions
│   ├── stripe.ts     # Payment processing
│   └── user.ts       # User management
├── app/              # Next.js app router
│   ├── pricing/      # Pricing page
│   ├── user/         # User dashboard
│   ├── payment/      # Payment success page
│   ├── about/        # About page
│   ├── terms/        # Terms of service
│   ├── privacy/      # Privacy policy
│   └── api/          # API routes
├── components/       # React components
│   ├── auth/         # Authentication components
│   ├── payment/      # Payment-related components
│   ├── pricing/      # Pricing components
│   ├── navbar/       # Navigation components
│   ├── footer/       # Footer components
│   └── ui/           # Reusable UI components
├── bot/              # Telegram bot
│   ├── handlers.ts   # Command handlers
│   ├── index.ts      # Bot entry point
├── db/               # Database configuration
├── lib/              # Utility functions and schemas
└── contexts/         # React contexts
```

## 🎯 Usage

### Getting Started with the Template

1. **Clone and Install**

   ```bash
   git clone https://github.com/hamanovich/nextrun.git
   cd nextrun
   bun install
   ```

2. **Configure Environment**
   - Set up your database connection
   - Configure Google OAuth credentials
   - Add your Stripe keys

3. **Customize Your App**
   - Modify the branding and content
   - Add your own pages and components
   - Customize the UI components

### Authentication

- Users can sign in with Google OAuth
- Protected routes are automatically handled
- User sessions are managed securely

### Payment Processing

- Stripe integration is ready to use
- Handle one-time and subscription payments
- Webhook support for payment events

### Telegram Bot

- Create a bot via [@BotFather](https://t.me/BotFather) and copy the token
- Set `TELEGRAM_BOT_TOKEN` in your environment
- Run `bun run bot:dev` to start the bot locally

### Deployment

- Deploy to Vercel, Netlify, or any Node.js hosting
- Environment variables are configured
- Database migrations are included

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Siarhei Hamanovich**

- Email: dev.hamanovich@gmail.com
- LinkedIn: [hamanovich](https://www.linkedin.com/in/hamanovich/)
- Website: [nextrun.dev](https://www.nextrun.dev)

## 🐛 Bug Reports

If you find a bug, please open an issue on [GitHub](https://github.com/hamanovich/nextrun/issues) or email us at dev.hamanovich@gmail.com.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

- Email: dev.hamanovich@gmail.com
- GitHub Issues: [Create an issue](https://github.com/hamanovich/nextrun/issues)

---

Made with ❤️ for developers worldwide
