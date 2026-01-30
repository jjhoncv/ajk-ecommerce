# Skill: Capturar Aprendizaje del Equipo

## Rol
Module Lead

## Trigger
El humano indica que una mejora del equipo SUPERÓ sus expectativas

## Inputs
- Módulo donde ocurrió la mejora
- Agente responsable de la mejora
- Descripción de la mejora
- Feedback del humano

---

## Steps

### 1. Documentar el Aprendizaje

```
APRENDIZAJE CAPTURADO
=====================

FECHA: [YYYY-MM-DD]
MÓDULO: [modulo]
AGENTE: [Backend/Frontend/QA/DBA]

CONTEXTO:
[Qué se pidió originalmente]

MEJORA REALIZADA:
[Qué hizo el agente que no estaba en el spec]

FEEDBACK DEL HUMANO:
[Por qué superó expectativas]

PATRÓN IDENTIFICADO:
[Regla general que se puede aplicar en futuros módulos]
```

### 2. Actualizar team-evolution.md

Agregar al historial en `.agents/team-evolution.md`:

```markdown
| [fecha] | [modulo] | [agente] | [mejora resumida] | Superó expectativas | [skill a actualizar] |
```

Incrementar métricas:
```markdown
| Módulos completados | +1 |
| Mejoras que superaron expectativas | +1 |
| Skills actualizados por feedback | +1 |
```

### 3. Actualizar Skill del Agente

Abrir el skill correspondiente y agregar sección de aprendizajes:

**Para Backend** (`.agents/skills/backend/create-module.md` o `create-ecommerce.md`):
```markdown
## Aprendizajes del Equipo

### [Fecha] - Módulo [modulo]
**Mejora**: [descripción]
**Por qué funcionó**: [feedback del humano]
**Aplicar cuando**: [contexto donde aplicar este patrón]
```

**Para Frontend** (`.agents/skills/frontend/create-admin.md` o `create-ecommerce.md`):
```markdown
## Aprendizajes del Equipo

### [Fecha] - Módulo [modulo]
**Mejora**: [descripción]
**Por qué funcionó**: [feedback del humano]
**Aplicar cuando**: [contexto donde aplicar este patrón]
```

**Para QA** (`.agents/skills/qa/create-e2e.md` o `create-ecommerce-e2e.md`):
```markdown
## Aprendizajes del Equipo

### [Fecha] - Módulo [modulo]
**Mejora**: [descripción]
**Por qué funcionó**: [feedback del humano]
**Aplicar cuando**: [contexto donde aplicar este patrón]
```

### 4. Notificar al Equipo

```
APRENDIZAJE INCORPORADO
=======================

AGENTE: [rol]
SKILL ACTUALIZADO: [path al skill]

NUEVO PATRÓN:
[descripción del patrón]

APLICAR EN:
[contextos futuros donde usar este patrón]

El equipo ahora es más capaz gracias a este feedback.
```

### 5. Commit del Aprendizaje

```bash
git add .agents/team-evolution.md
git add .agents/skills/[rol]/[skill].md

git commit -m "learn([modulo]): capture team improvement from feedback

- [descripción corta de la mejora]
- Updated [agente] skill with new pattern
- Factor de imaginación funcionando

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Outputs

- `.agents/team-evolution.md` actualizado con historial
- Skill del agente actualizado con nuevo patrón
- Métricas de evolución incrementadas
- Commit con el aprendizaje

---

## Ejemplo

```
APRENDIZAJE CAPTURADO
=====================

FECHA: 2025-01-30
MÓDULO: tags
AGENTE: Frontend

CONTEXTO:
Se pidió un formulario CRUD básico para tags

MEJORA REALIZADA:
Frontend agregó un preview del color como badge junto al color picker,
mostrando cómo se vería el tag en la tienda

FEEDBACK DEL HUMANO:
"Esto es genial, me ayuda a visualizar cómo quedará el tag
antes de guardarlo. No lo pedí pero es exactamente lo que necesitaba."

PATRÓN IDENTIFICADO:
Cuando hay campos visuales (color, imagen), agregar preview
de cómo se verá en el contexto real de uso.
```

Actualización al skill de Frontend:
```markdown
## Aprendizajes del Equipo

### 2025-01-30 - Módulo tags
**Mejora**: Preview de badge junto a color picker
**Por qué funcionó**: Ayuda a visualizar el resultado final antes de guardar
**Aplicar cuando**: Hay campos visuales (color, imagen) que afectan la UI pública
```

---

## NO Hacer

- NO agregar aprendizajes sin feedback explícito del humano
- NO inventar mejoras que no ocurrieron
- NO actualizar skills sin commit
