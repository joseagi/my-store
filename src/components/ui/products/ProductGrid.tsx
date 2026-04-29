import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  category?: string | null
}

export function ProductGrid({
  products,
}: {
  products: Product[]
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}