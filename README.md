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
- Product cards are fully clickable — no "Add to cart" on listing pages; customers click through to select size first
- Product detail pages with image gallery (arrow navigation + thumbnails)
- Size selection required before adding to cart — button reads "Select size" until a size is chosen
- Size guide modal with measurement diagram on each product page
- Shipping policy page linked from every product detail page
- Cart supports the same product in multiple sizes as separate line items (each size = its own cart row)
- Shopping cart with quantity controls (persists across sessions via localStorage)
- Full cart page (`/cart`) with order summary, free shipping threshold (CA$75), and checkout
- Guest and authenticated checkout
- Checkout form: country/region selector first; fields (postcode label, state/province dropdown) update dynamically based on selected country — covers 30 countries, with dropdowns for US states, Canadian provinces, and Australian territories
- Email domain validation at checkout — catches common typos (`.con`, `.cmo`, etc.) before submission
- Terms & Conditions agreement checkbox — must be accepted before proceeding to payment
- Stripe-powered secure payments
- Order confirmation with full details
- Order history for signed-in users
- Google OAuth sign in

### Admin Features
- Protected admin panel (`/admin`)
- Revenue, orders, products, and customer stats dashboard
- Full product CRUD with image upload to Supabase Storage
- Size management per product — tag-style input: type a size and press Enter to add, click × to remove
- Order detail page shows each item's selected size alongside quantity and price
- Low stock alerts
- Order management with inline status updates

### Localisation
- Currency: Canadian Dollars (CAD) — all prices displayed with `en-CA` locale formatting
- Free shipping threshold: CA$75 (flat rate CA$8.99 below)
- Default checkout country: Canada
- Terms & Conditions and Shipping Policy reflect Canadian law (Ontario jurisdiction, PIPEDA privacy, HST/GST)

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

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Float
  size      String?   # selected size variant (e.g. "M", "32", "One Size")
  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
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

### 2026-06-05 — 2026-06-06

**Canadian localisation**
- `formatPrice` in `src/lib/utils.ts` updated to use `currency: 'CAD'` and `locale: 'en-CA'` — all prices now display as `CA$` throughout the site
- Free shipping threshold raised from £50 → CA$75; flat rate from £4.99 → CA$8.99; updated in cart drawer, cart page, checkout form, and checkout API route
- Default checkout country changed from `GB` → `CA`
- Terms & Conditions and Shipping Policy pages updated to reference Ontario, Canada jurisdiction, PIPEDA privacy legislation, and HST/GST instead of UK VAT

**Checkout form overhaul** (`src/components/checkout/CheckoutForm.tsx` + `src/lib/schemas.ts`)
- **Country first:** the Country / Region dropdown is now the very first field in the Shipping Address section
- **30 countries** with flag emojis; ordered with anglophone and African countries at the top
- **Dynamic regional fields:** field labels and placeholders update when the country changes:
  - Postcode (UK/AU) → ZIP code (US) → Eircode (IE) → Postal code (CA)
  - County (UK/IE) → State dropdown (US, 50 states + DC) → Province dropdown (CA, 13) → State/Territory dropdown (AU, 8) → free-text for all others
  - Phone placeholder updates to the country's dialling format
- **Apartment / suite** optional field added between street address and city
- **Email domain validation:** Zod `.refine()` checks the TLD is 2–6 alphabetic characters and rejects known typos (`.con`, `.cmo`, `.ocm`, `.vom`, etc.) with the message *"Check your email — the domain looks incorrect (e.g. did you mean .com?)"*
- **Terms & Conditions checkbox:** must be checked before "Continue to payment" is enabled; unchecking immediately re-disables the button; inline error shown if bypassed
- Order summary in checkout now uses `item.cartKey` as the React key and shows selected size beneath each product name

**Terms & Conditions page** (`src/app/terms/page.tsx`)
- New page at `/terms` covering 14 sections: eligibility, pricing (CAD, HST/GST), orders, shipping, returns (30-day), sizing, IP, PIPEDA privacy, liability, governing law (Ontario)
- Linked from the terms checkbox on the checkout form

**Shipping policy updated** (`src/app/shipping/page.tsx`)
- Replaced UK delivery table with Canadian domestic rates (Standard 5–7 days CA$8.99, Expedited 2–3 days CA$14.99, free over CA$75)
- Added USA shipping section (5–10 business days) and updated international section

**Order size tracking**
- Added `size String?` to `OrderItem` in `prisma/schema.prisma`
- Ran `prisma generate` to update the Prisma client types
- Updated `checkoutBodySchema` in the checkout API to accept `size` and `cartKey` on each item
- Updated `OrderItem` create call to persist `size` to the database
- Order detail page (`src/app/admin/orders/[id]/page.tsx`) now shows the selected size as a pill badge beside each product name in both the item list and order summary
- **Apply this migration manually in Supabase SQL Editor:**
  ```sql
  ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "size" TEXT;
  ```

**Admin product form** (`src/components/admin/ProductForm.tsx`)
- Final TypeScript fix: `sizes` removed from Zod schema (`.default([])` caused resolver type conflict); managed via `useState` and passed manually in the submit body alongside `data`

---

### 2026-06-06

