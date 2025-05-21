import {
  ProductDTO,
  ProductSearchFiltersDTO,
  ProductSearchResultDTO,
  BrandDTO,
  CategoryDTO,
  AttributeDTO,
} from "@/interfaces/dtos";

// Datos mock para simular la obtención de datos de una API
const mockProducts: ProductDTO[] = [
  {
    id: 1,
    name: "Laptop Ultrabook Pro",
    description: "Laptop ultradelgada con procesador de última generación",
    brandId: 1,
    brandName: "TechPro",
    basePrice: 3499.99,
    categories: [
      { id: 2, name: "Computadoras" },
      { id: 3, name: "Laptops" },
    ],
    variants: [
      {
        id: 1,
        productId: 1,
        sku: "LAPTOP-PRO-15-8GB",
        price: 3499.99,
        stock: 10,
        attributes: [
          { name: "Color", value: "Negro" },
          { name: "Tamaño", value: "15 pulgadas" },
          { name: "Almacenamiento", value: "8GB RAM" },
        ],
        images: [
          {
            id: 1,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB",
            isPrimary: true,
          },
          {
            id: 2,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB-2",
            isPrimary: false,
          },
        ],
      },
      {
        id: 2,
        productId: 1,
        sku: "LAPTOP-PRO-15-16GB",
        price: 3999.99,
        stock: 5,
        attributes: [
          { name: "Color", value: "Negro" },
          { name: "Tamaño", value: "15 pulgadas" },
          { name: "Almacenamiento", value: "16GB RAM" },
        ],
        images: [
          {
            id: 3,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-16GB",
            isPrimary: true,
          },
        ],
      },
    ],
    mainImage:
      "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop-Negro-8GB",
  },
  {
    id: 2,
    name: "Smartphone Galaxy X",
    description: "Smartphone con pantalla AMOLED y cámara de alta resolución",
    brandId: 2,
    brandName: "GalaxyTech",
    basePrice: 1299.99,
    categories: [
      { id: 1, name: "Electrónicos" },
      { id: 4, name: "Smartphones" },
    ],
    variants: [
      {
        id: 3,
        productId: 2,
        sku: "PHONE-X-BLACK-128GB",
        price: 1299.99,
        stock: 20,
        attributes: [
          { name: "Color", value: "Negro" },
          { name: "Almacenamiento", value: "128GB" },
        ],
        images: [
          {
            id: 4,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB",
            isPrimary: true,
          },
          {
            id: 5,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB-2",
            isPrimary: false,
          },
        ],
      },
      {
        id: 4,
        productId: 2,
        sku: "PHONE-X-WHITE-128GB",
        price: 1299.99,
        stock: 15,
        attributes: [
          { name: "Color", value: "Blanco" },
          { name: "Almacenamiento", value: "128GB" },
        ],
        images: [
          {
            id: 6,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-128GB",
            isPrimary: true,
          },
        ],
      },
      {
        id: 5,
        productId: 2,
        sku: "PHONE-X-BLACK-256GB",
        price: 1499.99,
        stock: 8,
        attributes: [
          { name: "Color", value: "Negro" },
          { name: "Almacenamiento", value: "256GB" },
        ],
        images: [
          {
            id: 7,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-256GB",
            isPrimary: true,
          },
        ],
      },
      {
        id: 6,
        productId: 2,
        sku: "PHONE-X-WHITE-256GB",
        price: 1499.99,
        stock: 12,
        attributes: [
          { name: "Color", value: "Blanco" },
          { name: "Almacenamiento", value: "256GB" },
        ],
        images: [
          {
            id: 8,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Blanco-256GB",
            isPrimary: true,
          },
        ],
      },
    ],
    mainImage:
      "https://placehold.co/600x400/e2e8f0/1e293b?text=Phone-Negro-128GB",
  },
  {
    id: 3,
    name: "Auriculares Inalámbricos Pro",
    description: "Auriculares con cancelación de ruido y alta fidelidad",
    brandId: 3,
    brandName: "SoundMaster",
    basePrice: 249.99,
    categories: [
      { id: 1, name: "Electrónicos" },
      { id: 5, name: "Audio" },
      { id: 6, name: "Auriculares" },
    ],
    variants: [
      {
        id: 7,
        productId: 3,
        sku: "HEADPHONES-PRO-BLACK",
        price: 249.99,
        stock: 30,
        attributes: [{ name: "Color", value: "Negro" }],
        images: [
          {
            id: 9,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Negro",
            isPrimary: true,
          },
        ],
      },
      {
        id: 8,
        productId: 3,
        sku: "HEADPHONES-PRO-WHITE",
        price: 249.99,
        stock: 25,
        attributes: [{ name: "Color", value: "Blanco" }],
        images: [
          {
            id: 10,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Blanco",
            isPrimary: true,
          },
        ],
      },
    ],
    mainImage:
      "https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares-Negro",
  },
  {
    id: 4,
    name: "Smartwatch Series 5",
    description: "Reloj inteligente con monitor de salud y GPS",
    brandId: 4,
    brandName: "SmartLife",
    basePrice: 399.99,
    categories: [
      { id: 1, name: "Electrónicos" },
      { id: 7, name: "Wearables" },
      { id: 8, name: "Smartwatches" },
    ],
    variants: [
      {
        id: 9,
        productId: 4,
        sku: "SMARTWATCH-5-BLACK",
        price: 399.99,
        stock: 18,
        attributes: [{ name: "Color", value: "Negro" }],
        images: [
          {
            id: 11,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Negro",
            isPrimary: true,
          },
        ],
      },
      {
        id: 10,
        productId: 4,
        sku: "SMARTWATCH-5-SILVER",
        price: 399.99,
        stock: 22,
        attributes: [{ name: "Color", value: "Plata" }],
        images: [
          {
            id: 12,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Plata",
            isPrimary: true,
          },
        ],
      },
    ],
    mainImage:
      "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch-Negro",
  },
];

