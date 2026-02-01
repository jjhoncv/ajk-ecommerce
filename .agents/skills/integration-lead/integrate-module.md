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

## ⛔⛔⛔ APRENDIZAJE CRÍTICO: FLUJO DE DATOS ECOMMERCE ⛔⛔⛔

**LEER OBLIGATORIAMENTE ANTES DE CUALQUIER INTEGRACIÓN:**
`.agents/learnings/ecommerce-data-flow.md`

### Resumen del Problema

Cuando se integra un módulo nuevo con ecommerce, el componente se crea pero **los datos nunca llegan** porque no se modificó el flujo de datos del módulo existente.

### Regla de Oro

**NO basta con crear `nuevoModuloService.getDatos()`.**
**DEBES modificar DÓNDE el módulo existente obtiene sus datos para ecommerce.**

Típicamente:
- `src/module/[existente]/services/*/hydrators.ts`
- `src/module/[existente]/core/*.model.ts`
- `src/module/search/core/Search.model.ts` (si hay búsqueda)

### Validación Obligatoria

Antes de declarar FASE 2 Ecommerce completa:
1. Module Expert identificó archivos de flujo de datos
2. Backend modificó CADA archivo identificado
3. QA verificó que elemento tiene CONTENIDO (no solo que existe)
4. Screenshot muestra elemento con datos reales

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/learnings/ecommerce-data-flow.md` - **CRÍTICO**: Flujo de datos ecommerce
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches
- `.agents/communication.md` - Protocolo de coordinación con otros Module Leads

---

## 🎯 PRINCIPIO: Integración Dinámica basada en Análisis

**NO asumir estructuras fijas.** Cada módulo es diferente:
- Un módulo puede tener admin pero no ecommerce
- Los componentes tienen nombres diferentes
- Las rutas varían según el módulo

**La integración se basa en el ANÁLISIS del módulo existente, no en templates.**

---

## 🔍 FASE 0: LANZAR MODULE EXPERT PARA ANALIZAR MÓDULO EXISTENTE

**El Integration Lead NO analiza directamente.** Lanza un agente especialista.

### 0.1 Lanzar Module Expert Agent

```typescript
Task({
  description: "Module Expert: Analyze [moduloExistente] for integration",
  prompt: `
    ROL: Module Expert
    TAREA: Analizar módulo [moduloExistente] y generar reporte de integración

    OBJETIVO:
    El módulo [nuevoModulo] necesita integrarse con [moduloExistente].
    Tu trabajo es ENTENDER cómo funciona [moduloExistente] y REPORTAR
    la estructura para que otro agente pueda integrarse.

    PASO 1: EXPLORAR ESTRUCTURA
    ===========================

    # Estructura general
    ls -la src/module/[moduloExistente]/
    ls -la src/module/[moduloExistente]/core/
    ls -la src/module/[moduloExistente]/components/
    ls -la src/app/admin/[moduloExistente]/

    # Buscar componentes ecommerce (pueden estar en varios lugares)
    find src -name "*[moduloExistente]*" -type f
    find src/components -name "*.tsx" | head -20
    find src/app -path "*/[moduloExistente]/*" -name "*.tsx"

    PASO 2: LEER Y ENTENDER BACKEND
    ===============================

    Leer archivos core:
    - Model: ¿Qué métodos tiene? ¿Qué hace cada uno?
    - Repository: ¿Qué queries hace? ¿Cómo obtiene datos?
    - Mapper: ¿Cómo transforma los datos?

    Leer servicios (si existen):
    - ¿Hay services/? ¿Qué funciones exporta?
    - ¿Hay hydrators? ¿Cómo enriquece los datos?

    PASO 3: LEER Y ENTENDER ADMIN
    =============================

    Leer páginas admin:
    - ¿Cómo es la página de listado?
    - ¿Cómo es la página de edición?
    - ¿Qué componentes usa?
    - ¿Hay tabs o secciones?
    - ¿Hay selectores de relaciones existentes?

    PASO 4: LEER Y ENTENDER ECOMMERCE (si existe)
    ==============================================

    Buscar componentes públicos:
    - ¿Hay componentes en src/module/[moduloExistente]/components/ecommerce/?
    - ¿Hay componentes en src/components/ui/ relacionados?
    - ¿Hay páginas públicas en src/app/[moduloExistente]/?
    - ¿Hay páginas públicas en src/app/productos/ (si es products)?

    Para cada componente encontrado:
    - ¿Qué props recibe?
    - ¿Qué datos muestra?
    - ¿Dónde se podría agregar la nueva relación?

    ⚠️ CRÍTICO: RASTREAR FLUJO COMPLETO DE DATOS
    ============================================

    NO basta con identificar el componente. Debes rastrear DE DÓNDE vienen los datos:

    1. Identificar componente que mostrará datos del módulo nuevo
       Ejemplo: ProductCard muestra productos

    2. ¿Qué página/sección usa ese componente?
       Ejemplo: PopularProducts en homepage usa ProductCard

    3. ¿Qué service/function obtiene los datos para esa página?
       Buscar en el archivo de la página:
       grep -r "getPopularProducts\|searchModel\|get.*Products" src/app/
       grep -r "import.*service" src/app/page.tsx
       Ejemplo: getPopularProducts() en src/module/products/services/popularProducts/

    4. ¿Qué hydrator transforma esos datos?
       Leer el service encontrado y buscar hydrators:
       Ejemplo: hydratePopularProducts() en hydrators.ts

    5. ¿El hydrator incluye el campo para el módulo nuevo?
       Ejemplo: ¿hydratePopularProducts retorna { ...producto, tags: [...] }?
       Si NO lo incluye → ESTE ES EL PUNTO QUE DEBE MODIFICARSE

    DOCUMENTAR EN EL REPORTE:

    ## ⚠️ FLUJO DE DATOS ECOMMERCE (CRÍTICO PARA INTEGRACIÓN)

    | Componente | Página/Sección | Service | Hydrator | ¿Incluye campo nuevo? |
    |------------|----------------|---------|----------|----------------------|
    | ProductCard | PopularProducts (homepage) | getPopularProducts | hydratePopularProducts | NO - DEBE MODIFICARSE |
    | ProductCard | Search results | searchModel.searchProducts | ProductSearchItemMapper | NO - DEBE MODIFICARSE |

    ### Archivos que Backend DEBE modificar para incluir datos del módulo nuevo:
    - src/module/[existente]/services/popularProducts/hydrators.ts → agregar campo [nuevo]
    - src/module/search/core/Search.mapper.ts → agregar campo [nuevo]
    - [otros services que cargan datos para ecommerce]

    PASO 5: GENERAR REPORTE
    =======================

    Crear archivo: .agents/analysis/[moduloExistente]-structure.md

    Con formato:

    # Análisis de Módulo: [moduloExistente]

    ## Estructura de Archivos
    [Lista de archivos encontrados]

    ## Backend (Core)

    ### Model
    - Archivo: [ruta]
    - Métodos: [lista con descripción]

    ### Repository
    - Archivo: [ruta]
    - Queries principales: [lista]
    - Relaciones existentes: [lista de FKs o pivots]

    ### Mapper
    - Archivo: [ruta]
    - Transformaciones: [descripción]

    ### Services (si existen)
    - Archivos: [rutas]
    - Funciones exportadas: [lista]

    ## Admin

    ### Páginas
    - Lista: [ruta] - [descripción de qué hace]
    - Nuevo: [ruta] - [descripción]
    - Editar: [ruta] - [descripción]

    ### Componentes Admin
    - [nombre]: [ruta] - [qué hace, qué props]

    ### ⚠️ NAVEGACIÓN EN ADMIN (CRÍTICO PARA QA)

    **DOCUMENTAR CÓMO se navega entre páginas:**

    ¿Cómo acceder a sub-recursos (ej: variantes de un producto)?
    - Tipo: [Link directo / Action menu / Tabs / etc.]
    - Selector CSS: [ej: 'table tbody tr button' para action menu]
    - Flujo: [ej: Click en tres puntos → Menu aparece → Click "Variantes"]

    ¿Cómo se estructura la tabla de listado?
    - Componente: [ej: DynamicTable]
    - Tiene action menu: [Sí/No]
    - Opciones del menu: [ej: Editar, Variantes, Eliminar]

    **ESTO ES ESENCIAL PARA QUE QA ESCRIBA TESTS CORRECTOS**

    ### Punto de integración sugerido (Admin)
    - [Dónde agregar selector de [nuevoModulo]]
    - [Qué archivo modificar]
    - [Cómo se vería]

    ## Ecommerce

    ### ¿Tiene presencia pública?
    [Sí/No]

    ### Páginas Públicas
    - [ruta]: [descripción]

    ### Componentes Ecommerce
    - [nombre]: [ruta]
      - Props: [lista]
      - Datos mostrados: [lista]
      - PUNTO DE INTEGRACIÓN: [dónde agregar relación]

    ### ⚠️ FLUJO DE DATOS ECOMMERCE (CRÍTICO)

    Para cada componente ecommerce, documentar DE DÓNDE vienen los datos:

    | Componente | Usado en | Service que carga datos | Hydrator | ¿Incluye [nuevoModulo]? |
    |------------|----------|------------------------|----------|------------------------|
    | [nombre] | [página/sección] | [ruta del service] | [nombre hydrator] | [SÍ/NO] |

    ### Archivos que Backend DEBE modificar para integración:
    - [ruta/hydrator1.ts] → agregar campo [nuevoModulo]s al retorno
    - [ruta/hydrator2.ts] → agregar campo [nuevoModulo]s al retorno
    - [ruta/mapper.ts] → incluir [nuevoModulo]s en el mapeo

    ### Punto de integración sugerido (Ecommerce)
    - [Dónde mostrar [nuevoModulo]]
    - [Qué archivo modificar]
    - [Cómo se vería]

    ## Tests E2E Existentes
    - [lista de archivos de test]
    - [qué cubren]

    ## Resumen para Integración

    Para integrar [nuevoModulo] con [moduloExistente]:

    1. BACKEND:
       - Modificar: [archivo]
       - Agregar: [qué métodos]

    2. ADMIN:
       - Modificar: [archivo]
       - Agregar: [qué componente]

    3. ECOMMERCE:
       - Modificar: [archivo(s)]
       - Agregar: [qué mostrar]

    4. TESTS:
       - Crear en: [ubicación]
       - Cubrir: [qué casos]

    ACTIVITY LOG:
    ./.agents/scripts/log.sh "MODULE-EXPERT" "Analizando módulo [moduloExistente]"
    ./.agents/scripts/log.sh "MODULE-EXPERT" "Reporte generado: .agents/analysis/[moduloExistente]-structure.md"
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Glob", "Grep", "Bash"]
})
```

### 0.2 Esperar y Leer el Reporte

Una vez que Module Expert complete:

```bash
cat .agents/analysis/[moduloExistente]-structure.md
```

Este reporte es la **FUENTE DE VERDAD** para la integración.

---

## 🔍 FASE 1: USAR REPORTE PARA PLANIFICAR INTEGRACIÓN

### 1.1 Leer Reporte del Module Expert

```bash
cat .agents/analysis/[moduloExistente]-structure.md
```

### 1.2 Extraer Puntos de Integración

Del reporte, identificar:

```
PUNTOS DE INTEGRACIÓN (del reporte)
====================================

BACKEND:
- Archivo a modificar: [del reporte]
- Métodos a agregar: [del reporte]

ADMIN:
- Archivo a modificar: [del reporte]
- Componente a agregar: [del reporte]
- Ubicación en UI: [del reporte]

ECOMMERCE (si aplica):
- Archivos a modificar: [del reporte]
- Qué mostrar: [del reporte]
- Dónde mostrarlo: [del reporte]

TESTS:
- Ubicación: [del reporte]
- Casos a cubrir: [del reporte]
```

### 1.3 Validar Plan de Integración

Antes de ejecutar, verificar:
- ¿El reporte identificó correctamente los archivos?
- ¿Los puntos de integración tienen sentido?
- ¿Hay algo que el reporte no cubrió?

Si hay dudas, relanzar Module Expert con instrucciones más específicas para analizar.

---

## 📤 FASE 1.5: DISTRIBUIR CONTEXTO A CADA AGENTE

**CRÍTICO**: El Integration Lead es el PUENTE entre el análisis del módulo existente y los agentes que harán el trabajo.

### Contexto para BACKEND

```typescript
Task({
  description: "Backend: Extend [moduloExistente] for [nuevoModulo] integration",
  prompt: `
    TAREA: Extender backend de [moduloExistente] para integrar [nuevoModulo]
    ROL: Backend

    ⛔⛔⛔ LEER PRIMERO: .agents/learnings/ecommerce-data-flow.md ⛔⛔⛔

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    CONTEXTO DEL MÓDULO [moduloExistente] (del Module Expert):
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ARCHIVOS EXISTENTES:
    - Model: [ruta del reporte]
    - Repository: [ruta del reporte]
    - Métodos actuales: [lista del reporte]

    RELACIONES EXISTENTES:
    - [lista de FKs/pivotes del reporte]

    PATRÓN DE CÓDIGO:
    - [cómo se manejan relaciones en este módulo]

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    TU TRABAJO (ADMIN):
    1. Agregar métodos al Repository: get[NuevoModulo]s(), set[NuevoModulo]s()
    2. Crear API endpoint: /api/admin/[moduloExistente]/[id]/[nuevoModulo]s

    ⛔⛔⛔ CRÍTICO PARA ECOMMERCE - ESTO ES OBLIGATORIO ⛔⛔⛔
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    NO BASTA CON CREAR [nuevoModulo]Service.get[NuevoModulo]s().
    DEBES MODIFICAR DÓNDE EL MÓDULO EXISTENTE OBTIENE SUS DATOS.

    El reporte del Module Expert identifica DÓNDE vienen los datos para ecommerce.

    FLUJO DE DATOS ECOMMERCE (del reporte):
    [PEGAR AQUÍ LA TABLA "FLUJO DE DATOS ECOMMERCE" DEL REPORTE]

    Ejemplo:
    | Componente | Service | Hydrator | ¿Incluye [nuevo]? |
    |------------|---------|----------|-------------------|
    | ProductCard | getPopularProducts | hydratePopularProducts | NO - MODIFICAR |
    | SearchResults | searchModel | ProductSearchItemMapper | NO - MODIFICAR |

    ⚠️ ARCHIVOS QUE DEBES MODIFICAR (OBLIGATORIO):
    [PEGAR AQUÍ LA LISTA "Archivos que Backend DEBE modificar" DEL REPORTE]

    Ejemplo:
    - src/module/products/services/popularProducts/hydrators.ts → agregar campo [nuevo]s
    - src/module/search/core/Search.model.ts → agregar fetch de [nuevo]s por variant IDs
    - src/module/search/core/Search.mapper.ts → incluir [nuevo]s en el mapeo

    TU TRABAJO (ECOMMERCE) - PASOS OBLIGATORIOS:
    1. Crear método en [nuevoModulo]Model: get[NuevoModulo]sByVariantIds(ids[])
       - Este método hace bulk fetch de [nuevo]s para múltiples variantes
    2. Modificar CADA archivo listado arriba para:
       - Llamar a [nuevoModulo]Model.get[NuevoModulo]sByVariantIds()
       - Incluir [nuevo]s en el objeto retornado por el hydrator/mapper
    3. Verificar que el tipo de retorno incluye el campo [nuevo]s

    SI ESTA SECCIÓN ESTÁ VACÍA O NO EXISTE EN EL REPORTE:
    → DETENTE. El Integration Lead debe relanzar Module Expert para obtener el flujo.
    → NO continúes sin saber qué archivos modificar.
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    VERIFICACIÓN ANTES DE COMPLETAR:
    □ Creé método bulk fetch en [nuevoModulo]Model
    □ Modifiqué CADA hydrator/mapper listado en el reporte
    □ Cada hydrator ahora retorna { ...datos, [nuevo]s: [...] }
    □ Los tipos incluyen el campo [nuevo]s

    AL COMPLETAR: Notificar a Integration Lead CON LISTA de archivos modificados
  `,
  subagent_type: "general-purpose"
})
```

### Contexto para FRONTEND

```typescript
Task({
  description: "Frontend: Add [nuevoModulo] selector to [moduloExistente] admin",
  prompt: `
    TAREA: Agregar selector de [nuevoModulo] en admin de [moduloExistente]
    ROL: Frontend

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    CONTEXTO DEL MÓDULO [moduloExistente] (del Module Expert):
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    PÁGINAS ADMIN:
    - Lista: [ruta del reporte]
    - Editar: [ruta del reporte] ← AQUÍ agregar selector

    COMPONENTES EXISTENTES:
    - [lista de componentes del reporte]

    PATRÓN DE UI:
    - [cómo se manejan selectores en este módulo]
    - [ejemplo de componente similar si existe]

    NAVEGACIÓN:
    - Tipo de tabla: [DynamicTable/custom]
    - Action menus: [Sí/No, opciones]

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    TU TRABAJO:
    1. Agregar selector de [nuevoModulo]s en página de edición
    2. Agregar badges en lista (si aplica)
    3. Conectar con API: /api/admin/[moduloExistente]/[id]/[nuevoModulo]s

    ECOMMERCE (si aplica):
    - Componentes a modificar: [del reporte]
    - Agregar badges/sección de [nuevoModulo]s

    AL COMPLETAR: Notificar a Integration Lead
  `,
  subagent_type: "general-purpose"
})
```

### Contexto para QA (ver FASE 6.1)

El contexto de QA se pasa cuando se lanzan los tests, incluyendo:
- Navegación del módulo (action menus, selectores CSS)
- Screenshots esperados
- Criterios de validación

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
- Tomar decisión autónoma y documentar en activity.log
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

### ⚠️ USAR REPORTE DEL MODULE EXPERT

**Los archivos y métodos exactos vienen del reporte de FASE 0.**

Del reporte, usar:
- "BACKEND > Archivo a modificar" → archivo real del repository
- "BACKEND > Métodos a agregar" → qué funcionalidad agregar
- "BACKEND > Relaciones existentes" → cómo se manejan otras relaciones

**Los ejemplos abajo son PATRONES de referencia. Adaptar según el reporte.**

### 3.1 Agregar al Repository

En el archivo indicado por el reporte (ej: `src/module/[moduloExistente]/core/[Entidad].repository.ts`):

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

### ⚠️ USAR REPORTE DEL MODULE EXPERT

**Los archivos y componentes exactos vienen del reporte de FASE 0.**

Del reporte, usar:
- "ADMIN > Páginas > Editar" → archivo real de la página
- "ADMIN > Componentes Admin" → componentes existentes y sus props
- "ADMIN > Punto de integración sugerido" → dónde agregar el selector

**Los ejemplos abajo son PATRONES de referencia. Adaptar según el reporte.**

### 4.1 Agregar Selector en Edit Page

En el archivo indicado por el reporte (ej: `src/app/admin/[moduloExistente]/[id]/page.tsx`):

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

### ⚠️ USAR REPORTE DEL MODULE EXPERT

**CRÍTICO: Los componentes ecommerce varían por módulo.**

Del reporte, usar:
- "ECOMMERCE > ¿Tiene presencia pública?" → si no, saltar esta fase
- "ECOMMERCE > Componentes Ecommerce" → lista REAL de componentes
- "ECOMMERCE > Punto de integración sugerido" → dónde mostrar la relación

**NO asumir nombres como "ProductCard" o "ProductDetail".**
**El Module Expert identificó los componentes reales del módulo.**

### 5.1 Identificar Componentes del Reporte

Leer del reporte:
```
ECOMMERCE > Componentes Ecommerce:
- [NombreReal1]: [ruta] - Props: [...] - PUNTO DE INTEGRACIÓN: [...]
- [NombreReal2]: [ruta] - Props: [...] - PUNTO DE INTEGRACIÓN: [...]
```

### 5.2 Modificar Componentes Identificados

Para CADA componente identificado en el reporte:

En el archivo indicado por el reporte (ej: la ruta del componente ecommerce):

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

### ⚠️ IMPORTANTE: Tests van en el MÓDULO EXISTENTE

**CRÍTICO**: Los tests de integración se crean en el **módulo existente** (ej: `products`), NO en el nuevo módulo (ej: `tags`).

```
❌ INCORRECTO: src/module/tags/e2e/admin/02-integration.ts
✅ CORRECTO:   src/module/products/e2e/integration/tags.ts
```

**Razón**: El módulo existente es el que fue MODIFICADO para soportar la integración. Los tests deben validar que esa modificación funciona correctamente.

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

### 6.1 Lanzar QA Agent para Tests de Integración

**El Integration Lead NO crea los tests directamente.** Debe lanzar al QA Agent.

**⚠️ CRÍTICO: Incluir contexto de navegación del módulo existente**

El QA Agent necesita saber CÓMO navegar en el módulo existente. Esta información viene del reporte del Module Expert (FASE 0).

```typescript
Task({
  description: "QA: Create integration E2E tests for [nuevoModulo] in [moduloExistente]",
  prompt: `
    TAREA: Crear tests E2E de integración
    ROL: QA

    INTEGRACIÓN: [nuevoModulo] integrado en [moduloExistente]

    ⚠️ CRÍTICO - UBICACIÓN DE ARCHIVOS:
    Los tests van en el MÓDULO EXISTENTE, no en el nuevo:

    ARCHIVOS A CREAR:
    - src/module/[moduloExistente]/e2e/integration/[nuevoModulo]s.ts
    - src/module/[moduloExistente]/e2e/index-integration.ts

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ⚠️ CONTEXTO DE NAVEGACIÓN DEL MÓDULO [moduloExistente] (del Module Expert):
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    [PEGAR AQUÍ LA SECCIÓN "ADMIN > Navegación" DEL REPORTE DEL MODULE EXPERT]

    Ejemplo para products:
    - La lista usa DynamicTable con action menu (tres puntos)
    - Para acceder a variantes: click botón acciones → click "Variantes"
    - NO hay links directos en las filas de la tabla
    - Selector correcto: 'table tbody tr button' (no 'table tbody tr td a')

    [FIN DEL CONTEXTO DE NAVEGACIÓN]
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    TESTS ADMIN A CREAR:
    - TC-INT-01: Navegar a edit de [moduloExistente]
    - TC-INT-02: Ver selector de [nuevoModulo]s
    - TC-INT-03: Seleccionar [nuevoModulo]s y guardar
    - TC-INT-04: Verificar [nuevoModulo]s guardados
    - TC-INT-05: Ver badges de [nuevoModulo]s en lista

    TESTS ECOMMERCE A CREAR:
    - TC-INT-06: Ver ProductCard con [nuevoModulo] badge
    - TC-INT-07: Ver ProductDetail con [nuevoModulo]s
    - TC-INT-08: Ver en mobile (responsive)

    SKILL A SEGUIR:
    .agents/skills/qa/create-integration-e2e.md

    SCREENSHOTS OBLIGATORIOS EN:
    src/module/[moduloExistente]/e2e/screenshots/[nuevoModulo]/

    ADMIN:
    - 01-admin-edit-selector.png
    - 02-admin-edit-selected.png
    - 03-admin-edit-saved.png
    - 04-admin-list-badges.png

    ECOMMERCE:
    - 05-ecommerce-card-with-tag.png
    - 06-ecommerce-detail-with-tags.png
    - 07-ecommerce-mobile.png

    ⚠️ EJECUTAR SOLO TESTS DE INTEGRACIÓN:
    npx tsx src/module/[moduloExistente]/e2e/integration/[nuevoModulo].ts
    NO ejecutar el runner principal (index.ts) que regenera todos los screenshots.

    AL COMPLETAR:
    1. Ejecutar tests: npx tsx src/module/[moduloExistente]/e2e/index-integration.ts
    2. Verificar screenshots generados
    3. Notificar a Integration Lead con lista de screenshots

    ACTIVITY LOG:
    ./.agents/scripts/log.sh "QA" "Creando tests integración [nuevoModulo] en [moduloExistente]"
    ./.agents/scripts/log.sh "QA" "Tests ejecutados: X/Y pasaron"
    ./.agents/scripts/log.sh "QA" "Screenshots generados: [lista]"
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "AskUserQuestion"]
})
```

### 6.2 Validar que QA Generó Screenshots

**ANTES de continuar, verificar:**

```bash
# Verificar screenshots de integración existen
ls -la src/module/[moduloExistente]/e2e/screenshots/[nuevoModulo]/

