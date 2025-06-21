import variantRatingModel from '@/backend/variant-rating'
import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para valorar productos' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      variantId,
      rating,
      review,
      title,
      verifiedPurchase = false
      // images = [] // Para futuras implementaciones con imágenes
    } = body

    // Usar el ID del usuario autenticado
    const customerId = parseInt(session.user.id || '0')
    // Validaciones
    if (!variantId || !customerId || !rating) {
      return NextResponse.json(
        { error: 'variantId y rating son requeridos' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'El rating debe estar entre 1 y 5' },
        { status: 400 }
      )
    }

    // Verificar si el cliente ya ha valorado esta variante
    const hasRated = await variantRatingModel.hasCustomerRatedVariant(
      customerId,
      variantId
    )

    if (hasRated) {
      return NextResponse.json(
        { error: 'Ya has valorado esta variante' },
        { status: 409 }
      )
    }

    // Crear la nueva valoración
    const newRating = await variantRatingModel.createRating(
      variantId,
      customerId,
      rating,
      review || undefined,
      title || undefined,
      verifiedPurchase
    )

    if (!newRating) {
      return NextResponse.json(
        { error: 'Error al crear la valoración' },
        { status: 500 }
      )
    }

    // TODO: Si hay imágenes, procesarlas y guardarlas
    // if (images && images.length > 0) {
    //   await processRatingImages(newRating.id, images)
    // }

    return NextResponse.json(newRating, { status: 201 })
  } catch (error) {
    console.error('Error al crear valoración:', error)

    // Manejar errores específicos del modelo
    if (
      error instanceof Error &&
      error.message === 'Rating must be between 1 and 5'
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const variantId = url.searchParams.get('variantId')
    const customerId = url.searchParams.get('customerId')

    if (variantId) {
      // Obtener valoraciones por variante
      const ratings = await variantRatingModel.getVariantRatingsByVariantId(
        parseInt(variantId)
      )
      return NextResponse.json(ratings || [])
    }

    if (customerId) {
      // Obtener valoraciones por cliente
      const ratings = await variantRatingModel.getVariantRatingsByCustomerId(
        parseInt(customerId)
      )
      return NextResponse.json(ratings || [])
    }

    // Obtener todas las valoraciones (con paginación)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    const allRatings = await variantRatingModel.getVariantRatings()

    // Implementar paginación manual si el modelo no la tiene
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedRatings = allRatings?.slice(startIndex, endIndex) || []

    const totalCount = allRatings?.length || 0
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      ratings: paginatedRatings,
      totalCount,
      page,
      totalPages
    })
  } catch (error) {
    console.error('Error al obtener valoraciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener valoraciones' },
      { status: 500 }
    )
  }
}
