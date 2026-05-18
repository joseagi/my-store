import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [
    totalOrders,
    paidOrders,
    totalProducts,
    totalUsers,
    revenueResult,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: { select: { name: true } } },
        },
      },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 10 } },
      orderBy: { stock: 'asc' },
      take: 5,
    }),
  ])

  return {
    totalOrders,
    paidOrders,
    totalProducts,
    totalUsers,
    totalRevenue: revenueResult._sum.total ?? 0,
    recentOrders,
    lowStockProducts,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      label: 'Total revenue',
      value: formatPrice(stats.totalRevenue),
      icon: TrendingUp,
      sub: `${stats.paidOrders} paid orders`,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      sub: `${stats.paidOrders} paid`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      sub: `${stats.lowStockProducts.length} low stock`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Customers',
      value: stats.totalUsers.toString(),
      icon: Users,
      sub: 'registered users',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    PAID: 'bg-green-50 text-green-700',
    SHIPPED: 'bg-blue-50 text-blue-700',
    DELIVERED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-700',
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Store overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div
            key={card.label}
            className="bg-background border rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">
                {card.label}
              </p>
              <div className={`${card.bg} p-2 rounded-lg`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent orders */}
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-medium">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                No orders yet
              </p>
            ) : (
              stats.recentOrders.map(order => {
                const address = order.address as { firstName?: string; lastName?: string } | null
                return (
                  <div
                    key={order.id}
                    className="px-5 py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium font-mono">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {address?.firstName} {address?.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatPrice(order.total)}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Low stock alert */}
        <div className="bg-background border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-medium">Low stock alert</h2>
            <Link
              href="/admin/products"
              className="text-xs text-primary hover:underline"
            >
              Manage
            </Link>
          </div>
          <div className="divide-y">
            {stats.lowStockProducts.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                All products well stocked ✓
              </p>
            ) : (
              stats.lowStockProducts.map(product => (
                <div
                  key={product.id}
                  className="px-5 py-3 flex items-center justify-between"
                >
                  <p className="text-sm font-medium truncate pr-4">
                    {product.name}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    product.stock === 0
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {product.stock === 0
                      ? 'Out of stock'
                      : `${product.stock} left`
                    }
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}