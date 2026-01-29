# Module Template - AJK E-Commerce

Este documento define las convenciones y patrones que deben seguir todos los agentes al desarrollar o modificar un modulo.

---

## 1. Estructura de Carpetas del Modulo

```
src/module/[nombre-modulo]/
├── core/                          # Capa de datos (Model-Repository-Mapper)
│   ├── [Entidad].model.ts         # Logica de negocio
│   ├── [Entidad].repository.ts    # Acceso a datos SQL
│   ├── [Entidad].mapper.ts        # Transformacion de tipos
│   └── index.ts                   # Exportaciones
│
├── components/
│   ├── admin/                     # Componentes del panel admin
│   │   ├── [Entidad]ListView.tsx  # Vista de lista con DynamicTable
│   │   ├── [entidad]Fields.ts     # Configuracion de campos del formulario
│   │   └── ...
│   └── ecommerce/                 # Componentes del frontend cliente
│       ├── [Entidad]Card.tsx      # Card para mostrar en listas
│       ├── [Entidad]Banner.tsx    # Banner para paginas
│       └── ...
│
├── services/                      # Servicios para ecommerce
│   ├── [entidad]/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── hydrators.ts           # Transformadores de datos
│   └── featured[Entidad]s.ts      # Servicios especificos
│
├── service/                       # Servicios legacy (admin)
│   └── [entidad]/
│       ├── index.ts
│       └── types.ts
│
├── e2e/                           # Tests E2E del modulo
│   ├── index.ts                   # Runner principal
│   ├── utils.ts                   # Utilidades especificas del modulo
│   ├── data.ts                    # Datos de prueba
│   ├── cleanup.ts                 # Limpieza post-test
│   ├── fixtures/                  # Imagenes de prueba
│   ├── admin/                     # Tests del panel admin
│   │   ├── list.test.ts           # Tests de listado
│   │   ├── create.test.ts         # Tests de creacion
│   │   ├── update.test.ts         # Tests de edicion
│   │   ├── delete.test.ts         # Tests de eliminacion
│   │   └── validation.test.ts     # Tests de validaciones
│   └── ecommerce/                 # Tests del frontend cliente
│       ├── navigation.test.ts     # Tests de navegacion
│       ├── [entidad]-page.test.ts # Tests de pagina principal
│       └── not-found.test.ts      # Tests de pagina 404
│
├── testing-spec.md                # Especificacion de negocio (lo define el usuario)
└── screenshots/                   # Capturas de los tests E2E
```

---

## 2. Patron Model-Repository-Mapper

### 2.1 Repository (Acceso a Datos)

El repository se encarga UNICAMENTE del acceso a la base de datos.

```typescript
// [Entidad].repository.ts
import { executeQuery } from '@/lib/db'
import { type [Entidad]s as [Entidad]Raw } from '@/types/database'

export class [Entidad]Repository {
  public async get[Entidad]s(): Promise<[Entidad]Raw[] | null> {
    const items = await executeQuery<[Entidad]Raw[]>({
      query: 'SELECT * FROM [tabla]'
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
    data: Omit<[Entidad]Raw, 'id'>
  ): Promise<[Entidad]Raw | null> {
    const result = await executeQuery<{ insertId: number }>({
      query: 'INSERT INTO [tabla] SET ?',
      values: [data]
    })
    return await this.get[Entidad]ById(result.insertId)
  }

  public async update[Entidad](
    data: Omit<[Entidad]Raw, 'id'>,
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

### 2.2 Mapper (Transformacion de Tipos)

El mapper convierte entre tipos de base de datos (snake_case) y tipos de dominio (camelCase).

```typescript
// [Entidad].mapper.ts
import { type [Entidad]s as [Entidad]Raw } from '@/types/database'
import { type [Entidad]s as [Entidad] } from '@/types/domain'

export const [Entidad]Mapper = (data: [Entidad]Raw): [Entidad] => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug ?? undefined,
    description: data.description ?? undefined,
    imageUrl: data.image_url ?? undefined,
    // Campos SEO
    metaTitle: data.meta_title ?? undefined,
    metaDescription: data.meta_description ?? undefined,
    // Auditoria
    createdBy: data.created_by ?? undefined,
    updatedBy: data.updated_by ?? undefined,
    createdAt: data.created_at ?? undefined,
    updatedAt: data.updated_at ?? undefined
  }
}

export const [Entidad]sMapper = (data: [Entidad]Raw[] | null): [Entidad][] | undefined => {
  if (data === null) return undefined
  return data.map([Entidad]Mapper)
}
```

### 2.3 Model (Logica de Negocio)

El model orquesta repository y mapper, conteniendo la logica de negocio.

```typescript
// [Entidad].model.ts
import { type [Entidad]s as [Entidad]Raw } from '@/types/database'
import { type [Entidad]s as [Entidad] } from '@/types/domain'

import { [Entidad]Mapper, [Entidad]sMapper } from './[Entidad].mapper'
import o[Entidad]Rep from './[Entidad].repository'

export class [Entidad]Model {
  public async get[Entidad]s(): Promise<[Entidad][] | undefined> {
    const items = await o[Entidad]Rep.get[Entidad]s()
    return [Entidad]sMapper(items)
  }

  public async get[Entidad]ById(id: number): Promise<[Entidad] | undefined> {
    const item = await o[Entidad]Rep.get[Entidad]ById(id)
    if (!item) return undefined
    return [Entidad]Mapper(item)
  }

  public async get[Entidad]BySlug(slug: string): Promise<[Entidad] | undefined> {
    const item = await o[Entidad]Rep.get[Entidad]BySlug(slug)
    if (!item) return undefined
    return [Entidad]Mapper(item)
  }

  public async create[Entidad](
    data: Omit<[Entidad]Raw, 'id'>
  ): Promise<[Entidad] | undefined> {
    const created = await o[Entidad]Rep.create[Entidad](data)
    if (!created) return undefined
    return [Entidad]Mapper(created)
  }

  public async update[Entidad](
    data: Omit<[Entidad]Raw, 'id'>,
    id: number
  ): Promise<[Entidad] | undefined> {
    const updated = await o[Entidad]Rep.update[Entidad](data, id)
    if (!updated) return undefined
    return [Entidad]Mapper(updated)
  }

  public async delete[Entidad](id: number): Promise<void> {
    await o[Entidad]Rep.delete[Entidad](id)
  }
}

const [entidad]Model = new [Entidad]Model()
export default [entidad]Model
```

---

## 3. Convenciones de Base de Datos

### 3.1 Acceso a MySQL via Docker

La base de datos MySQL corre en un contenedor Docker. Usar estos comandos para interactuar con ella.

#### Conexion interactiva (entrar al cliente MySQL)

```bash
docker exec -it ajk-ecommerce mysql -uroot -p12345678 ajkecommerce
```

Una vez dentro del cliente MySQL:
```sql
-- Ver todas las tablas
SHOW TABLES;

-- Describir estructura de una tabla
DESCRIBE [tabla];

