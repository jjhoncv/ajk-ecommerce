# Testing Spec: Tags

## Descripcion

Modulo de etiquetas (tags) para clasificar y destacar variantes de productos con badges visuales. Los tags permiten comunicar caracteristicas especiales como "Nuevo", "Bestseller", "Oferta", "Eco-friendly", etc. Cada variante puede tener diferentes tags asignados.

## Criterios de Aceptacion

### Admin CRUD
- [ ] Listar tags con paginacion
- [ ] Crear nuevo tag
- [ ] Editar tag existente
- [ ] Eliminar tag
- [ ] Validaciones de formulario

### Campos Requeridos
| Campo | Tipo | Requerido | Validacion |
|-------|------|-----------|------------|
| name | VARCHAR(100) | Si | min:2, max:100 |
| slug | VARCHAR(100) | Si | pattern: ^[a-z0-9-]+$, unique |
| description | TEXT | No | - |
| color | VARCHAR(7) | Si | pattern: ^#[0-9A-Fa-f]{6}$, default: #6B7280 |
| display_order | INT | No | default: 0 |
| is_active | BOOLEAN | No | default: true |

### SQL para Tabla Principal

```sql
CREATE TABLE tags (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#6B7280',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
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

### Sidebar
- Seccion: Tags
- URL: /tags
- Icono: tag
- Grupo: catalog

---

## Ecommerce

### Estado
- **ecommerceEnabled**: false (no tiene paginas propias, se integra con products)

### Paginas Publicas
No aplica - los tags se muestran dentro de las paginas de productos.

---

## Integracion con Modulos Existentes

### Estado de Integracion
- **requiereIntegracion**: true
- **moduloRelacionado**: products (a nivel variante)
- **tipoRelacion**: M:N
- **nivelAsociacion**: variante

### Tabla Pivote

```sql
CREATE TABLE variant_tags (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    variant_id INT NOT NULL,
    tag_id INT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_variant_tag (variant_id, tag_id)
);
```

### Tareas de Integracion

**FASE 1: Modulo Standalone (Admin CRUD de tags)**
- [ ] DBA: Crear tabla `tags`
- [ ] DBA: Agregar seccion al sidebar
- [ ] Backend: Crear core (Model, Repository, Mapper)
- [ ] Backend: Crear service y API routes
- [ ] Frontend Admin: Crear componentes y paginas CRUD
- [ ] QA: Tests E2E del admin CRUD

**FASE 2: Integracion con Products (via variant_tags)**
- [ ] DBA: Crear tabla pivote `variant_tags`
- [ ] Backend: Extender repository de variants para incluir tags
- [ ] Backend: Crear endpoint para asignar tags a variantes
- [ ] Frontend Admin: Agregar selector de tags en pagina de edicion de variante
- [ ] Frontend Ecommerce: Mostrar badges en ProductCard
- [ ] Frontend Ecommerce: Mostrar badges en pagina de detalle de producto
- [ ] QA: Tests E2E de integracion (asignacion + visualizacion)

### Ubicaciones de Visualizacion en Ecommerce

| # | Ubicacion | Componente Probable | Descripcion |
|---|-----------|---------------------|-------------|
| 1 | Card de producto | ProductCard | Badge pequeno sobre la imagen o esquina |
| 2 | Pagina de detalle | ProductDetail | Badges junto al nombre o precio |

### Criterios de Validacion Visual de Integracion

QA NO puede aprobar la integracion sin estos screenshots:

| # | Screenshot | Descripcion | Criterio de Aprobacion |
|---|------------|-------------|------------------------|
| 1 | `admin-tag-created` | Tag creado en admin de tags | Tag visible en lista con nombre y color |
| 2 | `admin-variant-selector-available` | Pagina editar variante mostrando selector de tags | Selector visible Y muestra tags disponibles |
| 3 | `admin-variant-selector-selected` | Selector con tag(s) seleccionado(s) | Tag(s) marcado(s) como seleccionado(s) |
| 4 | `admin-variant-after-save` | Despues de guardar la asociacion | Mensaje de exito O asociacion visible |
| 5 | `ecommerce-productcard-with-tags` | Card de producto mostrando badge de tag | Badge visible con color correcto |
| 6 | `ecommerce-productdetail-with-tags` | Pagina detalle mostrando badges de tags | Badges visibles junto al producto |

### Flujo End-to-End que QA DEBE probar

```
1. CREAR: Ir a /admin/tags -> Crear tag "Nuevo" con color #22C55E
2. VERIFICAR CREACION: Screenshot del tag en lista
3. ASOCIAR: Ir a /admin/products/[id]/variants/[vid]/edit -> Buscar selector de tags
4. SELECCIONAR: Elegir tag "Nuevo" -> Screenshot
5. GUARDAR: Guardar cambios -> Screenshot de confirmacion
6. VALIDAR ADMIN: Verificar que la variante muestra el tag asignado
7. VALIDAR ECOMMERCE CARD: Ir a /productos -> Screenshot de card con badge
8. VALIDAR ECOMMERCE DETALLE: Ir a /productos/[slug] -> Screenshot con badge visible
```

---

## Dependencias
- Depende de: products (ya released)
- Bloquea a: ninguna

## Prioridad
Media

## Notas Adicionales
- Los tags son solo visuales, no afectan filtrado en busqueda
- El color del tag se usa para el badge (background-color)
- Una variante puede tener multiples tags
- Los tags se ordenan por display_order en la visualizacion
