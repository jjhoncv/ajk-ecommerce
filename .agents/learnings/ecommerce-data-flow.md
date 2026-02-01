# Aprendizaje Crítico: Flujo de Datos en Ecommerce

## Problema Recurrente

Cuando se integra un módulo nuevo (ej: tags, collections, badges) con un módulo existente que tiene presencia en ecommerce (ej: products), el componente de UI se crea pero **los datos nunca llegan** porque no se modificó el flujo de datos del módulo existente.

---

## Síntoma

- Screenshot de ecommerce muestra la página correctamente
- El componente del módulo nuevo existe en el código
- Pero el elemento visual (badge, lista, etc.) **NO aparece**
- El test "pasa" porque la página carga, pero el modelo de negocio NO se valida

---

## Causa Raíz

El flujo de datos en ecommerce NO pasa por el módulo nuevo. Los datos del módulo existente vienen de:

1. **Model/Repository del módulo existente** → hace query a BD
2. **Hydrator del módulo existente** → transforma los datos
3. **Service del módulo existente** → expone los datos
4. **Componente de ecommerce** → renderiza los datos

Si el Backend crea un nuevo `tagService.getTags()` pero **NO modifica** el flujo del módulo existente, los tags nunca llegan al ProductCard.

---

## Ejemplo Concreto

### Incorrecto (Lo que pasó)

```
tags module:
  - tagService.getTags() ✓ (creado)
  - TagBadges component ✓ (creado)

products module:
  - searchModel.searchProducts() ❌ (NO modificado - no incluye tags)
  - popularProducts/hydrators.ts ❌ (NO modificado - no incluye tags)
  - ProductCard.tsx ✓ (tiene código para tags, pero variant.tags siempre es undefined)
```

### Correcto (Lo que debería pasar)

```
tags module:
  - tagService.getTags() ✓ (creado)
  - TagBadges component ✓ (creado)
  - tagModel.getTagsByVariantIds() ✓ (creado para bulk fetch)

products module:
  - Search.model.ts ✓ (modificado - llama a tagModel.getTagsByVariantIds())
  - popularProducts/hydrators.ts ✓ (modificado - incluye tags: item.tags)
  - ProductCard.tsx ✓ (tiene código para tags, Y los datos llegan)
```

---

## Flujo de Datos que Debe Rastrearse

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    ECOMMERCE                             │
                    │                                                          │
Página              │   page.tsx                                              │
(SSR/Client)        │      │                                                  │
                    │      ▼                                                  │
Service             │   getProducts()        ← ¿Incluye datos del nuevo módulo?
                    │      │                                                  │
                    │      ▼                                                  │
Hydrator            │   hydrateProducts()    ← ¿Transforma datos del nuevo módulo?
                    │      │                                                  │
                    │      ▼                                                  │
Model               │   searchModel/         ← ¿Query incluye relación con nuevo módulo?
                    │   productModel                                          │
                    │      │                                                  │
                    │      ▼                                                  │
Repository          │   query SQL            ← ¿JOIN con tabla pivote?       │
                    │                                                          │
                    └─────────────────────────────────────────────────────────┘

TODOS estos puntos deben modificarse para que los datos lleguen al componente.
```

---

## Regla de Oro para Backend en Integración

**Cuando se integra módulo A con módulo B existente:**

1. **NO basta con crear `aService.getAs()`**
2. **DEBES modificar los archivos donde B obtiene datos para ecommerce**

### Archivos típicos a modificar en el módulo EXISTENTE:

```
src/module/[existente]/
├── core/
│   └── [Existente].model.ts      ← Agregar método que incluya relación
├── services/
│   ├── hydrators.ts              ← Agregar campo del nuevo módulo al retorno
│   └── popularProducts/          ← Si hay services específicos, modificarlos
│       └── hydrators.ts
└── (también revisar si hay mappers específicos)

src/module/search/
└── core/
    └── Search.model.ts           ← Si productos vienen de búsqueda, modificar aquí
```

---

## Validación Obligatoria para QA

El test de integración ecommerce DEBE verificar que **el elemento tiene contenido**, no solo que la página carga:

```typescript
// ❌ INCORRECTO - Solo verifica que página carga
await goto('/producto/slug')
await takeScreenshot('product-page')
results.passed++ // Pasa aunque el badge no aparece

// ✅ CORRECTO - Verifica que elemento tiene contenido
const badgeContainer = await page.$('[data-testid="tag-badges"]')
if (!badgeContainer) {
  throw new Error('Badge container no existe en el DOM')
}

const hasContent = await page.evaluate(() => {
  const el = document.querySelector('[data-testid="tag-badges"]')
  return el && el.children.length > 0
})

if (!hasContent) {
  throw new Error('DATOS NO LLEGAN: Badge container existe pero está vacío')
}

await takeScreenshot('product-page-with-badges')
results.passed++
```

---

## Checklist para Integration Lead

Antes de declarar FASE 2 Ecommerce completa:

```
[ ] Module Expert identificó TODOS los archivos donde el módulo existente
    obtiene datos para ecommerce (hydrators, models, mappers)

[ ] Backend modificó CADA archivo identificado para incluir datos del nuevo módulo

[ ] QA verificó que el elemento visual tiene CONTENIDO (no solo que existe)

[ ] Screenshot muestra el elemento visual con datos reales
```

---

## Si el Screenshot No Muestra el Elemento

1. **NO declarar el módulo como completo**
2. **Investigar el flujo de datos**:
   ```bash
   # ¿El componente existe?
   grep -r "NuevoModuloComponent" src/module/existente/components/

   # ¿El hydrator incluye los datos?
   grep -r "nuevoModulo" src/module/existente/services/hydrators.ts

   # ¿El model hace el query?
   grep -r "nuevoModulo" src/module/existente/core/*.model.ts
   ```
3. **Identificar qué archivo falta modificar**
4. **Asignar a Backend para que lo corrija**
5. **Re-ejecutar QA**

---

## Referencias

- `.agents/skills/integration-lead/integrate-module.md` - Flujo de integración
- `.agents/skills/backend/create-ecommerce.md` - Creación de services
- `.agents/skills/qa/create-integration-e2e.md` - Tests de integración
