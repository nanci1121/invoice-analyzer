@echo off
REM Script de inicio rápido para Invoice Analyzer - Windows

echo.
echo 🚀 Invoice Analyzer - Inicio Rápido
echo ====================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    echo 📖 Instala Node.js desde: https://nodejs.org (versión 18+ recomendada)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js: %NODE_VERSION%
echo ✅ npm: %NPM_VERSION%
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error durante npm install
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
    echo.
)

REM Mostrar opciones
echo Selecciona una opción:
echo 1) Ejecutar en desarrollo (Electron + Vite con hot reload)
echo 2) Solo servidor web (http://localhost:5173)
echo 3) Compilar a ejecutable Linux (.AppImage y .deb)
echo 4) Compilar a ejecutable Windows (.exe)
echo 5) Limpiar y reinstalar dependencias
echo 6) Salir
echo.
set /p option="Opción (1-6): "

if "%option%"=="1" (
    echo.
    echo 🚀 Iniciando Electron + Vite...
    echo Presiona Ctrl+C para detener
    echo.
    call npm run dev
) else if "%option%"=="2" (
    echo.
    echo 🌐 Iniciando servidor Vite en http://localhost:5173
    echo Presiona Ctrl+C para detener
    echo.
    call npm run vite
) else if "%option%"=="3" (
    echo.
    echo 📦 Compilando para Linux (.AppImage y .deb)...
    call npm run build:linux
    if errorlevel 1 (
        echo ❌ Error durante la compilación
    ) else (
        echo.
        echo ✅ Compilación completada
        echo 📁 Archivos en: ./dist-electron/
        dir dist-electron\
    )
) else if "%option%"=="4" (
    echo.
    echo 📦 Compilando para Windows (.exe)...
    call npm run build:win
    if errorlevel 1 (
        echo ❌ Error durante la compilación
    ) else (
        echo.
        echo ✅ Compilación completada
        echo 📁 Archivo en: ./dist-electron/
        dir dist-electron\*.exe 2>nul || echo Archivo .exe no encontrado
    )
) else if "%option%"=="5" (
    echo.
    echo 🧹 Limpiando...
    if exist node_modules rmdir /s /q node_modules
    if exist dist rmdir /s /q dist
    if exist dist-electron rmdir /s /q dist-electron
    echo ✅ Carpetas limpias
    echo.
    echo 📦 Reinstalando dependencias...
    call npm install
    if errorlevel 1 (
        echo ❌ Error durante npm install
    ) else (
        echo ✅ Dependencias reinstaladas
    )
) else if "%option%"=="6" (
    echo 👋 ¡Hasta luego!
    exit /b 0
) else (
    echo ❌ Opción inválida
    exit /b 1
)

pause
