# QA E2E Templates

Templates para crear tests E2E exploratorios de cualquier módulo.

## Uso

1. Copiar template al destino
2. Reemplazar placeholders
3. Ajustar campos según spec del módulo

## Placeholders

| Placeholder | Descripción | Ejemplo |
|-------------|-------------|---------|
| `__MODULE__` | Nombre en MAYÚSCULAS | `TESTIMONIALS` |
| `__module__` | Nombre en minúsculas | `testimonials` |
| `__Modulo__` | Nombre en PascalCase | `Testimonials` |
| `__Entidad__` | Entidad singular PascalCase | `Testimonial` |

## Templates

### data.template.ts
Datos de prueba con timestamp único (TEST_SUFFIX).

```bash
cp data.template.ts src/module/[modulo]/e2e/data.ts
# Reemplazar: __MODULE__, __module__, __Entidad__
# Ajustar: campos adicionales según spec
```

### utils.template.ts
Utilidades del módulo y re-exports de utils compartidos.

```bash
cp utils.template.ts src/module/[modulo]/e2e/utils.ts
# Reemplazar: __module__
```

### index.template.ts
Runner principal que ejecuta los tests.

```bash
cp index.template.ts src/module/[modulo]/e2e/index.ts
# Reemplazar: __MODULE__, __module__, __Modulo__
```

### crud.template.ts
8 test cases para CRUD completo:
- TC-001: Verificar Sidebar
- TC-002: Navegar a Lista
- TC-003: Formulario de Creación
- TC-004: Crear Item
- TC-005: Editar Item
- TC-006: Modal de Eliminación (Cancelar)
- TC-007: Eliminar Item
- TC-008: Validación de Formulario

```bash
cp crud.template.ts src/module/[modulo]/e2e/admin/01-crud.ts
# Reemplazar: __MODULE__, __module__, __Modulo__
```

### cleanup.template.ts
Script para limpiar datos de prueba de la BD.

```bash
cp cleanup.template.ts src/module/[modulo]/e2e/cleanup.ts
# Reemplazar: __module__
```

## Ejemplo Completo

Para crear tests del módulo `faqs`:

```bash
# Crear estructura
mkdir -p src/module/faqs/e2e/{fixtures,admin,screenshots}

# Copiar templates
cp .agents/skills/qa/templates/data.template.ts src/module/faqs/e2e/data.ts
cp .agents/skills/qa/templates/utils.template.ts src/module/faqs/e2e/utils.ts
cp .agents/skills/qa/templates/index.template.ts src/module/faqs/e2e/index.ts
cp .agents/skills/qa/templates/crud.template.ts src/module/faqs/e2e/admin/01-crud.ts
cp .agents/skills/qa/templates/cleanup.template.ts src/module/faqs/e2e/cleanup.ts

# Reemplazar placeholders (usando sed o manualmente)
# __MODULE__ → FAQS
# __module__ → faqs
# __Modulo__ → Faqs
# __Entidad__ → Faq
```

## Ejecución

```bash
# Ejecutar tests
npx tsx src/module/[modulo]/e2e/index.ts

# Limpiar datos de prueba
npx tsx src/module/[modulo]/e2e/cleanup.ts 2026-01-29
npx tsx src/module/[modulo]/e2e/cleanup.ts all
```
