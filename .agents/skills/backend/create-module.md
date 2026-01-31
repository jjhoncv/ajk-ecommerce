# Skill: Crear Backend del Módulo

## Rol
Backend

## Trigger
Module Lead asigna tarea de crear backend (después de DBA)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- Types generados en `src/types/database/` y `src/types/domain/`
- Branch de trabajo

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches

---

## ⛔ AUTOSUFICIENCIA - NO REVISAR OTROS MÓDULOS

**Este skill contiene TODOS los patrones que necesitas.**

- ❌ NO leer código de otros módulos (banners, brands, categories, etc.)
- ❌ NO buscar "ejemplos" en el codebase
- ❌ NO usar Glob/Grep para ver cómo lo hacen otros módulos

**Solo necesitas:**
1. Leer el spec del módulo (`.agents/specs/[modulo]-testing-spec.md`)
2. Leer los types generados (`src/types/database/` y `src/types/domain/`)
3. Seguir los templates de ESTE skill reemplazando los placeholders

**Placeholders a reemplazar:**
- `[modulo]` → nombre del módulo en minúsculas (ej: `tags`)
- `[Entidad]` → nombre de la entidad en PascalCase (ej: `Tag`)
- `[entidad]` → nombre de la entidad en camelCase (ej: `tag`)
- `[tabla]` → nombre de la tabla en la BD (ej: `tags`)

---

## 🎯 FACTOR DE IMAGINACIÓN (10%)

**Consultar:** `.agents/team-evolution.md` para ver el factor actual.

Además de cumplir el spec, puedes agregar **pequeñas mejoras** que aporten valor:

**SÍ puedes:**
- Agregar una validación útil no especificada
- Mejorar un mensaje de error para ser más claro
- Optimizar una query si ves oportunidad obvia

**NO debes:**
- Cambiar la arquitectura
- Agregar campos no solicitados
- Crear funcionalidades complejas extra

**Si tienes una propuesta de mejora**, documéntala:
```
PROPUESTA DE MEJORA (Factor 10%)
================================
MEJORA: [descripción]
VALOR: [por qué es útil]
IMPACTO: [mínimo/bajo]
```

El Module Lead evaluará si la mejora superó expectativas y actualizará este skill.

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que types existen
grep -A 5 "export interface [Entidad]" src/types/database/database.d.ts
grep -A 5 "export interface [Entidad]" src/types/domain/domain.d.ts

# Cambiar a branch
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 2. Crear Estructura de Carpetas

```bash
mkdir -p src/module/[modulo]/core
mkdir -p src/module/[modulo]/service/[modulo]
```

### 3. Crear core/[Entidad].model.ts

**IMPORTANTE**: Usar clase con métodos públicos, no objeto.

```typescript
// src/module/[modulo]/core/[Entidad].model.ts
import { type [Entidad] as [Entidad]Raw } from '@/types/database'
import { type [Entidad] } from '@/types/domain'

import { [Entidad]Mapper, [Entidad]sMapper } from './[Entidad].mapper'
import o[Entidad]Rep from './[Entidad].repository'

export class [Entidad]Model {
  public async get[Entidad]s(): Promise<[Entidad][] | undefined> {
    const itemsRaw = await o[Entidad]Rep.get[Entidad]s()
    return [Entidad]sMapper(itemsRaw)
  }

  public async get[Entidad]ById(id: number): Promise<[Entidad] | undefined> {
    const itemRaw = await o[Entidad]Rep.get[Entidad]ById(id)
    if (itemRaw == null) return undefined
    return [Entidad]Mapper(itemRaw)
  }

  public async get[Entidad]BySlug(slug: string): Promise<[Entidad] | undefined> {
    const itemRaw = await o[Entidad]Rep.get[Entidad]BySlug(slug)
    if (itemRaw == null) return undefined
    return [Entidad]Mapper(itemRaw)
  }

  public async create[Entidad](
    data: Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<[Entidad] | undefined> {
    const created = await o[Entidad]Rep.create[Entidad](data)
    if (created == null) return undefined
    return [Entidad]Mapper(created)
  }

  public async update[Entidad](
    data: Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<[Entidad] | undefined> {
    const updated = await o[Entidad]Rep.update[Entidad](data, id)
    if (updated == null) return undefined
    return [Entidad]Mapper(updated)
  }

  public async delete[Entidad](id: number): Promise<void> {
    await o[Entidad]Rep.delete[Entidad](id)
  }
}

const [entidad]Model = new [Entidad]Model()
export default [entidad]Model
```

