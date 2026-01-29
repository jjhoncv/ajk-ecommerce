# Banners Module - E2E Testing Specification

## Resumen

Tests E2E para validar el módulo de banners: CRUD en admin y visualización en homepage.

| Área | Tests | Screenshots |
|------|-------|-------------|
| Admin | 5 | 10 |
| Ecommerce | 1 | 3 |
| **Total** | **6** | **13** |

---

## Comandos

```bash
# Ejecutar tests E2E
npx tsx src/module/banners/e2e/index.ts

# Limpiar data de test + screenshots (por fecha)
npx tsx src/module/banners/e2e/cleanup.ts 2026-01-26

# Limpiar TODA la data de test
npx tsx src/module/banners/e2e/cleanup.ts all
```

---

## Estructura de Archivos

```
src/module/banners/e2e/
├── TESTING-SPEC.md          # Esta especificación
├── index.ts                  # Orquestador principal
├── data.ts                   # Datos de prueba con timestamp único
├── utils.ts                  # Utilidades (screenshots, uploads)
├── cleanup.ts                # Script de limpieza
│
├── admin/                    # Tests del panel admin
│   ├── create.test.ts        # Crear banner
│   ├── list.test.ts          # Listar banners
│   ├── update.test.ts        # Editar banner
│   ├── delete.test.ts        # Eliminar banner
│   └── validation.test.ts    # Validaciones
│
├── ecommerce/                # Tests del frontend
│   └── hero-slider.test.ts   # HeroSlider en homepage
│
├── fixtures/                 # Imágenes de prueba
│   └── test-banner-1200x400.jpg
│
└── screenshots/              # Screenshots generados
    ├── admin/
    └── ecommerce/
```

---

## Modelo de Datos

### Tabla: `banners`

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | INT | Auto | ID único |
| title | VARCHAR | Sí | Título del banner |
| link | VARCHAR | Sí | URL de destino |
| button_text | VARCHAR | Sí | Texto del botón CTA |
| description | TEXT | No | Descripción |
| subtitle | VARCHAR | No | Subtítulo |
| image_url | VARCHAR | No | Imagen del banner |
| display_order | INT | No | Orden de visualización |
| created_at | TIMESTAMP | Auto | Fecha creación |
| created_by | INT | No | Usuario creador |

### Validaciones de Imagen

| Propiedad | Valor |
|-----------|-------|
| Dimensiones mín | 600x240 |
| Dimensiones máx | 1500x600 |
| Tamaño máximo | 500KB |
| Formatos | jpg, png, webp |

---

## URLs del Módulo

| Operación | URL |
|-----------|-----|
| Listar | `/admin/banners` |
| Crear | `/admin/banners/new` |
| Editar | `/admin/banners/{id}` |
| Ecommerce | `/` (homepage - HeroSlider) |

---

## Tests Detallados

### ADMIN

#### 1. CREATE - Crear Banner
**Archivo:** `admin/create.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/banners/new` | Formulario vacío |
| 2 | Llenar título | Campo acepta texto |
| 3 | Llenar link | URL válida |
| 4 | Llenar buttonText | Campo acepta texto |
| 5 | Llenar descripción | Opcional |
| 6 | Llenar subtítulo | Opcional |
| 7 | Subir imagen | Preview visible |
| 8 | Submit | Redirección a lista |
| 9 | Verificar en lista | Banner visible |

#### 2. LIST - Listar Banners
**Archivo:** `admin/list.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/banners` | Tabla visible |
| 2 | Verificar columnas | Título, Imagen, Link |
| 3 | Verificar acciones | Edit, Delete |
| 4 | Verificar paginación | Si hay muchos items |
| 5 | Verificar drag & drop | Reordenar habilitado |

#### 3. UPDATE - Editar Banner
**Archivo:** `admin/update.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Encontrar banner en lista | ID obtenido |
| 2 | Navegar a `/admin/banners/{id}` | Campos pre-llenados |
| 3 | Modificar descripción | Campo editable |
| 4 | Submit | Cambios guardados |
| 5 | Verificar persistencia | Cambios en BD |

#### 4. DELETE - Eliminar Banner
**Archivo:** `admin/delete.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Crear banner de prueba | Banner creado |
| 2 | Click eliminar | Modal confirmación |
| 3 | Click cancelar | Modal cierra |
| 4 | Click confirmar | Banner eliminado |
| 5 | Verificar lista | Banner no aparece |

