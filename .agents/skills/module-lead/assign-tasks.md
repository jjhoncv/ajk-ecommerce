# Skill: Asignar Tareas al Equipo

## Rol
Module Lead

## Trigger
Después de `start-module.md`

## Inputs
- `.agents/specs/[modulo]-testing-spec.md`
- Tareas planificadas

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches

---

## REGLA ABSOLUTA: NO DECLARAR COMPLETO SIN SCREENSHOTS

**NUNCA declarar un módulo como "COMPLETADO" o "100%" sin:**

1. **QA EJECUTÓ los tests E2E** (no solo creó los archivos)
2. **Screenshots EXISTEN** en `src/module/[modulo]/e2e/screenshots/`
3. **Module Lead REVISÓ** cada screenshot vs el spec

### Verificación obligatoria:

```bash
SCREENSHOTS=$(find src/module/[modulo]/e2e/screenshots -name "*.png" 2>/dev/null | wc -l)
echo "Screenshots encontrados: $SCREENSHOTS"
# Si es 0, QA NO ejecutó los tests - lanzar QA de nuevo
```

---

## TEMPLATES

**Usar templates en lugar de escribir prompts desde cero.**

Ubicación: `.agents/skills/module-lead/templates/`

| Template | Contenido |
|----------|-----------|
| `task-prompts.template.md` | Prompts para Task() de cada rol |
| `screenshot-evaluation.template.md` | Checklists de evaluación |
| `messages.template.md` | Mensajes de autorización/rechazo |

---

## AUTONOMÍA DE AGENTES

Los agentes tienen **AUTONOMÍA TOTAL** - no piden permiso para crear/editar archivos.

---

## VERIFICAR ECOMMERCE E INTEGRACIÓN EN SPEC

**ANTES DE ASIGNAR TAREAS**, revisar el spec:

```markdown
## Ecommerce
### Estado
- **ecommerceEnabled**: [true/false]  ← ¡VERIFICAR!

## Integración con Módulos Existentes
### Estado de Integración
- **requiereIntegracion**: [true/false]  ← ¡VERIFICAR!
```

**REGLA CRÍTICA DE AUTONOMÍA:**
- Si `ecommerceEnabled: true` → Continuar automáticamente con FASE 2 Ecommerce
- Si `requiereIntegracion: true` → Continuar automáticamente con FASE 2 Integración
- **NUNCA detenerse a preguntar** si debe continuar con FASE 2
- El flujo es 100% autónomo: FASE 1 → FASE 2 (si aplica) → Proponer release

---

## ORDEN ESTRICTO DE DESARROLLO

```
FASE 1: ADMIN (Iteraciones hasta 100%)
======================================
DBA → Backend Admin → Frontend Admin → QA Admin
                                          ↓
                              ¿Cumplimiento >= 90%?
                                    │
                        NO ←────────┼────────→ SÍ
                         │                      │
                    Iterar                Admin ✓ APROBADO
                                                │
                                                ↓
                                    FASE 2: ECOMMERCE (si aplica)
```

**REGLA CRÍTICA**: NO pasar a Ecommerce hasta que Admin tenga >= 90%.

---

## Steps

### 1. Asignar a DBA (Primero)

Copiar prompt de `.agents/skills/module-lead/templates/task-prompts.template.md` sección **DBA**.

Reemplazar placeholders y lanzar con Task().

### 2. Esperar Completado de DBA

Cuando DBA notifica completado:
- Verificar que types existen en `src/types/`
- Actualizar status: `[x] DBA` - `25%`

### 3. Asignar a Backend y Frontend (Paralelo)

Copiar prompts de `task-prompts.template.md`:
- Sección **Backend Admin**
- Sección **Frontend Admin**

Lanzar AMBOS en paralelo con Task().

### 4. Esperar Backend y Frontend (Admin)

Cuando ambos notifican completado:
- Verificar archivos creados
- Actualizar status: `50%` (si hay ecommerce) o `75%` (si solo admin)

### 5. Asignar a QA Admin

