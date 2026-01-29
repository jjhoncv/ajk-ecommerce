# Brands E2E Testing Specification

## Estado del Módulo (TDD Approach)

### Existe
- **Core**: `src/module/brands/core/` (Brand.model.ts, Brand.repository.ts, Brand.mapper.ts)
- **Tabla BD**: `brands` (id, name, created_at, updated_at, created_by, updated_by)

### No Existe (a implementar)
- **Admin UI**: `src/app/admin/brands/` - Páginas de listado, crear, editar
- **Admin Components**: `src/module/brands/components/admin/` - Componentes de UI
- **Admin Service**: `src/module/brands/service/` - Servicio de brands
- **API Admin**: `src/app/api/admin/brands/` - Endpoints REST

---

## Tests E2E

### Admin CRUD (`admin/01-crud.ts`)

#### TC-BRAND-001: Navegación al módulo
- **Precondición**: Usuario admin logueado
- **Pasos**:
  1. Ir a `/admin/brands`
  2. Verificar que carga la página
- **Resultado esperado**: Página muestra título "Marcas" y botón "Nueva marca"
- **Estado TDD**: FALLARÁ (página no existe)

#### TC-BRAND-002: Crear marca
- **Precondición**: Usuario admin en `/admin/brands`
- **Pasos**:
  1. Click en "Nueva marca"
  2. Llenar campo "Nombre" con datos de test
  3. Click en "Guardar"
- **Resultado esperado**:
  - Redirección a listado
  - Mensaje de éxito
  - Marca aparece en tabla
- **Estado TDD**: FALLARÁ (formulario no existe)

#### TC-BRAND-003: Editar marca
- **Precondición**: Marca de test creada
- **Pasos**:
  1. Buscar marca en tabla
  2. Click en menú de acciones
  3. Click en "Editar"
  4. Modificar nombre
  5. Click en "Guardar"
- **Resultado esperado**:
  - Nombre actualizado en tabla
  - Mensaje de éxito
- **Estado TDD**: FALLARÁ (edición no existe)

#### TC-BRAND-004: Eliminar marca
- **Precondición**: Marca de test para eliminar creada
- **Pasos**:
  1. Buscar marca en tabla
  2. Click en menú de acciones
  3. Click en "Eliminar"
  4. Confirmar en modal
- **Resultado esperado**:
  - Marca desaparece de tabla
  - Mensaje de éxito
- **Estado TDD**: FALLARÁ (eliminación no existe)

#### TC-BRAND-005: Cancelar eliminación
- **Precondición**: Marca de test creada
- **Pasos**:
  1. Buscar marca en tabla
  2. Click en menú de acciones
  3. Click en "Eliminar"
  4. Click en "Cancelar" en modal
- **Resultado esperado**:
  - Modal se cierra
  - Marca sigue en tabla
- **Estado TDD**: FALLARÁ

#### TC-BRAND-006: Validación campo vacío
- **Precondición**: Usuario en formulario de nueva marca
- **Pasos**:
  1. Dejar campo nombre vacío
  2. Click en "Guardar"
- **Resultado esperado**:
  - Mensaje de error de validación
  - No se crea la marca
- **Estado TDD**: FALLARÁ

---

## Estructura de Archivos E2E

```
src/module/brands/e2e/
├── TESTING-SPEC.md      # Este archivo
├── data.ts              # Datos de prueba
├── utils.ts             # Utilidades del módulo
├── cleanup.ts           # Script de limpieza
├── index.ts             # Runner principal
└── admin/
    └── 01-crud.ts       # Tests CRUD admin
```

---

## Datos de Prueba

### Marcas de Test
| Variable | Nombre | Propósito |
|----------|--------|-----------|
| `brand` | Nike-test-{suffix} | Marca principal para crear |
| `brandEdited` | Nike Updated-test-{suffix} | Nombre editado |
| `brandForDelete` | Adidas-test-{suffix} | Marca para eliminar |

### Patrón de Nombres
- Formato: `{nombre}-test-{YYYYMMDD}-{HHMMSS}`
- Ejemplo: `Nike-test-20260126-143022`
- Permite cleanup por fecha

---

## Comandos

```bash
# Ejecutar tests
npx tsx src/module/brands/e2e/index.ts

# Cleanup por fecha
npx tsx src/module/brands/e2e/cleanup.ts 2026-01-26

# Cleanup todo
npx tsx src/module/brands/e2e/cleanup.ts all
```

---

## Notas de Implementación

### Para que los tests pasen, se debe crear:

1. **Páginas Admin**:
   - `src/app/admin/brands/page.tsx` - Listado
   - `src/app/admin/brands/new/page.tsx` - Crear
   - `src/app/admin/brands/[id]/page.tsx` - Editar

2. **Componentes**:
   - `BrandListView.tsx` - Vista de lista con tabla
   - `BrandForm.tsx` - Formulario crear/editar

3. **Service**:
   - `src/module/brands/service/brand.ts` - Wrapper del model

4. **API Routes** (opcional, puede usar server actions):
   - `POST /api/admin/brands` - Crear
   - `PUT /api/admin/brands/[id]` - Editar
   - `DELETE /api/admin/brands/[id]` - Eliminar

### Patrones a seguir (referencia: categories)
- Usar `LayoutPageAdmin` para layout
- Usar `PageUI`, `PageTitle`, `PageButton` para estructura
- Usar componente Table compartido
- Usar modal de confirmación para delete
