# Skills del Sistema Multi-Agente

Los skills son comandos ejecutables que cada agente usa para realizar sus tareas.

## Estructura

```
skills/
├── project-owner/
│   ├── assign-module.md      # Asignar módulo a Module Lead
│   ├── review-release.md     # Revisar propuesta de release
│   └── approve-release.md    # Aprobar y documentar release
│
├── module-lead/
│   ├── start-module.md       # Iniciar trabajo en módulo
│   ├── assign-tasks.md       # Asignar tareas al equipo
│   ├── check-conflicts.md    # Analizar conflictos con otros módulos
│   └── propose-release.md    # Proponer release al Project Owner
│
├── dba/
│   └── create-table.md       # Crear tabla en MySQL
│
├── backend/
│   └── create-module.md      # Crear core/, service/, API
│
├── frontend/
│   └── create-admin.md       # Crear components/, pages admin
│
└── qa/
    └── create-e2e.md         # Crear y ejecutar tests E2E
```

## Cómo usar un Skill

1. Leer el archivo del skill correspondiente a tu rol
2. Seguir los pasos en orden
3. Usar los templates proporcionados
4. Enviar mensaje de completado al superior

## Convención

Cada skill tiene:
- **Rol**: Quién ejecuta este skill
- **Trigger**: Cuándo se activa
- **Inputs**: Qué información necesita
- **Steps**: Pasos a ejecutar
- **Outputs**: Qué produce
- **Next**: Qué sigue después
