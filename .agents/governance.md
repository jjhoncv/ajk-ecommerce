# Governance - Flujo de Trabajo

## 1. Ciclo de Vida de un Modulo Nuevo

### Fase 1: Inicio

```
Product Owner (humano)
    │
    │ "Quiero crear el modulo Tags para etiquetar productos"
    │
    ▼
Project Owner (agente)
    │
    ├── 1. Crea modelo de negocio (testing-spec.md)
    ├── 2. Actualiza project.json: tags → "in-progress"
    ├── 3. Asigna Module Lead
    └── 4. Crea branch: feature/tags
```

### Fase 2: Desarrollo

```
Module Lead (agente)
    │
    ├── 1. Lee modelo de negocio
    ├── 2. Divide en tareas para su equipo
    ├── 3. Coordina con otros Module Leads (si toca shared/)
    │
    └── Asigna tareas (en orden):
        │
        ├── DBA ──────────────────────────────────────────┐
        │   - Crea tabla en BD (Docker)                   │
        │   - Ejecuta pnpm generate                       │
        │   - Commit: "feat(tags): create database table" │
        │                                                  │
        ▼ (espera a que DBA termine)                      │
        │                                                  │
        ├── Backend ─────────────────────────┐            │
        │   - Crea core/ (model, repo, mapper)│           │
        │   - Crea service/                   │           │
        │   - Crea app/api/admin/tags/        │  PARALELO │
        │   - Commit: "feat(tags): add core"  │           │
        │                                     │           │
        ├── Frontend ────────────────────────┤           │
        │   - Crea components/admin/          │           │
        │   - Crea app/admin/tags/            │           │
        │   - Commit: "feat(tags): add admin" │           │
        │                                     │           │
        ▼ (espera a Backend + Frontend)       │           │
        │                                     │           │
        └── QA ──────────────────────────────┘           │
            - Crea e2e/ tests                             │
            - Ejecuta tests, genera screenshots           │
            - Commit: "test(tags): add e2e tests"         │
```

### Fase 3: Validacion

```
Module Lead
    │
    ├── 1. Revisa que todos los agentes completaron
    ├── 2. Ejecuta E2E tests completos
    ├── 3. Revisa screenshots
    ├── 4. Calcula % de cumplimiento vs modelo de negocio
    │
    │   ┌─────────────────────────────────────────┐
    │   │ CHECKLIST DE VALIDACION                  │
    │   │                                          │
    │   │ [ ] CRUD admin funcionando               │
    │   │ [ ] Validaciones de formulario           │
    │   │ [ ] Pagina ecommerce (si aplica)         │
    │   │ [ ] SEO dinamico                         │
    │   │ [ ] Pagina 404                           │
    │   │ [ ] E2E tests pasando                    │
    │   │ [ ] Screenshots verificados              │
    │   │                                          │
    │   │ Cumplimiento: X/Y = Z%                   │
    │   └─────────────────────────────────────────┘
    │
    ├── Si < 90%: Devuelve tareas a los agentes
    │
    └── Si >= 90%: Propone release al Project Owner
```

### Fase 4: Release

```
Module Lead
    │
    │ "Propongo release de Tags. 95% cumplimiento."
    │
    ▼
Project Owner
    │
    ├── 1. Revisa propuesta
    ├── 2. Consulta con otros Module Leads:
    │      - ¿Tags toca shared/?
    │      - ¿Hay otros modulos que dependan de Tags?
    │      - ¿Hay otros modulos esperando release?
    │
    ├── 3. Determina orden de merge
    │
    └── 4. Notifica a Product Owner:
           │
           │ "Module Lead de Tags propone release.
           │  - Cumplimiento: 95%
           │  - E2E: 12 passed, 0 failed
           │  - No tiene dependencias bloqueantes
           │  - Screenshots en: feature/tags/e2e/screenshots/
           │  - Recomiendo: aprobar merge"
           │
           ▼
        Product Owner (humano)
           │
           ├── Revisa PR en GitHub
           ├── Prueba funcionalidad
           │
           ├── Si rechaza: Comenta cambios → vuelve a Fase 2
           │
           └── Si aprueba:
                   │
                   ├── Merge: feature/tags → main
                   ├── Project Owner actualiza project.json
                   └── Project Owner crea .agents/releases/tags-v1.0.0.md
```

