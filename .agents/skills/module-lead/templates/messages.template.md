# Message Templates

Templates de mensajes para comunicación con agentes.

---

## Autorización de Commit (>= 90%)

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

---

## Rechazo - Iteración Requerida (< 90%)

```
RECHAZO - ITERACIÓN REQUERIDA
=============================

MÓDULO: [modulo]
CUMPLIMIENTO: [Z]% (< 90%)
ESTADO: ❌ RECHAZADO

PROBLEMAS DETECTADOS:
1. Screenshot [X]: [problema] → [Responsable] corrige
2. Screenshot [Y]: [problema] → [Responsable] corrige
```

---

## Análisis de Problema

```
ANÁLISIS DE PROBLEMA #[N]
=========================

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

---

## Corrección Requerida: Frontend

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

---

## Corrección Requerida: Backend

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

---

## Re-ejecución de Tests

```
RE-EJECUCIÓN DE TESTS
=====================

QA: Volver a ejecutar tests

COMANDO:
  npx tsx src/module/[modulo]/e2e/index.ts

IMPORTANTE:
  - Los screenshots anteriores se mantienen
  - Nuevos screenshots se generan con timestamp
  - Notificar resultados a Module Lead

NO HACER COMMIT HASTA APROBACIÓN
```

---

## Iteración

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

## Checklist de Cumplimiento Final

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

---

## Problemas Comunes Ecommerce

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

## Feedback de Mejoras (Factor 10%)

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

---

## Pregunta de Feedback al Humano

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
