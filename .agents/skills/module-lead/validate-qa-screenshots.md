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

Validar que los screenshots tomados por QA correspondan al **modelo de negocio** definido en el spec. El cumplimiento debe ser >= 90% para autorizar el commit.

---

## Steps

### 1. Recibir Notificación de QA

QA notifica:
```
TESTS EJECUTADOS: [modulo]
RESULTADOS: X passed, Y failed
SCREENSHOTS: src/module/[modulo]/e2e/screenshots/
```

### 2. Revisar Screenshots

Leer cada screenshot usando la herramienta Read (las imágenes son soportadas):

```bash
# Listar screenshots
ls src/module/[modulo]/e2e/screenshots/

# Leer cada uno para análisis visual
```

### 3. Comparar con Modelo de Negocio

Para cada screenshot, evaluar contra el spec:

```
EVALUACIÓN DE SCREENSHOTS vs MODELO DE NEGOCIO
==============================================

Spec: .agents/specs/[modulo]-testing-spec.md

Screenshot: 00-dashboard-after-login.png
  - ¿Login funcionó?: [SI/NO]
  - ¿Dashboard visible?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 01-sidebar-check.png
  - ¿Sidebar visible?: [SI/NO]
  - ¿Módulo aparece en menú?: [SI/NO]
  - ¿Icono correcto?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 02-list-page.png
  - ¿Título correcto?: [SI/NO]
  - ¿Tabla de datos visible?: [SI/NO]
  - ¿Botón "Nuevo" visible?: [SI/NO]
  - ¿Columnas según spec?: [SI/NO]
  - ¿Acciones por fila?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 03-new-form-empty.png
  - ¿Formulario visible?: [SI/NO]
  - ¿Campos según spec?: [SI/NO]
  - ¿Labels correctos?: [SI/NO]
  - ¿Botón submit visible?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 04-form-filled.png
  - ¿Datos de prueba visibles?: [SI/NO]
  - ¿Campos llenados correctamente?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 04-after-create.png
  - ¿Redirigió a lista?: [SI/NO]
  - ¿Item creado aparece?: [SI/NO]
  - ¿Toast/mensaje de éxito?: [SI/NO - opcional]
  Cumple: [SI/NO]

Screenshot: 05-edit-form-loaded.png
  - ¿Formulario con datos cargados?: [SI/NO]
  - ¿Valores correctos?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 05-after-edit.png
  - ¿Cambios guardados?: [SI/NO]
  - ¿Item actualizado en lista?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 06-delete-modal.png
  - ¿Modal de confirmación visible?: [SI/NO]
  - ¿Mensaje claro?: [SI/NO]
  - ¿Botones Cancelar/Eliminar?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 07-after-delete.png
  - ¿Item eliminado de lista?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: 08-validation-errors.png
  - ¿Errores de validación visibles?: [SI/NO]
  - ¿Mensajes claros?: [SI/NO]
  Cumple: [SI/NO]
```

### 4. Calcular Cumplimiento

```
RESUMEN DE CUMPLIMIENTO
=======================

Screenshots evaluados: 12
Screenshots que cumplen: X
Screenshots que NO cumplen: Y

CUMPLIMIENTO: (X / 12) * 100 = Z%

Umbral requerido: 90%
```

### 5. Decisión

#### Si cumplimiento >= 90%

```
AUTORIZACIÓN QA COMMIT
======================

MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (>= 90%)
ESTADO: ✅ APROBADO

SCREENSHOTS VALIDADOS:
  [x] Login y dashboard
  [x] Sidebar con módulo
  [x] Lista de items
  [x] Formulario de creación
  [x] Crear item
  [x] Formulario de edición
  [x] Editar item
  [x] Modal de eliminación
  [x] Eliminar item
  [x] Validaciones

QA: Proceder con commit
```

→ Continuar con `propose-release.md`

#### Si cumplimiento < 90%

```
RECHAZO - ITERACIÓN REQUERIDA
=============================

MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (< 90%)
ESTADO: ❌ RECHAZADO

PROBLEMAS DETECTADOS:
```

Luego analizar CADA problema:

### 6. Análisis de Problemas (si < 90%)

Para cada screenshot que NO cumple, identificar:

