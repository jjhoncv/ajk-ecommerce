# Sistema Multi-Agente - AJK E-Commerce

## Vision General

Este proyecto utiliza un sistema de desarrollo multi-agente con estructura jerarquica. Cada agente tiene un rol especifico y se comunica siguiendo protocolos definidos.

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

## Documentos

| Documento | Descripcion |
|-----------|-------------|
| `governance.md` | Flujo de trabajo, branches, PRs, releases |
| `communication.md` | Protocolo de comunicacion entre agentes |
| `activity-log-guide.md` | Formato del activity.log (solo tareas, no debug) |
| `project.json` | Estado actual del proyecto y modulos |
| `roles/` | Definicion de cada rol y sus responsabilidades |
| `releases/` | Historial de releases aprobados |
| **`shared-catalog.md`** | **Catálogo de componentes shared (OBLIGATORIO para Frontend)** |

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
- El orden de merge se decide por dependencias

### 4. Releases Controlados
- Solo el Product Owner (humano) aprueba merges a main
- El Project Owner coordina y recomienda orden de releases

---

## Flujo Rapido

```
1. Product Owner: "Quiero funcionalidad X"
          │
          ▼
2. Project Owner: Crea modelo de negocio, asigna Module Lead
          │
          ▼
3. Module Lead: Crea branch feature/X, asigna tareas a su equipo
          │
          ▼
4. Equipo (DBA→Backend→Frontend→QA): Desarrollan, hacen commits
          │
          ▼
5. Module Lead: Valida 90%+, propone release al Project Owner
          │
          ▼
6. Project Owner: Evalua dependencias, notifica a Product Owner
          │
          ▼
7. Product Owner: Prueba, aprueba → MERGE a main
```

---

## Referencias

- `/docs/module-template.md` - Patrones de codigo para crear modulos
- `/CLAUDE.md` - Documentacion general del proyecto
