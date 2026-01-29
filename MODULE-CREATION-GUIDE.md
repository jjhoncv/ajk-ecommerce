# Module Creation Guide

Guía para crear nuevos módulos en el proyecto AJK E-Commerce.

---

## Estructura de un Módulo

```
src/module/{modulo}/
├── core/                          # Capa de datos (backend)
│   ├── {Entity}.mapper.ts         # snake_case → camelCase
│   ├── {Entity}.model.ts          # Lógica de negocio
│   ├── {Entity}.repository.ts     # Queries SQL
│   └── index.ts                   # Exports
├── service/                       # Capa de servicios
│   └── {entity}/
│       ├── {entity}.ts
│       ├── types.ts
│       └── index.ts
├── components/
│   ├── admin/                     # UI Admin
│   │   ├── {Entity}ListView.tsx
│   │   ├── {entity}Fields.ts      # Definición de campos del form
│   │   └── index.tsx
│   └── ecommerce/                 # UI Pública
│       └── {Entity}.tsx
└── e2e/                           # Tests E2E
```

---

## 1. MAPPER - El Archivo Más Crítico

### El Problema snake_case → camelCase

La BD usa `snake_case`, el dominio usa `camelCase`. **SIEMPRE mapear explícitamente**.

```typescript
// src/module/{modulo}/core/{Entity}.mapper.ts
import { type {Entity} as {Entity}Raw } from '@/types/database'
import { type {Entity} as {Entity}Domain } from '@/types/domain'

// ❌ INCORRECTO - Esto causa bugs
export const {Entity}Mapper = (data: {Entity}Raw): {Entity}Domain => {
  return { ...data }  // ❌ NO convierte image_url → imageUrl
}

// ✅ CORRECTO - Mapeo explícito
export const {Entity}Mapper = (data: {Entity}Raw): {Entity}Domain => {
  return {
    id: data.id,
    name: data.name,
    imageUrl: data.image_url ?? undefined,      // snake → camel
    createdBy: data.created_by ?? undefined,    // snake → camel
    updatedBy: data.updated_by ?? undefined,    // snake → camel
    createdAt: data.created_at ?? undefined,
    updatedAt: data.updated_at ?? undefined
  }
}

// Mapper para arrays - manejar null
export const {Entity}sMapper = (data: {Entity}Raw[] | null): {Entity}Domain[] | undefined => {
  if (data === null) return undefined  // ✅ Retornar undefined, no []
  return data.map({Entity}Mapper)
}
```

### Reglas del Mapper

| Regla | Ejemplo |
|-------|---------|
| Usar `?? undefined` | `data.image_url ?? undefined` |
| NO usar `\|\|` | `data.count \|\| 0` puede fallar si count = 0 |
| Retornar `undefined` para null | No retornar `[]` en arrays vacíos |
| Mapear TODOS los campos | No usar spread `...data` |

---

## 2. REPOSITORY - Acceso a BD

```typescript
// src/module/{modulo}/core/{Entity}.repository.ts
import { executeQuery } from '@/lib/db'
import { type {Entity} as {Entity}Raw } from '@/types/database'

export class {Entity}Repository {
  public async getAll(): Promise<{Entity}Raw[] | null> {
    const items = await executeQuery<{Entity}Raw[]>({
      query: 'SELECT * FROM {tabla}'
    })
    if (items.length === 0) return null  // ✅ null, no []
    return items
  }

  public async getById(id: number): Promise<{Entity}Raw | null> {
    const items = await executeQuery<{Entity}Raw[]>({
      query: 'SELECT * FROM {tabla} WHERE id = ?',
      values: [id]
    })
    if (items.length === 0) return null
    return items[0]
  }

  public async create(data: Omit<{Entity}Raw, 'id'>): Promise<{Entity}Raw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO {tabla} SET ?',
      values: [data]
    })
    // ✅ SIEMPRE re-fetch para obtener timestamps de BD
    return await this.getById(result.insertId)
  }

  public async update(data: Omit<{Entity}Raw, 'id'>, id: number): Promise<{Entity}Raw | null> {
    await executeQuery({
      query: 'UPDATE {tabla} SET ? WHERE id = ?',
      values: [data, id]
    })
    // ✅ SIEMPRE re-fetch
    return await this.getById(id)
  }

  public async delete(id: number): Promise<void> {
    await executeQuery({
      query: 'DELETE FROM {tabla} WHERE id = ?',
      values: [id]
    })
  }
}

export default new {Entity}Repository()
```

