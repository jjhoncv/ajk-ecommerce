import { type ProductVariants, type Products } from '@/types/domain'

export const useVariantDisplay = (
  variant: ProductVariants,
  product: Products
) => {
  const getVariantDisplayName = () => {
    let displayName = product.name

    if (
      variant.variantAttributeOptions &&
      variant.variantAttributeOptions.length > 0
    ) {
      const attributes = variant.variantAttributeOptions
        .filter((attr) => attr?.attributeOption?.value)
        .map((attr) => attr!.attributeOption!.value)
        .join(', ')

      if (attributes) {
        displayName += ` - ${attributes}`
      }
    }

    return displayName
  }

  return {
    getVariantDisplayName
  }
}
