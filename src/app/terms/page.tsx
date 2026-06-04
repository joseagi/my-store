import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for My Store.',
}

const LAST_UPDATED = '4 June 2026'
const STORE_NAME = 'My Store'
const STORE_EMAIL = 'support@mystore.com'
const STORE_COUNTRY = 'Ontario, Canada'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">

      <div className="mb-10">
        <Link
          href="/"
          className="text-xs text-muted-foreground uppercase tracking-widest font-heading hover:text-foreground transition-colors"
        >
          ← Back to store
        </Link>
        <h1 className="font-heading text-3xl uppercase tracking-widest mt-4 mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">1. About These Terms</h2>
          <p>
            These terms and conditions govern your use of the {STORE_NAME} website and the purchase of
            products from us. By placing an order or browsing our site, you agree to be bound by these
            terms in full. If you do not accept these terms, please do not use our site.
          </p>
          <p className="mt-2">
            We may update these terms at any time. The version published on our website at the time of
            your order will apply to that purchase. We recommend you save or print a copy for your records.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">2. Our Details</h2>
          <p>
            {STORE_NAME} is an online retailer selling clothing and accessories. For any questions
            relating to these terms, please contact us at{' '}
            <a href={`mailto:${STORE_EMAIL}`} className="underline underline-offset-4 hover:text-primary">
              {STORE_EMAIL}
            </a>.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">3. Eligibility</h2>
          <p>
            To place an order you must be at least 18 years old and provide accurate, complete, and
            current information. By placing an order you confirm that you meet these requirements.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">4. Products and Pricing</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              All prices are shown in Canadian Dollars (CAD) and are exclusive of applicable taxes.
              Applicable HST/GST will be calculated at checkout where required.
            </li>
            <li>
              We reserve the right to change prices at any time. The price shown at checkout is the
              price you will be charged.
            </li>
            <li>
              Product images are for illustrative purposes only. Colours may vary slightly due to
              screen settings and photographic lighting.
            </li>
            <li>
              We make every effort to display products accurately, but we do not guarantee that your
              screen's display of any colour will be accurate.
            </li>
            <li>
              In the event of a pricing error, we reserve the right to cancel an order and issue a
              full refund. We will notify you promptly if this occurs.
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">5. Orders and Payment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              An order confirmation email means we have received your order — not that it has been
              accepted. We reserve the right to decline any order for any reason.
            </li>
            <li>
              Payment is taken in full at the time of checkout via Stripe. We accept major debit and
              credit cards. We do not store card details on our servers.
            </li>
            <li>
              Orders cannot be modified or cancelled once placed. If your order has not yet been
              dispatched, contact us immediately at {STORE_EMAIL} and we will do our best to assist.
            </li>
            <li>
              We are not responsible for delays or failures caused by your bank or payment provider.
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">6. Shipping and Delivery</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Delivery times are estimates and are not guaranteed.</li>
            <li>
              Risk of loss and title for items purchased pass to you upon delivery to the carrier.
            </li>
            <li>
              We are not liable for delays caused by customs, carrier issues, or circumstances outside
              our control.
            </li>
            <li>
              For full delivery information, please visit our{' '}
              <Link href="/shipping" className="underline underline-offset-4 hover:text-primary">
                Shipping Policy
              </Link>{' '}
              page.
            </li>
          </ul>
        </section>

        {/* 7 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">7. Returns and Refunds</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              You have the right to return most items within <strong>30 days</strong> of delivery,
              provided they are unused, unworn, and in their original condition with all tags attached.
            </li>
            <li>
              Sale items and items marked as final sale are non-returnable unless faulty.
            </li>
            <li>
              To initiate a return, email {STORE_EMAIL} with your order number and reason for return.
            </li>
            <li>
              Return postage costs are the responsibility of the customer unless the item is faulty or
              we sent the wrong item.
            </li>
            <li>
              Refunds will be processed to your original payment method within 5–10 business days of
              us receiving the returned item.
            </li>
            <li>
              We reserve the right to refuse a return if the item shows signs of wear, damage, or
              alteration.
            </li>
          </ul>
        </section>

        {/* 8 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">8. Sizing and Fit</h2>
          <p>
            Size guides are provided on each product page as a guide only. Sizing may vary between
            products and styles. If you are unsure, please contact us before ordering. We cannot
            accept returns solely on the grounds of incorrect size selection where a size guide was
            available.
          </p>
        </section>

        {/* 9 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">9. Intellectual Property</h2>
          <p>
            All content on this website — including text, images, logos, graphics, and product designs
            — is the property of {STORE_NAME} or its content suppliers and is protected by copyright
            law. You may not reproduce, distribute, or use any content without our prior written
            consent.
          </p>
        </section>

        {/* 10 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">10. Privacy</h2>
          <p>
            We collect and process personal data in accordance with Canada's Personal Information
            Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws.
            We use your information only to process your order, communicate with you about your
            purchase, and (with your consent) send marketing communications. We do not sell your
            data to third parties. For full details on how we handle your data, please contact us
            at {STORE_EMAIL}.
          </p>
        </section>

        {/* 11 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {STORE_NAME} shall not be liable for any indirect,
            incidental, special, or consequential damages arising from your use of our website or
            products. Our total liability to you in connection with any order shall not exceed the
            price paid for that order.
          </p>
          <p className="mt-2">
            Nothing in these terms limits our liability for death or personal injury caused by
            negligence, fraud, or any other matter that cannot be excluded by law.
          </p>
        </section>

        {/* 12 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">12. Website Use</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You agree not to use our website for any unlawful purpose.</li>
            <li>
              We reserve the right to suspend or terminate access to our website at any time without
              notice.
            </li>
            <li>
              We do not guarantee that our website will be uninterrupted, error-free, or free of
              viruses or other harmful components.
            </li>
          </ul>
        </section>

        {/* 13 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">13. Governing Law</h2>
          <p>
            These terms are governed by the laws of {STORE_COUNTRY}. Any disputes arising from these
            terms or your use of our website shall be subject to the exclusive jurisdiction of the
            courts of {STORE_COUNTRY}.
          </p>
        </section>

        {/* 14 */}
        <section>
          <h2 className="font-heading uppercase tracking-widest text-base mb-3">14. Contact Us</h2>
          <p>
            If you have any questions about these terms, please contact us:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>
              Email:{' '}
              <a href={`mailto:${STORE_EMAIL}`} className="underline underline-offset-4 hover:text-primary">
                {STORE_EMAIL}
              </a>
            </li>
          </ul>
        </section>

      </div>

      <div className="mt-12 pt-8 border-t text-xs text-muted-foreground">
        <p>
          By placing an order on {STORE_NAME} you confirm that you have read, understood, and agreed
          to these Terms &amp; Conditions.
        </p>
      </div>

    </div>
  )
}