### Reglas del Repository

- Retornar `null` en resultados vacíos (no `[]`)
- Usar queries parametrizadas (`?`) para evitar SQL injection
- Re-fetch después de INSERT/UPDATE para obtener timestamps
- Usar tipos genéricos `executeQuery<T>()`

---

## 3. MODEL - Lógica de Negocio

```typescript
// src/module/{modulo}/core/{Entity}.model.ts
import { type {Entity} as {Entity}Raw } from '@/types/database'
import { type {Entity} as {Entity}Domain } from '@/types/domain'
import { {Entity}Mapper, {Entity}sMapper } from './{Entity}.mapper'
import repository from './{Entity}.repository'

export class {Entity}Model {
  public async getAll(): Promise<{Entity}Domain[] | undefined> {
    const raw = await repository.getAll()
    return {Entity}sMapper(raw)  // ✅ Siempre pasar por mapper
  }

  public async getById(id: number): Promise<{Entity}Domain | undefined> {
    const raw = await repository.getById(id)
    if (!raw) return undefined
    return {Entity}Mapper(raw)   // ✅ Siempre pasar por mapper
  }

  public async create(data: Omit<{Entity}Raw, 'id'>): Promise<{Entity}Domain | undefined> {
    const created = await repository.create(data)
    if (!created) return undefined
    return {Entity}Mapper(created)
  }

  public async update(data: Omit<{Entity}Raw, 'id'>, id: number): Promise<{Entity}Domain | undefined> {
    const updated = await repository.update(data, id)
    if (!updated) return undefined
    return {Entity}Mapper(updated)
  }

  public async delete(id: number): Promise<void> {
    await repository.delete(id)
  }
}

export default new {Entity}Model()
```

---

## 4. API ROUTES

```typescript
// src/app/api/admin/{modulo}/route.ts
import model from '@/module/{modulo}/core'
import { apiHandler, createResponse, handleError } from '@/module/shared/lib/handlerApi'
import { adminAuthOptions } from '@/module/shared/lib/auth/authAdmin'
import { getServerSession } from 'next-auth'
import { type NextRequest } from 'next/server'

const getCurrentUserId = async (): Promise<number | null> => {
  const session = await getServerSession(adminAuthOptions)
  return session?.user?.id ? Number(session.user.id) : null
}

// POST - Crear
export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const data = await req.json()

    if (!data.name) {
      return createResponse({ error: 'Name required', success: false }, 400)
    }

    const userId = await getCurrentUserId()

    const item = await model.create({
      name: data.name,
      image_url: data.image_url || null,
      created_at: new Date() as any,
      updated_at: new Date() as any,
      created_by: userId,
      updated_by: userId
    })

    return createResponse({ success: true, item }, 200)
  })
}

// PATCH - Actualizar (usar PATCH, no PUT)
export async function PATCH(req: NextRequest) {
  return await apiHandler(async () => {
    const { id, ...data } = await req.json()

    if (!id) {
      return createResponse({ error: 'ID required', success: false }, 400)
    }

    const userId = await getCurrentUserId()

    const item = await model.update(
      {
        ...data,
        updated_at: new Date() as any,
        updated_by: userId
        // ✅ NO actualizar created_by
      },
      Number(id)
    )

    return createResponse({ success: true, item }, 200)
  })
}

// DELETE
export async function DELETE(req: NextRequest) {
  return await apiHandler(async () => {
    const { id } = await req.json()

    if (!id) {
      return createResponse({ error: 'ID required', success: false }, 400)
    }

    await model.delete(Number(id))
    return createResponse({ success: true }, 200)
  })
}
```

