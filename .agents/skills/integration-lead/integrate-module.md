# Skill: Integrar Módulo Nuevo con Módulo Existente

## Rol
Integration Lead

## Trigger
- Project Owner detecta que nuevo módulo requiere integración
- Module Lead completa módulo standalone y necesita integración
- Post-creación: módulo existe pero falta integrarlo

## Inputs
- `.agents/specs/[modulo]-testing-spec.md` (sección Integración)
- Módulo nuevo ya creado (branch feature/[modulo])
- Nombre del módulo existente a integrar

---

## 🔍 FASE 1: ENTENDER MÓDULO EXISTENTE

### 1.1 Leer Estructura Completa

```bash
# Ver estructura del módulo existente
ls -la src/module/[moduloExistente]/

# Core - entender el modelo
cat src/module/[moduloExistente]/core/[Entidad].model.ts
cat src/module/[moduloExistente]/core/[Entidad].repository.ts
cat src/module/[moduloExistente]/core/[Entidad].mapper.ts

# Service - entender lógica de negocio
cat src/module/[moduloExistente]/service/[entidad]/index.ts

# Types - campos disponibles
grep -A 100 "interface [Entidad]" src/types/database/database.d.ts

# UI Admin - donde agregar selector
cat src/app/admin/[moduloExistente]/[id]/page.tsx

# Componentes Admin
cat src/module/[moduloExistente]/components/admin/[Entidad]Fields.tsx
```

### 1.2 Entender PROFUNDAMENTE el Módulo Existente

**CRÍTICO**: No solo leer, sino ENTENDER cómo funciona el módulo existente.

```bash
# BACKEND: Entender el modelo de datos
cat src/module/[moduloExistente]/core/[Entidad].model.ts
cat src/module/[moduloExistente]/core/[Entidad].repository.ts
cat src/module/[moduloExistente]/core/[Entidad].mapper.ts

# BACKEND: Entender servicios y lógica de negocio
cat src/module/[moduloExistente]/service/[entidad]/index.ts
cat src/module/[moduloExistente]/services/types.ts
cat src/module/[moduloExistente]/services/hydrators.ts

# FRONTEND ADMIN: Entender componentes actuales
cat src/module/[moduloExistente]/components/admin/[Entidad]Fields.tsx
cat src/module/[moduloExistente]/components/admin/[Entidad]ListView.tsx
cat src/app/admin/[moduloExistente]/[id]/page.tsx

# FRONTEND ECOMMERCE: Entender componentes públicos
cat src/module/[moduloExistente]/components/ecommerce/[Entidad]Card.tsx
cat src/module/[moduloExistente]/components/ecommerce/[Entidad]Detail.tsx
# O buscar componentes compartidos
cat src/components/ui/ProductCard/ProductCard.tsx
cat src/app/productos/[slug]/page.tsx

# E2E EXISTENTES: Entender qué tests ya existen
ls -la src/module/[moduloExistente]/e2e/
cat src/module/[moduloExistente]/e2e/index.ts
```

**Preguntas a responder:**
- ¿Qué relaciones ya tiene el módulo? (FKs, pivots)
- ¿Cómo se muestran los datos relacionados en admin?
- ¿Qué información se muestra en ProductCard?
- ¿Qué información se muestra en página de detalle?
- ¿Qué tests E2E ya existen que podrían romperse?

### 1.3 Identificar Puntos de Integración

Documentar:
```
ANÁLISIS: [moduloExistente]
===========================

CORE:
- Model: [métodos existentes]
- Repository: [queries existentes]
- Mapper: [campos mapeados]

RELACIONES EXISTENTES:
- [Ya tiene FK a X]
- [Ya tiene pivot table con Y]

UI ADMIN:
- Edit page usa: [componentes]
- Campos en formulario: [lista]
- Tabs existentes: [lista o ninguno]

ECOMMERCE:
- Rutas públicas: [/productos/[slug], etc]
- Componentes: [ProductDetail, ProductCard, etc]
- Datos mostrados: [campos visibles]

PUNTO DE INTEGRACIÓN PROPUESTO:
- Admin: [donde agregar selector]
- Ecommerce: [donde mostrar relación]
```

---

## 🗄️ FASE 2: VERIFICAR Y CREAR TABLA PIVOTE (DBA)

