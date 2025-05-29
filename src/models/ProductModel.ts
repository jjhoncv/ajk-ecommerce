import {
  ProductDTO,
  ProductSearchFiltersDTO,
  ProductSearchResultDTO,
} from "@/dto";
import { Product } from "@/interfaces/models";
import { executeQuery } from "@/lib/db";
import { BrandModel } from "./BrandModel";
import { CategoryModel } from "./CategoryModel";
import { ProductVariantModel } from "./ProductVariantModel";

export class ProductModel {
  private brandModel = new BrandModel();
  private categoryModel = new CategoryModel();
  private variantModel = new ProductVariantModel();

  public async getProducts(): Promise<ProductDTO[]> {
    const products = await executeQuery<Product[]>({
      query: "SELECT * FROM products",
    });

    return await Promise.all(
      products.map((product) => this.mapProductToDTO(product))
    );
  }

  public async getProductById(id: number): Promise<ProductDTO | null> {
    const products = await executeQuery<Product[]>({
      query: "SELECT * FROM products WHERE id = ?",
      values: [id],
    });

    if (products.length === 0) return null;

    return await this.mapProductToDTO(products[0]);
  }

  public async searchProducts(
    filters: ProductSearchFiltersDTO
  ): Promise<ProductSearchResultDTO> {
    // Construir la consulta base
    let query = `
      SELECT 
        p.id, p.name, p.description, p.brand_id, p.base_price, p.created_at, p.updated_at
      FROM 
        products p
    `;

    // Construir las condiciones WHERE
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // Filtrar por texto de búsqueda
    if (filters.query) {
      whereConditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      const searchTerm = `%${filters.query}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Filtrar por categoría
    if (filters.categoryId) {
      query += " JOIN product_categories pc ON p.id = pc.product_id";
      whereConditions.push("pc.category_id = ?");
      queryParams.push(filters.categoryId);
    }

    // Filtrar por marca
    if (filters.brandId) {
      whereConditions.push("p.brand_id = ?");
      queryParams.push(filters.brandId);
    }

    // Filtrar por atributos
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      // Para cada atributo, añadir una condición
      Object.entries(filters.attributes).forEach(
        ([attributeId, optionIds], index) => {
          if (optionIds.length > 0) {
            // Añadir un JOIN para cada atributo
            const variantAlias = `v${index}`;
            const vaoAlias = `vao${index}`;

            query += `
            JOIN product_variants ${variantAlias} ON p.id = ${variantAlias}.product_id
            JOIN variant_attribute_options ${vaoAlias} ON ${variantAlias}.id = ${vaoAlias}.variant_id
          `;

            // Añadir la condición para las opciones de atributo
            const placeholders = optionIds.map(() => "?").join(", ");
            whereConditions.push(
              `${vaoAlias}.attribute_option_id IN (${placeholders})`
            );
            queryParams.push(...optionIds);
          }
        }
      );
    }

    // Añadir las condiciones WHERE a la consulta
    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    // Añadir GROUP BY para evitar duplicados
    query += " GROUP BY p.id";

    // Añadir ORDER BY
    if (filters.sort) {
      switch (filters.sort) {
        case "price_asc":
          query += " ORDER BY p.base_price ASC";
          break;
        case "price_desc":
          query += " ORDER BY p.base_price DESC";
          break;
        case "name_asc":
          query += " ORDER BY p.name ASC";
          break;
        case "name_desc":
          query += " ORDER BY p.name DESC";
          break;
        case "newest":
          query += " ORDER BY p.created_at DESC";
          break;
      }
    } else {
      // Ordenamiento por defecto
      query += " ORDER BY p.created_at DESC";
    }

    // Consulta para contar el total de resultados
    const countQuery = `SELECT COUNT(DISTINCT p.id) as total FROM ${
      query.split("FROM")[1].split("GROUP BY")[0]
    }`;
    const countResult = await executeQuery<[{ total: number }]>({
      query: countQuery,
      values: queryParams,
    });
    const totalCount = countResult[0]?.total || 0;

    // Añadir LIMIT y OFFSET para paginación
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    query += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Ejecutar la consulta
    const products = await executeQuery<Product[]>({
      query,
      values: queryParams,
    });

    // Mapear los productos a DTOs
    const productDTOs = await Promise.all(
      products.map((product) => this.mapProductToDTO(product))
    );

    // Calcular filtros disponibles
    const availableFilters = await this.calculateAvailableFilters(filters);

    console.log("productDTOs", productDTOs);

    return {
      products: productDTOs,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      filters: availableFilters,
    };
  }

  private async mapProductToDTO(product: Product): Promise<ProductDTO> {
    // Obtener la marca
    const brand = await this.brandModel.getBrandById(product.brand_id);

    // Obtener las categorías
    const categories = await this.categoryModel.getCategoriesByProductId(
      product.id
    );

    // Obtener las variantes
    const variants = await this.variantModel.getVariantsByProductId(product.id);

    // Encontrar la imagen principal (primera imagen de la primera variante)
    let mainImage = null;
    if (variants.length > 0 && variants[0].images.length > 0) {
      const primaryImage = variants[0].images.find((img) => img.isPrimary);
      mainImage = primaryImage
        ? primaryImage.imageUrl
        : variants[0].images[0].imageUrl;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      brandId: product.brand_id,
      brandName: brand?.name || "",
      basePrice: product.base_price,
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
      })),
      variants,
      mainImage,
    };
  }

  private async calculateAvailableFilters(
    filters: ProductSearchFiltersDTO
  ): Promise<ProductSearchResultDTO["filters"]> {
    // Obtener categorías disponibles
    const categoriesQuery = `
      SELECT c.id, c.name, COUNT(DISTINCT p.id) as count
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      JOIN products p ON pc.product_id = p.id
      GROUP BY c.id
      ORDER BY count DESC
    `;
    const categories = await executeQuery<
      { id: number; name: string; count: number }[]
    >({
      query: categoriesQuery,
    });

    // Obtener marcas disponibles
    const brandsQuery = `
      SELECT b.id, b.name, COUNT(p.id) as count
      FROM brands b
      JOIN products p ON b.id = p.brand_id
      GROUP BY b.id
      ORDER BY count DESC
    `;
    const brands = await executeQuery<
      { id: number; name: string; count: number }[]
    >({
      query: brandsQuery,
    });

    // Obtener rango de precios
    const priceRangeQuery = `
      SELECT MIN(pv.price) as min, MAX(pv.price) as max
      FROM product_variants pv
    `;
    const priceRange = await executeQuery<[{ min: number; max: number }]>({
      query: priceRangeQuery,
    });

    // Obtener atributos y opciones disponibles
    const attributesQuery = `
      SELECT 
        a.id, a.name, 
        ao.id as option_id, ao.value as option_value,
        COUNT(DISTINCT pv.product_id) as count
      FROM attributes a
      JOIN attribute_options ao ON a.id = ao.attribute_id
      JOIN variant_attribute_options vao ON ao.id = vao.attribute_option_id
      JOIN product_variants pv ON vao.variant_id = pv.id
      GROUP BY a.id, ao.id
      ORDER BY a.id, count DESC
    `;
    const attributeOptions = await executeQuery<
      {
        id: number;
        name: string;
        option_id: number;
        option_value: string;
        count: number;
      }[]
    >({
      query: attributesQuery,
    });

    // Agrupar opciones por atributo
    const attributesMap = new Map<
      number,
      {
        id: number;
        name: string;
        options: {
          id: number;
          value: string;
          count: number;
        }[];
      }
    >();

    attributeOptions.forEach((option) => {
      if (!attributesMap.has(option.id)) {
        attributesMap.set(option.id, {
          id: option.id,
          name: option.name,
          options: [],
        });
      }

      attributesMap.get(option.id)?.options.push({
        id: option.option_id,
        value: option.option_value,
        count: option.count,
      });
    });

    return {
      categories,
      brands,
      priceRange: priceRange[0] || { min: 0, max: 0 },
      attributes: Array.from(attributesMap.values()),
    };
  }
}

export default new ProductModel();
