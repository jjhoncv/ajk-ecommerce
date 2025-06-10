import {
  mapVariantAttributeOption,
  mapVariantAttributeOptions
} from '@/mappers/mapVariantAttributeOption'
import oVariantAttributeOptionRep from '@/repository/VariantAttributeOption.repository'

import { VariantAttributeOptions as VariantAttributeOptionRaw } from '@/types/database'
import { VariantAttributeOptions as VariantAttributeOption } from '@/types/domain'

export class VariantAttributeOptionModel {
  // ✅ Obtener variant attribute options por variant ID
  public async getVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<VariantAttributeOption[] | undefined> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByVariantId(
        variantId
      )
    return mapVariantAttributeOptions(optionsRaw)
  }

  // ✅ Obtener variant attribute options por attribute option ID
  public async getVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<VariantAttributeOption[] | undefined> {
    const optionsRaw =
      await oVariantAttributeOptionRep.getVariantAttributeOptionsByAttributeOptionId(
        attributeOptionId
      )
    return mapVariantAttributeOptions(optionsRaw)
  }

  // ✅ Obtener variant attribute options para múltiples variants (batch loading)
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
      const option = mapVariantAttributeOption(optionRaw)
      const variantId = option.variantId

      if (!optionsByVariantId.has(variantId)) {
        optionsByVariantId.set(variantId, [])
      }

      optionsByVariantId.get(variantId)!.push(option)
    }

    return optionsByVariantId
  }

  // ✅ Obtener variant attribute options para múltiples attribute options (batch loading)
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
      const option = mapVariantAttributeOption(optionRaw)
      const attributeOptionId = option.attributeOptionId

      if (!optionsByAttributeOptionId.has(attributeOptionId)) {
        optionsByAttributeOptionId.set(attributeOptionId, [])
      }

      optionsByAttributeOptionId.get(attributeOptionId)!.push(option)
    }

    return optionsByAttributeOptionId
  }

  // ✅ Crear variant attribute option
  public async createVariantAttributeOption(
    optionData: VariantAttributeOptionRaw
  ): Promise<VariantAttributeOption | undefined> {
    const created =
      await oVariantAttributeOptionRep.createVariantAttributeOption(optionData)

    if (!created) return undefined

    return mapVariantAttributeOption(created)
  }

  // ✅ Eliminar variant attribute option específica
  public async deleteVariantAttributeOption(
    variantId: number,
    attributeOptionId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOption(
      variantId,
      attributeOptionId
    )
  }

  // ✅ Eliminar todas las opciones de un variant
  public async deleteVariantAttributeOptionsByVariantId(
    variantId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByVariantId(
      variantId
    )
  }

  // ✅ Eliminar todas las referencias a una attribute option
  public async deleteVariantAttributeOptionsByAttributeOptionId(
    attributeOptionId: number
  ): Promise<void> {
    return await oVariantAttributeOptionRep.deleteVariantAttributeOptionsByAttributeOptionId(
      attributeOptionId
    )
  }
}

const variantAttributeOptionModel = new VariantAttributeOptionModel()
export default variantAttributeOptionModel
