# Skill: Revisar Propuesta de Release

## Rol
Project Owner

## Trigger
Module Lead envía PROPUESTA RELEASE

## Inputs
- Propuesta de release del Module Lead
- `.agents/active/[modulo]-status.md`
- Resultados de E2E tests

---

## Steps

### 1. Verificar Cumplimiento

Revisar la propuesta:

```
CHECKLIST DE REVISION:

[ ] Cumplimiento >= 90%
[ ] E2E tests: todos pasando
[ ] Screenshots generados
[ ] Todos los agentes completaron (DBA, Backend, Frontend, QA)
```

### 2. Verificar Conflictos de Shared

```bash
# Revisar si toca shared/
cat .agents/active/[modulo]-status.md | grep -A 10 "Toca Shared"

# Revisar otros módulos activos
ls .agents/active/
```

Si toca shared/:
- Verificar que conflictos estén resueltos
- Verificar acuerdos con otros Module Leads
- Confirmar que no hay bloqueos

### 3. Verificar Dependencias

```
[ ] Módulos de los que depende ya están en main
[ ] Módulos que bloquea están notificados
[ ] No hay conflictos pendientes
```

### 4. Consultar con Otros Module Leads (si aplica)

Si hay otros releases pendientes:

```
CONSULTA: Orden de merge
PARA: Module Leads con releases pendientes

RELEASES EN COLA:
1. [modulo A] - propuesto [fecha]
2. [modulo B] - propuesto [fecha]

CONFLICTOS:
- [descripción de conflictos si los hay]

PROPUESTA DE ORDEN:
1. [modulo] primero porque [razón]
2. [modulo] segundo

¿Están de acuerdo?
```

### 5. Tomar Decisión

**Si APRUEBA:**

Continuar con `approve-release.md`

**Si RECHAZA:**

Enviar al Module Lead:

```
RECHAZO RELEASE: [modulo]

RAZONES:
- [ ] Cumplimiento < 90% (actual: X%)
- [ ] E2E tests fallando (X failed)
- [ ] Dependencias no resueltas
- [ ] Conflictos de shared/ pendientes
- [ ] Otro: [descripción]

ACCIONES REQUERIDAS:
1. [acción 1]
2. [acción 2]

CUANDO CORRIJAS: Enviar nueva PROPUESTA RELEASE
```

### 6. Notificar a Product Owner (si aprueba)

```
RELEASE LISTO: [modulo]

Module Lead: [identificador]
Cumplimiento: [X]%
E2E Tests: [passed]/[total] - todos pasando

Toca shared: [si/no]
Dependencias: resueltas

ARCHIVOS PRINCIPALES:
- src/module/[modulo]/core/
- src/module/[modulo]/service/
- src/module/[modulo]/components/admin/
- src/app/admin/[modulo]/
- src/app/api/admin/[modulo]/

SCREENSHOTS: src/module/[modulo]/e2e/screenshots/

PR: [crear PR con gh pr create]

RECOMENDACION: Aprobar merge a main
```

---

## Outputs
- Decisión tomada (aprobar/rechazar)
- Notificación enviada al destinatario correcto
- Si aprueba: PR creado, Product Owner notificado

## Next
- Si aprueba: Esperar aprobación de Product Owner → `approve-release.md`
- Si rechaza: Module Lead corrige y reenvía propuesta
