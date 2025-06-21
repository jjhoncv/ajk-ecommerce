#!/bin/bash

# Script para generar análisis del proyecto en secciones manejables
# Uso: ./analyze_sections.sh [seccion]

SECTION="$1"

# Función para agregar separador
add_separator() {
    echo "==================================================================================="
    echo "$1"
    echo "==================================================================================="
    echo ""
}

# Función para agregar archivo con ruta
add_file_with_path() {
    local file_path="$1"
    if [[ -f "$file_path" ]]; then
        echo "📁 ARCHIVO: $file_path"
        echo "------------------------------------------------------------------------------------"
        cat "$file_path"
        echo -e "\n\n"
    fi
}

# Función para verificar si un archivo debe ser excluido
should_exclude_file() {
    local file_path="$1"
    
    if [[ "$file_path" == *"node_modules"* ]] || \
       [[ "$file_path" == *".next"* ]] || \
       [[ "$file_path" == *".git"* ]] || \
       [[ "$file_path" == *"coverage"* ]] || \
       [[ "$file_path" == *"dist"* ]] || \
       [[ "$file_path" == *"build"* ]] || \
       [[ "$file_path" == *".pnpm"* ]] || \
       [[ "$file_path" == *"yarn.lock"* ]] || \
       [[ "$file_path" == *"package-lock.json"* ]] || \
       [[ "$file_path" == *"pnpm-lock.yaml"* ]]; then
        return 0  # true - excluir
    fi
    
    return 1  # false - incluir
}

case "$SECTION" in
    "config"|"1")
        # SECCIÓN 1: CONFIGURACIÓN
        add_separator "⚙️ CONFIGURACIÓN DEL PROYECTO"
        
        config_files=(
            "package.json"
            "next.config.js"
            "next.config.mjs"
            "tsconfig.json"
            "tailwind.config.js"
            "tailwind.config.ts"
            "middleware.ts"
            "middleware.js"
        )
        
        for config in "${config_files[@]}"; do
            add_file_with_path "$config"
        done
        
        echo "🌳 ESTRUCTURA DEL PROYECTO:"
        tree -I 'node_modules|.next|.git|coverage|dist|build' -L 3 2>/dev/null || {
            find . -type d \( -name "node_modules" -o -name ".next" -o -name ".git" \) -prune -o -type d -print | head -30
        }
        ;;
        
    "pages"|"2")
        # SECCIÓN 2: PÁGINAS
        add_separator "📄 PÁGINAS DE LA APLICACIÓN"
        
        if [[ -d "pages" ]]; then
            echo "🌳 ESTRUCTURA DE PÁGINAS:"
            tree pages -I 'node_modules' 2>/dev/null || find pages -type f | head -20
            echo -e "\n"
            
            find pages -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
                if ! should_exclude_file "$file"; then
                    add_file_with_path "$file"
                fi
            done
        fi
        
        if [[ -d "app" ]]; then
            echo "🌳 ESTRUCTURA APP ROUTER:"
            tree app -I 'node_modules' 2>/dev/null || find app -type f | head -20
            echo -e "\n"
            
            find app -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
                if ! should_exclude_file "$file"; then
                    add_file_with_path "$file"
                fi
            done
        fi
        ;;
        
    "components"|"3")
        # SECCIÓN 3: COMPONENTES
        add_separator "🧩 COMPONENTES DE LA APLICACIÓN"
        
        if [[ -d "components" ]]; then
            echo "🌳 ESTRUCTURA DE COMPONENTES:"
            tree components -I 'node_modules' 2>/dev/null || find components -type f | head -20
            echo -e "\n"
            
            find components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
                if ! should_exclude_file "$file"; then
                    add_file_with_path "$file"
                fi
            done
        fi
        ;;
        
    "src"|"4")
        # SECCIÓN 4: CÓDIGO FUENTE (src/)
        add_separator "📦 CÓDIGO FUENTE (src/)"
        
        if [[ -d "src" ]]; then
            echo "🌳 ESTRUCTURA DE SRC:"
            tree src -I 'node_modules' -L 3 2>/dev/null || find src -type f | head -30
            echo -e "\n"
            
            find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
                if ! should_exclude_file "$file"; then
                    add_file_with_path "$file"
                fi
            done
        fi
        ;;
        
    "utils"|"5")
        # SECCIÓN 5: UTILIDADES Y HELPERS
        add_separator "🔧 UTILIDADES Y HELPERS"
        
        dirs=("lib" "utils" "helpers" "hooks" "context" "providers" "types" "interfaces")
        
        for dir in "${dirs[@]}"; do
            if [[ -d "$dir" ]]; then
                echo "📂 DIRECTORIO: $dir"
                echo "------------------------------------------------------------------------------------"
                tree "$dir" -I 'node_modules' 2>/dev/null || find "$dir" -type f | head -10
                echo -e "\n"
                
                find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) | while read -r file; do
                    if ! should_exclude_file "$file"; then
                        add_file_with_path "$file"
                    fi
                done
            fi
        done
        ;;
        
    "auth"|"6")
        # SECCIÓN 6: AUTENTICACIÓN
        add_separator "🔐 CONFIGURACIÓN DE AUTENTICACIÓN"
        
        find . -name "*auth*" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" \) | while read -r file; do
            if ! should_exclude_file "$file"; then
                add_file_with_path "$file"
            fi
        done
        ;;
        
    "styles"|"7")
        # SECCIÓN 7: ESTILOS
        add_separator "🎨 ARCHIVOS DE ESTILOS"
        
        add_file_with_path "styles/globals.css"
        add_file_with_path "styles/globals.scss"
        add_file_with_path "app/globals.css"
        
        if [[ -d "styles" ]]; then
            find styles -type f \( -name "*.css" -o -name "*.scss" -o -name "*.sass" \) | while read -r file; do
                add_file_with_path "$file"
            done
        fi
        ;;
        
    "database"|"8")
        # SECCIÓN 8: BASE DE DATOS
        add_separator "🗄️ CONFIGURACIÓN DE BASE DE DATOS"
        
        dirs=("models" "schemas" "database" "db" "prisma")
        
        for dir in "${dirs[@]}"; do
            if [[ -d "$dir" ]]; then
                echo "📂 DIRECTORIO: $dir"
                find "$dir" -type f | while read -r file; do
                    if ! should_exclude_file "$file"; then
                        add_file_with_path "$file"
                    fi
                done
            fi
        done
        ;;
        
    *)
        echo "📋 USO: ./analyze_sections.sh [seccion]"
        echo ""
        echo "SECCIONES DISPONIBLES:"
        echo "  1 o config     - Configuración del proyecto"
        echo "  2 o pages      - Páginas de la aplicación"
        echo "  3 o components - Componentes"
        echo "  4 o src        - Código fuente (src/)"
        echo "  5 o utils      - Utilidades y helpers"
        echo "  6 o auth       - Autenticación"
        echo "  7 o styles     - Estilos"
        echo "  8 o database   - Base de datos"
        echo ""
        echo "EJEMPLO:"
        echo "  ./analyze_sections.sh config > seccion1_config.txt"
        echo "  ./analyze_sections.sh pages > seccion2_pages.txt"
        echo "  ./analyze_sections.sh components > seccion3_components.txt"
        ;;
esac
