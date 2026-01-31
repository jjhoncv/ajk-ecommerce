# AJK E-Commerce - Documentación del Proyecto

## Descripción General

AJK E-Commerce es una tienda en línea completa desarrollada con Next.js 15, diseñada para el mercado peruano. Incluye un frontend para clientes, panel de administración con sistema de roles, y un backend completo con gestión de productos, variantes, órdenes, pagos y envíos.

---

## Sistema Multi-Agente para Desarrollo de Módulos

> **IMPORTANTE**: Este proyecto usa un sistema multi-agente automatizado para crear módulos.
>
> ### Cómo crear un nuevo módulo
>
> El usuario (Product Owner) simplemente dice:
> ```
> "Quiero crear el módulo [nombre] que haga [descripción]"
> ```
>
> Claude asume el rol de **Project Owner** y:
> 1. Lee `.agents/README.md` para entender el sistema
> 2. Lee `.agents/skills/project-owner/assign-module.md` para el flujo
> 3. Hace preguntas para definir el modelo de negocio
> 4. Crea el spec y lanza el equipo de agentes automáticamente
>
> ### Documentación del sistema
>
> | Archivo | Propósito |
> |---------|-----------|
> | `.agents/README.md` | Visión general del sistema |
> | `.agents/autonomy.md` | Reglas de autonomía de agentes |
> | `.agents/architecture-diagram.md` | Diagrama de arquitectura |
> | `.agents/examples/tags-module-flow.md` | Ejemplo completo de flujo |
>
> ### Jerarquía de agentes
>
> ```
> Product Owner (Humano) → Project Owner → Module Lead → DBA/Backend/Frontend/QA
> ```

---

## Documentación Técnica de Referencia

> **Para patrones de código detallados:** `/docs/module-template.md`
>
> Contiene:
> - Estructura de carpetas del módulo
> - Patrones de código (Model-Repository-Mapper, Services, Hooks, Helpers)
> - Acceso a base de datos via Docker
> - Componentes compartidos del admin

---

## Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15.3.1 | Framework React con App Router |
| React | 19.0.0 | Librería UI |
| TypeScript | 5.8.3 | Tipado estático |
| Tailwind CSS | 3.4.16 | Framework de estilos |
| React Hook Form | 7.60.0 | Manejo de formularios |
| Zod | 3.25.58 | Validación de esquemas |
| Lucide React | 0.507.0 | Iconos |
| @hello-pangea/dnd | 17.0.0 | Drag and drop |

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| MySQL | 8.0 | Base de datos relacional |
| serverless-mysql | 2.1.0 | Cliente MySQL para serverless |
| NextAuth | 4.24.11 | Autenticación |
| bcryptjs | 3.0.2 | Hash de contraseñas |
| uuid | 11.1.0 | Generación de IDs únicos |

### Herramientas de Desarrollo
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| GraphQL Codegen | 5.0.7 | Generación de tipos |
| GraphQL Mesh | 0.100.5 | Introspección de BD |
| ESLint | 8.57.0 | Linting |
| Prettier | 3.5.3 | Formateo de código |

---

## Estructura del Proyecto

