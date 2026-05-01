import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AddToCartButton } from '@/components/ui/products/AddToCartButton'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })
  if (!product) return { title: 'Product not found' }
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.images[0]] },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) notFound()

  const isLowStock = product.stock > 0 && product.stock < 10
  const isOutOfStock = product.stock === 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

        {/* Image */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary"
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {product.category && (
            <span className="text-sm text-muted-foreground uppercase tracking-widest">
              {product.category}
            </span>
          )}

          <h1 className="text-3xl font-semibold leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
              }).format(product.price)}
            </span>
            {isLowStock && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-300 bg-amber-50"
              >
                Only {product.stock} left
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="outline" className="text-destructive">
                Out of stock
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Trust signals */}
          <div className="space-y-2 text-sm text-muted-foreground border rounded-xl p-4 bg-muted/30">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <span>Free delivery on orders over £50</span>
            </div>
            <div className="flex items-center gap-2">
              <span>↩️</span>
              <span>30-day hassle-free returns</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>Secure checkout via Stripe</span>
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  )
}