### Reglas de API

- Usar `apiHandler()` wrapper
- Siempre validar inputs
- Obtener `userId` de session para auditoría
- Usar `PATCH` para updates (no `PUT`)
- Setear `updated_at` y `updated_by` en cada modificación

---

## 5. FORM FIELDS - Keys en snake_case

Los keys de los campos **DEBEN coincidir con los nombres de la BD** (snake_case).

```typescript
// src/module/{modulo}/components/admin/{entity}Fields.ts
import { type Field, type FileOptions } from '@/module/shared/components/FormCreate/types'

export const {Entity}FileOptions: FileOptions = {
  maxFileSize: 50 * 1024,  // 50KB
  dimensions: {
    min: { width: 100, height: 100 },
    max: { width: 400, height: 400 }
  },
  acceptImageTypes: ['image/jpeg', 'image/png', 'image/webp']
}

export const {Entity}Fields: Field[] = [
  {
    key: 'name',           // ✅ Coincide con BD
    label: 'Nombre',
    type: 'text',
    required: { min: 'El nombre es requerido' }
  },
  {
    key: 'image_url',      // ✅ snake_case como en BD, NO imageUrl
    label: 'Imagen',
    type: 'file',
    multiple: false,
    options: {Entity}FileOptions
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea'
  },
  {
    key: 'status',
    label: 'Estado',
    type: 'select',
    selectOptions: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' }
    ]
  }
]
```

---

## 6. SECCIÓN EN ADMIN (Sidebar) - CRÍTICO

**IMPORTANTE:** Sin este paso, el módulo NO aparecerá en el sidebar del admin aunque las páginas existan.

### Crear archivo de migración

```bash
# Crear archivo en sql-migrations/
touch sql-migrations/XXX_add_{modulo}_section.sql
```

### Contenido de la migración

```sql
-- Migration: Add {modulo} section to admin
-- Date: YYYY-MM-DD

-- 1. Agregar sección
-- NOTA: `name` es el nombre que se muestra en el sidebar (ej: "Cupones", no "coupons")
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('{NombreVisible}', '/{modulo}', '{Icono}', {orden})
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 2. Asignar al rol superadmin (id = 1)
-- IMPORTANTE: Las columnas son `id_rol` e `id_section` (NO role_id, section_id)
INSERT INTO `roles_sections` (`id_rol`, `id_section`)
SELECT 1, id FROM `sections` WHERE `url` = '/{modulo}'
ON DUPLICATE KEY UPDATE `id_rol` = VALUES(`id_rol`);
```

**Ejemplo para módulo Cupones:**
```sql
INSERT INTO `sections` (`name`, `url`, `image`, `display_order`) VALUES
('Cupones', '/coupons', 'Ticket', 6)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `roles_sections` (`id_rol`, `id_section`)
SELECT 1, id FROM `sections` WHERE `url` = '/coupons'
ON DUPLICATE KEY UPDATE `id_rol` = VALUES(`id_rol`);
```

### Ejecutar la migración

```bash
# Conectar a MySQL y ejecutar
mysql -u root -p ajkecommerce < sql-migrations/XXX_add_{modulo}_section.sql
```

### Verificar que se creó correctamente

```sql
-- Ver todas las secciones
SELECT * FROM sections ORDER BY display_order;

-- Ver secciones asignadas al superadmin
SELECT s.* FROM sections s
JOIN roles_sections rs ON s.id = rs.id_section
WHERE rs.id_rol = 1;
```

### Iconos disponibles (Lucide)

| Icono | Uso |
|-------|-----|
| `Package` | Productos |
| `FolderTree` | Categorías |
| `BadgeCheck` | Marcas |
| `Image` | Banners |
| `Percent` | Promociones |
| `Ticket` | Cupones |
| `Users` | Usuarios |
| `Tag` | Ofertas |
| `Star` | Ratings |
| `Truck` | Envíos |

### Si el módulo no aparece después de la migración

