# Skill: Asignar Tareas al Equipo

## Rol
Module Lead

## Trigger
Después de `start-module.md`

## Inputs
- `.agents/specs/[modulo]-testing-spec.md`
- Tareas planificadas

---

## ⛔ ADVERTENCIA CRÍTICA - LEER ANTES DE EMPEZAR

**NUNCA declarar "MÓDULO COMPLETO" sin:**

1. ✅ **QA ejecutó tests** y generó screenshots
2. ✅ **Module Lead validó screenshots** vs spec (>= 90%)
3. ✅ **Si requiereIntegracion: true** en spec:
   - Module Expert analizó módulo existente
   - Integration Lead completó integración
   - QA creó tests en módulo EXISTENTE (no en el nuevo)
   - Screenshots de ecommerce muestran badges/integración
4. ✅ **Commit final realizado**

**Ver sección "Checklist Pre-Completado" al final de este documento.**

**Si declaras completo sin cumplir esto, el módulo será RECHAZADO.**

---

## 🔍 PASO 0: LEER SPEC Y VERIFICAR REQUISITOS

**ANTES de asignar cualquier tarea, leer el spec completo:**

```bash
cat .agents/specs/[modulo]-testing-spec.md
```

**Identificar y registrar:**
```bash
./.agents/scripts/log.sh "MODULE-LEAD" "🔍 Analizando spec de [modulo]"
./.agents/scripts/log.sh "MODULE-LEAD" "→ ecommerceEnabled: [true/false]"
./.agents/scripts/log.sh "MODULE-LEAD" "→ requiereIntegracion: [true/false]"
./.agents/scripts/log.sh "MODULE-LEAD" "→ moduloRelacionado: [nombre o ninguno]"
./.agents/scripts/log.sh "MODULE-LEAD" "→ nivelAsociacion: [producto/variante/N/A]"
```

**Si requiereIntegracion: true:**
- Habrá FASE 2 después de standalone
- Necesitarás lanzar Module Expert
- Necesitarás lanzar Integration Lead
- QA de integración va en módulo EXISTENTE

**Planificar el trabajo completo antes de empezar.**

---

## 🔓 AUTONOMÍA DE AGENTES

**Los agentes tienen AUTONOMÍA TOTAL** - no piden permiso para crear/editar archivos.

Al lanzar cada agente con Task tool, usar estos `allowed_tools`:

```typescript
// DBA
allowed_tools: ["Read", "Glob", "Grep", "Bash", "AskUserQuestion"]

// Backend
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]

// Frontend
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]

// QA
allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
```

Esto permite que trabajen sin interrupciones y puedan hacer preguntas al usuario cuando necesiten clarificación.

---

## 📝 OBLIGATORIO: Activity Log

**TODOS los agentes DEBEN registrar su progreso en `.agents/activity.log`**

### Comando para registrar

```bash
./.agents/scripts/log.sh "AGENTE" "mensaje"
```

### Ejemplos de uso

```bash
# Al iniciar
./.agents/scripts/log.sh "DBA" "Iniciando creación de tabla tags"

# Progreso
./.agents/scripts/log.sh "DBA" "Tabla tags creada con 11 campos"

# Al completar
./.agents/scripts/log.sh "DBA" "TAREA COMPLETADA - Siguiente agente: BACKEND"

# Si hay error
./.agents/scripts/log.sh "BACKEND" "ERROR: No se pudo crear endpoint - falta tipo en domain"
```

### 🔍 MICROTAREAS Y RAZONAMIENTO (Obligatorio)

**Los agentes DEBEN registrar su proceso de pensamiento, no solo inicio/fin.**

