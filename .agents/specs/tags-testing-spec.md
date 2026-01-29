# Testing Spec: Tags

## Descripción
Módulo para gestionar tags (etiquetas) que permiten categorizar y etiquetar productos con palabras clave. Los tags facilitan la búsqueda y filtrado de productos.

## Criterios de Aceptación

### Admin CRUD
- [ ] Listar tags con paginación
- [ ] Crear nuevo tag
- [ ] Editar tag existente
- [ ] Eliminar tag
- [ ] Validaciones de formulario

### Campos Requeridos
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| name | VARCHAR(100) | Sí | min:2, max:100 |
| slug | VARCHAR(100) | Sí | pattern: ^[a-z0-9-]+$, unique |
| description | TEXT | No | - |
| color | VARCHAR(7) | No | pattern: ^#[0-9A-Fa-f]{6}$ (hex color) |
| isActive | BOOLEAN | No | default: true |
| position | INT | No | default: 0 |

### Funcionalidades
- [ ] Mostrar color del tag en la lista
- [ ] Slug auto-generado desde el nombre
- [ ] Ordenamiento por posición

## Dependencias
- Depende de: ninguna
- Bloquea a: product-tags (futuro - relación M:N con productos)

## Prioridad
media

## Notas Adicionales
- El campo color es opcional, para mostrar badges de colores en el frontend
- En el futuro se creará una tabla product_tags para relacionar productos con tags