-- Ver datos de una tabla
SELECT * FROM [tabla] LIMIT 10;

-- Salir del cliente MySQL
EXIT;
```

#### Ejecutar SQL directamente (sin entrar al cliente)

Para ejecutar una instruccion SQL de forma directa desde la terminal:

```bash
# Ejecutar una consulta simple
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SELECT * FROM [tabla] LIMIT 5;"

# Ejecutar multiples instrucciones
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
  SELECT COUNT(*) FROM [tabla];
  SELECT * FROM [tabla] ORDER BY id DESC LIMIT 3;
"
```

#### Crear tabla directamente

**IMPORTANTE**: No crear archivos de migracion. Ejecutar las instrucciones SQL directamente en Docker.

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
CREATE TABLE IF NOT EXISTS \`[tabla]\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(255) UNIQUE,
  \`description\` TEXT NULL,
  \`image_url\` VARCHAR(500) NULL,
  \`meta_title\` VARCHAR(255) NULL,
  \`meta_description\` TEXT NULL,
  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  \`created_by\` INT NULL,
  \`updated_by\` INT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
"
```

#### Agregar columna a tabla existente

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
ALTER TABLE \`[tabla]\` ADD COLUMN \`nueva_columna\` VARCHAR(255) NULL AFTER \`columna_existente\`;
"
```

#### Registrar seccion en el admin

```bash
# Paso 1: Insertar la seccion
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
INSERT INTO \`sections\` (\`name\`, \`url\`, \`image\`, \`display_order\`, \`section_group\`)
VALUES ('[Nombre Seccion]', '/[url-seccion]', '[icono]', 20, 'catalog')
ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);
"

# Paso 2: Asignar a superadmin (rol id=1)
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
INSERT INTO \`roles_sections\` (\`id_rol\`, \`id_section\`)
SELECT 1, id FROM \`sections\` WHERE \`url\` = '/[url-seccion]'
ON DUPLICATE KEY UPDATE \`id_section\` = VALUES(\`id_section\`);
"
```

#### Verificar que la tabla se creo correctamente

```bash
# Ver estructura de la tabla
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE [tabla];"

# Ver si la tabla existe
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '[tabla]';"
```

### 3.2 Columnas Estandar

Todas las tablas deben tener estas columnas de auditoria:

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `id` | INT AUTO_INCREMENT | Clave primaria |
| `name` | VARCHAR(255) | Nombre del registro |
| `slug` | VARCHAR(255) UNIQUE | URL amigable (para ecommerce) |
| `description` | TEXT NULL | Descripcion |
| `image_url` | VARCHAR(500) NULL | URL de imagen |
| `meta_title` | VARCHAR(255) NULL | Titulo SEO |
| `meta_description` | TEXT NULL | Descripcion SEO |
| `created_at` | DATETIME | Fecha de creacion |
| `updated_at` | DATETIME | Fecha de actualizacion |
| `created_by` | INT NULL | ID del usuario que creo |
| `updated_by` | INT NULL | ID del usuario que actualizo |

### 3.3 Convenciones de Nombres

- **Tablas**: snake_case, plural (`payment_methods`, `shipping_zones`)
- **Columnas**: snake_case (`image_url`, `display_order`)
- **Claves foraneas**: `id_[entidad]` o `[entidad]_id`

### 3.4 Regenerar Tipos Despues de Cambios en BD

Despues de crear o modificar tablas, regenerar los tipos TypeScript:

```bash
pnpm generate
```

Esto actualiza:
- `/src/types/database/database.d.ts` - Tipos exactos de BD (snake_case)
- `/src/types/domain/domain.d.ts` - Tipos de dominio (camelCase)

---

## 4. API Routes (Next.js App Router)

### 4.1 Ubicacion

```
src/app/api/admin/[modulo]/
├── route.ts                    # GET (list), POST (create), PATCH (update), DELETE
└── [id]/
    ├── route.ts                # GET (single), PATCH (update), DELETE (single)
    └── dependencies/
        └── route.ts            # GET dependencies count (para Alert)
```

### 4.2 Patron de API Handler

```typescript
// route.ts
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

export async function POST(req: NextRequest) {
  return await apiHandler(async () => {
    const data = await req.json()

    // Validacion de campos requeridos
    if (!data.name || data.name.trim() === '') {
      return createResponse(
        { error: 'Nombre es requerido', success: false },
        400
      )
    }

    // Validacion de slug unico (si aplica)
    if (data.slug) {
      const existing = await o[Entidad].get[Entidad]BySlug(data.slug)
      if (existing) {
        return createResponse(
          { error: 'El slug ya existe', success: false },
          400
        )
      }
    }

    try {
      const userId = await getCurrentUserId()

      const item = await o[Entidad].create[Entidad]({
        ...data,
        created_at: new Date() as any,
        updated_at: new Date() as any,
        created_by: userId,
        updated_by: userId
      })

      return createResponse(
        { message: '[Entidad] creada', success: true, data: item },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function PATCH(req: NextRequest) {
  return await apiHandler(async () => {
    const { id, ...data } = await req.json()

    if (!id) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    // Validacion de campos requeridos
    if (data.name !== undefined && data.name.trim() === '') {
      return createResponse(
        { error: 'Nombre no puede estar vacio', success: false },
        400
      )
    }

    try {
      const userId = await getCurrentUserId()

      const item = await o[Entidad].update[Entidad](
        {
          ...data,
          updated_at: new Date() as any,
          updated_by: userId
        },
        Number(id)
      )

      return createResponse(
        { message: '[Entidad] actualizada', success: true, data: item },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}

export async function DELETE(req: NextRequest) {
  return await apiHandler(async () => {
    const { id }: { id: number | undefined } = await req.json()

    if (id === undefined) {
      return createResponse(
        { error: 'ID es requerido', success: false },
        400
      )
    }

    try {
      await o[Entidad].delete[Entidad](Number(id))
      return createResponse(
        { message: '[Entidad] eliminada', success: true },
        200
      )
    } catch (error: unknown) {
      return handleError(error, 400)
    }
  })
}
```

---

## 5. Componentes Compartidos del Admin

### 5.1 DynamicTable con Acciones Personalizadas

Componente principal para listas con busqueda, paginacion, ordenamiento y drag-and-drop.

