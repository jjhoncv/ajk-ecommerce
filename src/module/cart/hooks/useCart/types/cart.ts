// types/cart.ts
import { type PromotionVariants, type VariantAttributeOptions } from '@/types/domain'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  stock: number
  slug?: string | null
  promotionVariants?: Array<PromotionVariants | null> | null
  variantAttributeOptions?: Array<VariantAttributeOptions | null> | null
}

export interface DeleteConfirmation {
  isOpen: boolean
  productId: number | null
  message?: string
  onConfirm: (() => void) | null
}

export interface UseCartReturn {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, initialQuantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  incrementQuantity: (id: number) => void
  decrementQuantity: (id: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  goToCartPage: () => void
  canShowMinicart: () => boolean
  toastMessage: string | null
  setToastMessage: (message: string | null) => void
  isInitialized: boolean
  deleteConfirmation: DeleteConfirmation
  openDeleteConfirmation: (
    id: number,
    message?: string,
    onConfirm?: () => void
  ) => void
  closeDeleteConfirmation: () => void
  confirmDelete: () => void
}
