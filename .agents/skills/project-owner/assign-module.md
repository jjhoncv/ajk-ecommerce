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

### 1.1 Analizar la Solicitud

Antes de hacer preguntas, analizar:

1. **Entender el propósito de negocio**
   - ¿Qué problema resuelve este módulo?
   - ¿Cómo encaja con los módulos existentes?
   - ¿Hay módulos similares que ya existen? (categories, brands, banners)

2. **Revisar el contexto del ecommerce**
   - Leer `CLAUDE.md` para entender la arquitectura
   - Ver qué módulos existen en `src/module/`
   - Identificar patrones y convenciones del proyecto

3. **Identificar dependencias**
   - ¿Este módulo se relaciona con productos? ¿Categorías? ¿Órdenes?
   - ¿Requiere tabla pivote (many-to-many)?

### 1.2 Preparar Propuesta

Basado en el análisis, preparar:

```
ANÁLISIS DE TU SOLICITUD: [nombre módulo]
==========================================

ENTENDIMIENTO:
[Parafrasear lo que el usuario pidió para confirmar entendimiento]

PROPÓSITO DE NEGOCIO:
[Explicar cómo este módulo aporta valor al ecommerce]

MÓDULOS RELACIONADOS:
[Listar módulos existentes que se relacionan]

---

MIS RECOMENDACIONES:

1. CAMPOS SUGERIDOS:
   - name (obligatorio) - Nombre del [entidad]
   - slug (obligatorio) - URL amigable, auto-generado
   - description (opcional) - Descripción para SEO
   - image_url (opcional) - Imagen representativa
   - is_active (default: true) - Control de visibilidad
   - display_order (default: 0) - Ordenamiento manual

2. FUNCIONALIDADES ADMIN:
   - CRUD completo con validaciones
   - Ordenamiento drag & drop (si display_order existe)
   - Preview de imagen (si image_url existe)

3. CONSIDERACIONES ECOMMERCE:
   [Proponer si debería tener presencia pública o no, y por qué]

4. RELACIONES CON OTROS MÓDULOS:
   [Si aplica, proponer relaciones - ej: tags → productos]

5. BUENAS PRÁCTICAS APLICADAS:
   - Slug único para URLs SEO-friendly
   - Soft delete con is_active (no borrado físico)
   - Timestamps para auditoría

---

PREGUNTAS PARA DEFINIR MEJOR:
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
