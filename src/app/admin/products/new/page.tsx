import { ProductForm } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to products
        </Link>
        <h1 className="text-2xl font-semibold">Add product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details below to add a new product to your store.
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}