1. Cerrar sesión y volver a iniciar
2. Limpiar cache del navegador
3. Verificar que la migración se ejecutó correctamente
4. Revisar que el rol del usuario tiene acceso a la sección

---

## 7. GENERACIÓN DE TIPOS

Después de crear/modificar tablas en la BD:

```bash
pnpm generate
```

Esto genera:
- `src/types/database/database.d.ts` - Tipos con snake_case
- `src/types/domain/domain.d.ts` - Tipos con camelCase

---

## 8. ERRORES COMUNES

### 1. Mapper incompleto (El más común)
```typescript
// ❌ Bug: imageUrl queda undefined
return { ...data }

// ✅ Correcto
return { imageUrl: data.image_url ?? undefined }
```

### 2. Form keys en camelCase
```typescript
// ❌ No funciona - el API recibe undefined
{ key: 'imageUrl', ... }

// ✅ Correcto - coincide con BD
{ key: 'image_url', ... }
```

### 3. Olvidar campos de auditoría
```typescript
// ❌ Sin auditoría
await model.create({ name: 'Test' })

// ✅ Con auditoría completa
await model.create({
  name: 'Test',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: userId,
  updated_by: userId
})
```

### 4. No re-fetch después de INSERT
```typescript
// ❌ Timestamps incorrectos
const result = await executeQuery({ query: 'INSERT...' })
return result

// ✅ Re-fetch para timestamps de BD
const result = await executeQuery({ query: 'INSERT...' })
return await this.getById(result.insertId)
```

### 5. Null handling inconsistente
```typescript
// ❌ Inconsistente
return data?.map(...) || []

// ✅ Consistente
if (data === null) return undefined
return data.map(...)
```

---

## 9. PÁGINAS DE ERROR

### Error Global (error.tsx)

Next.js captura errores automáticamente con archivos `error.tsx`. Ya existen:
- `/src/app/error.tsx` - Errores en ecommerce
- `/src/app/admin/error.tsx` - Errores en admin

#### Componente Reutilizable (Admin)

```typescript
// src/module/shared/components/ErrorPage/ErrorPage.tsx
'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
  backUrl?: string
  backLabel?: string
}

export function ErrorPage({ error, reset, backUrl = '/admin', backLabel = 'Volver al inicio' }: ErrorPageProps) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      {/* ... UI del error ... */}
      <button onClick={reset}>Intentar de nuevo</button>
      <Link href={backUrl}>{backLabel}</Link>
    </div>
  )
}
```

#### Uso en Admin

```typescript
// src/app/admin/error.tsx
'use client'

import { ErrorPage } from '@/module/shared/components/ErrorPage'

export default function AdminError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorPage error={error} reset={reset} backUrl="/admin" backLabel="Volver al panel" />
}
```

### Reglas de Error Pages

| Regla | Descripción |
|-------|-------------|
| Debe ser `'use client'` | Next.js requiere que sea Client Component |
| Mostrar mensaje amigable | No exponer stack traces en producción |
| Botón de retry | Usar prop `reset()` para reintentar |
| Link de escape | Permitir volver a una página segura |
| Log en desarrollo | Mostrar detalles solo en `NODE_ENV === 'development'` |

---

## 10. PÁGINA NOT FOUND EN ADMIN (Edit Pages)

Cada página de edición (`[id]/page.tsx`) debe manejar el caso cuando el registro no existe.