Copiar prompt de `task-prompts.template.md` sección **QA Admin**.

### 6. Esperar QA - Recibir Screenshots

Cuando QA notifica:
```
TESTS EJECUTADOS: [modulo]
RESULTADOS: X passed, Y failed
SCREENSHOTS: src/module/[modulo]/e2e/screenshots/
```

**QA NO hace commit aún.**

### 7. Validar Screenshots

Usar skill: `.agents/skills/module-lead/validate-qa-screenshots.md`

Con templates de `screenshot-evaluation.template.md`.

### 8. Decisión de Aprobación

Usar mensajes de `messages.template.md`:
- **>= 90%**: Autorización de Commit
- **< 90%**: Rechazo - Iteración Requerida

---

## ECOMMERCE (Solo si ecommerceEnabled: true)

### Después de Admin aprobado:

1. **Backend Ecommerce**: Copiar de `task-prompts.template.md`
2. **Frontend Ecommerce**: Copiar de `task-prompts.template.md`
3. **QA Ecommerce Etapa 1**: Validar UI con mocks
4. **Integrador**: Conectar con datos reales
5. **QA Ecommerce Etapa 2**: Validar con datos reales

---

## INTEGRACIÓN (Solo si requiereIntegracion: true)

**⚠️ CRÍTICO: Esta fase es AUTOMÁTICA. NO preguntar al humano si debe continuar.**

### Cuándo aplica:
- El spec tiene `requiereIntegracion: true`
- Existe tabla pivote (ej: `variant_tags`, `product_collections`)
- El nuevo módulo se muestra DENTRO de un módulo existente

### Después de Admin aprobado, CONTINUAR AUTOMÁTICAMENTE con Task():

**PASO 1: Lanzar Backend Integración**
```typescript
Task({
  description: "Backend: Create [modulo] integration endpoints",
  prompt: `
    TAREA: Crear endpoints de integración para [modulo]
    SPEC: .agents/specs/[modulo]-testing-spec.md (sección Integración)
    BRANCH: feature/[modulo]

    CREAR:
    - Endpoints para gestionar la relación (assign/unassign)
    - Extender repository/service del módulo relacionado
    - Endpoint público para ecommerce (si aplica)

    AL COMPLETAR: Commit y notificar
  `,
  subagent_type: "general-purpose"
})
```

**PASO 2: Lanzar Frontend Admin + Ecommerce Integración (en paralelo)**
```typescript
// Lanzar AMBOS en paralelo
Task({
  description: "Frontend Admin: Add [modulo] selector to related module",
  prompt: `
    TAREA: Agregar selector de [modulo] en admin del módulo relacionado
    SPEC: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]

    CREAR:
    - Selector/multiselect en edit page del módulo relacionado
    - Visualización de asociaciones guardadas

    AL COMPLETAR: Commit y notificar
  `,
  subagent_type: "general-purpose"
})

Task({
  description: "Frontend Ecommerce: Show [modulo] in related module UI",
  prompt: `
    TAREA: Mostrar [modulo] en componentes del ecommerce
    SPEC: .agents/specs/[modulo]-testing-spec.md (sección Ubicaciones)
    BRANCH: feature/[modulo]

    CREAR según spec:
    - Badges/componentes en cards del módulo relacionado
    - Visualización en página de detalle (si aplica)

    AL COMPLETAR: Commit y notificar
  `,
  subagent_type: "general-purpose"
})
```

**PASO 3: Lanzar QA Integración (OBLIGATORIO)**
```typescript
// Usar template de task-prompts.template.md sección "QA Integración"
Task({
  description: "QA: Execute [modulo] integration E2E tests",
  prompt: `... copiar de task-prompts.template.md ...`,
  subagent_type: "general-purpose"
})
```

### ⚠️ REGLA CRÍTICA: NO OMITIR QA DE INTEGRACIÓN

**El Module Lead DEBE lanzar QA Integración después de Frontend.**

