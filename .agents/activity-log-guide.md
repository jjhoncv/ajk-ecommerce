# Guía de Activity Log

## Propósito

El archivo `.agents/activity.log` registra **SOLO** el progreso de tareas de los agentes. NO es un log de debug.

---

## Formato

```
[TIMESTAMP] [AGENTE] Mensaje de tarea
```

Ejemplo:
```
[2026-01-30 10:15:00] [DBA] Tabla tags creada con 11 campos
[2026-01-30 10:16:30] [DBA] TAREA COMPLETADA - Siguiente agente: BACKEND
```

---

## ✅ QUÉ REGISTRAR

### Inicio de tarea
```
[TIMESTAMP] [AGENTE] Iniciando [descripción breve de la tarea]
```

### 🔍 MICROTAREAS Y RAZONAMIENTO (NUEVO)

**Los agentes deben registrar su proceso de pensamiento:**

#### Análisis y preguntas
```
[TIMESTAMP] [AGENTE] 🔍 Analizando: [qué está revisando]
[TIMESTAMP] [AGENTE] ❓ Pregunta: [qué necesita resolver]
[TIMESTAMP] [AGENTE] 💡 Decisión: [qué decidió y por qué brevemente]
```

#### Microtareas (pasos pequeños)
```
[TIMESTAMP] [AGENTE] → Leyendo [archivo] para entender [qué]
[TIMESTAMP] [AGENTE] → Buscando [patrón] en [ubicación]
[TIMESTAMP] [AGENTE] → Comparando [A] con [B]
[TIMESTAMP] [AGENTE] → Creando [archivo]: [propósito]
[TIMESTAMP] [AGENTE] → Modificando [archivo]: [qué cambio]
[TIMESTAMP] [AGENTE] → Ejecutando [comando]: [propósito]
[TIMESTAMP] [AGENTE] → Validando [qué]
```

#### Descubrimientos y resoluciones
```
[TIMESTAMP] [AGENTE] ✓ Encontrado: [qué descubrió]
[TIMESTAMP] [AGENTE] ⚠️ Problema: [qué encontró]
[TIMESTAMP] [AGENTE] ✓ Resuelto: [cómo lo solucionó]
```

#### Ejemplo completo con microtareas
```
[2026-01-30 10:00:00] [BACKEND] Iniciando backend tags
[2026-01-30 10:00:05] [BACKEND] 🔍 Analizando: spec de tags para identificar campos
[2026-01-30 10:00:10] [BACKEND] → Leyendo .agents/specs/tags-testing-spec.md
[2026-01-30 10:00:15] [BACKEND] ✓ Encontrado: 6 campos (name, slug, description, color, is_active, display_order)
[2026-01-30 10:00:20] [BACKEND] ❓ Pregunta: ¿El modelo necesita métodos de búsqueda?
[2026-01-30 10:00:25] [BACKEND] → Revisando spec sección "Campos Requeridos"
[2026-01-30 10:00:30] [BACKEND] 💡 Decisión: Sí, agregar findBySlug para URLs amigables
[2026-01-30 10:00:35] [BACKEND] → Creando src/module/tags/core/Tag.model.ts
[2026-01-30 10:00:40] [BACKEND] → Creando src/module/tags/core/Tag.repository.ts
[2026-01-30 10:00:45] [BACKEND] ⚠️ Problema: Tipo Tag no existe en database.d.ts
[2026-01-30 10:00:50] [BACKEND] → Ejecutando pnpm generate para regenerar types
[2026-01-30 10:00:55] [BACKEND] ✓ Resuelto: Types regenerados, Tag ahora disponible
[2026-01-30 10:01:00] [BACKEND] → Creando API routes en /api/admin/tags
[2026-01-30 10:01:05] [BACKEND] → Validando que importaciones funcionan
[2026-01-30 10:01:10] [BACKEND] Core creado: Tag.model.ts, Tag.repository.ts, Tag.mapper.ts
[2026-01-30 10:01:15] [BACKEND] TAREA COMPLETADA
```

### Progreso significativo (resumen)
```
[TIMESTAMP] [AGENTE] [Hito completado]: [detalle breve]
```

### Tarea completada
```
[TIMESTAMP] [AGENTE] TAREA COMPLETADA - Siguiente agente: [NOMBRE]
```

### Errores que bloquean
```
[TIMESTAMP] [AGENTE] ERROR: [descripción del problema]
[TIMESTAMP] [AGENTE] Acción: [qué se necesita para resolverlo]
```

### Iteraciones QA ↔ Module Lead
```
[TIMESTAMP] [QA] Tests ejecutados: X/Y pasaron
[TIMESTAMP] [QA] Esperando validación de Module Lead
[TIMESTAMP] [MODULE-LEAD] Screenshots revisados: [APROBADO/RECHAZADO]
[TIMESTAMP] [MODULE-LEAD] Correcciones requeridas: [lista breve]
[TIMESTAMP] [QA] Re-ejecutando tests después de correcciones
```

