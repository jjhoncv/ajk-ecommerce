# Skill: Crear Backend del Módulo

## Rol
Backend

## Trigger
Module Lead asigna tarea de crear backend (después de DBA)

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
mkdir -p src/module/[modulo]/core
mkdir -p src/module/[modulo]/service
```

### 3. Crear core/model.ts

```typescript
// src/module/[modulo]/core/model.ts
import type { [Entidad] as [Entidad]DB } from "@/types";

export interface [Entidad]Model {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Create[Entidad]Input {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  position?: number;
}

export interface Update[Entidad]Input {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  position?: number;
}
```

### 4. Crear core/mapper.ts

```typescript
// src/module/[modulo]/core/mapper.ts
import type { [Entidad] as [Entidad]DB } from "@/types";
import type { [Entidad]Model } from "./model";

export const [Entidad]Mapper = {
  toDomain(db: [Entidad]DB): [Entidad]Model {
    return {
      id: db.id,
      name: db.name,
      slug: db.slug,
      description: db.description,
      isActive: db.is_active,
      position: db.position,
      createdAt: new Date(db.created_at),
      updatedAt: new Date(db.updated_at),
    };
  },

  toResponse(model: [Entidad]Model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      description: model.description,
      isActive: model.isActive,
      position: model.position,
    };
  },
};
```

### 5. Crear core/repository.ts

```typescript
// src/module/[modulo]/core/repository.ts
import { executeQuery } from "@/lib/db";
import type { [Entidad] as [Entidad]DB } from "@/types";
import type { [Entidad]Model, Create[Entidad]Input, Update[Entidad]Input } from "./model";
import { [Entidad]Mapper } from "./mapper";
import { v4 as uuidv4 } from "uuid";

