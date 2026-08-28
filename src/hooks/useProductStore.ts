import { create } from 'zustand'

export type ProductCategory = 'Textiles' | 'Pottery' | 'Woodwork' | 'Jewellery' | 'Art' | 'Other'

interface ProductState {
  // Data
  imageFile: File | null
  audioFile: File | null
  materialCost: number | null
  category: ProductCategory | null
  removeBackground: boolean

  // Actions
  setImage: (file: File | null) => void
  setAudio: (file: File | null) => void
  setCost: (cost: number | null) => void
  setCategory: (category: ProductCategory | null) => void
  setRemoveBackground: (value: boolean) => void
  reset: () => void
}

export const useProductStore = create<ProductState>((set) => ({
  imageFile: null,
  audioFile: null,
  materialCost: null,
  category: null,
  removeBackground: true,

  setImage: (file) => set({ imageFile: file }),
  setAudio: (file) => set({ audioFile: file }),
  setCost: (cost) => set({ materialCost: cost }),
  setCategory: (category) => set({ category }),
  setRemoveBackground: (removeBackground) => set({ removeBackground }),
  reset: () => set({ imageFile: null, audioFile: null, materialCost: null, category: null, removeBackground: true }),
}))