**Navbar — full redesign** (`src/components/ui/layout/Navbar.tsx`)
- Replaced the original right-aligned layout with: hamburger (left) | logo (centred) | search + cart + auth (right)
- Hamburger opens a full-screen overlay with two levels:
  - **Main menu:** Shop →, Lookbook, My Orders, Contact, FAQ, Admin (admin-only), Sign in / Sign out
  - **Shop submenu:** ← back button, then All + each category pulled live from `/api/categories`
- Categories API route created at `src/app/api/categories/route.ts` — returns distinct product categories from the database
- Search bar slides in below the header when the search icon is clicked; pressing Enter navigates to `/?search=...`
- Body scroll is locked when the menu overlay is open
- Menu order (final): Shop, Lookbook, My Orders, Contact, FAQ, Admin, Sign in / Sign out

**Hero carousel** (`src/components/ui/HeroCarousel.tsx`)
- New full-viewport rotating image carousel replaces the static hero section
- Images crossfade every 5 seconds, pause on hover, with dot indicators
- Centred "SHOP" button (white on dark overlay) links to the products section
- Falls back to product images if no carousel images are configured

**Carousel image management**
- New `CarouselImage` Prisma model (`id`, `url`, `createdAt`) — stores carousel image URLs in the database
- Admin page at `src/app/admin/carousel/page.tsx` — paste a Supabase (or any public) image URL to add it to the carousel; images appear in the order they were added; delete on hover
- API route at `src/app/api/admin/carousel/route.ts` — GET / POST / DELETE
- Homepage (`src/app/page.tsx`) fetches carousel URLs from the `CarouselImage` table; falls back to product images if the table is empty
- **Run in Supabase SQL Editor to create the table:**
  ```sql
  CREATE TABLE "CarouselImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CarouselImage_pkey" PRIMARY KEY ("id")
  );
  ```

**Lookbook**
- `LookbookImage` Prisma model added (`id`, `url`, `caption`, `createdAt`)
- Admin page at `src/app/admin/lookbook/page.tsx` rewritten — paste any public image URL (with optional caption); images appear in the public lookbook page; delete by clicking the trash icon
- Public lookbook page (`src/app/lookbook/page.tsx`) converted from client component to server component — reads directly from the `LookbookImage` database table; displays in a masonry grid; captions slide up on hover
- API route at `src/app/api/lookbook/route.ts` — GET / POST / DELETE (POST and DELETE are admin-only)
- **Run in Supabase SQL Editor to create the table:**
  ```sql
  CREATE TABLE "LookbookImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LookbookImage_pkey" PRIMARY KEY ("id")
  );
  ```

**Locale context — currency conversion + language** (`src/store/locale.tsx`)
- `LocaleProvider` wraps the entire app (added to `src/app/layout.tsx`)
- **Currency:** auto-detects visitor country via `ipapi.co` and sets the matching currency (e.g. Nigeria → NGN ₦, UK → GBP); preference saved to localStorage; exchange rates fetched from `open.er-api.com/v6/latest/CAD`; `formatPrice(cadPrice)` converts and formats in the selected currency
- **Language:** 12 languages supported (English, French, Spanish, German, Portuguese, Italian, Dutch, Japanese, Chinese, Korean, Arabic, Hindi); full UI translation strings for all key labels, buttons, and nav items; preference saved to localStorage
- `FooterLocale` component updated to read from and write to the locale context; currency/language dropdowns now have explicit white background and black text so they are readable in all themes
- 15 currencies available in the selector with country/currency auto-detection

**FAQ page** (`src/app/faq/page.tsx`)
- 12 accordion-style questions covering sizing, shipping, returns, payments, tracking, currency, and damaged items
- Native `<details>`/`<summary>` accordion — no JS library needed; + icon rotates to × when open
- Links to `/contact` at top and bottom

**Contact page** (`src/app/contact/page.tsx`)
- Form with name, email, subject, and message fields
- On submit: opens the user's mail client pre-filled with `support@mystore.com` as recipient
- Shows a success state with fallback direct email link
- Hours and response time displayed below the form

**Admin sidebar** (`src/components/admin/AdminSidebar.tsx`)
- Added **Carousel** (Images icon) and **Lookbook** (BookImage icon) navigation links below Orders
- Both items highlight as active when navigating to their respective admin pages

---

### 2026-06-07

**Carousel — database-backed image management**
- Resolved persistent Supabase Storage listing issues (RLS policies blocking anon `list()` calls, double URL-encoding bug from `encodeURIComponent` applied to an already-encoded bucket name)
- Final architecture: carousel image URLs are stored in the `CarouselImage` database table; the homepage reads from the table with a simple `prisma.carouselImage.findMany()` — no bucket listing, no RLS dependency
- Admin UI at `/admin/carousel` allows pasting any public image URL (Supabase or otherwise) to add it to the rotation

**Admin lookbook page rewrite**
- Replaced the file-upload-based admin lookbook with the same URL-paste approach as the carousel
- Supports an optional caption field; captions are shown on the public lookbook page on image hover
- Uses the existing `/api/lookbook` endpoints (GET / POST / DELETE)

**Hamburger menu — final item order**
- Reordered to: Shop, Lookbook, My Orders, Contact, FAQ, Admin (admin-only), Sign in / Sign out

---

## Built With
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