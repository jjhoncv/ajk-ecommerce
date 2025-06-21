'use client'
import { type ProductVariants, type Products } from '@/types/domain'
import { useSession } from 'next-auth/react'
import React from 'react'
import { AuthPrompt } from './AuthPrompt'
import { useVariantDisplay } from './hooks/useVariantDisplay'
import { RatingForm } from './RatingForm'

interface ProductVariantRatingAddProps {
  variant: ProductVariants
  product: Products
  onRatingAdded: () => void
}

export const ProductVariantRatingAdd: React.FC<
  ProductVariantRatingAddProps
> = ({ variant, product, onRatingAdded }) => {
  const { data: session, status } = useSession()
  const { getVariantDisplayName } = useVariantDisplay(variant, product)

  const isAuthenticated = !!session
  const isLoading = status === 'loading'

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      )
    }

    if (!isAuthenticated) {
      return <AuthPrompt />
      {
        /* 👈 Sin props, usa el provider interno */
      }
    }

    return (
      <RatingForm
        variant={variant}
        productName={product.name}
        onRatingAdded={onRatingAdded}
      />
    )
  }

  return (
    <div className="mt-8 pt-6">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-bold">Deja tu valoración</h2>
        <div className="text-sm text-gray-600">
          Producto:{' '}
          <span className="font-medium">{getVariantDisplayName()}</span>
        </div>
      </div>
      {renderContent()}
    </div>
  )
}
