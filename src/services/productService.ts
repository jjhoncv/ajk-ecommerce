import attributeModel from '@/models/Attribute.model'
import brandModel from '@/models/Brand.model'
import categoryModel from '@/models/Category.model'
import productModel from '@/models/Product.model'
import searchModel from '@/models/Search.model'
import { Attributes, Brands, Categories, Products } from '@/types/domain'
import { ProductSearchFilters, ProductSearchResult } from '@/types/search'

// Servicio para obtener productos y realizar búsquedas
export class ProductService {
  // Obtener todos los productos
  public async getProducts(): Promise<Products[]> {
    const products = await productModel.getProducts()
    return products || []
  }

  // Obtener un producto por ID
  public async getProductById(id: number): Promise<Products | null> {
    const product = await productModel.getProductById(id)
    return product || null
  }

  // Obtener todas las marcas
  public async getBrands(): Promise<Brands[]> {
    const brands = await brandModel.getBrands()
    return brands || []
  }

  // Obtener todas las categorías
  public async getCategories(): Promise<Categories[]> {
    const flatCategories = await categoryModel.getCategories()

    if (!flatCategories) return []

    // Convertir categorías planas a estructura jerárquica
    return this.buildCategoryTree(flatCategories)
  }

  // Obtener todos los atributos
  public async getAttributes(): Promise<Attributes[]> {
    const attributes = await attributeModel.getAttributes()
    return attributes || []
  }

  // Buscar productos con filtros
  public async searchProducts(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    return await searchModel.searchProducts(filters)
  }

  // Método auxiliar para construir el árbol de categorías
  private buildCategoryTree(categories: Categories[]): Categories[] {
    // Crear un mapa para acceso rápido por ID
    const categoryMap = new Map<
      number,
      Categories & { children?: Categories[] }
    >()
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Construir el árbol
    const rootCategories: Categories[] = []

    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!

      if (category.parentId === null) {
        // Es una categoría raíz
        rootCategories.push(categoryWithChildren)
      } else if (category.parentId !== undefined) {
        // Es una categoría hija
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(categoryWithChildren)
        }
      }
    })

    return rootCategories
  }
}

export default new ProductService()
