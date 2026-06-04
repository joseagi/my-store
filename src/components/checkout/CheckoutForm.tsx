'use client'

import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutSchema, type CheckoutFormData } from '@/lib/schemas'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useMounted } from '@/hooks/useMounted'

// ─── Country list ────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'GB', name: '🇬🇧 United Kingdom' },
  { code: 'IE', name: '🇮🇪 Ireland' },
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'CA', name: '🇨🇦 Canada' },
  { code: 'AU', name: '🇦🇺 Australia' },
  { code: 'NZ', name: '🇳🇿 New Zealand' },
  { code: 'AT', name: '🇦🇹 Austria' },
  { code: 'BE', name: '🇧🇪 Belgium' },
  { code: 'DK', name: '🇩🇰 Denmark' },
  { code: 'FI', name: '🇫🇮 Finland' },
  { code: 'FR', name: '🇫🇷 France' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'GR', name: '🇬🇷 Greece' },
  { code: 'IT', name: '🇮🇹 Italy' },
  { code: 'NL', name: '🇳🇱 Netherlands' },
  { code: 'NO', name: '🇳🇴 Norway' },
  { code: 'PL', name: '🇵🇱 Poland' },
  { code: 'PT', name: '🇵🇹 Portugal' },
  { code: 'ES', name: '🇪🇸 Spain' },
  { code: 'SE', name: '🇸🇪 Sweden' },
  { code: 'CH', name: '🇨🇭 Switzerland' },
  { code: 'GH', name: '🇬🇭 Ghana' },
  { code: 'KE', name: '🇰🇪 Kenya' },
  { code: 'NG', name: '🇳🇬 Nigeria' },
  { code: 'ZA', name: '🇿🇦 South Africa' },
  { code: 'BR', name: '🇧🇷 Brazil' },
  { code: 'IN', name: '🇮🇳 India' },
  { code: 'JP', name: '🇯🇵 Japan' },
  { code: 'SG', name: '🇸🇬 Singapore' },
  { code: 'AE', name: '🇦🇪 United Arab Emirates' },
]

// ─── Country-specific field config ───────────────────────────────────────────

type CountryConfig = {
  regionLabel: string
  regionOptional: boolean
  regionOptions: string[] | null
  postcodeLabel: string
  postcodePlaceholder: string
  phonePlaceholder: string
  cityLabel: string
}

const DEFAULT_CONFIG: CountryConfig = {
  regionLabel: 'State / Region',
  regionOptional: true,
  regionOptions: null,
  postcodeLabel: 'Postal code',
  postcodePlaceholder: '',
  phonePlaceholder: '',
  cityLabel: 'City',
}

