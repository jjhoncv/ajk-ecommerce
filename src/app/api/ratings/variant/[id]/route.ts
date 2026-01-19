import { customerModel } from '@/module/customers/core'
import { variantRatingModel } from '@/module/products/core'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const variantId = parseInt(id)

    if (isNaN(variantId)) {
      return NextResponse.json(
        { error: 'ID de variante inválido' },
        { status: 400 }
      )
    }

    // Obtener parámetros de consulta
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Usar el modelo para obtener las valoraciones con paginación
    const ratingsResult = await variantRatingModel.getRatingsByVariantId(
      variantId,
      page,
      limit
    )

    // Transformar el resultado para que coincida con la estructura esperada por el frontend
    const response = {
      ratings: await Promise.all(
        ratingsResult.ratings.map(async (rating) => ({
          id: rating.id,
          variantId: rating.variantId,
          customerId: rating.customerId,
          rating: rating.rating,
          review: rating.review,
          title: rating.title,
          verifiedPurchase: rating.verifiedPurchase === 1,
          createdAt: (rating as any).createdAt,
          updatedAt: (rating as any).updatedAt,
          customerName: rating.customerName,
          customerPhoto: rating.customerPhoto || null,
          // Agregar imágenes de rating si las hay
          ratingImages: rating.ratingImages || [],
          // Información del customer si está disponible
          customer: await customerModel.getCustomer(rating.customerId)
        }))
      ),
      summary: {
        totalRatings: ratingsResult.summary.totalRatings,
        averageRating: ratingsResult.summary.averageRating,
        fiveStar: ratingsResult.summary.fiveStar,
        fourStar: ratingsResult.summary.fourStar,
        threeStar: ratingsResult.summary.threeStar,
        twoStar: ratingsResult.summary.twoStar,
        oneStar: ratingsResult.summary.oneStar,
        verifiedPurchases: ratingsResult.summary.verifiedPurchases
      },
      totalCount: ratingsResult.totalCount,
      totalPages: ratingsResult.totalPages,
      currentPage: ratingsResult.page
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error al obtener valoraciones de variante:', error)
    return NextResponse.json(
      { error: 'Error al obtener valoraciones' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const variantId = parseInt(id)

    if (isNaN(variantId)) {
      return NextResponse.json(
        { error: 'ID de variante inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { customerId, rating, review, title, verifiedPurchase = false } = body

    // Validaciones
    if (!customerId || !rating) {
      return NextResponse.json(
        { error: 'customerId y rating son requeridos' },
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
      review,
      title,
      verifiedPurchase
    )

    if (!newRating) {
      return NextResponse.json(
        { error: 'Error al crear la valoración' },
        { status: 500 }
      )
    }

    return NextResponse.json(newRating, { status: 201 })
  } catch (error) {
    console.error('Error al crear valoración:', error)
    return NextResponse.json(
      { error: 'Error al crear valoración' },
      { status: 500 }
    )
  }
}
