import { Suspense } from 'react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutForm />
    </Suspense>
  )
}
