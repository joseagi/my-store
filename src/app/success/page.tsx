import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { CheckCircle, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ClearCartOnSuccess } from '@/components/cart/ClearCartOnSuccess'
import { type CheckoutFormData } from '@/lib/schemas'

interface Props {
  searchParams: { orderId?: string; session_id?: string }
}

export default async function SuccessPage({ searchParams }: Props) {
  // Await searchParams first
  const { orderId, session_id } = await searchParams

  if (!orderId || !session_id) redirect('/')

  // Verify Stripe session is real and paid
  const stripeSession = await stripe.checkout.sessions.retrieve(session_id)
  if (stripeSession.payment_status !== 'paid') redirect('/')

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  if (!order) redirect('/')

  const address = order.address as CheckoutFormData

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <ClearCartOnSuccess />

      {/* Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="flex justify-center">
          <div className="bg-green-50 rounded-full p-5">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold">Order confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We&apos;ll send a confirmation
          to <strong>{address?.email}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          Order reference:{' '}
          <code className="bg-muted px-2 py-0.5 rounded text-xs">
            {order.id.slice(0, 8).toUpperCase()}
          </code>
        </p>
      </div>

      {/* Order items */}
      <div className="border rounded-xl overflow-hidden mb-6">
        <div className="bg-muted/40 px-5 py-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">Order details</span>
        </div>
        <div className="divide-y">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t bg-muted/20 px-5 py-4">
          <div className="flex justify-between font-semibold">
            <span>Total paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping address */}
      <div className="border rounded-xl px-5 py-4 mb-8 space-y-1">
        <p className="font-medium text-sm mb-2">Shipping to</p>
        <p className="text-sm text-muted-foreground">
          {address?.firstName} {address?.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{address?.address}</p>
        <p className="text-sm text-muted-foreground">
          {address?.city}, {address?.postcode}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto">
            Continue shopping
          </Button>
        </Link>
        <Link href="/orders">
          <Button className="w-full sm:w-auto">
            View all orders
          </Button>
        </Link>
      </div>
    </div>
  )
}