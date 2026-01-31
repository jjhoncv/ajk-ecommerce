# Autonomía de Agentes

## Regla Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   SOLO EL PROJECT OWNER PUEDE PREGUNTAR AL HUMANO                          │
│                                                                             │
│   Propósito: Definir modelo de negocio y criterios de aceptación           │
│                                                                             │
│   TODOS LOS DEMÁS AGENTES SON 100% AUTÓNOMOS                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Interacción Humana

```
HUMANO (Product Owner)
    │
    │ "Quiero crear el módulo X que haga Y"
    │
    ▼
PROJECT OWNER ◄──────────────────────────────────────────────────┐
    │                                                            │
    │ Puede preguntar:                                           │
    │ - ¿Qué campos necesitas?                                   │
    │ - ¿Debe verse en ecommerce?                                │
    │ - ¿Se relaciona con productos?                             │
    │ - ¿A nivel producto o variante?                            │
    │                                                            │
    └──────────► HUMANO responde ────────────────────────────────┘
    │
    │ Con respuestas claras, crea:
    │ - Spec completo
    │ - Criterios de aceptación
    │ - Branch
    │
    ▼
MODULE LEAD ────────────────────────────────────────────────────────┐
    │                                                               │
    │ ⛔ NO PREGUNTA - Toma decisiones basado en spec              │
    │                                                               │
    ▼                                                               │
DBA / BACKEND / FRONTEND / QA ──────────────────────────────────────┤
    │                                                               │
    │ ⛔ NO PREGUNTAN - Ejecutan según spec y skill                │
    │                                                               │
    ▼                                                               │
INTEGRATION LEAD / INTEGRATOR ──────────────────────────────────────┤
    │                                                               │
    │ ⛔ NO PREGUNTAN - Analizan código y deciden                  │
    │                                                               │
    ▼                                                               │
MODULE LEAD ────────────────────────────────────────────────────────┘
    │
    │ Propone release
    │
    ▼
PROJECT OWNER
    │
    │ Revisa y aprueba
    │
    ▼
HUMANO (Product Owner)
    │
    │ Prueba final → MERGE
    │
    ▼
✅ COMPLETADO
```

---

## Reglas por Agente

### Project Owner - PUEDE PREGUNTAR ✅

```
CUÁNDO PREGUNTAR:
- Al inicio, para entender el requerimiento
- Para definir campos del modelo
- Para decidir integraciones
- Para prioridad y urgencia

CUÁNDO NO PREGUNTAR:
- Durante la ejecución
- Sobre detalles técnicos (decidir solo)
- Sobre implementación (el equipo decide)

HERRAMIENTA: AskUserQuestion
```

### Module Lead - NO PREGUNTA ⛔

```
SI HAY DUDA:
- Leer spec más cuidadosamente
- Tomar decisión conservadora
- Documentar decisión en activity.log

EJEMPLO:
  Duda: "¿El campo color es obligatorio?"
  Spec dice: "color VARCHAR(7) DEFAULT '#6B7280'"
  Decisión: Es opcional porque tiene DEFAULT
  Acción: Continuar sin preguntar
```

### DBA / Backend / Frontend / QA - NO PREGUNTAN ⛔

```
SI HAY DUDA:
- Seguir el spec literalmente
- Seguir el skill literalmente
- Si spec no especifica, usar valores por defecto del skill

EJEMPLO:
  Duda: "¿Qué validación usar para el campo name?"
  Spec dice: "name VARCHAR(100) NOT NULL"
  Skill dice: "min:2, max:100"
  Decisión: Usar lo del skill
  Acción: Continuar sin preguntar
```

### Integration Lead - NO PREGUNTA ⛔

```
SI HAY DUDA:
- Analizar código del módulo existente
- Lanzar Module Expert para investigar
- Tomar decisión basada en análisis

EJEMPLO:
  Duda: "¿Dónde poner el selector de tags?"
  Acción: Module Expert analiza /admin/products/[id]/page.tsx
  Descubre: Ya hay selectores de categories y brand
  Decisión: Poner después de brand
  Acción: Continuar sin preguntar
```

---

## Toma de Decisiones Autónoma

### Cuando el Spec no Especifica Algo

| Situación | Decisión Autónoma |
|-----------|-------------------|
| No dice si campo es opcional | Usar DEFAULT del skill |
| No dice orden de campos | Orden alfabético o lógico |
| No dice tamaño de imagen | Usar estándar del proyecto |
| No dice posición de badge | Esquina superior izquierda |
| No dice color por defecto | Usar gris (#6B7280) |
| No dice límite de items | Usar 10 o lo común en el proyecto |

### Documentar Decisiones

Cuando un agente toma una decisión autónoma, documentarla:

```bash
./.agents/scripts/log.sh "BACKEND" "💡 Decisión: Campo color opcional con default #6B7280"
./.agents/scripts/log.sh "FRONTEND" "💡 Decisión: Grid de 4 columnas desktop, 2 mobile"
./.agents/scripts/log.sh "QA" "💡 Decisión: Probar con 3 items de prueba"
```

---

## Excepciones

### Situaciones que SÍ Requieren Detener y Notificar

```
⚠️ DETENER Y NOTIFICAR A MODULE LEAD (no al humano):

- Error de compilación que no se puede resolver
- Dependencia faltante crítica
- Conflicto de merge no resoluble
- Base de datos inaccesible
- Servidor no responde después de reintentos
```

### Situaciones que NUNCA Deben Preguntar

```
⛔ NUNCA PREGUNTAR AL HUMANO:

- "¿Está bien este código?"
- "¿Debo continuar?"
- "¿Este enfoque es correcto?"
- "¿Qué nombre uso para X?"
- "¿Dónde pongo este archivo?"

EN SU LUGAR:
- Seguir el spec
- Seguir el skill
- Tomar decisión y documentar
- Continuar
```

---

## Beneficios

1. **Velocidad**: No hay bloqueos esperando respuestas
2. **Consistencia**: Decisiones basadas en specs y skills, no en opiniones
3. **Escalabilidad**: Múltiples módulos pueden desarrollarse en paralelo
4. **Trazabilidad**: Todas las decisiones quedan en activity.log

---

*El humano solo interviene al inicio (definir) y al final (aprobar)*
