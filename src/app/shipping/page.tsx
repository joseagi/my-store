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

      <h1 className="font-heading text-3xl uppercase tracking-widest mb-2">Shipping Policy</h1>
      <p className="text-xs text-muted-foreground mb-8 font-heading uppercase tracking-widest">
        Last updated: 4 June 2026
      </p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Processing Time</h2>
          <p>
            All orders are processed within <strong className="text-foreground">1–3 business days</strong> of
            payment confirmation. Orders placed on weekends or Canadian public holidays are processed
            on the next business day. You will receive a dispatch confirmation email once your order
            has shipped.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Domestic Shipping — Canada</h2>
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
                  <td className="p-3">Standard Shipping</td>
                  <td className="p-3">5–8 business days</td>
                  <td className="p-3">CA$8.99</td>
                </tr>
                <tr>
                  <td className="p-3">Expedited Shipping</td>
                  <td className="p-3">2–3 business days</td>
                  <td className="p-3">CA$14.99</td>
                </tr>
                <tr>
                  <td className="p-3">Free Standard Shipping</td>
                  <td className="p-3">5–8 business days</td>
                  <td className="p-3">On orders over CA$75</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            Delivery times are estimates and may vary during peak periods (e.g. holidays). Remote
            and rural areas may experience longer delivery windows.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">United States Shipping</h2>
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
                  <td className="p-3">Standard International</td>
                  <td className="p-3">7–14 business days</td>
                  <td className="p-3">CA$18.99</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs">
            US customers are responsible for any applicable customs duties or import taxes charged
            upon delivery. These charges are outside our control and are not included in the order total.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">International Shipping</h2>
          <p>
            We ship to selected countries worldwide. International orders typically arrive within
            <strong className="text-foreground"> 10–21 business days</strong> depending on destination
            and customs clearance. Shipping rates are calculated at checkout.
          </p>
          <p>
            The recipient is responsible for all customs duties, import taxes, and brokerage fees
            charged by the destination country. We are unable to predict or cover these charges.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Taxes</h2>
          <p>
            Applicable Canadian sales tax (HST/GST/PST) is calculated based on the shipping
            destination and added at checkout. International orders outside Canada are shipped
            tax-exclusive — local import duties apply on arrival.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Order Tracking</h2>
          <p>
            Once your order has been dispatched you will receive a confirmation email with a tracking
            number. You can use this to monitor your delivery via the carrier's website. Please allow
            up to 24 hours for tracking information to update after dispatch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Lost or Delayed Parcels</h2>
          <p>
            If your order has not arrived within the estimated timeframe, please contact us at{' '}
            <a href="mailto:support@mystore.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
              support@mystore.com
            </a>
            . We will investigate with the carrier and work to resolve the issue as quickly as possible.
            We are not liable for delays caused by carriers, customs, or circumstances beyond our control.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Returns &amp; Exchanges</h2>
          <p>
            We offer a <strong className="text-foreground">30-day return policy</strong> from the date
            of delivery. Items must be returned unworn, unwashed, and with all original tags attached.
            Return shipping costs are the responsibility of the customer unless the item is faulty or
            incorrect.
          </p>
          <p>
            To initiate a return, please email{' '}
            <a href="mailto:support@mystore.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
              support@mystore.com
            </a>{' '}
            with your order number and reason for return. Refunds are processed within 5–10 business
            days of receiving the returned item.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-foreground uppercase tracking-widest text-base">Contact</h2>
          <p>
            For any shipping enquiries please reach out to us at{' '}
            <a href="mailto:support@mystore.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
              support@mystore.com
            </a>{' '}
            and we will respond within 1 business day.
          </p>
        </section>

      </div>
    </div>
  )
}