### 2.0 PRIMERO: Verificar Tablas Existentes

**CRÍTICO**: Antes de crear cualquier tabla, verificar qué ya existe:

```bash
# Ver TODAS las tablas del sistema
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES;"

# Buscar tablas relacionadas con el módulo existente
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '%product%';"
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '%tag%';"

# Ver estructura de tablas pivote existentes (ejemplos del sistema)
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE product_categories;"
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE variant_attribute_options;"

# Verificar si la tabla pivote que necesitamos YA EXISTE
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE 'product_tags';"
```

### Escenarios posibles:

| Escenario | Acción |
|-----------|--------|
| **Tabla pivote YA existe** | NO crear. Usar la existente. Verificar estructura. |
| **FK ya existe en tabla principal** | NO crear pivote. Es relación 1:N, no M:N. |
| **No existe ninguna relación** | Crear tabla pivote nueva. |

### Si la tabla YA EXISTE:

```bash
# Ver su estructura actual
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE product_tags;"

# Ver datos existentes (si hay)
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SELECT COUNT(*) FROM product_tags;"
```

**Si existe y tiene la estructura correcta:**
- NO crear nada
- Saltar a FASE 3 (Backend)
- Documentar: "Tabla pivote ya existía"

**Si existe pero con estructura diferente:**
- Analizar diferencias
- Preguntar antes de modificar
- Posiblemente solo agregar índices faltantes

### 2.1 Crear Tabla (SOLO si no existe)

```bash
# SOLO ejecutar si verificación anterior confirmó que NO existe
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
CREATE TABLE [moduloExistente]_[nuevoModulo]s (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  [moduloExistente]_id CHAR(36) NOT NULL,
  [nuevoModulo]_id CHAR(36) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY ([moduloExistente]_id) REFERENCES [moduloExistente]s(id) ON DELETE CASCADE,
  FOREIGN KEY ([nuevoModulo]_id) REFERENCES [nuevoModulo]s(id) ON DELETE CASCADE,

  UNIQUE KEY unique_[moduloExistente]_[nuevoModulo] ([moduloExistente]_id, [nuevoModulo]_id),
  INDEX idx_[moduloExistente]_id ([moduloExistente]_id),
  INDEX idx_[nuevoModulo]_id ([nuevoModulo]_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"
```

### 2.2 Regenerar Types

```bash
pnpm generate
```

### 2.3 Verificar

```bash
# Ver tabla creada
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE [moduloExistente]_[nuevoModulo]s;"

# Ver en types
grep -A 10 "[ModuloExistente][NuevoModulo]" src/types/database/database.d.ts
```

---

## ⚙️ FASE 3: EXTENDER BACKEND DEL MÓDULO EXISTENTE

### 3.1 Agregar al Repository

En `src/module/[moduloExistente]/core/[Entidad].repository.ts`:

```typescript
// Agregar método para obtener con relación
async findByIdWith[NuevoModulo]s(id: string): Promise<[Entidad] | null> {
  const [rows] = await executeQuery<[Entidad][]>({
    query: `
      SELECT e.*,
        GROUP_CONCAT(DISTINCT n.id) as [nuevoModulo]_ids,
        GROUP_CONCAT(DISTINCT n.name) as [nuevoModulo]_names
      FROM [moduloExistente]s e
      LEFT JOIN [moduloExistente]_[nuevoModulo]s rel ON e.id = rel.[moduloExistente]_id
      LEFT JOIN [nuevoModulo]s n ON rel.[nuevoModulo]_id = n.id
      WHERE e.id = ?
      GROUP BY e.id
    `,
    values: [id]
  })
  return rows[0] || null
}

// Agregar método para asociar
async set[NuevoModulo]s(id: string, [nuevoModulo]Ids: string[]): Promise<void> {
  // Eliminar asociaciones existentes
  await executeQuery({
    query: 'DELETE FROM [moduloExistente]_[nuevoModulo]s WHERE [moduloExistente]_id = ?',
    values: [id]
  })

  // Crear nuevas asociaciones
  if ([nuevoModulo]Ids.length > 0) {
    const values = [nuevoModulo]Ids.map((nId, index) =>
      `(UUID(), '${id}', '${nId}', ${index})`
    ).join(', ')

    await executeQuery({
      query: `
        INSERT INTO [moduloExistente]_[nuevoModulo]s
        (id, [moduloExistente]_id, [nuevoModulo]_id, display_order)
        VALUES ${values}
      `
    })
  }
}

// Agregar método para obtener [nuevoModulo]s de un [moduloExistente]
async get[NuevoModulo]s(id: string): Promise<[NuevoModulo][]> {
  return executeQuery<[NuevoModulo][]>({
    query: `
      SELECT n.* FROM [nuevoModulo]s n
      INNER JOIN [moduloExistente]_[nuevoModulo]s rel ON n.id = rel.[nuevoModulo]_id
      WHERE rel.[moduloExistente]_id = ?
      ORDER BY rel.display_order
    `,
    values: [id]
  })
}
```

