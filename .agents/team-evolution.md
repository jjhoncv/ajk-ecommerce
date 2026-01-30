# Evolución del Equipo de Agentes

## Factor de Imaginación

El factor de imaginación define cuánta creatividad/mejora pueden agregar los agentes más allá de lo solicitado.

```
FACTOR_IMAGINACION = 10%
```

### Qué significa

- **0%**: Ejecutar exactamente lo pedido, nada más
- **10%**: Agregar pequeñas mejoras que aporten valor (ACTUAL)
- **20%**: Proponer alternativas y mejoras moderadas
- **30%+**: Alta autonomía creativa

### Cómo se aplica

Los agentes pueden:
- Sugerir un campo adicional que aporte valor
- Mejorar la UX de un componente
- Agregar una validación útil no solicitada
- Proponer un diseño más intuitivo

Los agentes NO deben:
- Cambiar la arquitectura sin consultar
- Agregar features complejas no solicitadas
- Ignorar los requerimientos base

---

## Historial de Feedback

Registro de feedback del humano sobre mejoras que superaron expectativas.

| Fecha | Módulo | Agente | Mejora Realizada | Feedback | Incorporado a Skill |
|-------|--------|--------|------------------|----------|---------------------|
| - | - | - | - | - | - |

---

## Proceso de Evolución

### 1. Durante Desarrollo

Cuando un agente tiene una idea de mejora (dentro del factor):

```
PROPUESTA DE MEJORA (Factor 10%)
================================
AGENTE: [rol]
MÓDULO: [módulo]

REQUERIMIENTO ORIGINAL:
[lo que se pidió]

MI PROPUESTA DE MEJORA:
[qué agregaría y por qué]

VALOR AGREGADO:
[cómo mejora la experiencia/funcionalidad]
```

### 2. Durante Validación de Screenshots

El Module Lead pregunta al humano:

```
VALIDACIÓN DE MÓDULO: [módulo]
==============================

CUMPLIMIENTO BASE: [X]%

MEJORAS DETECTADAS (Factor 10%):
1. [mejora 1] - por [agente]
2. [mejora 2] - por [agente]

PREGUNTA PARA TI:
¿Alguna de estas mejoras SUPERÓ tus expectativas?
- Si SÍ: Se documenta como aprendizaje para el skill
- Si NO: OK, cumplió con lo esperado
```

### 3. Captura de Aprendizaje

Si el humano dice "sí, esto superó expectativas":

```
APRENDIZAJE CAPTURADO
=====================
FECHA: YYYY-MM-DD
MÓDULO: [módulo]
AGENTE: [rol]

MEJORA QUE SUPERÓ EXPECTATIVAS:
[descripción de lo que hizo]

VALOR PERCIBIDO POR HUMANO:
[por qué fue mejor de lo esperado]

ACCIÓN:
- [ ] Actualizar skill de [agente] con este patrón
- [ ] Registrar en historial de feedback
```

### 4. Actualización de Skills

El aprendizaje se agrega al skill correspondiente:

```markdown
## Aprendizajes del Equipo

### [Fecha] - [Módulo]
**Mejora**: [descripción]
**Por qué funcionó**: [explicación]
**Aplicar cuando**: [contexto similar]
```

---

## Ajuste del Factor

El humano puede ajustar el factor basado en resultados:

```
AJUSTE DE FACTOR DE IMAGINACIÓN
===============================
FACTOR ANTERIOR: 10%
FACTOR NUEVO: [X]%

RAZÓN:
- [ ] El equipo demostró capacidad de mejoras útiles → AUMENTAR
- [ ] Las mejoras no aportaron valor → MANTENER o REDUCIR
- [ ] Hubo over-engineering → REDUCIR

FECHA: YYYY-MM-DD
```

---

## Métricas de Evolución

| Métrica | Valor Actual |
|---------|--------------|
| Módulos completados | 0 |
| Mejoras que superaron expectativas | 0 |
| Skills actualizados por feedback | 0 |
| Factor de imaginación | 10% |

---

## Notas

- El objetivo es agentes cada vez más inteligentes y capaces
- El feedback positivo es CRUCIAL para la evolución
- Los skills son documentos vivos que mejoran con cada iteración
- El humano tiene control total sobre el factor de imaginación
