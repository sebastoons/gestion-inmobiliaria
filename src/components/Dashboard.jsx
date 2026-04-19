import KPICard from './KPICard';
import BalanceChart from './BalanceChart';
import InOutChart from './InOutChart';
import SociedadesTable from './SociedadesTable';
import './dashboard.css';

export default function Dashboard({ data, selectedSociety }) {
  const filteredData = selectedSociety === 'todas'
    ? data
    : data.sociedades.find(s => s.id === parseInt(selectedSociety));

  const getKPIs = () => {
    if (selectedSociety === 'todas') {
      return [
        {
          label: 'Saldo Total',
          value: data.resumen.saldoTotal,
          change: 12.5,
          icon: '💰',
          type: 'neutral',
        },
        {
          label: 'Ingresos Mensuales',
          value: data.resumen.ingresosMensuales,
          change: 8.5,
          icon: '📈',
          type: 'success',
        },
        {
          label: 'Egresos Mensuales',
          value: data.resumen.egresosMensuales,
          change: -4.2,
          icon: '📉',
          type: 'danger',
        },
        {
          label: 'Flujo Neto Período',
          value: data.resumen.flujoNetoPeriodo,
          change: 15.8,
          icon: '💵',
          type: 'success',
        },
      ];
    } else {
      return [
        {
          label: 'Saldo Inicial',
          value: filteredData.saldoInicial,
          change: 2.4,
          icon: '💰',
          type: 'neutral',
        },
        {
          label: 'Ingresos',
          value: filteredData.ingresos,
          change: 5.2,
          icon: '📈',
          type: 'success',
        },
        {
          label: 'Egresos',
          value: filteredData.egresos,
          change: -4.2,
          icon: '📉',
          type: 'danger',
        },
        {
          label: 'Flujo Neto',
          value: filteredData.flujoNeto,
          change: 10.5,
          icon: '💵',
          type: 'success',
        },
      ];
    }
  };

  const kpis = getKPIs();

  return (
    <div className="dashboard">
      {/* KPI Cards */}
      <section className="kpi-section">
        <h2 className="section-title">Indicadores Clave</h2>
        <div className="kpi-grid grid-4">
          {kpis.map((kpi, idx) => (
            <KPICard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              icon={kpi.icon}
              type={kpi.type}
            />
          ))}
        </div>
      </section>

      {/* Gráficos */}
      <section className="charts-section">
        <div className="chart-card">
          <h3 className="card-title">Tendencia de Balance (6 Meses)</h3>
          <BalanceChart data={data.tendenciaBalance} />
        </div>

        <div className="chart-card">
          <h3 className="card-title">Entradas vs Salidas</h3>
          <InOutChart data={data.entradasSalidas} />
        </div>
      </section>

      {/* Tabla de Sociedades */}
      {selectedSociety === 'todas' && (
        <section className="table-section">
          <h2 className="section-title">Resumen por Sociedad</h2>
          <SociedadesTable societies={data.sociedades} />
        </section>
      )}

      {/* Transacciones */}
      <section className="transactions-section">
        <h2 className="section-title">Últimas Transacciones</h2>
        <div className="transactions-list">
          {data.transacciones.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className="tx-info">
                <p className="tx-description">{tx.descripcion}</p>
                <p className="tx-category">{tx.categoria}</p>
              </div>
              <div className={`tx-amount ${tx.tipo}`}>
                {tx.tipo === 'ingreso' ? '+' : '-'}${Math.abs(tx.monto).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}