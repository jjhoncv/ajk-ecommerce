# Skill: Crear y Ejecutar Tests E2E Exploratorios

## Rol
QA

## Trigger
Module Lead asigna tarea de crear tests (después de Frontend y Backend)

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- UI del admin ya funcionando
- API endpoints funcionando
- Branch de trabajo

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches

---

## PROHIBICIONES ABSOLUTAS - LEER PRIMERO

### NO INSTALAR NADA

```bash
# PROHIBIDO - NO ejecutar ninguno de estos comandos:
npm install playwright
npm install @playwright/test
npx playwright install
pnpm add playwright
pnpm add @playwright/test

# PROHIBIDO - NO crear archivo playwright.config.ts
```

### NO USAR PLAYWRIGHT

Este proyecto **YA TIENE** Puppeteer instalado y configurado. **NO usar Playwright**.

```typescript
// PROHIBIDO - NO importar de Playwright
import { test, expect } from '@playwright/test'

// CORRECTO - Usar las utilidades existentes de Puppeteer
import { initBrowser, getPage, login } from '../../../../tests/e2e/utils'
```

### USAR INFRAESTRUCTURA EXISTENTE

Antes de crear cualquier archivo, **LEER OBLIGATORIAMENTE**:
1. `tests/e2e/E2E-MODULE-INIT.md` - Documentación completa
2. `tests/e2e/utils/index.ts` - Funciones disponibles

### NO REVISAR TESTS DE OTROS MÓDULOS

- NO leer tests E2E de otros módulos (banners, brands, etc.)
- NO buscar "ejemplos" de tests en el codebase
- NO usar Glob/Grep para ver cómo lo hacen otros módulos

**Solo necesitas:**
1. Leer `tests/e2e/E2E-MODULE-INIT.md` y `tests/e2e/utils/index.ts`
2. Copiar los **TEMPLATES** de `.agents/skills/qa/templates/`
3. Reemplazar placeholders con el nombre del módulo

---

## CONFIGURACIÓN CRÍTICA

### Credenciales Admin (OBLIGATORIO)

```typescript
// Las credenciales REALES del admin son:
email: 'admin@ajk.com'
password: 'Admin123!'  // NOTA: Contraseña real, no placeholder
```

**NO usar placeholders** como `admin/12345678` - esos son solo ejemplos visuales del formulario.

### Detección de Puerto del Servidor

El servidor de desarrollo puede correr en diferentes puertos (3000, 3001, 3002, etc.):

```bash
# Verificar en qué puerto está corriendo
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || \
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
```

---

## VERIFICAR SERVIDOR ANTES DE EJECUTAR TESTS

**CRÍTICO**: Los tests E2E requieren que el servidor esté corriendo. SIEMPRE verificar antes de ejecutar.

```bash
# Verificar puerto 3000 (más común)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin

# Si devuelve 200 o 302 → servidor OK
# Si falla o devuelve 000 → servidor NO está corriendo
```

### Si el servidor NO está corriendo

```bash
# Opción 1: Iniciar en background (recomendado para tests)
pnpm dev &
sleep 10  # Esperar que inicie
```

### Manejar errores de servidor

Si el servidor devuelve 500 Internal Server Error:
1. **NO intentar ejecutar tests** - fallarán todos
2. **Reportar en activity.log** el problema encontrado
3. **Notificar a Module Lead** para que Frontend/Backend corrijan

---

## TEMPLATES

**TODOS los archivos E2E se crean desde templates.**

Ubicación de templates: `.agents/skills/qa/templates/`

| Template | Destino | Descripción |
|----------|---------|-------------|
| `data.template.ts` | `src/module/[modulo]/e2e/data.ts` | Datos de prueba con TEST_SUFFIX |
| `utils.template.ts` | `src/module/[modulo]/e2e/utils.ts` | Utilidades y re-exports |
| `index.template.ts` | `src/module/[modulo]/e2e/index.ts` | Runner principal |
| `crud.template.ts` | `src/module/[modulo]/e2e/admin/01-crud.ts` | Tests CRUD (8 test cases) |
| `cleanup.template.ts` | `src/module/[modulo]/e2e/cleanup.ts` | Limpieza de datos |

