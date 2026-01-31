# Skill: Crear Frontend Ecommerce del Módulo

## Rol
Frontend

## Trigger
Module Lead asigna tarea de crear frontend ecommerce (después de backend ecommerce)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md` (sección Ecommerce)
- Services ecommerce ya creados (`src/module/[modulo]/services/`)
- Branch de trabajo

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches
- `.agents/shared-catalog.md` - Componentes shared disponibles

---

## ⛔ AUTOSUFICIENCIA - NO REVISAR OTROS MÓDULOS

**Este skill contiene TODOS los patrones que necesitas.**

- ❌ NO leer código de otros módulos (banners, brands, categories, etc.)
- ❌ NO buscar "ejemplos" en el codebase

**Solo necesitas:**
1. Leer el spec del módulo (sección Ecommerce)
2. Seguir los templates de ESTE skill

---

## 🔄 OBLIGATORIO: REUTILIZAR COMPONENTES SHARED/UI

**ANTES de crear cualquier componente, verificar si ya existe en shared:**

```bash
# Componentes UI disponibles
ls src/module/shared/components/ui/
ls src/components/ui/

# Secciones de homepage disponibles
ls src/module/shared/components/sections/
```

### Componentes disponibles que DEBES reutilizar:

| Componente | Ubicación | Uso |
|------------|-----------|-----|
| `Card` | `src/module/shared/components/ui/Card.tsx` | Tarjetas de contenido |
| `Badge` | `src/module/shared/components/ui/Badge.tsx` | Etiquetas/badges |
| `Button` | `src/module/shared/components/ui/Button.tsx` | Botones |
| `Input` | `src/module/shared/components/ui/Input.tsx` | Campos de entrada |
| `Label` | `src/module/shared/components/ui/Label.tsx` | Etiquetas |
| `ImageGalleryThumbs` | `src/module/shared/components/ui/ImageGalleryThumbs.tsx` | Galerías |
| `ImageGalleryDots` | `src/module/shared/components/ui/ImageGalleryDots.tsx` | Indicadores de slider |
| `CollapsibleSection` | `src/module/shared/components/ui/CollapsibleSection.tsx` | Secciones colapsables |
| `Breadcrumb` | `src/module/shared/components/ui/Breadcrumb.tsx` | Navegación |

### Secciones de homepage disponibles:

| Sección | Ubicación | Referencia para |
|---------|-----------|-----------------|
| `DailyDeals` | `src/module/shared/components/sections/DailyDeals.tsx` | Sliders/carruseles |
| `PopularProducts` | `src/module/shared/components/sections/PopularProducts.tsx` | Grids de productos |
| `Features` | `src/module/shared/components/sections/Features.tsx` | Secciones de características |
| `Newsletter` | `src/module/shared/components/sections/Newsletter.tsx` | Formularios de suscripción |

### Regla:

```
SI existe componente en shared → IMPORTAR y usar
SI NO existe → CREAR en src/module/[modulo]/components/ecommerce/
```

**NO duplicar componentes que ya existen. Reutilizar siempre.**

---

## 🎯 FACTOR DE IMAGINACIÓN (10%)

**Consultar:** `.agents/team-evolution.md` para ver el factor actual.

Además de cumplir el spec, puedes agregar **pequeñas mejoras** que aporten valor:

**SÍ puedes:**
- Mejorar animaciones y transiciones sutiles
- Optimizar imágenes con sizes/priority apropiados
- Agregar estados empty/loading elegantes
- Mejorar accesibilidad y SEO

**NO debes:**
- Cambiar la arquitectura SSR
- Agregar features complejas no solicitadas
- Crear APIs o endpoints

**Si tienes una propuesta de mejora**, documéntala:
```
PROPUESTA DE MEJORA (Factor 10%)
================================
MEJORA: [descripción]
VALOR: [por qué mejora la UX]
IMPACTO: [mínimo/bajo]
```

---

## 📋 PATRÓN DE MOCKS/CONTRATOS

**El Frontend Ecommerce trabaja con MOCKS** hasta que el Agente Integrador conecte con datos reales.

### Por qué usar Mocks

1. No depender de datos del Admin (que puede estar en desarrollo)
2. Permitir desarrollo paralelo Frontend/Backend
3. Validar UI independientemente
4. QA puede probar la UI sin datos reales

### Cómo definir Mocks

**⚠️ ANTES de crear mocks, SIEMPRE leer `src/module/[modulo]/services/types.ts` para usar los tipos exactos del Backend.**

```bash
# Leer tipos definidos por Backend
cat src/module/[modulo]/services/types.ts
```

Usar esos tipos exactos para los mocks:

```typescript
// Backend definió en services/types.ts:
export interface [Entidad]Card {
  id: number
  name: string
  slug: string
  imageUrl: string | null
  description: string | null
}

