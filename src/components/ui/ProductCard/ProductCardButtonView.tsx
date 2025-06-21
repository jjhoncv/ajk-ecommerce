'use client'
import ProductVariantInteractive from '@/components/product/ProductVariantInteractive'
import { ProductVariantInteractiveShimmer } from '@/components/product/ProductVariantInteractiveShimmer'
import { Modal } from '@/components/ui/Modal'
import { type ProductVariantData } from '@/services/product/productVariant'
import { type ProductVariants } from '@/types/domain'
import { ShoppingCart } from 'lucide-react'
import React, { useState } from 'react'

interface ProductCardButtonViewProps {
  variantId: number
}

const ProductCardButtonView: React.FC<ProductCardButtonViewProps> = ({
  variantId
}) => {
  const [data, setData] = useState<{
    data: ProductVariantData
    allVariants: ProductVariants[]
    variant: ProductVariants
  } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onCartAction = () => {
    setIsOpen(false)
  }

  const [error, setError] = useState<string>()
  const handleView = async (variantIdSelected: number) => {
    setIsOpen(true)

    try {
      setLoading(true)
      const response = await fetch(
        `/api/productos/variante/${variantIdSelected}`
      )
      if (response.ok) {
        const responseData: ProductVariantData | null = await response.json()

        if (responseData === null) {
          setError('El fetch no trajo la data')
          return
        }

        const allVariants = (responseData.product.productVariants || []).filter(
          (v) => v !== null
        )
        const variant = allVariants.find(
          (variant) => variant.id === variantIdSelected
        )

        if (!variant) {
          setError('No existe la variante')
          return
        }

        setData({
          allVariants,
          data: responseData,
          variant
        })
      }
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  const handleVariantChangePreview = (
    attributeId: number,
    optionId: number
  ) => {
    const allVariants = data?.allVariants
    if (!allVariants) return

    const variantId = allVariants.find((v) => {
      return v?.variantAttributeOptions?.some(
        (vao) => vao?.attributeOption?.id === optionId
      )
    })?.id

    if (!variantId) return
    handleView(variantId)
  }

  return (
    <>
      <button
        onClick={() => {
          handleView(variantId)
        }}
        className="absolute bottom-2 right-2 mt-3 flex h-10 w-10 items-center justify-center gap-2 rounded-full border border-secondary bg-secondary py-2 text-white transition-colors hover:border-2 hover:border-secondary hover:bg-secondary-200 hover:bg-transparent hover:text-secondary"
      >
        <ShoppingCart className="h-6 w-6" />
      </button>
      <Modal
        className="max-h-[calc(100%-80px)] max-w-[calc(100%-80px)] overflow-y-auto pt-10"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        {loading && data === null && <ProductVariantInteractiveShimmer />}
        {error}
        {!!data && (
          <ProductVariantInteractive
            onCartAction={onCartAction}
            handleVariantChangePreview={handleVariantChangePreview}
            preview={true}
            initialData={data.data}
            allVariants={data.allVariants}
            variant={data.variant}
          />
        )}
      </Modal>
    </>
  )
}

export default ProductCardButtonView
