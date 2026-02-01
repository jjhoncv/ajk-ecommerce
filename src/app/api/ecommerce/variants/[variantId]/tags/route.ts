import oTag from '@/module/tags/core/Tag.model'
import { NextResponse, type NextRequest } from 'next/server'

interface RouteContext {
  params: Promise<{ variantId: string }>
}

/**
 * GET /api/ecommerce/variants/[variantId]/tags
 * Get all active tags for a variant (public endpoint for ecommerce)
 */
export async function GET(
  _req: NextRequest,
  context: RouteContext
): Promise<Response> {
  try {
    const { variantId } = await context.params
    const id = Number(variantId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid variant ID', success: false },
        { status: 400 }
      )
    }

    const tags = await oTag.getTagsByVariantId(id)

    return NextResponse.json(
      {
        data: tags ?? [],
        success: true
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    console.error('Error fetching variant tags:', error)
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    )
  }
}
