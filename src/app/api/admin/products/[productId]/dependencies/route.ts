import { executeQuery } from '@/lib/db'
import { NextResponse } from 'next/server'

interface DependencyCounts {
  variants: number
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  try {
    const { productId } = await params
    const id = parseInt(productId)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID de producto inválido', success: false },
        { status: 400 }
      )
    }

    // Contar variantes (único bloqueo para eliminar producto)
    const [variantsResult] = await executeQuery<[{ count: number }]>({
      query: 'SELECT COUNT(*) as count FROM product_variants WHERE product_id = ?',
      values: [id]
    })

    const dependencies: DependencyCounts = {
      variants: variantsResult?.count ?? 0
    }

    return NextResponse.json({
      success: true,
      data: dependencies,
      hasDependencies: dependencies.variants > 0
    })
  } catch (error) {
    console.error('Error fetching product dependencies:', error)
    return NextResponse.json(
      { error: 'Error al obtener dependencias', success: false },
      { status: 500 }
    )
  }
}
