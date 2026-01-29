# Categories Module - E2E Testing Specification

## Resumen

Tests E2E para validar el módulo de categorías completo: CRUD en admin y navegación en ecommerce.

| Área | Tests | Screenshots |
|------|-------|-------------|
| Admin | 6 | 7 |
| Ecommerce | 3 | 5 |
| **Total** | **9** | **12** |

---

## Comandos

```bash
# Ejecutar tests E2E
npx tsx src/module/categories/e2e/index.ts

# Limpiar data de test + screenshots (por fecha)
npx tsx src/module/categories/e2e/cleanup.ts 2026-01-26

# Limpiar TODA la data de test
npx tsx src/module/categories/e2e/cleanup.ts all
```

---

## Estructura de Archivos

```
src/module/categories/e2e/
├── TESTING-SPEC.md          # Esta especificación
├── index.ts                  # Orquestador principal (ejecuta todos los tests)
├── data.ts                   # Datos de prueba con timestamp único
├── utils.ts                  # Utilidades (screenshots, uploads, helpers)
├── cleanup.ts                # Script de limpieza (Docker + BD + screenshots)
│
├── admin/                    # Tests del panel admin
│   ├── create.test.ts        # Crear categoría padre
│   ├── create-child.test.ts  # Crear subcategoría
│   ├── update.test.ts        # Editar categoría
│   ├── delete.test.ts        # Eliminar categoría
│   ├── list.test.ts          # Listar y paginar
│   └── validation.test.ts    # Validaciones de formulario
│
├── ecommerce/                # Tests del frontend público
│   ├── navigation.test.ts    # Navegación y menú
│   ├── category-page.test.ts # Página de categoría
│   └── not-found.test.ts     # Página 404
│
├── fixtures/                 # Imágenes de prueba
│   ├── test-category-400x400.jpg
│   ├── test-banner-desktop-1400x400.jpg
│   └── test-banner-mobile-700x350.jpg
│
└── screenshots/              # Screenshots generados (se borran en cleanup)
    ├── admin/
    └── ecommerce/
```

---

## Flujo de Ejecución

```
┌─────────────────────────────────────────────────────────────┐
│  npx tsx src/module/categories/e2e/index.ts                 │
├─────────────────────────────────────────────────────────────┤
│  1. Inicializar browser (Puppeteer headless)                │
│  2. Login al admin                                          │
│  3. Ejecutar tests ADMIN                                    │
│     - Create → List → Create Child → Update → Delete        │
│     - Validation                                            │
│  4. Ejecutar tests ECOMMERCE                                │
│     - Navigation → Category Page → Not Found                │
│  5. Cerrar browser                                          │
│  6. Mostrar resumen                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  npx tsx src/module/categories/e2e/cleanup.ts <fecha>       │
├─────────────────────────────────────────────────────────────┤
│  1. Conectar a Docker MySQL                                 │
│  2. Mostrar categorías a eliminar                           │
│  3. DELETE subcategorías (parent_id IS NOT NULL)            │
│  4. DELETE categorías padre                                 │
│  5. Eliminar carpeta screenshots/                           │
│  6. Verificar limpieza                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Estrategia de Datos de Test

### Nombres Únicos con Timestamp

Cada ejecución genera un sufijo único basado en fecha y hora:

```typescript
// data.ts
const TEST_SUFFIX = `-test-20260126-151057`  // -test-YYYYMMDD-HHMMSS

export const TEST_CATEGORIES = {
  parent: {
    name: `Electrónica${TEST_SUFFIX}`,     // "Electrónica-test-20260126-151057"
    slug: `electronica${TEST_SUFFIX}`,
    // ...
  }
}
```

### Beneficios

| Problema | Solución |
|----------|----------|
| Conflicto con data real | Nombres únicos nunca colisionan |
| Tests paralelos interfieren | Cada ejecución tiene su sufijo |
| Data residual | Fácil de identificar y limpiar por fecha |
| Identificar data de test | Patrón `%-test-%` en SQL |

### Limpieza Automática

El cleanup usa el patrón del sufijo para identificar y eliminar:

```sql
-- Subcategorías primero (FK constraint)
DELETE FROM categories WHERE name LIKE '%-test-20260126-%' AND parent_id IS NOT NULL;

