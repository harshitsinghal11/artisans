import { create } from 'zustand'

export type ProductCategory = 'Textiles' | 'Pottery' | 'Woodwork' | 'Jewelry' | 'Art' | 'Other'

interface ProductState {
  // Data
  imageFile: File | null
  audioFile: File | null
  materialCost: number | null
  category: ProductCategory | null
  
  // Actions
  setImage: (file: File | null) => void
  setAudio: (file: File | null) => void
  setCost: (cost: number | null) => void
  setCategory: (category: ProductCategory | null) => void
  reset: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  imageFile: null,
  audioFile: null,
  materialCost: null,
  category: null,
  
  setImage: (file) => set({ imageFile: file }),
  setAudio: (file) => set({ audioFile: file }),
  setCost: (cost) => set({ materialCost: cost }),
  setCategory: (category) => set({ category }),
  reset: () => set({ imageFile: null, audioFile: null, materialCost: null, category: null }),
}))