const mockBrands: BrandDTO[] = [
  { id: 1, name: "TechPro" },
  { id: 2, name: "GalaxyTech" },
  { id: 3, name: "SoundMaster" },
  { id: 4, name: "SmartLife" },
];

const mockCategories: CategoryDTO[] = [
  {
    id: 1,
    name: "Electrónicos",
    description: "Productos electrónicos de alta calidad",
    parentId: null,
    imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Electrónicos",
    children: [
      {
        id: 2,
        name: "Computadoras",
        description: "Laptops y computadoras de escritorio",
        parentId: 1,
        imageUrl:
          "https://placehold.co/600x400/e2e8f0/1e293b?text=Computadoras",
        children: [
          {
            id: 3,
            name: "Laptops",
            description: "Computadoras portátiles",
            parentId: 2,
            imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptops",
          },
        ],
      },
      {
        id: 4,
        name: "Smartphones",
        description: "Teléfonos inteligentes",
        parentId: 1,
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartphones",
      },
      {
        id: 5,
        name: "Audio",
        description: "Dispositivos de audio",
        parentId: 1,
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Audio",
        children: [
          {
            id: 6,
            name: "Auriculares",
            description: "Auriculares y audífonos",
            parentId: 5,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares",
          },
        ],
      },
      {
        id: 7,
        name: "Wearables",
        description: "Dispositivos vestibles",
        parentId: 1,
        imageUrl: "https://placehold.co/600x400/e2e8f0/1e293b?text=Wearables",
        children: [
          {
            id: 8,
            name: "Smartwatches",
            description: "Relojes inteligentes",
            parentId: 7,
            imageUrl:
              "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatches",
          },
        ],
      },
    ],
  },
];

const mockAttributes: AttributeDTO[] = [
  {
    id: 1,
    name: "Color",
    options: [
      { id: 1, attributeId: 1, value: "Negro" },
      { id: 2, attributeId: 1, value: "Blanco" },
      { id: 3, attributeId: 1, value: "Plata" },
      { id: 4, attributeId: 1, value: "Azul" },
    ],
  },
  {
    id: 2,
    name: "Tamaño",
    options: [
      { id: 5, attributeId: 2, value: "13 pulgadas" },
      { id: 6, attributeId: 2, value: "15 pulgadas" },
      { id: 7, attributeId: 2, value: "17 pulgadas" },
    ],
  },
  {
    id: 3,
    name: "Almacenamiento",
    options: [
      { id: 8, attributeId: 3, value: "128GB" },
      { id: 9, attributeId: 3, value: "256GB" },
      { id: 10, attributeId: 3, value: "512GB" },
      { id: 11, attributeId: 3, value: "1TB" },
      { id: 12, attributeId: 3, value: "8GB RAM" },
      { id: 13, attributeId: 3, value: "16GB RAM" },
      { id: 14, attributeId: 3, value: "32GB RAM" },
    ],
  },
];