```
ajk-ecommerce/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── admin/         # Endpoints admin por módulo
│   │   ├── admin/             # Panel de administración
│   │   ├── account/           # Área de usuario
│   │   ├── cart/              # Carrito de compras
│   │   ├── checkout/          # Proceso de compra
│   │   ├── payment/           # Procesamiento de pago
│   │   ├── productos/         # Catálogo de productos
│   │   ├── search/            # Búsqueda avanzada
│   │   ├── promotion/         # Páginas de promoción
│   │   └── order/             # Confirmación de orden
│   │
│   ├── module/                # ARQUITECTURA PRINCIPAL - Módulos del sistema
│   │   ├── attributes/        # Atributos de productos
│   │   ├── banners/           # Banners y sliders
│   │   ├── brands/            # Marcas
│   │   ├── cart/              # Carrito
│   │   ├── categories/        # Categorías jerárquicas
│   │   ├── checkout/          # Proceso de checkout
│   │   ├── coupons/           # Cupones de descuento
│   │   ├── customers/         # Clientes
│   │   ├── districts/         # Distritos (envío)
│   │   ├── offers/            # Ofertas
│   │   ├── orders/            # Órdenes de compra
│   │   ├── payments/          # Métodos de pago
│   │   ├── products/          # Productos y variantes
│   │   ├── profile/           # Perfil de usuario
│   │   ├── promotions/        # Promociones
│   │   ├── ratings/           # Valoraciones
│   │   ├── roles/             # Roles de admin
│   │   ├── search/            # Búsqueda avanzada
│   │   ├── shared/            # Componentes compartidos admin
│   │   ├── shippings/         # Envíos y zonas
│   │   └── users/             # Usuarios admin
│   │
│   ├── lib/                   # Utilidades
│   │   ├── db.ts              # Conexión a MySQL
│   │   └── auth/              # Configuración de NextAuth
│   │
│   ├── types/                 # Tipos TypeScript
│   │   ├── database/          # Tipos de BD (generados)
│   │   └── domain/            # Tipos de dominio (generados)
│   │
│   ├── config/                # Configuración
│   ├── db/                    # Schema SQL de referencia
│   └── providers/             # Context Providers (Cart, Auth, Theme)
│
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes de productos
│   └── uploads/              # Archivos subidos
│
├── docs/                     # Documentación
│   └── module-template.md    # Template para crear módulos (LEER PRIMERO)
│
├── tests/                    # Tests E2E compartidos
│   └── e2e/utils.ts          # Utilidades compartidas
│
└── scripts/                  # Scripts de generación
```

### Estructura de cada Módulo

Cada módulo en `src/module/[modulo]/` sigue esta estructura:

```
[modulo]/
├── core/                     # Capa de datos (Model-Repository-Mapper)
│   ├── [Entidad].model.ts
│   ├── [Entidad].repository.ts
│   ├── [Entidad].mapper.ts
│   └── index.ts
├── components/
│   ├── admin/               # UI del panel admin
│   └── ecommerce/           # UI pública (si aplica)
├── service/[entidad]/       # Servicios con lógica de negocio
└── e2e/                     # Tests E2E del módulo
    ├── admin/
    └── ecommerce/
```

> **Ver `/docs/module-template.md` para patrones detallados de cada capa.**

---

## Base de Datos

### Diagrama de Relaciones

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  products   │────<│ product_variants │────<│variant_attribute_opt│
└─────────────┘     └──────────────────┘     └─────────────────────┘
      │                     │                          │
      │                     │                          │
      ▼                     ▼                          ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│ categories  │     │  variant_images  │     │  attribute_options  │
└─────────────┘     └──────────────────┘     └─────────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────────┐
                                              │     attributes      │
                                              └─────────────────────┘

┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  customers  │────<│ customers_address│     │       orders        │
└─────────────┘     └──────────────────┘     └─────────────────────┘
      │                                               │
      │                                               │
      ▼                                               ▼
┌─────────────┐                              ┌─────────────────────┐
│   orders    │────────────────────────────<│     order_items     │
└─────────────┘                              └─────────────────────┘
      │
      ▼
┌──────────────────────┐
│ payment_transactions │
└──────────────────────┘

┌─────────────┐     ┌──────────────────┐
│    users    │────>│      roles       │
└─────────────┘     └──────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │  roles_sections  │
                    └──────────────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │     sections     │
                    └──────────────────┘
