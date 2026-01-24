import { productVariantModel, variantRatingModel, variantRatingRepository } from '@/module/products/core'
import { authOptions } from '@/lib/auth/auth'
import { writeBase64Image } from '@/module/shared/lib/writeFileServer'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

/**
 * Genera un slug seguro para usar como nombre de carpeta
 */
function sanitizeSlug(slug: string): string {
  return slug
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-zA-Z0-9-]/g, '-') // Reemplazar caracteres especiales
    .replace(/-+/g, '-') // Eliminar guiones múltiples
    .replace(/^-|-$/g, '') // Eliminar guiones al inicio y final
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
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
      verifiedPurchase = false,
      images = []
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

    // Procesar y guardar imágenes si las hay
    if (images && images.length > 0) {
      try {
        // Obtener el slug de la variante para organizar las imágenes
        const variant = await productVariantModel.getProductVariantById(variantId)
        let folderName = `variant-${variantId}`

        if (variant?.slug) {
          folderName = sanitizeSlug(variant.slug)
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'ratings', folderName)
        const imageUrls: string[] = []

        for (const base64Image of images) {
          if (typeof base64Image === 'string' && base64Image.startsWith('data:image/')) {
            const imageUrl = await writeBase64Image(uploadDir, base64Image, `rating-${newRating.id}`)
            imageUrls.push(imageUrl)
          }
        }

        // Guardar URLs en la base de datos
        if (imageUrls.length > 0) {
          await variantRatingRepository.createRatingImages(newRating.id, imageUrls)
        }
      } catch (imageError) {
        console.error('Error al procesar imágenes:', imageError)
        // No fallamos la petición si las imágenes fallan, ya que la valoración ya se creó
      }
    }

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
