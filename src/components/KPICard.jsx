import './kpi-card.css';

export default function KPICard({ label, value, change, icon = '📊', type = 'neutral' }) {
  const formatValue = (num) => {
    if (num == null) return '$0';
    const sign = num < 0 ? '-' : '';
    return `${sign}$${Math.abs(num).toLocaleString('es-CL')}`;
  };  

  const isPositive = change >= 0;

  return (
    <div className={`kpi-card kpi-${type}`}>
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <span className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
        </span>
      </div>

      <div className="kpi-content">
        <p className="kpi-label">{label}</p>
        <p className="kpi-value">{formatValue(value)}</p>
      </div>

      <div className="kpi-chart">
        <div className="chart-placeholder"></div>
      </div>
    </div>
  );
}