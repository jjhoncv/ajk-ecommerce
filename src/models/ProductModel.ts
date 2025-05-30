import {
  ProductDTO,
  ProductSearchFiltersDTO,
  ProductSearchResultDTO,
  ProductVariantDTO,
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
    // Modificamos la búsqueda para devolver variantes en lugar de productos
    return await this.searchProductVariants(filters);
  }

  public async searchProductVariants(
    filters: ProductSearchFiltersDTO
  ): Promise<ProductSearchResultDTO> {
    // Construir la consulta base para variantes
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
        p.base_price
      FROM 
        product_variants pv
      JOIN 
        products p ON pv.product_id = p.id
    `;

    // Construir las condiciones WHERE
    const whereConditions: string[] = [];
    const queryParams: any[] = [];

    // Filtrar por texto de búsqueda
    if (filters.query) {
      whereConditions.push(
        "(p.name LIKE ? OR p.description LIKE ? OR pv.sku LIKE ?)"
      );
      const searchTerm = `%${filters.query}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
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

    // Filtrar por rango de precios
    if (filters.minPrice !== undefined) {
      whereConditions.push("pv.price >= ?");
      queryParams.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      whereConditions.push("pv.price <= ?");
      queryParams.push(filters.maxPrice);
    }

    // Filtrar por atributos
    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      // Para cada atributo, añadir una condición
      Object.entries(filters.attributes).forEach(
        ([attributeId, optionIds], index) => {
          if (optionIds.length > 0) {
            // Añadir un JOIN para cada atributo
            const vaoAlias = `vao${index}`;

            query += `
            JOIN variant_attribute_options ${vaoAlias} ON pv.id = ${vaoAlias}.variant_id
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
    query += " GROUP BY pv.id";

    // Añadir ORDER BY
    if (filters.sort) {
      switch (filters.sort) {
        case "price_asc":
          query += " ORDER BY pv.price ASC";
          break;
        case "price_desc":
          query += " ORDER BY pv.price DESC";
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
    const countQuery = `SELECT COUNT(DISTINCT pv.id) as total FROM ${
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
    const variantResults = await executeQuery<any[]>({
      query,
      values: queryParams,
    });

    // Procesar cada variante como un producto individual
    const productDTOs = await Promise.all(
      variantResults.map(async (variant) => {
        // Obtener detalles completos de la variante
        const variantDetail = await this.variantModel.getVariantById(
          variant.variant_id
        );

        if (!variantDetail) {
          return null;
        }

        // Obtener la marca
        const brand = await this.brandModel.getBrandById(variant.brand_id);

        // Obtener las categorías
        const categories = await this.categoryModel.getCategoriesByProductId(
          variant.product_id
        );

        // Encontrar la imagen principal de la variante
        let mainImage = null;
        if (variantDetail.images.length > 0) {
          const primaryImage = variantDetail.images.find(
            (img) => img.isPrimary
          );
          mainImage = primaryImage
            ? primaryImage.imageUrl
            : variantDetail.images[0].imageUrl;
        }

        // Crear un ProductDTO para esta variante
        return {
          id: Number(variant.product_id),
          name: variant.product_name,
          description: variant.product_description,
          brandId: Number(variant.brand_id),
          brandName: brand?.name || "",
          basePrice: Number(variant.base_price),
          minVariantPrice: Number(variant.price),
          categories: categories.map((cat) => ({
            id: Number(cat.id),
            name: cat.name,
          })),
          variants: [variantDetail], // Solo incluimos esta variante
          mainImage,
          // Añadir información específica de la variante
          variantId: Number(variant.variant_id),
          variantSku: variant.sku,
          variantPrice: Number(variant.price),
          variantStock: Number(variant.stock),
        };
      })
    );

    // Filtrar posibles nulos y asegurar que los tipos sean correctos
    const filteredProductDTOs = productDTOs
      .filter((dto): dto is NonNullable<typeof dto> => dto !== null)
      .map((dto) => ({
        ...dto,
        minVariantPrice: dto.minVariantPrice || dto.basePrice,
      }));

    // Calcular filtros disponibles
    const availableFilters = await this.calculateAvailableFilters(filters);

    return {
      products: filteredProductDTOs,
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

    // Calcular el precio mínimo de las variantes
    const prices = variants.map((variant) => Number(variant.price));
    const minVariantPrice =
      prices.length > 0 ? Math.min(...prices) : Number(product.base_price);

    return {
      id: Number(product.id),
      name: product.name,
      description: product.description,
      brandId: Number(product.brand_id),
      brandName: brand?.name || "",
      basePrice: Number(product.base_price),
      minVariantPrice,
      categories: categories.map((cat) => ({
        id: Number(cat.id),
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
      SELECT c.id, c.name, COUNT(DISTINCT pv.id) as count
      FROM categories c
      JOIN product_categories pc ON c.id = pc.category_id
      JOIN products p ON pc.product_id = p.id
      JOIN product_variants pv ON p.id = pv.product_id
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
      SELECT b.id, b.name, COUNT(DISTINCT pv.id) as count
      FROM brands b
      JOIN products p ON b.id = p.brand_id
      JOIN product_variants pv ON p.id = pv.product_id
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
        a.id, a.name, a.display_type,
        ao.id as option_id, ao.value as option_value, ao.additional_cost,
        COUNT(DISTINCT pv.id) as count
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
        display_type: string;
        option_id: number;
        option_value: string;
        additional_cost: number;
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
        display_type: string;
        options: {
          id: number;
          value: string;
          additional_cost: number;
          count: number;
        }[];
      }
    >();

    attributeOptions.forEach((option) => {
      if (!attributesMap.has(option.id)) {
        attributesMap.set(option.id, {
          id: option.id,
          name: option.name,
          display_type: option.display_type,
          options: [],
        });
      }

      attributesMap.get(option.id)?.options.push({
        id: option.option_id,
        value: option.option_value,
        additional_cost: option.additional_cost,
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
