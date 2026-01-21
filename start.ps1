# Script de inicio rápido para Invoice Analyzer - Windows PowerShell

Write-Host ""
Write-Host "🚀 Invoice Analyzer - Inicio Rápido" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
} catch {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "📖 Instala Node.js desde: https://nodejs.org (versión 18+ recomendada)" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
Write-Host ""

# Verificar si node_modules existe
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error durante npm install" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
    Write-Host ""
}

# Mostrar opciones
Write-Host "Selecciona una opción:" -ForegroundColor Cyan
Write-Host "1) Ejecutar en desarrollo (Electron + Vite con hot reload)"
Write-Host "2) Solo servidor web (http://localhost:5173)"
Write-Host "3) Compilar a ejecutable Linux (.AppImage y .deb)"
Write-Host "4) Compilar a ejecutable Windows (.exe)"
Write-Host "5) Limpiar y reinstalar dependencias"
Write-Host "6) Salir"
Write-Host ""
$option = Read-Host "Opción (1-6)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Iniciando Electron + Vite..." -ForegroundColor Yellow
        Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "2" {
        Write-Host ""
        Write-Host "🌐 Iniciando servidor Vite en http://localhost:5173" -ForegroundColor Yellow
        Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
        Write-Host ""
        npm run vite
    }
    "3" {
        Write-Host ""
        Write-Host "📦 Compilando para Linux (.AppImage y .deb)..." -ForegroundColor Yellow
        npm run build:linux
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Compilación completada" -ForegroundColor Green
            Write-Host "📁 Archivos en: ./dist-electron/" -ForegroundColor Yellow
            Get-ChildItem -Path "dist-electron\" -Force
        } else {
            Write-Host "❌ Error durante la compilación" -ForegroundColor Red
        }
    }
    "4" {
        Write-Host ""
        Write-Host "📦 Compilando para Windows (.exe)..." -ForegroundColor Yellow
        npm run build:win
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Compilación completada" -ForegroundColor Green
            Write-Host "📁 Archivo en: ./dist-electron/" -ForegroundColor Yellow
            $exeFile = Get-ChildItem -Path "dist-electron\*.exe" -ErrorAction SilentlyContinue
            if ($exeFile) {
                Get-ChildItem -Path "dist-electron\*.exe"
            } else {
                Write-Host "Archivo .exe no encontrado" -ForegroundColor Yellow
            }
        } else {
            Write-Host "❌ Error durante la compilación" -ForegroundColor Red
        }
    }
    "5" {
        Write-Host ""
        Write-Host "🧹 Limpiando..." -ForegroundColor Yellow
        if (Test-Path "node_modules") {
            Remove-Item -Recurse -Force "node_modules"
        }
        if (Test-Path "dist") {
            Remove-Item -Recurse -Force "dist"
        }
        if (Test-Path "dist-electron") {
            Remove-Item -Recurse -Force "dist-electron"
        }
        Write-Host "✅ Carpetas limpias" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Reinstalando dependencias..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencias reinstaladas" -ForegroundColor Green
        } else {
            Write-Host "❌ Error durante npm install" -ForegroundColor Red
        }
    }
    "6" {
        Write-Host "👋 ¡Hasta luego!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "❌ Opción inválida" -ForegroundColor Red
        exit 1
    }
}

Read-Host "Presiona Enter para salir"
