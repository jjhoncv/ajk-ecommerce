// app/api/admin/ratings/route.ts
import variantRatingModel from '@/module/products/core/VariantRating.model'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { type RatingStatus } from '@/types/domain'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as RatingStatus | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const validStatuses: RatingStatus[] = ['pending', 'approved', 'rejected']
    const filterStatus = status && validStatuses.includes(status) ? status : undefined

    const result = await variantRatingModel.getRatingsForAdmin(
      filterStatus,
      page,
      limit
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error en GET /api/admin/ratings:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
