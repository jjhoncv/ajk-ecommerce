'use client'

import React, { useState } from 'react'

interface ProductVariantActionsProps {
  stock: number
  variantId: number
  price: number
}

const ProductVariantActions: React.FC<ProductVariantActionsProps> = ({
  stock,
  variantId,
  price
}) => {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = () => {
    console.log('Agregando al carrito:', {
      variantId,
      price
    })
    // Aquí iría la lógica para agregar al carrito
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Aquí iría la lógica para agregar/quitar de favoritos
  }

  const handleCompare = () => {
    console.log('Agregando a comparar:', variantId)
    // Aquí iría la lógica para comparar productos
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleAddToCart}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={stock === 0}
      >
        {stock > 0 ? 'Agregar al carrito' : 'Agotado'}
      </button>

      <div className="flex space-x-4">
        <button
          onClick={handleToggleFavorite}
          className={`flex-1 border border-gray-300 hover:border-gray-400 py-2 px-4 rounded-lg transition-colors ${isFavorite ? 'bg-red-50 text-red-600 border-red-300' : 'text-gray-700'
            }`}
        >
          {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
        </button>
        <button
          onClick={handleCompare}
          className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
        >
          Comparar
        </button>
      </div>
    </div>
  )
}

export default ProductVariantActions
