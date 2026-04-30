import { z } from 'zod'

export const checkoutSchema = z.object({
  // Contact
  email: z.email('Enter a valid email address'),
  phone: z.string().optional(),

  // Shipping
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  address: z.string().min(5, 'Enter your full street address'),
  city: z.string().min(2, 'City is required'),
  postcode: z.string().min(3, 'Postcode is required'),
  country: z.string().min(1),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>