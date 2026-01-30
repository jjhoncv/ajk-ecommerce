# Skill: Integrar Ecommerce con Backend Real

## Rol
Integrator

## Trigger
Module Lead indica que Admin UI y Ecommerce UI están aprobados (ambos >= 90%)

## Inputs
- Módulo con Admin aprobado
- Módulo con Ecommerce UI aprobado (funcionando con mocks)
- `.agents/specs/[modulo]-testing-spec.md`
- Branch de trabajo

---

## Prerequisitos

Antes de ejecutar este skill, verificar:

```
✅ Admin UI aprobado (screenshots validados) - FASE 1 COMPLETA
✅ Ecommerce UI Etapa 1 aprobado (mocks) - UI validada con datos mock
✅ Backend Ecommerce services creados
✅ Tests E2E Admin pasando
```

---

## ⚠️ IMPORTANTE: Backend es Fuente de Verdad

Los tipos del Backend son la **fuente de verdad**. Los mocks del Frontend pueden estar desactualizados.

**Tu responsabilidad**:
1. Detectar diferencias entre mocks y tipos reales
2. Comunicar cambios a Frontend
3. Coordinar iteración con Frontend + QA si es necesario

---

## Contexto

Durante el desarrollo, Frontend Ecommerce trabaja con **mocks** para:
1. No depender de datos reales del Admin
2. Permitir desarrollo paralelo
3. Validar UI independientemente

Ahora que ambos están aprobados, este agente:
1. Quita los mocks del Frontend Ecommerce
2. Conecta con los services reales del Backend
3. Ejecuta test de integración final

---

## Steps

### 1. Identificar Mocks en Frontend Ecommerce

Buscar archivos con mocks en:

```bash
# Buscar mocks en componentes ecommerce
grep -r "MOCK\|mockData\|// TODO: replace" src/module/[modulo]/components/ecommerce/
grep -r "MOCK\|mockData\|// TODO: replace" src/app/[modulo]/
```

Típicamente los mocks están en:
- `src/app/[modulo]/page.tsx` - Datos mock en lugar de service call
- `src/module/[modulo]/components/ecommerce/*.tsx` - Props hardcodeadas

### 2. Identificar Services del Backend

Verificar qué funciones están disponibles:

```typescript
// src/module/[modulo]/services/index.ts
export {
  get[Entidad]s,
  getActive[Entidad]s,
  getFeatured[Entidad]s,
  get[Entidad]BySlug
} from './[modulo]'
```

### 3. Decidir Tipo de Conexión

Según el caso de uso:

| Caso | Conexión | Razón |
|------|----------|-------|
| Listado público | SSR (page.tsx) | SEO, datos estáticos |
| Detalle de item | SSR (page.tsx) | SEO, meta tags dinámicos |
| Homepage section | SSR (page.tsx) | SEO |
| Galería dinámica | API (fetch) | Interactividad |
| Filtros en tiempo real | API (fetch) | UX fluida |
| Infinite scroll | API (fetch) | Carga progresiva |

**Regla general**: Si necesita SEO → SSR. Si es interactivo → API.

### 4. Reemplazar Mocks con SSR (Caso Común)

**Antes (con mock):**
```typescript
// src/app/[modulo]/page.tsx
export default async function [Modulo]sPage() {
  // TODO: replace with real data
  const mockItems = [
    { id: 1, name: 'Mock Item 1', slug: 'mock-1' },
    { id: 2, name: 'Mock Item 2', slug: 'mock-2' },
  ]

  return <[Entidad]Grid items={mockItems} />
}
```

**Después (con service real):**
```typescript
// src/app/[modulo]/page.tsx
import [Entidad]Service from '@/module/[modulo]/services'

export default async function [Modulo]sPage() {
  const items = await [Entidad]Service.getActive[Entidad]s()

  return <[Entidad]Grid items={items} />
}
```

### 5. Reemplazar Mocks en Detalle

**Antes:**
```typescript
// src/app/[modulo]/[slug]/page.tsx
export default async function [Entidad]Page({ params }: PageProps) {
  const { slug } = await params

  // TODO: replace with real data
  const mockItem = { id: 1, name: 'Mock', slug, description: 'Mock desc' }

  return <[Entidad]Detail item={mockItem} />
}
```

**Después:**
```typescript
// src/app/[modulo]/[slug]/page.tsx
import [Entidad]Service from '@/module/[modulo]/services'
import { notFound } from 'next/navigation'

export default async function [Entidad]Page({ params }: PageProps) {
  const { slug } = await params
  const item = await [Entidad]Service.get[Entidad]BySlug(slug)

  if (!item) {
    notFound()
  }

  return <[Entidad]Detail item={item} />
}
```

### 6. Reemplazar Mocks en Homepage (si aplica)

**Antes:**
```typescript
// src/app/page.tsx
// TODO: replace mock
const mockFeatured = [...]

<Featured[Entidad]s items={mockFeatured} />
```

**Después:**
```typescript
// src/app/page.tsx
import [Entidad]Service from '@/module/[modulo]/services'

const featured[Entidad]s = await [Entidad]Service.getFeatured[Entidad]s(3)

<Featured[Entidad]s items={featured[Entidad]s} />
```

### 7. Comparar Tipos Mock vs Reales

**PASO CRÍTICO**: Comparar lo que Frontend esperaba (mocks) vs lo que Backend retorna.

