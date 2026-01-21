# 🚀 Guía de Instalación - Invoice Analyzer Electron
## Para Debian 13

---

## 📋 Prerrequisitos

### 1. Instalar Node.js 20.x

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar curl si no lo tienes
sudo apt install curl -y

# Instalar Node.js 20.x desde NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node -v   # Debe mostrar v20.x.x
npm -v    # Debe mostrar 10.x.x
```

### 2. Instalar dependencias de build (para better-sqlite3)

```bash
sudo apt install -y build-essential python3 python3-pip
```

---

## 🏗️ Instalación del Proyecto

### Paso 1: Ejecutar el Script de Instalación

Guarda el primer artifact (Script de Instalación) como `install.sh`:

```bash
# Crear archivo
nano install.sh

# Pegar el contenido del script
# Guardar con Ctrl+O, salir con Ctrl+X

# Dar permisos de ejecución
chmod +x install.sh

# Ejecutar
./install.sh
```

### Paso 2: Instalar Dependencias

```bash
cd invoice-analyzer-electron
npm install
```

**Nota:** La instalación puede tardar 5-10 minutos, especialmente `better-sqlite3` que se compila nativamente.

### Paso 3: Copiar el Código de React

Copia el contenido del segundo artifact (`App.jsx - Versión Electron`) en:

```bash
nano src/App.jsx
```

Pega todo el contenido y guarda.

---

## ▶️ Ejecutar la Aplicación

### Modo Desarrollo (con hot reload)

```bash
npm run dev
```

Esto abrirá la aplicación Electron automáticamente. Verás:
- Una ventana de Electron con tu app
- DevTools abiertos para debugging
- Hot reload: los cambios se reflejan automáticamente

### Ver en el Navegador (opcional)

Si quieres ver solo la interfaz sin Electron:

```bash
npm run vite
```

Luego abre `http://localhost:5173` en tu navegador.

---

## 📦 Compilar la Aplicación

### Para Linux (.AppImage y .deb)

```bash
npm run build:linux
```

**Resultado:** En `dist-electron/` encontrarás:
- `Invoice Analyzer-1.0.0.AppImage` (portable)
- `invoice-analyzer_1.0.0_amd64.deb` (instalable)

### Para Windows (.exe) - Cross-compilation

```bash
npm run build:win
```

**Nota:** Necesitas Wine instalado:

```bash
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install wine wine32 wine64 -y
```

### Para Todas las Plataformas

```bash
npm run build:all
```

---

## 🗂️ Estructura del Proyecto

```
invoice-analyzer-electron/
├── electron/
│   ├── main.js              # Proceso principal Electron
│   └── preload.js           # Preload script
├── src/
│   ├── App.jsx              # Componente React principal
│   ├── main.jsx             # Entry point React
│   └── index.css            # Estilos globales
├── public/                  # Assets estáticos
├── dist/                    # Build de React (generado)
├── dist-electron/           # Ejecutables (generados)
├── package.json             # Configuración del proyecto
├── vite.config.js           # Config de Vite
├── tailwind.config.js       # Config de Tailwind
└── README.md                # Documentación
```

---

## 🔧 Verificar que Todo Funciona

### Test 1: Verificar Node.js y npm

```bash
node -v    # v20.x.x
npm -v     # 10.x.x
```

### Test 2: Verificar Dependencias

```bash
cd invoice-analyzer-electron
npm list
```

No debe haber errores críticos.

### Test 3: Ejecutar en Desarrollo

```bash
npm run dev
```

Debe abrir la ventana de Electron con la app funcionando.

### Test 4: Probar Funcionalidades

1. ✅ Agregar una factura manualmente
2. ✅ Ver gráficas actualizadas
3. ✅ Filtrar por proveedor
4. ✅ Cambiar modo oscuro/claro
5. ✅ Eliminar una factura
6. ✅ Ver la tabla de facturas

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'better-sqlite3'"

```bash
cd invoice-analyzer-electron
npm rebuild better-sqlite3
```

### Error: "Python not found"

```bash
sudo apt install python3 python3-pip -y
```

### Error al compilar better-sqlite3

```bash
sudo apt install build-essential -y
npm rebuild better-sqlite3 --build-from-source
```

### La ventana de Electron no se abre

```bash
# Verificar que Vite está corriendo
npm run vite

# En otra terminal:
npm run electron
```

### Error: "ENOSPC: System limit for number of file watchers"

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 🎨 Personalización

### Cambiar el icono de la aplicación

1. Crea un PNG de 512x512px
2. Guárdalo en `public/icon.png`
3. Recompila: `npm run build:linux`

### Modificar la base de datos SQLite

La base de datos se crea automáticamente en:

```
~/.config/invoice-analyzer/invoices.db
```

Puedes abrirla con:

```bash
sudo apt install sqlite3 -y
sqlite3 ~/.config/invoice-analyzer/invoices.db
```

---

## 🚀 Próximos Pasos

### 1. Agregar Procesamiento de PDFs

Instalar librerías adicionales:

```bash
npm install pdf-parse pdf-lib
```

### 2. Integrar Ollama

```bash
# Instalar Ollama en Debian
curl https://ollama.ai/install.sh | sh

# Descargar modelo
ollama pull llama2

# La app ya tiene el checkbox para activarlo
```

### 3. Exportar a Excel

```bash
npm install xlsx
```

---

## 📚 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Modo desarrollo con hot reload
npm run vite             # Solo servidor Vite
npm run electron         # Solo Electron

# Build
npm run build            # Build de React
npm run build:linux      # Compilar para Linux
npm run build:win        # Compilar para Windows
npm run build:all        # Compilar todo

# Limpieza
rm -rf node_modules dist dist-electron
npm install              # Reinstalar todo
```

---

## ✅ Checklist de Instalación

- [ ] Node.js 20.x instalado
- [ ] Dependencias de build instaladas
- [ ] Script ejecutado correctamente
- [ ] `npm install` completado sin errores
- [ ] `App.jsx` copiado en `src/`
- [ ] `npm run dev` ejecuta sin problemas
- [ ] La interfaz se muestra correctamente
- [ ] Puedes agregar/eliminar facturas
- [ ] Las gráficas se muestran
- [ ] SQLite guarda los datos

---

## 🎉 ¡Listo!

Tu aplicación de análisis de facturas está lista para usar en Debian 13.

**Siguiente paso:** Prueba agregar algunas facturas y explora las funcionalidades.

Para soporte o mejoras, contacta al desarrollador o revisa la documentación en el README.md del proyecto.