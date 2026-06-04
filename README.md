# My Store — Full-Stack E-commerce Platform

A production-ready e-commerce web application built with Next.js 15, Prisma 7, Supabase, Stripe, and deployed on Vercel.

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
- Product detail pages with image gallery (arrow navigation + thumbnails)
- Size selection required before adding to cart — "Select size" prompt enforced
- Size guide modal with measurement diagram on each product page
- Shipping policy page linked from every product detail page
- Cart supports the same product in multiple sizes as separate line items
- Shopping cart with quantity controls (persists across sessions)
- Full cart page (`/cart`) with order summary, shipping threshold, and checkout
- Guest and authenticated checkout
- Stripe-powered secure payments
- Order confirmation with full details
- Order history for signed-in users
- Google OAuth sign in

### Admin Features
- Protected admin panel (`/admin`)
- Revenue, orders, products, and customer stats dashboard
- Full product CRUD with image upload to Supabase Storage
- Size management per product — tag-style input (type and press Enter to add, click × to remove)
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
  sizes       String[]    @default([])
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
- [x] Multiple product variants (size selection) — completed 2026-06-03
- [ ] Inventory alerts via email
- [ ] Analytics dashboard with charts
- [ ] Multi-currency support
- [ ] Custom domain connection

---

## Changelog

### 2026-06-03

**Font**
- Replaced default heading font with **Rye** (`next/font/google`, weight `400`) loaded once in `layout.tsx` and applied site-wide via a `--font-heading` CSS variable and `font-heading` Tailwind utility class
- Applied to Navbar, Footer, ProductCard, homepage headings, and product detail page

**Product Cards**
- Removed the "Add to Cart" button from product listing cards — customers must click through to the detail page to select a size and add to cart
- The entire card is now a single clickable link

**Product Detail Page** (`src/app/products/[slug]/page.tsx` + `src/components/ui/products/ProductDetail.tsx`)
- New image gallery: main image with left/right arrow navigation and thumbnail strip
- Size selector: buttons displayed as `[S]` `[M]` `[L]` etc.; selecting a size highlights it
- Add to cart enforced: button shows "Select size" and is disabled until a size is chosen; changes to "Add to cart" once selected
- Size guide modal: fixed overlay with SVG trouser measurement diagram and a W28–W40 size table
- Shipping policy link navigates to `/shipping`

**Shipping Policy Page** (`src/app/shipping/page.tsx`)
- New page covering processing time, UK delivery options, international shipping, tracking, and returns

**Database — `sizes` field**
- Added `sizes String[] @default([])` to the `Product` model in `prisma/schema.prisma`
- Migration file generated: `prisma/migrations/20260603185232_add_product_sizes/migration.sql`
- If the Prisma CLI cannot connect (Supabase project paused), apply manually in the Supabase SQL Editor:
  ```sql
  ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizes" TEXT[] DEFAULT ARRAY[]::TEXT[];
  ```

**Prisma Configuration**
- `prisma.config.ts` updated to use `DIRECT_URL` (port 5432, direct connection) for migrations and fall back to `DATABASE_URL` (port 6543, pooler) if not set
- Removed `url`/`directUrl` from `schema.prisma` — Prisma 7 requires these in `prisma.config.ts` only

**Admin — ProductForm sizes**
- Added tag-style size input to the product create/edit form: type a value and press Enter or comma, or click Add; duplicate sizes are ignored; each tag has an × button to remove it
- Sizes are included in the API payload on submit
- Added `sizes: z.array(z.string()).optional().default([])` to the admin products API Zod schema

**Seed file**
- Fixed template literal bug: `'\n Seeded ${product.name}'` (single quotes) changed to `` `\n Seeded ${product.name}` `` (backticks)
- All seed products now include a `sizes` array

---

### 2026-06-04

**ProductForm — TypeScript fixes** (`src/components/admin/ProductForm.tsx`)
- Fixed broken `onSubmit`: the function body was split — an empty `try` block closed early and the actual `fetch` logic was floating outside the function; rewrote as a single clean `try/catch/finally`
- Fixed `sizeInput` state: it was referenced before being declared (was misnamed `sizesInput`)
- Removed `sizes` from the Zod schema (`.default([])` caused a type mismatch between Zod's input/output types that broke `zodResolver`); `sizes` is now managed via `useState` and passed manually in the submit body

**Cart — size-aware line items** (`src/store/cart.ts`, `src/components/cart/CartItem.tsx`, `src/components/ui/products/ProductDetail.tsx`)
- **Problem:** adding the same product twice with different sizes incremented quantity on one row instead of creating two separate cart entries
- **Fix:** introduced `cartKey` (`${productId}-${size ?? ''}`) as the unique identifier per cart line item
- `removeItem` and `updateQuantity` now operate on `cartKey` instead of `id`
- `CartItem` component shows the selected size beneath the product name (e.g. `Size: M`)
- `ProductDetail` passes `size` when calling `addItem` so the correct `cartKey` is built

**Cart drawer close button** (`src/components/ui/sheet.tsx`)
- The Sheet close button had `bg-secondary` applied, showing as a white square in the top-right of the drawer; changed to `bg-transparent hover:bg-transparent text-foreground`

**Full cart page** (`src/app/cart/page.tsx`)
- Created the missing route — "View full cart" was linking to `/cart` but no page existed
- Two-column layout on desktop: item list (left) and sticky order summary (right)
- Order summary shows each line item with its size, subtotal, shipping (free over £50), and total
- "Clear cart" and "Continue shopping" actions in the footer
- Fixed `useMounted` bug from the draft component (function was assigned without calling it)
- All React keys use `item.cartKey`

---

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