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

### ⛔ LEER ANTES DE INTEGRACIÓN
`.agents/learnings/ecommerce-data-flow.md`

### Cuándo aplica:
- El spec tiene `requiereIntegracion: true`
- Existe tabla pivote (ej: `variant_tags`, `product_collections`)
- El nuevo módulo se muestra DENTRO de un módulo existente

### Después de Admin aprobado, LANZAR INTEGRATION LEAD:

**⛔ IMPORTANTE: El Module Lead NO hace la integración directamente.**

El Module Lead SOLO lanza al Integration Lead, quien coordina todo el proceso de integración.

```typescript
Task({
  description: "Integration Lead: Integrate [modulo] with [moduloExistente]",
  prompt: `
    ROL: Integration Lead
    MÓDULO NUEVO: [modulo]
    MÓDULO EXISTENTE: [moduloExistente]
    BRANCH: feature/[modulo]

    SKILL A SEGUIR: .agents/skills/integration-lead/integrate-module.md

    SPEC: .agents/specs/[modulo]-testing-spec.md

    INSTRUCCIONES:
    1. Leer el skill completo
    2. FASE 0: Lanzar Module Expert para analizar [moduloExistente]
    3. FASE 1: Usar reporte del Module Expert para planificar
    4. FASE 2: Lanzar DBA para tabla pivote
    5. FASE 3: Lanzar Backend para extender repository/service
    6. FASE 4: Lanzar Frontend Admin para selector en edit page
    7. FASE 5: Lanzar Frontend Ecommerce para badges
    8. FASE 6: Lanzar QA para tests de integración
    9. Validar screenshots de integración existen
    10. Reportar a Module Lead cuando esté completo

    UBICACIÓN DE SCREENSHOTS DE INTEGRACIÓN:
    src/module/[moduloExistente]/e2e/screenshots/[modulo]/

    PERMISOS: Autonomía total para crear/editar archivos, ejecutar Bash, SQL, etc.
  `,
  subagent_type: "general-purpose"
})
```

### ¿Por qué lanzar Integration Lead en lugar de hacer directamente?

1. **Module Expert**: Integration Lead primero lanza un análisis del módulo existente
   - Descubre la estructura real (no asume)
   - Identifica puntos de integración
   - Genera reporte con selectores CSS, rutas, etc.

2. **Contexto rico**: Los agentes Backend/Frontend/QA reciben contexto del reporte
   - Saben DÓNDE modificar
   - Saben QUÉ selectores usar
   - Saben CÓMO navegar en tests

3. **Screenshots correctos**: QA sabe exactamente qué validar porque tiene el reporte

### Flujo de Integración (via Integration Lead):

```
FASE 1 COMPLETA (Admin >= 90%)
            │
            ▼
   ¿requiereIntegracion: true?
            │
    SÍ ─────┴───── NO
    │              │
    ▼              ▼
Lanzar         Proponer
Integration    Release
Lead
    │
    ▼
Integration Lead coordina:
1. Module Expert (analiza módulo existente)
2. DBA (tabla pivote)
3. Backend (extender repository/service)
4. Frontend Admin (selector en edit)
5. Frontend Ecommerce (badges)
6. QA (tests + screenshots en [existente]/screenshots/[nuevo]/)
    │
    ▼
Integration Lead reporta a Module Lead
    │
    ▼
Module Lead valida screenshots
    │
    ▼
Proponer Release
```

**El Module Lead NO se detiene entre FASE 1 y Integración.**
**El Module Lead SIEMPRE lanza Integration Lead cuando requiereIntegracion: true.**

---

## ⛔ VALIDACIÓN OBLIGATORIA: SCREENSHOTS EXISTEN

### Antes de declarar FASE 1 completa:

```bash
# Verificar que existen screenshots del admin CRUD
ls src/module/[modulo]/e2e/screenshots/admin/*.png 2>/dev/null | wc -l
# DEBE ser > 0

# Si es 0, QA NO se ejecutó correctamente
# NO continuar a FASE 2 sin estos screenshots
```

### Antes de declarar FASE 2 completa (si requiereIntegracion: true):

```bash
# Verificar screenshots de integración en el módulo EXISTENTE
ls src/module/[moduloExistente]/e2e/screenshots/[moduloNuevo]/*.png 2>/dev/null | wc -l
# DEBE ser > 0

# Ejemplo para tags integrado con products:
ls src/module/products/e2e/screenshots/tags/*.png 2>/dev/null | wc -l
```

### Regla de oro:

```
SIN SCREENSHOTS = MÓDULO INCOMPLETO

No importa si:
- El código compila ✓
- Los tests pasan ✓
- El frontend se ve bien ✓

Si NO hay screenshots:
- NO se puede validar el modelo de negocio
- NO se puede proponer release
- El módulo está INCOMPLETO

El Module Lead DEBE:
1. Verificar que QA generó screenshots
2. Si no hay screenshots, relanzar QA
3. NUNCA declarar completo sin screenshots
```

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
[ ] Backend modificó hydrators/models del módulo EXISTENTE ← ⚠️ CRÍTICO
    (Ver .agents/learnings/ecommerce-data-flow.md)
[ ] Frontend admin integración completado (selector)
[ ] Frontend ecommerce integración completado (badges/visualización)
[ ] QA integración EJECUTÓ tests ← ⚠️ NO OMITIR
[ ] Screenshots de integración existen (según spec)
[ ] Screenshots muestran DATOS REALES (no elementos vacíos) ← ⚠️ CRÍTICO
[ ] Comparé screenshots integración vs "Criterios de Validación Visual"

FINAL:
[ ] TODOS los screenshots del spec existen
[ ] Solo entonces declaré 100%
```

**Si algún item falla, NO declarar completo.**
**Si requiereIntegracion: true y no hay screenshots de integración → INCOMPLETO.**
