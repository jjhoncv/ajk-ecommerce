#!/bin/bash
# Dashboard simple para ver estado de agentes
# Uso: ./dashboard.sh

AGENTS_DIR="$(dirname "$0")/.."

clear
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           🤖 DASHBOARD MULTI-AGENTE - AJK E-COMMERCE             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Mostrar módulos activos
echo "📦 MÓDULOS ACTIVOS:"
echo "───────────────────────────────────────────────────────────────────"
if ls "$AGENTS_DIR/active/"*.md 1> /dev/null 2>&1; then
  for f in "$AGENTS_DIR/active/"*.md; do
    if [[ $(basename "$f") != ".gitkeep" ]]; then
      MODULE=$(basename "$f" -status.md)
      PROGRESS=$(grep "Porcentaje" "$f" 2>/dev/null | head -1 | cut -d':' -f2 | tr -d ' ' || echo "?%")
      PRIORITY=$(grep "Prioridad" "$f" 2>/dev/null | head -1 | cut -d':' -f2 | tr -d ' ' || echo "?")
      echo "  📁 $MODULE | Progreso: $PROGRESS | Prioridad: $PRIORITY"
    fi
  done
else
  echo "  (ninguno)"
fi
echo ""

# Mostrar últimas 10 actividades
echo "📋 ÚLTIMAS ACTIVIDADES:"
echo "───────────────────────────────────────────────────────────────────"
tail -10 "$AGENTS_DIR/activity.log" 2>/dev/null | grep -v "^#" | grep -v "^$" || echo "  (sin actividad)"
echo ""

# Mostrar agentes
echo "👥 AGENTES DISPONIBLES:"
echo "───────────────────────────────────────────────────────────────────"
echo "  🎯 PROJECT-OWNER  - Coordina módulos, gestiona releases"
echo "  👔 MODULE-LEAD    - Jefe de módulo, divide tareas"
echo "  🗄️ DBA            - Base de datos, types"
echo "  ⚙️ BACKEND        - core/, service/, API"
echo "  🎨 FRONTEND       - components/, pages"
echo "  🧪 QA             - Tests E2E, screenshots"
echo ""
echo "───────────────────────────────────────────────────────────────────"
echo "💡 Comandos:"
echo "   tail -f .agents/activity.log     # Ver actividad en tiempo real"
echo "   ./dashboard.sh                   # Refrescar este dashboard"
echo "   watch -n 2 ./dashboard.sh        # Auto-refresh cada 2 seg"
echo "═══════════════════════════════════════════════════════════════════"
