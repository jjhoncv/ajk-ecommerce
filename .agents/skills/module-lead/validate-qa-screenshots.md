# Skill: Validar Screenshots de QA

## Rol
Module Lead

## Trigger
QA notifica que ejecutó tests y tomó screenshots

## Inputs
- Screenshots en `src/module/[modulo]/e2e/screenshots/`
- Resultados de tests (passed/failed)
- `.agents/specs/[modulo]-testing-spec.md` (modelo de negocio)

---

## Objetivo

Validar que los screenshots correspondan al **modelo de negocio** del spec. Cumplimiento >= 90% para autorizar commit.

---

## TEMPLATES

**Usar templates para evaluación y mensajes.**

Ubicación: `.agents/skills/module-lead/templates/`

| Template | Uso |
|----------|-----|
| `screenshot-evaluation.template.md` | Checklists de evaluación Admin y Ecommerce |
| `messages.template.md` | Autorización, rechazo, correcciones |

---

## Steps

### 1. Recibir Notificación de QA

```
TESTS EJECUTADOS: [modulo]
RESULTADOS: X passed, Y failed
SCREENSHOTS: src/module/[modulo]/e2e/screenshots/
```

### 2. Revisar Screenshots

Leer cada screenshot usando Read (las imágenes son soportadas):

```bash
# Listar screenshots
ls src/module/[modulo]/e2e/screenshots/
```

### 3. Comparar con Modelo de Negocio

Usar checklist de `screenshot-evaluation.template.md`:
- Sección **Evaluación Admin CRUD** para screenshots de admin
- Sección **Evaluación Ecommerce** para screenshots de ecommerce

Marcar SI/NO en cada criterio.

### 4. Calcular Cumplimiento

```
CUMPLIMIENTO: (screenshots OK / total) * 100 = Z%
Umbral requerido: 90%
```

### 5. Decisión

#### Si >= 90%

Usar mensaje de `messages.template.md` sección **Autorización de Commit**.

→ Continuar con `propose-release.md`

#### Si < 90%

Usar mensaje de `messages.template.md` sección **Rechazo - Iteración Requerida**.

### 6. Análisis de Problemas (si < 90%)

Para cada screenshot que NO cumple, usar template **Análisis de Problema** de `messages.template.md`.

Identificar responsable:
- Frontend: UI/diseño/layout/estilos
- Backend: lógica/proceso/API
- DBA: datos/tipos
- QA: test mal escrito

### 7. Asignar Correcciones

Usar templates de corrección de `messages.template.md`:
- **Corrección Requerida: Frontend**
- **Corrección Requerida: Backend**

### 8. Re-ejecutar Tests

Después de correcciones, QA re-ejecuta:

```bash
npx tsx src/module/[modulo]/e2e/index.ts
```

### 9. Iterar hasta >= 90%

Repetir pasos 2-8 hasta lograr cumplimiento.

---

## Criterios de Evaluación

Ver sección **Criterios de Evaluación por Tipo de Pantalla** en `screenshot-evaluation.template.md`:
- Lista
- Formulario
- Modal de confirmación
- Validaciones
- Navegación

---

## ECOMMERCE

### Dos Etapas de Validación

**Etapa 1: Mocks** - Validar diseño y layout
**Etapa 2: Datos Reales** - Validar integración completa

Usar checklist **Evaluación Ecommerce** de `screenshot-evaluation.template.md`.

Ver diferencias entre etapas en la tabla del template.

### Problemas Comunes

Ver sección **Problemas Comunes Ecommerce** en `messages.template.md`.

---

## FASE DE FEEDBACK (Solo si APROBADO)

### 10. Detectar Mejoras del Equipo

Usar template **Feedback de Mejoras** de `messages.template.md`.

### 11. Preguntar al Humano

Usar template **Pregunta de Feedback al Humano** de `messages.template.md`.

### 12. Capturar Aprendizaje (Si responde SÍ)

Si el humano dice que algo superó expectativas:
1. Actualizar `.agents/team-evolution.md`
2. Actualizar skill del agente con el patrón

---

## Outputs

- Evaluación documentada de screenshots
- Decisión: APROBADO o RECHAZADO
- Si rechazado: tareas de corrección asignadas

## Next

- Si APROBADO: QA hace commit → `propose-release.md`
- Si RECHAZADO: Correcciones → Re-test → Re-evaluar

---

## NO Hacer

- NO aprobar si cumplimiento < 90%
- NO ignorar screenshots con errores visuales
- NO permitir commit de QA sin validación
- NO aprobar Etapa 2 sin que Etapa 1 esté aprobada
- NO aprobar ecommerce sin Header/Footer visibles

---

## CHECKLIST FINAL

```bash
# 1. ¿Existen screenshots?
ls -la src/module/[modulo]/e2e/screenshots/*.png 2>/dev/null | head -20

# 2. ¿Cuántos screenshots hay?
find src/module/[modulo]/e2e/screenshots -name "*.png" | wc -l

# 3. ¿Hay screenshots de error?
ls src/module/[modulo]/e2e/screenshots/*ERROR* 2>/dev/null

# 4. ¿El spec tiene ecommerceEnabled: true?
grep -i "ecommerceEnabled.*true" .agents/specs/[modulo]-testing-spec.md

# 5. Si ecommerce, ¿existen esos screenshots?
ls src/module/[modulo]/e2e/screenshots/ecommerce/*.png 2>/dev/null | wc -l
```

### Checklist Manual:

```
[ ] Screenshots existen (no carpeta vacía)
[ ] Leí CADA screenshot (usando Read)
[ ] Comparé cada uno vs spec del módulo
[ ] Calculé cumplimiento: X/Y = Z%
[ ] Z >= 90% para aprobar
[ ] Si ecommerceEnabled: validé screenshots de ecommerce
[ ] No hay screenshots con -ERROR sin resolver
[ ] Documenté la evaluación antes de aprobar/rechazar
```

**Si algún item falla, NO aprobar. Asignar correcciones primero.**
