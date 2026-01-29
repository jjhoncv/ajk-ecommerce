# Skill: Aprobar y Documentar Release

## Rol
Project Owner

## Trigger
Product Owner aprueba el merge a main

## Inputs
- Confirmación de aprobación del Product Owner
- PR number
- Información del módulo

---

## Steps

### 1. Confirmar Merge

```bash
# Verificar que el PR está aprobado
gh pr view [PR_NUMBER] --json state,reviews

# Merge a main
gh pr merge [PR_NUMBER] --merge
```

### 2. Actualizar project.json

Editar `.agents/project.json`:

```json
{
  "modules": {
    "[modulo]": {
      "status": "released",
      "version": "1.0.0",
      "releaseDate": "YYYY-MM-DD"
    }
  },
  "activeFeatures": [/* remover [modulo] de aquí */],
  "pendingReleases": [/* remover si estaba aquí */]
}
```

### 3. Crear Archivo de Release

Crear `.agents/releases/[modulo]-v1.0.0.md`:

```markdown
# Release: [Modulo] v1.0.0

## Fecha
YYYY-MM-DD

## Module Lead
[identificador]

## Branch
feature/[modulo]

## PR
#[numero]

## Modelo de Negocio
[Resumen de lo implementado basado en testing-spec.md]

## Componentes Creados

### Base de Datos
- Tabla `[modulo]` con campos: [lista]

### Backend
- `src/module/[modulo]/core/` - Model, Repository, Mapper
- `src/module/[modulo]/service/` - [Modulo]Service
- `src/app/api/admin/[modulo]/` - CRUD endpoints

### Frontend
- `src/module/[modulo]/components/admin/` - Fields, ListView
- `src/app/admin/[modulo]/` - List, New, Edit pages

### Tests
- `src/module/[modulo]/e2e/` - [N] tests E2E
- Screenshots: [N] capturas

## Cumplimiento Final
X/Y items (Z%)

## E2E Tests
- Passed: X
- Failed: 0

## Tocó Shared
[si/no - lista de archivos si aplica]

## Aprobado por
Product Owner
```

### 4. Limpiar Active

```bash
# Mover o eliminar el status
rm .agents/active/[modulo]-status.md
```

### 5. Notificar a Otros Module Leads

Si el módulo tocaba shared/ o bloqueaba a otros:

```
NOTIFICACION: [modulo] ya está en main

PARA: Module Leads con módulos relacionados

ACCION REQUERIDA:
- Si tu branch depende de [modulo]: hacer rebase
- Si tenías conflicto con shared/: ya puedes continuar

COMANDO:
git checkout feature/[tu-modulo]
git fetch origin
git rebase origin/main

Si hay conflictos, resolver y continuar.
```

### 6. Commit de Documentación

```bash
git checkout main
git pull origin main

git add .agents/project.json
git add .agents/releases/[modulo]-v1.0.0.md
git rm .agents/active/[modulo]-status.md 2>/dev/null || true

git commit -m "docs: release [modulo] v1.0.0"
git push origin main
```

---

## Outputs
- PR mergeado a main
- `.agents/project.json` actualizado con status "released"
- `.agents/releases/[modulo]-v1.0.0.md` creado
- `.agents/active/[modulo]-status.md` eliminado
- Otros Module Leads notificados (si aplica)

## Next
- Módulos bloqueados pueden continuar
- Siguiente release en cola (si hay)