### Placeholders a Reemplazar

| Placeholder | Reemplazo | Ejemplo |
|-------------|-----------|---------|
| `__MODULE__` | MAYÚSCULAS | `TESTIMONIALS` |
| `__module__` | minúsculas | `testimonials` |
| `__Modulo__` | PascalCase | `Testimonials` |
| `__Entidad__` | PascalCase singular | `Testimonial` |

---

## Steps

### 1. Verificar Prerequisitos

```bash
# Verificar que páginas admin existen
ls src/app/admin/[modulo]/
# Debe mostrar: page.tsx, new/, [id]/

# Verificar que API existe
ls src/app/api/admin/[modulo]/

# Cambiar a branch
git checkout feature/[modulo]
```

### 2. Verificar Servidor Corriendo

```bash
# Verificar que responde
curl -s http://localhost:3000/admin/[modulo] | head -c 100
```

### 3. Crear Estructura E2E

```bash
mkdir -p src/module/[modulo]/e2e/fixtures
mkdir -p src/module/[modulo]/e2e/admin
mkdir -p src/module/[modulo]/e2e/screenshots
```

### 4. Copiar Templates y Reemplazar Placeholders

```bash
# data.ts
cp .agents/skills/qa/templates/data.template.ts src/module/[modulo]/e2e/data.ts
# Reemplazar: __MODULE__, __module__, __Entidad__

# utils.ts
cp .agents/skills/qa/templates/utils.template.ts src/module/[modulo]/e2e/utils.ts
# Reemplazar: __module__

# index.ts
cp .agents/skills/qa/templates/index.template.ts src/module/[modulo]/e2e/index.ts
# Reemplazar: __MODULE__, __module__, __Modulo__

# admin/01-crud.ts
cp .agents/skills/qa/templates/crud.template.ts src/module/[modulo]/e2e/admin/01-crud.ts
# Reemplazar: __MODULE__, __module__, __Modulo__

# cleanup.ts
cp .agents/skills/qa/templates/cleanup.template.ts src/module/[modulo]/e2e/cleanup.ts
# Reemplazar: __module__
```

### 5. Ajustar Campos según Spec

Leer el spec del módulo y ajustar `data.ts`:
- Agregar campos adicionales (description, is_active, rating, etc.)
- Ajustar nombres según el modelo de negocio

### 6. EJECUTAR LOS TESTS

**CRÍTICO: El agente QA DEBE ejecutar los tests, no solo crearlos.**

```bash
# Ejecutar tests exploratorios
npx tsx src/module/[modulo]/e2e/index.ts
```

### 7. Revisar Screenshots

```bash
ls -la src/module/[modulo]/e2e/screenshots/
```

Los screenshots sirven como evidencia visual de cada paso:
- `00-dashboard-after-login.png` - Login exitoso
- `01-sidebar-check.png` - Verificación del sidebar
- `02-list-page.png` - Página de listado
- `03-new-form-empty.png` - Formulario vacío
- `04-*` - Flujo de creación
- `05-*` - Flujo de edición
- `06-*` - Modal de eliminación
- `07-*` - Eliminación exitosa
- `08-*` - Validaciones

Si hay errores, habrá screenshots con sufijo `-ERROR`.

### 8. Notificar a Module Lead (NO HACER COMMIT)

**IMPORTANTE: QA NO hace commit hasta que Module Lead apruebe los screenshots.**

```
TESTS EJECUTADOS: [modulo]
================================

ESTADO: Esperando validación de screenshots

RESULTADOS:
  ✓ Passed: [X]
  ✗ Failed: [Y]

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/

SOLICITO: Validación de screenshots vs modelo de negocio
SKILL: .agents/skills/module-lead/validate-qa-screenshots.md
```

### 9. Esperar Respuesta de Module Lead

#### Si Module Lead APRUEBA (>= 90% cumplimiento):

```bash
git add src/module/[modulo]/e2e/

git commit -m "$(cat <<'EOF'
test([modulo]): QA add e2e exploratory tests with screenshots

- Add test runner with Puppeteer
- Add exploratory tests for CRUD operations
- Take screenshots at each step for visual verification
- Add cleanup script for test data
- Screenshots validated by Module Lead (>= 90% compliance)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

git push origin feature/[modulo]
```

