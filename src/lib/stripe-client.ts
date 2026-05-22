import { loadStripe } from '@stripe/stripe-js'

// Client-side Stripe.js — used to redirect to Stripe Checkout
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)