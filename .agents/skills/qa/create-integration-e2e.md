# Skill: Crear Tests E2E de Integración

## Rol
QA

## Trigger
Module Lead asigna tarea de crear tests de integración entre módulo nuevo y módulo existente.

## Inputs
- Nombre del módulo nuevo
- Nombre del módulo existente (relacionado)
- `.agents/specs/[modulo]-testing-spec.md` (sección "Criterios de Validación Visual de Integración")
- Branch de trabajo

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches

---

## ⚠️ CRÍTICO: LEER SPEC PRIMERO

**ANTES de crear tests, leer la sección del spec:**
```
## Integración con Módulos Existentes
### ⚠️ CRÍTICO: Criterios de Validación Visual de Integración
```

Esta sección define:
- Screenshots REQUERIDOS
- Flujo End-to-End que DEBES probar
- Criterios de aprobación para cada screenshot

**Si el spec no tiene esta sección, SOLICITAR al Module Lead que la complete.**

---

## ⛔ REGLA PRINCIPAL

**Los tests de integración van en el módulo EXISTENTE, no en el nuevo.**

```
✅ CORRECTO: src/module/[existente]/e2e/integration/[nuevo].ts
❌ INCORRECTO: src/module/[nuevo]/e2e/integration/...
```

**Razón**: La integración EXTIENDE el módulo existente. Los tests validan esa extensión.

---

## 📋 FLUJO END-TO-END OBLIGATORIO

El spec define el flujo, pero aquí está el patrón genérico:

### Paso 1: CREAR item en módulo nuevo
```typescript
// TC-I00: Prerequisito - Crear item en módulo nuevo
const testItem = await page.evaluate(async () => {
  // Navegar a /admin/[nuevo]/new
  // Llenar formulario con datos de prueba
  // Guardar
  // Retornar datos del item creado
})
// Screenshot: admin-[nuevo]-created.png
```

### Paso 2: VERIFICAR selector tiene items disponibles
```typescript
// TC-I01: Selector muestra items disponibles
// Navegar a /admin/[existente]/[id]/edit
// Buscar sección de [nuevo] (selector/checkboxes)
// VERIFICAR: NO dice "No hay [nuevo] disponibles"
// Screenshot: admin-[existente]-selector-available.png
```

### Paso 3: SELECCIONAR y GUARDAR asociación
```typescript
// TC-I02: Seleccionar items
// Click en item(s) para seleccionar
// Screenshot: admin-[existente]-selector-selected.png

// TC-I03: Guardar asociación
// Click en botón guardar
// VERIFICAR: Mensaje de éxito O asociación persistida
// Screenshot: admin-[existente]-after-save.png
```

### Paso 4: VALIDAR en Ecommerce
```typescript
// TC-I04: [nuevo] visible en página pública de [existente]
// Navegar a página pública del [existente] que asociamos
// VERIFICAR: Badge/componente del [nuevo] ES VISIBLE
// Screenshot: ecommerce-[existente]-with-[nuevo].png
// ❌ FALLA si no se ve el badge/componente

// TC-I05: [nuevo] visible en detalle de [existente]
// Navegar a página de detalle
// VERIFICAR: [nuevo] visible
// Screenshot: ecommerce-[existente]-detail-with-[nuevo].png
```

### Paso 5: LIMPIAR (opcional pero recomendado)
```typescript
// Quitar asociación
// Verificar que desaparece en ecommerce
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
src/module/[existente]/e2e/
├── integration/
│   └── [nuevo].ts          # Tests de integración
├── screenshots/
│   └── integration/        # Screenshots de integración
│       ├── admin-[nuevo]-created.png
│       ├── admin-[existente]-selector-available.png
│       ├── admin-[existente]-selector-selected.png
│       ├── admin-[existente]-after-save.png
│       ├── ecommerce-[existente]-with-[nuevo].png
│       └── ecommerce-[existente]-detail-with-[nuevo].png
└── index-integration.ts    # Runner de tests integración
```

---

## ❌ CASOS QUE INVALIDAN LA INTEGRACIÓN

| Situación | Problema | Solución |
|-----------|----------|----------|
| Selector dice "No hay [nuevo] disponibles" | No se creó item en módulo nuevo | Ejecutar Paso 1 primero |
| Ecommerce no muestra [nuevo] | No se guardó la asociación | Verificar Paso 3 |
| Screenshots sin datos reales | No valida modelo de negocio | Crear datos de prueba reales |
| Solo screenshots de admin | Falta validación ecommerce | Agregar Pasos 4-5 |

---

## 📝 ACTIVITY LOG (Obligatorio)

```bash
# Al iniciar
./.agents/scripts/log.sh "QA" "Iniciando E2E integración [nuevo]-[existente]"

# Flujo
./.agents/scripts/log.sh "QA" "→ Paso 1: Creando item de prueba en [nuevo]"
./.agents/scripts/log.sh "QA" "✓ Item creado: [nombre]"
./.agents/scripts/log.sh "QA" "→ Paso 2: Verificando selector en [existente]"
./.agents/scripts/log.sh "QA" "✓ Selector muestra [N] items disponibles"
./.agents/scripts/log.sh "QA" "→ Paso 3: Asociando [nuevo] con [existente]"
./.agents/scripts/log.sh "QA" "✓ Asociación guardada"
./.agents/scripts/log.sh "QA" "→ Paso 4: Validando en ecommerce"
./.agents/scripts/log.sh "QA" "✓ Badge/componente visible en página pública"
./.agents/scripts/log.sh "QA" "✓ Badge/componente visible en detalle"

# Resultado
./.agents/scripts/log.sh "QA" "Tests integración: X/Y pasaron"
./.agents/scripts/log.sh "QA" "Screenshots en: src/module/[existente]/e2e/screenshots/integration/"

# Si falla
./.agents/scripts/log.sh "QA" "⚠️ FALLA: [descripción del problema]"
./.agents/scripts/log.sh "QA" "→ Causa probable: [análisis]"
./.agents/scripts/log.sh "QA" "→ Acción: [qué se necesita para corregir]"
```

