import Link from 'next/link'
import { Store } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-semibold mb-3">
              <Store className="h-4 w-4" />
              My Store
            </div>
            <p className="text-sm text-muted-foreground">
              Quality products, delivered fast.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">All Products</Link></li>
              <li><Link href="/cart" className="hover:text-primary">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} My Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}