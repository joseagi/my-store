'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  slug: string
  stock: number
}

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  if (product.stock === 0) {
    return (
      <Button size="lg" disabled className="w-full">
        Out of stock
      </Button>
    )
  }

  function handleAdd() {
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
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={handleAdd}
    >
      {added ? (
        <>
          <Check className="h-5 w-5" />
          Added to cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          Add to cart — {new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
          }).format(product.price)}
        </>
      )}
    </Button>
  )
}