# Screenshot Evaluation Templates

Templates para evaluar screenshots de QA vs modelo de negocio.

---

## Evaluación Admin CRUD

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

---

## Evaluación Ecommerce

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
  - [Campo especial 1]: [SI/NO]
  - [Campo especial 2]: [SI/NO]
```

---

## Resumen de Cumplimiento

```
RESUMEN DE CUMPLIMIENTO
=======================

Screenshots evaluados: [X]
Screenshots que cumplen: [Y]
Screenshots que NO cumplen: [Z]

CUMPLIMIENTO: (Y / X) * 100 = [%]

Umbral requerido: 90%
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

## Diferencias entre Etapas Ecommerce

| Criterio | Etapa 1 (Mocks) | Etapa 2 (Datos Reales) |
|----------|-----------------|------------------------|
| Header/Footer | Obligatorio | Obligatorio |
| Layout | Validar | Validar |
| Datos correctos | No aplica (son mocks) | **Validar** |
| Imágenes cargan | Placeholder OK | **Deben cargar** |
| Links funcionan | Estructura OK | **URLs reales** |
| Cantidad items | Fija (mocks) | **Según Admin** |
