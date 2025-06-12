import { executeQuery } from '@/lib/db'
import {
  FilterAttribute,
  FilterBrand,
  FilterCategory,
  PriceRange
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
        a.id, a.name, a.display_type,
        ao.id as option_id, ao.value as option_value, ao.additional_cost,
        COUNT(DISTINCT pv.id) as count
      FROM attributes a
      JOIN attribute_options ao ON a.id = ao.attribute_id
      JOIN variant_attribute_options vao ON ao.id = vao.attribute_option_id
      JOIN product_variants pv ON vao.variant_id = pv.id
      GROUP BY a.id, ao.id
      ORDER BY a.id, count DESC
    `
    const attributeOptions = await executeQuery<
      {
        id: number
        name: string
        display_type: string
        option_id: number
        option_value: string
        additional_cost: number
        count: number
      }[]
    >({
      query: attributesQuery
    })

    const attributesMap = new Map<number, FilterAttribute>()

    attributeOptions.forEach((option) => {
      if (!attributesMap.has(option.id)) {
        attributesMap.set(option.id, {
          id: option.id,
          name: option.name,
          displayType: option.display_type,
          options: []
        })
      }

      attributesMap.get(option.id)?.options.push({
        id: option.option_id,
        value: option.option_value,
        additionalCost: option.additional_cost,
        count: option.count
      })
    })

    return Array.from(attributesMap.values())
  }
}

const filtersRepository = new FiltersRepository()
export default filtersRepository
