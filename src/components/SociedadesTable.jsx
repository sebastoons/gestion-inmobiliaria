import './table.css';

export default function SociedadesTable({ societies }) {
  const formatCurrency = (value) =>
    `$${Math.abs(value).toLocaleString('es-CL')}`;

  const initial = (nombre) => nombre.charAt(2) || nombre.charAt(0);

  return (
    <div className="table-wrapper">
      <table className="societies-table">
        <thead>
          <tr>
            <th>Sociedad</th>
            <th className="text-right">Saldo Inicial</th>
            <th className="text-right text-success">Ingresos</th>
            <th className="text-right text-danger">Egresos</th>
            <th className="text-right">Flujo Neto</th>
            <th className="text-right">Proyección</th>
            <th className="text-center">Var.</th>
          </tr>
        </thead>
        <tbody>
          {societies.map((s) => (
            <tr key={s.id} className="table-row">
              <td className="nombre-cell">
                <span className="avatar">{initial(s.nombre)}</span>
                <span className="nombre-text">{s.nombre}</span>
              </td>
              <td className="text-right">{formatCurrency(s.saldoInicial)}</td>
              <td className="text-right text-success">+{formatCurrency(s.ingresos)}</td>
              <td className="text-right text-danger">-{formatCurrency(s.egresos)}</td>
              <td className={`text-right font-bold ${s.flujoNeto >= 0 ? 'text-success' : 'text-danger'}`}>
                {s.flujoNeto >= 0 ? '' : '-'}{formatCurrency(s.flujoNeto)}
              </td>
              <td className={`text-right ${s.proyeccion >= 0 ? '' : 'text-danger'}`}>
                {formatCurrency(s.proyeccion)}
              </td>
              <td className="text-center">
                <span className={`badge ${s.variacion >= 0 ? 'positive' : 'negative'}`}>
                  {s.variacion >= 0 ? '+' : ''}{s.variacion}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}