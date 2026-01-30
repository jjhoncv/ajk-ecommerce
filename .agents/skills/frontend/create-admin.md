# Skill: Crear Frontend Admin del Módulo

## Rol
Frontend

## Trigger
Module Lead asigna tarea de crear frontend (después de DBA)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- Types generados en `src/types/`
- Branch de trabajo

---

## Componentes Compartidos a Usar

**IMPORTANTE**: El proyecto tiene componentes compartidos en `@/module/shared/`. SIEMPRE usarlos.

| Componente | Import | Uso |
|------------|--------|-----|
| `DynamicTable` | `@/module/shared/components/Table/DynamicTable` | Tabla con búsqueda, paginación, ordenamiento |
| `FormCreate` | `@/module/shared/components/FormCreate/FormCreate` | Formulario con validaciones |
| `LayoutPageAdmin` | `@/module/shared/components/LayoutPageAdmin` | Layout de página admin |
| `PageUI` | `@/module/shared/components/Page/Page` | Contenedor de página |
| `PageTitle` | `@/module/shared/components/Page/PageTitle` | Título de página |
| `PageButton` | `@/module/shared/components/Page/PageButton` | Botón de acción |
| `Alert` | `@/module/shared/components/Alert/Alert` | Confirmación de eliminación |
| `RemoveAction` | `@/module/shared/components/Table/Actions` | Acción de eliminar |
| `FetchCustomBody` | `@/module/shared/lib/FetchCustomBody` | Fetch con FormData |
| `ToastSuccess/ToastFail` | `@/module/shared/lib/splash` | Notificaciones |
| `mergeFieldsWithData` | `@/module/shared/components/FormCreate/mergeFieldsWithData` | Merge para editar |

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que types existen
grep -A 5 "export interface [Entidad]" src/types/domain/domain.d.ts

# Cambiar a branch
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 2. Crear Estructura de Carpetas

```bash
mkdir -p src/module/[modulo]/components/admin
mkdir -p src/app/admin/[modulo]/new
mkdir -p "src/app/admin/[modulo]/[id]"
```

### 3. Crear [entidad]Fields.ts

**IMPORTANTE**: Usar `Field` type de FormCreate.

```typescript
// src/module/[modulo]/components/admin/[entidad]Fields.ts
import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

export const [Entidad]FileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 200, height: 200 },
    max: { width: 800, height: 800 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const [Entidad]Fields: Field[] = [
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'
    }
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    required: {
      min: 'Slug es requerido'
    },
    placeholder: 'ej: mi-[modulo] (se genera automáticamente)'
  },
  {
    key: 'description',
    label: 'Descripción',
    type: 'textarea'
  },
  {
    key: 'image_url',
    label: 'Imagen',
    type: 'file',
    multiple: false,
    required: false,
    options: [Entidad]FileOptions
  }
]
```

### 4. Crear [Entidad]ListView.tsx

**IMPORTANTE**: Usar `DynamicTable`, `Alert`, `FetchCustomBody` de shared.

```typescript
// src/module/[modulo]/components/admin/[Entidad]ListView.tsx
'use client'
import { type [Entidad] } from '@/module/[modulo]/service/[modulo]/types'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { PreviewImageList } from '@/module/shared/components/PreviewImageList'
import { RemoveAction } from '@/module/shared/components/Table/Actions'
import {
  DynamicTable,
  type TableColumn
} from '@/module/shared/components/Table/DynamicTable'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC } from 'react'

interface [Entidad]ListViewProps {
  items: [Entidad][]
}

export const [Entidad]ListView: FC<[Entidad]ListViewProps> = ({ items }) => {
  const router = useRouter()

  const columns: TableColumn[] = [
    {
      key: 'displayOrder',
      label: '#',
      priority: 'high',
      sortable: true,
      width: '5%',
      render: (order: number) => (
        <span className="text-sm font-medium text-gray-500">{order}</span>
      )
    },
    {
      key: 'imageUrl',
      label: 'Imagen',
      priority: 'high',
      sortable: false,
      render: (imageURL: string) => <PreviewImageList imageURL={imageURL} />,
      width: '10%'
    },
    {
      key: 'name',
      label: 'Nombre',
      priority: 'high',
      sortable: true,
      searchable: true,
      width: '50%'
    },
    {
      key: 'slug',
      label: 'Slug',
      priority: 'medium',
      sortable: true,
      width: '25%',
      render: (slug: string) => (
        <span className="text-sm text-gray-500">{slug}</span>
      )
    }
  ]

  const handleRemove = async (id: string | null): Promise<void> => {
    if (id == null || id === '') return
    try {
      const message = await FetchCustomBody({
        data: { id },
        method: 'DELETE',
        url: '/api/admin/[modulo]'
      })

      ToastSuccess(message)
      router.push('/admin/[modulo]')
      router.refresh()
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido'
      ToastFail(errorMessage)
    }
  }

  return (
    <>
      <Alert
        message="¿Estás seguro de eliminar este elemento?"
        onSuccess={() => {
          const urlParams = new URLSearchParams(window.location.search)
          const id = urlParams.get('id')
          void handleRemove(id)
        }}
        onCancel={() => {
          router.replace('/admin/[modulo]')
        }}
      />
      <DynamicTable
        columns={columns}
        data={items}
        renderActions={(id: string) => {
          return (
            <>
              <Link
                href={`/admin/[modulo]/${id}`}
                className="flex cursor-pointer items-center gap-3 rounded px-4 py-2 text-sm font-light transition-colors hover:bg-slate-100"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Editar
              </Link>
              <RemoveAction id={id} baseURL="/admin/[modulo]" />
            </>
          )
        }}
        enableSearch
        enablePagination
        enableSort
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </>
  )
}
```

