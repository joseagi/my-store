'use client'

import { useLocale, TRANSLATIONS, type SupportedLanguage } from '@/store/locale'
import { ChevronDown } from 'lucide-react'

const CURRENCIES = [
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'USD', symbol: 'US$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
]

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
]

const selectClass =
  'appearance-none bg-white text-black text-sm font-heading uppercase tracking-wider pr-6 cursor-pointer border-b border-border/60 pb-1 focus:outline-none focus:border-foreground transition-colors [&>option]:bg-white [&>option]:text-black'

export function FooterLocale() {
  const { currency, language, country, t, setCurrency, setLanguage } = useLocale()

  const activeCurrency = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0]
  const activeLanguage = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0]

  return (
    <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row gap-6 sm:gap-10">
      {/* Currency */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading mb-2">
          {t('currency')}
        </p>
        <div className="relative inline-flex items-center gap-2">
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className={selectClass}
            aria-label="Currency"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code === currency && country
                  ? `${country.toUpperCase()} | ${c.code} ${c.symbol}`
                  : `${c.code} ${c.symbol} — ${c.name}`}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 text-muted-foreground absolute right-0 pointer-events-none" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{activeCurrency.name}</p>
      </div>

      {/* Language */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-heading mb-2">
          {t('language')}
        </p>
        <div className="relative inline-flex items-center gap-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as SupportedLanguage)}
            className={selectClass}
            aria-label="Language"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.label.toUpperCase()}</option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 text-muted-foreground absolute right-0 pointer-events-none" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">{activeLanguage.label}</p>
      </div>
    </div>
  )
}
