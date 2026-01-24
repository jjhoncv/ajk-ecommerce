import { promotionModel } from '@/module/promotions/core'
import { isPromotionActive } from '@/module/promotions/services/helpers'
import {
  hydratePromotion,
  hydratePromotions
} from '@/module/promotions/services/hydrators'
import { type Promotion } from './types'

export const getPromotions = async (): Promise<Promotion[]> => {
  try {
    // Obtener todas las promociones
    const promotionsData = await promotionModel.getPromotions()

    if (promotionsData == null || promotionsData.length === 0) {
      console.log('No se encontraron promociones')
      return []
    }

    // obtener las promociones que esten vigentes en el rango de fecha
    const promotions = promotionsData.filter((promotion) =>
      isPromotionActive(promotion)
    )
    if (promotions.length === 0) {
      console.log('No se encontraron promociones vigentes en el rango de fecha')
      return []
    }

    return hydratePromotions(promotions)
  } catch (error) {
    throw new Error(
      `Error al obtener getPromotions ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}

export const getPromotion = async (id: number): Promise<Promotion | null> => {
  try {
    // Obtener todas las promociones
    const promotion = await promotionModel.getPromotionById(id)

    if (promotion == null) {
      console.log('No se encontró la promoción')
      return null
    }

    if (!isPromotionActive(promotion)) {
      console.log('La promoción no se encuentra vigente')
      return null
    }

    return hydratePromotion(promotion)
  } catch (error) {
    throw new Error(
      `Error al obtener getPromotion ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}

export const getPromotionBySlug = async (slug: string): Promise<Promotion | null> => {
  try {
    const promotion = await promotionModel.getPromotionBySlug(slug)

    if (promotion == null) {
      console.log('No se encontró la promoción')
      return null
    }

    if (!isPromotionActive(promotion)) {
      console.log('La promoción no se encuentra vigente')
      return null
    }

    return hydratePromotion(promotion)
  } catch (error) {
    throw new Error(
      `Error al obtener getPromotionBySlug ${error instanceof Error ? error.message : 'Unknow error'}`
    )
  }
}