```typescript
// src/app/admin/{modulo}/[id]/page.tsx
import { {Entity}Fields } from '@/module/{modulo}/components/admin/{entity}Fields'
import {Entity}Service from '@/module/{modulo}/service/{entity}'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

export default async function {Entity}EditPage({
  params
}: {
  params: Promise<{ id: number }>
}): Promise<JSX.Element> {
  const { id } = await params

  const result = await {Entity}Service.get{Entity}WithAudit(Number(id))

  // ✅ CRÍTICO: Manejar registro no encontrado
  if (result == null || result.{entity} == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="No encontrado" />}
          breadcrumb={[{ label: '{Modulos}', url: '/admin/{modulo}' }]}
        >
          <p className="text-gray-500">El {entity} no existe o fue eliminado.</p>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const { {entity}, audit } = result

  const fieldsWithValues = mergeFieldsWithData({Entity}Fields, {
    ...{entity},
    image_url: {entity}?.imageUrl || ''  // ✅ Mapear camelCase → snake_case para form
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar {Entity}" />}
        breadcrumb={[
          { label: '{Modulos}', url: '/admin/{modulo}' },
          { label: 'Editar {Entity}' }
        ]}
        subtitle={`Editando: ${{entity}.name}`}
      >
        <FormCreate
          type="edit"
          api={{ url: '/api/admin/{modulo}', method: 'PATCH', withFiles: true }}
          form={{
            redirect: '/admin/{modulo}',
            fields: fieldsWithValues,
            customFields: { id }
          }}
          audit={audit}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
```

### Reglas de Not Found

| Regla | Descripción |
|-------|-------------|
| Usar `LayoutPageAdmin` | Mantiene el sidebar y layout del admin |
| Breadcrumb con link de retorno | Permite volver al listado fácilmente |
| Mensaje descriptivo | Indica claramente qué pasó |
| Sin stack trace | No exponer errores internos |

### ❌ Incorrecto - Sin layout

```typescript
if (result == null) {
  return <div>No encontrado</div>  // ❌ Pierde el layout del admin
}
```

### ✅ Correcto - Con layout completo

```typescript
if (result == null) {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="No encontrado" />}
        breadcrumb={[{ label: 'Módulos', url: '/admin/modulos' }]}
      >
        <p className="text-gray-500">El registro no existe o fue eliminado.</p>
      </PageUI>
    </LayoutPageAdmin>
  )
}
```

---

## Checklist de Nuevo Módulo

### Base de Datos
- [ ] Crear migración SQL con timestamps y audit fields
- [ ] Ejecutar migración de tabla
- [ ] Ejecutar `pnpm generate` para generar tipos

### Sección en Admin (CRÍTICO)
- [ ] Crear archivo `sql-migrations/XXX_add_{modulo}_section.sql`
- [ ] Ejecutar migración de sección
- [ ] Verificar que la sección aparece en `SELECT * FROM sections`
- [ ] Verificar asignación al rol en `SELECT * FROM roles_sections`
- [ ] Cerrar sesión y re-login para ver cambios en sidebar

### Core (Backend)
- [ ] Crear `{Entity}.mapper.ts` con mapeo explícito snake→camel
- [ ] Crear `{Entity}.repository.ts`
- [ ] Crear `{Entity}.model.ts`
- [ ] Crear `index.ts` con exports

### API
- [ ] Crear `src/app/api/admin/{modulo}/route.ts`
- [ ] Implementar POST, PATCH, DELETE con auditoría

### Admin UI
- [ ] Crear `{entity}Fields.ts` con keys en snake_case
- [ ] Crear `{Entity}ListView.tsx`
- [ ] Crear páginas: list, new, [id]
- [ ] Implementar manejo not-found en [id]/page.tsx
- [ ] Verificar que error.tsx global de admin esté funcionando

### Ecommerce (si aplica)
- [ ] Crear componente en `components/ecommerce/`
- [ ] Agregar a página correspondiente

### Tests E2E
- [ ] Crear carpeta `e2e/` con estructura: index.ts, data.ts, utils.ts, admin/01-crud.ts
- [ ] Implementar tests de navegación, crear, editar, eliminar, validación
- [ ] Ejecutar tests y verificar que pasan
- [ ] Limpiar data de test después de verificar

---

## Flujo de Datos

```
BD (snake_case)
    ↓
Repository (query)
    ↓
Mapper (snake → camel)  ← CRÍTICO
    ↓
Model (domain types)
    ↓
Service (opcional)
    ↓
API Route / Component
```

**El mapper es el punto de transformación. Si falta o está incompleto, los datos llegan incorrectos al frontend.**
