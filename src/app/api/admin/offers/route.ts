import { offerModel, type CreateOfferInput, type OfferFilters } from '@/module/offers/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * GET /api/admin/offers
 * Obtiene lista de ofertas para el admin
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const offerType = searchParams.get('offerType') as OfferFilters['offerType']
    const isActive = searchParams.get('isActive')
    const isFeatured = searchParams.get('isFeatured')
    const includeExpired = searchParams.get('includeExpired') === 'true'
    const search = searchParams.get('search')

    const filters: OfferFilters = {
      includeExpired
    }

    if (offerType) filters.offerType = offerType
    if (isActive !== null) filters.isActive = isActive === 'true'
    if (isFeatured !== null) filters.isFeatured = isFeatured === 'true'
    if (search) filters.search = search

    const offers = await offerModel.getOffers(filters)
    const stats = await offerModel.getOfferStats()

    return NextResponse.json({
      offers: offers || [],
      stats
    })
  } catch (error) {
    console.error('Error fetching offers for admin:', error)
    return NextResponse.json(
      { error: 'Error al obtener ofertas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/offers
 * Crea una nueva oferta
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    // Validaciones básicas
    if (!body.name || !body.title) {
      return NextResponse.json(
        { error: 'Nombre y título son requeridos' },
        { status: 400 }
      )
    }

    if (!body.discountValue || body.discountValue <= 0) {
      return NextResponse.json(
        { error: 'El valor del descuento debe ser mayor a 0' },
        { status: 400 }
      )
    }

    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Fechas de inicio y fin son requeridas' },
        { status: 400 }
      )
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'La fecha de fin debe ser posterior a la fecha de inicio' },
        { status: 400 }
      )
    }

    const input: CreateOfferInput = {
      name: body.name,
      title: body.title,
      description: body.description || null,
      offerType: body.offerType || 'flash_sale',
      discountType: body.discountType || 'percentage',
      discountValue: parseFloat(body.discountValue),
      startDate,
      endDate,
      maxUses: body.maxUses ? parseInt(body.maxUses) : null,
      maxUsesPerCustomer: body.maxUsesPerCustomer ? parseInt(body.maxUsesPerCustomer) : 1,
      minQuantity: body.minQuantity ? parseInt(body.minQuantity) : 1,
      minPurchaseAmount: body.minPurchaseAmount ? parseFloat(body.minPurchaseAmount) : null,
      badgeText: body.badgeText || null,
      badgeColor: body.badgeColor || 'red',
      showCountdown: body.showCountdown ?? false,
      showStockIndicator: body.showStockIndicator ?? false,
      showSavings: body.showSavings ?? true,
      imageUrl: body.imageUrl || null,
      priority: body.priority ? parseInt(body.priority) : 0,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      variants: body.variants || []
    }

    const offer = await offerModel.createOffer(input)

    if (!offer) {
      return NextResponse.json(
        { error: 'Error al crear la oferta' },
        { status: 500 }
      )
    }

    return NextResponse.json({ offer }, { status: 201 })
  } catch (error) {
    console.error('Error creating offer:', error)
    return NextResponse.json(
      { error: 'Error al crear la oferta' },
      { status: 500 }
    )
  }
}