### 3.2 Agregar al Service (Hydrator para Ecommerce)

En `src/module/[moduloExistente]/services/hydrators.ts`:

```typescript
// Agregar hydrator que incluye [nuevoModulo]s
export function hydrate[Entidad]With[NuevoModulo]s(
  row: any
): [Entidad]With[NuevoModulo]s {
  return {
    ...hydrate[Entidad](row),
    [nuevoModulo]s: row.[nuevoModulo]_ids
      ? row.[nuevoModulo]_ids.split(',').map((id: string, i: number) => ({
          id,
          name: row.[nuevoModulo]_names?.split(',')[i] || ''
        }))
      : []
  }
}
```

### 3.3 Crear/Extender API de Asociación

Crear `src/app/api/admin/[moduloExistente]/[id]/[nuevoModulo]s/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { [Entidad]Repository } from '@/module/[moduloExistente]/core'

// GET - Obtener [nuevoModulo]s asociados
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const [nuevoModulo]s = await [Entidad]Repository.get[NuevoModulo]s(params.id)
  return NextResponse.json([nuevoModulo]s)
}

// PUT - Actualizar asociaciones
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { [nuevoModulo]Ids } = await request.json()
  await [Entidad]Repository.set[NuevoModulo]s(params.id, [nuevoModulo]Ids)
  return NextResponse.json({ success: true })
}
```

---

## 🎨 FASE 4: EXTENDER FRONTEND ADMIN

### 4.1 Agregar Selector en Edit Page

En `src/app/admin/[moduloExistente]/[id]/page.tsx`:

```typescript
// Imports adicionales
import { useEffect, useState } from 'react'

// Estado para [nuevoModulo]s
const [available[NuevoModulo]s, setAvailable[NuevoModulo]s] = useState<[NuevoModulo][]>([])
const [selected[NuevoModulo]Ids, setSelected[NuevoModulo]Ids] = useState<string[]>([])

// Cargar [nuevoModulo]s disponibles y seleccionados
useEffect(() => {
  // Cargar todos los [nuevoModulo]s activos
  fetch('/api/admin/[nuevoModulo]s?active=true')
    .then(r => r.json())
    .then(setAvailable[NuevoModulo]s)

  // Cargar [nuevoModulo]s asociados al [moduloExistente]
  fetch(`/api/admin/[moduloExistente]s/${id}/[nuevoModulo]s`)
    .then(r => r.json())
    .then(data => setSelected[NuevoModulo]Ids(data.map(t => t.id)))
}, [id])

// En el formulario, agregar selector múltiple
<div className="space-y-2">
  <label>[NuevoModulo]s</label>
  <div className="flex flex-wrap gap-2">
    {available[NuevoModulo]s.map(item => (
      <button
        key={item.id}
        type="button"
        onClick={() => {
          setSelected[NuevoModulo]Ids(prev =>
            prev.includes(item.id)
              ? prev.filter(id => id !== item.id)
              : [...prev, item.id]
          )
        }}
        className={`px-3 py-1 rounded-full text-sm ${
          selected[NuevoModulo]Ids.includes(item.id)
            ? 'bg-primary text-white'
            : 'bg-gray-200'
        }`}
        style={{
          backgroundColor: selected[NuevoModulo]Ids.includes(item.id)
            ? item.color
            : undefined
        }}
      >
        {item.name}
      </button>
    ))}
  </div>
</div>

// En el submit, guardar asociaciones
const onSubmit = async (data) => {
  // Guardar [moduloExistente]
  await fetch(`/api/admin/[moduloExistente]s/${id}`, { ... })

  // Guardar asociaciones de [nuevoModulo]s
  await fetch(`/api/admin/[moduloExistente]s/${id}/[nuevoModulo]s`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ [nuevoModulo]Ids: selected[NuevoModulo]Ids })
  })
}
```