```typescript
import { DynamicTable, type TableColumn } from '@/module/shared/components/Table/DynamicTable'
import { EditAction, RemoveAction } from '@/module/shared/components/Table/Actions'
import Link from 'next/link'
import { FolderPlus } from 'lucide-react'

const columns: TableColumn[] = [
  {
    key: 'displayOrder',
    label: '#',
    priority: 'high',
    sortable: true,
    width: '5%'
  },
  {
    key: 'imageUrl',
    label: 'Imagen',
    priority: 'high',
    width: '10%',
    render: (imageURL: string) => <PreviewImageList imageURL={imageURL} />
  },
  {
    key: 'name',
    label: 'Nombre',
    priority: 'high',
    sortable: true,
    searchable: true,     // IMPORTANTE: Habilita busqueda por este campo
    width: '45%'
  },
  {
    key: 'status',
    label: 'Estado',
    priority: 'high',
    sortable: true,
    render: (value: boolean) => value ? (
      <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
        Activo
      </span>
    ) : (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
        Inactivo
      </span>
    )
  }
]

<DynamicTable
  columns={columns}
  data={items}
  renderActions={(id: string) => (
    <>
      {/* Accion: Editar */}
      <Link
        href={`/admin/[modulo]/${id}`}
        className="flex items-center gap-3 rounded px-4 py-2 text-sm hover:bg-slate-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Editar
      </Link>

      {/* Accion personalizada: Agregar hijo (ejemplo) */}
      <Link
        href={`/admin/[modulo]/new?parent=${id}`}
        className="flex items-center gap-3 rounded px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
      >
        <FolderPlus size={18} strokeWidth={1} />
        Agregar sub-elemento
      </Link>

      {/* Accion: Eliminar */}
      <RemoveAction id={id} baseURL="/admin/[modulo]" />
    </>
  )}
  enableSearch          // Habilita buscador
  enablePagination      // Habilita paginacion
  enableSort            // Habilita ordenamiento por columnas
  enableReorder         // Habilita drag-and-drop
  pageSize={10}
  pageSizeOptions={[5, 10, 20, 50]}
  onReorder={handleReorder}  // Callback para guardar nuevo orden
/>
```

### 5.2 Funcion de Reordenamiento

```typescript
const handleReorder = async (
  reorderedItems: Array<Record<string, unknown>>
): Promise<void> => {
  try {
    const orderUpdates = reorderedItems.map((item, index) => ({
      id: item.id as number,
      display_order: index + 1
    }))

    await FetchCustomBody({
      data: { orders: orderUpdates },
      method: 'PUT',
      url: '/api/admin/[modulo]'
    })

    ToastSuccess('Orden actualizado correctamente')
    router.refresh()
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar'
    ToastFail(errorMessage)
  }
}
```

### 5.3 Alert (Modal de Confirmacion)

```typescript
import { Alert } from '@/module/shared/components/Alert/Alert'

<Alert
  title="Confirmar eliminacion"
  message="Esta seguro de eliminar este elemento?"
  onSuccess={() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('id')
    void handleDelete(id)
  }}
  onCancel={() => {
    router.replace('/admin/[modulo]')
  }}
  // Opcionales para mostrar dependencias
  dependenciesUrl="/api/admin/[modulo]/{id}/dependencies"
  dependenciesMap={{ variants: 'Variantes', images: 'Imagenes' }}
  blockOnDependencies={true}  // Bloquea si hay dependencias
  blockedMessage="No se puede eliminar. Primero elimina:"
/>
```

**Activacion del Alert:**
El modal se activa mediante URL params: `?action=alert&id=123`

### 5.4 Form Fields Configuration con Validaciones

```typescript
// [entidad]Fields.ts
import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

// Configuracion de imagen principal
export const [Entidad]FileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 200, height: 200 },
    max: { width: 800, height: 800 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Configuracion de banner desktop
export const [Entidad]BannerFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 1200, height: 300 },
    max: { width: 1920, height: 500 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

export const [Entidad]Fields: Field[] = [
  // ═══════════════════════════════════════════════════════════════════
  // Informacion Basica
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: {
      min: 'Nombre es requerido'   // Mensaje de validacion
    }
  },
  {
    key: 'slug',
    label: 'URL amigable (slug)',
    type: 'text',
    required: {
      min: 'Slug es requerido'
    },
    placeholder: 'ej: mi-elemento (se genera automaticamente)'
  },
  {
    key: 'description',
    label: 'Descripcion',
    type: 'textarea'
  },
  {
    key: 'show_nav',
    label: 'Mostrar en navegacion',
    type: 'select',
    selectOptions: [
      { value: '1', label: 'Si - Mostrar' },
      { value: '0', label: 'No - Ocultar' }
    ]
  },
  {
    key: 'image_url',
    label: 'Imagen (cuadrada, 200-800px)',
    type: 'file',
    multiple: false,
    required: false,
    options: [Entidad]FileOptions
  },

  // ═══════════════════════════════════════════════════════════════════
  // Banner de Pagina (para ecommerce)
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'banner_image',
    label: 'Banner Desktop (1200x300 - 1920x500)',
    type: 'file',
    multiple: false,
    required: false,
    options: [Entidad]BannerFileOptions
  },
  {
    key: 'banner_title',
    label: 'Titulo del banner',
    type: 'text',
    placeholder: 'Dejar vacio para usar el nombre'
  },
  {
    key: 'banner_cta_text',
    label: 'Texto del boton CTA',
    type: 'text',
    placeholder: 'Ej: Ver productos, Comprar ahora'
  },
  {
    key: 'banner_cta_link',
    label: 'Enlace del boton CTA',
    type: 'text',
    placeholder: 'Ej: /search?category=1'
  },

  // ═══════════════════════════════════════════════════════════════════
  // SEO
  // ═══════════════════════════════════════════════════════════════════
  {
    key: 'meta_title',
    label: 'Meta titulo',
    type: 'text',
    placeholder: 'Dejar vacio para usar el nombre'
  },
  {
    key: 'meta_description',
    label: 'Meta descripcion',
    type: 'textarea',
    placeholder: 'Descripcion para motores de busqueda (max. 160 caracteres)'
  }
]
```

---

## 6. Paginas Admin (App Router)

### 6.1 Estructura de Carpetas

```
src/app/admin/[modulo]/
├── page.tsx              # Lista principal
├── new/
│   └── page.tsx          # Formulario de creacion
├── [id]/
│   └── page.tsx          # Formulario de edicion
└── error.tsx             # Pagina de error del modulo
```

### 6.2 Pagina de Lista

```typescript
// src/app/admin/[modulo]/page.tsx
import o[Entidad] from '@/module/[modulo]/core'
import { [Entidad]ListView } from '@/module/[modulo]/components/admin/[Entidad]ListView'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'
import { PageButton } from '@/module/shared/components/Page/PageButton'
import { [Icon], Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function [Entidad]Page() {
  const items = await o[Entidad].get[Entidad]s()

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="[Entidades]" />}
        subtitle="Gestiona los [entidades] del sistema."
        breadcrumb={[{ label: '[Entidades]' }]}
      >
        <PageButton href="/admin/[modulo]/new" icon={Plus}>
          Crear [Entidad]
        </PageButton>

        <[Entidad]ListView items={items ?? []} />
      </PageUI>
    </LayoutPageAdmin>
  )
}
```

### 6.3 Pagina de Creacion con Validaciones

