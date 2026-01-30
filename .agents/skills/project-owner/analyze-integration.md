# Skill: Analizar Integración con Módulos Existentes

## Rol
Project Owner

## Trigger
Cuando un nuevo módulo tiene relación con módulos existentes en el sistema.

## Inputs
- Descripción del nuevo módulo
- `.agents/project.json` (módulos existentes)
- Módulo(s) existente(s) que se relacionan

---

## 🔍 FASE 1: DETECTAR INTEGRACIONES NECESARIAS

### 1.1 Leer Módulos Existentes

```bash
# Ver módulos ya en el sistema
cat .agents/project.json
```

Módulos típicos con relaciones:
- `products` - casi todo se relaciona con productos
- `categories` - jerarquías y clasificación
- `customers` - datos de cliente
- `orders` - transacciones

### 1.2 Identificar Tipo de Relación

Cuando un nuevo módulo se relaciona con uno existente, determinar:

| Relación | Ejemplo | Implementación |
|----------|---------|----------------|
| **Uno a Muchos (1:N)** | Un brand tiene muchos products | FK en products: `brand_id` |
| **Muchos a Muchos (M:N)** | Products tienen muchos tags, tags tienen muchos products | Tabla pivote: `product_tags` |
| **Uno a Uno (1:1)** | Un customer tiene un profile | FK en profile: `customer_id` UNIQUE |

### 1.3 Decisión de Modelo de Negocio

**CRÍTICO**: Antes de crear el spec, decidir a qué nivel se asocia:

```
EJEMPLO: Tags para productos

OPCIÓN A: Tags a nivel de PRODUCTO
- Un producto puede tener múltiples tags
- Todas las variantes heredan los tags del producto
- Tabla pivote: product_tags (product_id, tag_id)
- Uso: etiquetas generales como "Nuevo", "Popular", "Oferta"

OPCIÓN B: Tags a nivel de VARIANTE
- Cada variante puede tener tags diferentes
- Más granular pero más complejo
- Tabla pivote: variant_tags (variant_id, tag_id)
- Uso: etiquetas específicas como "Talla Grande", "Último en stock"

OPCIÓN C: Tags en AMBOS niveles
- Productos tienen tags generales
- Variantes pueden tener tags adicionales
- Dos tablas pivote
- Más flexible pero más complejo
```

**PREGUNTA OBLIGATORIA AL USUARIO:**
```
Para [módulo], ¿la asociación es a nivel de:
A) Producto (todas las variantes heredan)
B) Variante (cada variante independiente)
C) Ambos niveles

Esto afecta: tabla pivote, UI de admin, filtros de búsqueda, visualización ecommerce.
```

---

## 📊 FASE 2: ANALIZAR MÓDULO EXISTENTE

### 2.1 Leer Estructura del Módulo Existente

Si la integración es con `products`:

```bash
# Estructura del módulo products
ls -la src/module/products/

# Core (modelo, repositorio)
cat src/module/products/core/Product.model.ts
cat src/module/products/core/Product.repository.ts

# Types (campos disponibles)
grep -A 50 "interface Product" src/types/database/database.d.ts

# Tablas relacionadas en BD
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE 'product%';"

# UI del admin (para saber dónde agregar el selector)
cat src/app/admin/products/[id]/page.tsx
```

### 2.2 Documentar Hallazgos

```markdown
ANÁLISIS DEL MÓDULO EXISTENTE: products
=======================================

ESTRUCTURA:
- Tabla principal: products (id, name, slug, description, ...)
- Tabla variantes: product_variants (id, product_id, sku, price, stock, ...)
- Tablas pivote existentes: product_categories, variant_attribute_options

RELACIONES ACTUALES:
- products → brands (FK: brand_id) - 1:N
- products → categories (pivot: product_categories) - M:N
- products → variants (FK: product_id) - 1:N
- variants → attributes (pivot: variant_attribute_options) - M:N

UI ADMIN:
- Edit product: /admin/products/[id]
- Campos actuales: nombre, descripción, categorías, brand
- Hay tabs: Información, Variantes, Imágenes
- Para integrar [nuevo módulo], agregar: selector en tab principal o nuevo tab

ECOMMERCE:
- Detalle producto: /productos/[slug]
- Se muestran: categorías, marca, variantes
- Para integrar [nuevo módulo]: mostrar badges/tags en la UI
```

---

## 🔧 FASE 3: DISEÑAR INTEGRACIÓN

### 3.1 Spec de Integración

Agregar sección al spec del nuevo módulo:

