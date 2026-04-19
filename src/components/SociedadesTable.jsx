import './table.css';

export default function SociedadesTable({ societies }) {
  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CL')}`;
  };

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
          {societies.map((sociedad) => (
            <tr key={sociedad.id} className="table-row">
              <td className="nombre-cell">
                <span className="avatar">{sociedad.nombre.charAt(0)}</span>
                <span className="nombre-text">{sociedad.nombre}</span>
              </td>
              <td className="text-right">{formatCurrency(sociedad.saldoInicial)}</td>
              <td className="text-right text-success">+{formatCurrency(sociedad.ingresos)}</td>
              <td className="text-right text-danger">-{formatCurrency(sociedad.egresos)}</td>
              <td className="text-right font-bold">{formatCurrency(sociedad.flujoNeto)}</td>
              <td className="text-right">{formatCurrency(sociedad.proyeccion)}</td>
              <td className="text-center">
                <span className={`badge ${sociedad.variacion >= 0 ? 'positive' : 'negative'}`}>
                  {sociedad.variacion >= 0 ? '+' : ''}{sociedad.variacion.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}