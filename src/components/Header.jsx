import './header.css';

export default function Header({ selectedSociety, onSocietyChange, societies }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">💼</span>
            <span className="logo-text">GestiónInmo</span>
          </div>
        </div>

        <div className="header-right">
          <div className="filters">
            <select
              value={selectedSociety}
              onChange={(e) => onSocietyChange(e.target.value)}
              className="filter-select"
            >
              <option value="todas">Todas las Sociedades</option>
              {societies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              defaultValue="2024-10-24"
              className="filter-date"
            />
          </div>

          <button className="header-btn">👤</button>
        </div>
      </div>
    </header>
  );
}