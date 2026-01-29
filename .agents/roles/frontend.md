# Rol: Frontend Developer

## Responsabilidades

1. **Crear components/admin/** - Configuracion de campos, vistas
2. **Crear pages admin/** - List, New, Edit
3. **Integrar con API** - Hooks y fetch
4. **Notificar al Module Lead** cuando termine

---

## Archivos que Crea/Modifica

| Carpeta | Archivos |
|---------|----------|
| `src/module/[modulo]/components/admin/` | [Entidad]Fields.tsx, [Entidad]ListView.tsx, index.ts |
| `src/app/admin/[modulo]/` | page.tsx, new/page.tsx, [id]/page.tsx |

---

## Flujo de Trabajo

### Al recibir tarea

```
1. Module Lead asigna tarea
          │
          ▼
2. Verificar que DBA completo:
   - Types deben existir en src/types/
          │
          ▼
3. Leer modelo de negocio:
   - .agents/specs/[modulo]-testing-spec.md
          │
          ▼
4. Revisar patrones existentes:
   - docs/module-template.md
   - src/module/brands/components/admin/ (referencia)
   - src/app/admin/brands/ (referencia)
          │
          ▼
5. Crear archivos en orden:
   a. components/admin/[Entidad]Fields.tsx
   b. components/admin/[Entidad]ListView.tsx
   c. components/admin/index.ts
   d. app/admin/[modulo]/page.tsx (list)
   e. app/admin/[modulo]/new/page.tsx
   f. app/admin/[modulo]/[id]/page.tsx (edit)
          │
          ▼
6. Commit y notificar al Module Lead
```

---

## Estructura de components/admin/

### [Entidad]Fields.tsx

```typescript
import { FieldConfig } from "@/module/shared/types/field-config";

export const [Entidad]Fields: FieldConfig[] = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
    required: true,
    placeholder: "Ingrese el nombre",
    validation: {
      minLength: 2,
      maxLength: 100,
    },
  },
  {
    name: "slug",
    label: "Slug",
    type: "text",
    required: true,
    placeholder: "nombre-en-url",
    helperText: "URL amigable (sin espacios, minusculas)",
    validation: {
      pattern: "^[a-z0-9-]+$",
    },
  },
  {
    name: "description",
    label: "Descripcion",
    type: "textarea",
    required: false,
    placeholder: "Descripcion opcional",
  },
  {
    name: "isActive",
    label: "Activo",
    type: "switch",
    required: false,
    defaultValue: true,
  },
  {
    name: "position",
    label: "Posicion",
    type: "number",
    required: false,
    defaultValue: 0,
    helperText: "Orden de aparicion",
  },
];
```

### [Entidad]ListView.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/module/shared/components/admin/DataTable";
import { ColumnDef } from "@/module/shared/types/table";

interface [Entidad] {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  position: number;
}

const columns: ColumnDef<[Entidad]>[] = [
  {
    key: "name",
    header: "Nombre",
    sortable: true,
  },
  {
    key: "slug",
    header: "Slug",
  },
  {
    key: "isActive",
    header: "Estado",
    render: (value) => (
      <span className={value ? "text-green-600" : "text-gray-400"}>
        {value ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    key: "position",
    header: "Posicion",
    sortable: true,
  },
];

export function [Entidad]ListView() {
  const [items, setItems] = useState<[Entidad][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/[modulo]")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este elemento?")) return;

    await fetch(`/api/admin/[modulo]/${id}`, { method: "DELETE" });
    setItems(items.filter((item) => item.id !== id));
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <DataTable
      data={items}
      columns={columns}
      onEdit={(item) => `/admin/[modulo]/${item.id}`}
      onDelete={handleDelete}
    />
  );
}
```

### components/admin/index.ts

```typescript
export * from "./[Entidad]Fields";
export * from "./[Entidad]ListView";
```

---

## Estructura de Pages Admin

### app/admin/[modulo]/page.tsx (List)

```typescript
import { Metadata } from "next";
import Link from "next/link";
import { [Entidad]ListView } from "@/module/[modulo]/components/admin";

export const metadata: Metadata = {
  title: "[Entidad]s | Admin",
};

export default function [Entidad]sPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">[Entidad]s</h1>
        <Link
          href="/admin/[modulo]/new"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Nuevo [Entidad]
        </Link>
      </div>
      <[Entidad]ListView />
    </div>
  );
}
```

### app/admin/[modulo]/new/page.tsx

```typescript
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { DynamicForm } from "@/module/shared/components/admin/DynamicForm";
import { [Entidad]Fields } from "@/module/[modulo]/components/admin";

export const metadata: Metadata = {
  title: "Nuevo [Entidad] | Admin",
};

async function create[Entidad](formData: FormData) {
  "use server";

  const data = Object.fromEntries(formData);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/[modulo]`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al crear");
  }

  redirect("/admin/[modulo]");
}

export default function New[Entidad]Page() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nuevo [Entidad]</h1>
      <DynamicForm
        fields={[Entidad]Fields}
        action={create[Entidad]}
        cancelHref="/admin/[modulo]"
      />
    </div>
  );
}
```

### app/admin/[modulo]/[id]/page.tsx (Edit)

```typescript
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DynamicForm } from "@/module/shared/components/admin/DynamicForm";
import { [Entidad]Fields } from "@/module/[modulo]/components/admin";

export const metadata: Metadata = {
  title: "Editar [Entidad] | Admin",
};

async function get[Entidad](id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/[modulo]/${id}`,
    { cache: "no-store" }
  );

  if (!response.ok) return null;
  return response.json();
}

async function update[Entidad](id: string, formData: FormData) {
  "use server";

  const data = Object.fromEntries(formData);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/[modulo]/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar");
  }

  redirect("/admin/[modulo]");
}

export default async function Edit[Entidad]Page({
  params,
}: {
  params: { id: string };
}) {
  const item = await get[Entidad](params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar [Entidad]</h1>
      <DynamicForm
        fields={[Entidad]Fields}
        initialData={item}
        action={update[Entidad].bind(null, params.id)}
        cancelHref="/admin/[modulo]"
      />
    </div>
  );
}
```

---

## Convencion de Commits

```bash
feat([modulo]): add [Entidad]Fields form configuration
feat([modulo]): add [Entidad]ListView component
feat([modulo]): add admin pages (list, new, edit)
```

O en un solo commit:
```bash
feat([modulo]): add admin components and pages
```

---

## Mensaje de Completado

Al terminar, enviar al Module Lead:

```
COMPLETADO: Frontend admin para [modulo]
COMMIT: feat([modulo]): add admin components and pages
ARCHIVOS CREADOS:
  - src/module/[modulo]/components/admin/[Entidad]Fields.tsx
  - src/module/[modulo]/components/admin/[Entidad]ListView.tsx
  - src/module/[modulo]/components/admin/index.ts
  - src/app/admin/[modulo]/page.tsx
  - src/app/admin/[modulo]/new/page.tsx
  - src/app/admin/[modulo]/[id]/page.tsx
NOTAS: [observaciones si las hay]
```

---

## NO Hace

- NO modifica base de datos (eso es del DBA)
- NO crea core/ o service/ (eso es de Backend)
- NO crea tests E2E (eso es de QA)
- NO modifica archivos de otros modulos
- NO trabaja sin types generados (esperar a DBA)
