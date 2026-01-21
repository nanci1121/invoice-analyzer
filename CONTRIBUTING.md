# Contributing

¡Gracias por tu interés en contribuir a Invoice Analyzer! 

## 🤝 Cómo Contribuir

### 1. Fork el Repositorio
```bash
# En GitHub: Click en "Fork"
git clone https://github.com/TU-USUARIO/invoice-analyzer.git
cd invoice-analyzer
```

### 2. Crea una Rama
```bash
git checkout -b feature/tu-caracteristica
# o para bugs:
git checkout -b bugfix/descripcion-del-bug
```

### 3. Haz tus Cambios
```bash
# Instala dependencias
npm install

# Desarrollo
npm run dev

# Tus cambios aquí...
```

### 4. Commit y Push
```bash
git add .
git commit -m "✨ Agrega: descripción clara del cambio"
git push origin feature/tu-caracteristica
```

### 5. Crea un Pull Request
- Ve a: https://github.com/nanci1121/invoice-analyzer/pulls
- Click en "New Pull Request"
- Compara tu fork con `main`
- Describe tus cambios

---

## 📋 Antes de Hacer un PR

- [ ] El código compila sin errores: `npm run build`
- [ ] Testeaste en desarrollo: `npm run dev`
- [ ] No hay conflictos con `main`
- [ ] Los commits tienen mensajes descriptivos
- [ ] Se incluyen cambios en `/docs` si es necesario

---

## 💡 Ideas de Contribuciones

### Fáciles (Buenas para comenzar)
- 📝 Mejorar documentación
- 🌐 Agregar traducción (es, en, pt)
- 🐛 Reportar y fijar bugs
- 🎨 Mejorar UI/UX

### Intermedias
- ✨ Agregar funcionalidades pequeñas
- 📊 Nuevas gráficas
- 🔧 Optimizaciones
- 📱 Mejor responsive design

### Avanzadas
- 💾 Integración con APIs (Excel, PDF)
- 🤖 Integración Ollama/IA
- ☁️ Sincronización en nube
- 📊 Reportes avanzados

---

## 🐛 Reportar Bugs

1. Ve a: https://github.com/nanci1121/invoice-analyzer/issues
2. Click en "New Issue"
3. Selecciona "Bug report"
4. Describe:
   - ¿Qué esperabas?
   - ¿Qué pasó?
   - Pasos para reproducir
   - SO y versión de Node.js

---

## 💬 Convenciones de Código

### Commits
```
✨ feature: descripción
🐛 fix: descripción
📝 docs: descripción
🎨 style: descripción
♻️ refactor: descripción
⚡ perf: descripción
🧪 test: descripción
```

### Código
- Use `const` y `let`, no `var`
- Siga el estilo de Prettier
- Componentes en PascalCase
- Variables en camelCase
- Archivos en kebab-case

---

## 📚 Stack del Proyecto

- **Frontend:** React 18, Vite 5, Tailwind CSS
- **Desktop:** Electron 28
- **Gráficas:** Recharts
- **DB:** sql.js (SQLite)

---

## 🚀 Tips para Contribuir

1. Empieza por issues etiquetadas `good first issue`
2. Comunica antes de hacer cambios grandes
3. Mantén PRs pequeños y focalizados
4. Escribe código limpio y documentado
5. Sé respetuoso con otros contribuidores

---

## ❓ Preguntas

- **Issues:** Usa GitHub Issues para preguntas
- **Discussions:** Para ideas y debates

---

¡Gracias por tu contribución! 🎉
