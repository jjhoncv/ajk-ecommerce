# Testing Spec: Tags

## Descripcion
Modulo de etiquetas (tags) para clasificar variantes de productos. Los tags permiten una clasificacion transversal y flexible que complementa las categorias tradicionales. Se visualizan como badges de colores en las tarjetas de productos y se usan para filtrado avanzado en la busqueda.

## Proposito de Negocio
- Clasificacion flexible a nivel de variante (no producto)
- Visualizacion como badges coloridos en el ecommerce
- Filtrado avanzado en busquedas
- Mejor organizacion y navegabilidad del catalogo

---

## Criterios de Aceptacion

### Admin CRUD
- [ ] Listar tags con paginacion y busqueda
- [ ] Crear nuevo tag con color
- [ ] Editar tag existente
- [ ] Eliminar tag
- [ ] Validaciones de formulario
- [ ] Preview visual del color del badge

### Campos Requeridos
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| name | VARCHAR(255) | Si | min:2, max:100 |
| slug | VARCHAR(255) | Si | pattern: ^[a-z0-9-]+$, unique |
| description | TEXT | No | - |
| color | VARCHAR(7) | Si | pattern: ^#[0-9A-Fa-f]{6}$, default: #6B7280 |
| is_active | BOOLEAN | No | default: true |
| display_order | INT | No | default: 0 |

---

## Ecommerce

### Estado
- **ecommerceEnabled**: false (no tiene paginas publicas propias)

### Visualizacion en Ecommerce
Los tags NO tienen paginas dedicadas pero SI se muestran como badges en:
- Tarjetas de productos (ProductCard)
- Pagina de detalle de producto (opcional, fase posterior)

---

## Integracion con Modulos Existentes

### Estado de Integracion
- **requiereIntegracion**: true
- **moduloRelacionado**: product_variants
- **tipoRelacion**: M:N
- **nivelAsociacion**: variante

### Tabla Principal
```sql
CREATE TABLE tags (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,
    UNIQUE INDEX idx_tags_slug (slug),
    INDEX idx_tags_display_order (display_order),
    INDEX idx_tags_is_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### Tabla Pivote (M:N con variantes)
```sql
CREATE TABLE variant_tags (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    variant_id INT NOT NULL,
    tag_id INT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_variant_tag (variant_id, tag_id),
    INDEX idx_variant_tags_variant (variant_id),
    INDEX idx_variant_tags_tag (tag_id)
);
```

### Tareas de Integracion

#### FASE 1: Modulo Tags Standalone (Admin CRUD)
- [ ] DBA: Crear tabla `tags`
- [ ] DBA: Crear tabla pivote `variant_tags`
- [ ] DBA: Agregar seccion al sidebar (grupo: catalog, icono: tag)
- [ ] Backend: Core (model, repository, mapper)
- [ ] Backend: Service con CRUD
- [ ] Backend: API routes `/api/admin/tags`
- [ ] Frontend Admin: Componentes (tagFields, TagListView)
- [ ] Frontend Admin: Paginas (list, new, edit)
- [ ] QA: Tests E2E para CRUD admin

#### FASE 2: Integracion con Variantes
- [ ] Backend: Extender repository de tags para manejar variant_tags
- [ ] Backend: Endpoint `GET/POST /api/admin/tags/variant/[variantId]`
- [ ] Backend: Endpoint `GET /api/variants/[id]/tags` (para ecommerce)
- [ ] Frontend Admin: Agregar selector de tags en edicion de variante
- [ ] Frontend Ecommerce: Mostrar badges de tags en ProductCard
- [ ] QA: Tests E2E para selector en variante
- [ ] QA: Tests E2E para badges en ecommerce

#### FASE 3: Filtrado en Busqueda (posterior)
- [ ] Backend Search: Agregar filtro por tags
- [ ] Frontend Search: Agregar chips de tags en filtros
- [ ] QA: Tests de filtrado por tags

---

## Ubicaciones de Visualizacion

### Admin
| Ubicacion | Componente | Descripcion |
|-----------|------------|-------------|
| /admin/tags | TagListView | Lista de todos los tags |
| /admin/tags/new | FormCreate | Crear nuevo tag |
| /admin/tags/[id] | FormCreate | Editar tag |
| /admin/products/[id]/variants/[vid] | TagSelector | Selector de tags en variante |

### Ecommerce
| Ubicacion | Componente | Descripcion |
|-----------|------------|-------------|
| ProductCard | TagBadges | Badges de tags en tarjeta |
| /productos/[slug] | TagBadges | Badges en detalle (opcional) |

---

## Criterios de Validacion Visual de Integracion

**Esta seccion define QUE debe verse en los screenshots para validar el modelo de negocio.**

QA NO puede aprobar la integracion sin estos screenshots:

### Screenshots REQUERIDOS para validar integracion:
| # | Screenshot | Descripcion | Criterio de Aprobacion |
|---|------------|-------------|------------------------|
| 1 | `admin-tag-created` | Tag creado en admin de tags | Tag visible en lista con color correcto |
| 2 | `admin-variant-selector-available` | Edit de variante mostrando selector de tags | Selector visible Y muestra tags disponibles |
| 3 | `admin-variant-selector-selected` | Selector con tag(s) seleccionado(s) | Tag(s) marcado(s) como seleccionado(s) |
| 4 | `admin-variant-after-save` | Despues de guardar la asociacion | Mensaje de exito O asociacion visible |
| 5 | `ecommerce-productcard-with-tags` | ProductCard mostrando badge de tag | Badge con color correcto VISIBLE |

### Flujo End-to-End que QA DEBE probar:
```
1. CREAR TAG: Ir a /admin/tags -> Crear tag "Nuevo" con color #22C55E
2. VERIFICAR CREACION: Screenshot del tag creado en lista
3. IR A VARIANTE: Ir a /admin/products/[id]/variants/[vid]/edit
4. BUSCAR SELECTOR: Encontrar selector de tags
5. SELECCIONAR: Elegir tag "Nuevo" -> Screenshot
6. GUARDAR: Guardar cambios -> Screenshot de confirmacion
7. VALIDAR ECOMMERCE: Ir a ProductCard del producto -> Screenshot con badge visible
```

### Casos que INVALIDAN la integracion:
- Selector dice "No hay tags disponibles" -> Falta paso 1 (crear tag)
- ProductCard no muestra badge -> Falta implementacion de Frontend Ecommerce
- Badge sin color correcto -> Error en propagacion de color
- Screenshots sin datos reales -> NO valida el modelo de negocio

---

## Dependencias
- Depende de: products (ya existe), product_variants (ya existe)
- Bloquea a: ninguno

## Prioridad
Alta

## Notas Adicionales
- El color del tag se muestra como badge con fondo del color hex
- El texto del badge debe ser legible (calcular contraste automatico)
- En FASE 1 solo se crea el modulo standalone
- FASE 2 agrega la integracion con variantes
- FASE 3 (posterior) agrega filtrado en busqueda
- Para esta ejecucion: completar FASE 1 y FASE 2
