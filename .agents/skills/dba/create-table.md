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

**IMPORTANTE**: El proyecto usa `INT AUTO_INCREMENT` para IDs, no UUID.

```bash
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
CREATE TABLE [modulo] (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Campos del modelo de negocio
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,

    -- Campos de imagen (si aplica)
    image_url VARCHAR(500),

    -- Campos de auditoría (SIEMPRE incluir)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,

    -- Constraints
    UNIQUE INDEX idx_[modulo]_slug (slug),
    INDEX idx_[modulo]_display_order (display_order),

    -- Foreign keys para auditoría
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
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
# Verificar que el type existe en database types
grep -A 20 "export interface [Entidad]" src/types/database/database.d.ts

# Verificar que el type existe en domain types
grep -A 20 "export interface [Entidad]" src/types/domain/domain.d.ts
```

Verificar que ambos archivos tienen el tipo:
- `src/types/database/database.d.ts` - con campos en snake_case
- `src/types/domain/domain.d.ts` - con campos en camelCase

### 8. Agregar Módulo al Sidebar (OBLIGATORIO)

**CRÍTICO**: Sin este paso, el módulo NO aparecerá en el menú del admin.

```bash
# 1. Insertar en tabla sections
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
INSERT INTO sections (name, url, image, display_order, section_group)
VALUES ('[Entidad]s', '/[modulo]', '[icono]', [orden], '[grupo]');
"

# 2. Obtener el ID de la sección recién creada
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
SELECT id FROM sections WHERE url='/[modulo]';
"

# 3. Asignar al rol superadmin (role_id = 1)
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
INSERT INTO roles_sections (id_rol, id_section) VALUES (1, [ID_SECCION]);
"
```

**Grupos válidos para section_group:**
- `catalog` - Catálogo (Productos, Categorías, Atributos, Marcas)
- `marketing` - Marketing (Banners, Cupones, Promociones, Ofertas)
- `sales` - Ventas (Órdenes, Clientes, Valoraciones)
- `config` - Configuración (Pagos, Envíos, Configuración)
- `admin` - Administración (Usuarios, Roles, Perfil)

**Iconos comunes (Lucide):**
- `tag` - Etiquetas
- `package` - Productos
- `folder-tree` - Categorías
- `badge` - Marcas
- `image` - Banners/Imágenes
- `shopping-cart` - Órdenes
- `user` - Clientes/Usuarios
- `settings` - Configuración

### 9. Ejecutar Lint

```bash
pnpm lint
```

Si hay errores, corregirlos antes de continuar.

### 10. Commit

```bash
git add .
git commit -m "feat([modulo]): create [modulo] table and add to sidebar"
git push origin feature/[modulo]
```

### 11. Notificar al Module Lead

```
COMPLETADO: Tabla [modulo] creada + sidebar configurado
COMMIT: feat([modulo]): create [modulo] table and add to sidebar

ARCHIVOS/BD MODIFICADOS:
  - MySQL: tabla [modulo] creada
  - MySQL: INSERT en sections (id=[X], group=[grupo])
  - MySQL: INSERT en roles_sections (superadmin)
  - src/types/database/database.d.ts (regenerado)
  - src/types/domain/domain.d.ts (regenerado)

ESTRUCTURA DE TABLA:
  - id: INT AUTO_INCREMENT PRIMARY KEY
  - name: VARCHAR(255) NOT NULL
  - slug: VARCHAR(255) NOT NULL UNIQUE
  - description: TEXT
  - display_order: INT DEFAULT 0
  - image_url: VARCHAR(500)
  - created_at: TIMESTAMP
  - updated_at: TIMESTAMP
  - created_by: INT (FK -> users.id)
  - updated_by: INT (FK -> users.id)

SIDEBAR CONFIGURADO:
  - Sección: [Entidad]s
  - URL: /[modulo]
  - Icono: [icono]
  - Grupo: [grupo]
  - Visible para: superadmin

TYPES GENERADOS:
  - [Entidad] en @/types/database (snake_case)
  - [Entidad] en @/types/domain (camelCase)

NOTAS: [observaciones si las hay]
```

---

## Template SQL Extendido

Para tablas con más campos:

```sql
CREATE TABLE [modulo] (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    -- Campos básicos
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,

    -- Campos de imagen (si aplica)
    image_url VARCHAR(500),

    -- Campos de relación (si aplica)
    parent_id INT,

    -- Campos de estado (si aplica)
    is_active BOOLEAN DEFAULT TRUE,
    show_nav BOOLEAN DEFAULT FALSE,

    -- Campos SEO (si aplica)
    meta_title VARCHAR(255),
    meta_description TEXT,

    -- Campos de auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    updated_by INT,

    -- Foreign keys
    FOREIGN KEY (parent_id) REFERENCES [modulo](id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,

    -- Índices
    UNIQUE INDEX idx_[modulo]_slug (slug),
    INDEX idx_[modulo]_display_order (display_order),
    INDEX idx_[modulo]_parent (parent_id)
);
```

---

## Campos de Auditoría (Obligatorios)

SIEMPRE incluir:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT AUTO_INCREMENT | Primary key numérico |
| `created_at` | TIMESTAMP | Fecha de creación (auto) |
| `updated_at` | TIMESTAMP | Fecha de actualización (auto) |
| `created_by` | INT | FK a users.id - quién creó |
| `updated_by` | INT | FK a users.id - quién modificó |

---

## Outputs
- Tabla creada en MySQL
- Types regenerados en `src/types/database/` y `src/types/domain/`
- Lint verificado
- Commit realizado
- Module Lead notificado

## Next
- Backend y Frontend pueden empezar (ya tienen types)

## NO Hacer
- NO usar UUID/CHAR(36) para IDs - usar INT AUTO_INCREMENT
- NO modificar código en core/, service/, components/
- NO crear archivos TypeScript manualmente
- NO modificar archivos de otros módulos
- NO hacer commit sin pasar lint
- NO olvidar agregar el módulo a `sections` y `roles_sections` (sidebar)
