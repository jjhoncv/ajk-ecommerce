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

## VERIFICAR ECOMMERCE EN SPEC

**ANTES DE ASIGNAR TAREAS**, revisar el spec:

```markdown
## Ecommerce
### Estado
- **ecommerceEnabled**: [true/false]  ← ¡VERIFICAR!
```

Si `ecommerceEnabled: true`: Hay tareas adicionales para Backend, Frontend y QA.

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

# 2. ¿Existen screenshots?
SCREENSHOTS=$(find src/module/[modulo]/e2e/screenshots -name "*.png" 2>/dev/null | wc -l)
echo "Screenshots encontrados: $SCREENSHOTS"
# DEBE ser > 0

# 3. ¿El spec tiene ecommerceEnabled: true?
grep -i "ecommerceEnabled.*true" .agents/specs/[modulo]-testing-spec.md

# 4. ¿Comparé screenshots vs spec?
# DEBO haber leído cada screenshot
```

### Checklist Manual:

```
[ ] Lancé agentes con Task() (no TaskCreate)
[ ] DBA completado Y verificado
[ ] Backend completado Y verificado
[ ] Frontend completado Y verificado
[ ] QA EJECUTÓ tests (no solo creó archivos)
[ ] Screenshots existen (verificado con find)
[ ] Si ecommerceEnabled: screenshots de ecommerce también
[ ] Comparé CADA screenshot vs spec (>= 90%)
[ ] Solo entonces declaré 100%
```

**Si algún item falla, NO declarar completo.**
