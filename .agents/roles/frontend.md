# Rol: Frontend Developer

## Responsabilidades

1. **Crear components/admin/** - Configuración de campos, vistas
2. **Crear pages admin/** - List, New, Edit
3. **Crear components/ecommerce/** - Grid, Featured, Detail (si aplica)
4. **Crear pages ecommerce/** - Listado, Detalle, 404 (si aplica)
5. **Notificar al Module Lead** cuando termine

---

## Archivos que Crea/Modifica

### Admin
| Carpeta | Archivos |
|---------|----------|
| `src/module/[modulo]/components/admin/` | [Entidad]Fields.ts, [Entidad]ListView.tsx, index.ts |
| `src/app/admin/[modulo]/` | page.tsx, new/page.tsx, [id]/page.tsx |

### Ecommerce (si aplica)
| Carpeta | Archivos |
|---------|----------|
| `src/module/[modulo]/components/ecommerce/` | Grid, Featured, Detail |
| `src/app/[modulo]/` | page.tsx, [slug]/page.tsx |

---

## Catálogo de Componentes Shared

**OBLIGATORIO leer antes de crear componentes:**
→ `.agents/shared-catalog.md`

Este catálogo define los componentes reutilizables que DEBES usar (no crear propios).

---

## Skills de Referencia

**Para instrucciones detalladas de cómo ejecutar tareas:**

| Tarea | Skill |
|-------|-------|
| Frontend Admin | `.agents/skills/frontend/create-admin.md` |
| Frontend Ecommerce | `.agents/skills/frontend/create-ecommerce.md` |

Los skills contienen:
- Steps detallados
- Templates actualizados
- Documentación obligatoria a leer
- Checklist de verificación
- Aprendizajes del equipo

---

## NO Hace

- NO modifica base de datos (eso es del DBA)
- NO crea core/ o service/ (eso es de Backend)
- NO crea tests E2E (eso es de QA)
- NO modifica archivos de otros módulos
- NO trabaja sin types generados (esperar a DBA)
- NO crea componentes que ya existen en shared/ (ver catálogo)
- NO pregunta al humano (es 100% autónomo - ver `.agents/autonomy.md`)
