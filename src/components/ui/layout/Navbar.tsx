'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ChevronRight, ArrowLeft } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { CartDrawer } from '@/components/cart/CartDrawer'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/store/locale'

type MenuState = 'closed' | 'main' | 'shop'

function AuthButton() {
  const { data: session } = useSession()
  const { t } = useLocale()
  if (!session) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          {session.user?.image ? (
            <Image src={session.user.image} alt={session.user.name ?? 'User'} fill sizes="32px" className="rounded-full object-cover" />
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
        <DropdownMenuItem asChild><Link href="/orders">{t('myOrders')}</Link></DropdownMenuItem>
        {session.user?.role === 'ADMIN' && (
          <DropdownMenuItem asChild><Link href="/admin">{t('admin')}</Link></DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut({ callbackUrl: '/' })}>
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HamburgerIcon() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden="true">
      <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function MainMenu({ onShop, onClose, session, onSignOut }: {
  onShop: () => void
  onClose: () => void
  session: ReturnType<typeof useSession>['data']
  onSignOut: () => void
}) {
  const { t } = useLocale()
  const row = 'font-heading uppercase tracking-widest text-2xl md:text-3xl py-5 border-b border-border/30 flex items-center justify-between w-full text-left hover:text-muted-foreground transition-colors'
  return (
    <div className="px-6 pt-8 pb-10">
      <nav className="space-y-0">
        <button onClick={onShop} className={row}>
          <span>{t('shop')}</span>
          <ChevronRight className="h-5 w-5" />
        </button>
        <Link href="/lookbook" onClick={onClose} className={`${row} block`}>{t('lookbook')}</Link>
        {session && <Link href="/orders" onClick={onClose} className={`${row} block`}>{t('myOrders')}</Link>}
        <Link href="/contact" onClick={onClose} className={`${row} block`}>{t('contact')}</Link>
        <Link href="/faq" onClick={onClose} className={`${row} block`}>{t('faq')}</Link>
        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin" onClick={onClose} className={`${row} block`}>{t('admin')}</Link>
        )}
        {!session && <Link href="/login" onClick={onClose} className={`${row} block`}>{t('signIn')}</Link>}
        {session && (
          <button onClick={onSignOut} className={`${row} text-muted-foreground text-xl`}>{t('signOut')}</button>
        )}
      </nav>
    </div>
  )
}

function ShopMenu({ categories, onBack, onClose }: {
  categories: string[]
  onBack: () => void
  onClose: () => void
}) {
  const { t } = useLocale()
  const row = 'font-heading uppercase tracking-widest text-2xl md:text-3xl py-5 border-b border-border/30 block w-full text-left hover:text-muted-foreground transition-colors'
  return (
    <div className="px-6 pt-8 pb-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-heading uppercase tracking-widest text-muted-foreground mb-8 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('shop')}
      </button>
      <nav className="space-y-0">
        <Link href="/" onClick={onClose} className={row}>{t('all')}</Link>
        {categories.length === 0 && (
          <p className="text-muted-foreground text-sm py-4">Loading...</p>
        )}
        {categories.map(cat => (
          <Link
            key={cat}
            href={`/?category=${encodeURIComponent(cat)}`}
            onClick={onClose}
            className={row}
          >
            {cat}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function Navbar() {
  const [menuState, setMenuState] = useState<MenuState>('closed')
  const [categories, setCategories] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session } = useSession()
  const { t } = useLocale()

  useEffect(() => {
    if (menuState === 'shop' && categories.length === 0) {
      fetch('/api/categories')
        .then(r => r.json())
        .then(d => setCategories((d as { categories: string[] }).categories ?? []))
        .catch(() => {})
    }
  }, [menuState, categories.length])

  useEffect(() => {
    document.body.style.overflow = menuState !== 'closed' ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuState])

  const closeMenu = () => setMenuState('closed')

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-16 bg-background/95 backdrop-blur border-b border-border/30 flex items-center px-4">
        <div className="flex-1 flex items-center">
          {menuState !== 'closed' ? (
            <button onClick={closeMenu} aria-label="Close menu" className="p-1">
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button onClick={() => setMenuState('main')} aria-label="Open menu" className="p-1">
              <HamburgerIcon />
            </button>
          )}
        </div>

        <Link href="/" onClick={closeMenu} className="font-heading uppercase tracking-widest text-sm whitespace-nowrap logo-pearl">
          16K
        </Link>

        <div className="flex-1 flex items-center justify-end gap-3">
          <button onClick={() => { setSearchOpen(s => !s); closeMenu() }} aria-label="Search" className="p-1">
            <Search className="h-4 w-4" />
          </button>
          <CartDrawer />
          <AuthButton />
        </div>
      </header>

      <div
        className={`fixed left-0 right-0 bottom-0 z-40 bg-background overflow-y-auto transition-all duration-300 ease-in-out ${
          menuState !== 'closed'
            ? 'top-16 opacity-100 pointer-events-auto translate-y-0'
            : 'top-16 opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        {menuState === 'main' && (
          <MainMenu
            onShop={() => setMenuState('shop')}
            onClose={closeMenu}
            session={session}
            onSignOut={() => { void signOut({ callbackUrl: '/' }); closeMenu() }}
          />
        )}
        {menuState === 'shop' && (
          <ShopMenu categories={categories} onBack={() => setMenuState('main')} onClose={closeMenu} />
        )}
      </div>

      {searchOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex items-center gap-3">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            autoFocus
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder={t('searchPlaceholder')}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const q = (e.target as HTMLInputElement).value.trim()
                if (q) { window.location.href = `/?search=${encodeURIComponent(q)}`; setSearchOpen(false) }
              }
              if (e.key === 'Escape') setSearchOpen(false)
            }}
          />
          <button onClick={() => setSearchOpen(false)} aria-label="Close search"><X className="h-4 w-4" /></button>
        </div>
      )}
    </>
  )
}