#### Si Module Lead RECHAZA (< 90% cumplimiento):

Seguir el **proceso de iteración rápida** (ver siguiente sección).

---

## ITERACIÓN RÁPIDA - Proceso de Corrección

**IMPORTANTE**: Cuando hay tests fallidos, NO borrar todos los screenshots ni re-ejecutar todos los tests. Seguir este proceso optimizado:

### Flujo de Iteración

```
Tests fallan
    │
    ▼
QA reporta SOLO los tests fallidos a Module Lead
    │
    ▼
Module Lead asigna corrección a Frontend/Backend
    │
    ▼
Frontend/Backend corrige SOLO lo indicado
    │
    ▼
QA re-ejecuta SOLO los tests que fallaron
    │
    ▼
¿Pasa? ───► NO ───► Repetir ciclo para ese test
    │
    YES
    │
    ▼
¿Todos los tests individuales pasaron?
    │
    ├── NO ───► Siguiente test fallido
    │
    └── YES ───► PRUEBA TOTAL (ver abajo)
```

### 1. Reportar Solo Tests Fallidos

Cuando hay fallos, notificar a Module Lead especificando:

```
ITERACIÓN REQUERIDA: [modulo]
================================

TESTS FALLIDOS (X de Y):

1. Test: [nombre del test]
   Screenshot: [nombre]-ERROR.png
   Error: [descripción breve]
   Responsable probable: [Frontend/Backend/DBA]

2. Test: [nombre del test]
   Screenshot: [nombre]-ERROR.png
   Error: [descripción breve]
   Responsable probable: [Frontend/Backend/DBA]

TESTS EXITOSOS: [lista breve]
(Screenshots guardados, NO se borran)

SOLICITO: Asignación de correcciones específicas
```

### 2. Re-ejecutar Solo Tests Fallidos

Después de recibir correcciones, **NO ejecutar toda la suite**. Ejecutar solo los tests específicos:

```typescript
// En index.ts, comentar temporalmente los tests que ya pasaron
// O crear un archivo de re-test específico

// Ejemplo: solo re-ejecutar test de creación
await runTest('04-create', async () => {
  // ... solo este test
})
```

### 3. NO Borrar Screenshots Exitosos

- Screenshots de tests que pasaron → **MANTENER**
- Screenshots de tests fallidos → Se sobrescriben al re-ejecutar

```bash
# CORRECTO: Solo verificar los screenshots de tests fallidos
ls src/module/[modulo]/e2e/screenshots/*ERROR*

# INCORRECTO: NO hacer esto durante iteración
rm -rf src/module/[modulo]/e2e/screenshots/*.png  # ❌ NO BORRAR TODO
```

### 4. PRUEBA TOTAL (Solo al Final)

**Cuándo hacer prueba total:**
- Todos los tests individuales pasaron
- Antes de hacer commit final

**Proceso de prueba total:**

```bash
# Ahora SÍ borrar todos los screenshots
rm -rf src/module/[modulo]/e2e/screenshots/*.png

# Ejecutar suite completa
npx tsx src/module/[modulo]/e2e/index.ts

# Verificar que TODOS pasen
ls src/module/[modulo]/e2e/screenshots/
# No debe haber archivos *ERROR*
```

### Beneficios de Iteración Rápida

| Antes (ineficiente) | Ahora (optimizado) |
|---------------------|---------------------|
| Falla 1 test → borra todo → ejecuta 8 tests | Falla 1 test → ejecuta 1 test |
| Frontend corrige → QA re-ejecuta 8 tests | Frontend corrige → QA re-ejecuta 1 test |
| 5 ciclos × 8 tests = 40 ejecuciones | 5 ciclos × 1 test = 5 ejecuciones |

### Activity Log para Iteraciones

