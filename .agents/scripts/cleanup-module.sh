#!/bin/bash
# Script para limpiar un módulo creado por agentes
# Uso: ./cleanup-module.sh [nombre-modulo]
#
# Ejemplo: ./cleanup-module.sh tags

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "❌ Error: Debes especificar el nombre del módulo"
  echo ""
  echo "Uso: ./cleanup-module.sh [nombre-modulo]"
  echo "Ejemplo: ./cleanup-module.sh tags"
  exit 1
fi

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🧹 LIMPIEZA DE MÓDULO: $MODULE"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

AGENTS_DIR="$(dirname "$0")/.."
PROJECT_DIR="$(dirname "$0")/../.."

# Confirmar
read -p "⚠️  ¿Estás seguro de limpiar el módulo '$MODULE'? (s/N): " confirm
if [[ ! "$confirm" =~ ^[sS]$ ]]; then
  echo "Cancelado."
  exit 0
fi

echo ""
echo "🔄 Iniciando limpieza..."
echo ""

# 1. Borrar tablas en MySQL (principal + pivotes)
echo "📦 [1/12] Borrando tablas en MySQL..."

# Primero buscar y eliminar tablas pivote que referencien este módulo
echo "  🔍 Buscando tablas pivote relacionadas..."
PIVOT_TABLES=$(docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -N -e "SHOW TABLES LIKE '%_${MODULE}%'" 2>/dev/null)
PIVOT_TABLES2=$(docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -N -e "SHOW TABLES LIKE '%${MODULE}_%'" 2>/dev/null)

for table in $PIVOT_TABLES $PIVOT_TABLES2; do
  if [ -n "$table" ] && [ "$table" != "$MODULE" ]; then
    echo "  🗑️  Eliminando tabla pivote: $table"
    docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DROP TABLE IF EXISTS $table" 2>/dev/null
  fi
done

# Luego eliminar tabla principal
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DROP TABLE IF EXISTS $MODULE" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Tabla '$MODULE' eliminada (o no existía)"
else
  echo "  ⚠️  No se pudo conectar a MySQL (Docker no disponible?)"
fi

# 2. Limpiar sidebar (sections y roles_sections)
echo "📦 [2/12] Limpiando sidebar..."
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "
  DELETE FROM roles_sections WHERE id_section IN (SELECT id FROM sections WHERE url='/$MODULE');
  DELETE FROM sections WHERE url='/$MODULE';
" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Sidebar limpiado"
else
  echo "  ⏭️  No había entrada en sidebar"
fi

# 3. Borrar src/module/[modulo]
echo "📦 [3/12] Borrando src/module/$MODULE..."
if [ -d "$PROJECT_DIR/src/module/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/module/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 4. Borrar src/app/admin/[modulo]
echo "📦 [4/12] Borrando src/app/admin/$MODULE..."
if [ -d "$PROJECT_DIR/src/app/admin/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/app/admin/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 5. Borrar src/app/api/admin/[modulo]
echo "📦 [5/12] Borrando src/app/api/admin/$MODULE..."
if [ -d "$PROJECT_DIR/src/app/api/admin/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/app/api/admin/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 6. Borrar src/app/[modulo] (páginas ecommerce públicas)
echo "📦 [6/12] Borrando src/app/$MODULE (páginas ecommerce)..."
if [ -d "$PROJECT_DIR/src/app/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/app/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 7. Borrar spec
echo "📦 [7/12] Borrando .agents/specs/$MODULE-testing-spec.md..."
if [ -f "$AGENTS_DIR/specs/$MODULE-testing-spec.md" ]; then
  rm -f "$AGENTS_DIR/specs/$MODULE-testing-spec.md"
  echo "  ✅ Archivo eliminado"
else
  echo "  ⏭️  No existe"
fi

# 8. Borrar status
echo "📦 [8/12] Borrando .agents/active/$MODULE-status.md..."
if [ -f "$AGENTS_DIR/active/$MODULE-status.md" ]; then
  rm -f "$AGENTS_DIR/active/$MODULE-status.md"
  echo "  ✅ Archivo eliminado"
else
  echo "  ⏭️  No existe"
fi

# 9. Borrar analysis del Module Expert
echo "📦 [9/12] Borrando archivos de análisis del Module Expert..."
# Borrar análisis del módulo mismo
if [ -f "$AGENTS_DIR/analysis/$MODULE-structure.md" ]; then
  rm -f "$AGENTS_DIR/analysis/$MODULE-structure.md"
  echo "  ✅ Análisis de $MODULE eliminado"
fi
# Buscar análisis que mencionen este módulo (integraciones)
for file in "$AGENTS_DIR/analysis/"*-structure.md; do
  if [ -f "$file" ] && grep -q "$MODULE" "$file" 2>/dev/null; then
    echo "  ⚠️  $file menciona $MODULE - revisar manualmente"
  fi
done

# 10. Actualizar project.json (remover módulo)
echo "📦 [10/12] Actualizando project.json..."
if grep -q "\"$MODULE\"" "$AGENTS_DIR/project.json" 2>/dev/null; then
  # Usar sed para remover la línea del módulo
  sed -i '' "/\"$MODULE\"/d" "$AGENTS_DIR/project.json" 2>/dev/null || \
  sed -i "/\"$MODULE\"/d" "$AGENTS_DIR/project.json" 2>/dev/null
  # Remover de activeFeatures
  sed -i '' "s/\"$MODULE\",*//g" "$AGENTS_DIR/project.json" 2>/dev/null || \
  sed -i "s/\"$MODULE\",*//g" "$AGENTS_DIR/project.json" 2>/dev/null
  echo "  ✅ Módulo removido de project.json"
else
  echo "  ⏭️  Módulo no está en project.json"
fi

# 11. Regenerar types
echo "📦 [11/12] Regenerando types..."
cd "$PROJECT_DIR" && pnpm generate 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Types regenerados"
else
  echo "  ⚠️  Error regenerando types (ejecutar manualmente: pnpm generate)"
fi

# 12. Borrar branch
echo "📦 [12/12] Borrando branch feature/$MODULE..."
git branch -D "feature/$MODULE" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Branch local eliminado"
else
  echo "  ⏭️  Branch local no existe o estás en él"
fi
# Intentar borrar branch remoto
git push origin --delete "feature/$MODULE" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Branch remoto eliminado"
else
  echo "  ⏭️  Branch remoto no existe"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ Limpieza de '$MODULE' completada"
echo ""
echo "⚠️  IMPORTANTE - Revisar manualmente:"
echo "   - Si el módulo tenía INTEGRACIONES con otros módulos,"
echo "     los archivos de integración en OTROS módulos NO se eliminan."
echo "   - Buscar referencias: grep -r \"$MODULE\" src/module/"
echo "   - Revisar análisis que lo mencionen en .agents/analysis/"
echo "═══════════════════════════════════════════════════════════════════"