export const [Entidad]Repository = {
  async findAll(): Promise<[Entidad]Model[]> {
    const results = await executeQuery<[Entidad]DB[]>({
      query: "SELECT * FROM [tabla] ORDER BY position ASC",
    });
    return results.map([Entidad]Mapper.toDomain);
  },

  async findById(id: string): Promise<[Entidad]Model | null> {
    const results = await executeQuery<[Entidad]DB[]>({
      query: "SELECT * FROM [tabla] WHERE id = ? LIMIT 1",
      values: [id],
    });
    return results[0] ? [Entidad]Mapper.toDomain(results[0]) : null;
  },

  async findBySlug(slug: string): Promise<[Entidad]Model | null> {
    const results = await executeQuery<[Entidad]DB[]>({
      query: "SELECT * FROM [tabla] WHERE slug = ? LIMIT 1",
      values: [slug],
    });
    return results[0] ? [Entidad]Mapper.toDomain(results[0]) : null;
  },

  async create(input: Create[Entidad]Input): Promise<[Entidad]Model> {
    const id = uuidv4();
    await executeQuery({
      query: `
        INSERT INTO [tabla] (id, name, slug, description, is_active, position)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      values: [
        id,
        input.name,
        input.slug,
        input.description || null,
        input.isActive ?? true,
        input.position ?? 0,
      ],
    });
    return this.findById(id) as Promise<[Entidad]Model>;
  },

  async update(id: string, input: Update[Entidad]Input): Promise<[Entidad]Model | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      fields.push("name = ?");
      values.push(input.name);
    }
    if (input.slug !== undefined) {
      fields.push("slug = ?");
      values.push(input.slug);
    }
    if (input.description !== undefined) {
      fields.push("description = ?");
      values.push(input.description);
    }
    if (input.isActive !== undefined) {
      fields.push("is_active = ?");
      values.push(input.isActive);
    }
    if (input.position !== undefined) {
      fields.push("position = ?");
      values.push(input.position);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await executeQuery({
      query: `UPDATE [tabla] SET ${fields.join(", ")} WHERE id = ?`,
      values,
    });
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await executeQuery<{ affectedRows: number }>({
      query: "DELETE FROM [tabla] WHERE id = ?",
      values: [id],
    });
    return result.affectedRows > 0;
  },
};
```

### 6. Crear core/index.ts

```typescript
// src/module/[modulo]/core/index.ts
export * from "./model";
export * from "./repository";
export * from "./mapper";
```

### 7. Crear service/[modulo].service.ts

```typescript
// src/module/[modulo]/service/[modulo].service.ts
import { [Entidad]Repository } from "../core";
import type { Create[Entidad]Input, Update[Entidad]Input } from "../core";

export const [Entidad]Service = {
  async getAll() {
    return [Entidad]Repository.findAll();
  },

  async getById(id: string) {
    return [Entidad]Repository.findById(id);
  },

  async getBySlug(slug: string) {
    return [Entidad]Repository.findBySlug(slug);
  },

  async create(input: Create[Entidad]Input) {
    return [Entidad]Repository.create(input);
  },

  async update(id: string, input: Update[Entidad]Input) {
    return [Entidad]Repository.update(id, input);
  },

  async delete(id: string) {
    return [Entidad]Repository.delete(id);
  },
};
```

### 8. Crear service/index.ts

```typescript
// src/module/[modulo]/service/index.ts
export * from "./[modulo].service";
```

### 9. Crear API Routes

```bash
mkdir -p src/app/api/admin/[modulo]/[id]
```

**src/app/api/admin/[modulo]/route.ts:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { [Entidad]Service } from "@/module/[modulo]/service";
import { [Entidad]Mapper } from "@/module/[modulo]/core";

export async function GET() {
  try {
    const items = await [Entidad]Service.getAll();
    return NextResponse.json(items.map([Entidad]Mapper.toResponse));
  } catch (error) {
    console.error("Error fetching [modulo]:", error);
    return NextResponse.json(
      { error: "Error fetching [modulo]" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await [Entidad]Service.create(body);
    return NextResponse.json([Entidad]Mapper.toResponse(item), { status: 201 });
  } catch (error) {
    console.error("Error creating [modulo]:", error);
    return NextResponse.json(
      { error: "Error creating [modulo]" },
      { status: 500 }
    );
  }
}
```

**src/app/api/admin/[modulo]/[id]/route.ts:**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { [Entidad]Service } from "@/module/[modulo]/service";
import { [Entidad]Mapper } from "@/module/[modulo]/core";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await [Entidad]Service.getById(params.id);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json([Entidad]Mapper.toResponse(item));
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json({ error: "Error fetching item" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const item = await [Entidad]Service.update(params.id, body);
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json([Entidad]Mapper.toResponse(item));
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await [Entidad]Service.delete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
```

### 10. Commit

```bash
git add src/module/[modulo]/core/
git add src/module/[modulo]/service/
git add src/app/api/admin/[modulo]/

git commit -m "feat([modulo]): add core, service and API routes"
git push origin feature/[modulo]
```

### 11. Notificar al Module Lead

```
COMPLETADO: Backend para [modulo]
COMMIT: feat([modulo]): add core, service and API routes

ARCHIVOS CREADOS:
  - src/module/[modulo]/core/model.ts
  - src/module/[modulo]/core/mapper.ts
  - src/module/[modulo]/core/repository.ts
  - src/module/[modulo]/core/index.ts
  - src/module/[modulo]/service/[modulo].service.ts
  - src/module/[modulo]/service/index.ts
  - src/app/api/admin/[modulo]/route.ts
  - src/app/api/admin/[modulo]/[id]/route.ts

API ENDPOINTS:
  - GET    /api/admin/[modulo]      - Listar todos
  - POST   /api/admin/[modulo]      - Crear nuevo
  - GET    /api/admin/[modulo]/[id] - Obtener por ID
  - PUT    /api/admin/[modulo]/[id] - Actualizar
  - DELETE /api/admin/[modulo]/[id] - Eliminar

NOTAS: [observaciones si las hay]
```

---

## Outputs
- `src/module/[modulo]/core/` completo
- `src/module/[modulo]/service/` completo
- `src/app/api/admin/[modulo]/` con CRUD
- Commit realizado

## Next
- Frontend puede usar la API
- QA puede probar endpoints

## NO Hacer
- NO modificar base de datos
- NO crear componentes React
- NO crear tests E2E
