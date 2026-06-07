export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { ProductGrid } from '@/components/ui/products/ProductGrid'
import { CategoryTabs } from '@/components/ui/products/CategoryTabs'
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { Suspense } from 'react'

async function getCarouselImages(): Promise<string[]> {
  const rows = await prisma.carouselImage.findMany({ orderBy: { createdAt: 'asc' } })
  return rows.map(r => r.url)
}

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
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { category } = await searchParams

  const [products, categories, carouselImages] = await Promise.all([
    getProducts(category),
    getCategories(),
    getCarouselImages(),
  ])

  // Use Carousel Pictures bucket; fall back to product images if bucket is empty
  const heroImages = carouselImages.length > 0
    ? carouselImages
    : products.filter(p => p.images.length > 0).slice(0, 5).map(p => p.images[0])

  return (
    <div>
      <HeroCarousel images={heroImages} />

      {/* Trust bar */}
      <section className="border-b bg-background">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-4 md:gap-10 text-xs text-muted-foreground">
            <span>✓ Free delivery over CA$75</span>
            <span>✓ 30-day returns</span>
            <span>✓ Secure checkout</span>
            <span>✓ Canada-based support</span>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold">
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
