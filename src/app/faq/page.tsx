import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about My Store.',
}

const FAQS = [
  {
    q: 'What sizes do you offer?',
    a: 'Our sizing varies by product. Clothing is generally available in S, M, L, XL, and XXL. Footwear uses standard numeric sizing. Each product page includes a size guide — please refer to it before ordering. If you are between sizes, we recommend sizing up.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Canadian orders are processed within 1–2 business days. Standard shipping takes 5–7 business days; expedited takes 2–3 business days. International orders typically arrive within 10–21 business days depending on the destination. All timeframes are estimates and may vary during peak periods.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes — orders over CA$75 qualify for free standard shipping within Canada. A flat shipping rate of CA$8.99 applies to orders below that threshold. Expedited shipping is available at CA$14.99 regardless of order value.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship to the United States, most of Europe, Africa, Australia, and select countries worldwide. International shipping rates and timeframes are shown at checkout based on your location. Customs duties and taxes are the responsibility of the recipient.',
  },
  {
    q: 'What is your return policy?',
    a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Sale and final-sale items are non-returnable unless faulty. To start a return, email us at support@mystore.com with your order number.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order is dispatched you will receive a confirmation email with a tracking number. Use this number on the carrier\'s website to follow your delivery in real time. If you haven\'t received a tracking email within 3 business days, please check your spam folder or contact us.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major debit and credit cards (Visa, Mastercard, Amex) via Stripe\'s secure checkout. We do not store any card details on our servers. Apple Pay and Google Pay are also available at checkout where supported by your device.',
  },
  {
    q: 'Can I modify or cancel my order?',
    a: 'Orders are processed quickly after placement. If you need to make a change, contact us immediately at support@mystore.com. We will do our best to accommodate requests made before the order is dispatched, but we cannot guarantee modifications once fulfilment has begun.',
  },
  {
    q: 'What currency are prices shown in?',
    a: 'All prices are displayed in Canadian Dollars (CAD) by default. You can change your preferred currency using the selector at the bottom of any page. Note that your card will be charged in CAD at the prevailing exchange rate set by your bank.',
  },
  {
    q: 'My item arrived damaged or incorrect. What do I do?',
    a: 'We are sorry to hear that. Please email support@mystore.com within 7 days of receiving your order, including your order number and clear photos of the issue. We will arrange a replacement or full refund at no cost to you.',
  },
  {
    q: 'How long does it take to receive a refund?',
    a: 'Once we receive and inspect the returned item, refunds are processed within 2–3 business days. Depending on your bank, the funds may take a further 3–7 business days to appear on your statement.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. Payments are processed by Stripe, a PCI DSS Level 1 certified payment provider. We never have access to your card number. All transactions are encrypted with SSL/TLS.',
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs text-muted-foreground uppercase tracking-widest font-heading hover:text-foreground transition-colors"
        >
          ← Back to store
        </Link>
        <h1 className="font-heading text-3xl uppercase tracking-widest mt-4 mb-2">
          FAQ
        </h1>
        <p className="text-sm text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for?{' '}
          <Link href="/contact" className="underline underline-offset-4 hover:text-foreground">
            Contact us
          </Link>{' '}
          and we&apos;ll get back to you within one business day.
        </p>
      </div>

      <div className="divide-y divide-border">
        {FAQS.map((item, i) => (
          <details key={i} className="group py-5">
            <summary className="flex items-center justify-between cursor-pointer list-none gap-4">
              <span className="font-heading uppercase tracking-wide text-sm">
                {item.q}
              </span>
              <span className="text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-45 text-lg leading-none">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t text-sm text-muted-foreground">
        Still have questions?{' '}
        <Link href="/contact" className="underline underline-offset-4 hover:text-foreground">
          Get in touch
        </Link>
        {' '}— we respond within one business day.
      </div>
    </div>
  )
}
