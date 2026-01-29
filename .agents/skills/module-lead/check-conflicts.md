# Skill: Analizar Conflictos con Otros Módulos

## Rol
Module Lead

## Trigger
- Al iniciar módulo que toca shared/
- Cuando otro Module Lead notifica que también toca shared/
- Cuando se detecta conflicto potencial

## Inputs
- Mi `.agents/active/[mi-modulo]-status.md`
- Status de otros módulos activos
- Archivos en conflicto

---

## Steps

### 1. Identificar Otros Módulos Activos

```bash
# Listar módulos activos
ls .agents/active/

# Revisar cada uno
for f in .agents/active/*-status.md; do
  echo "=== $f ==="
  cat "$f"
done
```

### 2. Detectar Archivos en Común

Para cada módulo activo, comparar:

```
MI MÓDULO: [nombre]
MIS ARCHIVOS SHARED:
- shared/components/[X].tsx (crear nuevo)
- shared/index.ts (modificar)

OTRO MÓDULO: [nombre]
SUS ARCHIVOS SHARED:
- shared/components/[Y].tsx (crear nuevo)
- shared/index.ts (modificar)

ARCHIVOS EN COMÚN:
- shared/index.ts ← CONFLICTO POTENCIAL
```

### 3. Evaluar Tipo de Conflicto

```
MATRIZ DE CONFLICTO:

| Archivo | Mi Acción | Su Acción | Tipo | Riesgo |
|---------|-----------|-----------|------|--------|
| shared/index.ts | agregar export | agregar export | bajo | ambos agregan líneas |
| shared/types.ts | modificar | modificar | alto | cambios en mismo código |
```

Tipos:
- **Bajo**: Ambos agregan cosas nuevas (exports, archivos)
- **Medio**: Uno modifica, otro agrega relacionado
- **Alto**: Ambos modifican mismo código

### 4. Recopilar Información para Análisis

```
ANÁLISIS DE MI MÓDULO:
- Módulo: [nombre]
- Progreso actual: [X]%
- Prioridad asignada: [alta/media/baja]
- Archivos shared/ que necesito:
  - [archivo1]: [crear/modificar]
  - [archivo2]: [crear/modificar]
- Complejidad del cambio: [baja/media/alta]
- Dependencias: [lista o ninguna]
- Bloquea a: [lista o ninguna]
```

### 5. Enviar Solicitud de Análisis

Al otro Module Lead:

```
SOLICITUD ANÁLISIS: Conflicto potencial en shared/
DE: Module Lead [mi módulo]
PARA: Module Lead [otro módulo]

MI SITUACIÓN:
  - Módulo: [nombre]
  - Progreso: [X]%
  - Archivos shared/: [lista]
  - Prioridad: [alta/media/baja]
  - Tipo de cambio: [crear nuevo / modificar existente]

ARCHIVOS EN COMÚN DETECTADOS:
  - shared/index.ts (ambos modificamos)

SOLICITO:
  - Tu situación actual
  - Análisis de impacto
  - Tu recomendación de orden
```

### 6. Recibir y Evaluar Respuesta

Cuando el otro responde, evaluar:

```
COMPARACIÓN:

| Criterio | Mi Módulo | Otro Módulo | Peso | Puntos |
|----------|-----------|-------------|------|--------|
| Progreso | [X]% | [Y]% | 20% | [quien gana] |
| Prioridad | [a/m/b] | [a/m/b] | 30% | [quien gana] |
| Complejidad | [a/m/b] | [a/m/b] | 15% | [quien gana] |
| Archivos conflicto | [N] | [M] | 20% | [quien gana] |
| Dependencias | [si/no] | [si/no] | 15% | [quien gana] |

RESULTADO: [quien debería ir primero]
```

### 7. Evaluar Opciones

```
OPCIÓN A: Yo primero
- Ventajas: [lista]
- Desventajas: [lista]
- Impacto en otro: [descripción]

OPCIÓN B: El otro primero
- Ventajas: [lista]
- Desventajas: [lista]
- Impacto en mí: [descripción]

OPCIÓN C: Trabajo paralelo
- Viable si: conflicto es bajo (solo agregar exports)
- Quien resuelve: el que mergea segundo
- Riesgo: [descripción]

OPCIÓN D: Refactorizar
- Cambio: [descripción]
- Evita conflicto porque: [razón]
- Esfuerzo extra: [descripción]
```

### 8. Negociar Acuerdo

```
# Si hay acuerdo

ACUERDO: Resolución de conflicto en shared/
ENTRE: Module Lead [A] y Module Lead [B]
FECHA: YYYY-MM-DD

DECISIÓN: [quien va primero / paralelo]

JUSTIFICACIÓN:
  - [razón 1]
  - [razón 2]

PLAN DE ACCIÓN:
  1. [quien primero] continúa y completa
  2. [quien segundo] continúa desarrollo sin shared/
  3. [quien primero] notifica cuando merge a main
  4. [quien segundo] hace rebase y resuelve conflictos

CONTINGENCIA:
  - Si [primero] se retrasa más de [X días]: reevaluar
```

### 9. Si No Hay Acuerdo: Escalar

```
ESCALAMIENTO: Conflicto no resuelto
DE: Module Lead [A] y Module Lead [B]
PARA: Project Owner

MÓDULOS EN CONFLICTO:
  - [módulo A]: progreso X%, prioridad Y
  - [módulo B]: progreso X%, prioridad Y

RECURSO EN CONFLICTO:
  - [archivos]

ANÁLISIS REALIZADO:
  - [resumen]

OPCIONES EVALUADAS:
  1. A primero: [pros/contras]
  2. B primero: [pros/contras]
  3. Paralelo: [pros/contras]

PUNTO DE DESACUERDO:
  - [razón por la que no acordamos]

SOLICITUD: Decidir orden de prioridad
```

### 10. Documentar en Status

Actualizar `.agents/active/[mi-modulo]-status.md`:

```markdown
## Conflictos Activos
| Con Módulo | Archivos en Común | Estado | Acuerdo |
|------------|-------------------|--------|---------|
| [otro] | shared/index.ts | resuelto | yo segundo, rebase post-merge |

## Historial
- YYYY-MM-DD: Conflicto detectado con [otro módulo]
- YYYY-MM-DD: Acuerdo alcanzado - [resumen]
```

---

## Outputs
- Conflictos identificados y analizados
- Acuerdo documentado (o escalamiento enviado)
- Status actualizado con información de conflictos

## Next
- Continuar desarrollo según acuerdo
- Esperar notificación de merge (si voy segundo)
- Hacer rebase cuando corresponda
