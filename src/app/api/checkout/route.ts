import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

// Never statically analyse this route
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// ✅ Proper types — no more any
const checkoutBodySchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    image: z.string(),
    quantity: z.number().int().positive(),
    slug: z.string(),
  })),
  shippingAddress: z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    postcode: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
})

// Infer types from schema
type CartItem = {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json()

    const parsed = checkoutBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, shippingAddress } = parsed.data

    // Re-fetch prices from DB — never trust client prices
    const productIds = items.map((i: CartItem) => i.id)
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    // Verify items and override with DB prices
    const verifiedItems = items.map((item: CartItem) => {
      const dbProduct = dbProducts.find(p => p.id === item.id)
      if (!dbProduct) throw new Error(`Product ${item.id} not found`)
      if (dbProduct.stock < item.quantity) {
        throw new Error(`Not enough stock for ${dbProduct.name}`)
      }
      return { ...item, price: dbProduct.price }
    })

    const subtotal = verifiedItems.reduce(
      (sum: number, i: CartItem) => sum + i.price * i.quantity,
      0
    )
    const shippingCost = subtotal >= 50 ? 0 : 4.99
    const total = subtotal + shippingCost

    // Create order in DB with PENDING status
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        total,
        status: 'PENDING',
        address: shippingAddress,
        items: {
          create: verifiedItems.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Build Stripe line items with proper typing
    const lineItems = [
      ...verifiedItems.map((item: CartItem) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
    ]

    // Add shipping as line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: { 
           name: 'Standard Shipping',
           images:[],
        },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: shippingAddress.email,
      metadata: {
        orderId: order.id,
        userId: session?.user?.id ?? 'guest',
      },
      success_url: `${process.env.NEXTAUTH_URL}/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=true`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    })

    return NextResponse.json({ url: stripeSession.url })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed'
    console.error('Checkout error:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}