### 5. Crear Página de Lista (page.tsx)

**IMPORTANTE**: Usar `LayoutPageAdmin`, `PageUI`, `PageTitle`, `PageButton`.

```typescript
// src/app/admin/[modulo]/page.tsx
import { [Entidad]ListView } from '@/module/[modulo]/components/admin/[Entidad]ListView'
import [entidad]Service from '@/module/[modulo]/service/[modulo]'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function [Entidad]ListPage(): Promise<JSX.Element> {
  const items = await [entidad]Service.get[Entidad]s()

  if (items.length === 0) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="[Entidad]s" />}
          subtitle="No hay [modulo]s creados"
          breadcrumb={[{ label: '[Entidad]s', url: '/admin/[modulo]' }]}
          options={
            <PageButton href="/admin/[modulo]/new">
              Nuevo [Entidad]
            </PageButton>
          }
        >
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No hay [modulo]s creados
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">
              Comienza creando tu primer [modulo]
            </p>
            <PageButton href="/admin/[modulo]/new">
              + Crear [modulo]
            </PageButton>
          </div>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="[Entidad]s" />}
        subtitle="Gestiona los [modulo]s"
        breadcrumb={[{ label: '[Entidad]s', url: '/admin/[modulo]' }]}
        options={
          <PageButton href="/admin/[modulo]/new">
            Nuevo [Entidad]
          </PageButton>
        }
      >
        <[Entidad]ListView items={items} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
```

### 6. Crear Página New (new/page.tsx)

**IMPORTANTE**: Usar `FormCreate` de shared.

```typescript
// src/app/admin/[modulo]/new/page.tsx
import { [Entidad]Fields } from '@/module/[modulo]/components/admin/[entidad]Fields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export default async function New[Entidad]Page(): Promise<JSX.Element> {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nuevo [Entidad]" />}
        subtitle="Crear un nuevo [modulo]"
        breadcrumb={[
          { label: '[Entidad]s', url: '/admin/[modulo]' },
          { label: 'Nuevo [Entidad]' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/[modulo]',
            method: 'POST',
            withFiles: true
          }}
          form={{
            redirect: '/admin/[modulo]',
            fields: [Entidad]Fields
          }}
        />
      </PageUI>
    </LayoutPageAdmin>
  )
}
```

### 7. Crear Página Edit ([id]/page.tsx)

**IMPORTANTE**: Usar `mergeFieldsWithData` para precargar datos.

```typescript
// src/app/admin/[modulo]/[id]/page.tsx
import { [Entidad]Fields } from '@/module/[modulo]/components/admin/[entidad]Fields'
import [entidad]Service from '@/module/[modulo]/service/[modulo]'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { type JSX } from 'react'

export const revalidate = 0 // Deshabilitar cache estático

interface Edit[Entidad]PageProps {
  params: Promise<{ id: string }>
}

export default async function Edit[Entidad]Page({
  params
}: Edit[Entidad]PageProps): Promise<JSX.Element> {
  const { id } = await params

  const result = await [entidad]Service.get[Entidad]WithAudit(Number(id))

  if (result == null || result.[entidad] == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="No encontrado" />}
          breadcrumb={[{ label: '[Entidad]s', url: '/admin/[modulo]' }]}
        >
          <p className="text-gray-500">El [modulo] no existe o fue eliminado.</p>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const { [entidad], audit } = result

  const fieldsWithValues = mergeFieldsWithData([Entidad]Fields, {
    ...([entidad] as Record<string, unknown>),
    image_url: [entidad].imageUrl || '',
    slug: [entidad].slug || ''
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar [Entidad]" />}
        subtitle={`Editando: ${[entidad].name}`}
        breadcrumb={[
          { label: '[Entidad]s', url: '/admin/[modulo]' },
          { label: 'Editar [Entidad]' }
        ]}
      >
        <FormCreate
          type="edit"
          api={{
            url: '/api/admin/[modulo]',
            method: 'PATCH',
            withFiles: true
          }}
          form={{
            redirect: '/admin/[modulo]',
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

### 8. Ejecutar Lint

```bash
pnpm lint
```

Si hay errores, corregirlos antes de continuar.

### 9. Commit

```bash
git add src/module/[modulo]/components/
git add src/app/admin/[modulo]/