const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  GB: {
    regionLabel: 'County',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postcode',
    postcodePlaceholder: 'SW1A 1AA',
    phonePlaceholder: '+44 7700 900000',
    cityLabel: 'City / Town',
  },
  IE: {
    regionLabel: 'County',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Eircode',
    postcodePlaceholder: 'D01 F5P2',
    phonePlaceholder: '+353 87 000 0000',
    cityLabel: 'City / Town',
  },
  US: {
    regionLabel: 'State',
    regionOptional: false,
    regionOptions: [
      'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
      'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
      'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
      'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
      'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
      'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
      'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
      'Virginia','Washington','Washington DC','West Virginia','Wisconsin','Wyoming',
    ],
    postcodeLabel: 'ZIP code',
    postcodePlaceholder: '10001',
    phonePlaceholder: '+1 (555) 000-0000',
    cityLabel: 'City',
  },
  CA: {
    regionLabel: 'Province',
    regionOptional: false,
    regionOptions: [
      'Alberta','British Columbia','Manitoba','New Brunswick',
      'Newfoundland and Labrador','Northwest Territories','Nova Scotia',
      'Nunavut','Ontario','Prince Edward Island','Quebec','Saskatchewan','Yukon',
    ],
    postcodeLabel: 'Postal code',
    postcodePlaceholder: 'K1A 0A9',
    phonePlaceholder: '+1 (555) 000-0000',
    cityLabel: 'City',
  },
  AU: {
    regionLabel: 'State / Territory',
    regionOptional: false,
    regionOptions: [
      'Australian Capital Territory','New South Wales','Northern Territory',
      'Queensland','South Australia','Tasmania','Victoria','Western Australia',
    ],
    postcodeLabel: 'Postcode',
    postcodePlaceholder: '2000',
    phonePlaceholder: '+61 4 0000 0000',
    cityLabel: 'Suburb / City',
  },
  NZ: {
    regionLabel: 'Region',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postcode',
    postcodePlaceholder: '1010',
    phonePlaceholder: '+64 21 000 0000',
    cityLabel: 'City / Town',
  },
  DE: {
    regionLabel: 'State',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postcode',
    postcodePlaceholder: '10115',
    phonePlaceholder: '+49 30 000000',
    cityLabel: 'City',
  },
  FR: {
    regionLabel: 'Region',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postal code',
    postcodePlaceholder: '75001',
    phonePlaceholder: '+33 6 00 00 00 00',
    cityLabel: 'City',
  },
  NG: {
    regionLabel: 'State',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postal code',
    postcodePlaceholder: '100001',
    phonePlaceholder: '+234 801 000 0000',
    cityLabel: 'City',
  },
  GH: {
    regionLabel: 'Region',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postal code',
    postcodePlaceholder: 'GA-123-4567',
    phonePlaceholder: '+233 20 000 0000',
    cityLabel: 'City',
  },
  ZA: {
    regionLabel: 'Province',
    regionOptional: true,
    regionOptions: null,
    postcodeLabel: 'Postal code',
    postcodePlaceholder: '8001',
    phonePlaceholder: '+27 71 000 0000',
    cityLabel: 'City / Town',
  },
}

function getConfig(country: string): CountryConfig {
  return COUNTRY_CONFIG[country] ?? DEFAULT_CONFIG
}

// ─── Shared components ────────────────────────────────────────────────────────

const STEPS = ['Cart', 'Information', 'Shipping', 'Payment']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="hidden sm:flex items-center gap-2 text-xs">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          {i > 0 && <div className="h-px w-6 bg-border" />}
          <span className={i === current ? 'text-primary font-medium' : 'text-muted-foreground'}>
            {step}
          </span>
        </div>
      ))}
    </div>
  )
}

