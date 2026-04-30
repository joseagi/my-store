'use client'

import { useCartStore } from '@/store/cart'
import { CartItem } from '@/components/cart/CartItem'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingCart, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react'
import { useMounted } from '@/hooks/useMounted'

export default function CartPage() {
  const { items, total, clearCart } = useCartStore()
  const orderTotal = total()
  const shippingCost = orderTotal >= 50 ? 0 : 4.99
  const grandTotal = orderTotal + shippingCost

  const mounted = useMounted

  // Loading skeleton while cart hydrates from localStorage
  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Your Cart</h1>
        {items.length > 0 && (
          <span className="text-muted-foreground text-sm">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        )}
      </div>

      {items.length === 0 ? (

        /* Empty state */
        <div className="text-center py-20 space-y-5">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-xl font-medium">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you have not added anything yet.
          </p>
          <Link href="/">
            <Button className="mt-2">Start shopping</Button>
          </Link>
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Item list */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="border rounded-xl p-4 bg-background">
                <CartItem item={item} />
              </div>
            ))}

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-2">
              <Link href="/">
                <Button variant="ghost" className="gap-2 text-sm">
                  <ArrowLeft className="h-4 w-4" />
                  Continue shopping
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-sm text-muted-foreground hover:text-destructive"
                onClick={clearCart}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear cart
              </Button>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-xl p-6 space-y-4 sticky top-24 bg-background">
              <h2 className="font-semibold text-lg">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-muted-foreground">
                    <span className="truncate pr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
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
                  <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2 text-center">
                    Add {formatPrice(50 - orderTotal)} more for free delivery
                  </p>
                )}
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link href="/checkout">
                <Button className="w-full gap-2" size="lg">
                  Proceed to checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* Trust signals */}
              <div className="text-xs text-muted-foreground space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure checkout via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>↩️</span>
                  <span>30-day hassle-free returns</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}