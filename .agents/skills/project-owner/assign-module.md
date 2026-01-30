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

3. **Identificar relaciones**
   - ¿Se relaciona con productos? ¿Categorías? ¿Órdenes?
   - ¿Requiere tabla pivote? (el equipo puede hacerlo)

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

### 4. Enviar Asignación a Module Lead

```
ASIGNACION: [modulo]
MODELO DE NEGOCIO: .agents/specs/[modulo]-testing-spec.md
BRANCH: feature/[modulo]
PRIORIDAD: [alta/media/baja]
DEPENDENCIAS: [lista o "ninguna"]

INSTRUCCIONES:
1. Leer el modelo de negocio completo
2. Crear .agents/active/[modulo]-status.md
3. Dividir tareas para tu equipo
4. Notificar si hay conflictos con shared/
```

---

## Outputs
- `.agents/specs/[modulo]-testing-spec.md` creado
- `.agents/project.json` actualizado
- Branch `feature/[modulo]` creado
- Mensaje de asignación enviado

## Next
- Module Lead ejecuta `start-module.md`
- Monitorear progreso en `.agents/active/`