```typescript
// src/app/admin/[modulo]/new/page.tsx
import { [Entidad]Fields } from '@/module/[modulo]/components/admin/[entidad]Fields'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'

export default async function New[Entidad]Page() {
  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Nueva [Entidad]" />}
        subtitle="Crear una nueva [entidad]"
        breadcrumb={[
          { label: '[Entidades]', url: '/admin/[modulo]' },
          { label: 'Nueva [Entidad]' }
        ]}
      >
        <FormCreate
          api={{
            url: '/api/admin/[modulo]',
            method: 'POST',
            withFiles: true   // Si tiene campos de imagen
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

### 6.4 Pagina de Edicion

```typescript
// src/app/admin/[modulo]/[id]/page.tsx
import { [Entidad]Fields } from '@/module/[modulo]/components/admin/[entidad]Fields'
import [entidad]Service from '@/module/[modulo]/service/[entidad]'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { mergeFieldsWithData } from '@/module/shared/components/FormCreate/mergeFieldsWithData'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'
import { PageUI } from '@/module/shared/components/Page/Page'
import { PageTitle } from '@/module/shared/components/Page/PageTitle'

export const revalidate = 0 // Deshabilitar cache estatico

interface Edit[Entidad]PageProps {
  params: Promise<{ id: string }>
}

export default async function Edit[Entidad]Page({ params }: Edit[Entidad]PageProps) {
  const { id } = await params
  const result = await [entidad]Service.get[Entidad]WithAudit(Number(id))

  // Si no existe, mostrar mensaje
  if (result == null || result.[entidad] == null) {
    return (
      <LayoutPageAdmin>
        <PageUI
          title={<PageTitle title="No encontrada" />}
          breadcrumb={[{ label: '[Entidades]', url: '/admin/[modulo]' }]}
        >
          <p className="text-gray-500">La [entidad] no existe o fue eliminada.</p>
        </PageUI>
      </LayoutPageAdmin>
    )
  }

  const { [entidad], audit } = result

  // Merge de campos con datos existentes
  const fieldsWithValues = mergeFieldsWithData([Entidad]Fields, {
    ...([entidad]),
    image_url: [entidad].imageUrl || '',
    meta_title: [entidad].metaTitle || '',
    meta_description: [entidad].metaDescription || ''
  })

  return (
    <LayoutPageAdmin>
      <PageUI
        title={<PageTitle title="Editar [Entidad]" />}
        subtitle={`Editando: ${[entidad].name}`}
        breadcrumb={[
          { label: '[Entidades]', url: '/admin/[modulo]' },
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

---

## 7. Paginas de Error

### 7.1 Error del Admin (error.tsx)

```typescript
// src/app/admin/[modulo]/error.tsx
'use client'

import { ErrorPage } from '@/module/shared/components/ErrorPage'

export default function [Modulo]Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorPage
      error={error}
      reset={reset}
      backUrl="/admin/[modulo]"
      backLabel="Volver a [Entidades]"
      moduleName="[Modulo]"
    />
  )
}
```

### 7.2 Componente ErrorPage Compartido

```typescript
// Ya existe en: src/module/shared/components/ErrorPage/ErrorPage.tsx
// Props:
// - error: Error & { digest?: string }
// - reset: () => void
// - backUrl?: string (default: '/admin')
// - backLabel?: string (default: 'Volver al inicio')
// - moduleName?: string (se muestra en dev)
```

### 7.3 Not Found del Ecommerce (not-found.tsx)

```typescript
// src/app/[ruta-ecommerce]/[slug]/not-found.tsx
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import [entidad]Service from '@/module/[modulo]/service/[entidad]'
import Link from 'next/link'
import { Home, FolderOpen } from 'lucide-react'

export default async function [Entidad]NotFound() {
  // Obtener sugerencias (primeras 4 entidades)
  const items = await [entidad]Service.get[Entidad]s()
  const suggestions = items?.slice(0, 4) ?? []

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>
      <LayoutContent className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          {/* Icono y mensaje */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <FolderOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-800">
              [Entidad] no encontrada
            </h1>
            <p className="text-gray-600">
              La [entidad] que buscas no existe o ha sido eliminada.
            </p>
          </div>

          {/* Boton de accion */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-white hover:bg-secondary/90"
            >
              <Home className="h-4 w-4" />
              Ir al inicio
            </Link>
          </div>

          {/* Sugerencias */}
          {suggestions.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <p className="mb-4 text-center text-sm font-medium text-gray-700">
                Explora nuestras [entidades]
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/[ruta]/${item.slug}`}
                    className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </LayoutContent>
    </Layout>
  )
}
```

---

## 8. Paginas Ecommerce (Frontend Cliente)

### 8.1 Estructura de Carpetas

```
src/app/[ruta-ecommerce]/
├── page.tsx              # Listado principal (opcional)
└── [slug]/
    ├── page.tsx          # Pagina de detalle
    └── not-found.tsx     # Pagina 404
```

### 8.2 Pagina de Detalle con SEO

```typescript
// src/app/[ruta]/[slug]/page.tsx
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import Navigation from '@/module/shared/components/Navigation/Navigation'
import [entidad]Service from '@/module/[modulo]/service/[entidad]'
import { [Entidad]Banner } from '@/module/[modulo]/components/ecommerce/[Entidad]Banner'
import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

interface [Entidad]PageProps {
  params: Promise<{ slug: string }>
}

// Metadata dinamica para SEO
export async function generateMetadata({
  params
}: [Entidad]PageProps): Promise<Metadata> {
  const { slug } = await params
  const item = await [entidad]Service.get[Entidad]BySlug(slug)

  if (!item) {
    return { title: '[Entidad] no encontrada' }
  }

  return {
    title: item.metaTitle || `${item.name} | AJK E-commerce`,
    description: item.metaDescription || item.description || `Explora ${item.name}`
  }
}

export default async function [Entidad]Page({ params }: [Entidad]PageProps) {
  const { slug } = await params
  const item = await [entidad]Service.get[Entidad]BySlug(slug)

  // Si no existe, mostrar 404
  if (!item) {
    notFound()
  }

  return (
    <Layout>
      <Header navigationType="mini">
        <Navigation type="mini" />
      </Header>

      {/* Banner */}
      <[Entidad]Banner item={item} />

      <LayoutContent className="py-8">
        <div className="mx-auto max-w-screen-4xl px-6 lg:px-12">
          {/* Header */}
          <div className="mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
            {item.description && (
              <p className="mt-2 text-gray-600">{item.description}</p>
            )}
          </div>

          {/* Contenido */}
          {/* ... */}
        </div>
      </LayoutContent>
    </Layout>
  )
}
```

### 8.3 Componente de Listado para Homepage

```typescript
// src/module/[modulo]/components/ecommerce/[Entidad]List.tsx
import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface [Entidad] {
  id: number
  name: string
  slug: string
  imageUrl: string
  description: string
}

interface [Entidad]ListProps {
  items: [Entidad][]
}

export const [Entidad]List: React.FC<[Entidad]ListProps> = ({ items }) => {
  // No mostrar si no hay items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-4xl px-12">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-gray-900">
              Explora Nuestras [Entidades]
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Descripcion de la seccion
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/[ruta]/${item.slug}`}
              className="group border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-4 group-hover:bg-primary/10">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      width={60}
                      height={60}
                      alt={item.name}
                      className="transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <Image
                      alt={item.name}
                      src="/no-image.webp"
                      width={60}
                      height={60}
                    />
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-primary">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 9. Tests E2E

### 9.1 Requisito de Cobertura

**MINIMO 95% de cobertura** en funcionalidades del modulo.

### 9.2 Estructura de Tests

```
e2e/
├── index.ts                   # Runner principal
├── utils.ts                   # Utilidades del modulo
├── admin/
│   ├── list.test.ts           # Tests de listado
│   ├── create.test.ts         # Tests de creacion
│   ├── update.test.ts         # Tests de edicion
│   ├── delete.test.ts         # Tests de eliminacion
│   └── validation.test.ts     # Tests de validaciones de formulario
└── ecommerce/
    ├── navigation.test.ts     # Tests de navegacion
    ├── [entidad]-page.test.ts # Tests de pagina de detalle
    └── not-found.test.ts      # Tests de pagina 404
```

### 9.3 Tests de Validaciones

```typescript
// e2e/admin/validation.test.ts
import { getPage, goto, takeScreenshot, log, wait } from '../utils'

const SCREENSHOT_FOLDER = 'admin/validation'

/**
 * Test: Submit con nombre vacio
 */
export async function testNameRequired(): Promise<void> {
  const page = getPage()

  log('Testing required name validation...')

  await goto('/admin/[modulo]/new')
  await wait(1500)

  // Intentar enviar sin llenar nombre
  const submitButton = await page.$('button[type="submit"]')
  if (submitButton) {
    await submitButton.click()
  }

  await wait(1000)
  await takeScreenshot('name-required', SCREENSHOT_FOLDER)

  // Verificar mensaje de error
  const pageContent = await page.content()
  if (pageContent.includes('requerido') ||
      pageContent.includes('required') ||
      pageContent.includes('obligatorio')) {
    log('  Name required error displayed')
  } else {
    log('  Warning: No validation error found')
  }
}

/**
 * Test: Nombre solo con espacios
 */
export async function testNameSpaces(): Promise<void> {
  const page = getPage()

  log('Testing name with only spaces...')

  await goto('/admin/[modulo]/new')
  await wait(1500)

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type('   ')
  }

  const submitButton = await page.$('button[type="submit"]')
  if (submitButton) {
    await submitButton.click()
  }

  await wait(1000)

  const pageContent = await page.content()
  if (pageContent.includes('requerido') || pageContent.includes('valido')) {
    log('  Spaces-only name rejected')
  }
}

/**
 * Test: Normalizacion de slug
 */
export async function testSlugNormalization(): Promise<void> {
  const page = getPage()

  log('Testing slug normalization...')

  await goto('/admin/[modulo]/new')
  await wait(1500)

  const nameInput = await page.$('input[name="name"]')
  if (nameInput) {
    await nameInput.type('Test Item With Spaces')
  }

  await wait(500)

  // Verificar slug auto-generado
  const slugValue = await page.$eval('input[name="slug"]', (el: HTMLInputElement) => el.value)

  if (slugValue.includes('-') && !slugValue.includes(' ')) {
    log(`  Slug normalized: ${slugValue}`)
  }
}

/**
 * Run all validation tests
 */
export async function runValidationTests(): Promise<void> {
  log('=== VALIDATION TESTS ===')

  await testNameRequired()
  await testNameSpaces()
  await testSlugNormalization()

  log('=== VALIDATION TESTS COMPLETED ===')
}
```

### 9.4 Tests de Ecommerce Not Found

```typescript
// e2e/ecommerce/not-found.test.ts
import { getPage, goto, takeScreenshot, log, wait } from '../utils'

const SCREENSHOT_FOLDER = 'ecommerce/not-found'

/**
 * Test: Pagina inexistente muestra 404
 */
export async function testNotFoundPage(): Promise<void> {
  log('Testing not found page...')

  await goto('/[ruta]/xyz-elemento-inexistente-123')
  await wait(2000)
  await takeScreenshot('01-page', SCREENSHOT_FOLDER)

  const page = getPage()
  const pageContent = await page.content()

  if (pageContent.includes('no encontrada') ||
      pageContent.includes('not found') ||
      pageContent.includes('404')) {
    log('  Not found message displayed')
  } else {
    log('  Warning: 404 message not found')
  }
}

/**
 * Test: Se muestran sugerencias
 */
export async function testSuggestionsShown(): Promise<void> {
  const page = getPage()
  log('Testing suggestions...')

  const hasSuggestions = await page.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/[ruta]/"]')
    return links.length > 0
  })

  if (hasSuggestions) {
    log('  Suggestions shown')
  } else {
    log('  No suggestions found')
  }
}

