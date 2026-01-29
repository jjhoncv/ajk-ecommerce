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

// Rutas de admin que siempre están permitidas (sin verificación de secciones)
const adminAlwaysAllowedRoutes = [
  '/admin/profile',      // Perfil del usuario
  '/admin/setup-password' // Configurar contraseña
]

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  console.log('🔍 Middleware checking path:', pathname)

  // ⭐ PÁGINA DE LOGIN DE ADMIN (ruta exacta /admin)
  if (pathname === '/admin') {
    console.log('🌐 Admin login page, access granted')
    return NextResponse.next()
  }

  // ⭐ VERIFICAR TODAS LAS RUTAS /admin/*
  if (pathname.startsWith('/admin/')) {
    console.log('🔐 Admin route detected, checking admin token...')

    // Obtener token de ADMIN con las cookies específicas
    const adminToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token.admin'
          : 'next-auth.session-token.admin'
    })

    // Sin token -> redirigir a login
    if (adminToken == null) {
      console.log('❌ No admin token, redirecting to admin login')
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }

    // Verificar que sea admin o superadmin
    if (adminToken.type !== 'admin' && adminToken.type !== 'superadmin') {
      console.log('❌ Invalid admin type:', adminToken.type)
      const url = new URL('/admin', request.url)
      return NextResponse.redirect(url)
    }

    // ⭐ RUTAS SIEMPRE PERMITIDAS (perfil, setup-password)
    const isAlwaysAllowed = adminAlwaysAllowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    )
    if (isAlwaysAllowed) {
      console.log('✅ Admin always-allowed route, access granted')
      return NextResponse.next()
    }

    // ⭐ SUPERADMIN tiene acceso a TODAS las rutas
    if (adminToken.type === 'superadmin') {
      console.log('✅ Superadmin has full access')
      return NextResponse.next()
    }

    // ⭐ VERIFICAR SECCIONES PERMITIDAS (solo para admin, no superadmin)
    const sections = adminToken.sections as Array<{ url: string }> | undefined

    if (!sections || sections.length === 0) {
      console.log('❌ No sections assigned to this role')
      const url = new URL('/admin/profile', request.url)
      return NextResponse.redirect(url)
    }

    // Extraer la parte de la ruta después de /admin (ej: /admin/products -> /products)
    const pathWithoutAdmin = pathname.replace(/^\/admin/, '') || '/'

    // Verificar si la ruta actual está en las secciones permitidas
    // Las URLs de secciones son relativas (ej: /products) y la ruta es /admin/products
    const hasAccess = sections.some((section) => {
      const sectionUrl = section.url || '/'
      // Coincide exactamente o es una subruta
      // ej: pathWithoutAdmin="/products/1" coincide con sectionUrl="/products"
      return pathWithoutAdmin === sectionUrl ||
             pathWithoutAdmin.startsWith(`${sectionUrl}/`) ||
             (sectionUrl === '/' && pathWithoutAdmin === '/')
    })

    if (!hasAccess) {
      console.log('❌ Access denied - route not in allowed sections:', pathname)
      console.log('   Path without admin:', pathWithoutAdmin)
      console.log('   Allowed sections:', sections.map(s => s.url).join(', '))
      // Redirigir a la primera sección permitida o al perfil
      const firstSection = sections[0]?.url
      const redirectUrl = firstSection ? `/admin${firstSection}` : '/admin/profile'
      const url = new URL(redirectUrl, request.url)
      return NextResponse.redirect(url)
    }

    console.log('✅ Admin access granted for section')
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
