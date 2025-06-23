import { executeQuery } from '@/lib/db'
import { type ProductSearchFilters } from './Search.interfaces'

export interface VariantSearchResultRaw {
  variant_id: number
  product_id: number
  sku: string
  price: number
  stock: number
  product_name: string
  product_description: string
  brand_id: number
  base_price: number
}

export class SearchRepository {
  public async searchProductVariants(
    filters: ProductSearchFilters
  ): Promise<{ results: VariantSearchResultRaw[]; totalCount: number }> {
    try {
      // ✅ Construir SELECT dinámicamente según si hay filtros de promoción
      const hasPromotionFilter =
        filters.promotionIds && filters.promotionIds.length > 0

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
        p.base_price${hasPromotionFilter ? ',\n        prom.id as promotion_id, prom.name as promotion_name, prom.type as promotion_type' : ''}
      FROM 
        product_variants pv
      JOIN 
        products p ON pv.product_id = p.id
    `

      const whereConditions: string[] = []
      const queryParams: Array<string | number> = []
      const additionalJoins: string[] = []

      // === BÚSQUEDA POR TEXTO MEJORADA ===
      if (filters.query && filters.query.trim().length > 0) {
        const searchTerms = filters.query
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .filter((term) => term.length >= 2)

        if (searchTerms.length > 0) {
          // Agregar JOIN con brands para poder buscar en marcas
          if (!additionalJoins.some((join) => join.includes('brands'))) {
            additionalJoins.push('LEFT JOIN brands b ON p.brand_id = b.id')
          }

          const significantTerms = searchTerms.filter(
            (term) => term.length >= 3
          )
          const finalSearchTerms =
            significantTerms.length > 0
              ? [significantTerms[0]]
              : [searchTerms[0]]

          if (finalSearchTerms.length === 1 || searchTerms.length === 1) {
            whereConditions.push(`
            (LOWER(p.name) LIKE LOWER(?) OR 
             LOWER(p.description) LIKE LOWER(?) OR 
             LOWER(pv.sku) LIKE LOWER(?) OR
             LOWER(b.name) LIKE LOWER(?) OR
             EXISTS (
               SELECT 1 FROM variant_attribute_options vao_search
               JOIN attribute_options ao_search ON vao_search.attribute_option_id = ao_search.id
               WHERE vao_search.variant_id = pv.id 
               AND LOWER(ao_search.value) LIKE LOWER(?)
             ))
          `)
            const searchTerm = `%${searchTerms[0]}%`
            queryParams.push(
              searchTerm,
              searchTerm,
              searchTerm,
              searchTerm,
              searchTerm
            )
          } else {
            const termConditions = searchTerms.map((term, index) => {
              const searchTerm = `%${term}%`
              queryParams.push(
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm
              )

              return `
              (LOWER(p.name) LIKE LOWER(?) OR 
               LOWER(p.description) LIKE LOWER(?) OR 
               LOWER(pv.sku) LIKE LOWER(?) OR
               LOWER(b.name) LIKE LOWER(?) OR
               EXISTS (
                 SELECT 1 FROM variant_attribute_options vao_${index}
                 JOIN attribute_options ao_${index} ON vao_${index}.attribute_option_id = ao_${index}.id
                 WHERE vao_${index}.variant_id = pv.id 
                 AND LOWER(ao_${index}.value) LIKE LOWER(?)
               ))
            `
            })

            whereConditions.push(`(${termConditions.join(' AND ')})`)
          }
        }
      }

      // === FILTRO POR CATEGORÍA ===
      if (filters.categoryId && filters.categoryId > 0) {
        additionalJoins.push(
          'JOIN product_categories pc ON p.id = pc.product_id'
        )
        whereConditions.push('pc.category_id = ?')
        queryParams.push(filters.categoryId)
      }

      // === FILTRO POR MARCA ===
      if (filters.brandId && filters.brandId > 0) {
        whereConditions.push('p.brand_id = ?')
        queryParams.push(filters.brandId)
      }

      // === FILTROS POR PRECIO ===
      if (
        filters.minPrice !== undefined &&
        filters.minPrice !== null &&
        filters.minPrice >= 0
      ) {
        whereConditions.push('pv.price >= ?')
        queryParams.push(filters.minPrice)
      }

      if (
        filters.maxPrice !== undefined &&
        filters.maxPrice !== null &&
        filters.maxPrice > 0
      ) {
        whereConditions.push('pv.price <= ?')
        queryParams.push(filters.maxPrice)
      }

      // === FILTRO POR PROMOCIONES ===
      if (filters.promotionIds && filters.promotionIds.length > 0) {
        additionalJoins.push(`
        JOIN promotion_variants prom_v ON pv.id = prom_v.variant_id
        JOIN promotions prom ON prom_v.promotion_id = prom.id
      `)

        const placeholders = filters.promotionIds.map(() => '?').join(', ')
        whereConditions.push(`prom.id IN (${placeholders})`)
        queryParams.push(...filters.promotionIds)

        // También filtrar por promociones activas
        whereConditions.push(`
        prom.is_active = 1 
        AND prom.start_date <= NOW() 
        AND (prom.end_date IS NULL OR prom.end_date >= NOW())
      `)
      }

      // === FILTROS POR ATRIBUTOS ===
      if (filters.attributes && typeof filters.attributes === 'object') {
        const attributeEntries = Object.entries(filters.attributes).filter(
          ([, optionIds]) => Array.isArray(optionIds) && optionIds.length > 0
        )

        attributeEntries.forEach(([, optionIds], index) => {
          const vaoAlias = `vao_filter_${index}`
          additionalJoins.push(
            `JOIN variant_attribute_options ${vaoAlias} ON pv.id = ${vaoAlias}.variant_id`
          )
          const placeholders = optionIds.map(() => '?').join(', ')
          whereConditions.push(
            `${vaoAlias}.attribute_option_id IN (${placeholders})`
          )
          queryParams.push(...optionIds)
        })
      }

      // === CONSTRUIR CONSULTA FINAL ===
      // Agregar JOINs adicionales
      if (additionalJoins.length > 0) {
        query += ' ' + additionalJoins.join(' ')
      }

      // Agregar WHERE solo si hay condiciones
      if (whereConditions.length > 0) {
        query += ' WHERE ' + whereConditions.join(' AND ')
      }

      // GROUP BY para evitar duplicados
      let groupByFields =
        'pv.id, pv.product_id, pv.sku, pv.price, pv.stock, p.name, p.description, p.brand_id, p.base_price'
      if (hasPromotionFilter) {
        groupByFields += ', prom.id, prom.name, prom.type'
      }
      query += ` GROUP BY ${groupByFields}`

      // === CONSULTA PARA CONTAR TOTAL ===
      const countQueryBase = query
        .split('GROUP BY')[0]
        .replace(
          /SELECT[\s\S]*?FROM/i,
          'SELECT COUNT(DISTINCT pv.id) as total FROM'
        )

      const countResult = await executeQuery<[{ total: number }]>({
        query: countQueryBase,
        values: [...queryParams]
      })
      const totalCount = countResult[0]?.total || 0

      // === ORDENAMIENTO ===
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
          default:
            query += ' ORDER BY p.created_at DESC'
        }
      } else {
        query += ' ORDER BY p.created_at DESC'
      }

      // === PAGINACIÓN ===
      const page = Math.max(1, filters.page || 1)
      const limit = Math.max(1, Math.min(100, filters.limit || 10))
      const offset = (page - 1) * limit

      query += ' LIMIT ? OFFSET ?'
      queryParams.push(limit, offset)

      // === EJECUTAR CONSULTA PRINCIPAL ===
      const results = await executeQuery<VariantSearchResultRaw[]>({
        query,
        values: queryParams
      })

      return { results, totalCount }
    } catch (error) {
      console.error('=== ERROR in searchProductVariants ===')
      console.error('Error:', error)
      console.error('Filters:', JSON.stringify(filters, null, 2))
      throw new Error(
        `Error en búsqueda de productos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    }
  }

