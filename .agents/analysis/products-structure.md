# Análisis de Módulo: Products

Generado para referencia en futuras integraciones.

---

## Estructura de Archivos

```
src/module/products/
├── core/                     # Model-Repository-Mapper
├── components/
│   ├── admin/               # UI admin
│   └── ecommerce/           # UI pública
└── service/                 # Lógica de negocio

src/app/admin/products/
├── page.tsx                 # Lista de productos
├── new/page.tsx             # Crear producto
└── [id]/
    ├── page.tsx             # Editar producto
    └── variants/
        ├── page.tsx         # Lista de variantes
        ├── new/page.tsx     # Crear variante
        └── [variantId]/page.tsx  # Editar variante
```

---

## Admin

### ⚠️ NAVEGACIÓN (CRÍTICO PARA QA)

**El módulo products usa DynamicTable con ACTION MENUS, no links directos.**

#### Cómo acceder a variantes de un producto:

```
1. Ir a /admin/products
2. En la tabla, cada fila tiene un botón de acciones (tres puntos)
3. Click en el botón → Aparece menú dropdown
4. Click en "Variantes" → Navega a /admin/products/[id]/variants
```

#### Selectores CSS correctos:

```typescript
// ❌ INCORRECTO - NO hay links directos en las filas
const link = await page.$('table tbody tr td a')

// ✅ CORRECTO - Usar action menu
const actionBtn = await page.$('table tbody tr button')
if (actionBtn) {
  await actionBtn.click()
  await wait(500)

  // Buscar opción "Variantes" en el menú
  const clicked = await page.evaluate(() => {
    const items = document.querySelectorAll('[role="menuitem"], button, a')
    for (const item of items) {
      if (item.textContent?.toLowerCase().includes('variantes')) {
        (item as HTMLElement).click()
        return true
      }
    }
    return false
  })
}
```

#### Opciones del action menu en Products:

| Opción | Acción |
|--------|--------|
| Editar | Navega a `/admin/products/[id]` |
| Variantes | Navega a `/admin/products/[id]/variants` |
| Eliminar | Abre modal de confirmación |

---

### Componentes Admin

| Componente | Ruta | Descripción |
|------------|------|-------------|
| ProductsList | `src/app/admin/products/page.tsx` | Lista con DynamicTable |
| ProductForm | `src/app/admin/products/[id]/page.tsx` | Formulario de edición |
| VariantsList | `src/app/admin/products/[id]/variants/page.tsx` | Lista de variantes |
| VariantForm | `src/app/admin/products/[id]/variants/[variantId]/page.tsx` | Formulario de variante |

---

## Ecommerce

### Páginas Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Home con productos destacados |
| `/productos` | Catálogo con filtros |
| `/producto/[slug]` | Detalle de producto |

### Componentes Ecommerce

| Componente | Ubicación | Props |
|------------|-----------|-------|
| ProductCard | `src/components/ui/ProductCard/` | product, variant |
| ProductGrid | `src/components/ui/ProductGrid/` | products |
| ProductVariantView | `src/module/products/components/ecommerce/` | variant |

---

## Punto de Integración para Tags

### En Variante (elegido):

- **Archivo a modificar**: `src/app/admin/products/[id]/variants/[variantId]/page.tsx`
- **Agregar**: Sección de tags con selector múltiple
- **API**: `PUT /api/admin/variants/[variantId]/tags`

### En ProductCard:

- **Archivo**: `src/components/ui/ProductCard/ProductCard.tsx`
- **Agregar**: Badges de tags sobre la imagen
- **Prop adicional**: `tags?: Tag[]`

### En ProductDetail:

- **Archivo**: `src/module/products/components/ecommerce/ProductVariantView.tsx`
- **Agregar**: Sección de tags debajo del título
- **Prop adicional**: `tags?: Tag[]`

---

## Tests E2E Existentes

```
src/module/products/e2e/
├── admin/
│   └── 01-crud.ts           # Tests CRUD de productos
├── screenshots/
└── index.ts                 # Runner
```

---