```bash
# Ver tipos que Frontend usó en mocks
grep -A 20 "mockItems\|mockData\|TODO: MOCK" src/app/[modulo]/

# Ver tipos reales del Backend
cat src/module/[modulo]/services/types.ts
```

### 8. Detectar Diferencias

Crear reporte de diferencias:

```
ANÁLISIS DE TIPOS - MOCK vs REAL
================================

TIPO MOCK (usado por Frontend):
{
  id: number
  name: string
  slug: string
  description: string
}

TIPO REAL (Backend):
{
  id: number
  name: string
  slug: string
  imageUrl: string | null    ← NUEVO
  description: string | null ← CAMBIÓ (ahora nullable)
  color: string              ← NUEVO
}

DIFERENCIAS DETECTADAS:
- [+] Campo 'imageUrl' nuevo (Frontend no lo maneja)
- [~] Campo 'description' ahora nullable (Frontend asume string)
- [+] Campo 'color' nuevo (Frontend no lo muestra)
```

### 9. Si HAY Diferencias → Comunicar a Frontend

```
NOTIFICACIÓN A FRONTEND
=======================
MÓDULO: [modulo]
INTEGRADOR: Detecté diferencias entre tus mocks y los datos reales

CAMBIOS QUE DEBES MANEJAR:

1. NUEVO CAMPO 'imageUrl':
   - Tipo: string | null
   - Dónde: [Entidad]Card, [Entidad]Detail
   - Acción: Agregar renderizado de imagen si existe

2. CAMPO 'description' AHORA NULLABLE:
   - Antes: string
   - Ahora: string | null
   - Acción: Agregar chequeo null antes de renderizar

3. NUEVO CAMPO 'color':
   - Tipo: string
   - Uso sugerido: Badge con color de fondo
   - Acción: Mostrar badge si deseas (opcional)

DESPUÉS DE TUS CAMBIOS:
- Notifica a QA para Etapa 2 de validación
```

### 10. Si NO HAY Diferencias → Continuar

Si los tipos coinciden exactamente, continuar con la integración directa.

### 11. Reemplazar Mocks (después de confirmar tipos)

### 12. Solicitar Validación QA - Etapa 2

Después de integrar (y después de que Frontend ajuste si hubo diferencias):

```
SOLICITUD A QA - ETAPA 2 (DATOS REALES)
=======================================
MÓDULO: [modulo]
TIPO: Ecommerce UI con datos reales
INTEGRADOR: Conexión completada

VERIFICAR:
- [ ] Datos del Admin se muestran correctamente
- [ ] Imágenes cargan (si hay campo imagen)
- [ ] Links funcionan (/[modulo]/[slug])
- [ ] Página 404 funciona con slug inexistente
- [ ] No hay errores de consola (tipos)
- [ ] Homepage section muestra items (si aplica)

PREREQUISITO: Datos deben existir en Admin
(usar datos creados durante tests E2E Admin)
```

### 13. Esperar Aprobación Etapa 2

QA ejecuta tests y toma screenshots con datos reales.
Module Lead valida screenshots.

- Si aprueba → Módulo completo
- Si rechaza → Iterar (puede requerir cambios en Frontend o Backend)

### 9. Commit

```bash
git add src/app/[modulo]/
git add src/app/page.tsx  # Si se modificó homepage

git commit -m "$(cat <<'EOF'
feat([modulo]): INTEGRATOR connect ecommerce with real backend

- Replace mocks with real service calls
- Pages now use SSR with [Entidad]Service
- Verified with E2E tests

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 10. Notificar a Module Lead

```
INTEGRACIÓN COMPLETADA: [modulo]
================================

MOCKS REMOVIDOS:
  - src/app/[modulo]/page.tsx
  - src/app/[modulo]/[slug]/page.tsx
  - src/app/page.tsx (homepage section)

CONEXIÓN:
  - Tipo: SSR (page.tsx directo)
  - Service: [Entidad]Service

VERIFICACIÓN:
  - Tests E2E ecommerce: PASSED
  - Datos reales cargando correctamente

COMMIT: feat([modulo]): INTEGRATOR connect ecommerce with real backend
```

---

## Outputs
- Mocks removidos de Frontend Ecommerce
- Páginas conectadas con services reales
- Tests de integración pasando
- Commit realizado

## Casos Especiales

### Si necesita API (no SSR)

Para casos donde se necesita fetch dinámico:

```typescript
// Crear API route si no existe
// src/app/api/[modulo]/route.ts
import [Entidad]Service from '@/module/[modulo]/services'

export async function GET() {
  const items = await [Entidad]Service.getActive[Entidad]s()
  return Response.json(items)
}

// En componente cliente:
'use client'
const [items, setItems] = useState([])

useEffect(() => {
  fetch('/api/[modulo]')
    .then(res => res.json())
    .then(setItems)
}, [])
```

### Si hay filtros dinámicos

```typescript
// API con query params
// src/app/api/[modulo]/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter')

  const items = await [Entidad]Service.get[Entidad]sFiltered(filter)
  return Response.json(items)
}
```

---

## NO Hacer
- ❌ NO integrar si Admin o Ecommerce UI no están aprobados
- ❌ NO cambiar la estructura de los componentes
- ❌ NO modificar los services del backend
- ❌ NO crear nuevos endpoints sin justificación (preferir SSR)
