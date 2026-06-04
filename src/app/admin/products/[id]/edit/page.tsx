import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return notFound()

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
        <h1 className="text-2xl font-semibold">Edit product</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Editing <span className="font-medium text-foreground">{product.name}</span>
        </p>
      </div>

      <ProductForm
        mode="edit"
        initialData={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category ?? undefined,
          images: product.images,
          sizes: product.sizes,
        }}
      />
    </div>
  )
}
