import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  category?: string
}

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(state => state.addItem)

  return (
    <div className="group border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.stock < 5 && product.stock > 0 && (
            <Badge className="absolute top-2 right-2 bg-amber-500">
              Only {product.stock} left
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium hover:text-primary truncate">{product.name}</h3>
        </Link>
        {product.category && (
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-semibold">£{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            onClick={() => addItem({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.images[0],
              slug: product.slug,
            })}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>
      </div>
    </div>
  )
}