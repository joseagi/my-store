export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  PAID:      'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED:   'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: true, slug: true },
          },
        },
      },
      user: {
        select: { name: true, email: true },
      },
    },
  })

  if (!order) return notFound()

  type Address = {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
    apartment?: string
    city?: string
    region?: string
    postcode?: string
    country?: string
  }

  const address = (order.address ?? {}) as Address
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = order.total - subtotal

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to orders
          </Link>
          <h1 className="text-2xl font-semibold">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-CA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs font-medium px-3 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? ''}`}>
            {order.status}
          </span>
          <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — items + totals */}
        <div className="lg:col-span-2 space-y-6">

          {/* Order items */}
          <div className="bg-background border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">
                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
              </h2>
            </div>
            <div className="divide-y">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.size && (
                        <span className="inline-flex items-center mr-2 px-1.5 py-0.5 rounded bg-muted font-heading uppercase tracking-wide">
                          {item.size}
                        </span>
                      )}
                      {formatPrice(item.price)} each · qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t bg-muted/20 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>
                  {shipping === 0
                    ? <span className="text-green-600 font-medium">Free</span>
                    : formatPrice(shipping)
                  }
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {order.stripeId && (
            <div className="bg-background border rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-sm">Payment</h2>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stripe session</span>
                <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                  {order.stripeId.slice(0, 24)}…
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment status</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                }`}>
                  {order.status === 'PENDING' ? 'Awaiting payment' : 'Paid'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right — customer + shipping */}
        <div className="space-y-6">

          {/* Customer */}
          <div className="bg-background border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Customer</h2>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {address.firstName} {address.lastName}
              </p>
              {address.email && (
                <a
                  href={`mailto:${address.email}`}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors block"
                >
                  {address.email}
                </a>
              )}
              {address.phone && (
                <p className="text-muted-foreground">{address.phone}</p>
              )}
              {order.user && (
                <p className="text-xs text-muted-foreground pt-1 border-t mt-2">
                  Account: {order.user.email}
                </p>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-background border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Ship to</h2>
            </div>
            <address className="not-italic text-sm space-y-0.5 text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">
                {address.firstName} {address.lastName}
              </p>
              {address.address && <p>{address.address}</p>}
              {address.apartment && <p>{address.apartment}</p>}
              <p>
                {[address.city, address.region, address.postcode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {address.country && <p>{address.country}</p>}
            </address>

            {/* Quick copy for labels */}
            <div className="mt-4 pt-3 border-t">
              <p className="text-xs text-muted-foreground mb-1.5">Full address (copy for label)</p>
              <p className="text-xs font-mono bg-muted rounded p-2 leading-relaxed select-all">
                {[
                  `${address.firstName} ${address.lastName}`,
                  address.address,
                  address.apartment,
                  [address.city, address.region, address.postcode].filter(Boolean).join(', '),
                  address.country,
                ]
                  .filter(Boolean)
                  .join('\n')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