## ⚠️ FLUJO DE DATOS ECOMMERCE (CRITICO PARA INTEGRACION)

### Diagrama de Flujo de Datos

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            HOMEPAGE (src/app/page.tsx)                       │
│                                                                              │
│   ┌────────────────────────┐         ┌─────────────────────────┐            │
│   │ getPopularProducts()   │         │ getDealsProducts()      │            │
│   │ (popularProducts.ts)   │         │ (dealsProducts.ts)      │            │
│   └───────────┬────────────┘         └────────────┬────────────┘            │
│               │                                   │                          │
│               ▼                                   ▼                          │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │           searchModel.searchProducts()                     │             │
│   │           (Search.model.ts)                                │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     productVariantModel.getProductVariant(variantId)       │             │
│   │     → NO incluye tags                                      │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     ProductSearchItemMapper()                              │             │
│   │     → NO incluye tags en el mapeo                          │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     hydratePopularProducts() / hydrateDealsProducts()      │             │
│   │     → NO incluye tags en la transformacion                 │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     PopularProducts / DailyDeals (secciones)               │             │
│   │     → Pasan productos a ProductCard SIN tags               │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     ProductCard.tsx                                        │             │
│   │     → Linea 56: const variantTags = variant.tags ||        │             │
│   │                  product.tags || []                        │             │
│   │     → Tags SIEMPRE vacio porque no vienen en los datos     │             │
│   └───────────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                            SEARCH PAGE (src/app/search/page.tsx)             │
│                                                                              │
│   ┌────────────────────────┐                                                │
│   │ SearchService          │                                                │
│   │ .getSearchParams()     │                                                │
│   └───────────┬────────────┘                                                │
│               │                                                              │
│               ▼                                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │           searchModel.searchProducts()                     │             │
│   │           (mismo flujo que homepage → SIN tags)            │             │
│   └───────────────────────────┬───────────────────────────────┘             │
│                               │                                              │
│                               ▼                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     SearchResults → ProductCard                            │             │
│   │     → Tags NO aparecen                                     │             │
│   └───────────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                         DETALLE (ProductVariantInfo.tsx)                     │
│                                                                              │
│   ┌────────────────────────┐                                                │
│   │ useEffect con fetch    │                                                │
│   │ /api/ecommerce/        │                                                │
│   │ variants/[id]/tags     │                                                │
│   └───────────┬────────────┘                                                │
│               │                                                              │
│               ▼                                                              │
│   ┌───────────────────────────────────────────────────────────┐             │
│   │     TagBadges.tsx                                          │             │
│   │     → Tags SI aparecen (fetch separado funciona)           │             │
│   └───────────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Tabla de Flujo de Datos

| Componente | Usado en | Service que carga datos | Hydrator/Mapper | Incluye tags? | Estado |
|------------|----------|------------------------|-----------------|---------------|--------|
| ProductCard | Homepage (PopularProducts) | `getPopularProducts` | `hydratePopularProducts` | **NO** | DEBE MODIFICARSE |
| ProductCard | Homepage (DailyDeals) | `getDealsProducts` | `hydrateDealsProducts` | **NO** | DEBE MODIFICARSE |
| ProductCard | Search results | `SearchService.getSearchParams` | `ProductSearchItemMapper` | **NO** | DEBE MODIFICARSE |
| ProductVariantInfo | Detalle producto | fetch `/api/ecommerce/variants/[id]/tags` | N/A (fetch directo) | **SI** | Funciona OK |

### Archivos que Backend DEBE modificar para que tags lleguen a ecommerce:

#### 1. ProductSearchItem interface (agregar campo tags)
- **Archivo**: `src/module/search/core/Search.interfaces.ts`
- **Cambio**: Agregar campo `tags?: VariantTag[]` a `ProductSearchItem`
- **Linea actual 37-53**: interface ProductSearchItem NO tiene tags