```

### Tablas Principales (29 tablas)

#### Productos y Catálogo
| Tabla | Descripción |
|-------|-------------|
| `products` | Productos base (id, name, description, brand_id, base_price) |
| `product_variants` | Variantes con SKU, precio y stock |
| `variant_attribute_options` | Relación variante-atributo (M:N) |
| `variant_images` | Imágenes por variante (thumb, normal, zoom) |
| `attributes` | Definición de atributos (Color, Talla, etc.) |
| `attribute_options` | Valores de atributos (Negro, Blanco, XL) |
| `attribute_option_images` | Imágenes para opciones de color |
| `categories` | Categorías jerárquicas (parent_id) |
| `product_categories` | Relación producto-categoría (M:N) |
| `brands` | Marcas de productos |

#### Clientes
| Tabla | Descripción |
|-------|-------------|
| `customers` | Clientes (email, password, name, phone, dni) |
| `customers_addresses` | Direcciones con alias, departamento, provincia, distrito |

#### Órdenes y Pagos
| Tabla | Descripción |
|-------|-------------|
| `orders` | Órdenes (status, totales, dirección, método de pago) |
| `order_items` | Items de cada orden con precios históricos |
| `order_tracking` | Seguimiento de envíos |
| `payment_methods` | Métodos de pago (Tarjeta, Yape, Plin, etc.) |
| `payment_transactions` | Transacciones con estado y respuesta gateway |

#### Promociones y Cupones
| Tabla | Descripción |
|-------|-------------|
| `promotions` | Promociones con fechas y descuentos |
| `promotion_variants` | Variantes en promoción con precio especial |
| `coupons` | Cupones con reglas de uso |
| `coupon_usage` | Historial de uso de cupones |

#### Envío
| Tabla | Descripción |
|-------|-------------|
| `shipping_methods` | Métodos (Estándar, Express, Recojo) |
| `shipping_zones` | Zonas por distritos (JSON) |
| `shipping_zone_methods` | Costos por zona y método |

#### Sistema Admin
| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios administradores |
| `roles` | Roles (superadmin, admin) |
| `sections` | Secciones del panel admin |
| `roles_sections` | Permisos de secciones por rol |

#### Valoraciones
| Tabla | Descripción |
|-------|-------------|
| `variant_ratings` | Calificaciones de variantes |
| `rating_images` | Imágenes de reseñas |

### Vistas
- `order_summary` - Resumen de órdenes con datos de cliente
- `product_rating_summary` - Resumen de calificaciones por producto
- `variant_rating_summary` - Resumen de calificaciones por variante

---

## Arquitectura de Módulos

### Patrón Model-Repository-Mapper

Cada módulo en `src/module/[modulo]/core/` sigue este patrón:

```
module/[modulo]/core/
├── [Entidad].model.ts       # Lógica de negocio
├── [Entidad].repository.ts  # Acceso a datos (SQL)
├── [Entidad].mapper.ts      # Transformación snake_case → camelCase
├── [Entidad].interfaces.ts  # Interfaces extendidas (opcional)
└── index.ts                 # Exportaciones
```

**Flujo de datos:**
```
BD (snake_case) → Repository → Mapper → Model (camelCase) → Service → API/Component
```

> **Ver `/docs/module-template.md` para ejemplos detallados de cada capa.**

### Módulos del Sistema

| Módulo | Responsabilidad |
|--------|-----------------|
| products | Productos y variantes |
| categories | Categorías jerárquicas |
| attributes | Atributos y opciones de variantes |
| brands | Marcas de productos |
| banners | Banners y sliders |
| customers | Clientes y direcciones |
| orders | Órdenes de compra |
| payments | Métodos de pago y transacciones |
| shippings | Zonas y métodos de envío |
| coupons | Cupones de descuento |
| promotions | Promociones por variante |
| ratings | Valoraciones de productos |
| users | Usuarios administradores |
| roles | Roles y permisos |
| search | Búsqueda avanzada |
| shared | Componentes compartidos del admin |

---

## API Routes

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/[...nextauth]` | NextAuth cliente |
| POST | `/api/auth/admin/[...nextauth]` | NextAuth admin |
| POST | `/api/register` | Registro de clientes |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos/[id]/variantes` | Variantes de un producto |
| GET | `/api/productos/variante/[id]` | Detalle de variante |

### Carrito y Checkout

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/cart/sync` | Sincronizar carrito |
| POST | `/api/checkout` | Crear orden |
| GET | `/api/checkout/data` | Datos de checkout |
| GET | `/api/checkout/shipping-options` | Opciones de envío |
| POST | `/api/checkout/validate-coupon` | Validar cupón |
| POST | `/api/checkout/validate-stock` | Validar stock |

