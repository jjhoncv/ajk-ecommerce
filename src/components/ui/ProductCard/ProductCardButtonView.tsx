"use client";
import ProductVariantInteractive from "@/components/product/ProductVariantInteractive";
import { ProductVariantInteractiveShimmer } from "@/components/product/ProductVariantInteractiveShimmer";
import { Modal } from "@/components/ui/Modal";
import { ProductVariantData } from "@/services/product/productVariant";
import { ProductVariants } from "@/types/domain";
import { ShoppingCart } from "lucide-react";
import React, { useState } from "react";

interface ProductCardButtonViewProps {
  variantId: number;
}

const ProductCardButtonView: React.FC<ProductCardButtonViewProps> = ({
  variantId,
}) => {
  const [data, setData] = useState<{ data: ProductVariantData, allVariants: ProductVariants[], variant: ProductVariants } | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false);

  const onCartAction = () => {
    setIsOpen(false)
  }

  const [error, setError] = useState<string>()
  const handleView = async (variantIdSelected: number) => {
    setIsOpen(true)

    try {
      setLoading(true)
      const response = await fetch(`/api/productos/variante/${variantIdSelected}`);
      if (response.ok) {
        const responseData: ProductVariantData | null
          = await response.json();

        if (responseData === null) {
          setError("El fetch no trajo la data")
          return
        }

        const allVariants = (responseData.product.productVariants || []).filter(v => v !== null)
        const variant = allVariants.find(variant => variant.id === variantIdSelected)

        if (!variant) {
          setError("No existe la variante")
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

  const handleVariantChangePreview = (attributeId: number, optionId: number) => {
    const allVariants = data?.allVariants;
    if (!allVariants) return

    const variantId = allVariants.find((v) => {
      return v?.variantAttributeOptions?.some((vao) =>
        vao?.attributeOption?.id === optionId
      );
    })?.id

    if (!variantId) return
    handleView(variantId)

  }

  return (
    <>
      <button
        onClick={() => { handleView(variantId) }}
        className="mt-3 absolute w-10 h-10 bottom-2 right-2 bg-secondary border-secondary border text-white py-2 rounded-full hover:bg-transparent hover:border-secondary hover:border-2 hover:bg-secondary-200 hover:text-secondary transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingCart className="h-6 w-6" />
      </button>
      <Modal className="max-w-[calc(100%-80px)] overflow-y-auto max-h-[calc(100%-80px)] pt-10"
        isOpen={isOpen} onClose={() => { setIsOpen(false) }}>
        {loading && data === null && <ProductVariantInteractiveShimmer />}
        {error}
        {!!data && <ProductVariantInteractive onCartAction={onCartAction} handleVariantChangePreview={handleVariantChangePreview} preview={true} initialData={data.data} allVariants={data.allVariants} variant={data.variant} />}
      </Modal>
    </>
  );
};

export default ProductCardButtonView;
