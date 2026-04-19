import './header.css';

export default function Header({ selectedSociety, onSocietyChange, societies, valorUF }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">💼</span>
            <span className="logo-text">FlujosCash</span>
          </div>
        </div>

        <div className="header-right">
          <div className="filters">
            <select
              value={selectedSociety}
              onChange={e => onSocietyChange(e.target.value)}
              className="filter-select"
            >
              <option value="todas">Todas las Sociedades</option>
              {societies.map(s => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>

            <input type="date" defaultValue="2024-10-24" className="filter-date" />
          </div>

          <div className="uf-chip">
            <span className="uf-label">UF</span>
            <span className="uf-value">${valorUF.toLocaleString('es-CL')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}