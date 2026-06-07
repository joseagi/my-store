'use client'

import { useMounted } from '@/hooks/useMounted' 
import Link from 'next/link'
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { CartItem } from './CartItem'
import { useLocale } from '@/store/locale'

export function CartDrawer() {
  const { items, total, itemCount } = useCartStore()
  const { t, formatPrice } = useLocale()
  const count = itemCount()
  const orderTotal = total()
  const shippingCost = orderTotal >= 75 ? 0 : 8.99
  const grandTotal = orderTotal + shippingCost

 
 const mounted = useMounted()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {mounted && count > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('yourCart')}
            {mounted && count > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({count} {count === 1 ? 'item' : 'items'})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {!mounted || items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="bg-muted rounded-full p-6">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{t('cartEmpty')}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('startShopping')}
              </p>
            </div>
            <SheetTrigger asChild>
              <Link href="/">
                <Button variant="outline">Continue shopping</Button>
              </Link>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map(item => (
                <CartItem key={item.cartKey} item={item} />
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('shipping')}</span>
                  <span>
                    {shippingCost === 0
                      ? <span className="text-green-600 font-medium">{t('free')}</span>
                      : formatPrice(shippingCost)
                    }
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-2">
                  <span>{t('total')}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {orderTotal < 75 && (
                <p className="text-xs text-center text-muted-foreground bg-muted rounded-lg py-2 px-3">
                  Add {formatPrice(75 - orderTotal)} more for free delivery
                </p>
              )}

              <SheetTrigger asChild>
                <Link href="/checkout" className="block">
                  <Button className="w-full gap-2" size="lg">
                    {t('checkout')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </SheetTrigger>

              <SheetTrigger asChild>
                <Link href="/cart" className="block">
                  <Button variant="ghost" className="w-full text-sm" size="sm">
                    {t('viewFullCart')}
                  </Button>
                </Link>
              </SheetTrigger>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}