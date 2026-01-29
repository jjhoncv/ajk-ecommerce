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

### 6. Esperar QA y Validar

Cuando QA notifica completado:
- Revisar resultados de tests
- Revisar screenshots
- Actualizar status: `[x] QA`
- Actualizar porcentaje: `100%`

### 7. Calcular Cumplimiento

Comparar vs testing-spec.md:

```
CHECKLIST DE CUMPLIMIENTO:

Admin CRUD:
[x] Listar - test passed, screenshot ok
[x] Crear - test passed, screenshot ok
[x] Editar - test passed, screenshot ok
[x] Eliminar - test passed, screenshot ok
[x] Validaciones - test passed, screenshot ok

Total: 5/5 = 100%
```

Si >= 90%: Ejecutar `propose-release.md`
Si < 90%: Identificar faltantes, asignar tareas adicionales

---

## Outputs
- Tareas asignadas a cada agente
- `.agents/active/[modulo]-status.md` actualizado
- Progreso monitoreado

## Next
- Monitorear completados
- Resolver bloqueadores
- Cuando todo complete: `propose-release.md`
