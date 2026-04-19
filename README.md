# GestiónInmo - Sistema de Flujo de Caja

Aplicación responsiva para gestión inmobiliaria y control de flujo de caja.

## 📋 Características

- ✅ Dashboard interactivo con KPIs
- ✅ Filtros por sociedad
- ✅ Tabla de resumen consolidado
- ✅ Gráficos de tendencia
- ✅ Listado de transacciones
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Sin Tailwind (CSS personalizado)

## 🚀 Inicio Rápido

### Requisitos
- Node.js 16+
- npm o pnpm

### Instalación

1. **Clonar o descargar proyecto**
```bash
cd gestion-inmobiliaria
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Header.jsx           # Encabezado con filtros
│   ├── Sidebar.jsx          # Navegación lateral
│   ├── Dashboard.jsx        # Panel principal
│   ├── KPICard.jsx         # Tarjetas de métricas
│   ├── header.css
│   ├── sidebar.css
│   ├── dashboard.css
│   └── kpi-card.css
├── data/
│   └── mockData.js         # Datos de prueba
├── styles/
│   ├── global.css          # Estilos globales
│   ├── colors.css          # Variables de color
│   └── responsive.css      # Media queries
├── App.jsx                 # Componente principal
├── app.css
└── main.jsx               # Entry point
```

## 🎨 Personalización de Colores

Edita `src/styles/colors.css`:
```css
:root {
  --primary: #2B7FE0;        /* Azul principal */
  --success: #10B981;        /* Verde (ingresos) */
  --danger: #EF4444;         /* Rojo (egresos) */
  /* ... más colores */
}
```

## 📱 Responsive

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Desarrollo

### Agregar Datos

Edita `src/data/mockData.js` para cambiar datos de prueba.

### Crear Componentes

Ejemplo:
```jsx
// src/components/MiComponente.jsx
export default function MiComponente() {
  return <div>Contenido</div>;
}
```

## 📦 Build para Producción

```bash
npm run build
```

Genera carpeta `dist/` lista para Netlify.

## 🌐 Desplegar en Netlify

1. **Conectar GitHub**
   - Push del proyecto a GitHub

2. **Configurar Netlify**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Deploy**
   - Netlify automáticamente desplegará

## ✅ Checklist Próximas Fases

- [ ] Integrar gráficos (Chart.js / Recharts)
- [ ] Implementar backend Django
- [ ] Autenticación JWT
- [ ] Upload de archivos Excel
- [ ] API REST
- [ ] Base de datos PostgreSQL
- [ ] Validaciones en formularios

## 📝 Notas

- Frontend solo (sin backend aún)
- Datos mockados en `mockData.js`
- CSS personalizado, sin Tailwind
- Componentes modulares y reutilizables

---

**Versión**: 0.1.0 | **Última actualización**: Oct 2024