---

## 2. Branches

### Convencion de Nombres

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Feature nueva | `feature/[modulo]` | `feature/tags` |
| Mejora a existente | `feature/[modulo]-[descripcion]` | `feature/categories-breadcrumb` |
| Bugfix | `fix/[modulo]-[descripcion]` | `fix/cart-quantity-validation` |

### Reglas

1. **NUNCA** commits directos a `main`
2. Cada modulo activo tiene UN branch
3. Todos los agentes del modulo trabajan en ESE branch
4. Solo el Product Owner hace merge a main

### Flujo de Branch

```
main
│
├── feature/tags          ← Module Lead crea
│   │
│   ├── commit (DBA)      ← "feat(tags): create table"
│   ├── commit (Backend)  ← "feat(tags): add core"
│   ├── commit (Frontend) ← "feat(tags): add admin"
│   ├── commit (QA)       ← "test(tags): add e2e"
│   │
│   └── PR → main         ← Module Lead crea cuando >= 90%
│
└── merge                 ← Product Owner aprueba
```

---

## 3. Commits

### Formato

```
<tipo>(<modulo>): <descripcion corta>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo | Uso |
|------|-----|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `test` | Tests |
| `refactor` | Refactorizacion sin cambio de funcionalidad |
| `docs` | Documentacion |
| `style` | Formato, espacios, etc. |

### Ejemplos por Rol

```bash
# DBA
feat(tags): create tags table with audit fields

# Backend
feat(tags): add Tag model, repository and mapper
feat(tags): add tag service with CRUD operations
feat(tags): add admin API routes

# Frontend
feat(tags): add TagFields form configuration
feat(tags): add TagListView component
feat(tags): add admin pages (list, new, edit)

# QA
test(tags): add e2e tests for admin CRUD
test(tags): add validation tests
```

---

## 4. Pull Requests

### Cuando Crear PR

- Module Lead crea PR cuando el modulo alcanza >= 90% de cumplimiento
- El PR va de `feature/[modulo]` → `main`

### Template de PR

```markdown
## Summary
- [Descripcion breve del modulo/feature]

## Modelo de Negocio
- [Link o resumen del testing-spec.md]

## Cumplimiento
- Checklist: X/Y items (Z%)
- E2E Tests: N passed, M failed

## Screenshots
- [Links a screenshots de E2E]

## Dependencias
- [ ] No toca shared/
- [ ] No depende de otros modulos pendientes
- O: Depende de [modulo] que ya esta en main

## Checklist
- [ ] DBA completado
- [ ] Backend completado
- [ ] Frontend completado
- [ ] QA completado
- [ ] Module Lead valido >= 90%
```

---

## 5. Releases

### Archivo de Release

Cuando un modulo se aprueba, el Project Owner crea:

```
.agents/releases/[modulo]-v[version].md
```

### Contenido

```markdown
# Release: [Modulo] v1.0.0

## Fecha
YYYY-MM-DD

## Module Lead
[identificador]

## Modelo de Negocio
[Resumen de lo que se implemento]

## Componentes
- core/: Model, Repository, Mapper
- service/: [servicios creados]
- components/admin/: [componentes]
- components/ecommerce/: [si aplica]
- e2e/: [cantidad de tests]

## Cumplimiento Final
X/Y items (Z%)

## PR
#[numero]