// Frontend usa EXACTAMENTE ese tipo para mocks
```

### Crear Mocks en las Páginas

```typescript
// src/app/[modulo]/page.tsx
// TODO: MOCK - Reemplazar con [Entidad]Service.getActive[Entidad]s()
const mockItems: [Entidad]Card[] = [
  {
    id: 1,
    name: 'Ejemplo Tag 1',
    slug: 'ejemplo-tag-1',
    imageUrl: null,
    description: 'Descripción de ejemplo'
  },
  {
    id: 2,
    name: 'Ejemplo Tag 2',
    slug: 'ejemplo-tag-2',
    imageUrl: null,
    description: 'Otra descripción'
  }
]

export default async function [Modulo]sPage() {
  // TODO: MOCK - Descomentar cuando Integrador conecte
  // const items = await [Entidad]Service.getActive[Entidad]s()
  const items = mockItems

  return <[Entidad]Grid items={items} />
}
```

### Marcar claramente los TODOs

Usar comentarios claros para que el Integrador los encuentre fácilmente:

```typescript
// TODO: MOCK - Reemplazar con service real
// TODO: MOCK - Descomentar línea siguiente
// TODO: MOCK - Eliminar mockData
```

### Validación QA - Etapa 1 (Mocks)

Cuando termines los componentes y páginas con mocks:

1. Notificar a QA para que valide la UI
2. QA toma screenshots de las páginas ecommerce
3. Module Lead valida screenshots vs modelo de negocio
4. **Aprobación Etapa 1**: UI con mocks ✓

```
SOLICITUD A QA - ETAPA 1 (MOCKS)
================================
MÓDULO: [modulo]
TIPO: Ecommerce UI con datos mock

PÁGINAS A VALIDAR:
- /[modulo] - Listado
- /[modulo]/[slug] - Detalle
- Homepage section (si aplica)

NOTA: Los datos son mocks, validar solo diseño/layout/UX
```

### Después de Aprobación Etapa 1

El **Agente Integrador** (skill: `integrator/connect-ecommerce.md`):
1. Busca todos los `TODO: MOCK`
2. Conecta con services reales
3. **Si los tipos cambiaron** vs los mocks → te notifica

### Posibles Cambios del Integrador

El Backend es la "fuente de verdad". Los datos reales pueden tener:
- Más campos que los mocks
- Menos campos que los mocks
- Tipos diferentes

Si el Integrador detecta diferencias:
```
CAMBIOS DETECTADOS POR INTEGRADOR
=================================
MÓDULO: [modulo]

DIFERENCIAS vs MOCKS:
- Campo 'color' ahora es opcional (era required en mock)
- Nuevo campo 'createdAt' disponible
- Campo 'subtitle' no existe en datos reales

ACCIÓN REQUERIDA:
Frontend debe ajustar componentes para manejar estos cambios
```

### Ajustes Post-Integración

Si el Integrador reporta cambios:
1. Ajustar componentes para nuevos tipos
2. Manejar campos opcionales
3. Quitar campos que no existen

### Validación QA - Etapa 2 (Datos Reales)

Después de la integración:
1. QA toma nuevos screenshots con datos reales
2. Module Lead valida screenshots
3. **Aprobación Etapa 2**: UI con datos reales ✓

```
SOLICITUD A QA - ETAPA 2 (DATOS REALES)
=======================================
MÓDULO: [modulo]
TIPO: Ecommerce UI con datos reales

VERIFICAR:
- Datos del Admin se muestran correctamente
- Imágenes cargan
- Links funcionan
- No hay errores de tipos
```

---

## IMPORTANTE: Ecommerce usa SSR

- Las páginas son Server Components (async)
- Los servicios se llaman directamente (no fetch a APIs)
- Los datos se pasan como props a componentes cliente

---

## 🏗️ ESTRUCTURA DE LAYOUT OBLIGATORIA

**TODAS las páginas ecommerce DEBEN usar el layout del sitio** para mantener consistencia visual (header, navegación, footer).

### Componentes de Layout Disponibles

```typescript
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
```

| Componente | Propósito |
|------------|-----------|
| `Layout` | Wrapper principal, **incluye Footer automáticamente** |
| `Header` | Cabecera del sitio |
| `Navigation` | Menú de navegación |
| `LayoutContent` | Contenedor del contenido principal |

### Estructura Obligatoria de Página

```tsx
// ✅ CORRECTO - Incluye header y footer
export default async function [Entidad]sPage() {
  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      <LayoutContent>
        {/* Contenido de la página aquí */}
      </LayoutContent>
    </Layout>
  )
}

