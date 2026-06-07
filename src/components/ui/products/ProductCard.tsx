'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { useLocale } from '@/store/locale'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  category?: string | null
}

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product
  index?: number
}) {
  const { formatPrice, t } = useLocale()

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow bg-background block"
    >
      <div className="relative aspect-square bg-muted overflow-hidden">
        <Image
          src={product.images[0] ?? '/placeholder.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={index < 4}
        />
        {product.stock > 0 && product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-amber-500 text-white">
            Only {product.stock} left
          </Badge>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="secondary">{t('outOfStock')}</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
        )}
        <h3 className="font-heading font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base font-semibold mt-3">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
