import { executeQuery } from '@/lib/db'
import { VariantSearchResultRaw } from '@/types/database/search'
import { ProductSearchFilters } from '@/types/search'

export class SearchRepository {
  public async searchProductVariants(
    filters: ProductSearchFilters
  ): Promise<{ results: VariantSearchResultRaw[]; totalCount: number }> {
    let query = `
      SELECT 
        pv.id as variant_id, 
        pv.product_id, 
        pv.sku, 
        pv.price, 
        pv.stock,
        p.name as product_name, 
        p.description as product_description, 
        p.brand_id, 
        p.base_price
      FROM 
        product_variants pv
      JOIN 
        products p ON pv.product_id = p.id
    `

    const whereConditions: string[] = []
    const queryParams: (string | number)[] = []

    // Filtrar por texto de búsqueda
    if (filters.query) {
      whereConditions.push(
        '(p.name LIKE ? OR p.description LIKE ? OR pv.sku LIKE ?)'
      )
      const searchTerm = `%${filters.query}%`
      queryParams.push(searchTerm, searchTerm, searchTerm)
    }

    // Filtrar por categoría
    if (filters.categoryId) {
      query += ' JOIN product_categories pc ON p.id = pc.product_id'
      whereConditions.push('pc.category_id = ?')
      queryParams.push(filters.categoryId)
    }

    // Filtrar por marca
    if (filters.brandId) {
      whereConditions.push('p.brand_id = ?')
      queryParams.push(filters.brandId)
    }

    // Filtrar por rango de precios
    if (filters.minPrice !== undefined) {
      whereConditions.push('pv.price >= ?')
      queryParams.push(filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      whereConditions.push('pv.price <= ?')
      queryParams.push(filters.maxPrice)
    }

    // Filtrar por atributos
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      Object.entries(filters.attributes).forEach(([, optionIds], index) => {
        if (optionIds.length > 0) {
          const vaoAlias = `vao${index}`
          query += `
            JOIN variant_attribute_options ${vaoAlias} ON pv.id = ${vaoAlias}.variant_id
          `
          const placeholders = optionIds.map(() => '?').join(', ')
          whereConditions.push(
            `${vaoAlias}.attribute_option_id IN (${placeholders})`
          )
          queryParams.push(...optionIds)
        }
      })
    }

    // Añadir las condiciones WHERE a la consulta
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ')
    }

    // Añadir GROUP BY para evitar duplicados
    query += ' GROUP BY pv.id'

    // Consulta para contar el total de resultados
    const countQuery = `SELECT COUNT(DISTINCT pv.id) as total FROM ${
      query.split('FROM')[1].split('GROUP BY')[0]
    }`
    const countResult = await executeQuery<[{ total: number }]>({
      query: countQuery,
      values: queryParams
    })
    const totalCount = countResult[0]?.total || 0

    // Añadir ORDER BY
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          query += ' ORDER BY pv.price ASC'
          break
        case 'price_desc':
          query += ' ORDER BY pv.price DESC'
          break
        case 'name_asc':
          query += ' ORDER BY p.name ASC'
          break
        case 'name_desc':
          query += ' ORDER BY p.name DESC'
          break
        case 'newest':
          query += ' ORDER BY p.created_at DESC'
          break
      }
    } else {
      query += ' ORDER BY p.created_at DESC'
    }

    // Añadir LIMIT y OFFSET para paginación
    const page = filters.page || 1
    const limit = filters.limit || 10
    const offset = (page - 1) * limit

    query += ' LIMIT ? OFFSET ?'
    queryParams.push(limit, offset)

    // Ejecutar la consulta
    const results = await executeQuery<VariantSearchResultRaw[]>({
      query,
      values: queryParams
    })

    return { results, totalCount }
  }
}

const searchRepository = new SearchRepository()
export default searchRepository
