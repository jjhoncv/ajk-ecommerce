# Skill: Asignar Módulo

## Rol
Project Owner

## Trigger
Usuario solicita nuevo módulo o funcionalidad

## Inputs
- Descripción de lo que el usuario quiere
- Contexto del negocio (si lo proporciona)

---

## 🧠 FASE 1: ANÁLISIS ESTRATÉGICO

**El Project Owner NO es un tomador de pedidos. Es un consultor estratégico.**

### 1.1 Conocer las Capacidades del Equipo

Antes de proponer, revisar qué puede hacer cada rol:

```
LEER SKILLS DEL EQUIPO:
- .agents/skills/dba/create-table.md
- .agents/skills/backend/create-module.md
- .agents/skills/backend/create-ecommerce.md
- .agents/skills/frontend/create-admin.md
- .agents/skills/frontend/create-ecommerce.md
- .agents/skills/qa/create-e2e.md
- .agents/skills/qa/create-ecommerce-e2e.md
```

De estos skills, el equipo PUEDE:

| Rol | Capacidades |
|-----|-------------|
| **DBA** | Crear tablas MySQL con: id, name, slug, description, image_url, is_active, display_order, timestamps. Generar tipos TypeScript. |
| **Backend Admin** | Model-Repository-Mapper, Services, APIs REST CRUD con validaciones Zod. |
| **Backend Ecommerce** | Services SSR con hydrators (NO APIs REST para público). |
| **Frontend Admin** | Componentes Fields/ListView, páginas list/new/edit, drag & drop, upload de imágenes. |
| **Frontend Ecommerce** | Grid, Featured, Detail components. Páginas públicas con SSR y SEO dinámico. |
| **QA** | Tests E2E con Puppeteer, screenshots para validación visual. |

### 1.2 Analizar la Solicitud

Con el conocimiento del equipo, analizar:

1. **Entender qué quiere el usuario**
   - ¿Qué problema resuelve este módulo?
   - ¿Cuál es el valor de negocio?

2. **Mapear a capacidades del equipo**
   - ¿Qué de lo que pide YA SABEMOS hacer?
   - ¿Hay algo que requiera capacidades nuevas?

3. **Identificar relaciones con módulos EXISTENTES**
   - ¿Se relaciona con productos? ¿Categorías? ¿Órdenes?
   - ¿El módulo relacionado YA EXISTE en el sistema?
   - ¿Requiere tabla pivote? (el equipo puede hacerlo)

### 1.3 CRÍTICO: Verificar Módulos Existentes

**SIEMPRE** revisar `.agents/project.json` para ver módulos ya creados:

```bash
cat .agents/project.json | grep -A 2 '"status": "released"'
```

**Si el nuevo módulo se relaciona con uno existente**, seguir:
→ `.agents/skills/project-owner/analyze-integration.md`

Ejemplos de integraciones comunes:
| Nuevo Módulo | Se relaciona con | Tipo | Pregunta clave |
|--------------|------------------|------|----------------|
| tags | products | M:N | ¿A nivel producto o variante? |
| reviews | products/variants | M:N | ¿Reviews de producto o variante? |
| wishlists | customers + variants | M:N | ¿Guardar variante específica? |
| collections | products | M:N | ¿Colecciones manuales o automáticas? |

**PREGUNTA OBLIGATORIA** cuando hay relación con módulo existente:
```
Tu módulo [nuevo] se relaciona con [existente].
¿A qué nivel debe ser la asociación?
- A nivel de [entidad principal]
- A nivel de [sub-entidad] (si aplica, ej: variante)
- Ambos niveles

Esto determina: tabla pivote, UI de admin, visualización ecommerce.
```

### 1.3 Preparar Propuesta

Basado en las capacidades del equipo, preparar:

```
ANÁLISIS DE TU SOLICITUD: [nombre módulo]
==========================================

ENTENDIMIENTO:
[Parafrasear lo que el usuario pidió para confirmar entendimiento]

PROPÓSITO DE NEGOCIO:
[Explicar cómo este módulo aporta valor]

---

LO QUE MI EQUIPO PUEDE CONSTRUIR:

1. BASE DE DATOS (DBA):
   Campos estándar que manejamos:
   - id (CHAR 36, UUID)
   - name (VARCHAR 255, obligatorio)
   - slug (VARCHAR 255, único, auto-generado)
   - description (TEXT, opcional)
   - image_url (VARCHAR 500, opcional)
   - is_active (BOOLEAN, default true)
   - display_order (INT, para ordenamiento)
   - created_at, updated_at (timestamps)

   [Proponer campos adicionales específicos si aplica]

2. ADMIN (Backend + Frontend):
   - CRUD completo con validaciones
   - Listado con paginación
   - Ordenamiento drag & drop (si hay display_order)
   - Upload de imagen (si hay image_url)
   - Formulario con validaciones en tiempo real

3. ECOMMERCE (si aplica):
   - Página de listado público (/[modulo])
   - Página de detalle (/[modulo]/[slug])
   - Componente Grid para mostrar items
   - Componente Featured para destacados
   - SEO dinámico (meta title, description)
   - Página 404 personalizada
   - Diseño responsive

4. TESTING (QA):
   - Tests E2E automatizados
   - Screenshots para validación visual
   - Cobertura: CRUD admin + páginas públicas

---

MI PROPUESTA PARA [módulo]:

ADMIN:
[Describir qué tendría el admin basado en capacidades]

ECOMMERCE:
[Proponer si debería tener presencia pública y qué incluiría]
[Si no aplica, explicar por qué solo admin]

RELACIONES:
[Si se relaciona con productos u otros módulos, proponer cómo]

---

PREGUNTAS PARA AFINAR:
```

---

## 💬 FASE 2: PREGUNTAS DE CLARIFICACIÓN

Después de presentar el análisis, hacer preguntas específicas:

### Preguntas Admin
1. ¿Los campos que propongo son correctos? ¿Agregarías o quitarías alguno?
2. ¿Hay validaciones especiales? (ej: nombre único, longitud máxima)
3. ¿Necesitas múltiples imágenes o solo una?
4. ¿El ordenamiento manual es importante para ti?

### Preguntas Ecommerce
1. ¿Este módulo debe ser visible en la tienda pública?
   - Si SÍ:
     - ¿Quieres una página dedicada? (ej: `/tags` con listado)
     - ¿Cada item tiene su página de detalle? (ej: `/tags/ofertas`)
     - ¿Debe aparecer en el homepage? ¿Cómo? (grilla, destacados, slider)
   - Si NO:
     - Solo existirá en el admin para gestión interna

2. ¿Cómo se relaciona con productos?
   - ¿Un producto puede tener múltiples [entidades]?
   - ¿Se filtra por [entidad] en búsquedas?

### Preguntas de Prioridad
1. ¿Cuál es la urgencia? (alta/media/baja)
2. ¿Hay fecha límite?

---

## 📝 FASE 3: CREAR SPEC

Solo después de recibir respuestas, crear el spec.

### Steps

### 1. Crear Testing Spec

Crear archivo `.agents/specs/[modulo]-testing-spec.md`:

