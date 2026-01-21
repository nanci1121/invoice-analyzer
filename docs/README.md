# Invoice Analyzer - Documentación Técnica

## 🏗️ Arquitectura del Proyecto

```
invoice-analyzer-electron/
├── electron/                  # Proceso principal de Electron
│   ├── main.js               # Punto de entrada Electron
│   ├── preload.js            # Puente seguro (contextBridge)
│   └── db.js                 # Capa de BD con sql.js
├── src/                      # Código React
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Entry point React
│   └── index.css             # Estilos globales
├── public/                   # Assets estáticos
│   └── icon.png             # Icono de la app
├── index.html               # Plantilla HTML Vite
├── package.json             # Dependencias
├── vite.config.js           # Config Vite
├── tailwind.config.js       # Config Tailwind CSS
├── postcss.config.js        # Config PostCSS
└── README.md                # Este archivo
```

---

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────┐
│      Interfaz React (Renderer)      │
│  - Dashboard, gráficas, tablas      │
│  - Gestión de estado con useState   │
└──────────────┬──────────────────────┘
               │
               │ IPC (contextBridge.electronAPI)
               │
┌──────────────▼──────────────────────┐
│  Preload Script (contextIsolation)  │
│  - ipcRenderer.invoke()             │
└──────────────┬──────────────────────┘
               │
               │ IPC Handlers
               │
┌──────────────▼──────────────────────┐
│   Proceso Principal (Main)          │
│  - electron/main.js                 │
│  - Gestiona ventanas                │
│  - Maneja IPC                       │
└──────────────┬──────────────────────┘
               │
               │ Llamadas síncronas
               │
┌──────────────▼──────────────────────┐
│   Base de Datos (electron/db.js)    │
│  - sql.js (SQLite en memoria)       │
│  - Persistencia en archivo          │
│  - Ubicación: ~/.invoice-analyzer/  │
└─────────────────────────────────────┘
```

---

## 📦 Stack Tecnológico

| Capa | Tecnología | Versión | Propósito |
|------|-----------|---------|----------|
| **Desktop** | Electron | 28.x | Empaquetador de app de escritorio |
| **Frontend** | React | 18.x | UI y lógica de componentes |
| **Build** | Vite | 5.x | Bundler rápido con HMR |
| **Estilos** | Tailwind CSS | 3.x | Utilidad CSS |
| **Gráficas** | Recharts | 2.x | Gráficos interactivos |
| **Iconos** | lucide-react | 0.26x | Iconería moderna |
| **DB** | sql.js | 1.x | SQLite en JavaScript/WASM |

---

## 🔐 Seguridad

### Context Isolation
```javascript
// electron/main.js
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,           // ✅ Aislamiento
  nodeIntegration: false            // ✅ Sin Node directo
}
```

### IPC Seguro
```javascript
// electron/preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  getInvoices: () => ipcRenderer.invoke('db:get-invoices'),
  addInvoice: (invoice) => ipcRenderer.invoke('db:add-invoice', invoice),
  deleteInvoice: (id) => ipcRenderer.invoke('db:delete-invoice', id)
});
```

El renderer **no puede acceder a Node.js directamente**, solo a las funciones expuestas.

---

## 🗄️ Base de Datos

### Esquema

```sql
CREATE TABLE invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,              -- Formato: YYYY-MM-DD
  provider TEXT NOT NULL,          -- Ej: "O2", "Endesa"
  amount REAL NOT NULL,            -- Base imponible
  tax REAL NOT NULL,               -- IVA
  concept TEXT,                    -- Descripción
  total REAL NOT NULL,             -- amount + tax
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Ubicación de Archivos

```
Debian:   ~/.invoice-analyzer/invoices.db
Windows:  %APPDATA%\Invoice Analyzer\invoices.db (user-local)
macOS:    ~/Library/Application Support/Invoice Analyzer/invoices.db
```

### Implementación (sql.js)

sql.js es **SQLite compilado a WebAssembly** sin dependencias nativas:

```javascript
// electron/db.js
const initSqlJs = require('sql.js');
const SQL = await initSqlJs();
const db = new SQL.Database();

// Luego persistir a archivo
const data = db.export();
fs.writeFileSync(dbPath, Buffer.from(data));
```

---

## 🎨 Interfaz de Usuario

### Componentes Principales

```
App.jsx
├── Header
│   ├── Logo + Título
│   ├── Dark Mode Toggle
│   └── Botón "Agregar Factura"
├── Navigation Tabs
│   ├── Dashboard
│   ├── Facturas
│   └── Configuración
├── Main Content (según tab activo)
│   ├── Dashboard → KPIs + Gráficas
│   ├── Facturas → Tabla listado
│   └── Config → Importar/Exportar
└── Modal (agregar factura)
```

### Temas

