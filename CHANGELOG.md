# Changelog

Todos los cambios notables del proyecto están documentados aquí.

## [Unreleased]

### Planeado
- [ ] Exportación a Excel
- [ ] Importación desde PDF
- [ ] Integración Ollama
- [ ] Sincronización en nube

---

## [1.0.0] - 2026-01-21

### Added
- ✨ Aplicación de escritorio con Electron
- ✨ Dashboard con KPIs y gráficas interactivas
- ✨ CRUD completo de facturas
- ✨ Base de datos SQLite local
- ✨ Filtros por proveedor y año
- ✨ Modo Dark/Light
- ✨ Interfaz responsive
- ✨ Modo web (navegador) + escritorio
- 📚 Documentación completa (Debian + Windows)
- 🔄 GitHub Actions (CI/CD)

### Technical
- React 18 + Vite 5
- Electron 28 con contextIsolation
- sql.js para persistencia sin módulos nativos
- Tailwind CSS 3
- Recharts para gráficas
- lucide-react para iconografía

### Security
- ✅ contextIsolation habilitado
- ✅ nodeIntegration deshabilitado
- ✅ IPC seguro con preload script
- ✅ Validación de datos

---

## Formato

El versionado sigue [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles (1.0.0 → 2.0.0)
- **MINOR**: Nuevas características compatibles (1.0.0 → 1.1.0)
- **PATCH**: Correcciones de bugs (1.0.0 → 1.0.1)

---

## Cómo Reportar Cambios

Cuando hagas un PR, describe:
1. ¿Qué cambió?
2. ¿Por qué cambió?
3. ¿Es un breaking change?

La entrada en el CHANGELOG se agregará antes de hacer release.

---

**Última actualización:** 21 de enero de 2026
