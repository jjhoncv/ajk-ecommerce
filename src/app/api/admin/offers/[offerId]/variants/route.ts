import { offerModel } from '@/module/offers/core'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ offerId: string }>
}

/**
 * GET /api/admin/offers/[offerId]/variants
 * Obtiene las variantes de una oferta
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

    const variants = await offerModel.getOfferVariants(id)

    return NextResponse.json({ variants: variants || [] })
  } catch (error) {
    console.error('Error fetching offer variants:', error)
    return NextResponse.json(
      { error: 'Error al obtener las variantes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/offers/[offerId]/variants
 * Agrega una variante a la oferta
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    if (!body.variantId || !body.offerPrice || !body.originalPrice) {
      return NextResponse.json(
        { error: 'variantId, offerPrice y originalPrice son requeridos' },
        { status: 400 }
      )
    }

    const variant = await offerModel.addVariantToOffer(
      id,
      parseInt(body.variantId),
      parseFloat(body.offerPrice),
      parseFloat(body.originalPrice),
      body.stockLimit ? parseInt(body.stockLimit) : null
    )

    if (!variant) {
      return NextResponse.json(
        { error: 'Error al agregar la variante' },
        { status: 500 }
      )
    }

    return NextResponse.json({ variant }, { status: 201 })
  } catch (error) {
    console.error('Error adding variant to offer:', error)
    return NextResponse.json(
      { error: 'Error al agregar la variante' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/offers/[offerId]/variants
 * Reemplaza todas las variantes de una oferta
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    if (!Array.isArray(body.variants)) {
      return NextResponse.json(
        { error: 'Se requiere un array de variantes' },
        { status: 400 }
      )
    }

    const variants = body.variants.map((v: {
      variantId: number | string
      offerPrice: number | string
      originalPrice: number | string
      stockLimit?: number | string | null
    }) => ({
      variantId: parseInt(String(v.variantId)),
      offerPrice: parseFloat(String(v.offerPrice)),
      originalPrice: parseFloat(String(v.originalPrice)),
      stockLimit: v.stockLimit ? parseInt(String(v.stockLimit)) : null
    }))

    await offerModel.replaceOfferVariants(id, variants)

    // Obtener variantes actualizadas
    const updatedVariants = await offerModel.getOfferVariants(id)

    return NextResponse.json({ variants: updatedVariants || [] })
  } catch (error) {
    console.error('Error replacing offer variants:', error)
    return NextResponse.json(
      { error: 'Error al actualizar las variantes' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/offers/[offerId]/variants
 * Elimina una variante de la oferta (requiere query param variantId)
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
      return NextResponse.json({ error: 'ID de oferta inválido' }, { status: 400 })
    }

    const { searchParams } = new URL(request.url)
    const variantId = searchParams.get('variantId')

    if (!variantId) {
      return NextResponse.json(
        { error: 'Se requiere variantId como query param' },
        { status: 400 }
      )
    }

    await offerModel.removeVariantFromOffer(id, parseInt(variantId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing variant from offer:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la variante' },
      { status: 500 }
    )
  }
}
