# Testing Spec: Tags

## Descripcion

Modulo de etiquetas (tags) para clasificar y destacar variantes de productos. Los tags se muestran como badges visuales en el ecommerce (Home, ProductCard, ProductDetail) para comunicar caracteristicas especiales como "Nuevo", "Bestseller", "Eco-Friendly", "Edicion Limitada", etc.

## Modelo de Negocio

- **Nivel de asociacion**: VARIANTE (M:N con product_variants)
- **Tabla pivote**: variant_tags
- **Admin**: CRUD completo en /admin/tags
- **Ecommerce**: Badges visuales (NO pagina publica /tags)
- **Ubicaciones de visualizacion**: HOME, ProductCard, ProductDetail

---

## Criterios de Aceptacion

### Admin CRUD
- [ ] Listar tags con paginacion
- [ ] Crear nuevo tag
- [ ] Editar tag existente
- [ ] Eliminar tag
- [ ] Validaciones de formulario
- [ ] Reordenar tags con drag & drop

### Campos Requeridos
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| id | CHAR(36) | Si | UUID auto-generado |
| name | VARCHAR(100) | Si | min:2, max:100 |
| slug | VARCHAR(100) | Si | pattern: ^[a-z0-9-]+$, unico |
| description | TEXT | No | - |
| color | VARCHAR(7) | Si | pattern: ^#[0-9A-Fa-f]{6}$, default: #3B82F6 |
| is_active | BOOLEAN | No | default: true |
| display_order | INT | No | default: 0 |
| created_at | TIMESTAMP | Si | auto |
| updated_at | TIMESTAMP | Si | auto on update |

---

## Ecommerce

### Estado
- **ecommerceEnabled**: false (NO tiene paginas publicas propias)
- **ecommerceIntegration**: true (se muestra DENTRO de otros modulos)

### Paginas Publicas
No aplica - Los tags NO tienen pagina propia /tags

### Integracion Visual (donde se muestran los tags)
| Ubicacion | Componente | Descripcion |
|-----------|------------|-------------|
| HOME | ProductCard | Badge con color del tag sobre la imagen del producto |
| ProductCard | ProductCard | Badge visible en cualquier listado de productos |
| ProductDetail | ProductDetail | Badges junto al nombre del producto |

### Campos Visibles en Ecommerce
| Ubicacion | Campos |
|-----------|--------|
| Badge (todas) | name, color |

---

## Integracion con Modulos Existentes

### Estado de Integracion
- **requiereIntegracion**: true
- **moduloRelacionado**: products (a nivel variante)
- **tipoRelacion**: M:N
- **nivelAsociacion**: variante

