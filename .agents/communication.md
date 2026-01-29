# Comunicacion entre Agentes

## 1. Canales de Comunicacion

### Vertical (Jerarquia)

```
Product Owner (humano)
    ↕ Solo habla con Project Owner
Project Owner
    ↕ Habla con todos los Module Leads
Module Lead
    ↕ Habla con su equipo (DBA, Backend, Frontend, QA)
```

### Horizontal (Entre Module Leads)

```
Module Lead A ←→ Module Lead B ←→ Module Lead C
         │              │              │
         └──────────────┴──────────────┘
              Coordinan dependencias
```

---

## 2. Protocolo de Mensajes

### Project Owner → Module Lead

**Asignacion de modulo:**
```
ASIGNACION: [modulo]
MODELO DE NEGOCIO: [resumen o link]
BRANCH: feature/[modulo]
PRIORIDAD: [alta/media/baja]
DEPENDENCIAS: [lista de modulos de los que depende, o "ninguna"]
```

**Solicitud de estado:**
```
SOLICITUD: Estado de [modulo]
```

### Module Lead → Project Owner

**Reporte de progreso:**
```
MODULO: [modulo]
ESTADO: [in-progress/ready-for-review]
PROGRESO: [X]%
COMPLETADO:
  - [x] DBA
  - [x] Backend
  - [ ] Frontend
  - [ ] QA
BLOQUEADORES: [lista o "ninguno"]
```

**Propuesta de release:**
```
PROPUESTA RELEASE: [modulo]
CUMPLIMIENTO: [X]%
E2E: [passed]/[total] tests
SCREENSHOTS: [ubicacion]
TOCA SHARED: [si/no]
DEPENDENCIAS RESUELTAS: [si/no]
RECOMENDACION: [listo para review / necesita mas trabajo]
```

### Module Lead → Module Lead

**Notificacion de shared:**
```
NOTIFICACION: Voy a modificar shared/
MODULO: [mi modulo]
ARCHIVOS: [lista de archivos que voy a tocar]
ESTADO: [empezando/en progreso/listo]
```

**Coordinacion de orden:**
```
CONSULTA: ¿Tu modulo depende de shared/[componente]?
RESPUESTA ESPERADA: [si/no]
```

### Module Lead → Equipo

**Asignacion de tarea:**
```
TAREA: [descripcion]
ROL: [DBA/Backend/Frontend/QA]
ARCHIVOS A MODIFICAR: [lista]
DEPENDENCIAS: [tarea que debe completarse primero, o "ninguna"]
BRANCH: feature/[modulo]
```

### Equipo → Module Lead

**Tarea completada:**
```
COMPLETADO: [descripcion de tarea]
COMMIT: [hash o mensaje]
ARCHIVOS MODIFICADOS: [lista]
NOTAS: [observaciones si las hay]
```

**Bloqueador:**
```
BLOQUEADO: [descripcion de tarea]
RAZON: [que lo bloquea]
NECESITO: [que se necesita para desbloquear]
```

---

## 3. Escenarios de Comunicacion

### Escenario 1: Inicio de Modulo Nuevo

```
1. Product Owner → Project Owner:
   "Quiero modulo de tags para etiquetar productos"

2. Project Owner:
   - Crea testing-spec.md
   - Actualiza project.json
   - Crea branch feature/tags

3. Project Owner → Module Lead:
   ASIGNACION: tags
   MODELO DE NEGOCIO: .agents/specs/tags-testing-spec.md
   BRANCH: feature/tags
   PRIORIDAD: media
   DEPENDENCIAS: ninguna

4. Module Lead → DBA:
   TAREA: Crear tabla tags
   ROL: DBA
   ARCHIVOS: BD (via Docker)
   DEPENDENCIAS: ninguna
   BRANCH: feature/tags

5. DBA → Module Lead:
   COMPLETADO: Tabla tags creada
   COMMIT: "feat(tags): create tags table"
   ARCHIVOS: types/ (regenerados)

6. Module Lead → Backend + Frontend (paralelo):
   [asigna tareas]

... continua hasta completar
```

