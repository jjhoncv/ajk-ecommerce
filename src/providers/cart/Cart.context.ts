import { createContext } from 'react'
import { type CartContextProps } from './Cart.types'

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
)
