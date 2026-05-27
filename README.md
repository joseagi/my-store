# My Store — Full-Stack E-commerce Platform

A production-ready e-commerce web application built with Next.js 14, Prisma 7, Supabase, Stripe, and deployed on Vercel.

---

## Live Demo

**Production URL:** https://my-store-seven-alpha.vercel.app

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | Next.js 16 (App Router) | SSR, routing, API routes in one framework |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, pre-built accessible components |
| Backend | Next.js API Routes | No separate server needed |
| Database | PostgreSQL via Supabase | Hosted, scalable, free tier available |
| ORM | Prisma 7 | Type-safe queries, migrations, studio |
| Auth | NextAuth v4 | Google OAuth, session management |
| Payments | Stripe | Hosted checkout, webhook verification |
| Storage | Supabase Storage | Product image uploads |
| Deployment | Vercel | Auto-deploy from GitHub, edge CDN |
| State | Zustand | Lightweight cart state with localStorage persistence |

---

## Features

### Customer Features
- Browse products with category filtering
- Product detail pages with multiple images
- Shopping cart with quantity controls (persists across sessions)
- Guest and authenticated checkout
- Stripe-powered secure payments
- Order confirmation with full details
- Order history for signed-in users
- Google OAuth sign in

### Admin Features
- Protected admin panel (`/admin`)
- Revenue, orders, products, and customer stats dashboard
- Full product CRUD with image upload to Supabase Storage
- Low stock alerts
- Order management with inline status updates

### Technical Features
- Server-side rendering for SEO
- Dynamic sitemap and robots.txt
- Loading skeletons on all data pages
- Error boundaries with graceful fallbacks
- Mobile-first responsive design
- Lighthouse scores: Performance 80+, Accessibility 95, SEO 100

---

## Project Structure

```
my-store/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Product seed data
│   └── tsconfig.json          # Prisma-specific TS config
├── src/
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── page.tsx       # Homepage with product grid
│   │   │   ├── cart/          # Cart page
│   │   │   ├── checkout/      # Checkout flow
│   │   │   ├── success/       # Order confirmation
│   │   │   ├── login/         # Google OAuth login
│   │   │   ├── orders/        # Order history
│   │   │   └── products/[slug]/ # Product detail
│   │   ├── admin/
│   │   │   ├── layout.tsx     # Protected admin layout
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── products/      # Product management
│   │   │   └── orders/        # Order management
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # NextAuth handler
│   │       ├── checkout/      # Stripe session creation
│   │       ├── webhooks/stripe/ # Stripe webhook handler
│   │       └── admin/         # Admin CRUD routes
│   ├── components/
│   │   ├── admin/             # Admin UI components
│   │   ├── auth/              # Login form
│   │   ├── cart/              # Cart drawer, cart item
│   │   ├── checkout/          # Checkout form
│   │   ├── layout/            # Navbar, Footer
│   │   ├── products/          # Product card, grid, tabs
│   │   └── ui/                # shadcn/ui components
│   ├── hooks/
│   │   └── useMounted.ts      # Hydration helper hook
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton with PG adapter
│   │   ├── stripe.ts          # Stripe client
│   │   ├── supabase.ts        # Supabase client
│   │   ├── schemas.ts         # Zod validation schemas
│   │   └── utils.ts           # cn(), formatPrice(), generateSlug()
│   ├── store/
│   │   └── cart.ts            # Zustand cart store
│   └── types/
│       └── next-auth.d.ts     # NextAuth type extensions
├── prisma.config.ts            # Prisma 7 configuration
├── next.config.ts              # Next.js + image domains
├── components.json             # shadcn/ui configuration
└── vercel.json                 # Vercel build settings
```

---

## Getting Started

### Prerequisites

- Node.js 20.x
- npm 10.x
- Git
- A Supabase account (free)
- A Stripe account (free)
- A Google Cloud account (free)

### 1. Clone the Repository

```bash
git clone https://github.com/joseagi/my-store.git
cd my-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create `.env` and `.env.local` in the project root:

```bash
# Database — use Supabase pooler URL for serverless compatibility
DATABASE_URL="postgresql://postgres.YOUR_PROJECT:PASSWORD@aws-0-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct URL for migrations only
DIRECT_URL="postgresql://postgres:PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe (dashboard.stripe.com)
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

### 4. Set Up the Database

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed with sample products
npm run db:seed

# Open visual database browser
npm run db:studio
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Available Scripts

```bash
npm run dev              # Start development server with Turbopack
npm run build            # Build for production
npm run start            # Start production server
npm run db:generate      # Regenerate Prisma client
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio (localhost:5555)
npm run db:seed          # Seed database with sample products
```

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  role          Role      @default(CUSTOMER)
  orders        Order[]
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Float
  images      String[]
  stock       Int         @default(0)
  category    String?
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Order {
  id        String      @id @default(cuid())
  userId    String?
  total     Float
  status    OrderStatus @default(PENDING)
  stripeId  String?     @unique
  address   Json?
  items     OrderItem[]
  createdAt DateTime    @default(now())
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}

