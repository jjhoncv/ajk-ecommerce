# Skill: Proponer Release al Project Owner

## Rol
Module Lead

## Trigger
- Todos los agentes completaron (DBA, Backend, Frontend, QA)
- E2E tests pasando
- Cumplimiento >= 90%

## Inputs
- `.agents/active/[modulo]-status.md`
- Resultados de E2E tests
- Screenshots generados
- Testing spec original

---

## Steps

### 1. Ejecutar E2E Tests Completos

```bash
# Ejecutar todos los tests
npx tsx src/module/[modulo]/e2e/index.ts

# Guardar resultado
# Debe mostrar: X passed, 0 failed
```

### 2. Revisar Screenshots

```bash
# Verificar que existen
ls src/module/[modulo]/e2e/screenshots/

# Debe tener:
# - 01-list.png
# - 02-new-form.png
# - 03-validation-errors.png
# - 04-form-filled.png
# - 05-created.png
# - 06-edit-form.png
# - 07-deleted.png
```

### 3. Calcular Cumplimiento

Comparar con `.agents/specs/[modulo]-testing-spec.md`:

```
CHECKLIST FINAL:

Tabla creada:
[x] Tabla [modulo] existe en BD
[x] Types generados en src/types/

Core:
[x] model.ts con interfaces
[x] repository.ts con CRUD
[x] mapper.ts con transformaciones
[x] index.ts con exports

Service:
[x] [modulo].service.ts
[x] index.ts

API Routes:
[x] GET /api/admin/[modulo]
[x] POST /api/admin/[modulo]
[x] GET /api/admin/[modulo]/[id]
[x] PUT /api/admin/[modulo]/[id]
[x] DELETE /api/admin/[modulo]/[id]

Components Admin:
[x] [Entidad]Fields.tsx
[x] [Entidad]ListView.tsx
[x] index.ts

Pages Admin:
[x] /admin/[modulo] (list)
[x] /admin/[modulo]/new
[x] /admin/[modulo]/[id] (edit)

Formulario:
[x] Validación de campos requeridos
[x] Mensajes de error visibles

E2E Tests:
[x] Test listar
[x] Test crear
[x] Test editar
[x] Test eliminar
[x] Test validaciones

TOTAL: 22/22 = 100%
```

### 4. Verificar Conflictos Resueltos

Si tocó shared/:

```bash
cat .agents/active/[modulo]-status.md | grep -A 5 "Conflictos Activos"
```

Verificar que todos los conflictos estén en estado "resuelto".

### 5. Preparar Commits Finales

```bash
# Verificar que todo está commiteado
git status

# Si hay cambios pendientes
git add .
git commit -m "feat([modulo]): complete module implementation"

# Push
git push origin feature/[modulo]
```

### 6. Enviar Propuesta de Release

Al Project Owner:

```
PROPUESTA RELEASE: [modulo]

CUMPLIMIENTO: [X]%

E2E TESTS:
- Total: [N] tests
- Passed: [N]
- Failed: 0

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/

TOCA SHARED: [si/no]
- [lista de archivos si aplica]

CONFLICTOS: [resueltos/ninguno]
- [detalle si hubo]

DEPENDENCIAS RESUELTAS: si

ARCHIVOS PRINCIPALES:
- src/module/[modulo]/core/ (model, repository, mapper)
- src/module/[modulo]/service/
- src/module/[modulo]/components/admin/
- src/module/[modulo]/e2e/
- src/app/admin/[modulo]/ (list, new, edit)
- src/app/api/admin/[modulo]/ (CRUD)

COMMITS:
- feat([modulo]): create [modulo] table
- feat([modulo]): add core, service and API routes
- feat([modulo]): add admin components and pages
- test([modulo]): add e2e tests

BRANCH: feature/[modulo]

RECOMENDACIÓN: Listo para review y merge a main
```

### 7. Actualizar Status Final

Actualizar `.agents/active/[modulo]-status.md`:

```markdown
## Porcentaje
100%

## Estado
ready-for-review

## Historial
- YYYY-MM-DD: Propuesta de release enviada

## Última Actualización
YYYY-MM-DD HH:MM
```

---

## Outputs
- E2E tests ejecutados y pasando
- Screenshots verificados
- Cumplimiento calculado (>= 90%)
- Propuesta enviada a Project Owner
- Status actualizado a "ready-for-review"

## Next
- Esperar revisión del Project Owner
- Si aprobado: esperar merge
- Si rechazado: corregir y reenviar propuesta