```bash
# Primera ejecución
./.agents/scripts/log.sh "QA" "Ejecutando suite completa: 8 tests"
./.agents/scripts/log.sh "QA" "✗ 2 tests fallaron: 04-create, 06-delete"

# Iteración 1
./.agents/scripts/log.sh "QA" "→ Re-ejecutando test 04-create"
./.agents/scripts/log.sh "QA" "✓ Test 04-create pasó"

# Iteración 2
./.agents/scripts/log.sh "QA" "→ Re-ejecutando test 06-delete"
./.agents/scripts/log.sh "QA" "✗ Test 06-delete falló: Modal no apareció"

# ... más iteraciones ...

# Prueba total
./.agents/scripts/log.sh "QA" "✓ Todos los tests individuales pasaron"
./.agents/scripts/log.sh "QA" "→ Ejecutando PRUEBA TOTAL (borrando screenshots)"
./.agents/scripts/log.sh "QA" "✓ Suite completa: 8/8 pasaron"
```

---

## Flujo Completo

```
QA copia templates
    │
    ▼
QA reemplaza placeholders
    │
    ▼
QA ajusta según spec
    │
    ▼
QA ejecuta tests (npx tsx index.ts)
    │
    ▼
QA genera screenshots
    │
    ▼
QA notifica a Module Lead (NO COMMIT)
    │
    ▼
Module Lead revisa screenshots vs spec
    │
    ├─── >= 90% ───► APRUEBA ───► QA hace commit
    │
    └─── < 90% ────► RECHAZA ───► Correcciones ───► Re-test
```

---

## CHECKLIST FINAL - VERIFICAR ANTES DE NOTIFICAR A MODULE LEAD

**EJECUTAR ESTOS COMANDOS antes de decir "tests completados":**

```bash
# 1. ¿Ejecuté los tests? (NO solo crear archivos)
ls -la src/module/[modulo]/e2e/screenshots/*.png 2>/dev/null | wc -l
# DEBE ser > 0. Si es 0, ejecutar: npx tsx src/module/[modulo]/e2e/index.ts

# 2. ¿Hay screenshots de error?
ls src/module/[modulo]/e2e/screenshots/*ERROR* 2>/dev/null
# Si hay archivos, investigar los errores antes de continuar

# 3. ¿El spec tiene ecommerceEnabled: true?
grep -i "ecommerceEnabled.*true" .agents/specs/[modulo]-testing-spec.md
# Si devuelve resultado, DEBO tener también tests en e2e/ecommerce/

# 4. Si ecommerceEnabled: true, ¿existen screenshots de ecommerce?
ls -la src/module/[modulo]/e2e/screenshots/ecommerce/*.png 2>/dev/null | wc -l
# DEBE ser > 0 si ecommerceEnabled: true
```

### Checklist Manual:

```
[ ] Copié templates desde .agents/skills/qa/templates/
[ ] Reemplacé TODOS los placeholders (__MODULE__, __module__, etc.)
[ ] Ajusté campos según el spec del módulo
[ ] Ejecuté npx tsx (no solo creé archivos .ts)
[ ] Screenshots existen en carpeta (verificado con ls)
[ ] No hay screenshots con sufijo -ERROR
[ ] Si ecommerceEnabled: true → tests de ecommerce también existen
[ ] Usé credenciales reales (admin@ajk.com / Admin123!)
[ ] Verifiqué puerto del servidor antes de ejecutar
[ ] Notifiqué a Module Lead SIN hacer commit
```

**Si algún item falla, NO notificar a Module Lead. Corregir primero.**

---

## Aprendizaje: Validar Screenshots vs Modelo de Negocio COMPLETO

**CRÍTICO**: Los screenshots deben ser EVIDENCIA del modelo de negocio completo definido en el spec.

### Antes de declarar tests completos, verificar:

1. **Leer el spec COMPLETO**: `.agents/specs/[modulo]-testing-spec.md`
2. **Cada criterio del spec DEBE tener un screenshot que lo evidencie**

### Si el módulo tiene Ecommerce (ecommerceEnabled: true):

**DEBEN existir tests E2E para AMBOS:**

```
src/module/[modulo]/e2e/
├── admin/          ← Tests CRUD del admin
├── ecommerce/      ← Tests de visualización pública
├── index.ts        ← Runner para admin
├── index-ecommerce.ts ← Runner para ecommerce
└── screenshots/
    ├── admin/      ← Screenshots de admin
    └── ecommerce/  ← Screenshots de ecommerce
```

