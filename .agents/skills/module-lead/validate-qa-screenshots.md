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

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log

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

### 7. Asignar Correcciones (ITERACIÓN RÁPIDA)

**IMPORTANTE**: Asignar correcciones ESPECÍFICAS, no generales.

Usar templates de corrección de `messages.template.md`:
- **Corrección Requerida: Frontend**
- **Corrección Requerida: Backend**

**Formato de asignación:**

```
CORRECCIÓN REQUERIDA: [rol]
============================

TEST FALLIDO: [nombre del test]
SCREENSHOT: [nombre]-ERROR.png
PROBLEMA: [descripción específica]

ACCIÓN REQUERIDA:
- [instrucción específica de qué corregir]

DESPUÉS DE CORREGIR:
- Notificar a QA para re-ejecutar SOLO este test
- NO re-ejecutar toda la suite
```

### 8. Re-ejecutar Solo Tests Fallidos (NO Toda la Suite)

**CRÍTICO**: Después de correcciones, QA re-ejecuta SOLO los tests que fallaron:

```
CORRECTO (iteración rápida):
- Test 04-create falló → Frontend corrige → QA re-ejecuta solo 04-create
- Test 06-delete falló → Backend corrige → QA re-ejecuta solo 06-delete

INCORRECTO (ineficiente):
- Test 04-create falló → QA borra TODO → QA re-ejecuta 8 tests ❌
```

### 9. Iterar hasta Todos los Tests Individuales Pasen

```
Test 04-create falló
    │
    ▼
Module Lead → asigna a Frontend
    │
    ▼
Frontend corrige
    │
    ▼
QA re-ejecuta SOLO 04-create
    │
    ├── Pasa → Siguiente test fallido
    │
    └── Falla → Repetir ciclo
```

### 10. PRUEBA TOTAL (Obligatoria antes de Aprobar)

**Solo cuando TODOS los tests individuales pasaron:**

```bash
# Ahora sí, borrar todos los screenshots
rm -rf src/module/[modulo]/e2e/screenshots/*.png

# Ejecutar suite completa
npx tsx src/module/[modulo]/e2e/index.ts

# Validar que no hay errores
ls src/module/[modulo]/e2e/screenshots/*ERROR* 2>/dev/null
# Debe devolver vacío
```

**Mensaje a QA para prueba total:**

```
TODOS LOS TESTS INDIVIDUALES PASARON
=====================================

SOLICITO: Ejecutar PRUEBA TOTAL

Pasos:
1. Borrar todos los screenshots
2. Ejecutar suite completa
3. Reportar resultados finales

NOTA: Esta es la validación final antes de aprobar commit.
```

### 11. Aprobar (>= 90% en prueba total)

Usar mensaje de `messages.template.md` sección **Autorización de Commit**.

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

## INTEGRACIÓN (requiereIntegracion: true)

### ⚠️ CRÍTICO: Validar que elementos sean VISIBLES, no solo que screenshots existan

**El Module Lead NO debe aprobar screenshots solo porque "existen" o "la página carga".**

**DEBE verificar visualmente** que los elementos del modelo de negocio sean visibles en cada screenshot:

```
SPEC DICE: "Badge visible en página de listado"
                    ↓
Module Lead LEE el screenshot (usando Read tool)
                    ↓
VERIFICAR: ¿El badge ES VISIBLE en la imagen?
                    ↓
    SÍ → Aprobar          NO → RECHAZAR
```

### Proceso de validación visual OBLIGATORIO:

1. **Leer el spec**: Sección "Criterios de Validación Visual"
2. **Para CADA criterio**, leer el screenshot correspondiente
3. **Verificar VISUALMENTE** que el elemento descrito esté presente:
   - ¿El badge/componente/lista es VISIBLE?
   - ¿Tiene DATOS reales (no vacío)?
   - ¿El color/estilo es el esperado?

### Señales de alerta (NO aprobar si):

| Screenshot muestra | Problema | Causa probable |
|--------------------|----------|----------------|
| Página sin el elemento esperado | Componente no renderiza | Datos no llegan desde backend |
| Componente vacío | Sin datos | Backend no incluye datos en query |
| Placeholder genérico | Sin datos reales | Integración incompleta |
| Error en consola visible | Fallo de carga | API o datos faltantes |

### Preguntas de validación para cada screenshot de ecommerce:

```
[ ] ¿El elemento del módulo nuevo es VISIBLE en el screenshot?
[ ] ¿Tiene datos REALES (no placeholder, no vacío)?
[ ] ¿Cumple el criterio del spec (color, posición, formato)?
```

**Si alguna respuesta es NO → RECHAZAR y pedir corrección.**

### Verificaciones técnicas:

1. **Screenshots de AMBAS fases existen**:
   ```bash
   # FASE 1: Admin CRUD
   ls src/module/[modulo]/e2e/screenshots/admin/*.png | wc -l
   # DEBE ser > 0

   # FASE 2: Integración (si requiereIntegracion: true)
   ls src/module/[existente]/e2e/screenshots/[nuevo]/*.png | wc -l
   # DEBE ser > 0
   ```

2. **No hay screenshots con -ERROR sin resolver**:
   ```bash
   ls src/module/*/e2e/screenshots/*/*ERROR* 2>/dev/null
   # DEBE estar vacío
   ```

3. **Screenshots del spec existen Y muestran elementos visibles**:
   - Leer sección "Criterios de Validación Visual" del spec
   - Cada screenshot listado DEBE existir físicamente
   - Cada screenshot DEBE mostrar el elemento esperado VISIBLE
   - Si falta alguno O elemento no visible → **NO APROBAR**

### Error común que NO debe repetirse

```
❌ INCORRECTO:
   - Screenshot existe ✓
   - Página carga sin errores ✓
   - Elemento del módulo nuevo NO visible en screenshot
   - Status: "Aprobado" ← ERROR GRAVE

✓ CORRECTO:
   - Screenshot existe ✓
   - Página carga sin errores ✓
   - Elemento del módulo nuevo NO visible en screenshot
   - Status: "RECHAZADO - Elemento no visible, verificar que datos llegan al componente"
```

### Checklist antes de aprobar módulo con integración ecommerce

```
[ ] Screenshots de admin existen
[ ] Screenshots de integración existen
[ ] No hay screenshots con -ERROR
[ ] LEÍ cada screenshot (usando Read tool)
[ ] El elemento del módulo nuevo ES VISIBLE en screenshots de ecommerce
[ ] El elemento tiene DATOS reales (no vacío, no placeholder)
[ ] Cada criterio del spec tiene evidencia visual que lo cumple
```

**Si algún item falla → NO aprobar. Pedir a QA que investigue por qué el elemento no es visible.**

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

- Si APROBADO (después de prueba total): QA hace commit → `propose-release.md`
- Si RECHAZADO:
  1. Asignar correcciones específicas a Frontend/Backend
  2. QA re-ejecuta SOLO tests fallidos (iteración rápida)
  3. Repetir hasta que todos los tests individuales pasen
  4. Ejecutar PRUEBA TOTAL
  5. Validar >= 90% → Aprobar

---

## NO Hacer

- NO aprobar si cumplimiento < 90%
- NO ignorar screenshots con errores visuales
- NO permitir commit de QA sin validación
- NO aprobar Etapa 2 sin que Etapa 1 esté aprobada
- NO aprobar ecommerce sin Header/Footer visibles
- NO pedir a QA re-ejecutar TODA la suite cuando solo fallan algunos tests
- NO aprobar sin PRUEBA TOTAL final (después de que todos los tests individuales pasen)

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
