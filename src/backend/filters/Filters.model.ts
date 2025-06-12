// me
import { AvailableFilters } from './Filters.interfaces'
import { AvailableFiltersMapper } from './Filters.mapper'
import oFiltersRep from './Filters.repository'

export class FiltersModel {
  public async getAvailableFilters(): Promise<AvailableFilters> {
    const [categories, brands, priceRange, attributes] = await Promise.all([
      oFiltersRep.getAvailableCategories(),
      oFiltersRep.getAvailableBrands(),
      oFiltersRep.getPriceRange(),
      oFiltersRep.getAvailableAttributes()
    ])

    return AvailableFiltersMapper(categories, brands, priceRange, attributes)
  }

  public async getAvailableCategories() {
    return await oFiltersRep.getAvailableCategories()
  }

  public async getAvailableBrands() {
    return await oFiltersRep.getAvailableBrands()
  }

  public async getPriceRange() {
    return await oFiltersRep.getPriceRange()
  }

  public async getAvailableAttributes() {
    return await oFiltersRep.getAvailableAttributes()
  }
}

const filtersModel = new FiltersModel()
export default filtersModel
