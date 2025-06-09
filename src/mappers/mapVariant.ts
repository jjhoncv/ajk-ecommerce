// import { VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

// import oVariantAttrOptRep from '@/repository/VariantAttributeOption.repository'
// import oProductVariantRep from '@/repository/ProductVariant.repository'

// export const mapVariantsByAttributeOption = async (
//   optionId: number
// ): Promise<VariantAttributeOption[] | null> => {
//   const variantsAttrOptRaw =
//     await oVariantAttrOptRep.getVariantsByAttributeOption(optionId)

//   if (variantsAttrOptRaw === null) return null

//   return Promise.all(
//     variantsAttrOptRaw.map(async (varAttrOptRaw) => {

//       return {
//         attributeOptionId: varAttrOptRaw.attribute_option_id,
//         variantId: varAttrOptRaw.variant_id,
//         productVariants: null,
//         attributeOptions: null
//       }
//     })
//   )
// }
