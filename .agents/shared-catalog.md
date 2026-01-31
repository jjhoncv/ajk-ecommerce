# Catálogo de Componentes Shared

> **REFERENCIA OBLIGATORIA** para agentes Frontend.
> Este catálogo es ESTÁTICO - los agentes DEBEN usar estos componentes, NO crear propios.

---

## Estructura de Carpetas

```
src/module/shared/
├── components/
│   ├── Form/Input/          # Inputs básicos
│   ├── FormCreate/          # Formularios completos con archivos
│   ├── Table/               # Tabla dinámica con drag & drop
│   ├── Page/                # Layout de páginas admin
│   ├── CardContent/         # Tarjetas de contenido
│   ├── Modal/               # Modales
│   ├── Alert/               # Alertas
│   ├── Navigation/          # Navegación
│   ├── sections/            # Secciones de homepage
│   └── ui/                  # Componentes UI básicos
├── lib/                     # Utilidades
│   ├── FetchCustomBody.ts   # Fetch con FormData
│   ├── handlerApi.ts        # Handlers para API routes
│   └── auth/                # Autenticación admin
└── types/                   # Tipos compartidos
```

---

## 1. Form Inputs

### Input
**Ubicación**: `src/module/shared/components/Form/Input/Input.tsx`

```typescript
interface InputProps {
  label?: string
  type: 'text' | 'email' | 'password' | 'number' | 'search' | 'textarea' | 'checkbox' | 'file'
  error?: FieldError
  className?: string
  placeholder?: string
  // ... props estándar de HTML input
}
```

**Uso**:
```tsx
<Input
  type="text"
  label="Nombre"
  {...register('name')}
  error={errors.name}
/>

<Input
  type="textarea"
  label="Descripción"
  {...register('description')}
/>
```

---

### Select
**Ubicación**: `src/module/shared/components/Form/Input/Select.tsx`

```typescript
interface SelectProps {
  label?: string
  error?: FieldError
  children: React.ReactNode  // <option> elements
}
```

**Uso**:
```tsx
<Select label="Categoría" {...register('category_id')} error={errors.category_id}>
  <option value="">Seleccionar...</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</Select>
```

---

### CheckboxGroup
**Ubicación**: `src/module/shared/components/Form/Input/CheckboxGroup.tsx`

```typescript
interface CheckboxGroupProps {
  label: string
  control: any  // de useForm()
  name: string
  items: Array<{ id: string, name: string }>  // ⚠️ ESTRUCTURA OBLIGATORIA
  error?: any
}
```

**⚠️ ESTRUCTURA DE ITEMS OBLIGATORIA**:
```typescript
// ✅ CORRECTO
items: [
  { id: '1', name: 'Opción 1' },
  { id: '2', name: 'Opción 2' }
]

// ❌ INCORRECTO - NO usar esta estructura
items: [
  { label: 'Opción 1', value: '1' },
  { value: '1', text: 'Opción 1' }
]
```

**Uso**:
```tsx
<CheckboxGroup
  label="Secciones"
  name="sections"
  control={control}
  items={sections.map(s => ({ id: String(s.id), name: s.name }))}
  error={errors.sections}
/>
```

---

### Button
**Ubicación**: `src/module/shared/components/Form/Input/Button.tsx`

```typescript
interface ButtonProps {
  type?: 'submit' | 'button' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
}
```

---

## 2. FormCreate (Formularios Completos)

**Ubicación**: `src/module/shared/components/FormCreate/FormCreate.tsx`

```typescript
interface FormCreateProps {
  type?: 'new' | 'edit'
  api: {
    url: string
    method: 'PUT' | 'PATCH' | 'POST' | 'DELETE'
    withFiles: boolean  // ⚠️ SIEMPRE true si hay campos file
  }
  form: {
    redirect: string
    fields: Field[]
    customFields?: object
  }
  audit?: AuditMetadata
}
```

### Field Types

```typescript
type FieldType = 'primary' | 'text' | 'textarea' | 'file' | 'select' | 'checkbox-group'

interface Field {
  key: string           // Nombre del campo (debe coincidir con BD)
  label?: string        // Label visible
  type: FieldType
  value?: any           // Valor por defecto o actual
  required?: boolean | { min?: string, url?: string }
  placeholder?: string

  // Para type: 'select'
  selectOptions?: Array<{ value: string, label: string }>

  // Para type: 'checkbox-group'
  checkboxItems?: Array<{ id: string, name: string }>

  // Para type: 'file'
  multiple?: boolean
  options?: FileOptions
}

interface FileOptions {
  acceptImageTypes?: string[]  // ['image/jpeg', 'image/png']
  maxFileSize?: number         // en bytes
  dimensions?: {
    min: { width: number, height: number }
    max: { width: number, height: number }
  }
  subdirectory?: string        // Carpeta de destino
}
```

### Ejemplo Completo de Fields

```typescript
// [modulo]Fields.ts
import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

export const testimonialFields: Field[] = [
  {
    key: 'id',
    type: 'primary',
    value: ''
  },
  {
    key: 'name',
    label: 'Nombre del cliente',
    type: 'text',
    required: { min: 'Mínimo 2 caracteres' },
    placeholder: 'Ej: Juan Pérez'
  },
  {
    key: 'description',
    label: 'Testimonio',
    type: 'textarea',
    required: true,
    placeholder: 'Escribe el testimonio...'
  },
  {
    key: 'rating',
    label: 'Calificación',
    type: 'select',
    required: true,
    selectOptions: [
      { value: '1', label: '1 estrella' },
      { value: '2', label: '2 estrellas' },
      { value: '3', label: '3 estrellas' },
      { value: '4', label: '4 estrellas' },
      { value: '5', label: '5 estrellas' }
    ]
  },
  {
    key: 'image_url',
    label: 'Foto del cliente',
    type: 'file',
    required: true,
    options: {
      acceptImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize: 2 * 1024 * 1024,  // 2MB
      subdirectory: 'testimonials'
    }
  },
  {
    key: 'is_active',
    label: 'Estado',
    type: 'checkbox-group',
    checkboxItems: [
      { id: 'active', name: 'Activo' }
    ]
  }
]
```

