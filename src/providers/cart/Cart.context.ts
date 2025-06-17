import { createContext } from 'react'
import { CartContextProps } from './Cart.types'

export const CartContext = createContext<CartContextProps | undefined>(
  undefined
)
