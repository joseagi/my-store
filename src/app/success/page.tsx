'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from '@/lib/schemas'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useMounted } from '@/hooks/useMounted'

// Progress steps indicator
const STEPS = ['Cart', 'Shipping', 'Payment']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="hidden sm:flex items-center gap-2 text-sm">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          {i > 0 && <div className="h-px w-8 bg-border" />}
          <div className={`flex items-center gap-1.5 ${
            i === current
              ? 'text-primary font-medium'
              : i < current
              ? 'text-muted-foreground'
              : 'text-muted-foreground'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium ${
              i === current
                ? 'bg-primary text-primary-foreground'
                : i < current
                ? 'bg-muted text-muted-foreground'
                : 'border border-muted-foreground/30 text-muted-foreground'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            {step}
          </div>
        </div>
      ))}
    </div>
  )
}

// Reusable form field component
function FormField({
  label,
  id,
  error,
  optional,
  children,
}: {
  label: string
  id: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && (
          <span className="text-muted-foreground font-normal ml-1 text-xs">
            (optional)
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  )
}

export function CheckoutForm() {
  const { items, total } = useCartStore()
  const orderTotal = total()
  const shippingCost = orderTotal >= 50 ? 0 : 4.99
  const grandTotal = orderTotal + shippingCost
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const mounted = useMounted()

  // Show cancelled toast if redirected back from Stripe
  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
      toast({
        title: 'Payment cancelled',
        description: 'Your order was not placed. Your cart is still saved.',
      })
    }
  }, [])

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart')
    }
  }, [mounted, items, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'GB' },
  })

  async function onSubmit(data: CheckoutFormData) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingAddress: data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Checkout failed')
      }

      if (!result.url) {
        throw new Error('No checkout URL returned from Stripe')
      }

      // Redirect to Stripe hosted checkout
      window.location.assign(result.url)

    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again.'

      toast({
        title: 'Checkout failed',
        description: message,
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
    // Don't reset isSubmitting on success —
    // keep button disabled while redirecting to Stripe
  }

  if (!mounted || items.length === 0) return null

  return (
    <div className="min-h-screen bg-muted/20">

      {/* Checkout header */}
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg">
            My Store
          </Link>
          <StepIndicator current={1} />
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to cart
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left — Shipping form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Contact section */}
              <section className="bg-background border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  Contact information
                </h2>

                <FormField
                  label="Email address"
                  id="email"
                  error={errors.email?.message}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                </FormField>

                <FormField
                  label="Phone number"
                  id="phone"
                  optional
                >
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+44 7700 900000"
                    autoComplete="tel"
                    {...register('phone')}
                  />
                </FormField>
              </section>

              {/* Shipping address section */}
              <section className="bg-background border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  Shipping address
                </h2>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="First name"
                    id="firstName"
                    error={errors.firstName?.message}
                  >
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      autoComplete="given-name"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                  </FormField>

                  <FormField
                    label="Last name"
                    id="lastName"
                    error={errors.lastName?.message}
                  >
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      autoComplete="family-name"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Street address"
                  id="address"
                  error={errors.address?.message}
                >
                  <Input
                    id="address"
                    placeholder="123 Example Street, Apt 4"
                    autoComplete="street-address"
                    {...register('address')}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                </FormField>

                {/* City + Postcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="City"
                    id="city"
                    error={errors.city?.message}
                  >
                    <Input
                      id="city"
                      placeholder="London"
                      autoComplete="address-level2"
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                  </FormField>

                  <FormField
                    label="Postcode"
                    id="postcode"
                    error={errors.postcode?.message}
                  >
                    <Input
                      id="postcode"
                      placeholder="SW1A 1AA"
                      autoComplete="postal-code"
                      {...register('postcode')}
                      className={errors.postcode ? 'border-destructive' : ''}
                    />
                  </FormField>
                </div>

                {/* Country */}
                <FormField label="Country" id="country">
                  <select
                    id="country"
                    {...register('country')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="GB">🇬🇧 United Kingdom</option>
                    <option value="IE">🇮🇪 Ireland</option>
                    <option value="US">🇺🇸 United States</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="NG">🇳🇬 Nigeria</option>
                    <option value="GH">🇬🇭 Ghana</option>
                    <option value="ZA">🇿🇦 South Africa</option>
                  </select>
                </FormField>
              </section>

              {/* Submit button */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                <Lock className="h-4 w-4" />
                {isSubmitting
                  ? 'Redirecting to payment...'
                  : 'Continue to payment'
                }
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                🔒 Your payment is encrypted and processed securely by Stripe.
                We never store your card details.
              </p>
            </form>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl p-5 space-y-4 sticky top-24 bg-background">
              <h2 className="font-semibold">Order summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-muted-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <p className="text-sm font-medium shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0
                      ? <span className="text-green-600 font-medium">Free</span>
                      : formatPrice(shippingCost)
                    }
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-muted-foreground bg-muted rounded p-2 text-center">
                    Add {formatPrice(50 - orderTotal)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}