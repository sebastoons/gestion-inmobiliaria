import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import SociedadesTable from './SociedadesTable';
import './dashboard.css';

const fmt = (n) => {
  if (n == null) return '$0';
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toLocaleString('es-CL')}`;
};

const fmtFull = fmt;

export default function Dashboard({ data, selectedSociety }) {
  const [proyMeses, setProyMeses] = useState(6);
  const [periodoChart, setPeriodoChart] = useState('mensual');

  const kpis = [
    { label: 'SALDO INICIAL',    value: data.resumen.saldoInicial,        change: 2.4,   dir: 'up',   color: '' },
    { label: 'SALDO TOTAL',      value: data.resumen.saldoTotal,           change: 12.1,  dir: 'up',   color: '' },
    { label: 'INGRESOS',         value: data.resumen.ingresosMensuales,    change: 8.5,   dir: 'up',   color: 'success' },
    { label: 'EGRESOS',          value: data.resumen.egresosMensuales,     change: -4.2,  dir: 'down', color: 'danger' },
    { label: 'FLUJO NETO',       value: data.resumen.flujoNetoPeriodo,     change: 15.8,  dir: 'up',   color: 'success' },
    { label: 'PROYECCIÓN (1M)',   value: data.resumen.saldoTotal + data.resumen.flujoNetoPeriodo, change: 6.2, dir: 'up', color: '' },
  ];

  const maxWF = Math.max(...data.waterfallData.map(d => Math.abs(d.value)));
  const isBase = (i) => i === 0 || i === data.waterfallData.length - 1;

  return (
    <div className="dashboard">

      {/* ── Page Header ── */}
      <div className="dash-header">
        <div>
          <h2 className="dash-title">Dashboard de Flujo de Caja</h2>
          <p className="dash-subtitle">Visión consolidada de liquidez y proyecciones financieras.</p>
        </div>
        <div className="dash-actions">
          <button className="btn-dash outline">⬇ Exportar</button>
          <button className="btn-dash outline">↻ Actualizar</button>
          <button className="btn-dash primary">📈 Analizar Excel</button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="kpi-strip">
        {kpis.map((kpi, i) => (
          <div key={i} className={`kpi-strip-card ${kpi.color}`}>
            <div className="kpi-strip-top">
              <span className="kpi-strip-label">{kpi.label}</span>
              <span className={`kpi-arrow ${kpi.dir}`}>{kpi.dir === 'up' ? '↗' : '↘'}</span>
            </div>
            <p className="kpi-strip-value">{fmt(kpi.value)}</p>
            <p className={`kpi-strip-change ${kpi.change >= 0 ? 'pos' : 'neg'}`}>
              {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% vs mes anterior
            </p>
            <div className={`kpi-mini-bar ${kpi.color || 'neutral'}`} />
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="charts-row">
        {/* Area Chart */}
        <div className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <h3 className="chart-panel-title">Tendencia de Saldo Acumulado</h3>
              <p className="chart-panel-meta">Evolución histórica del patrimonio líquido consolidado.</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data.tendenciaBalance} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#2b7fe0" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2b7fe0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `$${(v / 1000000).toFixed(0)}M`} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [`$${v.toLocaleString('es-CL')}`, 'Saldo']}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="valor" stroke="#2b7fe0" strokeWidth={2} fill="url(#gSaldo)" dot={{ fill: '#2b7fe0', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="chart-panel">
          <div className="chart-panel-header">
            <div>
              <h3 className="chart-panel-title">Entradas vs Salidas</h3>
              <p className="chart-panel-meta">Comparativa mensual de flujos operativos.</p>
            </div>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${periodoChart === 'mensual' ? 'active' : ''}`}
                onClick={() => setPeriodoChart('mensual')}
              >Mensual</button>
              <button
                className={`toggle-btn ${periodoChart === 'trimestral' ? 'active' : ''}`}
                onClick={() => setPeriodoChart('trimestral')}
              >Trimestral</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.entradasSalidas} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={v => [`$${v.toLocaleString('es-CL')}`]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="egresos"  fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div className="bottom-row">

        {/* Tabla Sociedades */}
        <div className="table-panel">
          <div className="table-panel-header">
            <div>
              <h3 className="chart-panel-title">Desglose por Sociedad</h3>
              <p className="chart-panel-meta">Rendimiento detallado de cada entidad legal.</p>
            </div>
            <a href="#" className="link-action">Ver todas las sociedades →</a>
          </div>
          <SociedadesTable societies={data.sociedades} />
        </div>

        {/* Panel Proyección */}
        <div className="projection-panel">
          <h3 className="chart-panel-title">Panel de Proyección</h3>
          <p className="chart-panel-meta">Simulación de flujo a futuro.</p>

          <div className="proj-slider-group">
            <div className="proj-slider-labels">
              <span>Horizonte Temporal</span>
              <strong>{proyMeses} meses</strong>
            </div>
            <input
              type="range" min={1} max={12} value={proyMeses}
              onChange={e => setProyMeses(+e.target.value)}
              className="proj-slider"
            />
          </div>

          <div className="proj-metrics">
            <div className="proj-metric">
              <span className="proj-metric-label">📊 Saldo Estimado</span>
              <strong>$7.820.000</strong>
            </div>
            <div className="proj-metric">
              <span className="proj-metric-label">↗ Crecimiento Proyectado</span>
              <strong className="text-success">+19.5%</strong>
            </div>
            <div className="proj-metric">
              <span className="proj-metric-label">⏱ Probabilidad de Cumplimiento</span>
              <strong>88%</strong>
            </div>
          </div>

          <button className="btn-dash outline full-width">Configurar Escenarios</button>

          <div className="notas-section">
            <p className="notas-title">NOTAS Y RECOMENDACIONES</p>
            <div className="nota-item danger">
              <span className="nota-icon">⚠</span>
              <div>
                <p className="nota-title">Alerta de Liquidez</p>
                <p className="nota-desc">Flujo neto negativo previsto en Inmobiliaria Beta por pago de impuestos.</p>
              </div>
            </div>
            <div className="nota-item success">
              <span className="nota-icon">↗</span>
              <div>
                <p className="nota-title">Optimización de Saldos</p>
                <p className="nota-desc">Inmobiliaria Alpha tiene excedente de $120K. Considere reinversión.</p>
              </div>
            </div>
            <div className="nota-item warning">
              <span className="nota-icon">⏱</span>
              <div>
                <p className="nota-title">Actualización Pendiente</p>
                <p className="nota-desc">Datos de 'Constructora Gamma' sin actualizar hace 48 horas.</p>
              </div>
            </div>
          </div>

          <div className="categorias-section">
            <p className="notas-title">INGRESOS POR CATEGORÍA</p>
            {data.categoriasIngresos.map((cat, i) => (
              <div key={i} className="cat-item">
                <div className="cat-row">
                  <span className="cat-name">{cat.nombre}</span>
                  <span className="cat-pct">{cat.porcentaje}%</span>
                </div>
                <div className="cat-track">
                  <div className="cat-fill" style={{ width: `${cat.porcentaje}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Waterfall ── */}
      <div className="waterfall-panel">
        <h3 className="chart-panel-title">Puente de Caja (Waterfall)</h3>
        <p className="chart-panel-meta">Explicación de la variación del saldo entre períodos.</p>
        <div className="waterfall-chart">
          {data.waterfallData.map((item, i) => {
            const isNeg = item.value < 0;
            const pct = (Math.abs(item.value) / maxWF) * 100;
            const base = isBase(i);
            return (
              <div key={i} className="wf-col">
                <p className={`wf-val ${isNeg ? 'neg' : ''}`}>
                  {isNeg ? '-' : ''}{fmt(Math.abs(item.value))}
                </p>
                <div className="wf-bar-wrap">
                  <div
                    className={`wf-bar ${base ? 'base' : isNeg ? 'neg' : 'pos'}`}
                    style={{ height: `${Math.max(pct, 10)}%` }}
                  />
                </div>
                <p className="wf-label">{item.name}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}