import { AvailableFilters } from '@/types/search'

// Importar repository y mappers
import { mapAvailableFilters } from '@/mappers/mapFilters'
import oFiltersRep from '@/repository/Filters.repository'

export class FiltersModel {
  public async getAvailableFilters(): Promise<AvailableFilters> {
    // Obtener todos los filtros disponibles en paralelo
    const [categories, brands, priceRange, attributes] = await Promise.all([
      oFiltersRep.getAvailableCategories(),
      oFiltersRep.getAvailableBrands(),
      oFiltersRep.getPriceRange(),
      oFiltersRep.getAvailableAttributes()
    ])

    // Mapear y retornar los filtros disponibles
    return mapAvailableFilters(categories, brands, priceRange, attributes)
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
