export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} products total
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Link>
      </div>

      <div className="bg-background border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Product
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Category
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                Stock
              </th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map(product => (
              <tr
                key={product.id}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden bg-muted">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        /{product.slug}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                  {product.category ?? '—'}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    product.stock === 0
                      ? 'bg-red-50 text-red-700'
                      : product.stock <= 10
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {product.stock === 0
                      ? 'Out of stock'
                      : `${product.stock} in stock`
                    }
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <DeleteProductButton
                      id={product.id}
                      name={product.name}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}