Sin los screenshots de integración:
- ❌ NO se valida el modelo de negocio
- ❌ NO se puede declarar el módulo completo
- ❌ NO se puede proponer release

### Screenshots de Integración REQUERIDOS (del spec):

El spec lista los screenshots obligatorios en la sección "Criterios de Validación Visual de Integración". Verificar que QA los genere TODOS.

### Flujo de FASE 2 Integración:

```
FASE 1 COMPLETA (Admin >= 90%)
            │
            ▼
   ¿requiereIntegracion: true?
            │
    SÍ ─────┴───── NO
    │              │
    ▼              ▼
FASE 2         Proponer
Integración    Release
    │
    ▼
1. Backend Integración (Task)
    │
    ▼
2. Frontend Admin + Ecommerce (Task en paralelo)
    │
    ▼
3. QA Integración (Task) ← ⚠️ OBLIGATORIO
    │
    ▼
4. Validar screenshots de integración
    │
    ▼
Proponer Release
```

**El Module Lead NO se detiene entre FASE 1 y FASE 2.**
**El Module Lead NO omite QA de Integración.**

---

## Outputs
- Tareas asignadas a cada agente
- `.agents/active/[modulo]-status.md` actualizado
- Progreso monitoreado

## Next
- Monitorear completados
- Resolver bloqueadores
- Cuando todo complete: `propose-release.md`

---

## CHECKLIST FINAL

```bash
# 1. ¿Usé Task() para lanzar agentes? (NO TaskCreate)
# TaskCreate solo anota, Task() ejecuta.

# 2. ¿Existen screenshots de ADMIN?
SCREENSHOTS=$(find src/module/[modulo]/e2e/screenshots -name "*.png" 2>/dev/null | wc -l)
echo "Screenshots admin encontrados: $SCREENSHOTS"
# DEBE ser > 0

# 3. ¿El spec tiene ecommerceEnabled: true?
grep -i "ecommerceEnabled.*true" .agents/specs/[modulo]-testing-spec.md
# Si sí, verificar screenshots de ecommerce

# 4. ¿El spec tiene requiereIntegracion: true?
grep -i "requiereIntegracion.*true" .agents/specs/[modulo]-testing-spec.md
# Si sí, DEBEN existir screenshots de integración (ver paso 5)

# 5. ¿Existen screenshots de INTEGRACIÓN? (si requiereIntegracion: true)
# Buscar los screenshots listados en el spec sección "Criterios de Validación Visual"
ls src/module/[modulo]/e2e/screenshots/ | grep -E "(selector|integration|with-)"
# DEBE mostrar resultados si requiereIntegracion: true

# 6. ¿Comparé screenshots vs spec?
# DEBO haber leído cada screenshot
```

### Checklist Manual:

```
FASE 1 - Admin CRUD:
[ ] Lancé agentes con Task() (no TaskCreate)
[ ] DBA completado Y verificado
[ ] Backend completado Y verificado
[ ] Frontend completado Y verificado
[ ] QA EJECUTÓ tests admin (no solo creó archivos)
[ ] Screenshots admin existen (verificado con find)
[ ] Comparé screenshots admin vs spec (>= 90%)

FASE 2 - Ecommerce (si ecommerceEnabled: true):
[ ] Backend ecommerce completado
[ ] Frontend ecommerce completado
[ ] QA ecommerce EJECUTÓ tests
[ ] Screenshots ecommerce existen

FASE 2 - Integración (si requiereIntegracion: true):
[ ] Backend integración completado (endpoints)
[ ] Frontend admin integración completado (selector)
[ ] Frontend ecommerce integración completado (badges/visualización)
[ ] QA integración EJECUTÓ tests ← ⚠️ NO OMITIR
[ ] Screenshots de integración existen (según spec)
[ ] Comparé screenshots integración vs "Criterios de Validación Visual"

FINAL:
[ ] TODOS los screenshots del spec existen
[ ] Solo entonces declaré 100%
```

**Si algún item falla, NO declarar completo.**
**Si requiereIntegracion: true y no hay screenshots de integración → INCOMPLETO.**