```
ANÁLISIS DE PROBLEMA #1
=======================

Screenshot: [nombre].png
Problema: [descripción del problema visual]

DIAGNÓSTICO:
  - ¿Es problema de UI/diseño?: [SI/NO]
  - ¿Es problema de lógica/proceso?: [SI/NO]
  - ¿Es problema de datos/API?: [SI/NO]
  - ¿Es problema del test?: [SI/NO]

RESPONSABLE:
  [ ] Frontend - si es UI/diseño/layout/estilos
  [ ] Backend - si es lógica/proceso/API
  [ ] DBA - si es datos/tipos
  [ ] QA - si el test está mal escrito

CORRECCIÓN REQUERIDA:
  [Descripción específica de qué debe corregirse]
```

### 7. Asignar Correcciones

Por cada problema, asignar tarea al responsable:

**Si es Frontend:**
```
CORRECCIÓN REQUERIDA: UI
========================

ROL: Frontend
MÓDULO: [modulo]
BRANCH: feature/[modulo]

PROBLEMA:
  Screenshot: [nombre].png
  Descripción: [qué está mal]

CORRECCIÓN:
  Archivo: [path al archivo]
  Cambio: [qué debe cambiar]

REFERENCIA VISUAL:
  - Screenshot actual: src/module/[modulo]/e2e/screenshots/[nombre].png
  - Spec esperado: .agents/specs/[modulo]-testing-spec.md

AL COMPLETAR:
  - NO hacer commit
  - Notificar a Module Lead
```

**Si es Backend:**
```
CORRECCIÓN REQUERIDA: Lógica/API
================================

ROL: Backend
MÓDULO: [modulo]
BRANCH: feature/[modulo]

PROBLEMA:
  Screenshot: [nombre].png
  Descripción: [qué está mal]

CORRECCIÓN:
  Archivo: [path al archivo]
  Cambio: [qué debe cambiar]

AL COMPLETAR:
  - NO hacer commit
  - Notificar a Module Lead
```

### 8. Re-ejecutar Tests

Después de que los responsables corrijan:

```
RE-EJECUCIÓN DE TESTS
=====================

QA: Volver a ejecutar tests

COMANDO:
  npx tsx src/module/[modulo]/e2e/index.ts

IMPORTANTE:
  - Los screenshots anteriores se limpian automáticamente
  - Nuevos screenshots se generan
  - Notificar resultados a Module Lead

NO HACER COMMIT HASTA APROBACIÓN
```

### 9. Iterar hasta >= 90%

Repetir pasos 2-8 hasta lograr cumplimiento >= 90%

```
ITERACIÓN #[N]
==============

Cumplimiento anterior: [X]%
Problemas corregidos: [lista]

Nuevo resultado:
  - Tests: X passed, Y failed
  - Screenshots: src/module/[modulo]/e2e/screenshots/

[Volver a evaluar...]
```

---

## Criterios de Evaluación por Tipo de Pantalla

### Lista (list page)
- Título del módulo visible y correcto
- Tabla con columnas según spec
- Datos cargados (o mensaje "sin datos" si vacío)
- Botón "Nuevo" visible y funcional
- Acciones por fila (editar, eliminar)
- Paginación si aplica

### Formulario (new/edit)
- Todos los campos del spec presentes
- Labels descriptivos
- Campos con tipos correctos (text, select, color, etc.)
- Botón submit visible
- Valores pre-cargados en edición

### Modal de confirmación
- Fondo oscurecido
- Modal centrado
- Mensaje de confirmación claro
- Botón cancelar funcional
- Botón confirmar con estilo destructivo (rojo)

### Validaciones
- Errores visibles cerca del campo
- Mensajes descriptivos
- Formulario NO se envía con errores

### Navegación
- Sidebar muestra el módulo
- Breadcrumbs correctos
- Redirecciones funcionan

---

## Outputs

- Evaluación documentada de screenshots
- Decisión: APROBADO o RECHAZADO
- Si rechazado: tareas de corrección asignadas
- Iteraciones hasta cumplimiento >= 90%

## Next

- Si APROBADO: QA hace commit → `propose-release.md`
- Si RECHAZADO: Correcciones → Re-test → Re-evaluar

---

## 🎯 FASE DE FEEDBACK (Solo si APROBADO)

### 10. Detectar Mejoras del Equipo

