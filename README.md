# FlujosCash - Gestión Inmobiliaria

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

Abre http://localhost:5173

### 3. Build para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── BalanceChart.jsx
│   ├── SociedadesTable.jsx
│   ├── dashboard.css
│   ├── header.css
│   ├── sidebar.css
│   ├── chart.css
│   ├── table.css
│
├── data/
│   └── mockData.js
│
├── styles/
│   ├── colors.css
│   ├── global.css
│   ├── responsive.css
│
├── App.jsx
├── app.css
└── main.jsx
```

## ✨ Características

✅ Dashboard con KPIs  
✅ Gráfico de tendencia (Recharts)  
✅ Tabla resumen por sociedad  
✅ Accesos directos  
✅ Responsive (mobile, tablet, desktop)  
✅ Sin Tailwind (CSS personalizado)  

## 📱 Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌐 Desplegar en Netlify

1. Push a GitHub
2. Conectar repo en Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

¡Listo!