```markdown
## Integración con Módulo Existente

### Módulo Relacionado: [products/categories/etc]

### Tipo de Relación
- [M:N / 1:N / 1:1]

### Nivel de Asociación
- [Producto / Variante / Ambos]

### Tabla Pivote (si M:N)
- Nombre: [module1]_[module2] (ej: product_tags)
- Campos:
  - id: CHAR(36) PRIMARY KEY
  - [module1]_id: CHAR(36) FK
  - [module2]_id: CHAR(36) FK
  - display_order: INT DEFAULT 0 (si aplica)
  - created_at: TIMESTAMP

### Tareas de Integración

#### DBA
- [ ] Crear tabla pivote
- [ ] Agregar índices para búsqueda
- [ ] Regenerar types

#### Backend
- [ ] Agregar métodos al repository del módulo existente:
  - `get[Modulo]With[NuevoModulo]s(id)`
  - `set[NuevoModulo]s(id, [nuevoModulo]Ids)`
- [ ] Agregar al service:
  - Hydrator para incluir [nuevoModulo]s
  - Filtros por [nuevoModulo]
- [ ] Agregar endpoints (si necesario):
  - `POST /api/admin/products/[id]/tags` (asociar)
  - `DELETE /api/admin/products/[id]/tags/[tagId]` (desasociar)

#### Frontend Admin
- [ ] Agregar selector de [nuevoModulo] en edit page del módulo existente
- [ ] Mostrar [nuevoModulo]s asociados en list view (badges)
- [ ] Permitir filtrar por [nuevoModulo]

#### Frontend Ecommerce
- [ ] Mostrar [nuevoModulo]s en card de producto (badges)
- [ ] Mostrar [nuevoModulo]s en página de detalle
- [ ] Agregar filtro por [nuevoModulo] en búsqueda

#### QA
- [ ] Test E2E: Asociar [nuevoModulo] a [módulo existente]
- [ ] Test E2E: Desasociar [nuevoModulo]
- [ ] Test E2E: Ver [nuevoModulo]s en ecommerce
- [ ] Screenshots: Admin con selector, Ecommerce con badges
```

---

## 🤝 FASE 4: ASIGNAR AGENTE DE INTEGRACIÓN

### 4.1 Lanzar Integration Lead

Cuando hay integración compleja, lanzar un agente específico:

```typescript
Task({
  description: "Integration Lead: Integrate [nuevoModulo] with [moduloExistente]",
  prompt: `
    TAREA: Integrar [nuevoModulo] con [moduloExistente]
    ROL: Integration Lead

    CONTEXTO:
    - Nuevo módulo: [nuevoModulo] (ya creado, branch feature/[nuevoModulo])
    - Módulo existente: [moduloExistente]
    - Tipo relación: [M:N / 1:N]
    - Nivel: [Producto / Variante]

    SPEC: .agents/specs/[nuevoModulo]-testing-spec.md (sección Integración)

    TU TRABAJO:
    1. Leer el módulo existente para entenderlo:
       - src/module/[moduloExistente]/core/
       - src/module/[moduloExistente]/components/admin/
       - src/app/admin/[moduloExistente]/

    2. Crear tabla pivote (DBA task):
       - Tabla: [moduloExistente]_[nuevoModulo]s
       - Regenerar types

    3. Extender Backend del módulo existente:
       - Agregar métodos al repository
       - Agregar al service/hydrator

    4. Extender Frontend Admin del módulo existente:
       - Agregar selector de [nuevoModulo] en edit page
       - Mostrar badges en list view

    5. Extender Frontend Ecommerce (si aplica):
       - Mostrar [nuevoModulo]s en cards y detalle
       - Agregar filtros

    6. QA: Tests de integración
       - Asociar/desasociar
       - Visualización en ecommerce

    IMPORTANTE:
    - NO modificar el core del nuevo módulo (ya está hecho)
    - SOLO extender el módulo existente para usar el nuevo
    - Commits con prefijo: feat([moduloExistente]): integrate [nuevoModulo]

    ACTIVITY LOG:
    - ./.agents/scripts/log.sh "INTEGRATION-LEAD" "mensaje"
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "Task", "AskUserQuestion"]
})
```

---

## 📋 CHECKLIST DE INTEGRACIÓN

Antes de marcar integración como completa:

### Base de Datos
- [ ] Tabla pivote creada
- [ ] Índices para consultas frecuentes
- [ ] Types regenerados y correctos

### Backend
- [ ] Repository del módulo existente extendido
- [ ] Service/hydrator incluye relación
- [ ] Endpoints de asociación funcionan

### Frontend Admin
- [ ] Selector funciona en edit page
- [ ] Se guardan las asociaciones
- [ ] List view muestra relación (badges/iconos)

### Frontend Ecommerce (si aplica)
- [ ] Cards muestran la relación
- [ ] Página detalle muestra la relación
- [ ] Filtros funcionan

### QA
- [ ] Tests E2E de integración pasan
- [ ] Screenshots de admin con selector
- [ ] Screenshots de ecommerce con relación visible

---

## Outputs
- Sección de integración en el spec
- Análisis del módulo existente documentado
- Tareas de integración asignadas
- Integration Lead lanzado (si necesario)

## Next
- Module Lead coordina integración junto con creación del módulo
- O Integration Lead maneja solo la integración (post-creación)

## Notas

### Cuándo usar Integration Lead separado
- Módulo nuevo YA está creado y funcionando
- Integración es compleja (múltiples módulos)
- Requiere cambios significativos en módulo existente

### Cuándo incluir integración en flujo normal
- Módulo nuevo se crea junto con su integración
- Integración es simple (solo tabla pivote y selector)
- Module Lead puede coordinar todo
