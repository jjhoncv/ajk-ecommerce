# Skill: Asignar Tareas al Equipo

## Rol
Module Lead

## Trigger
Después de `start-module.md`

## Inputs
- `.agents/specs/[modulo]-testing-spec.md`
- Tareas planificadas

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

### 4. Esperar Backend y Frontend

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar status: `[x] Backend`, `[x] Frontend`
- Actualizar porcentaje: `75%`

### 5. Asignar a QA (Último)

```
TAREA: Crear E2E tests para [modulo]
ROL: QA
MODELO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]

ARCHIVOS A CREAR:
- src/module/[modulo]/e2e/index.ts
- src/module/[modulo]/e2e/admin.test.ts
- src/module/[modulo]/e2e/fixtures/[modulo].fixture.ts
- src/module/[modulo]/e2e/testing-spec.md
- src/module/[modulo]/e2e/screenshots/

DEPENDENCIA: Frontend completado (necesita UI)

EJECUTAR AL COMPLETAR:
npx tsx src/module/[modulo]/e2e/index.ts

SKILL: .agents/skills/qa/create-e2e.md
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

Total: 6/6 = 100%
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
