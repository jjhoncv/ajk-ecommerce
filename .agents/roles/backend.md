# Rol: Backend Developer

## Responsabilidades

1. **Crear core/** - Model, Repository, Mapper
2. **Crear service/** - Logica de negocio
3. **Crear API routes** - app/api/admin/[modulo]/
4. **Notificar al Module Lead** cuando termine

---

## Archivos que Crea/Modifica

| Carpeta | Archivos |
|---------|----------|
| `src/module/[modulo]/core/` | model.ts, repository.ts, mapper.ts, index.ts |
| `src/module/[modulo]/service/` | [modulo].service.ts, index.ts |
| `src/app/api/admin/[modulo]/` | route.ts, [id]/route.ts |

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
   - src/module/brands/ (referencia)
          │
          ▼
5. Crear archivos en orden:
   a. core/model.ts
   b. core/repository.ts
   c. core/mapper.ts
   d. core/index.ts
   e. service/[modulo].service.ts
   f. service/index.ts
   g. app/api/admin/[modulo]/route.ts
   h. app/api/admin/[modulo]/[id]/route.ts
          │
          ▼
6. Commit y notificar al Module Lead
```

---

## Estructura de core/

### model.ts

```typescript
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

### repository.ts

```typescript
import { db, eq, desc, asc } from "@/lib/db";
import { [tabla] } from "@/lib/db/schema";
import type { [Entidad]Model, Create[Entidad]Input, Update[Entidad]Input } from "./model";
import { [Entidad]Mapper } from "./mapper";
import { v4 as uuidv4 } from "uuid";

export const [Entidad]Repository = {
  async findAll(): Promise<[Entidad]Model[]> {
    const results = await db
      .select()
      .from([tabla])
      .orderBy(asc([tabla].position));
    return results.map([Entidad]Mapper.toDomain);
  },

  async findById(id: string): Promise<[Entidad]Model | null> {
    const results = await db
      .select()
      .from([tabla])
      .where(eq([tabla].id, id))
      .limit(1);
    return results[0] ? [Entidad]Mapper.toDomain(results[0]) : null;
  },

  async findBySlug(slug: string): Promise<[Entidad]Model | null> {
    const results = await db
      .select()
      .from([tabla])
      .where(eq([tabla].slug, slug))
      .limit(1);
    return results[0] ? [Entidad]Mapper.toDomain(results[0]) : null;
  },

  async create(input: Create[Entidad]Input): Promise<[Entidad]Model> {
    const id = uuidv4();
    const now = new Date();
    await db.insert([tabla]).values({
      id,
      ...input,
      isActive: input.isActive ?? true,
      position: input.position ?? 0,
      createdAt: now,
      updatedAt: now,
    });
    return this.findById(id) as Promise<[Entidad]Model>;
  },

  async update(id: string, input: Update[Entidad]Input): Promise<[Entidad]Model | null> {
    await db
      .update([tabla])
      .set({ ...input, updatedAt: new Date() })
      .where(eq([tabla].id, id));
    return this.findById(id);
  },

  async delete(id: string): Promise<boolean> {
    const result = await db.delete([tabla]).where(eq([tabla].id, id));
    return result.rowsAffected > 0;
  },
};
```

### mapper.ts

```typescript
import type { [Entidad] as [Entidad]DB } from "@/types";
import type { [Entidad]Model } from "./model";

export const [Entidad]Mapper = {
  toDomain(db: [Entidad]DB): [Entidad]Model {
    return {
      id: db.id,
      name: db.name,
      slug: db.slug,
      description: db.description,
      isActive: db.isActive,
      position: db.position,
      createdAt: db.createdAt,
      updatedAt: db.updatedAt,
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

### core/index.ts

```typescript
export * from "./model";
export * from "./repository";
export * from "./mapper";
```

---

## Estructura de service/

### [modulo].service.ts

```typescript
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

### service/index.ts

```typescript
export * from "./[modulo].service";
```

---

## Estructura de API Routes

### app/api/admin/[modulo]/route.ts

```typescript
import { NextRequest, NextResponse } from "next/server";
import { [Entidad]Service } from "@/module/[modulo]/service";
import { [Entidad]Mapper } from "@/module/[modulo]/core";

export async function GET() {
  try {
    const items = await [Entidad]Service.getAll();
    return NextResponse.json(items.map([Entidad]Mapper.toResponse));
  } catch (error) {
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
    return NextResponse.json(
      { error: "Error creating [modulo]" },
      { status: 500 }
    );
  }
}
```

### app/api/admin/[modulo]/[id]/route.ts

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
    return NextResponse.json(
      { error: "Error fetching item" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Error updating item" },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: "Error deleting item" },
      { status: 500 }
    );
  }
}
```

---

## Convencion de Commits

```bash
feat([modulo]): add [modulo] model, repository and mapper
feat([modulo]): add [modulo] service
feat([modulo]): add admin API routes
```

O en un solo commit:
```bash
feat([modulo]): add core, service and API routes
```

---

## Mensaje de Completado

Al terminar, enviar al Module Lead:

```
COMPLETADO: Backend para [modulo]
COMMIT: feat([modulo]): add core, service and API routes
ARCHIVOS CREADOS:
  - src/module/[modulo]/core/model.ts
  - src/module/[modulo]/core/repository.ts
  - src/module/[modulo]/core/mapper.ts
  - src/module/[modulo]/core/index.ts
  - src/module/[modulo]/service/[modulo].service.ts
  - src/module/[modulo]/service/index.ts
  - src/app/api/admin/[modulo]/route.ts
  - src/app/api/admin/[modulo]/[id]/route.ts
NOTAS: [observaciones si las hay]
```

---

## NO Hace

- NO modifica base de datos (eso es del DBA)
- NO crea componentes React (eso es de Frontend)
- NO crea tests E2E (eso es de QA)
- NO modifica archivos de otros modulos
- NO trabaja sin types generados (esperar a DBA)
