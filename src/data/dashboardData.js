import {
  RESUMEN_MESES,
  INGRESOS_ABRIL,
  EGRESOS_ABRIL,
} from './excelData';

// ── Resumen ABRIL 2026 (mes base) ──
const abr = RESUMEN_MESES[0];

const saldoInicialTotal = abr.saldoInicialAlef + abr.saldoInicialDleo + abr.saldoInicialAprat;

// Totales ingresos por sociedad (ABRIL real)
const ingAlef  = INGRESOS_ABRIL.filter(r => r.sociedad === 'I.ALEF').reduce((s, r) => s + r.monto, 0);
const ingDleo  = INGRESOS_ABRIL.filter(r => r.sociedad === 'I.DON LEONARDO').reduce((s, r) => s + r.monto, 0);
const ingAprat = INGRESOS_ABRIL.filter(r => r.sociedad === 'I.A.PRAT 431').reduce((s, r) => s + r.monto, 0);

// Totales egresos por sociedad (ABRIL real)
const egrAlef  = EGRESOS_ABRIL.reduce((s, r) => s + (r.alef  || 0), 0);
const egrDleo  = EGRESOS_ABRIL.reduce((s, r) => s + (r.dleo  || 0), 0);
const egrAprat = EGRESOS_ABRIL.reduce((s, r) => s + (r.aprat || 0), 0);

export const dashboardData = {
  resumen: {
    saldoTotal:          saldoInicialTotal + abr.flujoNeto,
    saldoInicial:        saldoInicialTotal,
    flujoNetoPeriodo:    abr.flujoNeto,
    ingresosMensuales:   abr.totalIngresos,
    egresosMensuales:    abr.totalEgresos,
  },

  // 3 sociedades reales del Excel
  sociedades: [
    {
      id: 1,
      nombre:       'I.ALEF',
      saldoInicial: abr.saldoInicialAlef,
      ingresos:     ingAlef,
      egresos:      egrAlef,
      flujoNeto:    ingAlef - egrAlef,
      proyeccion:   abr.saldoInicialAlef + (ingAlef - egrAlef),
      variacion:    Number(((ingAlef - egrAlef) / Math.abs(abr.saldoInicialAlef) * 100).toFixed(1)),
    },
    {
      id: 2,
      nombre:       'I.DON LEONARDO',
      saldoInicial: abr.saldoInicialDleo,
      ingresos:     ingDleo,
      egresos:      egrDleo,
      flujoNeto:    ingDleo - egrDleo,
      proyeccion:   abr.saldoInicialDleo + (ingDleo - egrDleo),
      variacion:    Number(((ingDleo - egrDleo) / Math.abs(abr.saldoInicialDleo) * 100).toFixed(1)),
    },
    {
      id: 3,
      nombre:       'I.A.PRAT 431',
      saldoInicial: abr.saldoInicialAprat,
      ingresos:     ingAprat,
      egresos:      egrAprat,
      flujoNeto:    ingAprat - egrAprat,
      proyeccion:   abr.saldoInicialAprat + (ingAprat - egrAprat),
      variacion:    Number(((ingAprat - egrAprat) / Math.abs(abr.saldoInicialAprat) * 100).toFixed(1)),
    },
  ],

  // Tendencia: saldo inicial acumulado por mes (9 meses reales)
  tendenciaBalance: RESUMEN_MESES.map(r => ({
    mes:   r.mes.split(' ')[0], // "ABRIL", "MAYO", etc.
    valor: Math.round(r.saldoInicialAlef + r.saldoInicialDleo + r.saldoInicialAprat),
  })),

  // Entradas vs Salidas por mes (datos reales RESUMEN)
  entradasSalidas: RESUMEN_MESES.map(r => ({
    mes:      r.mes.split(' ')[0],
    ingresos: Math.round(r.totalIngresos),
    egresos:  Math.round(r.totalEgresos),
  })),

  // Categorías ingresos (distribución aproximada real del Excel)
  categoriasIngresos: [
    { nombre: 'Arriendos Retail', porcentaje: 52 },
    { nombre: 'Garantías',        porcentaje: 28 },
    { nombre: 'Arriendos Otros',  porcentaje: 12 },
    { nombre: 'Otros',            porcentaje: 8  },
  ],

  // Waterfall ABRIL 2026
  waterfallData: [
    { name: 'Inicio',        value: Math.round(saldoInicialTotal) },
    { name: 'Ingresos Op.',  value: Math.round(abr.totalIngresos) },
    { name: 'Egresos Op.',   value: Math.round(-abr.totalEgresos) },
    { name: 'Ajustes',       value: 0 },
    { name: 'Final',         value: Math.round(saldoInicialTotal + abr.flujoNeto) },
  ],

  // Transacciones recientes (muestra de ABRIL)
  transacciones: [
    { id: 1, descripcion: 'Arriendo — FALABELLA S.A. (Linares)',    categoria: 'Ingresos Ventas', monto:  29203981, tipo: 'ingreso' },
    { id: 2, descripcion: 'Arriendo — HITES S.A. (Curicó)',          categoria: 'Ingresos Ventas', monto:  36016915, tipo: 'ingreso' },
    { id: 3, descripcion: 'Impuesto de Renta',                        categoria: 'Impuestos',       monto: -316200000, tipo: 'egreso' },
    { id: 4, descripcion: 'Contribuciones y Sobretasas',              categoria: 'Impuestos',       monto: -178567940, tipo: 'egreso' },
    { id: 5, descripcion: 'Hipotecaria Security',                     categoria: 'Créditos',        monto:  -81933720, tipo: 'egreso' },
    { id: 6, descripcion: 'Garantía Ripley - Osorno',                 categoria: 'Ingresos Ventas', monto:  38686310, tipo: 'ingreso' },
  ],
};