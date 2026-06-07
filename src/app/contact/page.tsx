'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = data.get('name') as string
    const email = data.get('email') as string
    const subject = data.get('subject') as string
    const message = data.get('message') as string

    setSending(true)
    // Opens the user's mail client with pre-filled fields
    const mailto = `mailto:support@mystore.com?subject=${encodeURIComponent(subject || `Message from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`
    window.location.href = mailto

    // Show confirmation after a brief delay
    setTimeout(() => { setSending(false); setSent(true) }, 800)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <div className="mb-10">
        <Link
          href="/"
          className="text-xs text-muted-foreground uppercase tracking-widest font-heading hover:text-foreground transition-colors"
        >
          ← Back to store
        </Link>
        <h1 className="font-heading text-3xl uppercase tracking-widest mt-4 mb-2">
          Contact Us
        </h1>
        <p className="text-sm text-muted-foreground">
          We respond to all enquiries within one business day (Monday–Friday).
        </p>
      </div>

      {sent ? (
        <div className="border border-border rounded-xl p-8 text-center space-y-3">
          <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
          <h2 className="font-heading uppercase tracking-widest text-sm">Message Sent</h2>
          <p className="text-sm text-muted-foreground">
            Your mail client should have opened with a pre-filled message. If not, email us directly at{' '}
            <a href="mailto:support@mystore.com" className="underline underline-offset-4 hover:text-foreground">
              support@mystore.com
            </a>.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSent(false)}>
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="Jane Smith" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="Order enquiry, return request…" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="Tell us how we can help. If your message is about an order, please include your order number."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? 'Opening mail client…' : 'Send message'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Or email us directly:{' '}
            <a href="mailto:support@mystore.com" className="underline underline-offset-4 hover:text-foreground">
              support@mystore.com
            </a>
          </p>
        </form>
      )}

      <div className="mt-12 pt-8 border-t space-y-3 text-sm text-muted-foreground">
        <div>
          <p className="font-heading uppercase tracking-widest text-xs text-foreground mb-1">Hours</p>
          <p>Monday – Friday, 9 am – 5 pm EST</p>
        </div>
        <div>
          <p className="font-heading uppercase tracking-widest text-xs text-foreground mb-1">Response time</p>
          <p>Within 1 business day</p>
        </div>
        <div>
          <p className="font-heading uppercase tracking-widest text-xs text-foreground mb-1">For order issues</p>
          <p>Include your order number in the subject line for the fastest response.</p>
        </div>
      </div>
    </div>
  )
}
