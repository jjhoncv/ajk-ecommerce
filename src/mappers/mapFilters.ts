import {
  AvailableFilters,
  FilterAttribute,
  FilterBrand,
  FilterCategory
} from '@/types/search'

export const mapFilterCategory = (data: FilterCategory): FilterCategory => {
  return {
    id: data.id,
    name: data.name,
    count: data.count
  }
}

export const mapFilterCategories = (
  data: FilterCategory[]
): FilterCategory[] => {
  return data.map(mapFilterCategory)
}

export const mapFilterBrand = (data: FilterBrand): FilterBrand => {
  return {
    id: data.id,
    name: data.name,
    count: data.count
  }
}

export const mapFilterBrands = (data: FilterBrand[]): FilterBrand[] => {
  return data.map(mapFilterBrand)
}

export const mapFilterAttribute = (data: FilterAttribute): FilterAttribute => {
  return {
    id: data.id,
    name: data.name,
    displayType: data.displayType,
    options: data.options.map((option) => ({
      id: option.id,
      value: option.value,
      additionalCost: option.additionalCost,
      count: option.count
    }))
  }
}

export const mapFilterAttributes = (
  data: FilterAttribute[]
): FilterAttribute[] => {
  return data.map(mapFilterAttribute)
}

export const mapAvailableFilters = (
  categories: FilterCategory[],
  brands: FilterBrand[],
  priceRange: { min: number; max: number },
  attributes: FilterAttribute[]
): AvailableFilters => {
  return {
    categories: mapFilterCategories(categories),
    brands: mapFilterBrands(brands),
    priceRange,
    attributes: mapFilterAttributes(attributes)
  }
}
