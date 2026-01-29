# Testing Spec: Tags

## Criterios de Aceptación - Cobertura E2E

### Admin CRUD
| Criterio | Test | Estado |
|----------|------|--------|
| Listar tags | Test 1: Navegar a lista | ✅ |
| Formulario nuevo | Test 2: Abrir formulario | ✅ |
| Validaciones | Test 3: Validaciones | ✅ |
| Crear tag | Test 4: Crear | ✅ |
| Ver en lista | Test 5: Verificar | ✅ |
| Editar tag | Test 6: Editar | ✅ |
| Eliminar tag | Test 7: Eliminar | ✅ |

## Cobertura
**Total: 7/7 tests (100%)**

## Screenshots Generados
| # | Archivo | Descripción |
|---|---------|-------------|
| 1 | 01-list.png | Página de lista de tags |
| 2 | 02-new-form.png | Formulario nuevo vacío |
| 3 | 03-validation-errors.png | Errores de validación |
| 4 | 04-form-filled.png | Formulario con datos |
| 5 | 05-created.png | Tag creado en lista |
| 6 | 06-edit-form.png | Formulario de edición |
| 7 | 07-edited.png | Tag editado en lista |
| 8 | 08-deleted.png | Tag eliminado |

## Comando de Ejecución
```bash
npx tsx src/module/tags/e2e/index.ts
```

## Variables de Entorno
```bash
BASE_URL=http://localhost:3000
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123
```

## Fixtures Utilizados
- `valid`: Tag completo para crear
- `invalid`: Datos inválidos para probar validaciones
- `update`: Datos para actualizar