// Servicio para obtener productos y realizar búsquedas
export class ProductService {
  // Obtener todos los productos
  public async getProducts(): Promise<ProductDTO[]> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 300);
    });
  }

  // Obtener un producto por ID
  public async getProductById(id: number): Promise<ProductDTO | null> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = mockProducts.find((p) => p.id === id) || null;
        resolve(product);
      }, 300);
    });
  }

  // Obtener todas las marcas
  public async getBrands(): Promise<BrandDTO[]> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBrands);
      }, 300);
    });
  }

  // Obtener todas las categorías
  public async getCategories(): Promise<CategoryDTO[]> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300);
    });
  }

  // Obtener todos los atributos
  public async getAttributes(): Promise<AttributeDTO[]> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAttributes);
      }, 300);
    });
  }

  // Buscar productos con filtros
  public async searchProducts(
    filters: ProductSearchFiltersDTO
  ): Promise<ProductSearchResultDTO> {
    // Simular una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aplicar filtros
        let filteredProducts = [...mockProducts];

        // Filtrar por query (búsqueda de texto)
        if (filters.query) {
          const query = filters.query.toLowerCase();
          filteredProducts = filteredProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              (p.description && p.description.toLowerCase().includes(query))
          );
        }

        // Filtrar por categoría
        if (filters.categoryId) {
          filteredProducts = filteredProducts.filter((p) =>
            p.categories.some((c) => c.id === filters.categoryId)
          );
        }

        // Filtrar por marca
        if (filters.brandId) {
          filteredProducts = filteredProducts.filter(
            (p) => p.brandId === filters.brandId
          );
        }

        // Filtrar por rango de precio
        if (filters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter((p) => {
            // Encontrar la variante con el precio más bajo
            const minVariantPrice = Math.min(...p.variants.map((v) => v.price));
            return minVariantPrice >= filters.minPrice!;
          });
        }

        if (filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter((p) => {
            // Encontrar la variante con el precio más bajo
            const minVariantPrice = Math.min(...p.variants.map((v) => v.price));
            return minVariantPrice <= filters.maxPrice!;
          });
        }

        // Filtrar por atributos
        if (filters.attributes && Object.keys(filters.attributes).length > 0) {
          filteredProducts = filteredProducts.filter((product) => {
            // Para cada atributo en los filtros
            return Object.entries(filters.attributes!).every(
              ([attributeIdStr, optionIds]) => {
                const attributeId = parseInt(attributeIdStr);

                // Verificar si alguna variante del producto tiene alguna de las opciones seleccionadas
                return product.variants.some((variant) => {
                  // Buscar atributos de la variante que coincidan con el attributeId
                  const matchingAttributes = variant.attributes.filter(
                    (attr) => {
                      // Encontrar el atributo por nombre
                      const attribute = mockAttributes.find(
                        (a) => a.name === attr.name
                      );
                      return attribute && attribute.id === attributeId;
                    }
                  );

                  // Si no hay atributos coincidentes, no cumple el filtro
                  if (matchingAttributes.length === 0) return false;

                  // Verificar si alguno de los valores de atributo coincide con las opciones seleccionadas
                  return matchingAttributes.some((attr) => {
                    // Encontrar la opción por valor
                    const attribute = mockAttributes.find(
                      (a) => a.name === attr.name
                    );
                    if (!attribute) return false;

                    const option = attribute.options.find(
                      (o) => o.value === attr.value
                    );
                    if (!option) return false;

                    return optionIds.includes(option.id);
                  });
                });
              }
            );
          });
        }

        // Ordenar productos
        if (filters.sort) {
          switch (filters.sort) {
            case "price_asc":
              filteredProducts.sort((a, b) => {
                const aMinPrice = Math.min(...a.variants.map((v) => v.price));
                const bMinPrice = Math.min(...b.variants.map((v) => v.price));
                return aMinPrice - bMinPrice;
              });
              break;
            case "price_desc":
              filteredProducts.sort((a, b) => {
                const aMinPrice = Math.min(...a.variants.map((v) => v.price));
                const bMinPrice = Math.min(...b.variants.map((v) => v.price));
                return bMinPrice - aMinPrice;
              });
              break;
            case "name_asc":
              filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
              break;
            case "name_desc":
              filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
              break;
            case "newest":
              // Asumiendo que el ID más alto es el más reciente
              filteredProducts.sort((a, b) => b.id - a.id);
              break;
          }
        }

        // Calcular paginación
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const totalCount = filteredProducts.length;
        const totalPages = Math.ceil(totalCount / limit);

        // Aplicar paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        // Calcular filtros disponibles
        const availableFilters = {
          categories: this.calculateCategoryFilters(filteredProducts),
          brands: this.calculateBrandFilters(filteredProducts),
          priceRange: this.calculatePriceRange(filteredProducts),
          attributes: this.calculateAttributeFilters(filteredProducts),
        };

        resolve({
          products: paginatedProducts,
          totalCount,
          page,
          totalPages,
          filters: availableFilters,
        });
      }, 500);
    });
  }

  // Métodos auxiliares para calcular filtros disponibles
  private calculateCategoryFilters(products: ProductDTO[]) {
    const categoryCounts: { [id: number]: number } = {};

    // Contar productos por categoría
    products.forEach((product) => {
      product.categories.forEach((category) => {
        categoryCounts[category.id] = (categoryCounts[category.id] || 0) + 1;
      });
    });

    // Convertir a formato de respuesta
    return Object.entries(categoryCounts).map(([idStr, count]) => {
      const id = parseInt(idStr);
      const category = this.findCategoryById(mockCategories, id);
      return {
        id,
        name: category?.name || `Categoría ${id}`,
        count,
      };
    });
  }

  private findCategoryById(
    categories: CategoryDTO[],
    id: number
  ): CategoryDTO | undefined {
    for (const category of categories) {
      if (category.id === id) {
        return category;
      }
      if (category.children) {
        const found = this.findCategoryById(category.children, id);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  }

  private calculateBrandFilters(products: ProductDTO[]) {
    const brandCounts: { [id: number]: number } = {};

    // Contar productos por marca
    products.forEach((product) => {
      brandCounts[product.brandId] = (brandCounts[product.brandId] || 0) + 1;
    });

    // Convertir a formato de respuesta
    return Object.entries(brandCounts).map(([idStr, count]) => {
      const id = parseInt(idStr);
      const brand = mockBrands.find((b) => b.id === id);
      return {
        id,
        name: brand?.name || `Marca ${id}`,
        count,
      };
    });
  }

  private calculatePriceRange(products: ProductDTO[]) {
    if (products.length === 0) {
      return { min: 0, max: 0 };
    }

    // Encontrar precio mínimo y máximo entre todas las variantes
    let min = Infinity;
    let max = -Infinity;

    products.forEach((product) => {
      product.variants.forEach((variant) => {
        min = Math.min(min, variant.price);
        max = Math.max(max, variant.price);
      });
    });

    return { min, max };
  }

  private calculateAttributeFilters(products: ProductDTO[]) {
    // Mapeo para contar opciones de atributos
    const attributeOptionCounts: {
      [attributeId: number]: { [optionId: number]: number };
    } = {};

    // Inicializar contadores para todos los atributos y opciones
    mockAttributes.forEach((attribute) => {
      attributeOptionCounts[attribute.id] = {};
      attribute.options.forEach((option) => {
        attributeOptionCounts[attribute.id][option.id] = 0;
      });
    });

    // Contar productos por opción de atributo
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        variant.attributes.forEach((variantAttr) => {
          // Encontrar el atributo por nombre
          const attribute = mockAttributes.find(
            (a) => a.name === variantAttr.name
          );
          if (!attribute) return;

          // Encontrar la opción por valor
          const option = attribute.options.find(
            (o) => o.value === variantAttr.value
          );
          if (!option) return;

          // Incrementar contador
          attributeOptionCounts[attribute.id][option.id]++;
        });
      });
    });

    // Convertir a formato de respuesta
    return mockAttributes
      .map((attribute) => {
        return {
          id: attribute.id,
          name: attribute.name,
          options: attribute.options
            .map((option) => {
              return {
                id: option.id,
                value: option.value,
                count: attributeOptionCounts[attribute.id][option.id],
              };
            })
            .filter((option) => option.count > 0), // Solo incluir opciones con productos
        };
      })
      .filter((attribute) => attribute.options.length > 0); // Solo incluir atributos con opciones
  }
}

export default new ProductService();
