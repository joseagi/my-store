'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Store, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import { CartDrawer } from '@/components/cart/CartDrawer'

import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

/* ===================
  Auth Button Component
======================= */
function AuthButton() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link href="/login">
        <Button size="sm">Sign in</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? 'User'}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {session.user?.name?.[0] ?? '?'}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{session.user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/orders">My Orders</Link>
        </DropdownMenuItem>
        {session.user?.role === 'ADMIN' && (
          <DropdownMenuItem asChild>
            <Link href="/admin">Admin Panel</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/*================
  Navbar Component
=================*/
export function Navbar() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Store className="h-5 w-5" />
          16K
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CartDrawer />
          

          {/* Auth button */}
          <AuthButton />

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg">Shop</Link>
                <Link href="/about" className="text-lg">About</Link>
                <Link href="/login" className="text-lg">Sign in</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}