### 4. Crear core/[Entidad].repository.ts

**IMPORTANTE**: Usar clase con métodos públicos, usar executeQuery.

```typescript
// src/module/[modulo]/core/[Entidad].repository.ts
import { executeQuery } from '@/lib/db'
import { type [Entidad] as [Entidad]Raw } from '@/types/database'

export class [Entidad]Repository {
  public async get[Entidad]s(): Promise<[Entidad]Raw[] | null> {
    const items = await executeQuery<[Entidad]Raw[]>({
      query: 'SELECT * FROM [tabla] ORDER BY display_order ASC, name ASC'
    })

    if (items.length === 0) return null
    return items
  }

  public async get[Entidad]ById(id: number): Promise<[Entidad]Raw | null> {
    const items = await executeQuery<[Entidad]Raw[]>({
      query: 'SELECT * FROM [tabla] WHERE id = ?',
      values: [id]
    })

    if (items.length === 0) return null
    return items[0]
  }

  public async get[Entidad]BySlug(slug: string): Promise<[Entidad]Raw | null> {
    const items = await executeQuery<[Entidad]Raw[]>({
      query: 'SELECT * FROM [tabla] WHERE slug = ?',
      values: [slug]
    })

    if (items.length === 0) return null
    return items[0]
  }

  public async create[Entidad](
    data: Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<[Entidad]Raw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO [tabla] SET ?',
      values: [data]
    })

    return await this.get[Entidad]ById(result.insertId)
  }

  public async update[Entidad](
    data: Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>,
    id: number
  ): Promise<[Entidad]Raw | null> {
    await executeQuery({
      query: 'UPDATE [tabla] SET ? WHERE id=?',
      values: [data, id]
    })

    return await this.get[Entidad]ById(id)
  }

  public async delete[Entidad](id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM [tabla] WHERE id=?',
      values: [id]
    })
  }
}

const [entidad]Repository = new [Entidad]Repository()
export default [entidad]Repository
```

### 5. Crear core/[Entidad].mapper.ts

**IMPORTANTE**: Funciones puras que transforman snake_case a camelCase.

```typescript
// src/module/[modulo]/core/[Entidad].mapper.ts
import { type [Entidad] as [Entidad]Raw } from '@/types/database'
import { type [Entidad] } from '@/types/domain'

export const [Entidad]Mapper = (data: [Entidad]Raw): [Entidad] => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    displayOrder: data.display_order,
    imageUrl: data.image_url,
    // Audit fields
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    createdBy: data.created_by,
    updatedBy: data.updated_by
  }
}

export const [Entidad]sMapper = (
  data: [Entidad]Raw[] | null
): [Entidad][] | undefined => {
  if (data === null) return undefined
  return data.map([Entidad]Mapper)
}
```

### 6. Crear core/index.ts

```typescript
// src/module/[modulo]/core/index.ts
export { default as [entidad]Model } from './[Entidad].model'
export { [Entidad]Mapper, [Entidad]sMapper } from './[Entidad].mapper'
export { default as [entidad]Repository } from './[Entidad].repository'
```

### 7. Crear service/[modulo]/types.ts

```typescript
// src/module/[modulo]/service/[modulo]/types.ts
import { type [Entidad] as [Entidad]Raw } from '@/types/database'
import { type [Entidad] } from '@/types/domain'

export type Create[Entidad]Data = Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>
export type Update[Entidad]Data = Omit<[Entidad]Raw, 'id' | 'created_at' | 'updated_at'>

export type { [Entidad] }
```

### 8. Crear service/[modulo]/index.ts

