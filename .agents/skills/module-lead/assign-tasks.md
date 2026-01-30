# Skill: Asignar Tareas al Equipo

## Rol
Module Lead

## Trigger
Después de `start-module.md`

## Inputs
- `.agents/specs/[modulo]-testing-spec.md`
- Tareas planificadas

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

```
TAREA: Crear tabla [modulo]
ROL: DBA
MODELO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]

COLUMNAS REQUERIDAS:
- id: CHAR(36) PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- slug: VARCHAR(255) NOT NULL UNIQUE
- description: TEXT
- is_active: BOOLEAN DEFAULT TRUE
- position: INT DEFAULT 0
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- [otros campos del spec]

AL COMPLETAR:
1. Ejecutar: pnpm generate
2. Verificar types en src/types/
3. Commit: feat([modulo]): create [modulo] table
4. Notificarme

SKILL: .agents/skills/dba/create-table.md
```

### 2. Esperar Completado de DBA

Cuando DBA notifica completado:
- Verificar que types existen en `src/types/`
- Actualizar status: `[x] DBA`
- Actualizar porcentaje: `25%`

### 3. Asignar a Backend y Frontend (Paralelo)

**A Backend:**

```
TAREA: Crear backend para [modulo]
ROL: Backend
MODELO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/core/model.ts
- src/module/[modulo]/core/repository.ts
- src/module/[modulo]/core/mapper.ts
- src/module/[modulo]/core/index.ts
- src/module/[modulo]/service/[modulo].service.ts
- src/module/[modulo]/service/index.ts
- src/app/api/admin/[modulo]/route.ts
- src/app/api/admin/[modulo]/[id]/route.ts

DEPENDENCIA: Types generados por DBA (ya listos)
REFERENCIA: docs/module-template.md
SKILL: .agents/skills/backend/create-module.md
```

**A Frontend:**

```
TAREA: Crear frontend admin para [modulo]
ROL: Frontend
MODELO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/components/admin/[Entidad]Fields.tsx
- src/module/[modulo]/components/admin/[Entidad]ListView.tsx
- src/module/[modulo]/components/admin/index.ts
- src/app/admin/[modulo]/page.tsx
- src/app/admin/[modulo]/new/page.tsx
- src/app/admin/[modulo]/[id]/page.tsx

DEPENDENCIA: Types generados por DBA (ya listos)
REFERENCIA: docs/module-template.md
SKILL: .agents/skills/frontend/create-admin.md
```

### 4. Esperar Backend y Frontend (Admin)

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar status: `[x] Backend Admin`, `[x] Frontend Admin`
- Actualizar porcentaje: `50%` (si hay ecommerce) o `75%` (si solo admin)

---

## ECOMMERCE (Solo si ecommerceEnabled: true)

### 3b. Asignar Backend Ecommerce (Después de Backend Admin)

```
TAREA: Crear backend ecommerce para [modulo]
ROL: Backend
MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/services/types.ts
- src/module/[modulo]/services/hydrators.ts
- src/module/[modulo]/services/[modulo].ts
- src/module/[modulo]/services/index.ts

FUNCIONES REQUERIDAS:
- get[Entidad]s() - Todos los items para listado
- getActive[Entidad]s() - Solo items activos
- getFeatured[Entidad]s(limit) - Items destacados para homepage
- get[Entidad]BySlug(slug) - Un item por slug

NOTA: NO crear APIs REST - usar SSR con servicios directos
SKILL: .agents/skills/backend/create-ecommerce.md
```

### 4b. Asignar Frontend Ecommerce (Después de Backend Ecommerce)

```
TAREA: Crear frontend ecommerce para [modulo]
ROL: Frontend
MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
BRANCH: feature/[modulo]

COMPONENTES A CREAR:
- src/module/[modulo]/components/ecommerce/[Entidad]Grid.tsx
- src/module/[modulo]/components/ecommerce/Featured[Entidad]s.tsx
- src/module/[modulo]/components/ecommerce/[Entidad]Detail.tsx
- src/module/[modulo]/components/ecommerce/index.ts

PÁGINAS A CREAR (según spec):
- src/app/[modulo]/page.tsx - Listado
- src/app/[modulo]/[slug]/page.tsx - Detalle
- src/app/[modulo]/[slug]/not-found.tsx - 404

INTEGRACIÓN HOMEPAGE (si spec lo indica):
- Agregar sección en src/app/page.tsx

NOTA: Usar SSR - llamar servicios directamente, NO fetch a APIs
SKILL: .agents/skills/frontend/create-ecommerce.md
```

### Esperar Backend y Frontend Ecommerce

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar porcentaje: `75%`

---

### 5. Asignar a QA - Admin (Después de Frontend Admin)

```
TAREA: Crear E2E tests ADMIN para [modulo]
ROL: QA
MODELO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/e2e/admin/01-crud.ts
- src/module/[modulo]/e2e/admin/02-validations.ts
- src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
- src/module/[modulo]/e2e/data-admin.ts
- src/module/[modulo]/e2e/utils.ts
- src/module/[modulo]/e2e/index-admin.ts
- src/module/[modulo]/e2e/screenshots/admin/

DEPENDENCIA: Frontend Admin completado

EJECUTAR AL COMPLETAR:
npx tsx src/module/[modulo]/e2e/index-admin.ts

SKILL: .agents/skills/qa/create-e2e.md
```

### 5b. Asignar a QA - Ecommerce (Solo si ecommerceEnabled: true)

```
TAREA: Crear E2E tests ECOMMERCE para [modulo]
ROL: QA
MODELO: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/e2e/ecommerce/01-public.ts
- src/module/[modulo]/e2e/data-ecommerce.ts
- src/module/[modulo]/e2e/index-ecommerce.ts
- src/module/[modulo]/e2e/screenshots/ecommerce/

CASOS A PROBAR:
- TC-E01: Homepage muestra sección (si aplica)
- TC-E02: Página de listado
- TC-E03: Cards con información
- TC-E04: Navegación a detalle
- TC-E05: Contenido de detalle
- TC-E06: Página 404
- TC-E07: Responsive mobile

NOTA: NO hacer login - son páginas públicas
DEPENDENCIA: Frontend Ecommerce completado

EJECUTAR AL COMPLETAR:
npx tsx src/module/[modulo]/e2e/index-ecommerce.ts

SKILL: .agents/skills/qa/create-ecommerce-e2e.md
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
