import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { items, shippingAddress } = await req.json()

  // Create order in DB first (PENDING status)
  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id,
      total: items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0),
      status: 'PENDING',
      address: shippingAddress,
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      }
    }
  })

  // Create Stripe checkout session
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses pence
      },
      quantity: item.quantity,
    })),
    metadata: { orderId: order.id },
    success_url: `${process.env.NEXTAUTH_URL}/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
  })

  return NextResponse.json({ url: stripeSession.url })
}
