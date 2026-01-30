# Skill: Crear Backend Ecommerce del Módulo

## Rol
Backend

## Trigger
Module Lead asigna tarea de crear backend ecommerce (después de crear backend admin)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md` (sección Ecommerce)
- Core ya creado (`src/module/[modulo]/core/`)
- Branch de trabajo

---

## ⛔ AUTOSUFICIENCIA - NO REVISAR OTROS MÓDULOS

**Este skill contiene TODOS los patrones que necesitas.**

- ❌ NO leer código de otros módulos (banners, brands, categories, etc.)
- ❌ NO buscar "ejemplos" en el codebase

**Solo necesitas:**
1. Leer el spec del módulo (sección Ecommerce)
2. Seguir los templates de ESTE skill

---

## 🎯 FACTOR DE IMAGINACIÓN (10%)

**Consultar:** `.agents/team-evolution.md` para ver el factor actual.

Además de cumplir el spec, puedes agregar **pequeñas mejoras** que aporten valor:

**SÍ puedes:**
- Agregar un hydrator adicional útil
- Mejorar el tipado para mayor seguridad
- Agregar manejo de edge cases obvios

**NO debes:**
- Crear APIs REST (ecommerce usa SSR)
- Cambiar la arquitectura de services
- Agregar funcionalidades complejas extra

**Si tienes una propuesta de mejora**, documéntala:
```
PROPUESTA DE MEJORA (Factor 10%)
================================
MEJORA: [descripción]
VALOR: [por qué es útil]
IMPACTO: [mínimo/bajo]
```

---

## IMPORTANTE: Ecommerce NO usa APIs REST

El ecommerce usa **Server-Side Rendering (SSR)**:
- Las páginas ejecutan servicios directamente
- NO se crean endpoints `/api/[modulo]/`
- Los datos se pasan como props a componentes

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que core existe
ls src/module/[modulo]/core/

# Debe tener: [Entidad].model.ts, [Entidad].mapper.ts, [Entidad].repository.ts

# Cambiar a branch
git checkout feature/[modulo]
```

### 2. Crear Estructura de Carpetas

```bash
mkdir -p src/module/[modulo]/services
```

### 3. Crear services/types.ts

Tipos específicos para UI del ecommerce (diferentes a los tipos domain).

```typescript
// src/module/[modulo]/services/types.ts
import { type [Entidad] } from '@/types/domain'

/**
 * Tipo para listado en ecommerce (solo campos necesarios para UI)
 */
export interface [Entidad]Card {
  id: number
  name: string
  slug: string
  imageUrl: string | null
  description: string | null
}

/**
 * Tipo para sección destacada (con datos enriquecidos)
 */
export interface Featured[Entidad] {
  title: string
  subtitle: string
  image: string
  link: string
  slug: string
}

// Re-exportar tipo domain si se necesita completo
export type { [Entidad] }
```

### 4. Crear services/hydrators.ts

Funciones que transforman tipos domain a tipos UI.

```typescript
// src/module/[modulo]/services/hydrators.ts
import { type [Entidad] } from '@/types/domain'
import { type [Entidad]Card, type Featured[Entidad] } from './types'

/**
 * Transforma [Entidad] domain a [Entidad]Card (solo campos UI)
 */
export const hydrate[Entidad](item: [Entidad]): [Entidad]Card {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    imageUrl: item.imageUrl ?? null,
    description: item.description ?? null
  }
}

/**
 * Transforma array de [Entidad] a [Entidad]Card[]
 */
export const hydrate[Entidad]s(data: [Entidad][] | null): [Entidad]Card[] {
  if (data == null || data.length === 0) return []
  return data.map(hydrate[Entidad])
}

/**
 * Transforma [Entidad] a Featured[Entidad] (datos enriquecidos)
 */
export const hydrateFeatured[Entidad](item: [Entidad]): Featured[Entidad] {
  return {
    title: item.name,
    subtitle: item.description ?? '',
    image: item.imageUrl ?? '',
    link: `/[modulo]/${item.slug}`,
    slug: item.slug
  }
}

/**
 * Transforma primeras N entidades a Featured[Entidad][]
 */
export const hydrateFeatured[Entidad]s(
  data: [Entidad][] | null,
  limit: number = 3
): Featured[Entidad][] {
  if (data == null || data.length === 0) return []
  return data.slice(0, limit).map(hydrateFeatured[Entidad])
}
```

### 5. Crear services/[modulo].ts

Funciones de servicio específicas para ecommerce.

```typescript
// src/module/[modulo]/services/[modulo].ts
import [entidad]Model from '../core/[Entidad].model'
import { hydrate[Entidad]s, hydrateFeatured[Entidad]s } from './hydrators'
import { type [Entidad]Card, type Featured[Entidad] } from './types'

/**
 * Obtiene todos los [modulo]s para mostrar en ecommerce
 */
export const get[Entidad]s = async (): Promise<[Entidad]Card[]> => {
  try {
    const data = await [entidad]Model.get[Entidad]s()
    return hydrate[Entidad]s(data ?? null)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error al obtener [modulo]s: ${message}`)
  }
}

