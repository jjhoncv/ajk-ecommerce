import { offerModel, type UpdateOfferInput } from '@/module/offers/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ offerId: string }>
}

/**
 * GET /api/admin/offers/[offerId]
 * Obtiene detalle de una oferta
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { offerId } = await params
    const id = parseInt(offerId)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const offer = await offerModel.getOfferForAdmin(id)

    if (!offer) {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ offer })
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json(
      { error: 'Error al obtener la oferta' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/offers/[offerId]
 * Actualiza una oferta
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { offerId } = await params
    const id = parseInt(offerId)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await request.json()

    // Verificar que la oferta existe
    const existingOffer = await offerModel.getOfferById(id)
    if (!existingOffer) {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 })
    }

    // Construir objeto de actualización
    const input: UpdateOfferInput = {}

    if (body.name !== undefined) input.name = body.name
    if (body.title !== undefined) input.title = body.title
    if (body.description !== undefined) input.description = body.description
    if (body.offerType !== undefined) input.offerType = body.offerType
    if (body.discountType !== undefined) input.discountType = body.discountType
    if (body.discountValue !== undefined) input.discountValue = parseFloat(body.discountValue)
    if (body.startDate !== undefined) input.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) input.endDate = new Date(body.endDate)
    if (body.maxUses !== undefined) input.maxUses = body.maxUses ? parseInt(body.maxUses) : null
    if (body.maxUsesPerCustomer !== undefined) input.maxUsesPerCustomer = parseInt(body.maxUsesPerCustomer)
    if (body.minQuantity !== undefined) input.minQuantity = parseInt(body.minQuantity)
    if (body.minPurchaseAmount !== undefined) input.minPurchaseAmount = body.minPurchaseAmount ? parseFloat(body.minPurchaseAmount) : null
    if (body.badgeText !== undefined) input.badgeText = body.badgeText
    if (body.badgeColor !== undefined) input.badgeColor = body.badgeColor
    if (body.showCountdown !== undefined) input.showCountdown = body.showCountdown
    if (body.showStockIndicator !== undefined) input.showStockIndicator = body.showStockIndicator
    if (body.showSavings !== undefined) input.showSavings = body.showSavings
    if (body.imageUrl !== undefined) input.imageUrl = body.imageUrl
    if (body.priority !== undefined) input.priority = parseInt(body.priority)
    if (body.isActive !== undefined) input.isActive = body.isActive
    if (body.isFeatured !== undefined) input.isFeatured = body.isFeatured

    // Actualizar oferta
    const offer = await offerModel.updateOffer(id, input)

    // Si se enviaron variantes, reemplazarlas
    if (body.variants !== undefined) {
      await offerModel.replaceOfferVariants(id, body.variants)
    }

    // Obtener oferta actualizada con detalles
    const updatedOffer = await offerModel.getOfferForAdmin(id)

    return NextResponse.json({ offer: updatedOffer })
  } catch (error) {
    console.error('Error updating offer:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la oferta' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/offers/[offerId]
 * Elimina una oferta
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { offerId } = await params
    const id = parseInt(offerId)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    // Verificar que la oferta existe
    const existingOffer = await offerModel.getOfferById(id)
    if (!existingOffer) {
      return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 })
    }

    await offerModel.deleteOffer(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting offer:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la oferta' },
      { status: 500 }
    )
  }
}
