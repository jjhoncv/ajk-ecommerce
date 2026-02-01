# Logging Granular: Validación de Screenshots por QA

## Problema

Los logs actuales solo muestran "tests ejecutados" o "screenshots generados", pero no muestran:
- Qué se analizó en cada screenshot
- Qué se esperaba vs qué se encontró
- El razonamiento del diagnóstico
- Quién debe corregir y qué

---

## Formato de Logging para Screenshots

### Estructura por Screenshot

```
📸 [nombre-screenshot.png] → [estado]
   🔍 Buscando: [qué elemento/selector]
   ✓/❌ Resultado: [qué se encontró]
   💭 Análisis: [interpretación]
   🎯 Diagnóstico: [causa probable]
   📋 Acción: [quién debe hacer qué]
```

### Estados Posibles

| Emoji | Estado | Significado |
|-------|--------|-------------|
| ⏳ | Analizando | Screenshot capturado, iniciando análisis |
| ✅ | Aprobado | Cumple criterio del spec |
| ❌ | Fallido | No cumple criterio |
| ⚠️ | Advertencia | Cumple parcialmente |
| 🔄 | Re-test | Necesita re-ejecutar |

---

## Ejemplos de Logs Granulares

### Caso 1: Test CRUD Admin - Éxito

```bash
./.agents/scripts/log.sh "QA" "📸 01-admin-list.png → ⏳ Analizando..."
./.agents/scripts/log.sh "QA" "📸 01-admin-list.png → 🔍 Buscando: tabla con datos, header 'Tags'"
./.agents/scripts/log.sh "QA" "📸 01-admin-list.png → ✓ Encontrado: tabla visible, 3 filas de datos"
./.agents/scripts/log.sh "QA" "📸 01-admin-list.png → ✅ APROBADO - Lista muestra tags correctamente"
```

### Caso 2: Test CRUD Admin - Fallo de Selector

```bash
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → ⏳ Analizando..."
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 🔍 Buscando: formulario con campos name, color, isActive"
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → ❌ NO encontrado: campo 'color' no existe en DOM"
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 💭 Análisis: El selector 'input[name=color]' no matchea"
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 🔍 Investigando: Buscando campos similares..."
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 💡 Encontrado: Campo usa 'input[type=color]' no 'input[name=color]'"
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 🎯 Diagnóstico: Selector incorrecto en test"
./.agents/scripts/log.sh "QA" "📸 02-admin-new.png → 📋 Acción: QA debe corregir selector en 01-crud.ts línea 45"
```

### Caso 3: Test Ecommerce - Datos No Llegan

```bash
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → ⏳ Analizando..."
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 🔍 Buscando: TagBadge visible en ProductCard"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → ❌ NO visible: Badge no aparece en screenshot"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 💭 Análisis: Verificando si elemento existe en DOM..."
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 🔍 DOM check: querySelector('[data-testid=tag-badges]')"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → ⚠️ Elemento EXISTE pero está VACÍO (0 children)"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 💭 Análisis: Componente renderiza, pero variant.tags es undefined"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 🔍 Investigando flujo de datos..."
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 🔍 Checking: src/module/products/services/hydrators.ts"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → ❌ Hydrator NO incluye campo 'tags' en retorno"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 🎯 Diagnóstico: BACKEND - Hydrator no modificado"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 📋 Acción: Backend debe modificar hydrators.ts para incluir tags"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 📋 Archivo: src/module/products/services/popularProducts/hydrators.ts"
./.agents/scripts/log.sh "QA" "📸 05-ecommerce-card.png → 📋 Cambio: Agregar 'tags: item.tags' al objeto retornado"
```

### Caso 4: Test Ecommerce - Componente No Importado

```bash
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → ⏳ Analizando..."
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 🔍 Buscando: TagBadge en página de detalle"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → ❌ NO visible: Ningún badge en screenshot"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 💭 Análisis: Verificando DOM..."
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → ❌ Elemento NO existe en DOM"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 🔍 Investigando: grep TagBadge src/app/producto/"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → ❌ Componente NO importado en página de detalle"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 🎯 Diagnóstico: FRONTEND - Falta importar componente"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 📋 Acción: Frontend debe agregar TagBadges a ProductDetail"
./.agents/scripts/log.sh "QA" "📸 06-ecommerce-detail.png → 📋 Archivo: src/app/producto/[slug]/page.tsx"
```

