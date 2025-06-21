import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que requieren autenticación
const protectedRoutes = ['/account', '/orders', '/favorites', '/addresses']

// Nota: Podríamos definir rutas públicas explícitamente, pero por ahora
// simplemente permitimos el acceso a cualquier ruta que no esté en protectedRoutes

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Verificar si la ruta actual es una ruta protegida
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Si no es una ruta protegida, permitir el acceso
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Obtener el token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // Si el usuario no está autenticado y la ruta es protegida, redirigir al inicio
  if (token === null && isProtectedRoute) {
    const url = new URL('/', request.url)
    return NextResponse.redirect(url)
  }

  // Si el usuario está autenticado, permitir el acceso a la ruta protegida
  return NextResponse.next()
}

// Configurar el middleware para que se ejecute solo en las rutas especificadas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas de páginas excepto:
     * - API routes
     * - Archivos estáticos (e.g. imágenes, fuentes, etc.)
     * - Favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
