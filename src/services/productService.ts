import {
  ProductDTO,
  ProductSearchFiltersDTO,
  ProductSearchResultDTO,
  BrandDTO,
  CategoryDTO,
  AttributeDTO,
} from "@/dto";
import ProductModel from "@/models/ProductModel";
import BrandModel from "@/models/BrandModel";
import CategoryModel from "@/models/CategoryModel";
import AttributeModel from "@/models/AttributeModel";

// Servicio para obtener productos y realizar búsquedas
export class ProductService {
  // Obtener todos los productos
  public async getProducts(): Promise<ProductDTO[]> {
    return await ProductModel.getProducts();
  }

  // Obtener un producto por ID
  public async getProductById(id: number): Promise<ProductDTO | null> {
    return await ProductModel.getProductById(id);
  }

  // Obtener todas las marcas
  public async getBrands(): Promise<BrandDTO[]> {
    return await BrandModel.getBrands();
  }

  // Obtener todas las categorías
  public async getCategories(): Promise<CategoryDTO[]> {
    const flatCategories = await CategoryModel.getCategories();

    // Convertir categorías planas a estructura jerárquica
    return this.buildCategoryTree(flatCategories);
  }

  // Obtener todos los atributos
  public async getAttributes(): Promise<AttributeDTO[]> {
    return await AttributeModel.getAttributes();
  }

  // Buscar productos con filtros
  public async searchProducts(
    filters: ProductSearchFiltersDTO
  ): Promise<ProductSearchResultDTO> {
    return await ProductModel.searchProducts(filters);
  }

  // Método auxiliar para construir el árbol de categorías
  private buildCategoryTree(categories: CategoryDTO[]): CategoryDTO[] {
    // Crear un mapa para acceso rápido por ID
    const categoryMap = new Map<number, CategoryDTO>();
    categories.forEach((category) => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Construir el árbol
    const rootCategories: CategoryDTO[] = [];

    categories.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.id)!;

      if (category.parentId === null) {
        // Es una categoría raíz
        rootCategories.push(categoryWithChildren);
      } else {
        // Es una categoría hija
        const parent = categoryMap.get(category.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(categoryWithChildren);
        }
      }
    });

    return rootCategories;
  }
}

export default new ProductService();
