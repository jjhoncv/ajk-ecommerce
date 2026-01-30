# Skill: Asignar Tareas al Equipo

## Rol
Module Lead

## Trigger
Después de `start-module.md`

## Inputs
- `.agents/specs/[modulo]-testing-spec.md`
- Tareas planificadas

---

## 🔓 AUTONOMÍA DE AGENTES

**Los agentes tienen AUTONOMÍA TOTAL** - no piden permiso para crear/editar archivos.

Al lanzar cada agente con Task tool, usar estos `allowed_tools`:

```typescript
// DBA
allowed_tools: ["Read", "Glob", "Grep", "Bash"]

// Backend
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]

// Frontend
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]

// QA
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
```

Esto permite que trabajen sin interrupciones.

---

## ⚠️ IMPORTANTE: Verificar Sección Ecommerce del Spec

**ANTES DE ASIGNAR TAREAS**, revisar el spec:

```markdown
## Ecommerce
### Estado
- **ecommerceEnabled**: [true/false]  ← ¡VERIFICAR!
```

Si `ecommerceEnabled: true`:
- Hay tareas adicionales para Backend, Frontend y QA
- Ver secciones 3b, 4b, 5b de este documento

Si `ecommerceEnabled: false`:
- Solo asignar tareas Admin (secciones 3, 4, 5)

---

## Steps

### 1. Asignar a DBA (Primero)

Lanzar agente con Task tool:

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
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Glob", "Grep", "Bash"]
})
```

### 2. Esperar Completado de DBA

Cuando DBA notifica completado:
- Verificar que types existen en `src/types/`
- Actualizar status: `[x] DBA`
- Actualizar porcentaje: `25%`

### 3. Asignar a Backend y Frontend (Paralelo)

Lanzar AMBOS agentes en paralelo con Task tool:

**Backend:**

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
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

**Frontend:**

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
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

### 4. Esperar Backend y Frontend (Admin)

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar status: `[x] Backend Admin`, `[x] Frontend Admin`
- Actualizar porcentaje: `50%` (si hay ecommerce) o `75%` (si solo admin)

---

## ECOMMERCE (Solo si ecommerceEnabled: true)

### 3b. Asignar Backend Ecommerce (Después de Backend Admin)

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
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

### 4b. Asignar Frontend Ecommerce (Después de Backend Ecommerce)

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
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

### Esperar Backend y Frontend Ecommerce

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar porcentaje: `75%`

---

### 5. Asignar a QA - Admin (Después de Frontend Admin)

```typescript
Task({
  description: "QA: Create [modulo] admin E2E tests",
  prompt: `
    TAREA: Crear E2E tests ADMIN para [modulo]
    ROL: QA
    MODELO: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/qa/create-e2e.md

    ARCHIVOS A CREAR:
    - src/module/[modulo]/e2e/admin/01-crud.ts
    - src/module/[modulo]/e2e/admin/02-validations.ts
    - src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
    - src/module/[modulo]/e2e/data-admin.ts
    - src/module/[modulo]/e2e/utils.ts
    - src/module/[modulo]/e2e/index-admin.ts

    IMPORTANTE: Verificar que servidor está corriendo (curl localhost:3000)

    AL COMPLETAR:
    1. Ejecutar: npx tsx src/module/[modulo]/e2e/index-admin.ts
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/admin/
    3. NO hacer commit - esperar validación de Module Lead
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

### 5b. Asignar a QA - Ecommerce (Solo si ecommerceEnabled: true)

```typescript
Task({
  description: "QA: Create [modulo] ecommerce E2E tests",
  prompt: `
    TAREA: Crear E2E tests ECOMMERCE para [modulo]
    ROL: QA
    MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
    BRANCH: feature/[modulo]
    SKILL: .agents/skills/qa/create-ecommerce-e2e.md

    ARCHIVOS A CREAR:
    - src/module/[modulo]/e2e/ecommerce/01-public.ts
    - src/module/[modulo]/e2e/data-ecommerce.ts
    - src/module/[modulo]/e2e/index-ecommerce.ts

    CASOS A PROBAR:
    - TC-E01: Homepage section
    - TC-E02: List page
    - TC-E03: Cards info
    - TC-E04: Navigation to detail
    - TC-E05: Detail content
    - TC-E06: 404 page
    - TC-E07: Responsive mobile

    NOTA: NO hacer login - páginas públicas

    AL COMPLETAR:
    1. Ejecutar: npx tsx src/module/[modulo]/e2e/index-ecommerce.ts
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/ecommerce/
    3. NO hacer commit - esperar validación
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
})
```

### 6. Esperar QA - Recibir Screenshots

Cuando QA notifica que ejecutó tests:

```
TESTS EJECUTADOS: [modulo]
RESULTADOS: X passed, Y failed
SCREENSHOTS: src/module/[modulo]/e2e/screenshots/
```

**IMPORTANTE: QA NO hace commit aún. Module Lead debe validar primero.**

### 7. Validar Screenshots vs Modelo de Negocio

Ejecutar: `.agents/skills/module-lead/validate-qa-screenshots.md`

1. Leer cada screenshot (las imágenes son soportadas)
2. Comparar con `.agents/specs/[modulo]-testing-spec.md`
3. Evaluar cumplimiento por screenshot:
   - ¿UI corresponde al modelo de negocio?
   - ¿Campos correctos?
   - ¿Flujo correcto?
   - ¿Validaciones funcionan?

### 8. Decisión de Aprobación

#### Si cumplimiento >= 90%:

```
AUTORIZACIÓN QA COMMIT
======================
MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (>= 90%)
ESTADO: ✅ APROBADO

QA: Proceder con commit
```

- QA hace commit
- Actualizar status: `[x] QA`
- Actualizar porcentaje: `100%`
- Ejecutar `propose-release.md`

#### Si cumplimiento < 90%:

```
RECHAZO - ITERACIÓN REQUERIDA
=============================
MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (< 90%)

PROBLEMAS DETECTADOS:
1. Screenshot [X]: [problema] → [Responsable] corrige
2. Screenshot [Y]: [problema] → [Responsable] corrige
```

Asignar correcciones:
- Si es UI/diseño → Frontend
- Si es lógica/datos → Backend
- Si es estructura BD → DBA

Después de correcciones:
- QA re-ejecuta tests
- Volver a paso 7 (validar screenshots)

**Este ciclo se repite hasta lograr >= 90%**

### 9. Calcular Cumplimiento Final

Solo cuando >= 90% aprobado:

```
CHECKLIST DE CUMPLIMIENTO:

Admin CRUD:
[x] Sidebar visible - screenshot validado
[x] Listar - test passed, screenshot validado
[x] Crear - test passed, screenshot validado
[x] Editar - test passed, screenshot validado
[x] Eliminar - test passed, screenshot validado
[x] Validaciones - test passed, screenshot validado

Subtotal Admin: 6/6 = 100%

Ecommerce (si ecommerceEnabled: true):
[x] Sección en homepage - screenshot validado
[x] Página de listado - screenshot validado
[x] Cards con información - screenshot validado
[x] Página de detalle - screenshot validado
[x] Página 404 - screenshot validado
[x] Responsive mobile - screenshot validado

Subtotal Ecommerce: 6/6 = 100%

Total: [X]/[Y] = [Z]%
Iteraciones: [N]
```

Ejecutar `propose-release.md`

---

## Outputs
- Tareas asignadas a cada agente
- `.agents/active/[modulo]-status.md` actualizado
- Progreso monitoreado

## Next
- Monitorear completados
- Resolver bloqueadores
- Cuando todo complete: `propose-release.md`