---

## 🔄 SI FALLA ALGÚN PASO

1. **NO marcar como "pasado" si no se ve el resultado esperado**
2. Documentar qué falta
3. Notificar a Module Lead con:
   - Screenshot del estado actual
   - Qué debería verse vs qué se ve
   - Qué paso del flujo falló

---

## Outputs
- Tests de integración en `src/module/[existente]/e2e/integration/[nuevo].ts`
- Screenshots que validan el FLUJO COMPLETO
- Reporte de resultados con criterios de aprobación cumplidos/no cumplidos

## NO Hacer
- ❌ NO crear tests en el módulo nuevo
- ❌ NO aprobar si selector dice "No hay items disponibles"
- ❌ NO aprobar si ecommerce no muestra el componente/badge
- ❌ NO tomar screenshots sin datos reales

---

## ⛔ CRÍTICO: VALIDAR CRITERIOS, NO SOLO TOMAR SCREENSHOTS

**El test debe FALLAR si el criterio de aceptación NO se cumple.**

### Proceso obligatorio para cada screenshot del spec:

1. **LEER** el criterio de aceptación del spec para ese screenshot
2. **IMPLEMENTAR** validación programática que verifique el criterio
3. **FALLAR** el test si el criterio no se cumple

```typescript
// ❌ INCORRECTO - Solo toma screenshot, siempre pasa
await takeScreenshot('ecommerce-detail-with-tag')
results.passed++

// ✅ CORRECTO - Valida criterio antes de pasar
const criterioDelSpec = "Badge(s) visible(s) junto al nombre"

// Validar programáticamente
const elementoVisible = await page.evaluate(() => {
  // Buscar el elemento que debería existir según el criterio
  // Retornar true/false
})

if (!elementoVisible) {
  throw new Error(`Criterio NO cumplido: ${criterioDelSpec}`)
}
await takeScreenshot('ecommerce-detail-with-tag')
results.passed++
```

### El agente QA DEBE:
1. Leer CADA criterio de aceptación del spec
2. Para cada criterio, escribir código que lo valide
3. El test FALLA si el elemento esperado no existe/no es visible

---

## 🎓 APRENDIZAJES / ERRORES COMUNES

### 1. URLs de Ecommerce - ANALIZAR antes de usar

**Problema**: El test asume una URL que no existe.

**Solución**: ANTES de escribir URLs en el test, ANALIZAR el código:

```bash
# Descubrir qué rutas existen
ls src/app/

# Buscar dónde se renderizan productos/cards
grep -r "ProductCard\|ProductGrid" src/app/ --include="*.tsx"

# Buscar la página de detalle
find src/app -name "page.tsx" | xargs grep -l "ProductVariant\|ProductDetail"
```

El agente debe DESCUBRIR las URLs, no asumirlas.

### 2. Endpoints públicos vs admin

**Problema**: Componente de ecommerce usa `/api/admin/...` que requiere autenticación.

**Solución**: ANALIZAR el código del componente:
```bash
# Buscar qué endpoints usa el componente
grep -r "fetch\|api/" src/module/[modulo]/components/ecommerce/

# Si usa /api/admin/, el componente NO funcionará para usuarios no autenticados
```

### 3. Validar que el criterio se cumple, no solo que la página carga

**Problema**: Test navega a página, toma screenshot, y pasa - pero no valida que el elemento esperado esté visible.

**Solución**: Para CADA criterio del spec, implementar validación:
```typescript
// Leer criterio del spec: "Badge visible con color correcto"
const cumpleCriterio = await page.evaluate(() => {
  // Implementar lógica que verifica el criterio específico
  // Retornar true si cumple, false si no
})
if (!cumpleCriterio) throw new Error('Criterio no cumplido')
```

### 4. Navegación a páginas internas del admin

**Problema**: Selectores CSS frágiles no encuentran elementos.

**Solución**: ANALIZAR la estructura de URLs y navegar directamente:
```typescript
// En lugar de buscar links con selectores frágiles:
// ❌ const link = await page.$('table a[href*="/products/"]')

// Extraer IDs de URLs y navegar directamente:
// ✅ const productId = await extractProductIdFromList()
//    await goto(`/admin/products/${productId}/variants/${variantId}`)
```

El agente debe DESCUBRIR la estructura de navegación analizando el código.

### 5. Conexión entre spec y código

**El flujo correcto es:**
```
SPEC dice "Badge en página detalle"
         ↓
QA ANALIZA: ¿Qué componente renderiza la página de detalle?
         ↓
QA DESCUBRE: src/app/producto/[slug]/page.tsx usa ProductVariantView
         ↓
QA VERIFICA: ¿ProductVariantView tiene el badge?
         ↓
QA VALIDA: Navegar a /producto/[slug-real] y verificar badge visible
```


### 4. Screenshots deben mostrar datos REALES

**Problema**: Screenshot de selector vacío o ecommerce sin badges no valida nada.

**Solución**: El test debe FALLAR si:
- Selector muestra "No hay items disponibles"
- Ecommerce muestra 404
- Badge/componente no es visible

```typescript
// Verificar que hay datos
const hasItems = await page.evaluate(() => {
  return document.querySelectorAll('button[style*="background"]').length > 0
})
if (!hasItems) {
  throw new Error('Selector no muestra items disponibles')
}
```
