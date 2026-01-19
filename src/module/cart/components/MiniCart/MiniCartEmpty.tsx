import { ShoppingBag } from 'lucide-react'

export const MiniCartEmpty = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-grow flex-col items-center justify-center p-4">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <p className="text-center text-gray-500">Tu carrito está vacío.</p>
      </div>
    </div>
  )
}
