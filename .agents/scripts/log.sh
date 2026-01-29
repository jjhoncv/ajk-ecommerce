#!/bin/bash
# Script para escribir al log de actividad
# Uso: ./log.sh "AGENTE" "mensaje"

AGENT=$1
MESSAGE=$2
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="$(dirname "$0")/../activity.log"

# Emojis por agente
case $AGENT in
  "PROJECT-OWNER") EMOJI="🎯" ;;
  "MODULE-LEAD") EMOJI="👔" ;;
  "DBA") EMOJI="🗄️" ;;
  "BACKEND") EMOJI="⚙️" ;;
  "FRONTEND") EMOJI="🎨" ;;
  "QA") EMOJI="🧪" ;;
  "SYSTEM") EMOJI="💻" ;;
  *) EMOJI="📌" ;;
esac

echo "[$TIMESTAMP] $EMOJI $AGENT: $MESSAGE" >> "$LOG_FILE"
