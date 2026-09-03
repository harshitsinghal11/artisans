import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  itemIds: string[]
  toggleItem: (productId: string) => void
  hasItem: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],
      toggleItem: (productId) => set((state) => {
        const exists = state.itemIds.includes(productId)
        if (exists) {
          return { itemIds: state.itemIds.filter((id) => id !== productId) }
        }
        return { itemIds: [...state.itemIds, productId] }
      }),
      hasItem: (productId) => get().itemIds.includes(productId),
    }),
    {
      name: 'artisans-wishlist-storage',
    }
  )
)