/**
 * Obtiene [modulo]s activos ordenados por display_order
 */
export const getActive[Entidad]s = async (): Promise<[Entidad]Card[]> => {
  try {
    const data = await [entidad]Model.get[Entidad]s()
    if (data == null) return []

    const activeItems = data.filter(item => item.isActive === 1)
    return hydrate[Entidad]s(activeItems)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error al obtener [modulo]s activos: ${message}`)
  }
}

/**
 * Obtiene [modulo]s destacados para homepage
 */
export const getFeatured[Entidad]s = async (
  limit: number = 3
): Promise<Featured[Entidad][]> => {
  try {
    const data = await [entidad]Model.get[Entidad]s()
    return hydrateFeatured[Entidad]s(data ?? null, limit)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error al obtener [modulo]s destacados: ${message}`)
  }
}

/**
 * Obtiene un [modulo] por slug (para página de detalle)
 */
export const get[Entidad]BySlug = async (
  slug: string
): Promise<[Entidad]Card | null> => {
  try {
    const data = await [entidad]Model.get[Entidad]BySlug(slug)
    if (data == null) return null
    return hydrate[Entidad](data)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Error al obtener [modulo] por slug: ${message}`)
  }
}
```

### 6. Crear services/index.ts

Exportar todo como servicio singleton.

```typescript
// src/module/[modulo]/services/index.ts
export {
  get[Entidad]s,
  getActive[Entidad]s,
  getFeatured[Entidad]s,
  get[Entidad]BySlug
} from './[modulo]'

export type {
  [Entidad]Card,
  Featured[Entidad]
} from './types'

// Servicio como objeto (alternativa)
import * as [entidad]Service from './[modulo]'
export default [entidad]Service
```

### 7. Verificar Lint

```bash
pnpm lint
```

### 8. Commit

```bash
git add src/module/[modulo]/services/

git commit -m "feat([modulo]): BACKEND add ecommerce services and hydrators"
git push origin feature/[modulo]
```

### 9. Notificar al Module Lead

```
COMPLETADO: Backend ecommerce para [modulo]
COMMIT: feat([modulo]): BACKEND add ecommerce services and hydrators

ARCHIVOS CREADOS:
  - src/module/[modulo]/services/types.ts
  - src/module/[modulo]/services/hydrators.ts
  - src/module/[modulo]/services/[modulo].ts
  - src/module/[modulo]/services/index.ts

FUNCIONES DISPONIBLES:
  - get[Entidad]s() - Todos los items para listado
  - getActive[Entidad]s() - Solo items activos
  - getFeatured[Entidad]s(limit) - Items destacados para homepage
  - get[Entidad]BySlug(slug) - Un item por slug

TIPOS CREADOS:
  - [Entidad]Card - Tipo para UI de listado
  - Featured[Entidad] - Tipo para secciones destacadas

USO EN PÁGINAS:
  import [Entidad]Service from '@/module/[modulo]/services'
  const items = await [Entidad]Service.get[Entidad]s()

NOTAS: NO se crean APIs REST - usar SSR con servicios directos
```

---

## 📝 ACTIVITY LOG (Obligatorio)

**Registrar TODO el proceso de trabajo, no solo inicio/fin.**

```bash
# Inicio
./.agents/scripts/log.sh "BACKEND" "Iniciando backend ecommerce [modulo]"

# Análisis
./.agents/scripts/log.sh "BACKEND" "🔍 Analizando: spec sección Ecommerce"
./.agents/scripts/log.sh "BACKEND" "→ Leyendo .agents/specs/[modulo]-testing-spec.md"
./.agents/scripts/log.sh "BACKEND" "✓ Encontrado: ecommerceEnabled=true, páginas públicas requeridas"

# Decisiones
./.agents/scripts/log.sh "BACKEND" "❓ Pregunta: ¿Qué hydrators necesito?"
./.agents/scripts/log.sh "BACKEND" "💡 Decisión: hydrateForCard y hydrateForDetail"

# Microtareas
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/services/types.ts"
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/services/hydrators.ts"
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/services/[modulo].ts"
./.agents/scripts/log.sh "BACKEND" "→ Ejecutando pnpm lint"

# Completado
./.agents/scripts/log.sh "BACKEND" "✓ Services creados: types, hydrators, [modulo]"
./.agents/scripts/log.sh "BACKEND" "TAREA COMPLETADA"
```

---

## Outputs
- `src/module/[modulo]/services/` completo
- Hydrators para transformar domain → UI
- Funciones de servicio para ecommerce
- Lint verificado
- Commit realizado

## Next
- Frontend puede usar los servicios en páginas SSR
- QA puede probar visualmente

## NO Hacer
- ❌ NO crear APIs REST (`/api/[modulo]/`)
- ❌ NO modificar core/ existente
- ❌ NO crear componentes React
- ❌ NO modificar base de datos