```bash
# Análisis y preguntas
./.agents/scripts/log.sh "BACKEND" "🔍 Analizando: spec para identificar campos requeridos"
./.agents/scripts/log.sh "BACKEND" "❓ Pregunta: ¿Necesito método findBySlug?"
./.agents/scripts/log.sh "BACKEND" "💡 Decisión: Sí, para URLs amigables"

# Microtareas (cada paso pequeño)
./.agents/scripts/log.sh "BACKEND" "→ Leyendo .agents/specs/tags-testing-spec.md"
./.agents/scripts/log.sh "BACKEND" "→ Creando src/module/tags/core/Tag.model.ts"
./.agents/scripts/log.sh "BACKEND" "→ Ejecutando pnpm generate"

# Descubrimientos y resoluciones
./.agents/scripts/log.sh "BACKEND" "✓ Encontrado: 6 campos en spec"
./.agents/scripts/log.sh "BACKEND" "⚠️ Problema: Type Tag no existe"
./.agents/scripts/log.sh "BACKEND" "✓ Resuelto: pnpm generate regeneró types"
```

### En el prompt de cada agente, incluir

Agregar al final de cada prompt de agente:

```
OBLIGATORIO - ACTIVITY LOG:
- Registrar inicio: ./.agents/scripts/log.sh "[AGENTE]" "Iniciando [tarea]"
- Registrar MICROTAREAS con prefijo →
- Registrar ANÁLISIS con 🔍
- Registrar PREGUNTAS con ❓
- Registrar DECISIONES con 💡
- Registrar DESCUBRIMIENTOS con ✓
- Registrar PROBLEMAS con ⚠️
- Registrar RESOLUCIONES con ✓ Resuelto:
- Registrar TAREA COMPLETADA al finalizar
- Registrar ERROR si hay problemas bloqueantes

Referencia: .agents/activity-log-guide.md
```

**Sin logs detallados, no se puede entender cómo piensan y trabajan los agentes.**

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

## 🔗 IMPORTANTE: Verificar Sección Integración del Spec

**ANTES DE ASIGNAR TAREAS**, revisar si hay integración:

```markdown
## Integración con Módulos Existentes
### Estado de Integración
- **requiereIntegracion**: [true/false]  ← ¡VERIFICAR!
- **moduloRelacionado**: [products/categories/etc]
```

Si `requiereIntegracion: true`:
- Después de completar el módulo standalone, lanzar **Integration Lead**
- El Integration Lead extenderá el módulo existente
- Ver sección "14. Asignar Integration Lead" de este documento

### Flujo con Integración

```
FASE 1: Módulo Standalone
=========================
DBA → Backend → Frontend → QA Admin
         ↓
    Módulo [nuevo] funciona solo
         ↓
FASE 2: Integración
===================
Integration Lead:
  1. Crear tabla pivote
  2. Extender backend de [moduloExistente]
  3. Agregar selector en admin de [moduloExistente]
  4. Mostrar en ecommerce de [moduloExistente]
  5. QA de integración
         ↓
    [nuevo] integrado con [existente]
```

---

## 🚨 ORDEN ESTRICTO DE DESARROLLO

```
FASE 1: ADMIN (Iteraciones hasta 100%)
======================================
DBA → Backend Admin → Frontend Admin → QA Admin
                                          ↓
                              Validar screenshots
                                          ↓
                              ¿Cumplimiento >= 90%?
                                    │
                        NO ←────────┼────────→ SÍ
                         │                      │
                    Iterar                Admin ✓ APROBADO
                    (corregir)                  │
                         │                      ↓
                         └──────────────→ FASE 2: ECOMMERCE
```

**REGLA CRÍTICA**: NO pasar a Ecommerce hasta que Admin tenga >= 90% de cumplimiento.

