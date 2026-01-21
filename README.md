# Invoice Analyzer

Analizador de facturas con KPIs y gráficas interactivas. Aplicación de escritorio multiplataforma.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (Electron + Vite)
npm run dev

# Compilar
npm run build:linux   # Linux (.AppImage, .deb)
npm run build:win     # Windows (.exe)
```

## 📖 Documentación

- **[INSTALACION.md](docs/INSTALACION.md)** - Guía paso a paso para Debian 13 y Windows 11
- **[README.md](docs/README.md)** - Documentación técnica y arquitectura
- **[GUIA_RAPIDA.md](docs/GUIA_RAPIDA.md)** - Referencia rápida

## ✨ Características

- ✅ Dashboard con KPIs (gasto total, promedio mensual, cantidad de facturas)
- ✅ Gráficas interactivas (línea, barra, pie chart)
- ✅ CRUD de facturas (agregar, editar, eliminar, listar)
- ✅ Filtros por proveedor y año
- ✅ Dark/Light mode
- ✅ Base de datos SQLite local (persistencia offline)
- ✅ Responsive design
- ✅ Modo web (navegador) + Electron (escritorio)

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Desktop:** Electron 28
- **Gráficas:** Recharts 2
- **Base de Datos:** sql.js (SQLite sin módulos nativos)
- **Estilos:** Tailwind CSS 3

## 📦 Scripts

```bash
npm run dev              # Desarrollo completo (Electron + Vite)
npm run vite             # Solo servidor web (localhost:5173)
npm run electron         # Solo Electron
npm run build            # Build de React
npm run build:linux      # Compilar para Linux
npm run build:win        # Compilar para Windows
npm run build:all        # Todas las plataformas
```

## 💾 Persistencia de Datos

Los datos se guardan automáticamente en:
- **Debian:** `~/.invoice-analyzer/invoices.db`
- **Windows:** `%APPDATA%\Invoice Analyzer\invoices.db`

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -am 'Agrega nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir

---

**Versión:** 1.0.0  
**Última actualización:** 21 de enero de 2026
