# Invoice Analyzer - Guía de Instalación

Analizador de facturas con KPIs y gráficas interactivas. Funciona en Debian, Windows 11 y como aplicación web.

---

## 📋 Tabla de Contenidos

- [Requisitos Generales](#requisitos-generales)
- [Instalación en Debian 13](#instalación-en-debian-13)
- [Instalación en Windows 11](#instalación-en-windows-11)
- [Ejecución del Proyecto](#ejecución-del-proyecto)
- [Compilación a Ejecutable](#compilación-a-ejecutable)
- [Solución de Problemas](#solución-de-problemas)

---

## 🔧 Requisitos Generales

### Obligatorio
- **Node.js 18+** (recomendado 20.x LTS)
- **npm 9+**
- **Git** (opcional, para clonar el repositorio)

### Verificar instalación
```bash
node -v    # Debe mostrar v18.x.x o superior
npm -v     # Debe mostrar 9.x.x o superior
```

---

## 🐧 Instalación en Debian 13

### Paso 1: Actualizar Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### Paso 2: Instalar Node.js 20.x

```bash
# Agregar repositorio de NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt-get install -y nodejs

# Verificar instalación
node -v
npm -v
```

### Paso 3: Clonar o Descargar el Proyecto

**Opción A: Con Git**
```bash
git clone <URL_DEL_REPOSITORIO>
cd invoice-analyzer-electron
```

**Opción B: Descargar archivo ZIP**
```bash
unzip invoice-analyzer-electron.zip
cd invoice-analyzer-electron
```

### Paso 4: Instalar Dependencias

```bash
npm install
```

*(Esto tarda 1-2 minutos la primera vez)*

### Paso 5: Ejecutar en Desarrollo

```bash
npm run dev
```

Se abrirá la ventana de Electron automáticamente con la aplicación.

### Paso 6: Compilar a Ejecutable (Opcional)

#### Crear .AppImage (Portable)
```bash
npm run build:linux
```

El archivo estará en `dist-electron/`:
- `Invoice Analyzer-1.0.0.AppImage` → Ejecutable portable

#### Crear .deb (Instalador)
```bash
npm run build:linux
```

Encontrarás `invoice-analyzer_1.0.0_amd64.deb`

Para instalar el .deb:
```bash
sudo dpkg -i invoice-analyzer_1.0.0_amd64.deb
```

Luego ejecuta desde el menú de aplicaciones o:
```bash
invoice-analyzer
```

---

## 🪟 Instalación en Windows 11

### Paso 1: Instalar Node.js

1. Ve a [nodejs.org](https://nodejs.org)
2. Descarga la versión **LTS 20.x** (recomendada)
3. Ejecuta el instalador y sigue los pasos por defecto
4. Marca la opción **"Add to PATH"** (importante)
5. Reinicia tu computadora

### Paso 2: Verificar Instalación

Abre **PowerShell** o **Símbolo del Sistema** y ejecuta:

```powershell
node -v
npm -v
```

Ambos deben mostrar versiones (ej: v20.x.x y 10.x.x)

### Paso 3: Descargar el Proyecto

1. Descarga el archivo ZIP del proyecto
2. Extrae en una carpeta, ej: `C:\Users\TuUsuario\Documents\invoice-analyzer`
3. Abre **PowerShell** en esa carpeta (clic derecho → "Open PowerShell here")

### Paso 4: Instalar Dependencias

```powershell
npm install
```

### Paso 5: Ejecutar en Desarrollo

```powershell
npm run dev
```

Se abrirá automáticamente la ventana de Electron.

### Paso 6: Compilar a Ejecutable (Opcional)

#### Crear .exe Instalador
```powershell
npm run build:win
```

El archivo estará en `dist-electron/`:
- `Invoice Analyzer Setup 1.0.0.exe` → Instalador ejecutable

**Nota:** La primera compilación tarda 5-10 minutos.

#### Instalar en Windows
1. Ejecuta `Invoice Analyzer Setup 1.0.0.exe`
2. Sigue el asistente de instalación
3. La aplicación se instalará en `C:\Program Files\Invoice Analyzer`
4. Crea un acceso directo en el escritorio

---

## ▶️ Ejecución del Proyecto

### Modo Desarrollo (Hot Reload)
```bash
npm run dev
```
- Abre ventana Electron automáticamente
- Los cambios se reflejan en tiempo real
- DevTools abierto para debugging

### Solo Servidor Web (Sin Electron)
```bash
npm run vite
```

Luego abre en navegador: `http://localhost:5173`

### Solo Electron (RequiereVite corriendo)
```bash
npm run electron
```

*(Requiere que en otra terminal ejecutes `npm run vite` primero)*

---

## 📦 Compilación a Ejecutable

### Linux

```bash
# AppImage (portable, sin instalación)
npm run build:linux

# Genera:
# - dist-electron/Invoice Analyzer-1.0.0.AppImage
# - dist-electron/invoice-analyzer_1.0.0_amd64.deb
```

### Windows

```powershell
npm run build:win

# Genera:
# - dist-electron/Invoice Analyzer Setup 1.0.0.exe
```

### macOS (desde macOS)

```bash
npm run build:all
```

### Todas las Plataformas

```bash
npm run build:all
```

*(Genera .exe, .AppImage, .deb, .dmg)*

---

## 💾 Ubicación de Base de Datos

Los datos se guardan en la carpeta del usuario del sistema operativo:

### Debian
```
~/.invoice-analyzer/invoices.db
```

### Windows
```
C:\Users\TuUsuario\AppData\Local\Invoice Analyzer\invoices.db
```

Para acceder a la BD:
- **Debian:** Abre un explorador de archivos y ve a `Home → .invoice-analyzer`
- **Windows:** Presiona `Win + R`, escribe `%APPDATA%` y navega a `Invoice Analyzer`

---

## 🐛 Solución de Problemas

### Error: "npm: command not found"

**Debian:**
```bash
sudo apt install -y nodejs npm
```

**Windows:** Reinstala Node.js y marca "Add to PATH" durante la instalación.

---

### Error: "EACCES: permission denied"

**Debian:**
```bash
# Opción 1: Cambiar permisos
sudo chown -R $USER ~/.npm

# Opción 2: Usar sudo (no recomendado)
sudo npm install
```

---

### Electron no abre (ventana negra o crash)

**Debian:**
```bash
# Instalar dependencias gráficas mínimas
sudo apt install -y libgtk-3-0t64 libxss1 libnss3 libxcb-dri3-0

# Reintentar
npm run dev
```

**Windows:** Desinstala y reinstala Node.js completamente.

---

### Puerto 5173 en uso

Si Vite dice que el puerto está ocupado:

**Debian/macOS:**
```bash
# Encontrar qué proceso usa el puerto
lsof -i :5173

# Matar el proceso
kill -9 <PID>
```

**Windows (PowerShell):**
```powershell
# Encontrar proceso
netstat -ano | findstr :5173

# Matar proceso
taskkill /PID <PID> /F
```

---

### Base de datos corrupta

Si los datos no se guardan o la app crashea:

**Debian:**
```bash
rm ~/.invoice-analyzer/invoices.db
npm run dev
```

**Windows:**
```powershell
rm C:\Users\TuUsuario\AppData\Local\Invoice Analyzer\invoices.db
npm run dev
```

---

## 📱 Funcionalidades

- ✅ **Dashboard** con KPIs: gasto total, promedio mensual, cantidad de facturas
- ✅ **Gráficas Interactivas**: línea, barra, pie chart
- ✅ **CRUD de Facturas**: agregar, editar, eliminar, listar
- ✅ **Filtros**: por proveedor y año
- ✅ **Dark/Light Mode**: tema oscuro por defecto
- ✅ **Persistencia Local**: SQLite en el dispositivo
- ✅ **Modo Web**: funciona también en navegador (con localStorage)
- ✅ **Responsive**: adaptable a cualquier pantalla

---

## 🎨 Personalización

### Cambiar Icono

1. Crea/descarga una imagen PNG de 512x512px
2. Guárdala en `public/icon.png`
3. Recompila: `npm run build:linux` o `npm run build:win`

### Cambiar Nombre de Aplicación

Edita `package.json`:

```json
{
  "name": "mi-app",
  "productName": "Mi Analizador"
}
```

### Cambiar Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color'
    }
  }
}
```

---

## 🚀 Comandos Útiles

```bash
# Instalación
npm install                    # Instalar dependencias

# Desarrollo
npm run dev                    # Modo desarrollo completo
npm run vite                   # Solo servidor web
npm run electron               # Solo Electron

# Compilación
npm run build                  # Build web
npm run build:linux            # Compilar para Linux
npm run build:win              # Compilar para Windows
npm run build:all              # Compilar todo

# Limpieza
npm run clean                  # Limpiar build
rm -rf node_modules            # Limpiar dependencias
npm install                    # Reinstalar todo
```

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que Node.js 20+ esté instalado
2. Elimina `node_modules/` e instala de nuevo: `npm install`
3. Borra la carpeta de BD: `~/.invoice-analyzer/` (Debian) o `%APPDATA%\Invoice Analyzer` (Windows)
4. Reinicia tu computadora
5. Reintenta: `npm run dev`

---

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir.

---

**Versión:** 1.0.0  
**Última actualización:** 21 de enero de 2026