  public async getSearchSuggestions(
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      // Solo tomar términos de 2+ caracteres, sin filtros complicados
      const searchTerms = query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length >= 2)

      if (searchTerms.length === 0) {
        return []
      }

      // Siempre usar búsqueda simple con el primer término válido
      // Esto es más estable y predecible
      return this.getSingleTermSuggestions(searchTerms[0], limit)
    } catch (error) {
      console.error('Error in getSearchSuggestions:', error)
      return []
    }
  }

  private async getSingleTermSuggestions(
    term: string,
    limit: number
  ): Promise<string[]> {
    try {
      const searchTerm = `%${term}%`

      const suggestions = await executeQuery<
        Array<{ suggestion: string; priority: number }>
      >({
        query: `
          SELECT DISTINCT suggestion, priority FROM (
            -- Productos que contienen el término
            SELECT DISTINCT p.name as suggestion, 1 as priority
            FROM products p
            WHERE LOWER(p.name) LIKE LOWER(?)
            
            UNION
            
            -- SKUs que contienen el término
            SELECT DISTINCT pv.sku as suggestion, 2 as priority
            FROM product_variants pv
            WHERE LOWER(pv.sku) LIKE LOWER(?)
            
            UNION
            
            -- Productos + atributos específicos
            SELECT DISTINCT CONCAT(p.name, ' ', ao.value) as suggestion, 3 as priority
            FROM products p
            JOIN product_variants pv ON p.id = pv.product_id
            JOIN variant_attribute_options vao ON pv.id = vao.variant_id
            JOIN attribute_options ao ON vao.attribute_option_id = ao.id
            WHERE (LOWER(p.name) LIKE LOWER(?) OR LOWER(ao.value) LIKE LOWER(?))
            
            UNION
            
            -- Productos + marca
            SELECT DISTINCT CONCAT(p.name, ' ', b.name) as suggestion, 4 as priority
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            WHERE (LOWER(p.name) LIKE LOWER(?) OR LOWER(b.name) LIKE LOWER(?))
            
            UNION
            
            -- Solo valores de atributos
            SELECT DISTINCT ao.value as suggestion, 5 as priority
            FROM attribute_options ao
            WHERE LOWER(ao.value) LIKE LOWER(?)
            
            UNION
            
            -- Solo nombres de marcas
            SELECT DISTINCT b.name as suggestion, 6 as priority
            FROM brands b
            WHERE LOWER(b.name) LIKE LOWER(?)
          ) AS suggestions_union
          ORDER BY priority ASC, suggestion ASC
          LIMIT ?
        `,
        values: [
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          searchTerm,
          limit
        ]
      })

      return suggestions.map((item) => item.suggestion)
    } catch (error) {
      console.error('Error in getSingleTermSuggestions:', error)
      return []
    }
  }

  private async getMultiTermSuggestions(
    terms: string[],
    limit: number
  ): Promise<string[]> {
    try {
      // Para múltiples términos, enfoque más directo y efectivo
      const suggestions = await executeQuery<
        Array<{ suggestion: string; priority: number }>
      >({
        query: `
          SELECT DISTINCT suggestion, priority FROM (
            -- Productos que contienen TODOS los términos en el nombre
            SELECT DISTINCT p.name as suggestion, 1 as priority
            FROM products p
            WHERE ${terms.map(() => 'LOWER(p.name) LIKE LOWER(?)').join(' AND ')}
            
            UNION
            
            -- Productos + atributos donde al menos coincidan los términos
            SELECT DISTINCT CONCAT(p.name, ' ', ao.value) as suggestion, 2 as priority
            FROM products p
            JOIN product_variants pv ON p.id = pv.product_id
            JOIN variant_attribute_options vao ON pv.id = vao.variant_id
            JOIN attribute_options ao ON vao.attribute_option_id = ao.id
            WHERE ${terms.map(() => '(LOWER(p.name) LIKE LOWER(?) OR LOWER(ao.value) LIKE LOWER(?))').join(' AND ')}
            
            UNION
            
            -- Productos + marca donde coincidan los términos
            SELECT DISTINCT CONCAT(p.name, ' ', b.name) as suggestion, 3 as priority
            FROM products p
            JOIN brands b ON p.brand_id = b.id
            WHERE ${terms.map(() => '(LOWER(p.name) LIKE LOWER(?) OR LOWER(b.name) LIKE LOWER(?))').join(' AND ')}
          ) AS suggestions_union
          ORDER BY priority ASC, suggestion ASC
          LIMIT ?
        `,
        values: [
          // Para productos simples
          ...terms.map((term) => `%${term}%`),
          // Para productos + atributos (2 parámetros por término)
          ...terms.flatMap((term) => [`%${term}%`, `%${term}%`]),
          // Para productos + marca (2 parámetros por término)
          ...terms.flatMap((term) => [`%${term}%`, `%${term}%`]),
          // Límite
          limit
        ]
      })

      return suggestions.map((item) => item.suggestion)
    } catch (error) {
      console.error('Error in getMultiTermSuggestions:', error)
      // Fallback a búsqueda simple si falla
      return await this.getSingleTermSuggestions(terms.join(' '), limit)
    }
  }
}

const searchRepository = new SearchRepository()
export default searchRepository