# Debe haber mínimo:
# - Screenshots de admin (selector, guardado, lista)
# - Screenshots de ecommerce (ProductCard, ProductDetail)
# - Screenshots de mobile
```

**Si NO hay screenshots:**
- QA no completó su trabajo
- Relanzar QA agent
- NO declarar integración completa

### 6.3 Casos de Test de Integración

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
screenshots/[nuevoModulo]/admin/
├── admin-edit-without-[nuevoModulo]s.png      # Estado inicial
├── admin-edit-[nuevoModulo]-selector.png      # Selector visible
├── admin-edit-[nuevoModulo]s-selected.png     # Tags seleccionados
├── admin-edit-after-save.png                   # Después de guardar
└── admin-list-with-[nuevoModulo]-badges.png   # Lista con badges
```

**Ecommerce (validar modelo de negocio visual):**
```
screenshots/[nuevoModulo]/ecommerce/
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

UBICACIÓN: src/module/[moduloExistente]/e2e/screenshots/[nuevoModulo]/

SOLICITO: Validación de que visualización corresponde al modelo de negocio
- ¿Los tags se ven donde deben verse?
- ¿El diseño es apropiado (badges, colores, posición)?
- ¿La información mostrada es correcta?
```

---

## 🔄 FASE 7: MANEJO DE FALLOS DE TESTS