/**
 * Test: Link a inicio funciona
 */
export async function testHomeLinkWorks(): Promise<void> {
  const page = getPage()
  log('Testing home link...')

  const pageContent = await page.content()

  if (pageContent.includes('inicio') ||
      pageContent.includes('Inicio') ||
      pageContent.includes('home')) {
    log('  Home link available')
  }

  // Probar click en sugerencia
  const suggestionLink = await page.$('a[href*="/[ruta]/"]')

  if (suggestionLink) {
    await suggestionLink.click()
    await wait(2000)

    const currentUrl = page.url()
    if (currentUrl.includes('/[ruta]/')) {
      log('  Suggestion link works')
    }
  }
}

export async function runNotFoundTests(): Promise<void> {
  log('=== NOT FOUND TESTS ===')

  await testNotFoundPage()
  await testSuggestionsShown()
  await testHomeLinkWorks()

  log('=== NOT FOUND TESTS COMPLETED ===')
}
```

### 9.5 Ejecutar Tests

```bash
npx tsx src/module/[modulo]/e2e/index.ts
```

---

## 10. testing-spec.md (Especificacion de Negocio)

Este archivo lo define el **usuario/Product Owner** y describe:

```markdown
# [Modulo] - Especificacion de Negocio

## Descripcion General
[Que hace este modulo y para que sirve]

## Entidades
- **[Entidad Principal]**: [Descripcion]
- **[Entidad Secundaria]**: [Descripcion]

## Reglas de Negocio
1. [Regla 1]
2. [Regla 2]
3. [Regla 3]

## Casos de Uso

### CU-01: Crear [Entidad]
- **Actor**: Administrador
- **Precondiciones**: Usuario autenticado con permisos
- **Flujo Principal**:
  1. ...
  2. ...
- **Validaciones**:
  - Nombre obligatorio, no puede estar vacio ni solo espacios
  - Slug obligatorio, debe ser unico
  - Imagen opcional, max 500KB, 200-800px

### CU-02: Listar [Entidades]
- **Funcionalidades**:
  - Busqueda por nombre
  - Ordenamiento por columnas
  - Paginacion
  - Drag-and-drop para reordenar

### CU-03: Editar [Entidad]
- **Validaciones**: Igual que crear
- **Campos de auditoria**: Mostrar quien creo/actualizo