enum Role {
  CUSTOMER
  ADMIN
}
```

---

## Environment Setup Guides

### Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. APIs & Services → OAuth consent screen → External
4. APIs & Services → Credentials → OAuth Client ID → Web application
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret to your `.env.local`

### Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Stay in **Test Mode**
3. Developers → API keys → copy both keys
4. Install Stripe CLI for local webhook testing:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
5. Copy the `whsec_...` secret to `STRIPE_WEBHOOK_SECRET`

### Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Settings → Database → Connection string → URI (for `DIRECT_URL`)
3. Settings → Database → Connection pooling → Transaction mode (for `DATABASE_URL`)
4. Storage → New bucket → `product-images` → Public
5. Settings → API → copy URL and anon key

---

## Deployment on Vercel

### 1. Connect GitHub to Vercel

```
vercel.com → New Project → Import GitHub repository
```

### 2. Set Build Command

```
Settings → General → Build Command:
prisma generate && next build
```

### 3. Set Node Version

```
Settings → General → Node.js Version → 20.x
```

### 4. Add All Environment Variables

```
Settings → Environment Variables
Add all variables from your .env file
Set environment to: Production only
```

### 5. Set Up Production Stripe Webhook

```
Stripe Dashboard → Developers → Webhooks → Add endpoint
URL: https://your-store.vercel.app/api/webhooks/stripe
Events: checkout.session.completed, checkout.session.expired, payment_intent.payment_failed
Copy new whsec_ secret → update STRIPE_WEBHOOK_SECRET in Vercel
```

### 6. Deploy

```bash
git push origin master
# Vercel auto-deploys on every push
```

---

## Making Yourself an Admin

After signing in for the first time:

```bash
# Open Prisma Studio
npm run db:studio

# Visit http://localhost:5555
# Click User table → find your row
# Change role from CUSTOMER to ADMIN
# Save
```

Or via Supabase SQL Editor:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your@email.com';
```

---

## Test Stripe Payments

Use these test card numbers on the Stripe checkout page:

| Card Number | Scenario |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Requires 3D Secure |
| `4000 0000 0000 9995` | Insufficient funds |

Expiry: any future date (e.g. `12/34`)
CVC: any 3 digits (e.g. `123`)

---

## Adding Product Images

### Via Supabase SQL Editor

```sql
UPDATE "Product"
SET images = ARRAY['https://mrdqsyihkarznjjpoyif.supabase.co/storage/v1/object/public/product-images/your-image.jpg']
WHERE slug = 'your-product-slug';
```

### Via Admin Panel

1. Go to `/admin/products`
2. Click edit on any product
3. Use the image upload section
4. Images are stored in Supabase Storage automatically

**Image guidelines:**
- Format: WebP or JPG
- Size: under 1MB (compress at squoosh.app)
- Dimensions: 800×800px minimum (square ratio)
- Naming: lowercase, hyphens only (e.g. `white-tee-front.jpg`)

---

## Architecture Decisions

**Why Next.js App Router instead of Pages Router?**
Server components reduce client-side JavaScript. Product pages, admin dashboard, and order pages all fetch data server-side with zero client overhead.

**Why Prisma 7 with pg adapter instead of direct connection?**
Prisma 7 requires a driver adapter for the client engine. `@prisma/adapter-pg` with the Supabase pooler URL (`port 6543`) is essential for serverless — direct connections (`port 5432`) exhaust the connection pool on Vercel.

**Why Zustand for cart instead of Context API?**
Zustand with `persist` middleware gives localStorage persistence with zero boilerplate. The cart survives page refreshes and tab closes without any server state.

**Why Stripe hosted checkout instead of custom payment form?**
Stripe's hosted checkout page handles PCI compliance, 3D Secure, and card validation. Building a custom payment form requires PCI SAQ A-EP certification and significantly more code.

**Why Supabase instead of Railway or Neon?**
Supabase provides PostgreSQL + file storage + a dashboard in one free tier. The storage bucket for product images removes the need for a separate CDN service.

---

## Known Limitations

- Free Supabase tier pauses after 7 days of inactivity — disable auto-pause in project settings
- Google OAuth requires adding test users in Google Console until the app is verified
- Stripe is in test mode — switch to live keys before accepting real payments
- No email notifications for orders — Stripe sends receipt emails when enabled in dashboard settings

---

## Roadmap

Features planned for future iterations:

- [ ] Email order confirmations via Resend
- [ ] Product search with full-text search
- [ ] Discount codes and coupon system
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Multiple product variants (size, colour)
- [ ] Inventory alerts via email
- [ ] Analytics dashboard with charts
- [ ] Multi-currency support
- [ ] Custom domain connection

---

## Built With

- [Next.js](https://nextjs.org) — React framework
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com) — Component library
- [Prisma](https://prisma.io) — Database ORM
- [Supabase](https://supabase.com) — Database and storage
- [NextAuth.js](https://next-auth.js.org) — Authentication
- [Stripe](https://stripe.com) — Payment processing
- [Zustand](https://zustand-demo.pmnd.rs) — State management
- [Vercel](https://vercel.com) — Deployment platform
- [Zod](https://zod.dev) — Schema validation
- [React Hook Form](https://react-hook-form.com) — Form management
- [Lucide React](https://lucide.dev) — Icons

---

## License

MIT License — free to use, modify, and distribute.

---

## Author

Built by **joseagi** — a full production e-commerce store completed in 7 days.
