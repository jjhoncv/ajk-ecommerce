# Module Lead Templates

Templates para reducir carga cognitiva del Module Lead.

## Archivos

| Template | Propósito |
|----------|-----------|
| `task-prompts.template.md` | Prompts para lanzar agentes con Task() |
| `screenshot-evaluation.template.md` | Checklists de evaluación de screenshots |
| `messages.template.md` | Mensajes de autorización, rechazo, correcciones |

## Uso

### task-prompts.template.md

Contiene prompts listos para:
- DBA
- Backend Admin / Ecommerce
- Frontend Admin / Ecommerce
- QA Admin / Ecommerce (Etapa 1 y 2)
- Integrador

**Cómo usar:**
1. Copiar el prompt del rol necesario
2. Reemplazar `[modulo]`, `[Modulo]`, `[Entidad]`, `[entidad]`
3. Pegar en Task()

### screenshot-evaluation.template.md

Contiene checklists para evaluar:
- Screenshots de Admin CRUD
- Screenshots de Ecommerce
- Criterios por tipo de pantalla

**Cómo usar:**
1. Copiar la sección relevante
2. Leer cada screenshot con la herramienta Read
3. Marcar SI/NO en cada criterio
4. Calcular cumplimiento

### messages.template.md

Contiene mensajes para:
- Autorizar commit (>= 90%)
- Rechazar e iterar (< 90%)
- Asignar correcciones (Frontend/Backend)
- Solicitar re-ejecución de tests
- Feedback de mejoras

**Cómo usar:**
1. Copiar el mensaje apropiado
2. Rellenar los campos entre corchetes
3. Enviar al agente correspondiente

## Placeholders Comunes

| Placeholder | Descripción | Ejemplo |
|-------------|-------------|---------|
| `[modulo]` | Nombre en minúsculas | `testimonials` |
| `[Modulo]` | Nombre en PascalCase | `Testimonials` |
| `[Entidad]` | Entidad singular PascalCase | `Testimonial` |
| `[entidad]` | Entidad singular minúsculas | `testimonial` |
| `[Z]%` | Porcentaje de cumplimiento | `92%` |
| `[X]`, `[Y]` | Números de screenshots | `10`, `2` |
