export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { Package } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const statusColors: Record<string, string> = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID:      'bg-green-50 text-green-700 border-green-200',
  SHIPPED:   'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/orders')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: { select: { name: true, images: true } } },
        take: 3, // Show first 3 items as preview
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-6">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>
          <p className="font-medium">No orders yet</p>
          <p className="text-muted-foreground text-sm">
            Your order history will appear here.
          </p>
          <Link href="/">
            <Button variant="outline">Start shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const address = order.address as { city?: string } | null
            return (
              <div key={order.id} className="border rounded-xl overflow-hidden">
                {/* Order header */}
                <div className="bg-muted/40 px-5 py-3 flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-5 py-4 space-y-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name}
                        <span className="text-xs ml-1">× {item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div className="border-t px-5 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    Total: {formatPrice(order.total)}
                  </span>
                  {address?.city && (
                    <span className="text-xs text-muted-foreground">
                      Shipping to {address.city}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}