function Field({
  label, id, error, optional, children,
}: {
  label: string; id: string; error?: string; optional?: boolean; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {optional && <span className="text-muted-foreground font-normal ml-1 text-xs">(optional)</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

// ─── Main component ───────────────────────────────────────────────────────────

export function CheckoutForm() {
  const { items, total } = useCartStore()
  const orderTotal = total()
  const shippingCost = orderTotal >= 50 ? 0 : 4.99
  const grandTotal = orderTotal + shippingCost
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const cancelledShown = useRef(false)
  const mounted = useMounted()

  useEffect(() => {
    if (searchParams.get('cancelled') === 'true' && !cancelledShown.current) {
      cancelledShown.current = true
      toast({ title: 'Payment cancelled', description: 'Your cart is still saved.' })
    }
  }, [searchParams])

  useEffect(() => {
    if (mounted && items.length === 0) router.push('/cart')
  }, [mounted, items, router])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: 'GB', phone: '', termsAccepted: false },
  })

  const selectedCountry = useWatch({ control, name: 'country' }) ?? 'GB'
  const termsAccepted = useWatch({ control, name: 'termsAccepted' }) ?? false
  const config = getConfig(selectedCountry)

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const { termsAccepted: _, ...shippingAddress } = data
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Checkout failed')
      if (!result.url) throw new Error('No checkout URL returned from Stripe')
      window.location.assign(result.url)
    } catch (error: unknown) {
      toast({
        title: 'Checkout failed',
        description: error instanceof Error ? error.message : 'Something went wrong.',
        variant: 'destructive',
      })
      setIsSubmitting(false)
    }
  }

  if (!mounted || items.length === 0) return null

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-heading uppercase tracking-widest text-sm">
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

          {/* ── Left: form ── */}
          <div className="lg:col-span-3">
            <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} className="space-y-6">

              {/* Contact */}
              <section className="bg-background border rounded-xl p-6 space-y-4">
                <h2 className="font-heading uppercase tracking-widest text-sm">Contact</h2>

                <Field label="Email address" id="email" error={errors.email?.message}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                </Field>

                <Field label="Phone number" id="phone" optional>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={config.phonePlaceholder || '+1 000 000 0000'}
                    autoComplete="tel"
                    {...register('phone')}
                  />
                </Field>
              </section>

              {/* Shipping */}
              <section className="bg-background border rounded-xl p-6 space-y-4">
                <h2 className="font-heading uppercase tracking-widest text-sm">Shipping address</h2>

                {/* Country — first field */}
                <Field label="Country / Region" id="country" error={errors.country?.message}>
                  <select
                    id="country"
                    {...register('country')}
                    className={`${selectClass} ${errors.country ? 'border-destructive' : ''}`}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </Field>

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name" id="firstName" error={errors.firstName?.message}>
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      autoComplete="given-name"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-destructive' : ''}
                    />
                  </Field>
                  <Field label="Last name" id="lastName" error={errors.lastName?.message}>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      autoComplete="family-name"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-destructive' : ''}
                    />
                  </Field>
                </div>

                {/* Address */}
                <Field label="Street address" id="address" error={errors.address?.message}>
                  <Input
                    id="address"
                    placeholder="123 Example Street"
                    autoComplete="street-address"
                    {...register('address')}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                </Field>

                {/* Apartment */}
                <Field label="Apartment, suite, etc." id="apartment" optional>
                  <Input
                    id="apartment"
                    placeholder="Apt 4B"
                    autoComplete="address-line2"
                    {...register('apartment')}
                  />
                </Field>

                {/* City + Region + Postcode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label={config.cityLabel} id="city" error={errors.city?.message}>
                    <Input
                      id="city"
                      autoComplete="address-level2"
                      {...register('city')}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                  </Field>

                  <Field
                    label={config.regionLabel}
                    id="region"
                    optional={config.regionOptional}
                    error={errors.region?.message}
                  >
                    {config.regionOptions ? (
                      <select
                        id="region"
                        {...register('region')}
                        className={`${selectClass} ${errors.region ? 'border-destructive' : ''}`}
                      >
                        <option value="">Select…</option>
                        {config.regionOptions.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id="region"
                        autoComplete="address-level1"
                        {...register('region')}
                        className={errors.region ? 'border-destructive' : ''}
                      />
                    )}
                  </Field>

                  <Field label={config.postcodeLabel} id="postcode" error={errors.postcode?.message}>
                    <Input
                      id="postcode"
                      placeholder={config.postcodePlaceholder}
                      autoComplete="postal-code"
                      {...register('postcode')}
                      className={errors.postcode ? 'border-destructive' : ''}
                    />
                  </Field>
                </div>
              </section>

              {/* Terms */}
              <section className="bg-background border rounded-xl p-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    {...register('termsAccepted')}
                    className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <Link href="/terms" className="underline underline-offset-4 text-foreground hover:text-primary">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/shipping" className="underline underline-offset-4 text-foreground hover:text-primary">
                      Shipping Policy
                    </Link>
                    . I understand that orders cannot be cancelled once dispatched.
                  </span>
                </label>
                {errors.termsAccepted && (
                  <p className="text-xs text-destructive flex items-center gap-1 pl-7">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {errors.termsAccepted.message}
                  </p>
                )}
              </section>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting || !termsAccepted}
              >
                <Lock className="h-4 w-4" />
                {isSubmitting ? 'Redirecting to payment…' : 'Continue to payment'}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                🔒 Payments encrypted and processed by Stripe. We never store card details.
              </p>
            </form>
          </div>

          {/* ── Right: order summary ── */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl p-5 space-y-4 sticky top-24 bg-background">
              <h2 className="font-heading uppercase tracking-widest text-sm">Order summary</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.cartKey} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-muted-foreground text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      {item.size && (
                        <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} each</p>
                    </div>
                    <p className="text-sm font-medium shrink-0">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

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
