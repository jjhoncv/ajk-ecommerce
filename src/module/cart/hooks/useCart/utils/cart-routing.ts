// utils/cart-routing.ts
export const ALLOWED_MINICART_ROUTES = [
  '/products', // Página de productos
  '/categories', // Página de categorías
  '/search', // Página de búsqueda
  '/product', // Página de producto individual
  '/category', // Página de categoría específica
  '/productos', // Base de productos
  '/productos/variante' // PDP con variantes
]

export const NO_MINICART_ROUTES = [
  '/cart', // Página del carrito - NO abrir minicart
  '/checkout', // Página de checkout
  '/login', // Página de login
  '/register', // Página de registro
  '/admin', // Panel admin
  '/profile', // Perfil de usuario
  '/orders' // Órdenes del usuario
]

/**
 * Verifica si se debe abrir el minicart en la ruta actual
 */
export const shouldOpenMinicart = (currentPath: string): boolean => {
  // Verificar rutas donde NO se debe abrir minicart
  const shouldNotOpen = NO_MINICART_ROUTES.some((route) => {
    return currentPath === route || currentPath.startsWith(route + '/')
  })

  if (shouldNotOpen) {
    return false
  }

  // Verificar rutas permitidas para minicart
  const isAllowed = ALLOWED_MINICART_ROUTES.some((allowedRoute) => {
    return (
      currentPath === allowedRoute || currentPath.startsWith(allowedRoute + '/')
    )
  })

  return isAllowed
}

/**
 * Configuración exportada para otros componentes
 */
export const CART_ROUTE_CONFIG = {
  ALLOWED_ROUTES: ALLOWED_MINICART_ROUTES,
  BLOCKED_ROUTES: NO_MINICART_ROUTES
}