### Pagos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/payment/[transactionId]` | Estado de transacción |
| POST | `/api/payment/[transactionId]/complete` | Completar pago |
| POST | `/api/payment/[transactionId]/fail` | Fallar pago |

### Envío

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/shipping/calculate-user` | Calcular costo |

### Cliente

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/PUT | `/api/customer/profile` | Perfil del cliente |
| PUT | `/api/customer/profile/change-password` | Cambiar contraseña |
| GET/POST | `/api/customer/addresses` | Direcciones |
| PUT | `/api/customer/addresses/default` | Dirección por defecto |
| GET | `/api/customer/orders` | Historial de órdenes |

### Admin

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/POST | `/api/admin/products` | CRUD productos |
| POST | `/api/admin/products/[id]/variants` | Crear variante |
| POST | `/api/admin/products/[id]/variants/[vid]/images` | Subir imagen |
| GET/POST | `/api/admin/categories` | CRUD categorías |
| GET/POST | `/api/admin/attributes` | CRUD atributos |
| GET/POST | `/api/admin/banners` | CRUD banners |
| GET/PATCH | `/api/admin/profile` | Perfil admin |
| POST | `/api/admin/profile/password` | Cambiar contraseña |
| POST | `/api/admin/library` | Gestor de archivos |

### Calificaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/ratings/product/[id]` | Ratings de producto |
| GET | `/api/ratings/variant/[id]` | Ratings de variante |
| POST | `/api/ratings` | Crear calificación |

### Búsqueda

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/search/suggestions` | Sugerencias de búsqueda |

---

## Sistema de Autenticación

### Configuración Dual

El sistema usa NextAuth con dos configuraciones separadas:

```typescript
// Cliente: /src/lib/auth/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({...})],
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token.customer'
    }
  }
}

// Admin: /src/module/shared/lib/auth/authAdmin.ts
export const adminAuthOptions: NextAuthOptions = {
  providers: [CredentialsProvider({...})],
  callbacks: {
    jwt({ token, user }) {
      // Incluye rol y secciones
      token.sections = user.sections
    }
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token.admin'
    }
  }
}
```

### Tipos Extendidos

```typescript
// /src/types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      type: 'customer' | 'admin' | 'superadmin'
      roleName?: string
      roleId?: number
      sections?: AdminSection[]
    }
  }
}
```

### Flujo de Autenticación

```
1. Usuario envía credenciales
2. authorize() busca en BD y valida con bcrypt
3. Si es admin, carga rol y secciones
4. Se genera JWT con datos del usuario
5. Cookie HttpOnly con session token
6. Callbacks actualizan session con datos del JWT
```

---

## Providers y State Management

### Arquitectura de Providers

```tsx
// /src/providers/Providers.tsx
<ThemeProvider>
  {isAdminRoute ? (
    <SessionProvider basePath="/api/auth/admin">
      {children}
    </SessionProvider>
  ) : (
    <SessionProvider basePath="/api/auth">
      <AuthModalProvider>
        <CartProvider>
          {children}
          <MiniCart />
        </CartProvider>
      </AuthModalProvider>
    </SessionProvider>
  )}
</ThemeProvider>
```

### CartProvider

```typescript
// Hook useCart con funcionalidades:
- items: CartItem[]
- addItem(item, quantity)
- removeItem(id)
- updateQuantity(id, quantity)
- clearCart()
- isCartOpen, openCart, closeCart
- totalItems, totalPrice
```

### Persistencia del Carrito

- Almacenamiento en localStorage
- Sincronización con servidor (POST /api/cart/sync)
- Recuperación al recargar página

---

## Flujos de Negocio

### Flujo de Compra Completo

```
1. Usuario agrega producto al carrito
   └─ useCart.addItem() → localStorage

2. Usuario va a checkout (/checkout)
   └─ Carga direcciones, métodos de envío y pago

3. Selección de dirección
   └─ GET /api/checkout/shipping-options