### Escenario 2: Dos Modulos Tocan Shared (Con Analisis)

```
1. Module Lead A (tags) detecta que tocara shared/:
   - ANTES de notificar, revisa .agents/active/
   - Encuentra que Module Lead B (reviews) tambien esta activo

2. Module Lead A analiza el estado de B:
   - Lee .agents/active/reviews-status.md
   - Identifica: B toca shared/components/StarRating.tsx
   - Progreso de B: 60%

3. Module Lead A envia SOLICITUD DE ANALISIS:
   ```
   SOLICITUD ANALISIS: Conflicto potencial en shared/
   DE: Module Lead A (tags)
   PARA: Module Lead B (reviews)

   MI SITUACION:
     - Modulo: tags
     - Progreso: 30%
     - Archivos shared/: shared/components/TagBadge.tsx, shared/index.ts
     - Dependencias: ninguna
     - Prioridad asignada: media

   TU SITUACION (segun leo):
     - Modulo: reviews
     - Progreso: 60%
     - Archivos shared/: shared/components/StarRating.tsx

   PREGUNTA: ¿Hay archivos en comun? ¿Cual conviene que vaya primero?
   ```

4. Module Lead B responde con ANALISIS:
   ```
   RESPUESTA ANALISIS: Conflicto en shared/
   DE: Module Lead B (reviews)
   PARA: Module Lead A (tags)

   MI SITUACION ACTUAL:
     - Modulo: reviews
     - Progreso: 60%
     - Archivos shared/: shared/components/StarRating.tsx, shared/index.ts
     - Dependencias: ninguna
     - Prioridad asignada: alta
     - Tiempo estimado para 90%: [proximo]

   ANALISIS DE CONFLICTO:
     - Archivos en comun: shared/index.ts
     - Impacto: Ambos agregamos exports al index
     - Riesgo: Bajo (solo agregar lineas, no modificar existentes)

   RECOMENDACION:
     - Yo voy primero (60% vs 30%, prioridad alta)
     - Tu esperas mi merge para hacer rebase
     - O: Ambos continuamos, el segundo resuelve conflicto en index.ts
   ```

5. Negociacion entre Module Leads:
   ```
   A: "De acuerdo, tu prioridad es alta y tienes mas progreso."
   A: "Continuo mi desarrollo, cuando mergees aviso para rebase."

   B: "Perfecto. Te notifico cuando este en main."
   ```

6. Si NO hay acuerdo, escalar a Project Owner:
   ```
   ESCALAMIENTO: Conflicto no resuelto en shared/
   DE: Module Lead A (tags) y Module Lead B (reviews)
   PARA: Project Owner

   SITUACION:
     - Ambos modulos tocan shared/index.ts
     - A tiene prioridad media, 30% progreso
     - B tiene prioridad alta, 60% progreso
     - No llegamos a acuerdo sobre orden

   OPCIONES EVALUADAS:
     1. B primero: Mas progreso y prioridad, pero A queda bloqueado
     2. A primero: Menos progreso, pero su cambio es mas simple
     3. Paralelo: Ambos continuan, segundo resuelve conflicto

   SOLICITUD: Decidir orden de merge
   ```

7. Project Owner decide y comunica:
   ```
   DECISION: Orden de merge para shared/

   ORDEN: B (reviews) primero, luego A (tags)

   RAZON:
     - B tiene prioridad alta asignada por Product Owner
     - B tiene 60% progreso vs 30%
     - El conflicto en index.ts es menor (solo exports)

   ACCIONES:
     - Module Lead B: Continuar, proponer release al llegar a 90%
     - Module Lead A: Continuar desarrollo, hacer rebase post-merge de B
   ```

8. Ejecucion del plan acordado:
   - B completa → propone release → Product Owner aprueba → MERGE
   - Project Owner notifica a A: "reviews en main, hacer rebase"
   - A hace rebase, resuelve conflicto en index.ts, continua
```

### Escenario 3: Dependencia entre Modulos

