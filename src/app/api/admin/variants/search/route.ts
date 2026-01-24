import { executeQuery } from '@/lib/db'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { NextResponse, type NextRequest } from 'next/server'

interface VariantSearchResult {
  id: number
  sku: string
  price: number
  stock: number
  product_id: number
  product_name: string
  attributes: string
  image_url: string | null
}

/**
 * GET /api/admin/variants/search?q=iphone
 * Busca variantes por nombre de producto, SKU, marca o atributos
 * Usa la misma lógica de búsqueda eficiente del buscador principal del sitio
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions)
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')

    // Si no hay query, devolver array vacío
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ variants: [] })
    }

    // Extraer términos de búsqueda (mismo enfoque del buscador principal)
    const searchTerms = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length >= 2)

    if (searchTerms.length === 0) {
      return NextResponse.json({ variants: [] })
    }

    // Buscar variantes con la misma lógica eficiente del Search.repository
    // Busca en: nombre de producto, descripción, SKU, marca y valores de atributos
    // Usa TODOS los términos de búsqueda con lógica AND

    // Construir condiciones para cada término
    const termConditions: string[] = []
    const queryParams: (string | number)[] = []

    for (const term of searchTerms) {
      const searchTerm = `%${term}%`
      termConditions.push(`
        (
          p.name LIKE ?
          OR p.description LIKE ?
          OR pv.sku LIKE ?
          OR b.name LIKE ?
          OR EXISTS (
            SELECT 1
            FROM variant_attribute_options vao_s
            JOIN product_attribute_options pao_s ON vao_s.product_attribute_option_id = pao_s.id
            WHERE vao_s.variant_id = pv.id AND pao_s.value LIKE ?
          )
        )
      `)
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm)
    }

    const sql = `
      SELECT
        pv.id,
        pv.sku,
        pv.price,
        pv.stock,
        p.id as product_id,
        p.name as product_name,
        (
          SELECT GROUP_CONCAT(CONCAT(a2.name, ': ', pao2.value) SEPARATOR ' | ')
          FROM variant_attribute_options vao2
          JOIN product_attribute_options pao2 ON vao2.product_attribute_option_id = pao2.id
          JOIN attributes a2 ON pao2.attribute_id = a2.id
          WHERE vao2.variant_id = pv.id
        ) as attributes,
        (
          SELECT vi.image_url_thumb
          FROM variant_images vi
          WHERE vi.variant_id = pv.id
          ORDER BY vi.display_order
          LIMIT 1
        ) as image_url
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE
        pv.stock > 0
        AND ${termConditions.join(' AND ')}
      ORDER BY p.name, pv.sku
      LIMIT ?
    `

    queryParams.push(limit)

    const variants = await executeQuery<VariantSearchResult[]>({
      query: sql,
      values: queryParams
    })

    // Formatear respuesta
    const formattedVariants = (variants || []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      stock: v.stock,
      productId: v.product_id,
      productName: v.product_name,
      attributes: v.attributes || '',
      fullName: v.attributes
        ? `${v.product_name} - ${v.attributes}`
        : v.product_name,
      imageUrl: v.image_url
    }))

    return NextResponse.json({ variants: formattedVariants })
  } catch (error) {
    console.error('Error searching variants:', error)
    return NextResponse.json(
      { error: 'Error al buscar variantes' },
      { status: 500 }
    )
  }
}
