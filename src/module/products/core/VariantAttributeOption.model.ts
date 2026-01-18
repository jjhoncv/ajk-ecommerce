import { type VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import {
  type VariantAttributeOptions as VariantAttributeOption,
  type VariantAttributeOptions
} from '@/types/domain'

import {
  VariantAttributeOptionMapper,
  VariantAttributeOptionsMapper,
  VariantAttributeOptionsWithDetailMapper
} from './VariantAttributeOption.mapper'
import oVariantAttributeOptionRep from './VariantAttributeOption.repository'

export class VariantAttributeOptionModel {
  public async getVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<VariantAttributeOption[] | undefined> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByVariantId(
        variantId
      )
    return VariantAttributeOptionsMapper(optionsRaw)
  }

  public async getVariantAttributeOptionsByProductAttributeOptionId(
    productAttributeOptionId: number
  ): Promise<VariantAttributeOption[] | undefined> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByProductAttributeOptionId(
        productAttributeOptionId
      )
    return VariantAttributeOptionsMapper(optionsRaw)
  }

  public async getVariantAttributeOptionsByVariantIds(
    variantIds: number[]
  ): Promise<Map<number, VariantAttributeOption[]>> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByVariantIds(
        variantIds
      )

    if (!optionsRaw) return new Map()

    // Agrupar options por variant_id
    const optionsByVariantId = new Map<number, VariantAttributeOption[]>()

    for (const optionRaw of optionsRaw) {
      const option = VariantAttributeOptionMapper(optionRaw)
      const variantId = option.variantId

      if (!optionsByVariantId.has(variantId)) {
        optionsByVariantId.set(variantId, [])
      }

      optionsByVariantId.get(variantId)!.push(option)
    }

    return optionsByVariantId
  }

  public async getVariantAttributeOptionsWithDetailsByIds(
    variantIds: number[]
  ): Promise<Map<number, VariantAttributeOptions[]>> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsWithDetailsByIds(
        variantIds
      )

    if (!optionsRaw) return new Map()

    // Agrupar options por variant_id
    const optionsByVariantId = new Map<number, VariantAttributeOptions[]>()

    for (const optionRaw of optionsRaw) {
      const option = VariantAttributeOptionsWithDetailMapper([optionRaw])[0]
      const variantId = option.variantId

      if (!optionsByVariantId.has(variantId)) {
        optionsByVariantId.set(variantId, [])
      }

      optionsByVariantId.get(variantId)!.push(option)
    }

    return optionsByVariantId
  }

  public async getVariantAttributeOptionsByProductAttributeOptionIds(
    productAttributeOptionIds: number[]
  ): Promise<Map<number, VariantAttributeOption[]>> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByProductAttributeOptionIds(
        productAttributeOptionIds
      )

    if (!optionsRaw) return new Map()

    // Agrupar options por product_attribute_option_id
    const optionsByProductAttributeOptionId = new Map<
      number,
      VariantAttributeOption[]
    >()

    for (const optionRaw of optionsRaw) {
      const option = VariantAttributeOptionMapper(optionRaw)
      const productAttributeOptionId = option.productAttributeOptionId

      if (!optionsByProductAttributeOptionId.has(productAttributeOptionId)) {
        optionsByProductAttributeOptionId.set(productAttributeOptionId, [])
      }

      optionsByProductAttributeOptionId.get(productAttributeOptionId)!.push(option)
    }

    return optionsByProductAttributeOptionId
  }

  public async createVariantAttributeOption(
    optionData: VariantAttributeOptionRaw
  ): Promise<VariantAttributeOption | undefined> {
    const created =
      await oVariantAttributeOptionRep.createVariantAttributeOption(optionData)
    if (!created) return undefined
    return VariantAttributeOptionMapper(created)
  }

  public async deleteVariantAttributeOption(
    variantId: number,
    productAttributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionRep.deleteVariantAttributeOption(
      variantId,
      productAttributeOptionId
    )
  }

  public async deleteVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<void> {
    await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByVariantId(
      variantId
    )
  }

  public async deleteVariantAttributeOptionsByProductAttributeOptionId(
    productAttributeOptionId: number
  ): Promise<void> {
    await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByProductAttributeOptionId(
      productAttributeOptionId
    )
  }

  public async getVariantAttributeOptionsWithDetailsById(
    variantId: number
  ): Promise<VariantAttributeOptions[] | undefined> {
    const attributeOptionsFlatRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsWithDetailsById(
        variantId
      )

    if (attributeOptionsFlatRaw === null) return undefined
    const options = VariantAttributeOptionsWithDetailMapper(
      attributeOptionsFlatRaw
    )

    return options
  }

  public async addAttributeOptionToVariant(
    variantId: number,
    productAttributeOptionId: number,
    additionalCost?: number
  ): Promise<VariantAttributeOption | undefined> {
    const optionData: VariantAttributeOptionRaw = {
      variant_id: variantId,
      product_attribute_option_id: productAttributeOptionId,
      additional_cost: additionalCost ?? 0
    }
    return await this.createVariantAttributeOption(optionData)
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    productAttributeOptionId: number
  ): Promise<void> {
    await this.deleteVariantAttributeOption(variantId, productAttributeOptionId)
  }
}

const variantAttributeOptionModel = new VariantAttributeOptionModel()
export default variantAttributeOptionModel
