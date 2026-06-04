import { z } from 'zod'

const EMAIL_DOMAIN_TYPOS = ['con', 'cmo', 'ocm', 'vom', 'cpm', 'comn', 'coim', 'ney', 'nte', 'orgg']

export const checkoutSchema = z.object({
  email: z
    .string()
    .email('Enter a valid email address')
    .refine((val) => {
      const domain = val.split('@')[1]
      if (!domain) return false
      const parts = domain.split('.')
      const tld = parts[parts.length - 1]
      if (!tld || !/^[a-zA-Z]{2,6}$/.test(tld)) return false
      return !EMAIL_DOMAIN_TYPOS.includes(tld.toLowerCase())
    }, 'Check your email — the domain looks incorrect (e.g. did you mean .com?)'),

  phone: z.string().optional(),

  country: z.string().min(1, 'Please select a country'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Enter your full street address'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  region: z.string().optional(),
  postcode: z.string().min(2, 'Postcode / ZIP is required'),

  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must accept the terms and conditions to continue',
    }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>
