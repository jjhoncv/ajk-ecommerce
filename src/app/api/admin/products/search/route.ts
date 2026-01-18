// app/api/admin/products/search/route.ts
import { executeQuery } from '@/lib/db'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sku = searchParams.get('sku')
    const productName = searchParams.get('name')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!sku && !productName) {
      return NextResponse.json({ variants: [] })
    }

    let query = `
      SELECT
        v.id,
        v.sku,
        v.price,
        v.stock,
        v.product_id as productId,
        p.name as productName
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      WHERE 1=1
    `
    const values: any[] = []

    if (sku) {
      query += ' AND v.sku LIKE ?'
      values.push(`%${sku}%`)
    }

    if (productName) {
      query += ' AND p.name LIKE ?'
      values.push(`%${productName}%`)
    }

    query += ' ORDER BY p.name, v.sku LIMIT ?'
    values.push(limit)

    const variants = await executeQuery<any[]>({
      query,
      values
    })

    return NextResponse.json({
      variants: variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        price: Number(v.price),
        stock: v.stock,
        productId: v.productId,
        productName: v.productName
      }))
    })
  } catch (error) {
    console.error('Error en GET /api/admin/products/search:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