### CU-04: Eliminar [Entidad]
- **Confirmacion**: Modal de alerta
- **Dependencias**: Mostrar si tiene elementos relacionados

### CU-05: Ver [Entidad] en Ecommerce
- **SEO**: Meta title y description dinamicos
- **404**: Pagina personalizada con sugerencias

## Criterios de Aceptacion
- [ ] CRUD completo funcionando
- [ ] Validaciones en formularios (nombre requerido, slug unico)
- [ ] Mensajes de exito/error (Toast)
- [ ] Paginacion en listas
- [ ] Busqueda por nombre
- [ ] Ordenamiento de columnas
- [ ] Drag-and-drop para reordenar
- [ ] Pagina de error 404 con sugerencias
- [ ] SEO dinamico en ecommerce
- [ ] E2E coverage >= 95%
```

---

## 11. Checklist del Agente

Antes de marcar una tarea como completada, verificar:

### Backend
- [ ] Migracion SQL creada y ejecutada
- [ ] Model/Repository/Mapper implementados
- [ ] Metodo getBySlug para ecommerce
- [ ] API Routes funcionando (POST, PATCH, DELETE)
- [ ] Validaciones en API (nombre requerido, slug unico)
- [ ] Tipos generados (`pnpm generate`)

### Frontend Admin
- [ ] Pagina de lista con DynamicTable
- [ ] Buscador funcionando
- [ ] Ordenamiento por columnas
- [ ] Acciones: Editar, Eliminar, personalizadas
- [ ] Pagina de creacion con FormCreate
- [ ] Pagina de edicion con FormCreate
- [ ] Validaciones en formularios
- [ ] Modal de confirmacion para eliminar
- [ ] Toast de exito/error
- [ ] Pagina de error (error.tsx)
- [ ] Navegacion en sidebar (si aplica)

### Frontend Ecommerce
- [ ] Pagina de detalle con SEO dinamico
- [ ] Pagina 404 con sugerencias
- [ ] Componente de listado para homepage
- [ ] Banner/Card components

### E2E Tests
- [ ] Runner principal (index.ts)
- [ ] Utils del modulo
- [ ] Tests Admin: list, create, update, delete
- [ ] Tests Admin: validation (campos requeridos)
- [ ] Tests Ecommerce: navigation, page, not-found
- [ ] Screenshots en cada paso
- [ ] Cobertura >= 95%

### Documentacion
- [ ] testing-spec.md actualizado con resultados
- [ ] Schemas Zod documentados (si aplica)
- [ ] Changelog del modulo

---

## 12. Comandos Utiles

```bash
# Desarrollo
pnpm dev

# Generar tipos de BD
pnpm generate

# Ejecutar E2E de un modulo
npx tsx src/module/[modulo]/e2e/index.ts

# Conectar a MySQL
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce

# Lint y formato
pnpm lint
pnpm format
```

---

## 13. Imports Estandar

```typescript
// Orden de imports
// 1. React/Next
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { type Metadata } from 'next'

// 2. Librerias externas
import { z } from 'zod'

// 3. Layout compartido
import { Header, Layout, LayoutContent } from '@/module/shared/components/layout'
import { LayoutPageAdmin } from '@/module/shared/components/LayoutPageAdmin'

// 4. Componentes compartidos
import { DynamicTable } from '@/module/shared/components/Table/DynamicTable'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { ErrorPage } from '@/module/shared/components/ErrorPage'

// 5. Core del modulo
import o[Entidad] from '@/module/[modulo]/core'
import { [Entidad]Fields } from './[entidad]Fields'

// 6. Utilidades
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastSuccess, ToastFail } from '@/module/shared/lib/splash'

// 7. Tipos
import type { [Entidad] } from '@/module/[modulo]/service/[entidad]/types'
```

---

## 14. Service Pattern (Ecommerce)

Los servicios encapsulan la logica de negocio para el frontend ecommerce, transformando datos del dominio a tipos de UI.

### 14.1 Estructura de Services

```
services/
├── index.ts                  # Objeto service principal
├── types.ts                  # Tipos para UI
├── hydrators.ts              # Transformadores de datos
├── [funcion1].ts             # Funciones especificas
├── [funcion2].ts
└── [subservicio]/            # Sub-servicios agrupados
    ├── index.ts
    ├── types.ts
    └── hydrators.ts
```

### 14.2 Service Object Pattern

```typescript
// services/index.ts
import { getAllItems } from './allItems'
import { getMainItems } from './mainItems'
import { getNavItems } from './navItems'

const [Entidad]Service = {
  getMainItems,
  getAllItems,
  getNavItems
}

export default [Entidad]Service
```

### 14.3 Hydrators Pattern

Los hydrators transforman tipos de dominio (de BD) a tipos de UI (para componentes).

```typescript
// services/hydrators.ts
import { type [Entidad]s as [Entidad] } from '@/types/domain'
import { type [Entidad]UI } from './types'

export const hydrate[Entidad]s = (data: [Entidad][]): [Entidad]UI[] => {
  return data.map(hydrate[Entidad])
}

export const hydrate[Entidad] = (item: [Entidad]): [Entidad]UI => ({
  id: item.id.toString(),          // Convertir a string para keys
  name: item.name,
  slug: item.slug,
  imageUrl: item.imageUrl ?? '',   // Valor por defecto
  description: item.description ?? '',
  // Campos adicionales transformados
  displayOrder: item.displayOrder ?? 0,
  isActive: item.showNav === true
})
```

### 14.4 Tipos de UI

```typescript
// services/types.ts
export interface [Entidad]UI {
  id: string
  name: string
  slug: string
  imageUrl: string
  description: string
  displayOrder: number
  isActive: boolean
}

// Tipos para componentes especificos
export interface Featured[Entidad] extends [Entidad]UI {
  productCount: number
  featured: boolean
}
```

### 14.5 Funciones de Servicio

```typescript
// services/mainItems.ts
import o[Entidad] from '@/module/[modulo]/core'
import { hydrate[Entidad]s } from './hydrators'
import { type [Entidad]UI } from './types'

export const getMain[Entidad]s = async (): Promise<[Entidad]UI[]> => {
  const items = await o[Entidad].get[Entidad]s()

  if (!items) return []

  // Filtrar solo los principales (ejemplo: sin parent)
  const mainItems = items.filter(item => !item.parentId)

  return hydrate[Entidad]s(mainItems)
}
```

---

## 15. Service Pattern (Admin con Audit)

Los servicios de admin incluyen soporte para auditoria (quien creo/actualizo).

### 15.1 Estructura Admin Service

```
service/[entidad]/
├── index.ts                  # Objeto service con exports
├── types.ts                  # Tipos incluyendo audit
├── [entidad].ts              # Funciones principales
├── search.ts                 # Busqueda avanzada (opcional)
├── hydrators.ts              # Transformadores (si aplica)
└── mock.ts                   # Datos mock (desarrollo)
```

### 15.2 Service con Audit

```typescript
// service/[entidad]/[entidad].ts
import o[Entidad] from '@/module/[modulo]/core'
import oUser from '@/backend/user'
import { type [Entidad] } from './types'

