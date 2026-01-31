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