```typescript
// src/module/[modulo]/service/[modulo]/index.ts
import [entidad]Model from '../../core/[Entidad].model'
import userModel from '@/module/users/core/User.model'
import { type Create[Entidad]Data, type Update[Entidad]Data } from './types'

export interface [Entidad]WithAudit {
  [entidad]: Awaited<ReturnType<typeof [entidad]Model.get[Entidad]ById>>
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const [entidad]Service = {
  get[Entidad]s: async () => {
    const items = await [entidad]Model.get[Entidad]s()
    return items ?? []
  },

  get[Entidad]ById: async (id: number) => {
    return await [entidad]Model.get[Entidad]ById(id)
  },

  get[Entidad]BySlug: async (slug: string) => {
    return await [entidad]Model.get[Entidad]BySlug(slug)
  },

  get[Entidad]WithAudit: async (id: number): Promise<[Entidad]WithAudit | null> => {
    const item = await [entidad]Model.get[Entidad]ById(id)
    if (!item) return null

    const [createdByName, updatedByName] = await Promise.all([
      item.createdBy ? userModel.getUserFullName(item.createdBy) : null,
      item.updatedBy ? userModel.getUserFullName(item.updatedBy) : null
    ])

    return {
      [entidad]: item,
      audit: {
        createdAt: item.createdAt ?? null,
        createdByName,
        updatedAt: item.updatedAt ?? null,
        updatedByName
      }
    }
  },

  create[Entidad]: async (data: Create[Entidad]Data) => {
    return await [entidad]Model.create[Entidad](data)
  },

  update[Entidad]: async (data: Update[Entidad]Data, id: number) => {
    return await [entidad]Model.update[Entidad](data, id)
  },

  delete[Entidad]: async (id: number) => {
    await [entidad]Model.delete[Entidad](id)
  }
}

export default [entidad]Service
```

### 9. Crear API Route

**IMPORTANTE**: Usar `apiHandler`, `createResponse`, `handleError` de shared.

```bash
mkdir -p src/app/api/admin/[modulo]
```

**src/app/api/admin/[modulo]/route.ts:**

```typescript
// src/app/api/admin/[modulo]/route.ts
import o[Entidad] from '@/module/[modulo]/core/[Entidad].model'
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

// Helper para obtener el ID del usuario actual
const getCurrentUserId = async (): Promise<number | null> => {
  const session = await getServerSession(adminAuthOptions)
  if (session?.user?.id) {
    return Number(session.user.id)
  }
  return null
}

// Helper para generar slug desde el nombre
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Función helper para procesar el formData
const processFormData = async (formData: FormData) => {
  const name = formData.get('name') as string
  const slugInput = formData.get('slug') as string
  const description = formData.get('description') as string
  const displayOrder = (formData.get('display_order') as string) ?? '0'
  const imageUrl = formData.get('image_url') as string
  const id = formData.get('id') as string

  const slug = slugInput && slugInput.trim() !== ''
    ? generateSlug(slugInput)
    : generateSlug(name)

  const itemFile = imageUrl !== '' && imageUrl != null
    ? { image_url: imageUrl }
    : {}

  return {
    id,
    name,
    slug,
    description: description ?? '',
    displayOrder: Number(displayOrder),
    itemFile
  }
}

export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const items = await o[Entidad].get[Entidad]s()
      return createResponse(
        {
          message: '[Entidad]s obtenidos',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function POST(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { name, slug, description, displayOrder, itemFile } = await processFormData(formData)

    if (name === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await o[Entidad].create[Entidad]({
        name,
        slug,
        description,
        display_order: displayOrder,
        created_by: userId,
        updated_by: userId,
        ...itemFile
      })

      return createResponse(
        {
          message: '[Entidad] creado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const formData = await req.formData()
    const { id, name, slug, description, displayOrder, itemFile } = await processFormData(formData)

    if (name === '' || id === '') {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      await o[Entidad].update[Entidad](
        {
          name,
          slug,
          description,
          display_order: displayOrder,
          updated_by: userId,
          ...itemFile
        },
        Number(id)
      )

      return createResponse(
        {
          message: '[Entidad] actualizado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(req: NextRequest): Promise<Response> {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'Missing required fields', success: false },
        400
      )
    }

    try {
      await o[Entidad].delete[Entidad](id)
      return createResponse(
        {
          message: '[Entidad] eliminado',
          success: true
        },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
```

### 10. Ejecutar Lint

```bash
pnpm lint
```

Si hay errores, corregirlos antes de continuar.

### 11. Commit

```bash
git add src/module/[modulo]/core/
git add src/module/[modulo]/service/
git add src/app/api/admin/[modulo]/

git commit -m "feat([modulo]): BACKEND add core, service and API routes"
git push origin feature/[modulo]
```

### 12. Notificar al Module Lead

