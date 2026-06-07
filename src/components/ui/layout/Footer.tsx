'use client'

import Link from 'next/link'
import { FooterLocale } from './FooterLocale'
import { useLocale } from '@/store/locale'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h4 className="font-heading font-medium mb-3 text-sm">{t('shop')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#products" className="hover:text-primary">{t('allProducts')}</Link></li>
              <li><Link href="/cart" className="hover:text-primary">{t('cart')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3 text-sm">{t('footerSupport')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-primary">{t('faq')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary">{t('contact')}</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">{t('shippingPolicy')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-medium mb-3 text-sm">{t('legal')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">{t('privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="hover:text-primary">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>
        <FooterLocale />

        <div className="border-t mt-6 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} My Store. {t('allRightsReserved')}
        </div>
      </div>
    </footer>
  )
}