```
1. Project Owner asigna dos modulos:
   - tags (sin dependencias)
   - product-tags (depende de tags)

2. Project Owner → Module Lead de product-tags:
   ASIGNACION: product-tags
   DEPENDENCIAS: tags (debe estar en main primero)

3. Module Lead product-tags:
   - Puede empezar DBA y Backend (preparar estructura)
   - PERO no puede completar hasta que tags este en main

4. Module Lead product-tags → Project Owner:
   MODULO: product-tags
   ESTADO: in-progress
   PROGRESO: 40%
   BLOQUEADORES: Esperando merge de tags a main

5. Cuando tags se mergea:
   Project Owner → Module Lead product-tags:
   "tags ya esta en main. Puedes continuar."

6. Module Lead product-tags continua y completa
```

---

## 4. Archivos de Comunicacion

### Specs de Modulos Nuevos

Cuando el Project Owner crea un modelo de negocio:

```
.agents/specs/[modulo]-testing-spec.md
```

### Notificaciones Activas

Para coordinar shared/ y dependencias:

```
.agents/active/[modulo]-status.md
```

Contenido:
```markdown
# Estado: [modulo]

## Module Lead
[identificador]

## Branch
feature/[modulo]

## Progreso
- [x] DBA
- [x] Backend
- [ ] Frontend
- [ ] QA

## Toca Shared
- shared/components/[archivo].tsx

## Dependencias
- Depende de: [lista o ninguna]
- Bloquea a: [lista o ninguna]

## Ultima Actualizacion
YYYY-MM-DD HH:MM
```

---

## 5. Protocolo de Analisis de Conflictos

### Cuando Activar Este Protocolo

Un Module Lead DEBE activar este protocolo cuando:
1. Va a modificar archivos en `shared/`
2. Va a modificar archivos que otro modulo podria necesitar
3. Detecta que otro modulo activo toca recursos similares

### Paso 1: Deteccion

```
ANTES de empezar a modificar shared/:

1. Revisar .agents/active/
   - ¿Hay otros modulos en desarrollo?
   - ¿Alguno toca shared/?

2. Si hay otros modulos activos:
   - Leer su [modulo]-status.md
   - Identificar archivos que tocan
   - Identificar su progreso y prioridad
```

### Paso 2: Analisis Individual

Cada Module Lead debe documentar:

```
ANALISIS DE MI MODULO:
- Modulo: [nombre]
- Progreso actual: [X]%
- Prioridad asignada: [alta/media/baja]
- Archivos shared/ que necesito:
  - [archivo1]: [crear nuevo / modificar existente]
  - [archivo2]: [crear nuevo / modificar existente]
- Complejidad del cambio: [baja/media/alta]
- Dependencias de otros modulos: [lista o ninguna]
- Bloquea a otros modulos: [lista o ninguna]
```

### Paso 3: Comparacion y Evaluacion

Al comunicarse con otro Module Lead, evaluar:

```
MATRIZ DE DECISION:

| Criterio                  | Mi Modulo | Otro Modulo | Peso |
|---------------------------|-----------|-------------|------|
| Progreso actual           | X%        | Y%          | 20%  |
| Prioridad asignada        | [a/m/b]   | [a/m/b]     | 30%  |
| Complejidad del cambio    | [a/m/b]   | [a/m/b]     | 15%  |
| Archivos en conflicto     | N         | M           | 20%  |
| Dependencias bloqueantes  | [si/no]   | [si/no]     | 15%  |

ARCHIVOS EN COMUN:
- [archivo]: [tipo de conflicto - crear ambos / modificar mismo / uno crea otro modifica]

RIESGO DE CONFLICTO: [bajo/medio/alto]
```

### Paso 4: Opciones de Resolucion

Siempre evaluar estas opciones:

```
OPCION A: Yo primero
- Ventajas: [lista]
- Desventajas: [lista]
- Impacto en otro modulo: [descripcion]

OPCION B: El otro primero
- Ventajas: [lista]
- Desventajas: [lista]
- Impacto en mi modulo: [descripcion]

OPCION C: Trabajo paralelo
- Condiciones: [cuando es viable]
- Riesgo: [descripcion]
- Plan de resolucion de conflictos: [quien resuelve, como]

OPCION D: Refactorizar para evitar conflicto
- Cambio propuesto: [descripcion]
- Esfuerzo adicional: [descripcion]
```

