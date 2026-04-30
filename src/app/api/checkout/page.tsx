import { Suspense } from 'react'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-48 bg-muted rounded-xl" />
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  )
}