4. Cálculo de envío por zona
   └─ shipping_zones.districts contiene JSON con distritos
   └─ shipping_zone_methods tiene costos por zona

5. Aplicación de cupón (opcional)
   └─ POST /api/checkout/validate-coupon
   └─ Valida fechas, límites de uso, monto mínimo

6. Cálculo de totales
   └─ subtotal + envío + IGV(18%) - descuento

7. Creación de orden
   └─ POST /api/checkout
   └─ Valida stock
   └─ Crea orden con status 'pending'
   └─ Crea order_items
   └─ Crea payment_transaction
   └─ Reduce stock de variantes

8. Proceso de pago
   └─ Redirección a /payment/[transactionId]
   └─ Según método: tarjeta, Yape, transferencia

9. Confirmación
   └─ POST /api/payment/[id]/complete
   └─ Actualiza status de orden y transacción
```

### Flujo de Búsqueda

```
1. Usuario escribe en SearchBar
   └─ GET /api/search/suggestions (debounced)

2. Envía búsqueda
   └─ Navega a /search?q=término

3. Carga filtros disponibles
   └─ Categorías, atributos, rango de precios

4. Aplica filtros
   └─ URL: /search?q=term&category=1&color=Negro

5. Resultados paginados con ordenamiento
```

---

## Configuración

### Variables de Entorno

```env
# MySQL
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=ajkecommerce
MYSQL_USER=root
MYSQL_PASSWORD=********

# NextAuth
NEXTAUTH_SECRET=********
NEXTAUTH_URL=http://localhost:3000
```

### Conexión a Base de Datos

```typescript
// /src/lib/db.ts
import mysql from 'serverless-mysql'

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
})

export async function executeQuery<T>({
  query,
  values
}: {
  query: string
  values?: any[]
}): Promise<T> {
  const results = await db.query<T>(query, values)
  await db.end()
  return results
}
```

---

## Generación de Tipos

El proyecto usa GraphQL Codegen para generar tipos desde la base de datos:

```bash
# Generar tipos de dominio
pnpm generate-domain-types

# Generar tipos de base de datos
pnpm generate-database-types

# Generar ambos
pnpm generate
```

### Archivos Generados
- `/src/types/database/database.d.ts` - Tipos exactos de BD
- `/src/types/domain/domain.d.ts` - Tipos de dominio (camelCase)

---

## Comandos de Desarrollo

```bash
# Desarrollo con Turbopack
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start

# Linting
pnpm lint

# Formateo
pnpm format

# Generar tipos
pnpm generate
```

---

## Componentes UI Principales

### Estructura de Componentes

```
components/
├── ui/
│   ├── ProductCard/       # Tarjeta de producto
│   ├── Navigation/        # Navegación
│   ├── MiniCart.tsx       # Carrito flotante
│   ├── SearchBar.tsx      # Barra de búsqueda
│   ├── Modal/             # Modales
│   └── ...
├── product/
│   ├── ProductImageSlider/
│   ├── ProductVariantSelector/
│   └── ...
├── cart/
│   ├── CartPageInteractive.tsx
│   └── ...
└── checkout/
    ├── CheckoutPage.tsx
    ├── ShippingForm.tsx
    └── PaymentForm.tsx
