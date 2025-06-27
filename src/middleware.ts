// middleware.ts
import { getToken } from 'next-auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

// Rutas que requieren autenticación de CUSTOMER
const customerProtectedRoutes = [
  '/account',
  '/orders',
  '/favorites',
  '/addresses'
]

// Rutas que requieren autenticación de ADMIN (EXCLUYENDO la página de login)
const adminProtectedRoutes = [
  '/admin/dashboard',
  '/admin/users',
  '/admin/products',
  '/admin/orders',
  '/admin/settings'
]

// ⭐ RUTAS PÚBLICAS DE ADMIN (no proteger)
const adminPublicRoutes = ['/admin'] // La página de login es pública

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware checking path:', pathname)

  // ⭐ PERMITIR rutas públicas de admin SIN verificación
  if (adminPublicRoutes.includes(pathname)) {
    console.log('🌐 Admin public route (login page), access granted')
    return NextResponse.next()
  }

  // ⭐ VERIFICAR RUTAS PROTEGIDAS DE ADMIN
  const isAdminRoute = adminProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isAdminRoute) {
    console.log('🔐 Admin protected route detected, checking admin token...')

    // Obtener token de ADMIN con las cookies específicas
    const adminToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token.admin'
          : 'next-auth.session-token.admin'
    })

    console.log('👑 Admin token:', adminToken)

    if (adminToken == null) {
      console.log('❌ No admin token, redirecting to admin login')
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }

    // Verificar que sea realmente admin/superadmin
    if (adminToken.type !== 'admin' && adminToken.type !== 'superadmin') {
      console.log('❌ Invalid admin type:', adminToken.type)
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }

    console.log('✅ Admin access granted')
    return NextResponse.next()
  }

  // ⭐ VERIFICAR RUTAS DE CUSTOMER
  const isCustomerProtectedRoute = customerProtectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isCustomerProtectedRoute) {
    console.log(
      '🛒 Customer protected route detected, checking customer token...'
    )

    // Obtener token de CUSTOMER con las cookies específicas
    const customerToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token.customer'
          : 'next-auth.session-token.customer'
    })

    console.log('👤 Customer token:', customerToken)

    if (customerToken == null) {
      console.log('❌ No customer token, redirecting to home')
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }

    // Verificar que sea realmente customer
    if (customerToken.type !== 'customer') {
      console.log('❌ Invalid customer type:', customerToken.type)
      const url = new URL('/', request.url)
      return NextResponse.redirect(url)
    }

    console.log('✅ Customer access granted')
    return NextResponse.next()
  }

  // ⭐ RUTA PÚBLICA - permitir acceso
  console.log('🌐 Public route, access granted')
  return NextResponse.next()
}

// Configurar el middleware para que se ejecute en las rutas especificadas
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - API routes (/api/*)
     * - Archivos estáticos (_next/static/*)
     * - Imágenes (_next/image/*)
     * - Favicon
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