#### 5. VALIDATION - Validaciones
**Archivo:** `admin/validation.test.ts`

| Caso | Acción | Validación |
|------|--------|------------|
| Título vacío | Submit sin título | Error mostrado |
| Link vacío | Submit sin link | Error mostrado |
| ButtonText vacío | Submit sin buttonText | Error mostrado |
| URL inválida | Link mal formado | Error o aceptado |

### ECOMMERCE

#### 6. HERO-SLIDER - Banner en Homepage
**Archivo:** `ecommerce/hero-slider.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/` | Homepage carga |
| 2 | Verificar slider | Sección visible |
| 3 | Verificar navegación | Dots/arrows funcionan |
| 4 | Verificar CTA | Botón presente |
| 5 | Verificar link | CTA navega correctamente |

---

## Datos de Prueba

```typescript
// data.ts
export const TEST_BANNERS = {
  main: {
    title: `Oferta Especial${TEST_SUFFIX}`,
    link: '/promociones',
    buttonText: 'Ver Ofertas',
    description: 'Descubre nuestras mejores ofertas...',
    subtitle: 'Hasta 50% de descuento'
  },
  secondary: {
    title: `Nueva Colección${TEST_SUFFIX}`,
    link: '/nueva-coleccion',
    buttonText: 'Explorar',
    ...
  },
  forDelete: {
    title: `BannerEliminar${TEST_SUFFIX}`,
    link: '/test',
    buttonText: 'Test',
    ...
  }
}
```

---

## Fixtures

| Archivo | Dimensiones | Uso |
|---------|-------------|-----|
| `test-banner-1400x400.jpg` | 1400x400 | Imagen de banner |

---

## Características Especiales

### Drag & Drop Reordering

El módulo de banners permite reordenar mediante drag & drop:

```typescript
// El test de list verifica que exista la funcionalidad
const hasReorder = await page.evaluate(() => {
  const dragHandles = document.querySelectorAll('[draggable="true"]')
  return dragHandles.length > 0
})
```

### Display en Homepage

Los banners se muestran en el HeroSlider del homepage:
- Ordenados por `display_order`
- Con navegación (dots/arrows)
- Con CTA clickeable

---

## Checklist de Implementación

### Archivos Base
- [x] `TESTING-SPEC.md`
- [x] `index.ts`
- [x] `data.ts`
- [x] `utils.ts`
- [x] `cleanup.ts`

### Tests Admin
- [x] `admin/create.test.ts`
- [x] `admin/list.test.ts`
- [x] `admin/update.test.ts`
- [x] `admin/delete.test.ts`
- [x] `admin/validation.test.ts`

### Tests Ecommerce
- [x] `ecommerce/hero-slider.test.ts`

### Fixtures
- [x] `test-banner-1200x400.jpg`

---

## Output Esperado

```
Test suffix: -test-20260126-151500
╔════════════════════════════════════════════╗
║  BANNERS MODULE - E2E TESTS                ║
╚════════════════════════════════════════════╝

Initializing browser...
Logging in to admin...
  Screenshot: admin/login-success_...

┌────────────────────────────────────────────┐
│  ADMIN TESTS                               │
└────────────────────────────────────────────┘

[15:15:00] === CREATE BANNER TESTS ===
...
[15:15:30] === LIST BANNER TESTS ===
...

┌────────────────────────────────────────────┐
│  ECOMMERCE TESTS                           │
└────────────────────────────────────────────┘

[15:16:00] === HERO SLIDER TESTS ===
...

╔════════════════════════════════════════════╗
║  ALL TESTS COMPLETED                       ║
╚════════════════════════════════════════════╝
```

---

**Módulo: Banners**
**Estado: Listo para ejecutar**
**Generado: 2026-01-26**
