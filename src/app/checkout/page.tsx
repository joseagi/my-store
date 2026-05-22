'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const checkoutSchema = z.object({
  email: z.email('Enter a valid email'),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  address: z.string().min(1, 'Required'),
  city: z.string().min(1, 'Required'),
  postcode: z.string().min(1, 'Required'),
  country: z.string().min(1, 'Required'),
  phone: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items } = useCartStore()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  useEffect(() => {
    if (searchParams.get('cancelled') === 'true') {
      toast({
        title: 'Payment cancelled',
        description: 'Your order was not placed. Your cart is still saved.',
      })
    }
  }, [searchParams, toast])

  async function onSubmit(data: CheckoutFormData) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress: data }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error ?? 'Checkout failed')
      }

      if (!result.url) {
        throw new Error('No checkout URL returned')
      }

      // Keep button disabled while redirecting to Stripe
      window.location.assign(result.url)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      console.error('Checkout error:', error)
      toast({
        title: 'Checkout failed',
        description: message,
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...register('firstName')} />
            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register('lastName')} />
            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" type="tel" {...register('phone')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register('address')} />
          {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="postcode">Postcode</Label>
            <Input id="postcode" {...register('postcode')} />
            {errors.postcode && <p className="text-xs text-destructive">{errors.postcode.message}</p>}
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register('country')} />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Redirecting to payment…' : 'Proceed to payment'}
        </Button>
      </form>
    </div>
  )
}
