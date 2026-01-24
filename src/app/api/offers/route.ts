import { offerModel } from '@/module/offers/core'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * GET /api/offers
 * Obtiene ofertas activas públicas
 *
 * Query params:
 * - featured: boolean - Solo ofertas destacadas
 * - limit: number - Límite de resultados
 * - variantId: number - Obtener oferta para una variante específica
 * - variantIds: string - IDs de variantes separados por coma
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const variantId = searchParams.get('variantId')
    const variantIds = searchParams.get('variantIds')

    // Obtener oferta para una variante específica
    if (variantId) {
      const offer = await offerModel.getActiveOfferForVariant(parseInt(variantId))
      return NextResponse.json({ offer })
    }

    // Obtener ofertas para múltiples variantes
    if (variantIds) {
      const ids = variantIds.split(',').map((id) => parseInt(id.trim()))
      const offersMap = await offerModel.getActiveOffersForVariants(ids)
      const offers = Object.fromEntries(offersMap)
      return NextResponse.json({ offers })
    }

    // Obtener ofertas destacadas
    if (featured) {
      const offers = await offerModel.getFeaturedOffers(limit)
      return NextResponse.json({ offers: offers || [] })
    }

    // Obtener todas las ofertas activas
    const offers = await offerModel.getActiveOffers()
    return NextResponse.json({ offers: offers || [] })
  } catch (error) {
    console.error('Error fetching offers:', error)
    return NextResponse.json(
      { error: 'Error al obtener ofertas' },
      { status: 500 }
    )
  }
}