// ❌ INCORRECTO - Sin layout, la página no tendrá header/footer
export default async function [Entidad]sPage() {
  return (
    <main>
      {/* Contenido huérfano sin header/footer */}
    </main>
  )
}
```

### Props de Header y Navigation

- `navigationType="mini"` - Header compacto (para páginas internas)
- `navigationType="full"` - Header completo (para homepage)
- `type="mini"` en Navigation - Navegación simplificada

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que services existe
ls src/module/[modulo]/services/

# Debe tener: types.ts, hydrators.ts, [modulo].ts, index.ts

# Cambiar a branch
git checkout feature/[modulo]
```

### 2. Crear Estructura de Carpetas

```bash
mkdir -p src/module/[modulo]/components/ecommerce
```

### 3. Crear Componente Principal

Componente que muestra grilla de items (para homepage u otras páginas).

```typescript
// src/module/[modulo]/components/ecommerce/[Entidad]Grid.tsx
import { type [Entidad]Card } from '@/module/[modulo]/services/types'
import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'

interface [Entidad]GridProps {
  items: [Entidad]Card[]
  title?: string
  columns?: 3 | 4 | 5 | 6
}

export const [Entidad]Grid: FC<[Entidad]GridProps> = ({
  items,
  title,
  columns = 4
}) => {
  // No renderizar si no hay items
  if (!items || items.length === 0) {
    return null
  }

  const gridCols = {
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  }

  return (
    <section className="py-8">
      {title && (
        <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      )}
      <div className={`grid ${gridCols[columns]} gap-4`}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/[modulo]/${item.slug}`}
            className="group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
          >
            {/* Imagen */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <svg
                    className="h-12 w-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                {item.name}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### 4. Crear Componente Featured (Destacados)

Para mostrar items destacados con diseño especial.

```typescript
// src/module/[modulo]/components/ecommerce/Featured[Entidad]s.tsx
import { type Featured[Entidad] } from '@/module/[modulo]/services/types'
import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'

interface Featured[Entidad]sProps {
  items: Featured[Entidad][]
}

export const Featured[Entidad]s: FC<Featured[Entidad]sProps> = ({ items }) => {
  // No renderizar si no hay items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <Link
            key={item.slug}
            href={item.link}
            className="group relative overflow-hidden rounded-xl"
          >
            {/* Imagen de fondo */}
            <div className="relative aspect-[4/3] md:aspect-[3/4]">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index < 2}
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900" />
              )}

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Contenido */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white md:text-2xl">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                )}
                <span className="mt-3 inline-flex items-center text-sm font-medium text-white group-hover:underline">
                  Ver más
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### 5. Crear Componente de Detalle (si aplica)

Para página de detalle `/[modulo]/[slug]`.

```typescript
// src/module/[modulo]/components/ecommerce/[Entidad]Detail.tsx
import { type [Entidad]Card } from '@/module/[modulo]/services/types'
import Image from 'next/image'
import { type FC } from 'react'

interface [Entidad]DetailProps {
  item: [Entidad]Card
}

export const [Entidad]Detail: FC<[Entidad]DetailProps> = ({ item }) => {
  return (
    <article className="py-8">
      {/* Banner/Hero */}
      {item.imageUrl && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-xl">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="text-3xl font-bold text-white md:text-4xl">
              {item.name}
            </h1>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="mx-auto max-w-3xl">
        {!item.imageUrl && (
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {item.name}
          </h1>
        )}
        {item.description && (
          <p className="text-lg text-gray-600">{item.description}</p>
        )}
      </div>
    </article>
  )
}
```

### 6. Crear index.ts para exportaciones

```typescript
// src/module/[modulo]/components/ecommerce/index.ts
export { [Entidad]Grid } from './[Entidad]Grid'
export { Featured[Entidad]s } from './Featured[Entidad]s'
export { [Entidad]Detail } from './[Entidad]Detail'
```

### 7. Crear Página Pública (si se requiere)

Solo si el spec indica página pública dedicada.

```bash
mkdir -p "src/app/[modulo]/[slug]"
```

**Página de listado:**

```typescript
// src/app/[modulo]/page.tsx
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { [Entidad]Grid } from '@/module/[modulo]/components/ecommerce'
import [Entidad]Service from '@/module/[modulo]/services'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: '[Entidad]s | AJK Ecommerce',
  description: 'Explora todos nuestros [modulo]s'
}

export default async function [Entidad]sPage() {
  const items = await [Entidad]Service.getActive[Entidad]s()

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      <LayoutContent>
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Nuestros [Entidad]s</h1>
          <[Entidad]Grid items={items} columns={4} />
        </div>
      </LayoutContent>
    </Layout>
  )
}
```

**Página de detalle:**

```typescript
// src/app/[modulo]/[slug]/page.tsx
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import { [Entidad]Detail } from '@/module/[modulo]/components/ecommerce'
import [Entidad]Service from '@/module/[modulo]/services'
import { notFound } from 'next/navigation'
import { type Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await [Entidad]Service.get[Entidad]BySlug(slug)

  if (!item) {
    return { title: 'No encontrado' }
  }

  return {
    title: `${item.name} | AJK Ecommerce`,
    description: item.description ?? `Conoce más sobre ${item.name}`
  }
}

