import searchModel from '@/backend/search'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length < 2) {
      return NextResponse.json([])
    }

    const suggestions = await searchModel.getSearchSuggestions(query, limit)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error al obtener sugerencias:', error)
    return NextResponse.json(
      { error: 'Error al obtener sugerencias' },
      { status: 500 }
    )
  }
}
