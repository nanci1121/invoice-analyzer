#!/bin/bash

# Script de inicio rápido para Invoice Analyzer

echo "🚀 Invoice Analyzer - Inicio Rápido"
echo "===================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "📖 Instala Node.js desde: https://nodejs.org (versión 18+ recomendada)"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo ""

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error durante npm install"
        exit 1
    fi
    echo "✅ Dependencias instaladas"
    echo ""
fi

# Mostrar opciones
echo "Selecciona una opción:"
echo "1) Ejecutar en desarrollo (Electron + Vite con hot reload)"
echo "2) Solo servidor web (http://localhost:5173)"
echo "3) Compilar a ejecutable Linux (.AppImage y .deb)"
echo "4) Compilar a ejecutable Windows (.exe)"
echo "5) Limpiar y reinstalar dependencias"
echo "6) Salir"
echo ""
read -p "Opción (1-6): " option

case $option in
    1)
        echo ""
        echo "🚀 Iniciando Electron + Vite..."
        echo "Presiona Ctrl+C para detener"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🌐 Iniciando servidor Vite en http://localhost:5173"
        echo "Presiona Ctrl+C para detener"
        echo ""
        npm run vite
        ;;
    3)
        echo ""
        echo "📦 Compilando para Linux (.AppImage y .deb)..."
        npm run build:linux
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Compilación completada"
            echo "📁 Archivos en: ./dist-electron/"
            ls -lh dist-electron/
        else
            echo "❌ Error durante la compilación"
        fi
        ;;
    4)
        echo ""
        echo "📦 Compilando para Windows (.exe)..."
        npm run build:win
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Compilación completada"
            echo "📁 Archivo en: ./dist-electron/"
            ls -lh dist-electron/*.exe 2>/dev/null || echo "Archivo .exe no encontrado"
        else
            echo "❌ Error durante la compilación"
        fi
        ;;
    5)
        echo ""
        echo "🧹 Limpiando..."
        rm -rf node_modules dist dist-electron
        echo "✅ Carpetas limpias"
        echo ""
        echo "📦 Reinstalando dependencias..."
        npm install
        if [ $? -eq 0 ]; then
            echo "✅ Dependencias reinstaladas"
        else
            echo "❌ Error durante npm install"
        fi
        ;;
    6)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac
