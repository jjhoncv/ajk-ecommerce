import {
  type AvailableFilters,
  type FilterAttribute,
  type FilterBrand,
  type FilterCategory
} from './Filters.interfaces'

export const FilterCategoryMapper = (data: FilterCategory): FilterCategory => {
  return {
    id: data.id,
    name: data.name,
    count: data.count
  }
}

export const FilterCategoriesMapper = (
  data: FilterCategory[]
): FilterCategory[] => {
  return data.map(FilterCategoryMapper)
}

export const FilterBrandMapper = (data: FilterBrand): FilterBrand => {
  return {
    id: data.id,
    name: data.name,
    count: data.count
  }
}

export const FilterBrandsMapper = (data: FilterBrand[]): FilterBrand[] => {
  return data.map(FilterBrandMapper)
}

export const FilterAttributeMapper = (
  data: FilterAttribute
): FilterAttribute => {
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

export const FilterAttributesMapper = (
  data: FilterAttribute[]
): FilterAttribute[] => {
  return data.map(FilterAttributeMapper)
}

export const AvailableFiltersMapper = (
  categories: FilterCategory[],
  brands: FilterBrand[],
  priceRange: { min: number, max: number },
  attributes: FilterAttribute[]
): AvailableFilters => {
  return {
    categories: FilterCategoriesMapper(categories),
    brands: FilterBrandsMapper(brands),
    priceRange,
    attributes: FilterAttributesMapper(attributes)
  }
}