### ⚠️ REGLA PRINCIPAL: NO borrar tests que fallan

**Si un test falla:**
1. **NO eliminar el test**
2. **Analizar QUÉ falló** (leer output + screenshot)
3. **Identificar QUIÉN debe corregir** (Frontend o Backend)
4. **Enviar a corregir** con contexto específico
5. **Re-ejecutar SOLO el test que falló**

### 7.1 Analizar el Fallo

```bash
# Ver output del test
cat /tmp/test-output.txt | grep -A 10 "FAILED"

# Ver screenshot de error
ls src/module/[moduloExistente]/e2e/screenshots/*ERROR*
```

### 7.2 Clasificar el Error

| Síntoma | Responsable | Acción |
|---------|-------------|--------|
| "Element not found" / selector no existe | **Frontend** | Componente no renderiza o selector incorrecto |
| "API returned 400/500" | **Backend** | Endpoint falla o validación incorrecta |
| "No data" / lista vacía | **Backend** | Query no retorna datos o relación no guardada |
| "Timeout waiting for element" | **Frontend** | Componente no carga o está oculto |
| "Badge not visible" | **Frontend** | Estilos incorrectos o componente no incluido |
| "Navigation failed" | **QA** | Selector de navegación incorrecto (action menu) |

### 7.3 Enviar a Corregir