### Caso 5: Test Integración - Selector Admin No Funciona

```bash
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → ⏳ Analizando..."
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 🔍 Buscando: Selector de tags en edit de variante"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → ❌ Mensaje: 'No hay tags disponibles'"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 💭 Análisis: El selector muestra pero sin opciones"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 🔍 Verificando: ¿Existen tags activos en BD?"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 🔍 Query: SELECT * FROM tags WHERE is_active = 1"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → ❌ Resultado: 0 tags activos"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 🎯 Diagnóstico: DATOS - No hay tags activos en BD"
./.agents/scripts/log.sh "QA" "📸 03-admin-selector.png → 📋 Acción: Crear tags de prueba con is_active=1 antes del test"
```

---

## Resumen de Diagnósticos por Responsable

### 🔧 BACKEND debe corregir cuando:
- Hydrator no incluye campo del nuevo módulo
- API retorna error 4xx/5xx
- Query no hace JOIN con tabla pivote
- Datos existen en BD pero no llegan al componente

### 🎨 FRONTEND debe corregir cuando:
- Componente no importado en página
- Props no pasadas al componente
- Estilos incorrectos (elemento existe pero no visible)
- Renderizado condicional incorrecto

### 🧪 QA debe corregir cuando:
- Selector CSS incorrecto
- Navegación incorrecta (action menu vs link directo)
- Timeout muy corto
- Test no espera a que elemento cargue

### 🗄️ DBA/DATOS debe corregir cuando:
- No hay datos de prueba en BD
- Datos existen pero is_active = 0
- Relaciones no creadas en tabla pivote

---

## Implementación en Tests

```typescript
// Función helper para logging granular
async function analyzeScreenshot(
  name: string,
  selector: string,
  expectedDescription: string
): Promise<AnalysisResult> {
  log(`📸 ${name} → ⏳ Analizando...`)
  log(`📸 ${name} → 🔍 Buscando: ${expectedDescription}`)

  const element = await page.$(selector)

  if (!element) {
    log(`📸 ${name} → ❌ NO encontrado: Elemento no existe en DOM`)
    log(`📸 ${name} → 🔍 Investigando causa...`)

    // Investigar por qué no existe
    const diagnosis = await investigateMissingElement(selector)

    log(`📸 ${name} → 🎯 Diagnóstico: ${diagnosis.responsible} - ${diagnosis.reason}`)
    log(`📸 ${name} → 📋 Acción: ${diagnosis.action}`)

    return { passed: false, diagnosis }
  }

  // Verificar que tiene contenido
  const hasContent = await page.evaluate((sel) => {
    const el = document.querySelector(sel)
    return el && (el.children.length > 0 || el.textContent?.trim())
  }, selector)

  if (!hasContent) {
    log(`📸 ${name} → ⚠️ Elemento EXISTE pero está VACÍO`)
    log(`📸 ${name} → 🎯 Diagnóstico: BACKEND - Datos no llegan al componente`)
    log(`📸 ${name} → 📋 Acción: Verificar hydrators del módulo existente`)

    return { passed: false, diagnosis: { responsible: 'BACKEND', reason: 'Empty element' } }
  }

  log(`📸 ${name} → ✅ APROBADO - ${expectedDescription}`)
  return { passed: true }
}
```

---

## Flujo de Validación Visual

```
Para cada screenshot del spec:
│
├─→ 📸 Capturar screenshot
│
├─→ 🔍 Analizar según criterio del spec
│   │
│   ├─→ ¿Elemento existe en DOM?
│   │   ├─→ NO → Investigar: ¿Componente importado? ¿Renderiza?
│   │   │        → Diagnóstico: FRONTEND
│   │   │
│   │   └─→ SÍ → Continuar...
│   │
│   ├─→ ¿Elemento tiene contenido?
│   │   ├─→ NO → Investigar: ¿Datos llegan? ¿Hydrator incluye campo?
│   │   │        → Diagnóstico: BACKEND
│   │   │
│   │   └─→ SÍ → Continuar...
│   │
│   └─→ ¿Contenido es correcto según spec?
│       ├─→ NO → Analizar qué falta/sobra
│       │        → Diagnóstico según caso
│       │
│       └─→ SÍ → ✅ APROBADO
│
└─→ 📋 Generar reporte con todos los diagnósticos
```
