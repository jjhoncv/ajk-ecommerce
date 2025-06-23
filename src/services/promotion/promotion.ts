import promotionModel from '@/backend/promotion'
import { hydratePromotions } from '@/services/promotion/hydrators'
import { type Promotion } from './types'

export const getPromotions = async (): Promise<Promotion[]> => {
  // return await new Promise((resolve) => {
  //   resolve(dataMock)
  // })

  try {
    // Obtener todas las promociones
    const promotionsData = await promotionModel.getPromotions()

    if (promotionsData == null || promotionsData.length === 0) {
      console.log('No se encontraron promociones')
      return []
    }

    // obtener las promociones que esten vigentes en el rango de fecha
    const promotions = promotionsData.filter((promotion) => {
      const date = new Date()
      const startDate = new Date(promotion.startDate)
      const endDate = new Date(promotion.endDate)
      return date >= startDate && date <= endDate
    })
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