```markdown
# Testing Spec: [Modulo]

## Descripción
[Descripción del módulo y su propósito de negocio]

## Criterios de Aceptación

### Admin CRUD
- [ ] Listar [modulo]s con paginación
- [ ] Crear nuevo [modulo]
- [ ] Editar [modulo] existente
- [ ] Eliminar [modulo]
- [ ] Validaciones de formulario

### Campos Requeridos
| Campo | Tipo | Requerido | Validación |
|-------|------|-----------|------------|
| name | VARCHAR(255) | Sí | min:2, max:100 |
| slug | VARCHAR(255) | Sí | pattern: ^[a-z0-9-]+$ |
| description | TEXT | No | - |
| image_url | VARCHAR(500) | No | - |
| is_active | BOOLEAN | No | default: true |
| display_order | INT | No | default: 0 |

---

## Ecommerce

### Estado
- **ecommerceEnabled**: [true/false]

### Páginas Públicas (si ecommerceEnabled: true)
| Página | URL | Descripción |
|--------|-----|-------------|
| Listado | `/[modulo]` | [Muestra todos los items activos] |
| Detalle | `/[modulo]/[slug]` | [Muestra detalle de un item] |
| 404 | `/[modulo]/[slug-inexistente]` | [Página de no encontrado] |

### Integración en Homepage (si aplica)
- [ ] Sección en homepage: [sí/no]
- Tipo de visualización: [grilla / destacados / slider / ninguno]
- Cantidad de items: [N]

### Campos Visibles en Ecommerce
| Ubicación | Campos |
|-----------|--------|
| Card (listado) | name, image, description |
| Página detalle | name, image, description |
| Homepage | name, image |

### SEO
- [ ] Meta title dinámico
- [ ] Meta description dinámico
- [ ] Open Graph tags

---

## Integración con Módulos Existentes

### Estado de Integración
- **requiereIntegracion**: [true/false]
- **moduloRelacionado**: [products/categories/customers/ninguno]
- **tipoRelacion**: [M:N / 1:N / 1:1 / ninguna]
- **nivelAsociacion**: [producto / variante / ambos / N/A]

### Tabla Pivote (si M:N)
```sql
CREATE TABLE [modulo_existente]_[nuevo_modulo]s (
  id CHAR(36) PRIMARY KEY,
  [modulo_existente]_id CHAR(36) NOT NULL,
  [nuevo_modulo]_id CHAR(36) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ([modulo_existente]_id) REFERENCES [modulo_existente](id) ON DELETE CASCADE,
  FOREIGN KEY ([nuevo_modulo]_id) REFERENCES [nuevo_modulo]s(id) ON DELETE CASCADE,
  UNIQUE KEY unique_association ([modulo_existente]_id, [nuevo_modulo]_id)
);
```

### Tareas de Integración

**⚠️ REGLA: Cada ubicación de visualización en el spec genera UNA tarea.**

El Project Owner DEBE:
1. Definir en el spec TODAS las ubicaciones donde el nuevo módulo será visible
2. Crear UNA tarea de Frontend por CADA ubicación
3. Crear UNA validación de QA por CADA ubicación

```markdown
- [ ] DBA: Crear tabla pivote
- [ ] Backend: Extender repository/service del módulo existente
- [ ] Backend: Crear endpoint para ecommerce (analizar si requiere autenticación o es público)
- [ ] Frontend Admin: Agregar selector en edit page del módulo existente
- [ ] Frontend Ecommerce: Por CADA ubicación del spec, analizar código y modificar componente correspondiente
- [ ] QA: Por CADA ubicación del spec, validar que el elemento sea VISIBLE (no solo tomar screenshot)
```

**El agente de Frontend DEBE:**
1. Leer sección "Ubicaciones de Visualización" del spec
2. Para cada ubicación, ANALIZAR el código del módulo existente
3. DESCUBRIR qué archivo renderiza esa vista
4. Modificar ese archivo

**El agente de QA DEBE:**
1. Leer sección "Criterios de Validación" del spec
2. Para cada screenshot requerido, crear validación programática
3. El test debe FALLAR si el elemento no está visible

### Ecommerce de Integración (diferente a ecommerce standalone)
El "ecommerce" del nuevo módulo puede ser su visualización DENTRO del módulo existente:
- **Ejemplo tags**: No tiene `/tags` público, pero se muestra como badges en `/productos/[slug]`
- **Ejemplo reviews**: No tiene `/reviews` público, pero se muestra en página de producto

### ⚠️ CRÍTICO: Criterios de Validación Visual de Integración

**Esta sección define QUÉ debe verse en los screenshots para validar el modelo de negocio.**

QA NO puede aprobar la integración sin estos screenshots:

#### Screenshots REQUERIDOS para validar integración:
| # | Screenshot | Descripción | Criterio de Aprobación |
|---|------------|-------------|------------------------|
| 1 | `admin-[nuevo]-created` | Item del nuevo módulo creado en su admin | Item visible en lista con datos correctos |
| 2 | `admin-[existente]-selector-available` | Página editar de [existente] mostrando selector con items disponibles | Selector visible Y muestra items del nuevo módulo |
| 3 | `admin-[existente]-selector-selected` | Selector con item(s) seleccionado(s) | Item(s) marcado(s) como seleccionado(s) |
| 4 | `admin-[existente]-after-save` | Después de guardar la asociación | Mensaje de éxito O asociación visible |
| 5 | `ecommerce-[existente]-with-[nuevo]` | Página pública de [existente] mostrando [nuevo] | Badge/componente del nuevo módulo VISIBLE |
| 6 | `ecommerce-[existente]-detail-with-[nuevo]` | Página detalle mostrando [nuevo] | Nuevo módulo visible en detalle |

#### Flujo End-to-End que QA DEBE probar:
```
1. CREAR: Ir a /admin/[nuevo] → Crear item con datos de prueba
2. VERIFICAR CREACIÓN: Screenshot del item creado en lista
3. ASOCIAR: Ir a /admin/[existente]/[id]/edit → Buscar selector de [nuevo]
4. SELECCIONAR: Elegir item(s) del nuevo módulo → Screenshot
5. GUARDAR: Guardar cambios → Screenshot de confirmación
6. VALIDAR ADMIN: Verificar asociación guardada en lista/detalle admin
7. VALIDAR ECOMMERCE: Ir a página pública de [existente] → Screenshot con [nuevo] visible
8. VALIDAR DETALLE: Ir a detalle de [existente] → Screenshot con [nuevo] visible
```

#### ❌ Casos que INVALIDAN la integración:
- Selector dice "No hay [nuevo] disponibles" → Falta paso 1 (crear item)
- Ecommerce no muestra [nuevo] → Falta paso 5 (guardar asociación)
- Screenshots sin datos reales → NO valida el modelo de negocio

**Sin estos screenshots con datos reales, la integración NO está validada.**

---

## Dependencias
- Depende de: [lista o "ninguna"]
- Bloquea a: [lista o "ninguna"]

## Prioridad
[alta/media/baja]

## Notas Adicionales
[Cualquier consideración especial]
```

