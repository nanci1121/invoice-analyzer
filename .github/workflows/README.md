# GitHub Actions Workflows

## 📋 Workflows Configurados

### 1. **CI/CD Pipeline** (`ci-cd.yml`)
Ejecuta automáticamente en cada push/PR a `main` o `develop`

**Tareas:**
- ✅ Test & Lint (Node 18.x y 20.x)
- ✅ Build project
- ✅ Build Linux artifacts (.AppImage, .deb)
- ✅ Build Windows artifacts (.exe)
- ✅ Build macOS artifacts

**Trigger:** `push` y `pull_request`

---

### 2. **Release Build** (`release.yml`)
Se ejecuta automáticamente cuando creas un tag con versión

**Tareas:**
- 📦 Crea Release en GitHub
- 📦 Compila para Linux, Windows, macOS
- 📤 Sube artifacts a la Release

**Trigger:** Crear tag `v*` (ej: `v1.0.0`, `v1.1.0`)

**Cómo usar:**
```bash
# Crear tag y push
git tag v1.0.0
git push origin v1.0.0

# Los artifacts se suben automáticamente a GitHub Releases
```

---

### 3. **Code Quality** (`quality.yml`)
Verifica seguridad y calidad del código

**Tareas:**
- 🔐 Auditoría npm (vulnerabilidades)
- 📊 Verificación de dependencias
- 🔨 Build verification
- 📁 Comprobación de output

**Trigger:** `push` y `pull_request`

---

## 🎯 Flujo de Trabajo Recomendado

### Para desarrollo (push a branch):
```bash
git push origin feature/nueva-caracteristica
# → Se ejecuta: CI/CD Pipeline (test + build)
# → Resultado: Artifacts generados (puedes verlos en Actions)
```

### Para release (crear tag):
```bash
git tag v1.0.0
git push origin v1.0.0
# → Se ejecuta: Release Build
# → Resultado: GitHub Release con downloadables
# → URLs: https://github.com/nanci1121/invoice-analyzer/releases
```

### Para PRs:
```bash
# GitHub Actions corre automáticamente
# PR debe pasar todos los checks antes de mergear
```

---

## 📊 Ver Estado de los Workflows

Accede a: **https://github.com/nanci1121/invoice-analyzer/actions**

Verás:
- ✅ Builds exitosos
- ❌ Builds fallidos
- ⏳ Builds en progreso
- Logs detallados de cada paso

---

## 🔧 Configuración Adicional Opcional

### Branch Protection Rules
En Settings → Branches → Add rule:
```
- Require status checks to pass before merging
  ✅ test / test (18.x)
  ✅ test / test (20.x)
  ✅ build-linux
  ✅ build-windows
```

### Secrets (si agregas más adelante)
Settings → Secrets → New repository secret

---

## 📝 Variables de Entorno Disponibles

Todos los workflows tienen acceso a:
- `${{ github.token }}` - Token automático
- `${{ github.ref }}` - Rama/tag actual
- `${{ github.sha }}` - Commit hash
- `${{ runner.os }}` - Sistema operativo (ubuntu, windows, macos)

---

## 🚀 Próximas Mejoras

Puedes agregar:
- ✨ Notificaciones Slack/Discord
- ✨ Coverage de tests
- ✨ Deploy automático
- ✨ Changelog automático
- ✨ Versioning automático (semver)

---

**¿Necesitas ajustar algo de los workflows?**