### Tabla Principal
```sql
CREATE TABLE tags (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabla Pivote
```sql
CREATE TABLE variant_tags (
  id CHAR(36) PRIMARY KEY,
  variant_id CHAR(36) NOT NULL,
  tag_id CHAR(36) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_variant_tag (variant_id, tag_id)
);
```

### Tareas de Integracion

#### FASE 1: Modulo Base (tags standalone)
- [ ] DBA: Crear tabla tags
- [ ] DBA: Agregar seccion en sidebar admin
- [ ] Backend: Core (Model, Repository, Mapper)
- [ ] Backend: Service y API CRUD
- [ ] Frontend Admin: Componentes Fields/ListView
- [ ] Frontend Admin: Paginas list/new/edit
- [ ] QA: Tests E2E CRUD admin
- [ ] QA: Screenshots en tags/e2e/screenshots/admin/

#### FASE 2: Integracion con Variantes (Integration Lead)
- [ ] Module Expert: Analizar estructura de products/variants
- [ ] DBA: Crear tabla pivote variant_tags
- [ ] Backend: Extender repository de variantes para incluir tags
- [ ] Backend: Endpoint para asociar tags a variante
- [ ] Frontend Admin: Selector de tags en pagina editar variante
- [ ] Frontend Ecommerce: Mostrar badges en ProductCard
- [ ] Frontend Ecommerce: Mostrar badges en ProductDetail
- [ ] Frontend Ecommerce: Mostrar badges en HOME (productos destacados)
- [ ] QA: Tests de integracion con screenshots
- [ ] QA: Screenshots en products/e2e/screenshots/tags/

---

## Criterios de Validacion Visual

### FASE 1: Screenshots REQUERIDOS Admin (tags/e2e/screenshots/admin/)
| # | Screenshot | Descripcion | Criterio de Aprobacion |
|---|------------|-------------|------------------------|
| 1 | 00-dashboard-after-login.png | Dashboard post-login | Dashboard visible |
| 2 | 01-sidebar-check.png | Menu lateral con seccion Tags | Tags visible en sidebar |
| 3 | 02-list-page.png | Listado de tags | Tabla con columnas correctas |
| 4 | 03-new-form-empty.png | Formulario nuevo tag | Todos los campos visibles |
| 5 | 04-create-success.png | Tag creado exitosamente | Tag en lista con datos correctos |
| 6 | 05-edit-form-filled.png | Formulario edicion con datos | Campos pre-llenados |
| 7 | 06-edit-success.png | Tag editado exitosamente | Cambios reflejados en lista |
| 8 | 07-delete-confirm.png | Dialogo confirmacion eliminar | Modal de confirmacion |
| 9 | 08-delete-success.png | Tag eliminado | Tag ya no aparece en lista |
| 10 | 09-validation-errors.png | Errores de validacion | Mensajes de error visibles |

### FASE 2: Screenshots REQUERIDOS Integracion (products/e2e/screenshots/tags/)
| # | Screenshot | Descripcion | Criterio de Aprobacion |
|---|------------|-------------|------------------------|
| 1 | int-01-tag-created.png | Tag creado en admin | Tag con color visible |
| 2 | int-02-variant-edit-selector.png | Selector tags en editar variante | Selector visible con tags disponibles |
| 3 | int-03-variant-tags-selected.png | Tags seleccionados en variante | Tags marcados correctamente |
| 4 | int-04-variant-save-success.png | Variante guardada con tags | Mensaje exito o tags visibles |
| 5 | int-05-productcard-badges.png | ProductCard con badges de tags | Badges con color sobre imagen |
| 6 | int-06-productdetail-badges.png | ProductDetail con badges | Badges junto al nombre |
| 7 | int-07-home-badges.png | Home con productos con badges | Badges visibles en productos destacados |

### Flujo End-to-End que QA DEBE probar (Integracion):
```
1. CREAR TAG: Ir a /admin/tags → Crear tag "Nuevo" con color #22C55E
2. VERIFICAR: Screenshot del tag creado en lista
3. EDITAR VARIANTE: Ir a /admin/products/[id]/variants/[vid]/edit
4. BUSCAR SELECTOR: Encontrar seccion/selector de tags
5. SELECCIONAR: Elegir el tag "Nuevo" → Screenshot
6. GUARDAR: Guardar variante → Screenshot de confirmacion
7. VALIDAR ADMIN: Verificar que la asociacion persiste
8. VALIDAR ECOMMERCE: Ir a /productos/[slug] → Screenshot con badge visible
9. VALIDAR PRODUCTCARD: Ir a listado de productos → Screenshot con badge
10. VALIDAR HOME: Ir a / (home) → Screenshot de productos con badges
```

### Casos que INVALIDAN la integracion:
- Selector dice "No hay tags disponibles" → Falta crear tag
- Ecommerce no muestra badges → Falta guardar asociacion o falta componente
- Badges sin color → Falta propiedad color en renderizado
- Screenshots sin datos reales → NO valida el modelo de negocio

---

## Dependencias
- Depende de: products, product_variants (ya released)
- Bloquea a: ninguno

## Prioridad
Alta

## Notas Adicionales
- El color del tag determina el color del badge en ecommerce
- Los tags solo se muestran si is_active = true
- El orden de los badges sigue display_order de la tabla pivote
- Un producto/variante puede tener multiples tags
- Los tags son reutilizables entre variantes