```
COMPLETADO: Backend para [modulo]
COMMIT: feat([modulo]): add core, service and API routes

ARCHIVOS CREADOS:
  - src/module/[modulo]/core/[Entidad].model.ts
  - src/module/[modulo]/core/[Entidad].mapper.ts
  - src/module/[modulo]/core/[Entidad].repository.ts
  - src/module/[modulo]/core/index.ts
  - src/module/[modulo]/service/[modulo]/types.ts
  - src/module/[modulo]/service/[modulo]/index.ts
  - src/app/api/admin/[modulo]/route.ts

API ENDPOINTS:
  - GET    /api/admin/[modulo]  - Listar todos
  - POST   /api/admin/[modulo]  - Crear nuevo (FormData)
  - PATCH  /api/admin/[modulo]  - Actualizar (FormData)
  - DELETE /api/admin/[modulo]  - Eliminar (JSON body)

PATRONES USADOS:
  - Class-based Model y Repository
  - Mappers como funciones puras
  - apiHandler, createResponse, handleError de shared
  - FormData para POST/PATCH
  - Audit fields (created_by, updated_by)

NOTAS: [observaciones si las hay]
```

---

## 📝 ACTIVITY LOG (Obligatorio)

**Registrar TODO el proceso de trabajo, no solo inicio/fin.**

```bash
# Inicio
./.agents/scripts/log.sh "BACKEND" "Iniciando backend [modulo]"

# Análisis
./.agents/scripts/log.sh "BACKEND" "🔍 Analizando: spec y types generados"
./.agents/scripts/log.sh "BACKEND" "→ Leyendo .agents/specs/[modulo]-testing-spec.md"
./.agents/scripts/log.sh "BACKEND" "→ Leyendo src/types/domain/domain.d.ts"
./.agents/scripts/log.sh "BACKEND" "✓ Encontrado: interface [Entidad] con X campos"

# Decisiones
./.agents/scripts/log.sh "BACKEND" "❓ Pregunta: ¿Qué validaciones necesita el endpoint POST?"
./.agents/scripts/log.sh "BACKEND" "💡 Decisión: Validar name (required, min 2 chars) y slug (unique)"

# Microtareas
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/core/[Entidad].model.ts"
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/core/[Entidad].repository.ts"
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/[modulo]/core/[Entidad].mapper.ts"
./.agents/scripts/log.sh "BACKEND" "→ Creando API route POST /api/admin/[modulo]"
./.agents/scripts/log.sh "BACKEND" "→ Ejecutando pnpm lint"

# Problemas y resoluciones
./.agents/scripts/log.sh "BACKEND" "⚠️ Problema: Import error en mapper"
./.agents/scripts/log.sh "BACKEND" "✓ Resuelto: Corregido path del import"

# Completado
./.agents/scripts/log.sh "BACKEND" "✓ Core completado: model, repository, mapper"
./.agents/scripts/log.sh "BACKEND" "✓ API Routes creadas: GET, POST, PATCH, DELETE"
./.agents/scripts/log.sh "BACKEND" "TAREA COMPLETADA"
```

---

## Outputs
- `src/module/[modulo]/core/` completo (class-based)
- `src/module/[modulo]/service/` completo
- `src/app/api/admin/[modulo]/` con CRUD
- Lint verificado
- Commit realizado

## Next
- Frontend puede usar la API
- QA puede probar endpoints

## NO Hacer
- NO usar objetos para Model/Repository - usar clases
- NO usar JSON.parse en API - usar FormData
- NO modificar base de datos
- NO crear componentes React
- NO crear tests E2E
- NO hacer commit sin pasar lint

---

## 📚 Aprendizajes del Equipo

### Validación de Campos del Mapper
**Problema detectado**: Mapper y API routes incluían campos que NO existían en la tabla, causando errores en runtime.

**Causa raíz**: Se copiaron campos "estándar" del template sin verificar la estructura real de la tabla.

**Regla obligatoria**: Antes de crear el mapper, SIEMPRE verificar los campos reales:

```bash
# 1. Ver los campos que REALMENTE existen en la tabla
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE [modulo];"

# 2. Ver los types generados (DEBEN coincidir con la tabla)
grep -A 30 "export interface [Entidad]" src/types/database/database.d.ts
```

**Regla del Mapper**: SOLO incluir campos que:
1. ✅ Existen en la tabla (verificado con DESCRIBE)
2. ✅ Están en el type de database.d.ts
3. ❌ NO asumir campos "estándar" (created_by, updated_by, etc.) - verificar primero

**Checklist antes de commit**:
- [ ] Ejecuté DESCRIBE [modulo] y comparé con mi mapper
- [ ] Cada campo del mapper existe en database.d.ts
- [ ] No hay campos inventados o asumidos
