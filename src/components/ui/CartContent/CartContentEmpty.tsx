import { ShoppingBag } from "lucide-react"

export const CartContentEmpty = () => {
  return (
    <div className="h-full flex">
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          Tu carrito está vacío. Agrega algunos productos para continuar.
        </p>
      </div>
    </div>
  )
}