### 2. Actualizar project.json

Editar `.agents/project.json`:

```json
{
  "modules": {
    "[modulo]": {
      "status": "in-progress",
      "version": "0.0.0",
      "assignedDate": "YYYY-MM-DD"
    }
  },
  "activeFeatures": ["[modulo]"]
}
```

### 3. Crear Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/[modulo]
git push -u origin feature/[modulo]
```

### 4. Lanzar Module Lead con Task Tool

**⚠️ CRÍTICO: NO solo escribir el mensaje. DEBES usar Task() para lanzar al agente.**

```typescript
Task({
  description: "Module Lead: Coordinate [modulo] module development",
  prompt: `
    ROL: Module Lead
    ASIGNACIÓN: Módulo [modulo]

    SPEC: .agents/specs/[modulo]-testing-spec.md
    BRANCH: feature/[modulo]
    PRIORIDAD: [alta/media/baja]
    DEPENDENCIAS: [lista o "ninguna"]

    SKILLS A SEGUIR:
    - .agents/skills/module-lead/start-module.md
    - .agents/skills/module-lead/assign-tasks.md

    INSTRUCCIONES:
    1. Leer el spec completo
    2. Crear .agents/active/[modulo]-status.md
    3. Ejecutar FASE 1: DBA → Backend → Frontend → QA
    4. Si requiereIntegracion: true, ejecutar FASE 2 con Integration Lead
    5. Validar screenshots antes de declarar completo
    6. Hacer commit final

    ACTIVITY LOG:
    ./.agents/scripts/log.sh "MODULE-LEAD" "Iniciando coordinación módulo [modulo]"
  `,
  subagent_type: "general-purpose",
  allowed_tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "Task", "AskUserQuestion"]
})
```

**El Project Owner NO termina hasta que Module Lead sea lanzado con Task().**

---

## Outputs
- `.agents/specs/[modulo]-testing-spec.md` creado
- `.agents/project.json` actualizado
- Branch `feature/[modulo]` creado
- **Module Lead lanzado con Task tool** (no solo mensaje)

## Next
- Module Lead coordina el desarrollo
- Monitorear progreso en `.agents/active/`
