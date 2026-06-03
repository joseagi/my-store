import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Our shipping and delivery policy.',
}

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors font-heading uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="font-heading text-3xl uppercase tracking-widest mb-8">Shipping Policy</h1>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Processing Time</h2>
          <p>All orders are processed within 1–2 business days. Orders placed on weekends or public holidays are processed on the next business day.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">UK Delivery</h2>
          <div className="border border-border">
            <table className="w-full text-xs font-heading">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 uppercase text-foreground">Service</th>
                  <th className="text-left p-3 uppercase text-foreground">Timeframe</th>
                  <th className="text-left p-3 uppercase text-foreground">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3">Standard Delivery</td>
                  <td className="p-3">3–5 business days</td>
                  <td className="p-3">£3.99</td>
                </tr>
                <tr>
                  <td className="p-3">Express Delivery</td>
                  <td className="p-3">1–2 business days</td>
                  <td className="p-3">£6.99</td>
                </tr>
                <tr>
                  <td className="p-3">Free Standard Delivery</td>
                  <td className="p-3">3–5 business days</td>
                  <td className="p-3">On orders over £50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">International Shipping</h2>
          <p>We currently ship to selected European countries. International orders typically arrive within 7–14 business days. Additional customs duties or taxes may apply depending on your country and are the responsibility of the recipient.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Order Tracking</h2>
          <p>Once your order has been dispatched you will receive a confirmation email with a tracking number. You can use this to monitor your delivery via the carrier's website.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Returns & Exchanges</h2>
          <p>We offer a 30-day hassle-free return policy. Items must be returned in their original condition, unworn and with all tags attached. To initiate a return, please contact our support team.</p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Contact</h2>
          <p>For any shipping enquiries please reach out to us and we will get back to you within 1 business day.</p>
        </section>

      </div>
    </div>
  )
}
