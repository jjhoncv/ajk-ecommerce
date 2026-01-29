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
| isActive | BOOLEAN | No | default: true |
| position | INT | No | default: 0 |

### Ecommerce (si aplica)
- [ ] Página pública de [modulo]
- [ ] SEO dinámico
- [ ] Página 404

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
