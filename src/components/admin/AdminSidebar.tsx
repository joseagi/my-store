'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ArrowLeft,
  Store,
  Menu,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
    exact: false,
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    icon: ShoppingBag,
    exact: false,
  },
]

function SidebarContent() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b">
        <div className="flex items-center gap-2 font-semibold">
          <Store className="h-4 w-4" />
          <span>Admin Panel</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Back to store */}
      <div className="px-2 py-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to store
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <>
      {/* Mobile sidebar — Sheet */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="font-semibold text-sm">Admin Panel</span>
      </div>

      {/* Desktop sidebar — static */}
      <aside className="hidden md:flex w-56 min-h-screen bg-background border-r flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}