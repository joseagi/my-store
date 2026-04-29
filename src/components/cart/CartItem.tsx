'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    image: string
    slug: string
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-3">
      <Link href={`/products/${item.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover hover:scale-105 transition-transform"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.slug}`}>
          <p className="font-medium text-sm leading-tight hover:text-primary truncate">
            {item.name}
          </p>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatPrice(item.price)} each
        </p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive ml-auto"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="text-sm font-semibold flex-shrink-0">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  )
}