## Aprobado por
Product Owner
```

### Actualizacion de project.json

```json
{
  "modules": {
    "tags": {
      "status": "released",
      "version": "1.0.0",
      "releaseDate": "2026-01-29"
    }
  }
}
```

---

## 6. Manejo de Dependencias entre Modulos

### Escenario: Dos modulos tocan shared/

```
Module Lead A (tags)     Module Lead B (reviews)
       │                        │
       │ Detecta que va a       │
       │ tocar shared/          │
       │                        │
       ▼                        │
Revisa .agents/active/          │
       │                        │
       │ Encuentra que B        │
       │ tambien esta activo    │
       │                        │
       └────────────┬───────────┘
                    │
                    ▼
         ANALISIS CONJUNTO
                    │
    ┌───────────────┴───────────────┐
    │                               │
    ▼                               ▼
  A analiza:                    B analiza:
  - Mi progreso: 30%            - Mi progreso: 60%
  - Mi prioridad: media         - Mi prioridad: alta
  - Mis archivos: TagBadge      - Mis archivos: StarRating
  - Conflicto: index.ts         - Conflicto: index.ts
    │                               │
    └───────────────┬───────────────┘
                    │
                    ▼
         EVALUACION DE OPCIONES
                    │
    ┌───────────────┴───────────────┐
    │                               │
    │  Opcion 1: B primero          │
    │  - Mayor progreso (60%)       │
    │  - Prioridad alta             │
    │  - A hace rebase despues      │
    │                               │
    │  Opcion 2: A primero          │
    │  - Cambio mas simple          │
    │  - Pero menor prioridad       │
    │                               │
    │  Opcion 3: Paralelo           │
    │  - Segundo resuelve conflicto │
    │  - Viable si conflicto menor  │
    │                               │
    └───────────────┬───────────────┘
                    │
                    ▼
              ACUERDO
                    │
    "B va primero (prioridad alta, mayor progreso)"
    "A continua, espera merge de B, hace rebase"
                    │
                    ▼
 B completa → PR → MERGE
                    │
                    ▼
 A hace rebase → continua → PR → MERGE
```

### Protocolo de Analisis Obligatorio

Cuando dos Module Leads detectan conflicto:

1. **PRIMERO analizar**, no decidir de inmediato
2. **Comparar** progreso, prioridad, complejidad
3. **Evaluar** todas las opciones
4. **Acordar** basado en criterios objetivos
5. **Documentar** el acuerdo en .agents/active/
6. **Escalar** a Project Owner solo si no hay acuerdo

### Criterios de Decision (en orden de peso)

| Criterio | Peso | Descripcion |
|----------|------|-------------|
| Prioridad asignada | 30% | Definida por Project Owner al asignar |
| Progreso actual | 20% | Mayor progreso = mas cerca de terminar |
| Archivos en conflicto | 20% | Menos conflictos = menos riesgo |
| Complejidad | 15% | Cambio simple va primero |
| Dependencias | 15% | Si otro depende de ti, tu primero |

### Reglas

1. Module Leads DEBEN revisar `.agents/active/` ANTES de tocar shared/
2. Module Leads DEBEN analizar la situacion del otro antes de decidir
3. Module Leads DEBEN documentar acuerdos
4. Project Owner es arbitro SOLO si no hay acuerdo
5. El segundo modulo debe hacer rebase despues del primer merge

---

## 7. Actualizacion de Modulo Existente

Cuando se quiere modificar un modulo ya released:

```
Product Owner: "Quiero agregar subcategorias a categories"
       │
       ▼
Project Owner:
       │
       ├── 1. Crea modelo de negocio (solo para la mejora)
       ├── 2. Actualiza project.json: categories → "in-progress"
       ├── 3. Asigna Module Lead
       └── 4. Crea branch: feature/categories-subcategories
       │
       ▼
[Mismo flujo de desarrollo]
       │
       ▼
Cuando se aprueba:
       │
       ├── Merge a main
       └── Actualiza project.json: categories → version "1.1.0"
```