**Si es error de FRONTEND:**

```typescript
Task({
  description: "Frontend: Fix [descripción del error] in [moduloExistente]",
  prompt: `
    ERROR EN TEST DE INTEGRACIÓN
    ============================

    TEST QUE FALLÓ: TC-INT-[XX]: [nombre del test]

    ERROR:
    [pegar mensaje de error]

    SCREENSHOT:
    [ruta al screenshot de error]

    ANÁLISIS:
    - Elemento esperado: [qué debería existir]
    - Elemento encontrado: [qué hay actualmente]
    - Archivo probable: [ruta del componente]

    TU TRABAJO:
    1. Leer el componente indicado
    2. Identificar por qué no renderiza/no es visible
    3. Corregir
    4. Notificar a Integration Lead cuando esté listo

    NO modificar otros archivos. Solo corregir este error específico.
  `,
  subagent_type: "general-purpose"
})
```

**Si es error de BACKEND:**

```typescript
Task({
  description: "Backend: Fix [descripción del error] in [moduloExistente] API",
  prompt: `
    ERROR EN TEST DE INTEGRACIÓN
    ============================

    TEST QUE FALLÓ: TC-INT-[XX]: [nombre del test]

    ERROR:
    [pegar mensaje de error]

    ANÁLISIS:
    - Endpoint: [ruta de API]
    - Request: [qué se envió]
    - Response: [qué retornó]
    - Esperado: [qué debería retornar]

    TU TRABAJO:
    1. Revisar el endpoint indicado
    2. Identificar por qué falla
    3. Corregir
    4. Notificar a Integration Lead cuando esté listo

    NO modificar otros archivos. Solo corregir este error específico.
  `,
  subagent_type: "general-purpose"
})
```

