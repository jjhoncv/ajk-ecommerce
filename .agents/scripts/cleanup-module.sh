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

# 1. Borrar tabla en MySQL
echo "📦 [1/8] Borrando tabla en MySQL..."
docker exec ajk-ecommerce mysql -uroot -p12345678 ajkecommerce -e "DROP TABLE IF EXISTS $MODULE" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Tabla '$MODULE' eliminada (o no existía)"
else
  echo "  ⚠️  No se pudo conectar a MySQL (Docker no disponible?)"
fi

# 2. Borrar src/module/[modulo]
echo "📦 [2/8] Borrando src/module/$MODULE..."
if [ -d "$PROJECT_DIR/src/module/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/module/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 3. Borrar src/app/admin/[modulo]
echo "📦 [3/8] Borrando src/app/admin/$MODULE..."
if [ -d "$PROJECT_DIR/src/app/admin/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/app/admin/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 4. Borrar src/app/api/admin/[modulo]
echo "📦 [4/8] Borrando src/app/api/admin/$MODULE..."
if [ -d "$PROJECT_DIR/src/app/api/admin/$MODULE" ]; then
  rm -rf "$PROJECT_DIR/src/app/api/admin/$MODULE"
  echo "  ✅ Carpeta eliminada"
else
  echo "  ⏭️  No existe"
fi

# 5. Borrar spec
echo "📦 [5/8] Borrando .agents/specs/$MODULE-testing-spec.md..."
if [ -f "$AGENTS_DIR/specs/$MODULE-testing-spec.md" ]; then
  rm -f "$AGENTS_DIR/specs/$MODULE-testing-spec.md"
  echo "  ✅ Archivo eliminado"
else
  echo "  ⏭️  No existe"
fi

# 6. Borrar status
echo "📦 [6/8] Borrando .agents/active/$MODULE-status.md..."
if [ -f "$AGENTS_DIR/active/$MODULE-status.md" ]; then
  rm -f "$AGENTS_DIR/active/$MODULE-status.md"
  echo "  ✅ Archivo eliminado"
else
  echo "  ⏭️  No existe"
fi

# 7. Actualizar project.json (remover módulo)
echo "📦 [7/8] Actualizando project.json..."
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

# 8. Borrar branch
echo "📦 [8/8] Borrando branch feature/$MODULE..."
git branch -D "feature/$MODULE" 2>/dev/null
if [ $? -eq 0 ]; then
  echo "  ✅ Branch eliminado"
else
  echo "  ⏭️  Branch no existe o estás en él"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════"
echo "✅ Limpieza de '$MODULE' completada"
echo ""
echo "📝 Nota: Si modificaste types, ejecuta 'pnpm generate' para regenerar"
echo "═══════════════════════════════════════════════════════════════════"