-- Luego padres
DELETE FROM categories WHERE name LIKE '%-test-20260126-%';
```

---

## Configuración Docker

El cleanup se conecta automáticamente a Docker MySQL:

```typescript
// cleanup.ts
const DOCKER_CONTAINER = 'ajk-ecommerce'
const MYSQL_USER = 'root'
const MYSQL_PASSWORD = '12345678'
const MYSQL_DATABASE = 'ajkecommerce'
```

**Nota:** Ajustar estos valores según tu configuración local.

---

## Estrategia de Selectores

### Prioridad (de mayor a menor)

1. **Roles HTML5/ARIA** (Preferido)
```typescript
await page.$('button[type="submit"]')
await page.$('input[name="name"]')
await page.$('table')
await page.$('nav')
```

2. **Atributos Semánticos**
```typescript
await page.$('a[href="/admin/categories/new"]')
await page.$('input[required]')
```

3. **Texto/Contenido**
```typescript
await page.evaluate(() => {
  const buttons = document.querySelectorAll('button')
  for (const btn of buttons) {
    if (btn.textContent?.includes('Guardar')) {
      btn.click()
      return true
    }
  }
})
```

4. **data-testid** (Último recurso)
```typescript
await page.$('[data-testid="category-row-123"]')
```

---

## Screenshots

### Nomenclatura

```
screenshots/{area}/{test}/{nombre}_{timestamp}.png

Ejemplos:
- admin/create/01-form-empty_2026-01-26T20-11-06-046Z.png
- ecommerce/nav/01-home_2026-01-26T20-12-50-733Z.png
```

### Screenshots Esenciales (12 total)

| Test | Screenshot | Propósito |
|------|------------|-----------|
| Login | `admin/login-success` | Verificar acceso |
| Create | `admin/create/01-form-empty` | Formulario inicial |
| Create | `admin/create/06-success` | Categoría creada |
| List | `admin/list/01-table` | Tabla de categorías |
| Create Child | `admin/create-child/03-success` | Subcategoría creada |
| Update | `admin/update/01-form-loaded` | Datos cargados |
| Update | `admin/update/04-verify` | Cambios guardados |
| Validation | `admin/validation/name-required` | Error validación |
| Navigation | `ecommerce/nav/01-home` | Home con nav |
| Navigation | `ecommerce/nav/menu-01` | Menú categorías |
| Category | `ecommerce/category/01-full` | Página completa |
| Not Found | `ecommerce/not-found/01-page` | Página 404 |

---

## Tests Detallados

### ADMIN

#### 1. CREATE - Crear Categoría
**Archivo:** `admin/create.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/categories/new` | Formulario vacío |
| 2 | Llenar nombre, slug, descripción | Campos aceptan texto |
| 3 | Seleccionar show_nav = Sí | Select funciona |
| 4 | Subir imagen categoría (400x400) | Preview visible |
| 5 | Subir banners (desktop + mobile) | Previews visibles |
| 6 | Llenar campos banner (título, CTA) | Campos funcionan |
| 7 | Click submit | Redirección a lista |
| 8 | Verificar en lista | Categoría visible |

#### 2. LIST - Listar Categorías
**Archivo:** `admin/list.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/categories` | Tabla visible |
| 2 | Verificar columnas | Imagen, Nombre, En Menú, Acciones |
| 3 | Verificar badges | "Visible" verde, "Oculto" gris |
| 4 | Click subcategorías | Navega a `?parent={id}` |
| 5 | Verificar paginación | Controles funcionan |

#### 3. CREATE-CHILD - Crear Subcategoría
**Archivo:** `admin/create-child.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/categories/new?parent={id}` | Contexto padre visible |
| 2 | Llenar campos básicos | Formulario funciona |
| 3 | Submit | Redirección a lista del padre |
| 4 | Verificar en lista | Subcategoría visible |

#### 4. UPDATE - Editar Categoría
**Archivo:** `admin/update.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/admin/categories/{id}` | Campos pre-llenados |
| 2 | Verificar info auditoría | Creado/Actualizado visible |
| 3 | Modificar descripción | Campo editable |
| 4 | Submit | Toast éxito |
| 5 | Re-abrir | Cambios persistieron |

#### 5. DELETE - Eliminar Categoría
**Archivo:** `admin/delete.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Click menú acciones | Menú despliega |
| 2 | Click "Eliminar" | Modal confirmación |
| 3 | Click "Cancelar" | Modal cierra |
| 4 | Repetir y confirmar | Categoría eliminada |

