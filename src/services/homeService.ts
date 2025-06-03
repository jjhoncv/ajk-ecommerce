import { HomeData } from "@/types/home";
import ProductModel from "@/models/ProductModel";
import CategoryModel from "@/models/CategoryModel";
import { hydrateProductDTOs } from "@/utils/hydrators/product-card.hydrator";
import { ProductDTO, CategoryDTO } from "@/dto";

// Esta función obtiene datos reales desde la base de datos
export async function getHomeData(): Promise<HomeData> {
  try {
    // Obtener todos los productos disponibles
    const allProductsData = await ProductModel.getProducts();
    const popularProducts = hydrateProductDTOs(allProductsData.slice(0, 5));

    // Obtener productos para ofertas del día (mismos productos por ahora)
    const dealsProducts = hydrateProductDTOs(allProductsData.slice(0, 4));

    // Obtener categorías principales
    const categoriesData = await CategoryModel.getCategories();
    const mainCategories = categoriesData
      .filter((cat) => !cat.parentId)
      .slice(0, 8);

    // Usar las mismas categorías para el mega menú
    const megaMenuData = categoriesData;

    return {
      // Mega menú con categorías reales
      megaMenuCategories: buildMegaMenuCategories(
        megaMenuData,
        allProductsData
      ),

      // Slides del hero (mantenemos algunos datos estáticos por ahora)
      slides: [
        {
          title: "No te pierdas las ofertas increíbles",
          subtitle: "Hasta 50% OFF en toda la tienda",
          description: "Aprovecha nuestras ofertas especiales en tecnología",
          image:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop",
          cta: "Comprar Ahora",
          ctaLink: "/search",
        },
        {
          title: "Descuentos en Tecnología",
          subtitle: "Ahorra hasta S/1,200",
          description:
            "Los mejores smartphones y laptops con precios especiales",
          image:
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1920&h=600&fit=crop",
          cta: "Ver Ofertas",
          ctaLink: "/search?category=tecnologia",
        },
      ],

      // Banners laterales
      sideBanners: [
        {
          title: "Smartphones",
          subtitle: "Oferta Especial",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop",
          link: "/search?category=smartphones",
        },
        {
          title: "Laptops",
          subtitle: "Solo esta semana",
          image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop",
          link: "/search?category=laptops",
        },
      ],

      // Features (mantenemos estáticos)
      features: [
        {
          icon: "shipping",
          title: "Envío Gratis",
          description: "Pedidos sobre S/99",
        },
        {
          icon: "discount",
          title: "Mejores Ofertas",
          description: "Precios increíbles",
        },
        {
          icon: "delivery",
          title: "Delivery Rápido",
          description: "En 24 horas",
        },
        {
          icon: "secure",
          title: "Pago Seguro",
          description: "100% protegido",
        },
      ],

      // Categorías de productos reales
      productCategories: mainCategories.map((category, index) => ({
        name: category.name,
        icon: getCategoryIcon(category.name),
        bg: getCategoryColor(index),
      })),

      // Categorías destacadas
      featuredCategories: mainCategories.slice(0, 3).map((category, index) => ({
        title: `Ofertas en ${category.name}`,
        subtitle: "Descuentos especiales",
        color: getFeaturedCategoryColor(index),
        image: getCategoryImage(category.name),
      })),

      // Productos populares reales
      popularProducts: popularProducts.map((item) => ({
        id: item.product.id.toString(),
        name: item.product.name,
        price:
          item.product.variants[0]?.promotion?.promotionPrice ||
          item.product.variants[0]?.price ||
          item.product.basePrice,
        originalPrice:
          item.product.variants[0]?.price || item.product.basePrice,
        image: getProductImage(item.product),
        rating: item.product.variants[0]?.ratings?.averageRating || 4.5,
        reviews: item.product.variants[0]?.ratings?.totalRatings || 0,
      })),

      // Ofertas del día reales
      dealsOfTheDay: dealsProducts.map((item) => {
        const variant = item.product.variants[0];
        const originalPrice = variant?.price || item.product.basePrice;
        const currentPrice =
          variant?.promotion?.promotionPrice || originalPrice;
        const discount = Math.round(
          ((originalPrice - currentPrice) / originalPrice) * 100
        );

        return {
          id: item.product.id.toString(),
          name: item.product.name,
          originalPrice: originalPrice,
          price: currentPrice,
          discount: discount,
          image: getProductImage(item.product),
          timer: "02:15:30", // Tiempo estático por ahora
          stock: variant?.stock || 0,
        };
      }),

      // Footer (mantenemos estático)
      footerSections: [
        {
          title: "Compañía",
          links: [
            { name: "Sobre Nosotros", href: "/sobre-nosotros" },
            { name: "Información de Delivery", href: "/delivery" },
            { name: "Política de Privacidad", href: "/privacidad" },
            { name: "Términos y Condiciones", href: "/terminos" },
            { name: "Contáctanos", href: "/contacto" },
            { name: "Centro de Soporte", href: "/soporte" },
          ],
        },
        {
          title: "Mi Cuenta",
          links: [
            { name: "Iniciar Sesión", href: "/login" },
            { name: "Ver Carrito", href: "/carrito" },
            { name: "Mi Lista de Deseos", href: "/wishlist" },
            { name: "Rastrear mi Pedido", href: "/tracking" },
            { name: "Ayuda", href: "/ayuda" },
            { name: "Mis Pedidos", href: "/pedidos" },
          ],
        },
      ],

      // Social links (mantenemos estático)
      socialLinks: [
        {
          name: "Facebook",
          icon: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>',
          href: "https://facebook.com",
        },
        {
          name: "Twitter",
          icon: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>',
          href: "https://twitter.com",
        },
        {
          name: "Instagram",
          icon: '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>',
          href: "https://instagram.com",
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    // En caso de error, devolver datos básicos
    return getBasicHomeData();
  }
}

// Función auxiliar para construir el mega menú con categorías reales
function buildMegaMenuCategories(
  categories: CategoryDTO[],
  products: ProductDTO[]
): Record<
  string,
  {
    subcategories: any[];
    featuredProducts: any[];
    banner: {
      title: string;
      discount: string;
      image: string;
    };
  }
> {
  const megaMenu: Record<string, any> = {};

  categories.forEach((category) => {
    if (!category.parentId) {
      // Solo categorías principales
      megaMenu[category.name] = {
        subcategories: [
          // Por ahora subcategorías vacías, se pueden agregar después
        ],
        featuredProducts: products.slice(0, 2).map((product) => ({
          name: product.name,
          price: product.variants[0]?.price || product.basePrice,
          image: getProductImage(product),
        })),
        banner: {
          title: `Ofertas en ${category.name}`,
          discount: "Hasta 30% OFF",
          image: getCategoryImage(category.name),
        },
      };
    }
  });

  return megaMenu;
}

// Función auxiliar para obtener la imagen principal de un producto
function getProductImage(product: ProductDTO): string {
  const variant = product.variants[0];
  if (variant?.images?.length > 0) {
    return variant.images[0].imageUrlNormal || variant.images[0].imageUrlThumb;
  }
  return "/no-image.webp";
}

// Función auxiliar para obtener iconos de categorías
function getCategoryIcon(categoryName: string): string {
  const icons: { [key: string]: string } = {
    Electrónicos: "📱",
    Smartphones: "📱",
    Computadoras: "💻",
    Laptops: "💻",
    Audio: "🎧",
    Auriculares: "🎧",
    Wearables: "⌚",
    Smartwatches: "⌚",
    iPhone: "📱",
  };
  return icons[categoryName] || "🔌";
}

// Función auxiliar para obtener colores de categorías
function getCategoryColor(index: number): string {
  const colors = [
    "#FEE2E2",
    "#E0F2FE",
    "#F3E8FF",
    "#ECFDF5",
    "#FEF3C7",
    "#FCE7F3",
    "#E0E7FF",
    "#DBEAFE",
  ];
  return colors[index % colors.length];
}

// Función auxiliar para obtener colores de categorías destacadas
function getFeaturedCategoryColor(index: number): string {
  const colors = ["#5B4AE8", "#22C55E", "#EF4444"];
  return colors[index % colors.length];
}

// Función auxiliar para obtener imágenes de categorías
function getCategoryImage(categoryName: string): string {
  const images: { [key: string]: string } = {
    Smartphones:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop",
    Computadoras:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop",
    Laptops:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop",
    Audio:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=200&fit=crop",
    Auriculares:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=200&fit=crop",
    Wearables:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=200&fit=crop",
    iPhone:
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&h=200&fit=crop",
  };
  return (
    images[categoryName] ||
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
  );
}

// Función de fallback con datos básicos
function getBasicHomeData(): HomeData {
  return {
    megaMenuCategories: {},
    slides: [],
    sideBanners: [],
    features: [],
    productCategories: [],
    featuredCategories: [],
    popularProducts: [],
    dealsOfTheDay: [],
    footerSections: [],
    socialLinks: [],
  };
}
