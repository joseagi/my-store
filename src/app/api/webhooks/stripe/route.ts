import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Tell Next.js this route is always dynamic — never statically analysed
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'


export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing signature' }, 
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    )
  }

  switch (event.type) {

    case 'checkout.session.completed': {
      // ✅ Fixed: Stripe.Checkout.Session not Stripe.CheckoutSession
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (!orderId) break

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          stripeId: session.id,
        },
      })

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
      })

      await Promise.all(
        orderItems.map(item =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      )

      console.log(`Order ${orderId} paid via Stripe session ${session.id}`)
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' },
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent
      console.error(`Payment failed for intent: ${intent.id}`)
      break
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}