git commit -m "feat([modulo]): add admin components and pages"
git push origin feature/[modulo]
```

### 10. Notificar al Module Lead

```
COMPLETADO: Frontend admin para [modulo]
COMMIT: feat([modulo]): add admin components and pages

ARCHIVOS CREADOS:
  - src/module/[modulo]/components/admin/[entidad]Fields.ts
  - src/module/[modulo]/components/admin/[Entidad]ListView.tsx
  - src/app/admin/[modulo]/page.tsx
  - src/app/admin/[modulo]/new/page.tsx
  - src/app/admin/[modulo]/[id]/page.tsx

PÁGINAS:
  - /admin/[modulo]      - Lista con DynamicTable
  - /admin/[modulo]/new  - FormCreate para crear
  - /admin/[modulo]/[id] - FormCreate para editar

COMPONENTES SHARED USADOS:
  - DynamicTable (tabla con búsqueda, paginación)
  - FormCreate (formulario con validación)
  - LayoutPageAdmin, PageUI, PageTitle, PageButton
  - Alert (confirmación de eliminación)
  - FetchCustomBody, ToastSuccess, ToastFail
  - mergeFieldsWithData (precarga de datos en edit)

FUNCIONALIDADES:
  - Listar con ordenamiento y búsqueda
  - Crear con validaciones
  - Editar con datos precargados y audit info
  - Eliminar con confirmación

NOTAS: [observaciones si las hay]
```

---

## Outputs
- `src/module/[modulo]/components/admin/` completo
- `src/app/admin/[modulo]/` con 3 páginas
- Lint verificado
- Commit realizado

## Next
- QA puede probar la UI

## REGLAS CRÍTICAS - FormCreate

### 1. SIEMPRE usar `withFiles: true`

```typescript
// ✅ CORRECTO
api={{ url: '/api/admin/[modulo]', method: 'POST', withFiles: true }}

// ❌ INCORRECTO - Causa bug: FormData se convierte a JSON vacío "{}"
api={{ url: '/api/admin/[modulo]', method: 'POST', withFiles: false }}
```

**Razón**: FormCreate SIEMPRE construye FormData internamente. Si `withFiles: false`,
FetchCustomBody hace `JSON.stringify(FormData)` que retorna `{}` (objeto vacío).

### 2. FieldTypes VÁLIDOS

Solo existen estos tipos de campo:

| Tipo | Uso |
|------|-----|
| `'text'` | Input de texto, números, colores hex, etc. |
| `'textarea'` | Área de texto multilínea |
| `'file'` | Archivos/imágenes |
| `'select'` | Dropdown con opciones |
| `'checkbox-group'` | Grupo de checkboxes |
| `'primary'` | Campo principal destacado |

**NO EXISTEN**: `'color'`, `'number'`, `'date'`, `'email'`, `'password'`

```typescript
// ✅ CORRECTO - Para colores usar 'text'
{ key: 'color', label: 'Color (hex)', type: 'text', placeholder: '#FF5733' }

// ✅ CORRECTO - Para números usar 'text'
{ key: 'display_order', label: 'Orden', type: 'text', placeholder: '0' }

// ❌ INCORRECTO - Estos tipos NO existen
{ key: 'color', type: 'color' }      // ERROR: 'color' no es FieldType válido
{ key: 'order', type: 'number' }     // ERROR: 'number' no es FieldType válido
```

---

## NO Hacer
- NO crear componentes custom de tabla/formulario - usar shared
- NO usar fetch directo - usar FetchCustomBody
- NO usar JSON en API - usar FormData
- NO modificar base de datos
- NO crear core/ o service/
- NO crear tests E2E
- NO hacer commit sin pasar lint
- NO usar `withFiles: false` en FormCreate
- NO usar tipos de campo que no existan ('color', 'number', etc.)