export default async function [Entidad]Page({ params }: PageProps) {
  const { slug } = await params
  const item = await [Entidad]Service.get[Entidad]BySlug(slug)

  if (!item) {
    notFound()
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      <LayoutContent>
        <div className="mx-auto max-w-screen-xl px-4 py-8">
          <[Entidad]Detail item={item} />
        </div>
      </LayoutContent>
    </Layout>
  )
}
```

**Página 404:**

```typescript
// src/app/[modulo]/[slug]/not-found.tsx
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      <LayoutContent>
        <div className="mx-auto flex min-h-[50vh] max-w-screen-xl flex-col items-center justify-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">No encontrado</h1>
          <p className="mb-8 text-gray-600">
            El [modulo] que buscas no existe o fue eliminado.
          </p>
          <Link
            href="/[modulo]"
            className="rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
          >
            Ver todos los [modulo]s
          </Link>
        </div>
      </LayoutContent>
    </Layout>
  )
}
```

### 8. Integrar en Homepage (si aplica)

Agregar sección al homepage.

```typescript
// En src/app/page.tsx, agregar:

import { [Entidad]Grid } from '@/module/[modulo]/components/ecommerce'
// o
import { Featured[Entidad]s } from '@/module/[modulo]/components/ecommerce'
import [Entidad]Service from '@/module/[modulo]/services'

// En el componente:
const [modulo]s = await [Entidad]Service.getActive[Entidad]s()
// o
const featured[Entidad]s = await [Entidad]Service.getFeatured[Entidad]s(3)

// En el JSX:
<[Entidad]Grid items={[modulo]s} title="[Entidad]s" />
// o
<Featured[Entidad]s items={featured[Entidad]s} />
```

### 9. Verificar Lint

```bash
pnpm lint
```

### 10. Commit

```bash
git add src/module/[modulo]/components/ecommerce/
git add src/app/[modulo]/  # Si se crearon páginas

git commit -m "feat([modulo]): FRONTEND add ecommerce components and pages"
git push origin feature/[modulo]
```

### 11. Notificar al Module Lead

```
COMPLETADO: Frontend ecommerce para [modulo]
COMMIT: feat([modulo]): FRONTEND add ecommerce components and pages

COMPONENTES CREADOS:
  - src/module/[modulo]/components/ecommerce/[Entidad]Grid.tsx
  - src/module/[modulo]/components/ecommerce/Featured[Entidad]s.tsx
  - src/module/[modulo]/components/ecommerce/[Entidad]Detail.tsx
  - src/module/[modulo]/components/ecommerce/index.ts

PÁGINAS CREADAS (si aplica):
  - src/app/[modulo]/page.tsx - Listado
  - src/app/[modulo]/[slug]/page.tsx - Detalle
  - src/app/[modulo]/[slug]/not-found.tsx - 404

USO EN HOMEPAGE:
  import { [Entidad]Grid } from '@/module/[modulo]/components/ecommerce'
  const items = await [Entidad]Service.getActive[Entidad]s()
  <[Entidad]Grid items={items} title="[Entidad]s" />

FUNCIONALIDADES:
  - Grilla responsive (2-6 columnas)
  - Cards con imagen, nombre, descripción
  - Links a páginas de detalle
  - SEO dinámico con generateMetadata
  - Página 404 personalizada

NOTAS: Usa SSR - servicios llamados directamente, no APIs
```

---

## 📝 ACTIVITY LOG (Obligatorio)

**Registrar TODO el proceso de trabajo, no solo inicio/fin.**

```bash
# Inicio
./.agents/scripts/log.sh "FRONTEND" "Iniciando frontend ecommerce [modulo]"