### 7.4 Re-ejecutar Solo el Test que Falló

**NO re-ejecutar todos los tests.** Solo el que falló:

```typescript
Task({
  description: "QA: Re-run failed test TC-INT-[XX]",
  prompt: `
    RE-EJECUTAR TEST ESPECÍFICO
    ===========================

    TEST A EJECUTAR: TC-INT-[XX]: [nombre del test]
    ARCHIVO: src/module/[moduloExistente]/e2e/integration/[nuevoModulo]s.ts

    CONTEXTO:
    - Este test falló anteriormente
    - Frontend/Backend ya corrigió el problema
    - Solo necesitas re-ejecutar ESTE test, no todos

    INSTRUCCIONES:
    1. Navegar al estado inicial del test
    2. Ejecutar SOLO los pasos de TC-INT-[XX]
    3. Tomar screenshot
    4. Reportar: PASSED o FAILED con detalles

    SI PASA: Notificar a Integration Lead "Test TC-INT-[XX] ahora pasa ✅"
    SI FALLA: Notificar con nuevo error para análisis
  `,
  subagent_type: "general-purpose"
})
```

### 7.5 Flujo de Iteración

```
Test falla
    │
    ▼
Integration Lead analiza error
    │
    ├─── Error de Frontend ───► Lanzar Frontend agent
    │                                    │
    ├─── Error de Backend ────► Lanzar Backend agent
    │                                    │
    └─── Error de QA (selector) ► Corregir selector en test
                                         │
                                         ▼
                              Agent corrige y notifica
                                         │
                                         ▼
                              Integration Lead re-lanza QA
                              para re-ejecutar SOLO ese test
                                         │
                                         ▼
                              ¿Pasa? ──► Sí ──► Continuar
                                  │
                                  └──► No ──► Repetir ciclo
```

