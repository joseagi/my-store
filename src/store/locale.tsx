'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'it' | 'nl' | 'ja' | 'zh' | 'ko' | 'ar' | 'hi'
export type TranslationKey = keyof typeof TRANSLATIONS['en']

// ─── Translations ─────────────────────────────────────────────────────────────

export const TRANSLATIONS = {
  en: {
    shop: 'Shop', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Contact',
    signIn: 'Sign in', myOrders: 'My Orders', signOut: 'Sign out', admin: 'Admin',
    all: 'All', addToCart: 'Add to cart', selectSize: 'Select size',
    addedToCart: '✓ Added to cart', outOfStock: 'Out of stock',
    sizeGuide: 'Size guide', shippingPolicy: 'Shipping policy',
    yourCart: 'Your Cart', checkout: 'Checkout', viewFullCart: 'View full cart',
    cartEmpty: 'Your cart is empty', startShopping: 'Start shopping',
    subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total', free: 'Free',
    currency: 'Currency', language: 'Language',
    search: 'Search', searchPlaceholder: 'Search products…',
    allProducts: 'All Products',
    freeDelivery: '✓ Free delivery over CA$75',
    returns: '✓ 30-day returns',
    secureCheckout: '✓ Secure checkout',
    support: '✓ Canada-based support',
    comingSoon: 'Coming soon',
    back: '← Back',
    cart: 'Cart', footerSupport: 'Support', legal: 'Legal',
    privacyPolicy: 'Privacy Policy', terms: 'Terms',
    tagline: 'Quality products, delivered fast.',
    allRightsReserved: 'All rights reserved.',
  },
  fr: {
    shop: 'Boutique', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Contact',
    signIn: 'Se connecter', myOrders: 'Mes commandes', signOut: 'Se déconnecter', admin: 'Admin',
    all: 'Tout', addToCart: 'Ajouter au panier', selectSize: 'Choisir une taille',
    addedToCart: '✓ Ajouté au panier', outOfStock: 'Épuisé',
    sizeGuide: 'Guide des tailles', shippingPolicy: 'Politique de livraison',
    yourCart: 'Votre panier', checkout: 'Commander', viewFullCart: 'Voir le panier',
    cartEmpty: 'Votre panier est vide', startShopping: 'Commencer les achats',
    subtotal: 'Sous-total', shipping: 'Livraison', total: 'Total', free: 'Gratuit',
    currency: 'Devise', language: 'Langue',
    search: 'Rechercher', searchPlaceholder: 'Rechercher des produits…',
    allProducts: 'Tous les produits',
    freeDelivery: '✓ Livraison gratuite dès CA$75',
    returns: '✓ Retours sous 30 jours',
    secureCheckout: '✓ Paiement sécurisé',
    support: '✓ Support basé au Canada',
    comingSoon: 'Bientôt disponible',
    back: '← Retour',
    cart: 'Panier', footerSupport: 'Assistance', legal: 'Mentions légales',
    privacyPolicy: 'Politique de confidentialité', terms: 'Conditions',
    tagline: 'Produits de qualité, livrés rapidement.',
    allRightsReserved: 'Tous droits réservés.',
  },
  es: {
    shop: 'Tienda', lookbook: 'Lookbook', faq: 'Preguntas', contact: 'Contacto',
    signIn: 'Iniciar sesión', myOrders: 'Mis pedidos', signOut: 'Cerrar sesión', admin: 'Admin',
    all: 'Todo', addToCart: 'Añadir al carrito', selectSize: 'Elige una talla',
    addedToCart: '✓ Añadido', outOfStock: 'Agotado',
    sizeGuide: 'Guía de tallas', shippingPolicy: 'Política de envíos',
    yourCart: 'Tu carrito', checkout: 'Pagar', viewFullCart: 'Ver carrito',
    cartEmpty: 'Tu carrito está vacío', startShopping: 'Comprar ahora',
    subtotal: 'Subtotal', shipping: 'Envío', total: 'Total', free: 'Gratis',
    currency: 'Moneda', language: 'Idioma',
    search: 'Buscar', searchPlaceholder: 'Buscar productos…',
    allProducts: 'Todos los productos',
    freeDelivery: '✓ Envío gratis a partir de CA$75',
    returns: '✓ 30 días de devoluciones',
    secureCheckout: '✓ Pago seguro',
    support: '✓ Soporte en Canadá',
    comingSoon: 'Próximamente',
    back: '← Volver',
    cart: 'Carrito', footerSupport: 'Soporte', legal: 'Legal',
    privacyPolicy: 'Política de privacidad', terms: 'Términos',
    tagline: 'Productos de calidad, entregados rápido.',
    allRightsReserved: 'Todos los derechos reservados.',
  },
  de: {
    shop: 'Shop', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Kontakt',
    signIn: 'Anmelden', myOrders: 'Meine Bestellungen', signOut: 'Abmelden', admin: 'Admin',
    all: 'Alle', addToCart: 'In den Warenkorb', selectSize: 'Größe wählen',
    addedToCart: '✓ Hinzugefügt', outOfStock: 'Ausverkauft',
    sizeGuide: 'Größentabelle', shippingPolicy: 'Versandrichtlinie',
    yourCart: 'Dein Warenkorb', checkout: 'Zur Kasse', viewFullCart: 'Warenkorb ansehen',
    cartEmpty: 'Dein Warenkorb ist leer', startShopping: 'Jetzt einkaufen',
    subtotal: 'Zwischensumme', shipping: 'Versand', total: 'Gesamt', free: 'Kostenlos',
    currency: 'Währung', language: 'Sprache',
    search: 'Suchen', searchPlaceholder: 'Produkte suchen…',
    allProducts: 'Alle Produkte',
    freeDelivery: '✓ Gratis Versand ab CA$75',
    returns: '✓ 30 Tage Rückgabe',
    secureCheckout: '✓ Sicherer Checkout',
    support: '✓ Support in Kanada',
    comingSoon: 'Demnächst',
    back: '← Zurück',
    cart: 'Warenkorb', footerSupport: 'Support', legal: 'Rechtliches',
    privacyPolicy: 'Datenschutz', terms: 'AGB',
    tagline: 'Qualitätsprodukte, schnell geliefert.',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
  pt: { shop: 'Loja', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Contacto', signIn: 'Entrar', myOrders: 'Meus pedidos', signOut: 'Sair', admin: 'Admin', all: 'Tudo', addToCart: 'Adicionar ao carrinho', selectSize: 'Escolher tamanho', addedToCart: '✓ Adicionado', outOfStock: 'Esgotado', sizeGuide: 'Guia de tamanhos', shippingPolicy: 'Política de envio', yourCart: 'O seu carrinho', checkout: 'Finalizar', viewFullCart: 'Ver carrinho', cartEmpty: 'Carrinho vazio', startShopping: 'Comprar agora', subtotal: 'Subtotal', shipping: 'Envio', total: 'Total', free: 'Grátis', currency: 'Moeda', language: 'Idioma', search: 'Pesquisar', searchPlaceholder: 'Pesquisar produtos…', allProducts: 'Todos os produtos', freeDelivery: '✓ Envio grátis a partir de CA$75', returns: '✓ 30 dias de devoluções', secureCheckout: '✓ Pagamento seguro', support: '✓ Suporte no Canadá', comingSoon: 'Brevemente', back: '← Voltar', cart: 'Carrinho', footerSupport: 'Suporte', legal: 'Legal', privacyPolicy: 'Política de privacidade', terms: 'Termos', tagline: 'Produtos de qualidade, entregues rápido.', allRightsReserved: 'Todos os direitos reservados.' },
  it: { shop: 'Negozio', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Contatto', signIn: 'Accedi', myOrders: 'I miei ordini', signOut: 'Esci', admin: 'Admin', all: 'Tutto', addToCart: 'Aggiungi al carrello', selectSize: 'Scegli taglia', addedToCart: '✓ Aggiunto', outOfStock: 'Esaurito', sizeGuide: 'Guida taglie', shippingPolicy: 'Spedizione', yourCart: 'Il tuo carrello', checkout: 'Acquista', viewFullCart: 'Vedi carrello', cartEmpty: 'Carrello vuoto', startShopping: 'Inizia shopping', subtotal: 'Subtotale', shipping: 'Spedizione', total: 'Totale', free: 'Gratuita', currency: 'Valuta', language: 'Lingua', search: 'Cerca', searchPlaceholder: 'Cerca prodotti…', allProducts: 'Tutti i prodotti', freeDelivery: '✓ Spedizione gratis da CA$75', returns: '✓ 30 giorni di reso', secureCheckout: '✓ Checkout sicuro', support: '✓ Supporto Canada', comingSoon: 'Prossimamente', back: '← Indietro', cart: 'Carrello', footerSupport: 'Supporto', legal: 'Legale', privacyPolicy: 'Privacy', terms: 'Termini', tagline: 'Prodotti di qualità, consegnati velocemente.', allRightsReserved: 'Tutti i diritti riservati.' },
  nl: { shop: 'Winkel', lookbook: 'Lookbook', faq: 'FAQ', contact: 'Contact', signIn: 'Inloggen', myOrders: 'Mijn bestellingen', signOut: 'Uitloggen', admin: 'Admin', all: 'Alles', addToCart: 'In winkelwagen', selectSize: 'Kies maat', addedToCart: '✓ Toegevoegd', outOfStock: 'Uitverkocht', sizeGuide: 'Maatgids', shippingPolicy: 'Verzendbeleid', yourCart: 'Jouw winkelwagen', checkout: 'Afrekenen', viewFullCart: 'Bekijk winkelwagen', cartEmpty: 'Winkelwagen leeg', startShopping: 'Begin winkelen', subtotal: 'Subtotaal', shipping: 'Verzending', total: 'Totaal', free: 'Gratis', currency: 'Valuta', language: 'Taal', search: 'Zoeken', searchPlaceholder: 'Producten zoeken…', allProducts: 'Alle producten', freeDelivery: '✓ Gratis bezorging vanaf CA$75', returns: '✓ 30 dagen retour', secureCheckout: '✓ Veilig afrekenen', support: '✓ Support in Canada', comingSoon: 'Binnenkort', back: '← Terug', cart: 'Winkelwagen', footerSupport: 'Service', legal: 'Juridisch', privacyPolicy: 'Privacybeleid', terms: 'Voorwaarden', tagline: 'Kwaliteitsproducten, snel geleverd.', allRightsReserved: 'Alle rechten voorbehouden.' },
  ja: { shop: 'ショップ', lookbook: 'ルックブック', faq: 'よくある質問', contact: 'お問い合わせ', signIn: 'ログイン', myOrders: '注文履歴', signOut: 'ログアウト', admin: '管理', all: 'すべて', addToCart: 'カートに追加', selectSize: 'サイズを選択', addedToCart: '✓ 追加しました', outOfStock: '在庫切れ', sizeGuide: 'サイズガイド', shippingPolicy: '配送ポリシー', yourCart: 'カート', checkout: 'チェックアウト', viewFullCart: 'カートを見る', cartEmpty: 'カートは空です', startShopping: '買い物を始める', subtotal: '小計', shipping: '配送', total: '合計', free: '無料', currency: '通貨', language: '言語', search: '検索', searchPlaceholder: '商品を検索…', allProducts: 'すべての商品', freeDelivery: '✓ CA$75以上で送料無料', returns: '✓ 30日間返品可能', secureCheckout: '✓ 安全な決済', support: '✓ カナダサポート', comingSoon: '近日公開', back: '← 戻る', cart: 'カート', footerSupport: 'サポート', legal: '法的情報', privacyPolicy: 'プライバシー', terms: '利用規約', tagline: '高品質な商品を迅速にお届け。', allRightsReserved: '無断転載禁止。' },
  zh: { shop: '商店', lookbook: '造型册', faq: '常见问题', contact: '联系我们', signIn: '登录', myOrders: '我的订单', signOut: '退出', admin: '管理', all: '全部', addToCart: '加入购物车', selectSize: '选择尺码', addedToCart: '✓ 已加入', outOfStock: '缺货', sizeGuide: '尺码指南', shippingPolicy: '运费政策', yourCart: '购物车', checkout: '结账', viewFullCart: '查看购物车', cartEmpty: '购物车为空', startShopping: '开始购物', subtotal: '小计', shipping: '运费', total: '总计', free: '免费', currency: '货币', language: '语言', search: '搜索', searchPlaceholder: '搜索商品…', allProducts: '所有商品', freeDelivery: '✓ CA$75以上免运费', returns: '✓ 30天退换', secureCheckout: '✓ 安全结账', support: '✓ 加拿大客服', comingSoon: '敬请期待', back: '← 返回', cart: '购物车', footerSupport: '客服', legal: '法律', privacyPolicy: '隐私政策', terms: '条款', tagline: '优质产品，快速配送。', allRightsReserved: '保留所有权利。' },
  ko: { shop: '쇼핑', lookbook: '룩북', faq: 'FAQ', contact: '문의', signIn: '로그인', myOrders: '주문 내역', signOut: '로그아웃', admin: '관리', all: '전체', addToCart: '장바구니 담기', selectSize: '사이즈 선택', addedToCart: '✓ 추가됨', outOfStock: '품절', sizeGuide: '사이즈 가이드', shippingPolicy: '배송 정책', yourCart: '장바구니', checkout: '결제', viewFullCart: '장바구니 보기', cartEmpty: '장바구니가 비어있습니다', startShopping: '쇼핑 시작', subtotal: '소계', shipping: '배송', total: '합계', free: '무료', currency: '통화', language: '언어', search: '검색', searchPlaceholder: '상품 검색…', allProducts: '전체 상품', freeDelivery: '✓ CA$75 이상 무료 배송', returns: '✓ 30일 반품', secureCheckout: '✓ 안전한 결제', support: '✓ 캐나다 지원', comingSoon: '곧 출시', back: '← 뒤로', cart: '장바구니', footerSupport: '고객지원', legal: '법적 고지', privacyPolicy: '개인정보처리방침', terms: '이용약관', tagline: '빠르게 배송되는 고품질 제품.', allRightsReserved: '모든 권리 보유.' },
  ar: { shop: 'المتجر', lookbook: 'ألبوم', faq: 'أسئلة', contact: 'اتصل', signIn: 'دخول', myOrders: 'طلباتي', signOut: 'خروج', admin: 'إدارة', all: 'الكل', addToCart: 'أضف للسلة', selectSize: 'اختر المقاس', addedToCart: '✓ أُضيف', outOfStock: 'نفد', sizeGuide: 'دليل المقاسات', shippingPolicy: 'سياسة الشحن', yourCart: 'سلتك', checkout: 'الدفع', viewFullCart: 'عرض السلة', cartEmpty: 'السلة فارغة', startShopping: 'تسوق الآن', subtotal: 'المجموع', shipping: 'الشحن', total: 'الإجمالي', free: 'مجاني', currency: 'العملة', language: 'اللغة', search: 'بحث', searchPlaceholder: 'ابحث…', allProducts: 'جميع المنتجات', freeDelivery: '✓ شحن مجاني فوق CA$75', returns: '✓ إرجاع 30 يوم', secureCheckout: '✓ دفع آمن', support: '✓ دعم في كندا', comingSoon: 'قريباً', back: 'رجوع →', cart: 'السلة', footerSupport: 'الدعم', legal: 'قانوني', privacyPolicy: 'الخصوصية', terms: 'الشروط', tagline: 'منتجات عالية الجودة، توصيل سريع.', allRightsReserved: 'جميع الحقوق محفوظة.' },
  hi: { shop: 'दुकान', lookbook: 'लुकबुक', faq: 'सहायता', contact: 'संपर्क', signIn: 'साइन इन', myOrders: 'मेरे ऑर्डर', signOut: 'साइन आउट', admin: 'एडमिन', all: 'सभी', addToCart: 'कार्ट में जोड़ें', selectSize: 'साइज़ चुनें', addedToCart: '✓ जोड़ा गया', outOfStock: 'स्टॉक में नहीं', sizeGuide: 'साइज़ गाइड', shippingPolicy: 'शिपिंग नीति', yourCart: 'आपकी कार्ट', checkout: 'चेकआउट', viewFullCart: 'पूरी कार्ट देखें', cartEmpty: 'कार्ट खाली है', startShopping: 'खरीदारी करें', subtotal: 'उप-योग', shipping: 'शिपिंग', total: 'कुल', free: 'मुफ़्त', currency: 'मुद्रा', language: 'भाषा', search: 'खोजें', searchPlaceholder: 'उत्पाद खोजें…', allProducts: 'सभी उत्पाद', freeDelivery: '✓ CA$75 से ऊपर मुफ़्त डिलीवरी', returns: '✓ 30 दिन रिटर्न', secureCheckout: '✓ सुरक्षित चेकआउट', support: '✓ कनाडा सहायता', comingSoon: 'जल्द आ रहा है', back: '← वापस', cart: 'कार्ट', footerSupport: 'सहायता', legal: 'कानूनी', privacyPolicy: 'गोपनीयता', terms: 'शर्तें', tagline: 'गुणवत्ता उत्पाद, तेज़ डिलीवरी।', allRightsReserved: 'सर्वाधिकार सुरक्षित।' },
} as const

const COUNTRY_CURRENCY: Record<string, string> = {
  CA:'CAD',US:'USD',GB:'GBP',IE:'EUR',DE:'EUR',FR:'EUR',ES:'EUR',IT:'EUR',NL:'EUR',PT:'EUR',AT:'EUR',BE:'EUR',AU:'AUD',NZ:'NZD',NG:'NGN',GH:'GHS',ZA:'ZAR',KE:'KES',JP:'JPY',CN:'CNY',IN:'INR',BR:'BRL',AE:'AED',SG:'SGD',MX:'MXN',
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface LocaleState {
  currency: string
  language: SupportedLanguage
  country: string
  rates: Record<string, number>
  t: (key: TranslationKey) => string
  formatPrice: (cadPrice: number) => string
  setCurrency: (c: string) => void
  setLanguage: (l: SupportedLanguage) => void
}

const LocaleContext = createContext<LocaleState | null>(null)

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('CAD')
  const [language, setLanguageState] = useState<SupportedLanguage>('en')
  const [country, setCountry] = useState('Canada')
  const [rates, setRates] = useState<Record<string, number>>({})

  useEffect(() => {
    // Restore saved preferences
    const savedCurrency = localStorage.getItem('pref_currency')
    const savedLanguage = localStorage.getItem('pref_language') as SupportedLanguage | null

    if (savedLanguage && savedLanguage in TRANSLATIONS) setLanguageState(savedLanguage)

    // Fetch exchange rates (base: CAD)
    fetch('https://open.er-api.com/v6/latest/CAD')
      .then(r => r.json())
      .then((d: { rates?: Record<string, number> }) => {
        if (d.rates) setRates(d.rates)
      })
      .catch(() => {})

    // Auto-detect currency from IP if no saved preference
    if (!savedCurrency) {
      fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then((d: { country_code?: string; country_name?: string }) => {
          setCountry(d.country_name ?? 'Canada')
          const detected = d.country_code ? (COUNTRY_CURRENCY[d.country_code] ?? 'CAD') : 'CAD'
          setCurrencyState(detected)
        })
        .catch(() => {})
    } else {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = useCallback((c: string) => {
    setCurrencyState(c)
    localStorage.setItem('pref_currency', c)
  }, [])

  const setLanguage = useCallback((l: SupportedLanguage) => {
    setLanguageState(l)
    localStorage.setItem('pref_language', l)
  }, [])

  const t = useCallback((key: TranslationKey): string => {
    const lang = TRANSLATIONS[language] as Record<string, string>
    return lang[key] ?? (TRANSLATIONS.en as Record<string, string>)[key] ?? key
  }, [language])

  const formatPrice = useCallback((cadPrice: number): string => {
    const rate = rates[currency] ?? 1
    const converted = cadPrice * rate
    try {
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(converted)
    } catch {
      return `${currency} ${converted.toFixed(2)}`
    }
  }, [currency, rates])

  return (
    <LocaleContext.Provider value={{ currency, language, country, rates, t, formatPrice, setCurrency, setLanguage }}>
      {children}
    </LocaleContext.Provider>
  )
}