### 4.2 Mostrar en ListView (Badges)

En `src/module/[moduloExistente]/components/admin/[Entidad]ListView.tsx`:

```typescript
// En las columnas de la tabla, agregar columna de [nuevoModulo]s
{
  header: '[NuevoModulo]s',
  accessor: '[nuevoModulo]s',
  cell: (row) => (
    <div className="flex flex-wrap gap-1">
      {row.[nuevoModulo]s?.map(item => (
        <span
          key={item.id}
          className="px-2 py-0.5 rounded-full text-xs text-white"
          style={{ backgroundColor: item.color || '#6B7280' }}
        >
          {item.name}
        </span>
      ))}
    </div>
  )
}
```

---

## 🛒 FASE 5: EXTENDER FRONTEND ECOMMERCE (Si aplica)

### 5.1 Mostrar en Cards de Producto

En `src/components/ui/ProductCard/ProductCard.tsx` o similar:

```typescript
// Agregar badges de [nuevoModulo]s
{product.[nuevoModulo]s?.map(item => (
  <span
    key={item.id}
    className="absolute top-2 left-2 px-2 py-1 rounded text-xs text-white"
    style={{ backgroundColor: item.color }}
  >
    {item.name}
  </span>
))}
```

### 5.2 Mostrar en Página de Detalle

En `src/app/productos/[slug]/page.tsx` o componente de detalle:

```typescript
// Sección de [nuevoModulo]s
{product.[nuevoModulo]s?.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-4">
    {product.[nuevoModulo]s.map(item => (
      <span
        key={item.id}
        className="px-3 py-1 rounded-full text-sm"
        style={{ backgroundColor: item.color, color: 'white' }}
      >
        {item.name}
      </span>
    ))}
  </div>
)}
```

### 5.3 Agregar Filtro (Opcional)

En búsqueda o listados, agregar filtro por [nuevoModulo]:

```typescript
// Filtro por [nuevoModulo]
const [[nuevoModulo]Filter, set[NuevoModulo]Filter] = useState<string | null>(null)

// En query
const filteredProducts = products.filter(p =>
  ![nuevoModulo]Filter || p.[nuevoModulo]s?.some(t => t.id === [nuevoModulo]Filter)
)
```

---

## 🧪 FASE 6: TESTS DE INTEGRACIÓN (QA)

### 6.0 PRIMERO: Ejecutar Tests E2E EXISTENTES (Regression)

**CRÍTICO**: Antes de agregar tests nuevos, verificar que no rompimos nada.

```bash
# Ejecutar tests E2E existentes del módulo que modificamos
npx tsx src/module/[moduloExistente]/e2e/index.ts

# Si hay tests de admin
npx tsx src/module/[moduloExistente]/e2e/index-admin.ts

# Si hay tests de ecommerce
npx tsx src/module/[moduloExistente]/e2e/index-ecommerce.ts
```

**Si algún test existente FALLA:**
- La integración rompió algo
- Identificar qué se rompió
- Corregir ANTES de continuar
- Re-ejecutar hasta que pasen

**Log obligatorio:**
```bash
./.agents/scripts/log.sh "QA" "Tests existentes de [moduloExistente]: X/Y pasaron"
```

### 6.1 Crear Tests E2E de Integración

En `src/module/[moduloExistente]/e2e/integration/[nuevoModulo]s.ts`:

```typescript
// TC-INT-01: Asociar [nuevoModulo]s a [moduloExistente]
// TC-INT-02: Ver [nuevoModulo]s en edit page
// TC-INT-03: Guardar cambios de asociación
// TC-INT-04: Desasociar [nuevoModulo]s
// TC-INT-05: Ver [nuevoModulo]s en ecommerce - ProductCard
// TC-INT-06: Ver [nuevoModulo]s en ecommerce - ProductDetail
```

### 6.2 Screenshots de Integración

