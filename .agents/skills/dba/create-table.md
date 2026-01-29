# Skill: Crear Tabla en MySQL

## Rol
DBA

## Trigger
Module Lead asigna tarea de crear tabla

## Inputs
- Nombre del módulo
- `.agents/specs/[modulo]-testing-spec.md`
- Branch de trabajo

---

## Steps

### 1. Leer Especificación

```bash
cat .agents/specs/[modulo]-testing-spec.md
```

Identificar:
- Nombre de la tabla
- Campos requeridos
- Tipos de datos
- Validaciones

### 2. Cambiar a Branch

```bash
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 3. Verificar si Tabla Existe

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "SHOW TABLES LIKE '[modulo]'"
```

Si existe, verificar estructura antes de modificar.

### 4. Crear Tabla

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
CREATE TABLE [modulo] (
    id CHAR(36) NOT NULL PRIMARY KEY,

    -- Campos del modelo de negocio
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    position INT DEFAULT 0,

    -- Campos de auditoría (SIEMPRE incluir)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE INDEX idx_[modulo]_slug (slug),
    INDEX idx_[modulo]_active (is_active),
    INDEX idx_[modulo]_position (position)
);
"
```

### 5. Verificar Creación

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DESCRIBE [modulo]"
```

### 6. Regenerar Types

```bash
pnpm generate
```

### 7. Verificar Types Generados

```bash
# Verificar que el type existe
grep -r "[Modulo]" src/types/

# O buscar el archivo
ls -la src/types/
```

### 8. Commit

```bash
git add .
git commit -m "feat([modulo]): create [modulo] table with audit fields"
git push origin feature/[modulo]
```

### 9. Notificar al Module Lead

```
COMPLETADO: Tabla [modulo] creada
COMMIT: feat([modulo]): create [modulo] table with audit fields

ARCHIVOS MODIFICADOS:
  - MySQL: tabla [modulo] creada
  - src/types/ (regenerados con pnpm generate)

ESTRUCTURA DE TABLA:
  - id: CHAR(36) PRIMARY KEY
  - name: VARCHAR(255) NOT NULL
  - slug: VARCHAR(255) NOT NULL UNIQUE
  - description: TEXT
  - is_active: BOOLEAN DEFAULT TRUE
  - position: INT DEFAULT 0
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP

NOTAS: [observaciones si las hay]
```

---

## Template SQL Extendido

Para tablas con más campos:

```sql
CREATE TABLE [modulo] (
    id CHAR(36) NOT NULL PRIMARY KEY,

    -- Campos básicos
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,

    -- Campos de estado
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    position INT DEFAULT 0,

    -- Campos de imagen (si aplica)
    image_url VARCHAR(500),
    thumbnail_url VARCHAR(500),

    -- Campos de relación (si aplica)
    parent_id CHAR(36),
    category_id CHAR(36),

    -- Campos de auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys (si aplica)
    FOREIGN KEY (parent_id) REFERENCES [modulo](id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

    -- Índices
    UNIQUE INDEX idx_[modulo]_slug (slug),
    INDEX idx_[modulo]_active (is_active),
    INDEX idx_[modulo]_featured (is_featured),
    INDEX idx_[modulo]_position (position),
    INDEX idx_[modulo]_parent (parent_id)
);
```

---

## Campos de Auditoría (Obligatorios)

SIEMPRE incluir:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | CHAR(36) | UUID como primary key |
| `created_at` | TIMESTAMP | Fecha de creación (auto) |
| `updated_at` | TIMESTAMP | Fecha de actualización (auto) |

---

## Outputs
- Tabla creada en MySQL
- Types regenerados en `src/types/`
- Commit realizado
- Module Lead notificado

## Next
- Backend y Frontend pueden empezar (ya tienen types)

## NO Hacer
- NO modificar código en core/, service/, components/
- NO crear archivos TypeScript manualmente
- NO modificar archivos de otros módulos