export interface [Entidad]WithAudit {
  [entidad]: [Entidad]
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const get[Entidad]s = async (): Promise<[Entidad][]> => {
  const items = await o[Entidad].get[Entidad]s()
  if (!items) return []

  return items.map(item => ({
    id: item.id.toString(),
    name: item.name,
    imageUrl: item.imageUrl ?? '',
    // ... otros campos
  }))
}

export const get[Entidad] = async (id: number): Promise<[Entidad] | null> => {
  const item = await o[Entidad].get[Entidad]ById(id)
  if (!item) return null

  return {
    id: item.id.toString(),
    name: item.name,
    // ... otros campos
  }
}

export const get[Entidad]WithAudit = async (
  id: number
): Promise<[Entidad]WithAudit | null> => {
  const item = await o[Entidad].get[Entidad]ById(id)
  if (!item) return null

  // Obtener nombres de usuarios de auditoria
  let createdByName: string | null = null
  let updatedByName: string | null = null

  if (item.createdBy) {
    const user = await oUser.getUserById(item.createdBy)
    createdByName = user?.name ?? null
  }

  if (item.updatedBy) {
    const user = await oUser.getUserById(item.updatedBy)
    updatedByName = user?.name ?? null
  }

  return {
    [entidad]: {
      id: item.id.toString(),
      name: item.name,
      slug: item.slug ?? '',
      imageUrl: item.imageUrl ?? '',
      metaTitle: item.metaTitle ?? '',
      metaDescription: item.metaDescription ?? ''
    },
    audit: {
      createdAt: item.createdAt ?? null,
      createdByName,
      updatedAt: item.updatedAt ?? null,
      updatedByName
    }
  }
}
```

### 15.3 Service Index con Types Export

```typescript
// service/[entidad]/index.ts
import { get[Entidad], get[Entidad]s, get[Entidad]WithAudit } from './[entidad]'
import { search[Entidad]s } from './search'

// Re-exportar tipos para uso externo
export type { [Entidad]WithAudit } from './[entidad]'
export type { [Entidad] } from './types'

const [Entidad]Service = {
  get[Entidad]s,
  search[Entidad]s,
  get[Entidad],
  get[Entidad]WithAudit
}

export default [Entidad]Service
```

---

## 16. Custom Hooks Pattern

Los custom hooks encapsulan logica de estado y efectos para componentes complejos.

### 16.1 Estructura de Hook

```typescript
// components/[Componente]/use-[componente].hook.ts
import { useState, useCallback, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════════
// Interfaces
// ═══════════════════════════════════════════════════════════════════

export interface Use[Componente]Props {
  items: Item[]
  defaultIndex?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  onItemChange?: (index: number) => void
}

export interface Use[Componente]Return {
  // Estado
  currentIndex: number
  isPlaying: boolean

  // Acciones
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  play: () => void
  pause: () => void

  // Computed
  canGoPrev: boolean
  canGoNext: boolean
  totalItems: number
}

// ═══════════════════════════════════════════════════════════════════
// Hook Implementation
// ═══════════════════════════════════════════════════════════════════

export const use[Componente] = ({
  items,
  defaultIndex = 0,
  autoPlay = false,
  autoPlayInterval = 5000,
  onItemChange
}: Use[Componente]Props): Use[Componente]Return => {
  // Estado
  const [currentIndex, setCurrentIndex] = useState(defaultIndex)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  // Validaciones
  const totalItems = items.length
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < totalItems - 1

  // Acciones
  const next = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex(prev => prev + 1)
    } else if (autoPlay) {
      setCurrentIndex(0) // Loop
    }
  }, [canGoNext, autoPlay])

  const prev = useCallback(() => {
    if (canGoPrev) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [canGoPrev])

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < totalItems) {
      setCurrentIndex(index)
    }
  }, [totalItems])

  const play = useCallback(() => setIsPlaying(true), [])
  const pause = useCallback(() => setIsPlaying(false), [])

  // Efectos
  useEffect(() => {
    onItemChange?.(currentIndex)
  }, [currentIndex, onItemChange])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(next, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, next, autoPlayInterval])

  return {
    currentIndex,
    isPlaying,
    next,
    prev,
    goTo,
    play,
    pause,
    canGoPrev,
    canGoNext,
    totalItems
  }
}
```

### 16.2 Uso del Hook

```typescript
// components/[Componente]/[Componente].tsx
import { use[Componente] } from './use-[componente].hook'

export const [Componente]: FC<[Componente]Props> = ({ items }) => {
  const {
    currentIndex,
    next,
    prev,
    goTo,
    canGoPrev,
    canGoNext
  } = use[Componente]({ items, autoPlay: true })

  return (
    <div>
      <button onClick={prev} disabled={!canGoPrev}>Prev</button>
      <span>{currentIndex + 1} / {items.length}</span>
      <button onClick={next} disabled={!canGoNext}>Next</button>
    </div>
  )
}
```

---

## 17. Helper Functions Pattern

Los helpers contienen funciones utilitarias, especialmente para clases CSS dinamicas.

### 17.1 Estructura de Helpers

```typescript
// components/[Componente]/[Componente].helpers.ts

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export type LayoutType = 'full' | 'compact' | 'minimal'
export type SizeType = 'sm' | 'md' | 'lg' | 'xl'

// ═══════════════════════════════════════════════════════════════════
// Base Classes
// ═══════════════════════════════════════════════════════════════════

export const baseClasses = {
  container: {
    full: 'w-full max-w-screen-2xl mx-auto',
    compact: 'w-full max-w-4xl mx-auto',
    minimal: 'w-full max-w-2xl mx-auto'
  },
  spacing: {
    sm: 'p-2 gap-2',
    md: 'p-4 gap-4',
    lg: 'p-6 gap-6',
    xl: 'p-8 gap-8'
  },
  grid: {
    cols2: 'grid grid-cols-1 md:grid-cols-2',
    cols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }
} as const

// ═══════════════════════════════════════════════════════════════════
// Helper Functions
// ═══════════════════════════════════════════════════════════════════

/**
 * Obtiene clases del contenedor segun layout
 */
export const getContainerClasses = (
  layout: LayoutType,
  className?: string
): string => {
  const classes = [baseClasses.container[layout]]

  if (className) {
    classes.push(className)
  }

  return classes.join(' ')
}

/**
 * Obtiene clases de espaciado segun tamanio
 */
export const getSpacingClasses = (
  size: SizeType,
  className?: string
): string => {
  const classes = [baseClasses.spacing[size]]

  if (className) {
    classes.push(className)
  }

  return classes.join(' ')
}

/**
 * Combina multiples clases condicionalmente
 */
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Genera clases para estados visuales
 */
