'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import { Check, ShoppingCart } from 'lucide-react'

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
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

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
            <Badge variant="secondary">Sold out</Badge>
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
        <div className="flex items-center justify-between mt-3 gap-2">
          <span className="text-base font-semibold">
            {formatPrice(product.price)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={product.stock === 0 || added}
            className="gap-1 text-xs px-2 shrink-0 relative z-10"
          >
            {added ? (
              <>
                <Check className="h-3 w-3" />
                <span className="hidden sm:inline">Added</span>
                <span className="sm:hidden">✓</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" />
                <span className="hidden sm:inline">Add</span>
                <span className="sm:hidden">+</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}