### 7.6 Log de Iteraciones

```bash
# Registrar cada iteración
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Test TC-INT-03 falló: selector no encontrado"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "→ Clasificado como: Error Frontend"
./.agents/scripts/log.sh "INTEGRATION-LEAD" "→ Enviado a Frontend para corrección"

# Después de corrección
./.agents/scripts/log.sh "INTEGRATION-LEAD" "Frontend corrigió. Re-ejecutando TC-INT-03..."
./.agents/scripts/log.sh "INTEGRATION-LEAD" "✓ TC-INT-03 ahora pasa"
```

---

## ✅ CHECKLIST FINAL

### ⛔ NO DECLARAR COMPLETO SIN VERIFICAR TODOS ESTOS ITEMS

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

### QA - Integración (EN MÓDULO EXISTENTE)
- [ ] Tests creados en `src/module/[moduloExistente]/e2e/integration/`
- [ ] Tests de integración ejecutados y pasaron
- [ ] **Screenshots de admin EXISTEN** en `screenshots/[nuevoModulo]/`:
  - [ ] admin-edit-selector.png
  - [ ] admin-edit-selected.png
  - [ ] admin-list-badges.png
- [ ] **Screenshots de ecommerce EXISTEN**:
  - [ ] ecommerce-card-with-[nuevoModulo].png
  - [ ] ecommerce-detail-with-[nuevoModulo]s.png
  - [ ] ecommerce-mobile.png

### Validación Module Lead (OBLIGATORIO)
- [ ] Module Lead revisó screenshots de admin
- [ ] Module Lead revisó screenshots de ecommerce
- [ ] Module Lead confirmó que visualización corresponde al modelo de negocio
- [ ] Cumplimiento >= 90%

### 🚨 SI FALTA ALGÚN SCREENSHOT:
1. NO declarar integración completa
2. Relanzar QA agent para generar screenshots faltantes
3. Volver a validar

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