### Paso 5: Negociacion

```
REGLAS DE NEGOCIACION:

1. Prioridad asignada por Project Owner tiene peso mayor
2. Si prioridades iguales, el de mayor progreso va primero
3. Si progreso similar, el de menor complejidad va primero
4. Si todo es igual, orden de llegada (quien notifico primero)

ACUERDO DEBE INCLUIR:
- Quien va primero
- Que hace el segundo mientras espera
- Como se notifica cuando el primero termina
- Plan de contingencia si hay retrasos
```

### Paso 6: Escalamiento (si no hay acuerdo)

```
ESCALAR A PROJECT OWNER cuando:
- No hay acuerdo despues de analisis
- Hay argumentos validos para ambos lados
- El impacto es significativo para el proyecto
- Hay presion de tiempo

NO ESCALAR cuando:
- El conflicto es menor (solo agregar lineas a index.ts)
- Uno de los dos claramente tiene prioridad
- El segundo puede continuar trabajo sin bloqueo total
```

### Mensajes del Protocolo

**Solicitud de Analisis:**
```
SOLICITUD ANALISIS: Conflicto potencial en [recurso]
DE: Module Lead [modulo A]
PARA: Module Lead [modulo B]

MI SITUACION:
  - Modulo: [nombre]
  - Progreso: [X]%
  - Archivos en conflicto: [lista]
  - Prioridad: [alta/media/baja]
  - Dependencias: [lista o ninguna]

SOLICITO:
  - Tu situacion actual
  - Analisis de archivos en comun
  - Tu recomendacion de orden
```

**Respuesta de Analisis:**
```
RESPUESTA ANALISIS: Conflicto en [recurso]
DE: Module Lead [modulo B]
PARA: Module Lead [modulo A]

MI SITUACION:
  - Modulo: [nombre]
  - Progreso: [X]%
  - Archivos en conflicto: [lista]
  - Prioridad: [alta/media/baja]

ANALISIS:
  - Archivos en comun: [lista con tipo de conflicto]
  - Riesgo: [bajo/medio/alto]

RECOMENDACION: [opcion A/B/C/D con justificacion]
```

**Acuerdo:**
```
ACUERDO: Resolucion de conflicto en [recurso]
ENTRE: Module Lead [A] y Module Lead [B]

DECISION: [descripcion]
ORDEN: [quien primero, quien segundo]
PLAN:
  1. [accion de quien va primero]
  2. [que hace el segundo mientras]
  3. [como se notifica]
  4. [acciones post-merge]

FECHA: YYYY-MM-DD
```

---

## 6. Resolucion de Conflictos

### Conflicto de Orden de Merge

```
Situacion: A y B quieren merge, ambos tocan shared/

Project Owner decide basado en:
1. Quien llego primero al 90%
2. Cual tiene menos dependencias
3. Cual es mas critico para el negocio

Comunicacion:
Project Owner → Module Lead A:
"Tu release va primero porque llegaste al 90% antes"

Project Owner → Module Lead B:
"Espera merge de A, luego haz rebase y continua"
```

### Conflicto de Archivos

```
Situacion: A y B modificaron el mismo archivo en shared/

Resolucion:
1. El que mergea segundo debe resolver conflictos
2. Module Lead coordina con su equipo (probablemente Frontend)
3. Si el conflicto es complejo, Module Leads se comunican para resolverlo

Comunicacion:
Module Lead B → Module Lead A:
"Hay conflicto en shared/index.ts.
 ¿Puedes explicar tu cambio para resolverlo correctamente?"
```

---

## 6. Reglas de Comunicacion

1. **Toda comunicacion queda documentada** en archivos .md
2. **Module Leads deben revisar .agents/active/** antes de modificar shared/
3. **Notificar ANTES de empezar**, no despues
4. **El Project Owner es el arbitro** en caso de conflictos
5. **El Product Owner solo recibe notificaciones de releases listos**
