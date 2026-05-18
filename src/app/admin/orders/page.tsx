import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
  })

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} total orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-background border rounded-xl p-12 text-center">
          <p className="text-muted-foreground">
            No orders yet. They will appear here once customers purchase.
          </p>
        </div>
      ) : (
        <div className="bg-background border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Order
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                  Items
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Total
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map(order => {
                const address = order.address as { firstName?: string; lastName?: string; email?: string } | null
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs font-medium">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="font-medium">
                        {address?.firstName} {address?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {address?.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-muted-foreground text-xs truncate max-w-48">
                        {order.items
                          .map(i => i.product.name)
                          .join(', ')
                        }
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusSelect
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString(
                        'en-GB',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}