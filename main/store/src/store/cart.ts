import { create } from 'zustand'

export interface Book {
  id: string
  title: string
  price: number
  quantity: number
  cover: string
}

interface CartStore {
  cart: Book[]
  addToCart: (book: Book) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  addToCart: (book) =>
    set((state) => {
      const exists = state.cart.find((b) => b.id === book.id)
      if (exists) {
        return {
          cart: state.cart.map((b) =>
            b.id === book.id ? { ...b, quantity: b.quantity + 1 } : b
          ),
        }
      }
      return { cart: [...state.cart, { ...book, quantity: 1 }] }
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((b) => b.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
}))