---

## 3. DynamicTable

**Ubicación**: `src/module/shared/components/Table/DynamicTable.tsx`

```typescript
interface TableColumn {
  key: string
  label: ReactNode | string
  width?: string
  render?: (value: any, row?: any) => ReactNode | string
  priority?: 'high' | 'medium' | 'low'
  sortable?: boolean
  searchable?: boolean
  imageField?: boolean
}

interface DynamicTableProps {
  columns: TableColumn[]
  data: Array<Record<string, any>>
  actions?: { edit?: boolean, delete?: boolean }
  onReorder?: (reorderedItems: Array<Record<string, any>>) => void
  enableSearch?: boolean      // default: true
  enablePagination?: boolean  // default: true
  enableSort?: boolean        // default: true
  enableReorder?: boolean     // default: true (drag & drop)
  pageSize?: number           // default: 10
  renderActions?: (id: string) => React.ReactNode
}
```

### Ejemplo de Columns

```typescript
const columns: TableColumn[] = [
  {
    key: 'image_url',
    label: 'Imagen',
    imageField: true,
    width: '80px'
  },
  {
    key: 'name',
    label: 'Nombre',
    sortable: true,
    searchable: true
  },
  {
    key: 'rating',
    label: 'Rating',
    render: (value) => '⭐'.repeat(value)
  },
  {
    key: 'is_active',
    label: 'Estado',
    render: (value) => value ? 'Activo' : 'Inactivo'
  }
]
```

---

## 4. PageUI

**Ubicación**: `src/module/shared/components/Page/Page.tsx`

```typescript
interface PageUIProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  options?: React.ReactNode  // Botones de acción
  breadcrumb?: Array<{ label: string, url?: string }>
  children: React.ReactNode
}
```

**Uso**:
```tsx
<PageUI
  title={<PageTitle icon={MessageSquare}>Testimonios</PageTitle>}
  subtitle="Gestiona los testimonios de clientes"
  options={<PageButton href="/admin/testimonials/new">Nuevo</PageButton>}
  breadcrumb={[
    { label: 'Testimonios', url: '/admin/testimonials' },
    { label: 'Nuevo' }
  ]}
>
  {children}
</PageUI>
```

---

## 5. Otros Componentes

### PageTitle
```typescript
interface PageTitleProps {
  icon: LucideIcon
  children: React.ReactNode
}
```

### PageButton
```typescript
interface PageButtonProps {
  href: string
  children: React.ReactNode
}
```

### CardContent
```tsx
<CardContent>
  {/* Contenido de la tarjeta */}
</CardContent>
```

### Modal
```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}
```

---

## 6. Utilidades de Shared

### FetchCustomBody
**Ubicación**: `src/module/shared/lib/FetchCustomBody.ts`

```typescript
// Envía FormData a la API
await FetchCustomBody({
  url: '/api/admin/testimonials',
  method: 'POST',
  body: formData
})
```

### handlerApi
**Ubicación**: `src/module/shared/lib/handlerApi.ts`

```typescript
import {
  apiHandler,
  createResponse,
  handleError
} from '@/module/shared/lib/handlerApi'

// En API route:
export async function GET(): Promise<Response> {
  return await apiHandler(async () => {
    try {
      const items = await model.getItems()
      return createResponse({ data: items, success: true }, 200)
    } catch (error) {
      return handleError(error, 400)
    }
  })
}
```

### Toast (Notificaciones)
```typescript
import { ToastSuccess, ToastFail } from '@/module/shared/lib/splash'

ToastSuccess('Guardado correctamente')
ToastFail('Error al guardar')
```

---

## 7. Iconos (Lucide)

**Ubicación de constantes**: `src/module/shared/constants/icons.constants.ts`

Iconos comunes para módulos:
```typescript
import {
  MessageSquare,  // Testimonios
  Tag,            // Tags/Etiquetas
  Star,           // Ratings
  Package,        // Productos
  FolderTree,     // Categorías
  Image,          // Banners
  ShoppingCart,   // Órdenes
  Users,          // Usuarios
  Settings        // Configuración
} from 'lucide-react'
```

---

## Reglas para Agentes

1. **NUNCA crear componentes que ya existen en shared**
2. **SIEMPRE verificar este catálogo antes de crear algo nuevo**
3. **Usar exactamente las interfaces documentadas aquí**
4. **Si necesitas algo que no existe, consultar con Module Lead**

### Imports Estándar para Frontend Admin

```typescript
// Componentes de página
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { PageButton } from '@/module/shared/components/Page/PageButton'

// Formularios
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'

// Tabla
import { DynamicTable, type TableColumn } from '@/module/shared/components/Table/DynamicTable'

// Inputs individuales (si no usas FormCreate)
import { Input } from '@/module/shared/components/Form/Input/Input'
import { Select } from '@/module/shared/components/Form/Input/Select'
import { CheckboxGroup } from '@/module/shared/components/Form/Input/CheckboxGroup'
import { Button } from '@/module/shared/components/Form/Input/Button'

// Utilidades
import { CardContent } from '@/module/shared/components/CardContent/CardContent'
```

---

*Última actualización: 2026-01-31*