Antes de autorizar el commit, revisar si el equipo agregó mejoras (Factor de Imaginación 10%):

```
MEJORAS DETECTADAS (Factor 10%)
===============================

¿El equipo agregó algo que NO estaba en el spec original?

1. [Mejora 1 - si existe]
   - Agente: [quien lo hizo]
   - Descripción: [qué agregó]
   - Valor: [por qué es útil]

2. [Mejora 2 - si existe]
   ...

Si no hay mejoras detectadas: OK, cumplió exactamente el spec.
```

### 11. Preguntar al Humano sobre Mejoras

Si se detectaron mejoras, preguntar al humano:

```
PREGUNTA PARA TI (Feedback de Evolución)
========================================

MÓDULO: [modulo]
CUMPLIMIENTO BASE: [X]%

MEJORAS QUE EL EQUIPO AGREGÓ:
1. [mejora 1]
2. [mejora 2]

PREGUNTA:
¿Alguna de estas mejoras SUPERÓ tus expectativas?

Opciones:
- SÍ, [especificar cuál] fue mejor de lo esperado
- NO, cumplió con lo esperado (está bien)
- EXCESO, [especificar cuál] fue innecesario

Tu feedback es CRUCIAL para la evolución del equipo.
```

### 12. Capturar Aprendizaje (Si responde SÍ)

Si el humano dice que algo superó expectativas:

```
APRENDIZAJE CAPTURADO
=====================

FECHA: [YYYY-MM-DD]
MÓDULO: [modulo]
AGENTE: [rol que hizo la mejora]

MEJORA QUE SUPERÓ EXPECTATIVAS:
[descripción detallada]

VALOR PERCIBIDO:
[por qué el humano lo consideró mejor]

ACCIÓN INMEDIATA:
1. Actualizar .agents/team-evolution.md (historial)
2. Actualizar skill del agente con este patrón
3. Incrementar métricas de evolución
```

**Actualizar `.agents/team-evolution.md`:**

Agregar fila al historial:
```
| [fecha] | [modulo] | [agente] | [mejora] | Superó expectativas | [skill actualizado] |
```

**Actualizar skill del agente:**

Agregar al final del skill correspondiente:
```markdown
## Aprendizajes del Equipo

### [Fecha] - Módulo [modulo]
**Mejora**: [descripción]
**Por qué funcionó**: [explicación del humano]
**Aplicar cuando**: [contexto similar]
```

### 13. Manejar Feedback de EXCESO

Si el humano dice que algo fue innecesario:

```
FEEDBACK DE EXCESO
==================

MÓDULO: [modulo]
MEJORA INNECESARIA: [descripción]
AGENTE: [rol]

ACCIÓN:
- NO agregar a skills como patrón positivo
- Considerar si el Factor de Imaginación es muy alto
- Documentar para evitar en futuros módulos
```

---

## Ejemplo de Rechazo con Iteración

```
ITERACIÓN 1 - RECHAZO
=====================

Cumplimiento: 75% (9/12 screenshots OK)

PROBLEMAS:
1. 02-list-page.png: Falta columna "color" en tabla
   → Frontend: Agregar columna color a DynamicTable

2. 03-new-form-empty.png: Campo "color" no tiene color picker
   → Frontend: Cambiar input text por input type="color"

3. 06-delete-modal.png: Modal no aparece
   → Frontend: Verificar componente Alert

ASIGNADO: Frontend
ACCIÓN: Corregir los 3 problemas
DEADLINE: Inmediato

---

ITERACIÓN 2 - APROBADO
======================

Cumplimiento: 100% (12/12 screenshots OK)

Frontend corrigió:
  [x] Columna color agregada
  [x] Color picker implementado
  [x] Modal funcionando

QA: AUTORIZADO PARA COMMIT
```

---

---

## 🛒 VALIDACIÓN DE SCREENSHOTS ECOMMERCE

### Dos Etapas de Validación

#### Etapa 1: Frontend UI + Mocks
```
QA notifica:
  TESTS ECOMMERCE - ETAPA 1 (MOCKS): [modulo]
  TIPO: Validación UI con datos mock
```

**Qué validar en Etapa 1:**
- Diseño y layout (NO los datos específicos)
- Estructura de página correcta
- Componentes funcionan visualmente