export const getStateClasses = (
  isActive: boolean,
  isDisabled: boolean
): string => {
  return cn(
    'transition-all duration-200',
    isActive && 'ring-2 ring-primary',
    isDisabled && 'opacity-50 cursor-not-allowed',
    !isDisabled && 'hover:shadow-md cursor-pointer'
  )
}
```

### 17.2 Uso de Helpers

```typescript
// components/[Componente]/[Componente].tsx
import {
  getContainerClasses,
  getSpacingClasses,
  cn,
  type LayoutType
} from './[Componente].helpers'

interface Props {
  layout?: LayoutType
  className?: string
}

export const [Componente]: FC<Props> = ({
  layout = 'full',
  className
}) => {
  return (
    <div className={cn(
      getContainerClasses(layout),
      getSpacingClasses('md'),
      className
    )}>
      {/* Contenido */}
    </div>
  )
}
```

---

## 18. Index Exports Pattern

Los archivos index.ts centralizan las exportaciones de cada carpeta.

### 18.1 Core Index

```typescript
// core/index.ts
export * from './[Entidad].interfaces'  // Interfaces extendidas
export * from './[Entidad].mapper'       // Funciones de mapeo
export { default } from './[Entidad].model'  // Export default del model
export * from './[Entidad].repository'   // Repository (si necesario)
```

### 18.2 Components Index

```typescript
// components/[Componente]/index.ts
export { [Componente] } from './[Componente]'
export type { [Componente]Props } from './[Componente]'

// Exportar hook si existe
export { use[Componente] } from './use-[componente].hook'
export type {
  Use[Componente]Props,
  Use[Componente]Return
} from './use-[componente].hook'

// Exportar helpers si necesario
export * from './[Componente].helpers'
```

### 18.3 Services Index

```typescript
// services/index.ts
// Re-exportar servicio principal
export { default } from './mainService'

// Re-exportar tipos
export type { [Entidad]UI, Featured[Entidad] } from './types'

// Re-exportar sub-servicios si existen
export * from './featured[Entidad]s'
```

### 18.4 Module Root Index (Opcional)

```typescript
// src/module/[modulo]/index.ts
// Core
export { default as [Entidad]Model } from './core'
export * from './core'

// Services
export { default as [Entidad]Service } from './services'
export * from './services'

// Components (solo los publicos)
export { [Componente]List } from './components/ecommerce/[Componente]List'
```

---

## 19. Configuracion de Campos Avanzada

### 19.1 Multiples FileOptions

```typescript
// components/admin/[entidad]Fields.ts
import {
  type Field,
  type FileOptions
} from '@/module/shared/components/FormCreate/types/fileManagement'

// ═══════════════════════════════════════════════════════════════════
// Configuraciones de Imagen
// ═══════════════════════════════════════════════════════════════════

// Logo/Icono pequenio (cuadrado)
export const LogoFileOptions: FileOptions = {
  maxFileSize: 50 * 1024, // 50KB
  dimensions: {
    min: { width: 100, height: 100 },
    max: { width: 400, height: 400 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Imagen principal (cuadrada)
export const MainImageFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 200, height: 200 },
    max: { width: 800, height: 800 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Banner desktop (horizontal)
export const BannerDesktopFileOptions: FileOptions = {
  maxFileSize: 0.5 * 1024 * 1024, // 500KB
  dimensions: {
    min: { width: 1200, height: 300 },
    max: { width: 1920, height: 500 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Banner mobile (mas cuadrado)
export const BannerMobileFileOptions: FileOptions = {
  maxFileSize: 0.3 * 1024 * 1024, // 300KB
  dimensions: {
    min: { width: 600, height: 300 },
    max: { width: 800, height: 400 }
  },
  acceptImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// ═══════════════════════════════════════════════════════════════════
// Campos del Formulario
// ═══════════════════════════════════════════════════════════════════

export const [Entidad]Fields: Field[] = [
  // Seccion: Informacion Basica
  {
    key: 'name',
    label: 'Nombre',
    type: 'text',
    required: { min: 'Nombre es requerido' }
  },
  // ... mas campos

  // Seccion: Imagenes
  {
    key: 'image_url',
    label: 'Imagen principal (cuadrada, 200-800px, max 500KB)',
    type: 'file',
    multiple: false,
    options: MainImageFileOptions
  },
  {
    key: 'banner_image',
    label: 'Banner Desktop (1200x300 - 1920x500, max 500KB)',
    type: 'file',
    multiple: false,
    options: BannerDesktopFileOptions
  },
  {
    key: 'banner_image_mobile',
    label: 'Banner Mobile (600x300 - 800x400, max 300KB)',
    type: 'file',
    multiple: false,
    options: BannerMobileFileOptions
  }
]
```

---

## 20. Diferencias entre Modulos Simples y Complejos

### 20.1 Modulo Simple

Un modulo con funcionalidad basica CRUD sin componentes complejos en ecommerce.

```
[modulo]/
├── core/                     # Model-Repository-Mapper basico
├── components/
│   ├── admin/               # ListView + Fields
│   └── ecommerce/           # Un componente de listado
├── service/[entidad]/       # Servicio unico con audit
└── e2e/
    └── admin/               # Solo tests de admin
```

**Caracteristicas:**
- Un solo servicio
- Sin hydrators complejos
- Sin hooks custom
- Sin helpers
- E2E solo en admin

### 20.2 Modulo Complejo

Un modulo con multiples vistas en ecommerce y logica de negocio elaborada.

```
[modulo]/
├── core/                     # Model-Repository-Mapper con interfaces extendidas
├── components/
│   ├── admin/               # ListView + Fields complejos
│   └── ecommerce/           # Banner, Breadcrumb, etc
├── service/[entidad]/       # Servicio admin
├── services/                # Multiples servicios ecommerce
│   ├── main[Entidad]s.ts
│   ├── nav[Entidad]s.ts
│   ├── hydrators.ts
│   └── featured[Entidad]s/  # Sub-servicio agrupado
└── e2e/
    ├── admin/               # Tests completos
    └── ecommerce/           # Tests de navegacion, 404, etc
```

**Caracteristicas:**
- Multiples servicios
- Hydrators en services/
- Sub-servicios agrupados
- Componentes especializados (Breadcrumb, Banner)
- E2E en admin y ecommerce

### 20.3 Modulo con UI Compleja

Un modulo donde el componente principal de ecommerce requiere logica de estado avanzada.

```
[modulo]/
├── core/
│   └── [Entidad].interfaces.ts  # Interfaces extendidas
├── components/
│   ├── admin/
│   └── [Componente]/            # Componente complejo
│       ├── [Componente].tsx
│       ├── use-[componente].hook.ts
│       ├── [Componente].helpers.ts
│       └── [Componente].interfaces.ts
├── service/[entidad]/           # Con hydrators y audit
│   ├── hydrators.ts
│   ├── [entidad].ts
│   └── search.ts
└── e2e/
    ├── admin/
    └── ecommerce/
```

**Caracteristicas:**
- Interfaces extendidas en core
- Componentes con hook + helpers
- Hydrators en service
- Busqueda avanzada
- E2E completos

---

*Documento de patrones para modulos de AJK E-Commerce*
*Version: 1.3.0*
