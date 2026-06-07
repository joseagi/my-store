'use client'

import { useLocale } from '@/store/locale'

export function TrustBar() {
  const { t } = useLocale()
  return (
    <section className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center gap-4 md:gap-10 text-xs text-muted-foreground">
          <span>{t('freeDelivery')}</span>
          <span>{t('returns')}</span>
          <span>{t('secureCheckout')}</span>
          <span>{t('support')}</span>
        </div>
      </div>
    </section>
  )
}