```

### Componentes del Admin

```
module/shared/components/
├── Page/
│   ├── Page.tsx           # Layout de página
│   ├── PageTitle.tsx      # Título con icono
│   └── PageButton.tsx     # Botón de acción
├── Form/
│   └── Input/             # Inputs reutilizables
├── CardContent/           # Cards de contenido
├── LayoutPageAdmin/       # Layout del admin
└── AdminDashboard.tsx     # Dashboard principal
```

---

## Seguridad

### Implementaciones
- Contraseñas hasheadas con bcryptjs (salt: 10)
- Cookies HttpOnly para sesiones
- Validación de sesión en endpoints protegidos
- Validación de email único en actualizaciones
- CSRF tokens en formularios
- Sanitización de inputs con Zod

### Consideraciones
- No exponer password en respuestas
- Validar stock antes de crear orden
- Verificar permisos de rol en admin
- Rate limiting pendiente de implementar

---

## Estado del Proyecto

### Completado
- [x] Sistema de autenticación dual (cliente/admin)
- [x] Gestión de productos con variantes
- [x] Sistema de imágenes multi-tamaño
- [x] Carrito de compras con persistencia
- [x] Checkout completo con validaciones
- [x] Sistema de órdenes y pagos
- [x] Cálculo de envío por zonas
- [x] Sistema de cupones
- [x] Promociones por variante
- [x] Calificaciones de productos
- [x] Búsqueda con filtros
- [x] Panel de administración con roles
- [x] Perfil de usuario completo

### Pendiente
- [ ] Tests unitarios e integración
- [ ] Notificaciones por email
- [ ] Dashboard analítico
- [ ] Integración con proveedores de pago reales
- [ ] Sistema de wishlist
- [ ] Seguimiento de pedidos en tiempo real
- [ ] PWA support
- [ ] Internacionalización

---

## Rutas de Archivos Importantes

| Propósito | Ruta |
|-----------|------|
| Layout principal | `/src/app/layout.tsx` |
| Página de inicio | `/src/app/page.tsx` |
| Configuración Next.js | `/next.config.ts` |
| Configuración Tailwind | `/tailwind.config.ts` |
| Variables de entorno | `/.env` |
| Conexión BD | `/src/lib/db.ts` |
| Auth cliente | `/src/lib/auth/auth.ts` |
| Auth admin | `/src/module/shared/lib/auth/authAdmin.ts` |
| Tipos NextAuth | `/src/types/next-auth.d.ts` |
| Tipos Checkout | `/src/types/checkout.ts` |
| Provider principal | `/src/providers/Providers.tsx` |
| Hook del carrito | `/src/hooks/useCart/useCart.ts` |
| Checkout API | `/src/app/api/checkout/route.ts` |
| Schema SQL | `/src/db/ajkecommerce.sql` |

---

## Convenciones de Código

### Nombrado
- Componentes: PascalCase (`ProductCard.tsx`)
- Hooks: camelCase con prefijo `use` (`useCart.ts`)
- Tipos: PascalCase (`CartItem`)
- Variables: camelCase (`totalPrice`)
- Constantes: SCREAMING_SNAKE_CASE (`CART_ROUTE_CONFIG`)

### Estructura de Archivos
- Un componente por archivo
- Separar lógica en hooks personalizados
- Tipos en archivo `.types.ts` o inline
- Schemas de validación en `.schema.ts`

### Imports
```typescript
// 1. React/Next
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Librerías externas
import { z } from 'zod'

// 3. Alias internos
import { Button } from '@/components/ui/Button'
import { useCart } from '@/hooks/useCart'

// 4. Tipos
import type { Product } from '@/types/domain'
```

---

## Notas para Desarrollo

### Agregar Nueva Entidad/Módulo

**IMPORTANTE**: Antes de crear un módulo, leer `/docs/module-template.md` que contiene todos los patrones y convenciones.

1. Ejecutar SQL directamente en Docker (NO crear archivos en sql-migrations/):
   ```bash
   docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "CREATE TABLE..."
   ```
2. Regenerar tipos con `pnpm generate`
3. Crear módulo en `/src/module/[entidad]/` siguiendo el template
4. Crear API routes en `/src/app/api/admin/[entidad]/`
5. Crear páginas admin en `/src/app/admin/[entidad]/`
6. Crear tests E2E en `/src/module/[entidad]/e2e/`

### Agregar Nuevo Atributo de Producto
1. Insertar en tabla `attributes`
2. Insertar opciones en `attribute_options`
3. Opcionalmente agregar imágenes en `attribute_option_images`
4. Asignar a variantes en `variant_attribute_options`

### Configurar Nueva Zona de Envío
1. Insertar zona en `shipping_zones` con JSON de distritos
2. Crear relaciones en `shipping_zone_methods` con costos
3. El sistema calculará automáticamente según dirección

---

*Documentación generada para el proyecto AJK E-Commerce*
*Última actualización: Enero 2026*
