import { executeQuery } from '@/lib/db'
import {
  type FilterAttribute,
  type FilterBrand,
  type FilterCategory,
  type PriceRange
} from './Filters.interfaces'

export class FiltersRepository {
  public async getAvailableCategories(): Promise<FilterCategory[]> {
    const categoriesQuery = `
      SELECT c.id, c.name, COUNT(DISTINCT pv.id) as count
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      JOIN products p ON pc.product_id = p.id
      JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY c.id
      ORDER BY count DESC
    `
    const categories = await executeQuery<FilterCategory[]>({
      query: categoriesQuery
    })

    return categories
  }

  public async getAvailableBrands(): Promise<FilterBrand[]> {
    const brandsQuery = `
      SELECT b.id, b.name, COUNT(DISTINCT pv.id) as count
      FROM brands b
      JOIN products p ON b.id = p.brand_id
      JOIN product_variants pv ON p.id = pv.product_id
      GROUP BY b.id
      ORDER BY count DESC
    `
    const brands = await executeQuery<FilterBrand[]>({
      query: brandsQuery
    })

    return brands
  }

  public async getPriceRange(): Promise<PriceRange> {
    const priceRangeQuery = `
      SELECT MIN(pv.price) as min, MAX(pv.price) as max
      FROM product_variants pv
    `
    const priceRange = await executeQuery<[PriceRange]>({
      query: priceRangeQuery
    })

    return priceRange[0] || { min: 0, max: 0 }
  }

  public async getAvailableAttributes(): Promise<FilterAttribute[]> {
    const attributesQuery = `
      SELECT
        a.id,
        a.name,
        a.display_type,
        pao.id as option_id,
        pao.value as option_value,
        COUNT(DISTINCT pv.id) as count
      FROM attributes a
      JOIN product_attribute_options pao ON a.id = pao.attribute_id
      JOIN variant_attribute_options vao ON pao.id = vao.product_attribute_option_id
      JOIN product_variants pv ON vao.variant_id = pv.id
      GROUP BY a.id, pao.id
      ORDER BY a.id, count DESC
    `
    const attributeOptions = await executeQuery<
      Array<{
        id: number
        name: string
        display_type: string
        option_id: number
        option_value: string
        count: number
      }>
    >({
      query: attributesQuery
    })

    if (!attributeOptions || attributeOptions.length === 0) {
      return []
    }

    const attributesMap = new Map<number, FilterAttribute>()

    attributeOptions.forEach((row) => {
      // Validar que los datos sean correctos
      if (!row || typeof row.id !== 'number' || !row.name || typeof row.option_id !== 'number') {
        console.error('Invalid row data:', row)
        return
      }

      if (!attributesMap.has(row.id)) {
        attributesMap.set(row.id, {
          id: row.id,
          name: row.name,
          displayType: row.display_type || 'pills',
          options: []
        })
      }

      const attribute = attributesMap.get(row.id)
      if (attribute) {
        attribute.options.push({
          id: row.option_id,
          value: row.option_value || '',
          additionalCost: 0,
          count: Number(row.count) || 0
        })
      }
    })

    return Array.from(attributesMap.values())
  }
}

const filtersRepository = new FiltersRepository()
export default filtersRepository