**Admin (validar selector funciona):**
```
screenshots/integration/admin/
├── admin-edit-without-[nuevoModulo]s.png      # Estado inicial
├── admin-edit-[nuevoModulo]-selector.png      # Selector visible
├── admin-edit-[nuevoModulo]s-selected.png     # Tags seleccionados
├── admin-edit-after-save.png                   # Después de guardar
└── admin-list-with-[nuevoModulo]-badges.png   # Lista con badges
```

**Ecommerce (validar modelo de negocio visual):**
```
screenshots/integration/ecommerce/
├── ecommerce-product-card-with-[nuevoModulo].png    # Card con tag badge
├── ecommerce-product-card-multiple-[nuevoModulo]s.png # Card con varios tags
├── ecommerce-product-detail-[nuevoModulo]s.png      # Detalle con tags
├── ecommerce-list-filtered-by-[nuevoModulo].png     # Filtrado (si aplica)
└── ecommerce-mobile-[nuevoModulo]-visible.png       # Responsive
```

### 6.3 Solicitar Validación a Module Lead

**IMPORTANTE**: Los screenshots de ecommerce requieren validación del Module Lead para confirmar que el modelo de negocio está correcto.

Notificar:
```
INTEGRACIÓN [nuevoModulo] con [moduloExistente] - SCREENSHOTS LISTOS
====================================================================

TIPO: Validación de integración ecommerce
ESTADO: Esperando validación de Module Lead

TESTS REGRESSION (existentes): [X]/[Y] pasaron ✅
TESTS INTEGRACIÓN (nuevos): [X]/[Y] pasaron

SCREENSHOTS ADMIN:
  - Selector de [nuevoModulo] funciona
  - Asociaciones se guardan
  - Badges visibles en lista

SCREENSHOTS ECOMMERCE:
  📸 ProductCard con [nuevoModulo] badge
  📸 ProductDetail con [nuevoModulo]s
  📸 Vista mobile

UBICACIÓN: src/module/[moduloExistente]/e2e/screenshots/integration/

SOLICITO: Validación de que visualización corresponde al modelo de negocio
- ¿Los tags se ven donde deben verse?
- ¿El diseño es apropiado (badges, colores, posición)?
- ¿La información mostrada es correcta?
```

---

## ✅ CHECKLIST FINAL

### Base de Datos
- [ ] Verificado que tabla pivote no existía previamente
- [ ] Tabla pivote creada (o usada existente)
- [ ] FK y constraints correctos
- [ ] Índices para performance
- [ ] Types regenerados

### Backend
- [ ] Leído y entendido módulo existente (model, repository, service)
- [ ] Repository extendido con métodos de relación
- [ ] Service/hydrator incluye relación
- [ ] API de asociación funciona

### Frontend Admin
- [ ] Leído y entendido componentes existentes
- [ ] Selector de [nuevoModulo]s en edit page
- [ ] Asociaciones se guardan correctamente
- [ ] ListView muestra badges

### Frontend Ecommerce
- [ ] Leído ProductCard/ProductDetail existentes
- [ ] ProductCard muestra badges de [nuevoModulo]
- [ ] ProductDetail muestra [nuevoModulo]s
- [ ] Vista responsive funciona
- [ ] Filtros funcionan (si aplica)

### QA - Regression
- [ ] Tests E2E EXISTENTES del módulo siguen pasando
- [ ] No se rompió ninguna funcionalidad previa

### QA - Integración
- [ ] Tests de integración nuevos pasan
- [ ] Screenshots de admin (selector, badges)
- [ ] Screenshots de ecommerce (ProductCard, ProductDetail)
- [ ] Screenshots de mobile

### Validación Module Lead
- [ ] Screenshots admin validados
- [ ] Screenshots ecommerce validados vs modelo de negocio
- [ ] Cumplimiento >= 90%

---

## Outputs
- Tabla pivote creada
- Backend extendido
- UI Admin con selector
- UI Ecommerce con visualización
- Tests de integración

## Activity Log

```bash
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Iniciando integración [nuevoModulo] con [moduloExistente]"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Tabla pivote creada: [moduloExistente]_[nuevoModulo]s"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Backend extendido: repository, service, API"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Frontend Admin: selector agregado en edit page"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Frontend Ecommerce: badges visibles en cards y detalle"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "INTEGRACIÓN COMPLETADA - [nuevoModulo] integrado con [moduloExistente]"
```