# Análisis
./.agents/scripts/log.sh "FRONTEND" "🔍 Analizando: spec sección Ecommerce"
./.agents/scripts/log.sh "FRONTEND" "→ Leyendo .agents/specs/[modulo]-testing-spec.md"
./.agents/scripts/log.sh "FRONTEND" "✓ Encontrado: Grid, Featured, Detail components requeridos"

# Decisiones
./.agents/scripts/log.sh "FRONTEND" "❓ Pregunta: ¿Qué layout usar para el grid?"
./.agents/scripts/log.sh "FRONTEND" "💡 Decisión: Grid responsive 4 columnas desktop, 2 mobile"

# Microtareas
./.agents/scripts/log.sh "FRONTEND" "→ Creando src/module/[modulo]/components/ecommerce/[Entidad]Grid.tsx"
./.agents/scripts/log.sh "FRONTEND" "→ Creando src/module/[modulo]/components/ecommerce/Featured[Entidad]s.tsx"
./.agents/scripts/log.sh "FRONTEND" "→ Creando src/module/[modulo]/components/ecommerce/[Entidad]Detail.tsx"
./.agents/scripts/log.sh "FRONTEND" "→ Creando src/app/[modulo]/page.tsx"
./.agents/scripts/log.sh "FRONTEND" "→ Creando src/app/[modulo]/[slug]/page.tsx"
./.agents/scripts/log.sh "FRONTEND" "→ Ejecutando pnpm lint"

# Completado
./.agents/scripts/log.sh "FRONTEND" "✓ Componentes ecommerce creados"
./.agents/scripts/log.sh "FRONTEND" "✓ Páginas públicas creadas"
./.agents/scripts/log.sh "FRONTEND" "TAREA COMPLETADA"
```

---

## Outputs
- `src/module/[modulo]/components/ecommerce/` completo
- Páginas públicas (si aplica)
- Lint verificado
- Commit realizado

## Next
- QA puede probar visualmente el ecommerce

---

## 🔄 ITERACIÓN: Si QA/Module Lead rechazan

Después de entregar tus componentes, QA toma screenshots y Module Lead valida.

### Si recibes solicitud de corrección:

```
CORRECCIÓN REQUERIDA: Ecommerce UI
==================================
MÓDULO: [modulo]
ETAPA: [1-Mocks / 2-Datos Reales]

PROBLEMAS DETECTADOS:
1. Screenshot: [nombre]
   Problema: [descripción]
   Corrección: [qué debes cambiar]

2. Screenshot: [nombre]
   ...
```

### Proceso de corrección:

1. **Leer el feedback** - Entender exactamente qué está mal
2. **Ubicar el archivo** - El feedback indica qué componente/página
3. **Corregir** - Hacer los cambios necesarios
4. **NO hacer commit** - Solo corregir el código
5. **Notificar a Module Lead:**

```
CORRECCIÓN COMPLETADA: Ecommerce UI
===================================
MÓDULO: [modulo]

PROBLEMAS CORREGIDOS:
1. [problema] → [cómo lo corregiste]
2. [problema] → [cómo lo corregiste]

ARCHIVOS MODIFICADOS:
- src/module/[modulo]/components/ecommerce/[archivo].tsx
- src/app/[modulo]/page.tsx

SOLICITO: QA re-ejecute tests para nuevos screenshots
```

### Problemas comunes y soluciones:

| Problema | Causa | Solución |
|----------|-------|----------|
| Sin Header/Footer | No usa `<Layout>` | Envolver en `<Layout><Header>...<LayoutContent>` |
| Layout descuadrado | CSS incorrecto | Verificar `max-w-screen-xl`, `px-4`, `mx-auto` |
| Imagen no muestra | `imageUrl` null sin fallback | Agregar placeholder/icono cuando no hay imagen |
| 404 sin layout | `not-found.tsx` sin Layout | Agregar Layout a not-found.tsx |
| Mobile overflow | Grid no responsive | Usar `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` |
| Cards sin link | Falta `href` | Envolver en `<Link href={...}>` |

### Iterar hasta aprobación

```
Frontend corrige → QA re-ejecuta tests → Module Lead valida
                                                │
                          ┌─────────────────────┴─────────────────────┐
                          │ < 90%                                     │ >= 90%
                          ▼                                           ▼
                   (Volver a corregir)                         ✅ APROBADO
```

---

## NO Hacer
- ❌ NO crear APIs REST
- ❌ NO usar fetch para obtener datos (usar servicios directamente)
- ❌ NO modificar componentes admin
- ❌ NO modificar services/ del módulo
- ❌ NO hacer commit hasta que Module Lead apruebe