#### 6. VALIDATION - Validaciones
**Archivo:** `admin/validation.test.ts`

| Caso | Acción | Validación |
|------|--------|------------|
| Nombre vacío | Submit sin nombre | Error "requerido" |
| Solo espacios | Nombre con espacios | Error validación |
| Slug normalizado | Nombre con tildes | Slug sin tildes |

### ECOMMERCE

#### 7. NAVIGATION - Navegación
**Archivo:** `ecommerce/navigation.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/` | Home carga |
| 2 | Verificar nav | Links categorías visibles |
| 3 | Verificar show_nav | Solo visibles en nav |
| 4 | Click categoría | Navega a página |
| 5 | Abrir menú categorías | Menú despliega |
| 6 | Ver subcategorías | Hijos visibles |

#### 8. CATEGORY-PAGE - Página Categoría
**Archivo:** `ecommerce/category-page.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/categoria/{slug}` | Página carga |
| 2 | Verificar banner | Imagen visible |
| 3 | Verificar título banner | Texto correcto |
| 4 | Verificar CTA | Botón funciona |
| 5 | Verificar descripción | Texto visible |
| 6 | Verificar productos | Grid o estado vacío |

#### 9. NOT-FOUND - Página 404
**Archivo:** `ecommerce/not-found.test.ts`

| Paso | Acción | Validación |
|------|--------|------------|
| 1 | Navegar a `/categoria/xyz123` | Página 404 |
| 2 | Verificar mensaje | "No encontrada" |
| 3 | Verificar sugerencias | Otras categorías |
| 4 | Click sugerencia | Navega correctamente |

---

## Datos de Prueba

```typescript
// data.ts
export const TEST_CATEGORIES = {
  parent: {
    name: `Electrónica${TEST_SUFFIX}`,
    slug: `electronica${TEST_SUFFIX}`,
    description: 'Productos electrónicos de alta calidad para el hogar y oficina.',
    showNav: '1',
    bannerTitle: 'Electrónica de Alta Calidad',
    bannerCtaText: 'Ver Productos',
    bannerCtaLink: '/search?category=electronica'
  },
  child: {
    name: `Smartphones${TEST_SUFFIX}`,
    slug: `smartphones${TEST_SUFFIX}`,
    description: 'Los mejores smartphones del mercado.',
    showNav: '1'
  },
  forDelete: {
    name: `ParaEliminar${TEST_SUFFIX}`,
    slug: `para-eliminar${TEST_SUFFIX}`,
    showNav: '0'
  }
}
```

---

## Imágenes de Prueba (fixtures/)

| Archivo | Dimensiones | Uso |
|---------|-------------|-----|
| `test-category-400x400.jpg` | 400x400 | Imagen categoría |
| `test-banner-desktop-1400x400.jpg` | 1400x400 | Banner desktop |
| `test-banner-mobile-700x350.jpg` | 700x350 | Banner mobile |

---

## Utilidades (utils.ts)

