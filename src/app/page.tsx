import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/ui/products/ProductGrid'
import { CategoryTabs } from '@/components/ui/products/CategoryTabs'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

async function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCategories() {
  const products = await prisma.product.findMany({
    select: { category: true },
    where: { stock: { gt: 0 } },
    distinct: ['category'],
  })
  return [
    'All',
    ...products
      .map(p => p.category)
      .filter((c): c is string => c !== null),
  ]
}

interface Props {
  // SearchParams is now a promise in Next.js 15
  searchParams: Promise<{ category?: string }>
}
export default async function HomePage({ searchParams }: Props) {
  // ✅ Await it before using
  const { category } = await searchParams

  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ])

  const heroProduct = products[0]

  return (
    <div>
      {/* Hero */}
      <section className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              New Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Quality that<br />speaks for itself
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto md:mx-0">
              Carefully selected products built to last.
              Free delivery on orders over £50.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <a href="#products">
                <Button size="lg">Shop now</Button>
              </a>
            </div>
          </div>

          {heroProduct && (
            <div className="flex-1 relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden">
              <Image
                src={heroProduct.images[0]}
                alt={heroProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 text-xs text-muted-foreground">
            <span>✓ Free delivery over £50</span>
            <span>✓ 30-day returns</span>
            <span>✓ Secure checkout</span>
            <span>✓ UK-based support</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">
            {category ?? 'All Products'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {products.length} items
          </span>
        </div>

        <Suspense>
          <CategoryTabs categories={categories} />
        </Suspense>

        <ProductGrid products={products} />
      </section>
    </div>
  )
}