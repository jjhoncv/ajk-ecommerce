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

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que types existen
grep -r "[Entidad]" src/types/ || echo "ERROR: Types no encontrados"

# Cambiar a branch
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 2. Crear Estructura de Carpetas

```bash
mkdir -p src/module/[modulo]/components/admin
mkdir -p src/app/admin/[modulo]/new
mkdir -p src/app/admin/[modulo]/[id]
```

### 3. Crear [Entidad]Fields.tsx

```typescript
// src/module/[modulo]/components/admin/[Entidad]Fields.tsx
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
    helperText: "URL amigable (sin espacios, minúsculas)",
    validation: {
      pattern: "^[a-z0-9-]+$",
    },
  },
  {
    name: "description",
    label: "Descripción",
    type: "textarea",
    required: false,
    placeholder: "Descripción opcional",
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
    label: "Posición",
    type: "number",
    required: false,
    defaultValue: 0,
    helperText: "Orden de aparición",
  },
];
```

### 4. Crear [Entidad]ListView.tsx

```typescript
// src/module/[modulo]/components/admin/[Entidad]ListView.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

interface [Entidad] {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  position: number;
}

export function [Entidad]ListView() {
  const [items, setItems] = useState<[Entidad][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/[modulo]");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching [modulo]:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este elemento?")) return;

    try {
      await fetch(`/api/admin/[modulo]/${id}`, { method: "DELETE" });
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay elementos. <Link href="/admin/[modulo]/new" className="text-primary">Crear uno</Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posición
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{item.slug}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {item.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/admin/[modulo]/${item.id}`}
                  className="text-primary hover:text-primary/80 mr-4"
                >
                  <Pencil className="h-4 w-4 inline" />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                  data-action="delete"
                >
                  <Trash2 className="h-4 w-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 5. Crear components/admin/index.ts

```typescript
// src/module/[modulo]/components/admin/index.ts
export * from "./[Entidad]Fields";
export * from "./[Entidad]ListView";
```

### 6. Crear Página de Lista

```typescript
// src/app/admin/[modulo]/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
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
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo [Entidad]
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow">
        <[Entidad]ListView />
      </div>
    </div>
  );
}
```

### 7. Crear Página New

```typescript
// src/app/admin/[modulo]/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { [Entidad]Fields } from "@/module/[modulo]/components/admin";

export default function New[Entidad]Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    [Entidad]Fields.forEach((field) => {
      const value = formData.get(field.name);
      if (field.type === "switch") {
        data[field.name] = value === "on";
      } else if (field.type === "number") {
        data[field.name] = value ? parseInt(value as string) : 0;
      } else {
        data[field.name] = value;
      }
    });

    try {
      const response = await fetch("/api/admin/[modulo]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear");
      }

      router.push("/admin/[modulo]");
    } catch (error) {
      setErrors({ general: "Error al crear el elemento" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nuevo [Entidad]</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {[Entidad]Fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              ) : field.type === "switch" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={field.defaultValue as boolean}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={field.defaultValue as string | number}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              {field.helperText && (
                <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-500 error-message" data-error>
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
          {errors.general && (
            <p className="mb-4 text-sm text-red-500">{errors.general}</p>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
            <Link
              href="/admin/[modulo]"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

### 8. Crear Página Edit

```typescript
// src/app/admin/[modulo]/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { [Entidad]Fields } from "@/module/[modulo]/components/admin";

interface [Entidad] {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  position: number;
}

export default function Edit[Entidad]Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<[Entidad] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/admin/[modulo]/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/[modulo]");
      });
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};

    [Entidad]Fields.forEach((field) => {
      const value = formData.get(field.name);
      if (field.type === "switch") {
        data[field.name] = value === "on";
      } else if (field.type === "number") {
        data[field.name] = value ? parseInt(value as string) : 0;
      } else {
        data[field.name] = value;
      }
    });

    try {
      const response = await fetch(`/api/admin/[modulo]/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar");
      }

      router.push("/admin/[modulo]");
    } catch (error) {
      setErrors({ general: "Error al actualizar el elemento" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-6">Cargando...</div>;
  }

  if (!item) {
    return <div className="container mx-auto py-6">No encontrado</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar [Entidad]</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          {[Entidad]Fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={(item as any)[field.name] || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              ) : field.type === "switch" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  defaultChecked={(item as any)[field.name]}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={(item as any)[field.name] || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              {field.helperText && (
                <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
              )}
            </div>
          ))}
          {errors.general && (
            <p className="mb-4 text-sm text-red-500">{errors.general}</p>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <Link
              href="/admin/[modulo]"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
```

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
  - src/module/[modulo]/components/admin/[Entidad]Fields.tsx
  - src/module/[modulo]/components/admin/[Entidad]ListView.tsx
  - src/module/[modulo]/components/admin/index.ts
  - src/app/admin/[modulo]/page.tsx
  - src/app/admin/[modulo]/new/page.tsx
  - src/app/admin/[modulo]/[id]/page.tsx

PÁGINAS:
  - /admin/[modulo]     - Lista con tabla
  - /admin/[modulo]/new - Formulario de creación
  - /admin/[modulo]/[id] - Formulario de edición

FUNCIONALIDADES:
  - Listar con estado activo/inactivo
  - Crear con validaciones
  - Editar con carga de datos
  - Eliminar con confirmación

NOTAS: [observaciones si las hay]
```

---

## Outputs
- `src/module/[modulo]/components/admin/` completo
- `src/app/admin/[modulo]/` con 3 páginas
- Commit realizado

## Next
- QA puede probar la UI

## NO Hacer
- NO modificar base de datos
- NO crear core/ o service/
- NO crear tests E2E
