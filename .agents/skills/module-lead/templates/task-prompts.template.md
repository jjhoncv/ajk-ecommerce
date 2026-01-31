# Task Prompts Templates

Templates para lanzar agentes con Task(). Reemplazar placeholders antes de usar.

## Placeholders

| Placeholder | Descripción | Ejemplo |
|-------------|-------------|---------|
| `[modulo]` | Nombre en minúsculas | `testimonials` |
| `[Modulo]` | Nombre en PascalCase | `Testimonials` |
| `[Entidad]` | Entidad singular PascalCase | `Testimonial` |
| `[entidad]` | Entidad singular minúsculas | `testimonial` |

---

## DBA

```typescript
Task({
  description: "DBA: Create [modulo] table",
  prompt: `
    TAREA: Crear tabla [modulo]
    ROL: DBA
    MODELO: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/dba/create-table.md

    COLUMNAS REQUERIDAS:
    - id: CHAR(36) PRIMARY KEY
    - name: VARCHAR(255) NOT NULL
    - slug: VARCHAR(255) NOT NULL UNIQUE
    - description: TEXT
    - is_active: BOOLEAN DEFAULT TRUE
    - display_order: INT DEFAULT 0
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP
    - [otros campos del spec]

    AL COMPLETAR:
    1. Ejecutar: pnpm generate
    2. Verificar types en src/types/
    3. Commit: feat([modulo]): DBA create table
  `,
  subagent_type: "general-purpose"
})
```

---

## Backend Admin

```typescript
Task({
  description: "Backend: Create [modulo] core and API",
  prompt: `
    TAREA: Crear backend para [modulo]
    ROL: Backend
    MODELO: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/backend/create-module.md

    ARCHIVOS A CREAR:
    - src/module/[modulo]/core/[Entidad].model.ts
    - src/module/[modulo]/core/[Entidad].repository.ts
    - src/module/[modulo]/core/[Entidad].mapper.ts
    - src/module/[modulo]/core/index.ts
    - src/module/[modulo]/service/[entidad]/[entidad].service.ts
    - src/module/[modulo]/service/[entidad]/index.ts
    - src/app/api/admin/[modulo]/route.ts
    - src/app/api/admin/[modulo]/[id]/route.ts

    AL COMPLETAR: Commit con feat([modulo]): BACKEND add core and API
  `,
  subagent_type: "general-purpose"
})
```

---

## Frontend Admin

```typescript
Task({
  description: "Frontend: Create [modulo] admin UI",
  prompt: `
    TAREA: Crear frontend admin para [modulo]
    ROL: Frontend
    MODELO: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/frontend/create-admin.md

    ARCHIVOS A CREAR:
    - src/module/[modulo]/components/admin/[Entidad]Fields.tsx
    - src/module/[modulo]/components/admin/[Entidad]ListView.tsx
    - src/module/[modulo]/components/admin/index.ts
    - src/app/admin/[modulo]/page.tsx
    - src/app/admin/[modulo]/new/page.tsx
    - src/app/admin/[modulo]/[id]/page.tsx

    AL COMPLETAR: Commit con feat([modulo]): FRONTEND add admin components
  `,
  subagent_type: "general-purpose"
})
```

---

## Backend Ecommerce

```typescript
Task({
  description: "Backend: Create [modulo] ecommerce services",
  prompt: `
    TAREA: Crear backend ecommerce para [modulo]
    ROL: Backend
    MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/backend/create-ecommerce.md

    ARCHIVOS A CREAR:
    - src/module/[modulo]/services/types.ts
    - src/module/[modulo]/services/hydrators.ts
    - src/module/[modulo]/services/[modulo].ts
    - src/module/[modulo]/services/index.ts

    FUNCIONES REQUERIDAS:
    - get[Entidad]s() - Todos los items
    - getActive[Entidad]s() - Solo activos
    - getFeatured[Entidad]s(limit) - Destacados
    - get[Entidad]BySlug(slug) - Por slug

    NOTA: NO crear APIs REST - usar SSR
    AL COMPLETAR: Commit con feat([modulo]): BACKEND add ecommerce services
  `,
  subagent_type: "general-purpose"
})
```

---

## Frontend Ecommerce

