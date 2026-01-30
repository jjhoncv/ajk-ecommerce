# Skill: Asignar Módulo

## Rol
Project Owner

## Trigger
Product Owner solicita nuevo módulo o mejora

## Inputs
- Nombre del módulo
- Descripción de funcionalidad requerida
- Prioridad (alta/media/baja)
- Dependencias conocidas

---

## ⚠️ PREGUNTAS OBLIGATORIAS A PRODUCT OWNER

Antes de crear el spec, hacer estas preguntas al Product Owner:

### Preguntas Admin (siempre)
1. ¿Qué campos debe tener la entidad?
2. ¿Cuáles son obligatorios?
3. ¿Hay reglas de validación especiales?
4. ¿Tiene imagen? ¿Múltiples imágenes?
5. ¿Se requiere ordenamiento manual (drag & drop)?

### Preguntas Ecommerce (OBLIGATORIAS)
1. ¿Este módulo se muestra en el ecommerce público? (Sí/No)
2. Si sí:
   - ¿Tiene página de listado? (ej: `/[modulo]`)
   - ¿Tiene página de detalle? (ej: `/[modulo]/[slug]`)
   - ¿Aparece en el homepage? ¿Cómo? (sección destacada, grilla, etc.)
   - ¿Qué campos se muestran en el card público? (nombre, imagen, descripción, etc.)
   - ¿Qué campos se muestran en la página de detalle?
3. Si no tiene ecommerce:
   - Marcar `ecommerceEnabled: false` en el spec

---

## Steps

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