### Si el módulo tiene Integración (requiereIntegracion: true):

**CRÍTICO - Aprendizaje del módulo tags:**

Cuando el spec tiene `requiereIntegracion: true`, el módulo se integra con otro módulo existente (ej: tags se integra con products). En este caso:

1. **DEBEN existir screenshots de integración** que evidencien:
   - Selector funcionando en admin del módulo relacionado
   - Visualización en ecommerce (si aplica)

2. **Verificar que el spec liste screenshots requeridos**:
   ```markdown
   ## Criterios de Validación Visual de Integración
   | # | Screenshot | Descripción |
   |---|------------|-------------|
   | 1 | admin-variant-selector-available | Selector visible con datos |
   | 2 | ecommerce-productcard-with-tags | Badge visible en card |
   | 3 | ecommerce-productdetail-with-tags | Badge visible en detalle |
   ```

3. **Cada screenshot del spec DEBE existir**:
   ```bash
   # Verificar que screenshots de integración existen
   ls src/module/[modulo]/e2e/screenshots/int-* 2>/dev/null | wc -l
   # DEBE ser > 0 si requiereIntegracion: true
   ```

4. **NO marcar como completo si faltan screenshots de integración**:
   - Admin CRUD OK pero sin ecommerce = **INCOMPLETO**
   - Screenshots con -ERROR sin resolver = **INCOMPLETO**

**Error común**: Marcar módulo como 100% cuando solo FASE 1 (Admin) tiene screenshots pero FASE 2 (Integración/Ecommerce) no fue validada visualmente.

---

## Manejo de Imágenes en E2E

Si el módulo tiene **campo de imagen**, seguir este patrón:

### 1. Crear imagen de prueba en fixtures

```
src/module/[modulo]/e2e/fixtures/
└── test-[modulo]-[ancho]x[alto].[ext]
```

### 2. Agregar a utils.ts

```typescript
export const TEST_IMAGES = {
  main: path.join(FIXTURES_DIR, 'test-[modulo]-400x400.jpg')
}

export async function upload[Modulo]Image(imagePath: string): Promise<boolean> {
  const { uploadImageToField, getTestDate } = await import('../../../../tests/e2e/utils')
  return uploadImageToField('Imagen', imagePath, {
    filePattern: '[modulo]',
    uploadWaitTime: 3000,
    uploadPath: `e2e/${getTestDate()}/[modulo]`
  })
}
```

### 3. Uso en Tests

```typescript
await fillTextField('name', TEST_DATA.name)
await upload[Modulo]Image(TEST_IMAGES.main)
await submitForm()
```

---

## Activity Log (Obligatorio)

```bash
# Inicio
./.agents/scripts/log.sh "QA" "Iniciando E2E tests admin [modulo]"

# Microtareas
./.agents/scripts/log.sh "QA" "→ Copiando templates desde .agents/skills/qa/templates/"
./.agents/scripts/log.sh "QA" "→ Ejecutando tests: npx tsx src/module/[modulo]/e2e/index.ts"

# Resultados
./.agents/scripts/log.sh "QA" "✓ Tests ejecutados: X/Y pasaron"
./.agents/scripts/log.sh "QA" "Esperando validación de Module Lead"
```

---

## Outputs
- `src/module/[modulo]/e2e/` completo
- Screenshots como evidencia visual
- Tests de ecommerce (si aplica)

## Next
- Module Lead valida screenshots (skill: validate-qa-screenshots.md)
- Si aprueba: QA hace commit → Module Lead propone release
- Si rechaza: Correcciones → Re-test → Re-validar

## NO Hacer
- NO hacer commit sin aprobación de Module Lead
- NO crear tests sin ejecutarlos
- NO ignorar screenshots de error
- NO modificar código del módulo
- NO continuar sin servidor corriendo
- NO saltarse la validación de Module Lead
- NO usar credenciales de placeholder
- NO eliminar screenshots - mantenerlos como evidencia y commitearlos
