# Skill: Limpiar Módulo Completamente

## Rol
Project Owner

## Trigger
- Usuario solicita borrar/recrear un módulo
- Módulo tiene errores graves que requieren empezar de cero
- Cambio de branch incorrecto detectado

## Inputs
- Nombre del módulo a limpiar
- Branch actual
- Confirmación del usuario

---

## IMPORTANTE: Verificar Branch

Antes de cualquier limpieza, verificar en qué branch estamos:

```bash
git branch --show-current
```

### Reglas de Branch:

| Tipo de cambio | Branch correcto |
|----------------|-----------------|
| Skills (.agents/skills/) | `main` |
| Roles (.agents/roles/) | `main` |
| Governance/Communication | `main` |
| Código del módulo | `feature/[modulo]` |
| Specs del módulo | `feature/[modulo]` |
| Status del módulo | `feature/[modulo]` |

**Si hay cambios en branch incorrecto:**
1. Stash los cambios
2. Cambiar al branch correcto
3. Aplicar cambios
4. Commit
5. Volver al branch de trabajo

---

## Steps

### 1. Confirmar con Usuario

```
⚠️ CONFIRMACIÓN REQUERIDA

Se va a eliminar completamente el módulo: [modulo]

ESTO ELIMINARÁ:
  - src/module/[modulo]/ (todo el código)
  - src/app/admin/[modulo]/ (páginas admin)
  - src/app/api/admin/[modulo]/ (API routes)
  - .agents/specs/[modulo]-* (especificaciones)
  - .agents/active/[modulo]-* (estado)
  - Tabla [modulo] de la base de datos
  - Entrada en project.json

¿Continuar? (si/no)
```

### 2. Verificar Branch Actual

```bash
CURRENT_BRANCH=$(git branch --show-current)
echo "Branch actual: $CURRENT_BRANCH"

# Verificar cambios pendientes
git status --short
```

Si hay cambios de skills en branch de feature:
- Ejecutar proceso de mover a main (ver sección "Mover Skills a Main")

### 3. Eliminar Archivos del Módulo

```bash
# Eliminar código del módulo
rm -rf src/module/[modulo]

# Eliminar páginas admin
rm -rf src/app/admin/[modulo]

# Eliminar API routes
rm -rf src/app/api/admin/[modulo]

# Eliminar specs y status
rm -rf .agents/specs/[modulo]-*
rm -rf .agents/active/[modulo]-*

echo "✅ Archivos del módulo eliminados"
```

### 4. Eliminar Tabla de Base de Datos

```bash
# Eliminar tabla
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DROP TABLE IF EXISTS [modulo];"

# Verificar que se eliminó
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '[modulo]';"

echo "✅ Tabla eliminada de la base de datos"
```

### 5. Regenerar Types

```bash
pnpm generate
```

Esto actualiza:
- `src/types/database/database.d.ts`
- `src/types/domain/domain.d.ts`

### 6. Actualizar project.json

Editar `.agents/project.json`:
- Eliminar entrada del módulo en `modules`
- Eliminar de `pendingReleases` si está

**Antes:**
```json
{
  "modules": {
    ...
    "[modulo]": { "status": "in-progress", "version": "0.1.0" }
  },
  "pendingReleases": ["[modulo]"]
}
```

**Después:**
```json
{
  "modules": {
    ...
  },
  "pendingReleases": []
}
```

### 7. Limpiar Branch (si aplica)

Si el branch tiene commits del módulo que se quieren eliminar:

```bash
# Opción A: Reset a main (elimina todos los commits del módulo)
git reset --hard main

# Opción B: Revert commits específicos (mantiene historial)
git revert <commit-hash>
```

### 8. Verificar Estado Final

```bash
# Verificar que no hay archivos del módulo
ls src/module/[modulo] 2>/dev/null && echo "ERROR: Módulo aún existe" || echo "✅ No existe src/module/[modulo]"
ls src/app/admin/[modulo] 2>/dev/null && echo "ERROR: Admin aún existe" || echo "✅ No existe src/app/admin/[modulo]"
ls src/app/api/admin/[modulo] 2>/dev/null && echo "ERROR: API aún existe" || echo "✅ No existe src/app/api/admin/[modulo]"

# Verificar que no hay tabla
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '[modulo]';" 2>/dev/null | grep -q "[modulo]" && echo "ERROR: Tabla aún existe" || echo "✅ No existe tabla [modulo]"

# Verificar git status
git status --short

echo "---"
echo "Estado final del branch:"
git log --oneline -3
```

---

## Proceso: Mover Skills a Main

Si detectas cambios de skills en un branch de feature:

### 1. Identificar Archivos

```bash
git status --short | grep -E "\.agents/(skills|roles)"
```

### 2. Separar Cambios

```bash
# Stash archivos de skills (tracked)
git stash push -m "skill changes for main" -- \
  .agents/roles/*.md \
  .agents/skills/**/*.md

# Para archivos nuevos (untracked), copiar a /tmp
cp .agents/skills/[nuevo-archivo].md /tmp/
rm .agents/skills/[nuevo-archivo].md
```

### 3. Cambiar a Main y Aplicar

```bash
# Ir a main
git checkout main

# Aplicar stash
git stash pop

# Copiar archivos nuevos
cp /tmp/[nuevo-archivo].md .agents/skills/[path]/

# Commit
git add .agents/
git commit -m "feat(agents): [descripción de cambios]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### 4. Volver al Feature Branch

```bash
# Volver al feature branch
git checkout feature/[modulo]

# Rebase sobre main para tener los skills
git rebase main
```

---

## Checklist de Limpieza

```
[ ] Confirmación del usuario obtenida
[ ] Branch verificado (skills en main, código en feature)
[ ] src/module/[modulo]/ eliminado
[ ] src/app/admin/[modulo]/ eliminado
[ ] src/app/api/admin/[modulo]/ eliminado
[ ] .agents/specs/[modulo]-* eliminado
[ ] .agents/active/[modulo]-* eliminado
[ ] Tabla [modulo] eliminada de BD
[ ] pnpm generate ejecutado
[ ] project.json actualizado
[ ] Branch limpio (reset o revert si necesario)
[ ] git status muestra working tree clean
```

---

## Outputs
- Módulo completamente eliminado
- Base de datos limpia
- Types regenerados
- project.json actualizado
- Branch en estado limpio

## Next
- Recrear módulo desde cero si se desea
- O continuar con otro trabajo

---

## Comandos Rápidos (Copy-Paste)

### Limpieza completa de un módulo:

```bash
# Reemplazar [MODULO] con el nombre del módulo
MODULO="tags"

# 1. Eliminar archivos
rm -rf src/module/$MODULO src/app/admin/$MODULO src/app/api/admin/$MODULO .agents/specs/$MODULO-* .agents/active/$MODULO-*

# 2. Eliminar tabla
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DROP TABLE IF EXISTS $MODULO;"

# 3. Regenerar types
pnpm generate

# 4. Verificar
echo "=== Verificación ==="
ls src/module/$MODULO 2>/dev/null || echo "✅ src/module/$MODULO no existe"
ls src/app/admin/$MODULO 2>/dev/null || echo "✅ src/app/admin/$MODULO no existe"
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '$MODULO';" 2>/dev/null | grep -q "$MODULO" || echo "✅ Tabla $MODULO no existe"
```

### Reset branch a main:

```bash
git reset --hard main
git log --oneline -3
```
