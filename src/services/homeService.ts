import { HomeData } from "@/types/home";

// Esta función simula la obtención de datos desde una API o base de datos
export async function getHomeData(): Promise<HomeData> {
  // En un entorno real, aquí harías una llamada a una API o base de datos
  // Por ahora, devolvemos datos de ejemplo
  return {
    megaMenuCategories: {
      Zapatillas: {
        subcategories: [
          { name: "Running", link: "/zapatillas/running" },
          { name: "Basketball", link: "/zapatillas/basketball" },
          { name: "Casual", link: "/zapatillas/casual" },
          { name: "Skate", link: "/zapatillas/skate" },
        ],
        featuredProducts: [
          {
            name: "Nike Air Max",
            price: 459,
            image:
              "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=80&h=80&fit=crop",
          },
          {
            name: "Adidas Ultra",
            price: 349,
            image:
              "https://images.unsplash.com/photo-1520256862855-398d12d5bbe2?w=80&h=80&fit=crop",
          },
        ],
        banner: {
          title: "Nueva Colección Running",
          discount: "30% OFF",
          image:
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=120&fit=crop",
        },
      },
      Smartphones: {
        subcategories: [
          { name: "Apple", link: "/smartphones/apple" },
          { name: "Samsung", link: "/smartphones/samsung" },
          { name: "Xiaomi", link: "/smartphones/xiaomi" },
          { name: "Google", link: "/smartphones/google" },
        ],
        featuredProducts: [
          {
            name: "iPhone 15 Pro",
            price: 4999,
            image:
              "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=80&h=80&fit=crop",
          },
          {
            name: "Galaxy S24",
            price: 3799,
            image:
              "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=80&h=80&fit=crop",
          },
        ],
        banner: {
          title: "Smartphones Premium",
          discount: "Hasta 20% OFF",
          image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=120&fit=crop",
        },
      },
      Computadoras: {
        subcategories: [
          { name: "Laptops", link: "/computadoras/laptops" },
          { name: "Desktop", link: "/computadoras/desktop" },
          { name: "Gaming", link: "/computadoras/gaming" },
          { name: "All in One", link: "/computadoras/all-in-one" },
        ],
        featuredProducts: [
          {
            name: "MacBook Pro",
            price: 7999,
            image:
              "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80&h=80&fit=crop",
          },
          {
            name: "Dell XPS",
            price: 4599,
            image:
              "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=80&h=80&fit=crop",
          },
        ],
        banner: {
          title: "Gaming PCs",
          discount: "15% OFF",
          image:
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&h=120&fit=crop",
        },
      },
      Accesorios: {
        subcategories: [
          { name: "Audífonos", link: "/accesorios/audifonos" },
          { name: "Cargadores", link: "/accesorios/cargadores" },
          { name: "Fundas", link: "/accesorios/fundas" },
          { name: "Smartwatch", link: "/accesorios/smartwatch" },
        ],
        featuredProducts: [
          {
            name: "AirPods Pro",
            price: 899,
            image:
              "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=80&h=80&fit=crop",
          },
          {
            name: "Apple Watch",
            price: 1599,
            image:
              "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=80&h=80&fit=crop",
          },
        ],
        banner: {
          title: "Accesorios Tech",
          discount: "25% OFF",
          image:
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=120&fit=crop",
        },
      },
    },
    slides: [
      {
        title: "No te pierdas las ofertas increíbles",
        subtitle: "Hasta 50% OFF en toda la tienda",
        description:
          "Aprovecha nuestras ofertas especiales en zapatillas y tecnología",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&h=600&fit=crop",
        cta: "Comprar Ahora",
        ctaLink: "/ofertas",
      },
      {
        title: "Descuentos en Tecnología",
        subtitle: "Ahorra hasta S/1,200",
        description: "Los mejores smartphones y laptops con precios especiales",
        image:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1920&h=600&fit=crop",
        cta: "Ver Ofertas",
        ctaLink: "/tecnologia",
      },
    ],
    sideBanners: [
      {
        title: "Zapatillas Nike",
        subtitle: "Oferta Especial",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop",
        link: "/zapatillas/nike",
      },
      {
        title: "MacBook Pro",
        subtitle: "Solo esta semana",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=200&fit=crop",
        link: "/computadoras/macbook",
      },
    ],
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
    productCategories: [
      { name: "Zapatillas", icon: "👟", bg: "#FEE2E2" },
      { name: "Smartphones", icon: "📱", bg: "#E0F2FE" },
      { name: "Laptops", icon: "💻", bg: "#F3E8FF" },
      { name: "Gaming", icon: "🎮", bg: "#ECFDF5" },
      { name: "Audio", icon: "🎧", bg: "#FEF3C7" },
      { name: "Smartwatch", icon: "⌚", bg: "#FCE7F3" },
      { name: "Tablets", icon: "📲", bg: "#E0E7FF" },
      { name: "Accesorios", icon: "🔌", bg: "#DBEAFE" },
    ],
    featuredCategories: [
      {
        title: "Ofertas del día en Zapatillas",
        subtitle: "Descuentos hasta 40%",
        color: "#5B4AE8",
        image:
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=200&fit=crop",
      },
      {
        title: "Ofertas semanales en Tech",
        subtitle: "Ahorra en smartphones",
        color: "#22C55E",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=200&fit=crop",
      },
      {
        title: "Los mejores descuentos",
        subtitle: "En laptops gaming",
        color: "#EF4444",
        image:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=200&fit=crop",
      },
    ],
    popularProducts: [
      {
        id: "prod1",
        name: "Adidas Ultraboost",
        price: 449,
        originalPrice: 549,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
        rating: 4.8,
        reviews: 256,
      },
      {
        id: "prod2",
        name: "Samsung Galaxy S24",
        price: 3799,
        originalPrice: 4299,
        image:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&h=200&fit=crop",
        rating: 4.7,
        reviews: 189,
      },
      {
        id: "prod3",
        name: "Dell XPS 15",
        price: 6499,
        originalPrice: 7299,
        image:
          "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&h=200&fit=crop",
        rating: 4.9,
        reviews: 124,
      },
      {
        id: "prod4",
        name: "Sony WH-1000XM5",
        price: 1399,
        originalPrice: 1699,
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&h=200&fit=crop",
        rating: 4.8,
        reviews: 342,
      },
      {
        id: "prod5",
        name: "Apple Watch Series 9",
        price: 1799,
        originalPrice: 1999,
        image:
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop",
        rating: 4.6,
        reviews: 278,
      },
    ],
    dealsOfTheDay: [
      {
        id: "deal1",
        name: "Nike Air Max 270",
        originalPrice: 549,
        price: 389,
        discount: 29,
        image:
          "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=200&h=200&fit=crop",
        timer: "02:15:30",
        stock: 15,
      },
      {
        id: "deal2",
        name: "iPhone 14 Pro",
        originalPrice: 4999,
        price: 4299,
        discount: 14,
        image:
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=200&h=200&fit=crop",
        timer: "05:45:20",
        stock: 8,
      },
      {
        id: "deal3",
        name: "MacBook Air M2",
        originalPrice: 5499,
        price: 4899,
        discount: 11,
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
        timer: "08:20:10",
        stock: 5,
      },
      {
        id: "deal4",
        name: "AirPods Pro 2",
        originalPrice: 999,
        price: 849,
        discount: 15,
        image:
          "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200&h=200&fit=crop",
        timer: "03:30:45",
        stock: 20,
      },
    ],
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
}