```typescript
Task({
  description: "Frontend: Create [modulo] ecommerce UI",
  prompt: `
    TAREA: Crear frontend ecommerce para [modulo]
    ROL: Frontend
    MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/frontend/create-ecommerce.md

    COMPONENTES A CREAR:
    - src/module/[modulo]/components/ecommerce/[Entidad]Grid.tsx
    - src/module/[modulo]/components/ecommerce/Featured[Entidad]s.tsx
    - src/module/[modulo]/components/ecommerce/[Entidad]Detail.tsx
    - src/module/[modulo]/components/ecommerce/index.ts

    PÁGINAS A CREAR:
    - src/app/[modulo]/page.tsx - Listado
    - src/app/[modulo]/[slug]/page.tsx - Detalle
    - src/app/[modulo]/[slug]/not-found.tsx - 404

    NOTA: Usar SSR - NO fetch a APIs
    AL COMPLETAR: Commit con feat([modulo]): FRONTEND add ecommerce components
  `,
  subagent_type: "general-purpose"
})
```

---

## QA Admin

```typescript
Task({
  description: "QA: Create [modulo] admin E2E tests",
  prompt: `
    TAREA: Crear E2E tests ADMIN para [modulo]
    ROL: QA
    MODELO: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/qa/create-e2e.md

    USAR TEMPLATES: .agents/skills/qa/templates/

    IMPORTANTE: Verificar que servidor está corriendo (curl localhost:3000)

    AL COMPLETAR:
    1. Ejecutar: npx tsx src/module/[modulo]/e2e/index.ts
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/
    3. NO hacer commit - esperar validación de Module Lead
  `,
  subagent_type: "general-purpose"
})
```

---

## QA Ecommerce Etapa 1 (Mocks)

```typescript
Task({
  description: "QA: Validate [modulo] ecommerce UI (mocks) - Stage 1",
  prompt: `
    TAREA: Validar E2E Ecommerce ETAPA 1 (con mocks)
    ROL: QA
    MÓDULO: [modulo]
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/qa/create-ecommerce-e2e.md

    ETAPA: 1 de 2 (validación con datos mock)

    CASOS A PROBAR:
    - TC-E01: Homepage section (si aplica)
    - TC-E02: List page - diseño y layout
    - TC-E03: Cards info - estructura visual
    - TC-E04: Navigation to detail
    - TC-E05: Detail content - diseño
    - TC-E06: 404 page
    - TC-E07: Responsive mobile

    IMPORTANTE:
    - Los datos son MOCKS (no reales)
    - Validar DISEÑO y LAYOUT, no datos específicos

    AL COMPLETAR:
    1. Ejecutar tests
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/ecommerce/
    3. Notificar: "ETAPA 1 - UI con mocks lista para validación"
  `,
  subagent_type: "general-purpose"
})
```

---

## QA Ecommerce Etapa 2 (Datos Reales)

```typescript
Task({
  description: "QA: Validate [modulo] ecommerce with real data - Stage 2",
  prompt: `
    TAREA: Validar E2E Ecommerce ETAPA 2 (datos reales)
    ROL: QA
    MÓDULO: [modulo]
    BRANCH: feature/[modulo]

    ETAPA: 2 de 2 (validación con datos reales)

    VERIFICAR:
    - Datos del Admin se muestran correctamente
    - Imágenes cargan (si hay campo imagen)
    - Links funcionan
    - No hay errores de consola
    - Datos reales corresponden al modelo de negocio

    PREREQUISITO: Datos deben existir en Admin

    AL COMPLETAR:
    1. Ejecutar: npx tsx src/module/[modulo]/e2e/index-ecommerce.ts
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/ecommerce/
    3. Notificar: "ETAPA 2 - UI con datos reales lista para validación"
  `,
  subagent_type: "general-purpose"
})
```

---

## Integrador

```typescript
Task({
  description: "Integrator: Connect [modulo] ecommerce with real backend",
  prompt: `
    TAREA: Integrar ecommerce con backend real
    ROL: Integrator
    MÓDULO: [modulo]
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/integrator/connect-ecommerce.md

    PREREQUISITOS CUMPLIDOS:
    ✅ Admin UI aprobado (>= 90%)
    ✅ Ecommerce UI Etapa 1 aprobado (mocks)

    TU TRABAJO:
    1. Comparar tipos MOCK vs tipos REALES del backend
    2. Si hay diferencias → Notificar a Frontend
    3. Reemplazar mocks con calls a services reales
    4. Solicitar validación QA Etapa 2

    IMPORTANTE:
    - Backend es FUENTE DE VERDAD
    - Si tipos cambiaron, Frontend debe ajustar
  `,
  subagent_type: "general-purpose"
})
```