#### 2. Search.model.ts (obtener tags al buscar)
- **Archivo**: `src/module/search/core/Search.model.ts`
- **Funcion**: `searchProducts()` linea 21-120
- **Cambio**: Despues de obtener `variantDetail` (linea 35-41), agregar llamada para obtener tags:
  ```typescript
  const tags = await tagModel.getTagsByVariantId(variantResult.variantId)
  ```
- **Luego pasar tags al mapper**

#### 3. ProductSearchItemMapper (incluir tags en mapeo)
- **Archivo**: `src/module/search/core/Search.mapper.ts`
- **Funcion**: `ProductSearchItemMapper()` linea 30-53
- **Cambio**: Agregar parametro `tags` y retornarlo en el objeto

#### 4. hydratePopularProducts (pasar tags al retorno)
- **Archivo**: `src/module/products/services/popularProducts/hydrators.ts`
- **Funcion**: `hydratePopularProducts()` linea 4-13
- **Cambio**: Incluir campo `tags` en el mapeo:
  ```typescript
  return data.map((item) => ({
    name: item.name,
    variantId: item.variantId,
    variantPrice: item.variantPrice,
    variants: item.variants,
    tags: item.tags  // AGREGAR
  }))
  ```

#### 5. hydrateDealsProducts (pasar tags al retorno)
- **Archivo**: `src/module/products/services/dealsProducts/hydrators.ts`
- **Funcion**: `hydrateDealsProducts()` linea 4-9
- **Cambio**: Ya usa spread `...item`, solo verificar que tags llegue desde search

#### 6. ProductComplete interface (ya tiene tags)
- **Archivo**: `src/module/products/core/Product.interfaces.ts`
- **Estado**: Ya tiene `tags?: VariantTag[]` en lineas 12 y 22
- **Cambio**: Ninguno necesario

### Resumen de Modificaciones Requeridas

| Prioridad | Archivo | Tipo de Cambio | Complejidad |
|-----------|---------|----------------|-------------|
| 1 | `Search.interfaces.ts` | Agregar campo `tags` a interface | Baja |
| 2 | `Search.model.ts` | Llamar tagModel.getTagsByVariantId() | Media |
| 3 | `Search.mapper.ts` | Agregar parametro y retornar tags | Baja |
| 4 | `popularProducts/hydrators.ts` | Incluir tags en mapeo | Baja |
| 5 | `dealsProducts/hydrators.ts` | Verificar (ya usa spread) | Muy Baja |

### Por que tags NO aparecen actualmente

1. **ProductCard.tsx** (linea 56) busca: `variant.tags || product.tags || []`
2. **Ambos son undefined** porque:
   - `variant` viene de `product.variants[0]` que es tipo `ProductVariantComplete`
   - `ProductVariantComplete` en Search.mapper NO incluye tags
   - `ProductSearchItem` NO tiene campo tags
   - Los hydrators NO pasan tags

3. **El componente esta listo**, solo falta que los datos lleguen

### API Endpoints existentes para tags

| Endpoint | Metodo | Descripcion | Estado |
|----------|--------|-------------|--------|
| `/api/ecommerce/variants/[variantId]/tags` | GET | Tags de una variante | Funciona |
| `/api/admin/variants/[variantId]/tags` | GET/PUT | CRUD tags de variante | Funciona |
| `/api/admin/tags` | GET/POST | CRUD tags | Funciona |

---

## Resumen para Integración

Para integrar un nuevo módulo (ej: tags) con products:

1. **BACKEND**:
   - Tabla pivote: `variant_tags`
   - Extender `VariantRepository` con métodos de tags
   - API: `/api/admin/variants/[id]/tags`

2. **ADMIN**:
   - Agregar selector de tags en `/admin/products/[id]/variants/[variantId]`
   - Mostrar badges en listas

3. **ECOMMERCE**:
   - Agregar badges en `ProductCard`
   - Agregar sección en `ProductVariantView`

4. **TESTS (⚠️ IMPORTANTE)**:
   - Tests van en `src/module/products/e2e/integration/tags.ts`
   - Usar action menu para navegar (NO links directos)
   - Ver sección "NAVEGACIÓN" arriba para selectores correctos