- Si Admin tiene errores → iterar hasta resolverlos
- Si hay campo imagen → E2E debe probar upload (ver patrón en skill QA)
- Los datos creados en Admin son necesarios para probar Ecommerce

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

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "DBA" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo/Creando/Ejecutando [archivo/comando]: [propósito]
    - ✓ Encontrado/Resuelto: [qué descubrió/solucionó]
    - ⚠️ Problema: [qué encontró]
    - TAREA COMPLETADA - Siguiente: BACKEND

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Glob", "Grep", "Bash", "AskUserQuestion"]
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

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "BACKEND" "mensaje":
    - 🔍 Analizando: [qué está revisando en spec]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Creando [archivo]: [propósito]
    - → Ejecutando [comando]: [propósito]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - TAREA COMPLETADA - Siguiente: FRONTEND

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
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

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "FRONTEND" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Buscando [patrón] en [ubicación]
    - → Creando [archivo]: [propósito]
    - → Comparando con [componente existente]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - TAREA COMPLETADA - Siguiente: QA

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
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

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "BACKEND" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Creando [archivo]: [propósito]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - TAREA COMPLETADA - ecommerce services

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
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

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "FRONTEND" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Buscando [patrón] en [ubicación]
    - → Creando [archivo]: [propósito]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - TAREA COMPLETADA - ecommerce UI

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
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
    4. NO eliminar screenshots - mantener como evidencia
    5. Detener servidor si lo iniciaste

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "QA" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Creando [archivo de test]: [propósito]
    - → Ejecutando [tests]: [qué valida]
    - → Capturando screenshot: [qué muestra]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - Tests ejecutados: X/Y pasaron
    - Esperando validación de Module Lead

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### 5b. Asignar a QA - Ecommerce ETAPA 1 (Mocks)

**NOTA**: Esta es la primera validación, con datos mock.

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

    ARCHIVOS A CREAR:
    - src/module/[modulo]/e2e/ecommerce/01-public.ts
    - src/module/[modulo]/e2e/data-ecommerce.ts
    - src/module/[modulo]/e2e/index-ecommerce.ts

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
    - Screenshots para validar UI

    AL COMPLETAR:
    1. Ejecutar tests
    2. Screenshots en: src/module/[modulo]/e2e/screenshots/ecommerce/
    3. Notificar: "ETAPA 1 - UI con mocks lista para validación"
    4. NO eliminar screenshots - mantener como evidencia
    5. Detener servidor si lo iniciaste

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "QA" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para entender [qué]
    - → Creando [archivo de test]: [propósito]
    - → Ejecutando [tests]: [qué valida]
    - → Capturando screenshot: [qué muestra]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - Tests ejecutados: X/Y pasaron
    - ETAPA 1 - Esperando validación Module Lead

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### Validar Etapa 1 - UI con Mocks

Validar screenshots de ecommerce con mocks:
- ¿El diseño corresponde al modelo de negocio?
- ¿El layout es correcto?
- ¿La UX es adecuada?

**Si aprueba Etapa 1**: Continuar con Integrador
**Si rechaza**: Frontend corrige → QA re-valida

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

### 10. Asignar Integrador (Si ecommerceEnabled: true)

**Solo después de que Admin Y Ecommerce UI Etapa 1 estén aprobados.**

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
    - Coordinar iteración Frontend + QA si es necesario

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "INTEGRATOR" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Leyendo [archivo] para comparar tipos
    - → Comparando tipos mock vs real
    - → Modificando [archivo]: [qué cambio]
    - ✓ Encontrado: [discrepancia/coincidencia]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - TAREA COMPLETADA - integración lista

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### 11. Manejar Cambios de Tipos (si aplica)

Si Integrador reporta diferencias entre mocks y datos reales:

1. **Frontend ajusta** componentes para nuevos tipos
2. **QA re-valida** con datos reales

### 12. QA Ecommerce ETAPA 2 (Datos Reales)

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
    4. NO eliminar screenshots - mantener como evidencia
    5. Detener servidor si lo iniciaste

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "QA" "mensaje":
    - 🔍 Analizando: [qué está revisando]
    - ❓ Pregunta: [qué necesita resolver]
    - 💡 Decisión: [qué decidió y por qué]
    - → Ejecutando [tests]: [qué valida]
    - → Verificando datos reales en [página]
    - → Capturando screenshot: [qué muestra]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - Tests con datos reales: X/Y pasaron
    - ETAPA 2 - Esperando validación Module Lead

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### 13. Validar Etapa 2 y Finalizar

Si QA Etapa 2 aprueba (>= 90%):
- Módulo COMPLETO
- Ejecutar `propose-release.md`

Si rechaza:
- Identificar si es problema de Frontend, Backend o Integrador
- Asignar corrección
- Re-validar

---