```typescript
// Re-exports de browser utils
export { initBrowser, closeBrowser, getPage, goto, login, ... }

// Módulo específico
export const SCREENSHOTS_DIR = 'src/module/categories/e2e/screenshots'
export const FIXTURES_DIR = 'src/module/categories/e2e/fixtures'

// Helpers
export async function takeScreenshot(name: string, subFolder: string): Promise<string>
export function log(message: string): void
export function wait(ms: number): Promise<void>
export async function uploadImageToField(fieldLabel: string, imagePath: string): Promise<boolean>
```

---

## Checklist de Implementación

### Archivos Base
- [x] `TESTING-SPEC.md` - Especificación
- [x] `index.ts` - Orquestador
- [x] `data.ts` - Datos de prueba
- [x] `utils.ts` - Utilidades
- [x] `cleanup.ts` - Limpieza automática

### Tests Admin
- [x] `admin/create.test.ts`
- [x] `admin/list.test.ts`
- [x] `admin/create-child.test.ts`
- [x] `admin/update.test.ts`
- [x] `admin/delete.test.ts`
- [x] `admin/validation.test.ts`

### Tests Ecommerce
- [x] `ecommerce/navigation.test.ts`
- [x] `ecommerce/category-page.test.ts`
- [x] `ecommerce/not-found.test.ts`

### Fixtures
- [x] `test-category-400x400.jpg`
- [x] `test-banner-desktop-1400x400.jpg`
- [x] `test-banner-mobile-700x350.jpg`

---

## Aplicar a Otros Módulos

Para crear E2E tests en otro módulo, seguir esta estructura:

### 1. Crear carpeta e2e en el módulo
```
src/module/{modulo}/e2e/
```

### 2. Copiar archivos base
- `TESTING-SPEC.md` (adaptar contenido)
- `index.ts` (adaptar imports y tests)
- `data.ts` (definir datos del módulo)
- `utils.ts` (copiar y ajustar paths)
- `cleanup.ts` (ajustar tabla y patrón SQL)

### 3. Crear tests según flujos del módulo
- Identificar operaciones CRUD
- Identificar páginas públicas
- Definir screenshots esenciales

### 4. Crear fixtures si necesario
- Imágenes de prueba
- Archivos de prueba

### 5. Probar flujo completo
```bash
# Ejecutar tests
npx tsx src/module/{modulo}/e2e/index.ts

# Limpiar
npx tsx src/module/{modulo}/e2e/cleanup.ts <fecha>
```

---

## Output Esperado

```
Test suffix: -test-20260126-151057
╔════════════════════════════════════════════╗
║  CATEGORIES MODULE - E2E TESTS             ║
╚════════════════════════════════════════════╝

Initializing browser...
Logging in to admin...
[20:10:57]   Login successful!
  Screenshot: admin/login-success_2026-01-26T20-11-03-689Z.png

┌────────────────────────────────────────────┐
│  ADMIN TESTS                               │
└────────────────────────────────────────────┘

[20:11:03] === CREATE CATEGORY TESTS ===
...
[20:11:48] === CREATE TESTS COMPLETED ===
[20:11:48] === LIST CATEGORY TESTS ===
...

┌────────────────────────────────────────────┐
│  ECOMMERCE TESTS                           │
└────────────────────────────────────────────┘

[20:12:47] === NAVIGATION TESTS ===
...

╔════════════════════════════════════════════╗
║  ALL TESTS COMPLETED                       ║
╚════════════════════════════════════════════╝

Screenshots saved to: src/module/categories/e2e/screenshots/
```

```
🧹 Categories E2E Cleanup
   Eliminando: data de test del 2026-01-26
   Pattern: %-test-20260126-%

📋 Categorías a eliminar:
id    name                              parent_id
113   Electrónica-test-20260126-151057  NULL
114   Smartphones-test-20260126-151057  76
115   ParaEliminar-test-20260126-151057 NULL

🗑️  Eliminando subcategorías...
🗑️  Eliminando categorías padre...
🗑️  Eliminando screenshots...
   Screenshots eliminados

✅ Limpieza completada. Data de test y screenshots eliminados.
```

---

**Módulo: Categories**
**Estado: Completado**
**Última actualización: 2026-01-26**
