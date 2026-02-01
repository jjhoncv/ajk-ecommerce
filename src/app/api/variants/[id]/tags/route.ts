import variantTagService from '@/module/tags/service/variantTags'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/variants/[id]/tags
 * Public endpoint - Get active tags for a variant (for ecommerce display)
 */
export async function GET(
  _req: Request,
  { params }: RouteParams
): Promise<Response> {
  const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Variant ID is required', success: false },
      { status: 400 }
    )
  }

  try {
    const tags = await variantTagService.getActiveTagsByVariantId(Number(id))

    return NextResponse.json(
      {
        data: { tags },
        success: true
      },
      { status: 200 }
    )
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    )
  }
}
