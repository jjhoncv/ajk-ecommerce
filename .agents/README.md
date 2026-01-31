# Sistema Multi-Agente - AJK E-Commerce

## Vision General

Este proyecto utiliza un sistema de desarrollo multi-agente con estructura jerarquica. Cada agente tiene un rol especifico y se comunica siguiendo protocolos definidos.

---

## LECTURA OBLIGATORIA POR ROL

### Project Owner
```
DEBE LEER:
1. .agents/skills/project-owner/assign-module.md (crear módulos)
2. .agents/governance.md (flujo de trabajo, branches)
3. .agents/activity-log-guide.md (cómo registrar progreso)
```

### Module Lead
```
DEBE LEER:
1. .agents/skills/module-lead/start-module.md (iniciar)
2. .agents/skills/module-lead/assign-tasks.md (asignar equipo)
3. .agents/communication.md (coordinación con otros Module Leads)
4. .agents/governance.md (convenciones de commits/PRs)
5. .agents/activity-log-guide.md (cómo registrar progreso)
```

### DBA / Backend / Frontend / QA
```
DEBE LEER:
1. Su skill específico en .agents/skills/[rol]/
2. .agents/activity-log-guide.md (cómo registrar progreso)
3. .agents/governance.md (convenciones de commits)
```

### Frontend (adicional)
```
DEBE LEER:
- .agents/shared-catalog.md (componentes shared disponibles)
```

---

## Jerarquia

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT OWNER (Humano)                    │
│         Define requerimientos, aprueba releases              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 PROJECT OWNER (Agente Jefe)                  │
│    Recibe requerimientos, crea modelos de negocio,          │
│    asigna a Module Leads, coordina releases                 │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  MODULE LEAD  │◄───►│  MODULE LEAD  │◄───►│  MODULE LEAD  │
│   Modulo A    │     │   Modulo B    │     │   Modulo C    │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ ├── DBA       │     │ ├── DBA       │     │ ├── DBA       │
│ ├── Backend   │     │ ├── Backend   │     │ ├── Backend   │
│ ├── Frontend  │     │ ├── Frontend  │     │ ├── Frontend  │
│ └── QA        │     │ └── QA        │     │ └── QA        │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                    COMUNICACION HORIZONTAL
              (coordinan dependencias y shared)
```

---

## Documentos de Referencia

| Documento | Propósito | Quién lo usa |
|-----------|-----------|--------------|
| `autonomy.md` | Reglas de autonomía (quién pregunta al humano) | TODOS |
| `governance.md` | Flujo de trabajo, branches, commits, PRs | TODOS |
| `communication.md` | Protocolo entre Module Leads | Module Leads |
| `activity-log-guide.md` | Formato del activity.log | TODOS |
| `shared-catalog.md` | Componentes shared disponibles | Frontend |
| `team-evolution.md` | Factor de imaginación y métricas | TODOS |
| `architecture-diagram.md` | Diagrama de arquitectura y flujos | Documentación |

## Roles vs Skills

| Carpeta | Propósito | Contenido |
|---------|-----------|-----------|
| `roles/` | Definiciones generales | QUÉ hace cada agente, límites, referencias a skills |
| `skills/` | Instrucciones operativas | CÓMO hacer cada tarea, templates, aprendizajes |

**Regla**: Los roles son estáticos (definiciones). Los skills se actualizan con aprendizajes del equipo.

## Carpetas Operativas

| Carpeta | Propósito | Quién escribe |
|---------|-----------|---------------|
| `specs/` | Testing specs de módulos | Project Owner |
| `active/` | Status de módulos en desarrollo | Module Lead |
| `releases/` | Historial de módulos completados | Project Owner |

## Scripts

| Script | Propósito | Cómo usar |
|--------|-----------|-----------|
| `scripts/log.sh` | Registrar progreso | `./.agents/scripts/log.sh "ROL" "mensaje"` |
| `scripts/cleanup-module.sh` | Limpiar módulo fallido | `./.agents/scripts/cleanup-module.sh [modulo]` |

---

## Reglas Fundamentales

### 1. Separacion de Responsabilidades
- Cada agente SOLO modifica archivos de su area
- DBA: Base de datos, types generados
- Backend: core/, service/, app/api/
- Frontend: components/, app/admin/, app/[rutas]/
- QA: e2e/

### 2. Branches por Modulo
- Cada modulo activo tiene su branch: `feature/[modulo]`
- Los agentes del modulo trabajan SOLO en ese branch
- NUNCA commits directos a main

### 3. Comunicacion Obligatoria
- Module Leads DEBEN comunicarse si tocan `shared/` o dependencias comunes
- Ver `communication.md` para protocolo detallado

### 4. Activity Log
- TODOS los agentes registran su progreso con `log.sh`
- Ver `activity-log-guide.md` para formato correcto

### 5. Releases Controlados
- Solo el Product Owner (humano) aprueba merges a main
- El Project Owner coordina y recomienda orden de releases

---

## Flujo Rapido

```
1. Product Owner: "Quiero funcionalidad X"
          │
          ▼
2. Project Owner: Crea spec en .agents/specs/, asigna Module Lead
          │
          ▼
3. Module Lead: Crea status en .agents/active/, asigna equipo
          │
          ▼
4. Equipo (DBA→Backend→Frontend→QA): Desarrollan, registran en activity.log
          │
          ▼
5. Module Lead: Valida 90%+, propone release
          │
          ▼
6. Project Owner: Evalua dependencias, crea release en .agents/releases/
          │
          ▼
7. Product Owner: Prueba, aprueba → MERGE a main
```

---

## Referencias

- `/docs/module-template.md` - Patrones de codigo para crear modulos
- `/CLAUDE.md` - Documentacion general del proyecto
