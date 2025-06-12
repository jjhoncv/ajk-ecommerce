import { VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import {
  VariantAttributeOptions as VariantAttributeOption,
  VariantAttributeOptions
} from '@/types/domain'

// me
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

  public async getVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<VariantAttributeOption[] | undefined> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByAttributeOptionId(
        attributeOptionId
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

  public async getVariantAttributeOptionsByAttributeOptionIds(
    attributeOptionIds: number[]
  ): Promise<Map<number, VariantAttributeOption[]>> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByAttributeOptionIds(
        attributeOptionIds
      )

    if (!optionsRaw) return new Map()

    // Agrupar options por attribute_option_id
    const optionsByAttributeOptionId = new Map<
      number,
      VariantAttributeOption[]
    >()

    for (const optionRaw of optionsRaw) {
      const option = VariantAttributeOptionMapper(optionRaw)
      const attributeOptionId = option.attributeOptionId

      if (!optionsByAttributeOptionId.has(attributeOptionId)) {
        optionsByAttributeOptionId.set(attributeOptionId, [])
      }

      optionsByAttributeOptionId.get(attributeOptionId)!.push(option)
    }

    return optionsByAttributeOptionId
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
    attributeOptionId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOption(
      variantId,
      attributeOptionId
    )
  }

  public async deleteVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByVariantId(
      variantId
    )
  }

  public async deleteVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByAttributeOptionId(
      attributeOptionId
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
    // console.log('options', options)

    /*
      options [
        {
          additionalCost: 0,
          attributeOptionValue: 'Blanco',
          attributeId: 1,
          attributeOptionId: 2,

          attributeDisplayType: 'color',
          attributeName: 'Color',
          variantId: 11
        }
    ]
    */
    return options
  }

  public async addAttributeOptionToVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<VariantAttributeOption | undefined> {
    const optionData: VariantAttributeOptionRaw = {
      variant_id: variantId,
      attribute_option_id: attributeOptionId
    }
    return await this.createVariantAttributeOption(optionData)
  }

  public async removeAttributeOptionFromVariant(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    return await this.deleteVariantAttributeOption(variantId, attributeOptionId)
  }
}

const variantAttributeOptionModel = new VariantAttributeOptionModel()
export default variantAttributeOptionModel