- **Dark Mode (por defecto):** Fondo gris-900, texto claro
- **Light Mode:** Fondo blanco, texto oscuro
- Toggle en header

---

## 📊 Gráficas Implementadas

```javascript
// Recharts components utilizados
1. LineChart    → Evolución mensual de gastos
2. PieChart     → Distribución por proveedor
3. BarChart     → Comparativa mensual
```

Todas son **responsivas** y se adaptan al tamaño de pantalla.

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Vite + Electron (hot reload)
npm run vite             # Solo servidor web (5173)
npm run electron         # Solo Electron (requiere Vite en 5173)

# Build
npm run build            # Bundler React (genera /dist)
npm run build:linux      # Electron builder para Linux
npm run build:win        # Electron builder para Windows
npm run build:all        # Todas las plataformas

# Otros
npm install              # Instalar dependencias
npm audit                # Auditoría de vulnerabilidades
```

---

## 🔧 Configuración Importante

### vite.config.js
```javascript
export default defineConfig({
  plugins: [react()],
  base: './',                    // URLs relativas
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'sql': ['sql.js']      // Chunk separado para sql.js
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      supported: { bigint: true } // Soporte para BigInt (sql.js)
    }
  }
});
```

### tailwind.config.js
```javascript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',            // Toggle con clase 'dark'
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 🔄 Ciclo de Vida de la Aplicación

### Inicio (app.whenReady)
1. Inicializar BD (sql.js)
2. Crear ventana BrowserWindow
3. Cargar URL (dev) o archivo (prod)
4. Registrar handlers IPC

### Cierre (app.on('window-all-closed'))
1. Descartar ventana
2. Salir proceso (Windows/Linux) o mantener para macOS

### Modo Desarrollo
```
npm run dev
  ├─ Vite inicia en localhost:5173
  └─ Electron carga esa URL
     ├─ DevTools abierto automáticamente
     ├─ Hot Module Replacement (HMR) activo
     └─ Cambios en código → recarga automática
```

### Modo Producción
```
npm run build
npm run build:win / npm run build:linux
  ├─ React bundleado en /dist
  ├─ Electron lee /dist/index.html
  └─ Ejecutable final en /dist-electron
```

---

## 🐛 Debugging

### Activar DevTools en Producción
Edita `electron/main.js`:
```javascript
if (isDev) {
  mainWindow.webContents.openDevTools(); // ← Ya activo en dev
}
```

### Console Logs
```javascript
// React (navegador DevTools)
console.log('mensaje');

// Electron (terminal)
console.log('mensaje');  // Aparece en la terminal que ejecutó npm run dev
```

### Ver BD
```bash
# Debian/macOS
sqlite3 ~/.invoice-analyzer/invoices.db

# Dentro de sqlite3
.tables
SELECT * FROM invoices;
```

---

## 📈 Optimizaciones Aplicadas

1. **sql.js**: SQLite sin módulos nativos (compatible con cualquier OS)
2. **Lazy loading**: Componentes cargados solo cuando se necesitan
3. **Recharts**: Gráficas optimizadas con ResponsiveContainer
4. **Tailwind**: Solo CSS utilizado en producción (PurgeCSS)
5. **Chunk splitting**: sql.js en chunk separado
6. **IPC async**: Todas las llamadas a BD son asincrónicas

---

## 🔌 Extensiones Futuras

### Fáciles de agregar
- ✅ Exportar a Excel (xlsx)
- ✅ Importar de PDF (pdf-parse)
- ✅ Integración Ollama (API REST)
- ✅ Sincronización en nube (iCloud/Google Drive)

### Cambios necesarios
```javascript
// Agregar nuevo IPC handler en main.js
ipcMain.handle('exportar:excel', async (event, data) => {
  // Lógica de exportación
});

// Llamar desde React
const datos = await window.electronAPI.exportarExcel(invoices);
```

---

## 📝 Notas de Desarrollo

- **Estado Global**: Se usa `useState` local en App.jsx. Para apps más grandes, migra a Redux/Zustand.
- **Validación**: Se valida en frontend y backend (handlers IPC).
- **Errores**: Usamos try-catch en handlers IPC, mostramos `alert()` en UI.
- **Persistencia**: localStorage como fallback si no hay electronAPI (modo web).

---

## 🎯 Checklist Pre-Release

- [ ] Cambiar versión en `package.json`
- [ ] Actualizar `CHANGELOG.md`
- [ ] Probar en Debian 13 con `npm run build:linux`
- [ ] Probar en Windows 11 con `npm run build:win`
- [ ] Verificar que icono sea 512x512 PNG
- [ ] Hacer build final: `npm run build:all`
- [ ] Firmar ejecutables (Windows/macOS si es necesario)
- [ ] Publicar en GitHub Releases

---

**Versión:** 1.0.0  
**Última actualización:** 21 de enero de 2026