#### Etapa 2: Frontend UI + Datos Reales
```
QA notifica:
  TESTS ECOMMERCE - ETAPA 2 (DATOS REALES): [modulo]
  TIPO: Validación UI con datos del Admin
```

**Qué validar en Etapa 2:**
- Todo lo de Etapa 1 PLUS
- Datos del Admin se muestran correctamente
- Imágenes cargan
- Integración completa funciona

---

### Checklist de Evaluación Ecommerce

Para cada screenshot de ecommerce:

```
EVALUACIÓN SCREENSHOTS ECOMMERCE
================================

Spec: .agents/specs/[modulo]-testing-spec.md (sección Ecommerce)
Etapa: [1-Mocks / 2-Datos Reales]

Screenshot: e00-page-structure.png
  - ¿Header del sitio visible?: [SI/NO]
  - ¿Footer del sitio visible?: [SI/NO]
  - ¿Navegación funcional?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: e01-homepage-section.png
  - ¿Sección del módulo visible?: [SI/NO]
  - ¿Título de sección?: [SI/NO]
  - ¿Items mostrados?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: e02-list-page.png
  - ¿Header/Footer presentes?: [SI/NO]
  - ¿Título H1 visible?: [SI/NO]
  - ¿Grilla de items ordenada?: [SI/NO]
  - ¿Cards con imagen/placeholder?: [SI/NO]
  - ¿Cards con título?: [SI/NO]
  - ¿Cards clickeables?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: e04-detail-page.png
  - ¿Header/Footer presentes?: [SI/NO]
  - ¿Título del item visible?: [SI/NO]
  - ¿Imagen (si existe)?: [SI/NO]
  - ¿Descripción (si existe)?: [SI/NO]
  - ¿Layout correcto?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: e06-404-page.png
  - ¿Header/Footer presentes?: [SI/NO]
  - ¿Mensaje "No encontrado"?: [SI/NO]
  - ¿Link de regreso?: [SI/NO]
  Cumple: [SI/NO]

Screenshot: e07-mobile-list.png
  - ¿Header adaptado a mobile?: [SI/NO]
  - ¿Grilla 1-2 columnas?: [SI/NO]
  - ¿Texto legible?: [SI/NO]
  - ¿No hay overflow horizontal?: [SI/NO]
  Cumple: [SI/NO]

CRITERIOS ESPECÍFICOS DEL SPEC:
(Agregar según modelo de negocio, ej: badges de color, campos especiales)
  - [Campo especial 1]: [SI/NO]
  - [Campo especial 2]: [SI/NO]
```

### Diferencias entre Etapas

| Criterio | Etapa 1 (Mocks) | Etapa 2 (Datos Reales) |
|----------|-----------------|------------------------|
| Header/Footer | Obligatorio | Obligatorio |
| Layout | Validar | Validar |
| Datos correctos | No aplica (son mocks) | **Validar** |
| Imágenes cargan | Placeholder OK | **Deben cargar** |
| Links funcionan | Estructura OK | **URLs reales** |
| Cantidad items | Fija (mocks) | **Según Admin** |

### Problemas Comunes en Ecommerce

```
PROBLEMA: Página sin Header/Footer
CAUSA: Frontend no usó <Layout> del sitio
RESPONSABLE: Frontend
CORRECCIÓN: Envolver página en Layout, Header, LayoutContent

PROBLEMA: Imágenes no cargan (Etapa 2)
CAUSA: URLs incorrectas o imágenes no subidas en Admin
RESPONSABLE: Verificar Admin primero, luego Frontend
CORRECCIÓN: Verificar que existen datos con imágenes en Admin

PROBLEMA: Página 404 sin layout
CAUSA: not-found.tsx no usa Layout
RESPONSABLE: Frontend
CORRECCIÓN: Agregar Layout a not-found.tsx

PROBLEMA: Mobile overflow horizontal
CAUSA: Grilla no responsive
RESPONSABLE: Frontend
CORRECCIÓN: Verificar grid-cols responsive
```

---

## NO Hacer

- NO aprobar si cumplimiento < 90%
- NO ignorar screenshots con errores visuales
- NO permitir commit de QA sin validación
- NO saltarse la comparación con el spec
- NO aprobar Etapa 2 sin que Etapa 1 esté aprobada
- NO aprobar ecommerce sin Header/Footer visibles
