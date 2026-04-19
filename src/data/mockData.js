export const mockData = {
  resumen: {
    saldoTotal: 5430250,
    saldoInicial: 4800000,
    flujoNetoPeriodo: 630250,
    ingresosMensuales: 2020000,
    egresosMensuales: 1389750,
  },

  sociedades: [
    {
      id: 1,
      nombre: 'Inmobiliaria Alpha S.A.',
      saldoInicial: 1200000,
      ingresos: 450000,
      egresos: 210000,
      flujoNeto: 240000,
      proyeccion: 1440000,
      variacion: 5.2,
    },
    {
      id: 2,
      nombre: 'Constructora Beta Ltda.',
      saldoInicial: 850000,
      ingresos: 320000,
      egresos: 350000,
      flujoNeto: -30000,
      proyeccion: 820000,
      variacion: -18.0,
    },
    {
      id: 3,
      nombre: 'Inversiones Gamma SpA',
      saldoInicial: 2100000,
      ingresos: 890000,
      egresos: 420000,
      flujoNeto: 470000,
      proyeccion: 2570000,
      variacion: 40.4,
    },
    {
      id: 4,
      nombre: 'Constructora Delta',
      saldoInicial: 650000,
      ingresos: 150000,
      egresos: 180000,
      flujoNeto: -30000,
      proyeccion: 620000,
      variacion: -5.0,
    },
    {
      id: 5,
      nombre: 'Propiedades Epsilon',
      saldoInicial: 630250,
      ingresos: 210000,
      egresos: 95000,
      flujoNeto: 115000,
      proyeccion: 745250,
      variacion: 8.2,
    },
  ],

  tendenciaBalance: [
    { mes: 'May', valor: 4500000 },
    { mes: 'Jun', valor: 4600000 },
    { mes: 'Jul', valor: 4550000 },
    { mes: 'Ago', valor: 4700000 },
    { mes: 'Sep', valor: 5000000 },
    { mes: 'Oct', valor: 5430250 },
  ],

  entradasSalidas: [
    { mes: 'Ene', ingresos: 150000, egresos: 100000 },
    { mes: 'Feb', ingresos: 180000, egresos: 120000 },
    { mes: 'Mar', ingresos: 200000, egresos: 150000 },
    { mes: 'Abr', ingresos: 210000, egresos: 160000 },
    { mes: 'May', ingresos: 190000, egresos: 140000 },
    { mes: 'Jun', ingresos: 210000, egresos: 155000 },
  ],

  categoriasIngresos: [
    { nombre: 'Arriendos', porcentaje: 45 },
    { nombre: 'Ventas Directas', porcentaje: 30 },
    { nombre: 'Intereses', porcentaje: 15 },
    { nombre: 'Otros', porcentaje: 10 },
  ],

  transacciones: [
    {
      id: 1,
      fecha: '2024-10-24',
      descripcion: 'Pago Proveedor Aceros S.A.',
      categoria: 'Egresos Op.',
      monto: -4500,
      tipo: 'egreso',
    },
    {
      id: 2,
      fecha: '2024-10-24',
      descripcion: 'Venta Depto 402 - Reserva',
      categoria: 'Ingresos Ventas',
      monto: 12500,
      tipo: 'ingreso',
    },
    {
      id: 3,
      fecha: '2024-10-23',
      descripcion: 'Servicios Básicos Septiembre',
      categoria: 'Gastos Admin.',
      monto: -850.5,
      tipo: 'egreso',
    },
    {
      id: 4,
      fecha: '2024-10-22',
      descripcion: 'Intereses Bancarios Cuenta Corriente',
      categoria: 'Financiero',
      monto: 120,
      tipo: 'ingreso',
    },
  ],
};

export const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: '🏠' },
  { id: 'flujo-caja', label: 'Flujo de Caja', icon: '📊' },
  { id: 'analizar-excel', label: 'Analizar Excel', icon: '📄' },
  { id: 'sociedades', label: 'Sociedades', icon: '🏢' },
];