## INTEGRACIÓN CON MÓDULOS EXISTENTES

### 14. Verificar si requiere Integración

**Después de completar el módulo standalone**, revisar spec:

```markdown
## Integración con Módulos Existentes
- **requiereIntegracion**: true  ← Si es true, continuar
- **moduloRelacionado**: products
```

Si `requiereIntegracion: true`, lanzar Integration Lead.

### 15. Asignar Integration Lead (Si requiereIntegracion: true)

```typescript
Task({
  description: "Integration Lead: Integrate [nuevoModulo] with [moduloExistente]",
  prompt: `
    TAREA: Integrar [nuevoModulo] con [moduloExistente]
    ROL: Integration Lead
    SKILL: .agents/skills/integration-lead/integrate-module.md

    CONTEXTO:
    - Módulo nuevo: [nuevoModulo] (standalone completado)
    - Módulo existente: [moduloExistente]
    - Spec: .agents/specs/[nuevoModulo]-testing-spec.md (sección Integración)
    - Branch: feature/[nuevoModulo]

    DEL SPEC:
    - Tipo relación: [M:N / 1:N]
    - Nivel asociación: [producto / variante]
    - Tabla pivote: [moduloExistente]_[nuevoModulo]s

    TU TRABAJO:
    1. Leer y entender módulo existente:
       - src/module/[moduloExistente]/core/
       - src/module/[moduloExistente]/components/admin/
       - src/app/admin/[moduloExistente]/

    2. Crear tabla pivote (DBA):
       - Ejecutar SQL según spec
       - pnpm generate

    3. Extender Backend de [moduloExistente]:
       - Métodos en repository: get[NuevoModulo]s, set[NuevoModulo]s
       - Hydrator para incluir relación
       - API endpoint de asociación

    4. Extender Frontend Admin de [moduloExistente]:
       - Selector de [nuevoModulo] en edit page
       - Badges en list view

    5. Extender Frontend Ecommerce (si aplica):

       ⚠️ PROCESO OBLIGATORIO:
       a) LEER del spec la sección "Ubicaciones de Visualización" o "Integración Visual"
       b) Para CADA ubicación listada:
          - ANALIZAR el código del módulo existente
          - BUSCAR qué componente/página renderiza esa vista
          - MODIFICAR ese archivo para incluir el nuevo módulo
       c) Si el componente hace fetch de datos:
          - ANALIZAR si el endpoint requiere autenticación
          - Si es ecommerce público, crear/usar endpoint público (NO /api/admin/)

    6. QA de Integración:
       - Tests de asociar/desasociar
       - Screenshots de admin con selector
       - Screenshots de ecommerce con badges

    IMPORTANTE:
    - NO modificar el módulo [nuevoModulo] (ya está completo)
    - SOLO extender [moduloExistente] para usar [nuevoModulo]
    - Commits: feat([moduloExistente]): integrate [nuevoModulo]

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "INTEGRATION-LEAD" "mensaje":
    - 🔍 Analizando: [módulo existente - qué está revisando]
    - ❓ Pregunta: [qué necesita entender del módulo]
    - 💡 Decisión: [cómo va a integrar y por qué]
    - → Leyendo [archivo] para entender [estructura existente]
    - → Buscando [patrón] en [módulo existente]
    - → Creando [tabla pivote/archivo]: [propósito]
    - → Modificando [archivo existente]: [qué agrega]
    - ✓ Encontrado: [patrón a seguir/estructura]
    - ⚠️ Problema: [qué encontró]
    - ✓ Resuelto: [cómo lo solucionó]
    - Tabla pivote creada
    - Backend extendido
    - Frontend Admin extendido
    - INTEGRACIÓN COMPLETADA

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "Task", "AskUserQuestion"]
})
```

### 16. Validar Integración

Cuando Integration Lead complete:

**Checklist de Integración:**
- [ ] Tabla pivote existe y types regenerados
- [ ] Repository de [moduloExistente] tiene métodos de relación
- [ ] Edit page de [moduloExistente] tiene selector
- [ ] List view de [moduloExistente] muestra badges
- [ ] Tests existentes siguen pasando (regression)
- [ ] Tests de integración nuevos pasan
- [ ] Screenshots de integración validados (ver 16b)

### 16b. Asignar QA Integration (OBLIGATORIO)

**IMPORTANTE**: Usar el skill específico de QA Integration:
→ `.agents/skills/qa/create-integration-e2e.md`

```typescript
Task({
  description: "QA: Create [nuevoModulo] integration E2E tests in [moduloExistente]",
  prompt: `
    TAREA: Crear E2E tests de integración [nuevoModulo]-[moduloExistente]
    ROL: QA
    SKILL: .agents/skills/qa/create-integration-e2e.md

    SPEC: .agents/specs/[nuevoModulo]-testing-spec.md
    → LEER sección "Criterios de Validación Visual de Integración"

    ARCHIVOS A CREAR EN MÓDULO EXISTENTE:
    - src/module/[moduloExistente]/e2e/integration/[nuevoModulo].ts
    - src/module/[moduloExistente]/e2e/index-integration.ts

    FLUJO END-TO-END OBLIGATORIO (del spec):
    1. CREAR item en /admin/[nuevoModulo]
    2. VERIFICAR selector muestra items disponibles
    3. SELECCIONAR y GUARDAR asociación
    4. VALIDAR en ecommerce que se VE el componente/badge
    5. Screenshot de CADA paso

    ⚠️ NO APROBAR si:
    - Selector dice "No hay [nuevoModulo] disponibles"
    - Ecommerce NO muestra el componente/badge

    ACTIVITY LOG (OBLIGATORIO) - Usar ./.agents/scripts/log.sh "QA" "mensaje":
    - 🔍 Analizando: [spec y criterios de validación]
    - ❓ Pregunta: [qué necesita verificar]
    - 💡 Decisión: [qué flujo seguirá]
    - → Creando item en admin/[nuevoModulo]
    - → Navegando a admin/[moduloExistente]/edit
    - → Verificando selector muestra items disponibles
    - → Seleccionando y guardando asociación
    - → Navegando a ecommerce para verificar badge/componente
    - → Capturando screenshot: [qué muestra]
    - ✓ Encontrado: [qué descubrió]
    - ⚠️ Problema: [selector vacío/badge no visible/etc]
    - ✓ Resuelto: [cómo lo solucionó]
    - Tests integración: X/Y pasaron
    - Esperando validación Module Lead

    Referencia: .agents/activity-log-guide.md
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### 16c. Validar Screenshots de Integración vs Spec

**CRÍTICO**: Los screenshots DEBEN cumplir los criterios definidos en el spec.

**Leer del spec:**
```bash
cat .agents/specs/[nuevoModulo]-testing-spec.md | grep -A 50 "Criterios de Validación Visual"
```

**Screenshots REQUERIDOS (según spec):**
| # | Screenshot | Criterio de Aprobación |
|---|------------|------------------------|
| 1 | admin-[nuevoModulo]-created | Item VISIBLE con datos reales |
| 2 | admin-[moduloExistente]-selector-available | Selector muestra items (NO "No hay disponibles") |
| 3 | admin-[moduloExistente]-selector-selected | Item(s) seleccionado(s) visibles |
| 4 | admin-[moduloExistente]-after-save | Asociación guardada/confirmada |
| 5 | ecommerce-[moduloExistente]-with-[nuevoModulo] | Badge/componente VISIBLE en página |
| 6 | ecommerce-[moduloExistente]-detail-with-[nuevoModulo] | Badge/componente VISIBLE en detalle |

**❌ RECHAZAR AUTOMÁTICAMENTE si:**
- Screenshot #2 muestra "No hay [X] disponibles" → Falta crear item (paso 1)
- Screenshots #5 o #6 NO muestran el componente → Falta guardar asociación (paso 3)
- Screenshots sin datos reales → NO valida modelo de negocio

**Respuesta de validación:**
```
VALIDACIÓN INTEGRACIÓN [nuevoModulo] ↔ [moduloExistente]
========================================================

SCREENSHOTS vs SPEC:
  1. admin-[nuevoModulo]-created: [✅/❌] Item creado con datos reales
  2. admin-selector-available: [✅/❌] Selector muestra items (NO vacío)
  3. admin-selector-selected: [✅/❌] Selección visible
  4. admin-after-save: [✅/❌] Asociación confirmada
  5. ecommerce-with-[nuevoModulo]: [✅/❌] Componente VISIBLE
  6. ecommerce-detail-with-[nuevoModulo]: [✅/❌] Componente VISIBLE

MODELO DE NEGOCIO:
  - ¿La visualización cumple lo que el usuario pidió? [Sí/No]
  - ¿El componente está donde debe estar? [Sí/No]

RESULTADO: [APROBADO si 6/6 / RECHAZADO si falta alguno]

[Si rechazado: qué screenshot falta y qué paso del flujo no se completó]
```

**Si falta algún screenshot crítico:**
1. NO declarar completo
2. Identificar qué paso del flujo falló
3. QA debe re-ejecutar desde ese paso
4. Volver a validar

**Si >= 90% cumplimiento:**
- Integración APROBADA
- Módulo completamente funcional
- Ejecutar `propose-release.md`

**Si < 90%:**
- Identificar problemas
- Integration Lead corrige
- Re-validar

---

## 🚨 PASO FINAL OBLIGATORIO: COMMIT DE MÓDULO COMPLETO

**CRÍTICO**: Después de que TODAS las fases estén completas (standalone + integración si aplica), el Module Lead DEBE hacer un commit final.

### 17. Commit Final del Módulo

```bash
# 1. Verificar estado
git status

# 2. Si hay cambios sin commit
git add .

# 3. Commit con mensaje descriptivo
git commit -m "$(cat <<'EOF'
feat([modulo]): complete module with integration

- Tables: [modulo], [pivote si aplica]
- Backend: core, API routes, integration endpoints
- Frontend Admin: Fields, ListView, pages, selector
- Frontend Ecommerce: badges/components (if applicable)
- E2E tests: admin CRUD + integration tests
- Screenshots: validated by Module Lead

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# 4. Push al branch
git push origin feature/[modulo]

# 5. Registrar en activity log
./.agents/scripts/log.sh "MODULE-LEAD" "COMMIT FINAL - Módulo [modulo] completo en feature/[modulo]"
```

**NUNCA declarar "MÓDULO COMPLETO" sin cumplir TODOS estos requisitos:**

### Checklist Pre-Completado (OBLIGATORIO)

**Para módulo standalone:**
- [ ] QA Admin ejecutó tests y >= 90% pasaron
- [ ] Screenshots de admin existen y fueron validados
- [ ] Commit final realizado

**Para módulo con integración (requiereIntegracion: true):**
- [ ] Todo lo anterior de standalone
- [ ] Module Expert generó reporte de análisis
- [ ] Integration Lead completó la integración
- [ ] **QA Integración creó tests en módulo EXISTENTE** (ej: `src/module/products/e2e/integration/tags.ts`)
- [ ] **Screenshots de integración existen:**
  - Admin: selector funcionando
  - Ecommerce: badges/componentes visibles en ProductCard/Detail
- [ ] Module Lead validó screenshots vs modelo de negocio
- [ ] Commit final incluye TODOS los archivos

### Si falla algún punto:
1. NO declarar completo
2. Identificar qué falta
3. Lanzar agente correspondiente para completar
4. Repetir validación

### El commit debe incluir:
- Todos los archivos creados por DBA, Backend, Frontend, QA
- Todos los archivos de integración (si aplica)
- Tests de integración en módulo existente (si aplica)
- Screenshots de E2E como evidencia
- Activity log actualizado

---

## Outputs
- Tareas asignadas a cada agente
- `.agents/active/[modulo]-status.md` actualizado
- Progreso monitoreado
- Ecommerce integrado con datos reales (si aplica)
- **Commit final realizado en branch feature/[modulo]**

## Next
- Monitorear completados
- Resolver bloqueadores
- Cuando todo complete: `propose-release.md`
