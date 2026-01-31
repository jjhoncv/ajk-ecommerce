# Skill: Iniciar Trabajo en Módulo

## Rol
Module Lead

## Trigger
Recibe ASIGNACION del Project Owner

## Inputs
- Mensaje de asignación
- `.agents/specs/[modulo]-testing-spec.md`
- Branch asignado

---

## 📚 DOCUMENTACIÓN OBLIGATORIA

**ANTES de empezar, leer:**
- `.agents/autonomy.md` - **CRÍTICO**: Este agente es 100% autónomo, NO pregunta al humano
- `.agents/activity-log-guide.md` - Formato de mensajes para activity.log
- `.agents/governance.md` - Convenciones de commits y branches
- `.agents/communication.md` - Protocolo de coordinación con otros Module Leads

---

## Steps

### 1. Leer Modelo de Negocio

```bash
# Leer el testing spec completo
cat .agents/specs/[modulo]-testing-spec.md
```

Entender:
- Criterios de aceptación
- Campos requeridos
- Dependencias
- Prioridad

### 2. Verificar Conflictos Potenciales

```bash
# Revisar módulos activos
ls .agents/active/

# Si hay otros módulos, revisar cada uno
cat .agents/active/*-status.md
```

Si el módulo toca `shared/`:
- Identificar qué archivos
- Verificar si hay conflicto con otros módulos activos
- Si hay conflicto: ejecutar `check-conflicts.md`

### 3. Crear Status del Módulo

Crear `.agents/active/[modulo]-status.md`:

```markdown
# Estado: [modulo]

## Module Lead
[tu identificador]

## Branch
feature/[modulo]

## Prioridad Asignada
[alta/media/baja]

## Progreso Admin
- [ ] DBA
- [ ] Backend Admin
- [ ] Frontend Admin
- [ ] QA Admin

## Progreso Ecommerce (si ecommerceEnabled: true)
- [ ] Backend Ecommerce
- [ ] Frontend Ecommerce
- [ ] QA Ecommerce

## Porcentaje
0%

## Toca Shared
| Archivo | Acción | Estado |
|---------|--------|--------|
| [archivo o "ninguno"] | [crear/modificar] | pendiente |

## Complejidad del Cambio en Shared
[baja/media/alta]

## Dependencias
- Depende de: [lista o "ninguna"]
- Bloquea a: [lista o "ninguna"]

## Conflictos Activos
| Con Módulo | Archivos en Común | Estado | Acuerdo |
|------------|-------------------|--------|---------|
| - | - | - | - |

## Historial
- YYYY-MM-DD: Inicio de desarrollo

## Última Actualización
YYYY-MM-DD HH:MM
```

### 4. Cambiar a Branch

```bash
git checkout feature/[modulo]
git pull origin feature/[modulo]
```

### 5. Planificar Tareas

Basado en el testing-spec, dividir en tareas:

**⚠️ IMPORTANTE: Verificar `ecommerceEnabled` en el spec**

```
TAREAS IDENTIFICADAS:

== ADMIN (siempre) ==

1. DBA:
   - Crear tabla [modulo] con campos: [lista]
   - Ejecutar pnpm generate

2. Backend Admin:
   - Crear core/: model, repository, mapper
   - Crear service/: [modulo].service
   - Crear API: routes CRUD

3. Frontend Admin:
   - Crear components/admin/: Fields, ListView
   - Crear pages: list, new, edit

4. QA Admin:
   - Crear e2e/admin/: tests CRUD
   - Crear fixtures
   - Generar screenshots admin

== ECOMMERCE (si ecommerceEnabled: true) ==

5. Backend Ecommerce:
   - Crear services/: types, hydrators, service
   - NO crear APIs REST (usar SSR)

6. Frontend Ecommerce:
   - Crear components/ecommerce/: Grid, Featured, Detail
   - Crear pages públicas: list, detail, 404
   - Integrar en homepage (si spec lo indica)

7. QA Ecommerce:
   - Crear e2e/ecommerce/: tests públicos
   - Generar screenshots ecommerce
```

### 6. Continuar con Asignación

Ejecutar `assign-tasks.md` para asignar al equipo

---

## Outputs
- Testing spec leído y entendido
- `.agents/active/[modulo]-status.md` creado
- Conflictos identificados (si hay)
- Tareas planificadas

## Next
- Ejecutar `assign-tasks.md`
- Si hay conflictos: ejecutar `check-conflicts.md`
