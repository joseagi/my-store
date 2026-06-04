import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  cartKey: string
  id: string
  name: string
  price: number
  image: string
  quantity: number
  slug: string
  size?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'cartKey'>) => void
  removeItem: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const cartKey = `${item.id}-${item.size ?? ''}`
        const existing = get().items.find(i => i.cartKey === cartKey)
        if (existing) {
          set(state => ({
            items: state.items.map(i =>
              i.cartKey === cartKey
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          }))
        } else {
          set(state => ({
            items: [...state.items, { ...item, cartKey, quantity: 1 }],
          }))
        }
      },

      removeItem: (cartKey) =>
        set(state => ({
          items: state.items.filter(i => i.cartKey !== cartKey),
        })),

      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            i.cartKey === cartKey ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
)