### Coordinación Project Owner ↔ Module Lead
```
[TIMESTAMP] [PROJECT-OWNER] Asignando módulo [nombre] a Module Lead
[TIMESTAMP] [MODULE-LEAD] Módulo [nombre] recibido - iniciando trabajo
[TIMESTAMP] [MODULE-LEAD] Reportando progreso: DBA ✓, Backend ✓, Frontend en curso
[TIMESTAMP] [MODULE-LEAD] Propuesta release: [módulo] listo (95% cumplimiento)
[TIMESTAMP] [PROJECT-OWNER] Release aprobado/rechazado: [razón breve]
```

### Coordinación Module Lead ↔ Module Lead (shared/)
```
[TIMESTAMP] [MODULE-LEAD-A] Notificando: voy a modificar shared/components/Table
[TIMESTAMP] [MODULE-LEAD-B] Confirmado: mi módulo NO depende de Table
[TIMESTAMP] [MODULE-LEAD-C] Confirmado: mi módulo SÍ depende - esperaré
[TIMESTAMP] [MODULE-LEAD-A] shared/components/Table modificado - pueden continuar
```

### Bloqueadores entre agentes
```
[TIMESTAMP] [FRONTEND] BLOQUEADO: Necesito endpoint GET /api/admin/tags
[TIMESTAMP] [MODULE-LEAD] Reasignando: BACKEND debe completar API primero
[TIMESTAMP] [BACKEND] Endpoint GET /api/admin/tags creado
[TIMESTAMP] [FRONTEND] Desbloqueado - continuando con componentes
```

---

## ❌ QUÉ NO REGISTRAR

- Logs de debug o verbose
- Stack traces completos
- Contenido de archivos
- Comandos ejecutados (a menos que sea relevante)
- Mensajes repetitivos
- Información técnica detallada (va en el spec o en el código)

---

## Ejemplos

### ✅ CORRECTO

```
[2026-01-30 10:00:00] === INICIO CREACIÓN MÓDULO TAGS ===
[2026-01-30 10:01:00] [PROJECT-OWNER] Spec creado: .agents/specs/tags-testing-spec.md
[2026-01-30 10:01:00] [PROJECT-OWNER] TAREA COMPLETADA - Siguiente agente: DBA
[2026-01-30 10:05:00] [DBA] Branch feature/tags creado desde main
[2026-01-30 10:06:00] [DBA] Tabla tags creada (11 campos)
[2026-01-30 10:07:00] [DBA] Sección registrada en sidebar
[2026-01-30 10:08:00] [DBA] TAREA COMPLETADA - Siguiente agente: BACKEND
[2026-01-30 10:15:00] [BACKEND] Core creado: model, repository, mapper
[2026-01-30 10:18:00] [BACKEND] API Routes creadas: GET, POST, PATCH, PUT, DELETE
[2026-01-30 10:20:00] [BACKEND] TAREA COMPLETADA - Siguiente agente: FRONTEND
[2026-01-30 10:30:00] [FRONTEND] Componentes creados: tagFields.ts, TagListView.tsx
[2026-01-30 10:35:00] [FRONTEND] Páginas creadas: list, new, edit
[2026-01-30 10:40:00] [FRONTEND] TAREA COMPLETADA - Siguiente agente: QA
[2026-01-30 10:45:00] [QA] Tests E2E creados (8 casos)
[2026-01-30 10:50:00] [QA] Tests ejecutados: 8/8 pasaron
[2026-01-30 10:50:00] [QA] Esperando validación de Module Lead
[2026-01-30 11:00:00] [MODULE-LEAD] Screenshots validados: APROBADO (95%)
[2026-01-30 11:00:00] [QA] Commit realizado: test(tags): add E2E tests
```

### ❌ INCORRECTO

```
[2026-01-30 10:00:00] QA Agent - Tags E2E Tests
========================================
- Created E2E test structure for tags module
- Files created:
  * src/module/tags/e2e/data.ts
  * src/module/tags/e2e/utils.ts
  ... (demasiado detalle)

[2026-01-30 10:05:00] Executing: docker exec ajk-ecommerce mysql...
(comandos internos no van en el log)

[2026-01-30 10:10:00] TypeScript errors found:
- src/app/api/admin/ratings/[ratingId]/route.ts
- src/app/api/checkout/data/route.ts
... (stack traces no van en el log)
```

---

## Iteraciones

Cuando hay rechazos y correcciones, registrar cada iteración:

```
[TIMESTAMP] [QA] Iteración 1: Tests ejecutados - 6/8 pasaron
[TIMESTAMP] [QA] Problemas encontrados: Delete no funciona, validación faltante
[TIMESTAMP] [MODULE-LEAD] RECHAZADO - Correcciones asignadas a BACKEND
[TIMESTAMP] [BACKEND] Corrigiendo endpoint DELETE
[TIMESTAMP] [BACKEND] Corrección completada
[TIMESTAMP] [QA] Iteración 2: Tests ejecutados - 8/8 pasaron
[TIMESTAMP] [MODULE-LEAD] APROBADO
```

Esto permite ver cuántas iteraciones tomó completar el módulo.

---

## Responsabilidad

Cada agente es responsable de registrar SU progreso. El formato debe ser:
- **Conciso**: Una línea por evento significativo
- **Informativo**: Debe entenderse qué pasó sin leer más contexto
- **Trazable**: Permite seguir el flujo de trabajo
