// app/api/admin/ratings/[ratingId]/route.ts
import variantRatingModel from '@/module/products/core/VariantRating.model'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { type RatingStatus } from '@/types/domain'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ ratingId: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { ratingId } = await params
    const id = parseInt(ratingId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de valoración inválido' },
        { status: 400 }
      )
    }

    const rating = await variantRatingModel.getRatingDetailForAdmin(id)

    if (!rating) {
      return NextResponse.json(
        { error: 'Valoración no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ rating })
  } catch (error) {
    console.error('Error en GET /api/admin/ratings/[ratingId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { ratingId } = await params
    const id = parseInt(ratingId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de valoración inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status } = body as { status: RatingStatus }

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Use "approved" o "rejected".' },
        { status: 400 }
      )
    }

    const reviewedBy = parseInt(session.user.id)
    const result = await variantRatingModel.moderateRating(id, status, reviewedBy)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message,
      rating: result.rating
    })
  } catch (error) {
    console.error('Error en PATCH /api/admin/ratings/[ratingId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { ratingId } = await params
    const id = parseInt(ratingId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de valoración inválido' },
        { status: 400 }
      )
    }

    const rating = await variantRatingModel.getRatingById(id)
    if (!rating) {
      return NextResponse.json(
        { error: 'Valoración no encontrada' },
        { status: 404 }
      )
    }

    await variantRatingModel.deleteRating(id)

    return NextResponse.json({
      message: 'Valoración eliminada correctamente'
    })
  } catch (error) {
    console.error('Error en DELETE /api/admin/ratings/[ratingId]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
