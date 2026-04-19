import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  MESES_DISPONIBLES, SOCIEDADES,
  RESUMEN_MESES, VALOR_UF_POR_MES,
  INGRESOS_ABRIL, EGRESOS_ABRIL,
  buildIngresosForMes, buildEgresosForMes,
} from '../data/excelData';
import './analisis-excel.css';

// ── Formato MM ──
const fmtMM = (n) => {
  if (n == null || n === 0) return '$0';
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.abs(n).toLocaleString('es-CL')}`;
};
const fmtFull = fmtMM;
const fmt     = fmtMM;

// ──────────────────────────────────────────────
// Modal edición
// ──────────────────────────────────────────────
function EditModal({ item, tipo, onSave, onClose }) {
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar {tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label>Descripción
            <input value={form.descripcion} onChange={e => set('descripcion', e.target.value)} />
          </label>
          {tipo === 'ingreso' && (
            <>
              <label>Arrendatario
                <input value={form.arrendatario} onChange={e => set('arrendatario', e.target.value)} />
              </label>
              <label>Inmueble / Ubicación
                <input value={form.inmueble} onChange={e => set('inmueble', e.target.value)} />
              </label>
              <label>Sociedad
                <select value={form.sociedad} onChange={e => set('sociedad', e.target.value)}>
                  {SOCIEDADES.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
              <label>Renta (UF)
                <input type="number" value={form.rentaUF} onChange={e => set('rentaUF', +e.target.value)} />
              </label>
              <label>Monto ($)
                <input type="number" value={form.monto} onChange={e => set('monto', +e.target.value)} />
              </label>
            </>
          )}
          {tipo === 'egreso' && (
            <>
              <label>I.ALEF ($)
                <input type="number" value={form.alef} onChange={e => set('alef', +e.target.value)} />
              </label>
              <label>I.DON LEONARDO ($)
                <input type="number" value={form.dleo} onChange={e => set('dleo', +e.target.value)} />
              </label>
              <label>I.A.PRAT 431 ($)
                <input type="number" value={form.aprat} onChange={e => set('aprat', +e.target.value)} />
              </label>
              <label>Total ($)
                <input
                  type="number"
                  value={(form.alef || 0) + (form.dleo || 0) + (form.aprat || 0)}
                  readOnly
                  className="readonly"
                />
              </label>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn-dash outline" onClick={onClose}>Cancelar</button>
          <button className="btn-dash primary" onClick={() => onSave({
            ...form,
            ...(tipo === 'egreso'
              ? { total: (form.alef || 0) + (form.dleo || 0) + (form.aprat || 0) }
              : {}),
          })}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Modal confirmación eliminar
// ──────────────────────────────────────────────
function ConfirmModal({ desc, onConfirm, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box small" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>¿Eliminar registro?</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, color: '#475569', fontSize: 14 }}>{desc}</p>
        </div>
        <div className="modal-footer">
          <button className="btn-dash outline" onClick={onClose}>Cancelar</button>
          <button className="btn-dash danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Form agregar ingreso
// ──────────────────────────────────────────────
function AddIngresoForm({ onAdd, onCancel }) {
  const [f, setF] = useState({
    descripcion: '', arrendatario: '', inmueble: '',
    sociedad: 'I.ALEF', rentaUF: 0, monto: 0,
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <div className="add-form">
      <div className="add-form-grid">
        <input placeholder="Descripción *"   value={f.descripcion}  onChange={e => set('descripcion',  e.target.value)} />
        <input placeholder="Arrendatario"    value={f.arrendatario} onChange={e => set('arrendatario', e.target.value)} />
        <input placeholder="Inmueble"        value={f.inmueble}     onChange={e => set('inmueble',      e.target.value)} />
        <select value={f.sociedad} onChange={e => set('sociedad', e.target.value)}>
          {SOCIEDADES.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="number" placeholder="Renta UF"  value={f.rentaUF} onChange={e => set('rentaUF', +e.target.value)} />
        <input type="number" placeholder="Monto ($)" value={f.monto}   onChange={e => set('monto',   +e.target.value)} />
      </div>
      <div className="add-form-actions">
        <button className="btn-dash outline" onClick={onCancel}>Cancelar</button>
        <button className="btn-dash primary" onClick={() => f.descripcion && onAdd(f)}>✓ Agregar</button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Form agregar egreso
// ──────────────────────────────────────────────
function AddEgresoForm({ onAdd, onCancel }) {
  const [f, setF] = useState({ descripcion: '', alef: 0, dleo: 0, aprat: 0 });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const total = (f.alef || 0) + (f.dleo || 0) + (f.aprat || 0);

  return (
    <div className="add-form">
      <div className="add-form-grid">
        <input
          placeholder="Concepto / Descripción *"
          value={f.descripcion}
          onChange={e => set('descripcion', e.target.value)}
          className="span-2"
        />
        <input type="number" placeholder="I.ALEF ($)"         value={f.alef}  onChange={e => set('alef',  +e.target.value)} />
        <input type="number" placeholder="I.DON LEONARDO ($)" value={f.dleo}  onChange={e => set('dleo',  +e.target.value)} />
        <input type="number" placeholder="I.A.PRAT 431 ($)"   value={f.aprat} onChange={e => set('aprat', +e.target.value)} />
        <input value={`Total: ${fmtMM(total)}`} readOnly className="readonly" />
      </div>
      <div className="add-form-actions">
        <button className="btn-dash outline" onClick={onCancel}>Cancelar</button>
        <button className="btn-dash primary" onClick={() => f.descripcion && onAdd({ ...f, total })}>✓ Agregar</button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function AnalisisExcel() {
  const [mesSel, setMesSel]           = useState('ABRIL 2026');
  const [tab, setTab]                 = useState('ingresos');
  const [socFiltro, setSocFiltro]     = useState('Todas');
  const [busqueda, setBusqueda]       = useState('');
  const [editItem, setEditItem]       = useState(null);
  const [deleteItem, setDeleteItem]   = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Estado mutable por mes
  const [dataMes, setDataMes] = useState(() => {
    const init = {};
    MESES_DISPONIBLES.forEach(m => {
      init[m] = {
        ingresos: (m === 'ABRIL 2026' ? INGRESOS_ABRIL : buildIngresosForMes(m)).map(r => ({ ...r })),
        egresos:  (m === 'ABRIL 2026' ? EGRESOS_ABRIL  : buildEgresosForMes(m)).map(r => ({ ...r })),
      };
    });
    return init;
  });

  const mesData = dataMes[mesSel];
  const resumen = RESUMEN_MESES.find(r => r.mes === mesSel) || RESUMEN_MESES[0];

  // Totales dinámicos globales
  const totalIngresosDin = useMemo(
    () => mesData.ingresos.reduce((s, r) => s + (r.monto || 0), 0),
    [mesData.ingresos],
  );
  const totalEgresosDin = useMemo(
    () => mesData.egresos.reduce((s, r) => s + (r.total || 0), 0),
    [mesData.egresos],
  );
  const flujoNetoDin = totalIngresosDin - totalEgresosDin;

  // Totales por sociedad — Ingresos
  const totalAlef  = useMemo(() => mesData.ingresos.filter(r => r.sociedad === 'I.ALEF').reduce((s, r) => s + r.monto, 0), [mesData.ingresos]);
  const totalDleo  = useMemo(() => mesData.ingresos.filter(r => r.sociedad === 'I.DON LEONARDO').reduce((s, r) => s + r.monto, 0), [mesData.ingresos]);
  const totalAprat = useMemo(() => mesData.ingresos.filter(r => r.sociedad === 'I.A.PRAT 431').reduce((s, r) => s + r.monto, 0), [mesData.ingresos]);

  // Totales por sociedad — Egresos
  const egrAlef  = useMemo(() => mesData.egresos.reduce((s, r) => s + (r.alef  || 0), 0), [mesData.egresos]);
  const egrDleo  = useMemo(() => mesData.egresos.reduce((s, r) => s + (r.dleo  || 0), 0), [mesData.egresos]);
  const egrAprat = useMemo(() => mesData.egresos.reduce((s, r) => s + (r.aprat || 0), 0), [mesData.egresos]);

  const saldoInicial = resumen.saldoInicialAlef + resumen.saldoInicialDleo + resumen.saldoInicialAprat;

  // Filtrado
  const ingresosFilt = useMemo(() => mesData.ingresos.filter(r => {
    const matchSoc = socFiltro === 'Todas' || r.sociedad === socFiltro;
    const matchQ   = busqueda === '' ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.arrendatario?.toLowerCase() || '').includes(busqueda.toLowerCase());
    return matchSoc && matchQ;
  }), [mesData.ingresos, socFiltro, busqueda]);

  const egresosFilt = useMemo(() => mesData.egresos.filter(r =>
    busqueda === '' || r.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  ), [mesData.egresos, busqueda]);

  // CRUD
  const updateRow = (tipo, updated) => {
    setDataMes(prev => {
      const lista = [...prev[mesSel][tipo]];
      const idx   = lista.findIndex(r => r.id === updated.id);
      if (idx >= 0) lista[idx] = updated;
      return { ...prev, [mesSel]: { ...prev[mesSel], [tipo]: lista } };
    });
    setEditItem(null);
  };

  const deleteRow = (tipo, id) => {
    setDataMes(prev => ({
      ...prev,
      [mesSel]: {
        ...prev[mesSel],
        [tipo]: prev[mesSel][tipo].filter(r => r.id !== id),
      },
    }));
    setDeleteItem(null);
  };

  const addRow = (tipo, newItem) => {
    setDataMes(prev => {
      const lista = prev[mesSel][tipo];
      const newId = lista.length > 0 ? Math.max(...lista.map(r => r.id)) + 1 : 1;
      return {
        ...prev,
        [mesSel]: {
          ...prev[mesSel],
          [tipo]: [...lista, { ...newItem, id: newId }],
        },
      };
    });
    setShowAddForm(false);
  };

  // Exportar CSV
  const downloadCSV = () => {
    const rows = [
      ['TIPO', 'ID', 'DESCRIPCION', 'ARRENDATARIO', 'INMUEBLE', 'SOCIEDAD', 'RENTA_UF', 'MONTO', 'I_ALEF', 'I_DLEO', 'I_APRAT', 'TOTAL'],
      ...mesData.ingresos.map(r => [
        'INGRESO', r.id, r.descripcion, r.arrendatario || '', r.inmueble || '',
        r.sociedad, r.rentaUF, r.monto, '', '', '', r.monto,
      ]),
      ...mesData.egresos.map(r => [
        'EGRESO', r.id, r.descripcion, '', '', '',
        '', '', r.alef || 0, r.dleo || 0, r.aprat || 0, r.total || 0,
      ]),
    ];
    const csv  = rows.map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `FlujoCaja_${mesSel.replace(/ /g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Gráfico distribución
  const distribData = [
    { name: 'Ventas',  value: Math.round(totalIngresosDin * 0.45) },
    { name: 'Op.',     value: Math.round(totalIngresosDin * 0.30) },
    { name: 'Finan.',  value: Math.round(totalIngresosDin * 0.15) },
    { name: 'Admin.',  value: Math.round(totalIngresosDin * 0.10) },
  ];

  return (
    <div className="analisis-root">

      {/* ── Header ── */}
      <div className="ae-header">
        <div className="ae-file-info">
          <span className="ae-file-icon">📊</span>
          <div>
            <p className="ae-file-name">FLUJO_CAJA_INMOBILIARIAS_ABRIL–DICIEMBRE_2026.xlsx</p>
            <p className="ae-file-meta">
              Período {mesSel} · {mesData.ingresos.length + mesData.egresos.length} filas procesadas
            </p>
          </div>
        </div>
        <div className="ae-actions">
          <button className="btn-dash outline" onClick={downloadCSV}>⬇ Exportar CSV</button>
          <button className="btn-dash primary" onClick={() => setShowAddForm(true)}>
            + Agregar
          </button>
        </div>
      </div>

      {/* ── Filtros ── */}
      <div className="ae-filters">
        <select
          value={mesSel}
          onChange={e => { setMesSel(e.target.value); setShowAddForm(false); }}
          className="ae-select"
        >
          {MESES_DISPONIBLES.map(m => <option key={m}>{m}</option>)}
        </select>
        <select value={socFiltro} onChange={e => setSocFiltro(e.target.value)} className="ae-select">
          <option>Todas</option>
          {SOCIEDADES.map(s => <option key={s}>{s}</option>)}
        </select>
        <div className="ae-search-wrap">
          <span className="ae-search-icon">🔍</span>
          <input
            className="ae-search"
            placeholder="Buscar descripción, arrendatario..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <span className="ae-status">Estado: Validado (98%)</span>
      </div>

      {/* ── KPI Strip ── */}
      <div className="ae-kpi-strip">
        <div className="ae-kpi">
          <div className="ae-kpi-top">
            <span className="ae-kpi-label">TOTAL INGRESOS</span>
            <span className="ae-kpi-arrow up">↗</span>
          </div>
          <p className="ae-kpi-value pos">{fmtMM(totalIngresosDin)}</p>
          <div className="ae-soc-breakdown">
            <span className="soc-row"><span className="soc-dot alef" />I.ALEF: {fmtMM(totalAlef)}</span>
            <span className="soc-row"><span className="soc-dot dleo" />DLEO: {fmtMM(totalDleo)}</span>
            <span className="soc-row"><span className="soc-dot aprat" />PRAT: {fmtMM(totalAprat)}</span>
          </div>
        </div>

        <div className="ae-kpi">
          <div className="ae-kpi-top">
            <span className="ae-kpi-label">TOTAL EGRESOS</span>
            <span className="ae-kpi-arrow down">↘</span>
          </div>
          <p className="ae-kpi-value neg">{fmtMM(totalEgresosDin)}</p>
          <div className="ae-soc-breakdown">
            <span className="soc-row"><span className="soc-dot alef" />I.ALEF: {fmtMM(egrAlef)}</span>
            <span className="soc-row"><span className="soc-dot dleo" />DLEO: {fmtMM(egrDleo)}</span>
            <span className="soc-row"><span className="soc-dot aprat" />PRAT: {fmtMM(egrAprat)}</span>
          </div>
        </div>

        <div className="ae-kpi">
          <div className="ae-kpi-top">
            <span className="ae-kpi-label">FLUJO NETO</span>
            <span className={`ae-kpi-arrow ${flujoNetoDin >= 0 ? 'up' : 'down'}`}>
              {flujoNetoDin >= 0 ? '↗' : '↘'}
            </span>
          </div>
          <p className={`ae-kpi-value ${flujoNetoDin >= 0 ? 'pos' : 'neg'}`}>{fmtMM(flujoNetoDin)}</p>
          <p className="ae-kpi-change">
            Margen: {totalIngresosDin > 0 ? Math.round((flujoNetoDin / totalIngresosDin) * 100) : 0}%
          </p>
        </div>

        <div className="ae-kpi">
          <div className="ae-kpi-top">
            <span className="ae-kpi-label">SALDO INICIAL</span>
            <span className="ae-kpi-arrow">📋</span>
          </div>
          <p className={`ae-kpi-value ${saldoInicial >= 0 ? '' : 'neg'}`}>{fmtMM(saldoInicial)}</p>
          <p className="ae-kpi-change">UF: ${VALOR_UF_POR_MES[mesSel]?.toLocaleString('es-CL')}</p>
        </div>

        <div className="ae-kpi">
          <div className="ae-kpi-top">
            <span className="ae-kpi-label">FILAS PROCESADAS</span>
            <span className="ae-kpi-arrow">✅</span>
          </div>
          <p className="ae-kpi-value plain">{mesData.ingresos.length + mesData.egresos.length}</p>
          <p className="ae-kpi-change">
            {mesData.ingresos.length} ing · {mesData.egresos.length} egr
          </p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="ae-main-grid">

        {/* ── Tabla principal ── */}
        <div className="ae-table-panel">
          <div className="ae-tabs">
            {['ingresos', 'egresos', 'resumen'].map(t => (
              <button
                key={t}
                className={`ae-tab ${tab === t ? 'active' : ''}`}
                onClick={() => { setTab(t); setShowAddForm(false); }}
              >
                {t === 'ingresos' ? `📈 Ingresos (${mesData.ingresos.length})` :
                 t === 'egresos'  ? `📉 Egresos (${mesData.egresos.length})` :
                 '📊 Resumen Anual'}
              </button>
            ))}
          </div>

          {/* INGRESOS */}
          {tab === 'ingresos' && (
            <>
              {showAddForm && (
                <AddIngresoForm
                  onAdd={item => addRow('ingresos', item)}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              <div className="ae-table-wrap">
                <table className="ae-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Descripción</th>
                      <th>Sociedad</th>
                      <th>Inmueble / Ubicación</th>
                      <th className="text-right">Renta UF</th>
                      <th className="text-right">Monto</th>
                      <th className="text-center">Acc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresosFilt.map(row => (
                      <tr key={row.id}>
                        <td className="td-num">{row.id}</td>
                        <td className="td-desc">{row.descripcion}</td>
                        <td>
                          <span className={`soc-badge ${row.sociedad.replace(/[\s.]/g, '-').toLowerCase()}`}>
                            {row.sociedad}
                          </span>
                        </td>
                        <td className="td-loc">{row.inmueble || '—'}</td>
                        <td className="text-right">{row.rentaUF > 0 ? row.rentaUF.toFixed(2) : '—'}</td>
                        <td className="text-right text-success fw-600">{fmtMM(row.monto)}</td>
                        <td className="text-center">
                          <div className="row-actions">
                            <button className="act-btn edit" title="Editar"
                              onClick={() => setEditItem({ item: row, tipo: 'ingresos' })}>✏️</button>
                            <button className="act-btn del" title="Eliminar"
                              onClick={() => setDeleteItem({ id: row.id, tipo: 'ingresos', desc: row.descripcion })}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="tfoot-label">TOTAL INGRESOS — {mesSel}</td>
                      <td className="text-right text-success fw-700">{fmtMM(totalIngresosDin)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}

          {/* EGRESOS */}
          {tab === 'egresos' && (
            <>
              {showAddForm && (
                <AddEgresoForm
                  onAdd={item => addRow('egresos', item)}
                  onCancel={() => setShowAddForm(false)}
                />
              )}
              <div className="ae-table-wrap">
                <table className="ae-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Concepto / Descripción</th>
                      <th className="text-right">I.ALEF</th>
                      <th className="text-right">I.DON LEONARDO</th>
                      <th className="text-right">I.A.PRAT 431</th>
                      <th className="text-right">TOTAL</th>
                      <th className="text-center">Acc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {egresosFilt.map(row => (
                      <tr key={row.id}>
                        <td className="td-num">{row.id}</td>
                        <td className="td-desc">{row.descripcion}</td>
                        <td className="text-right">{row.alef > 0 ? fmtMM(row.alef) : '—'}</td>
                        <td className="text-right">{row.dleo > 0 ? fmtMM(row.dleo) : '—'}</td>
                        <td className="text-right">{row.aprat > 0 ? fmtMM(row.aprat) : '—'}</td>
                        <td className="text-right text-danger fw-600">{fmtMM(row.total)}</td>
                        <td className="text-center">
                          <div className="row-actions">
                            <button className="act-btn edit" title="Editar"
                              onClick={() => setEditItem({ item: row, tipo: 'egresos' })}>✏️</button>
                            <button className="act-btn del" title="Eliminar"
                              onClick={() => setDeleteItem({ id: row.id, tipo: 'egresos', desc: row.descripcion })}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td className="tfoot-label">TOTAL</td>
                      <td className="text-right text-danger fw-600">{fmtMM(egrAlef)}</td>
                      <td className="text-right text-danger fw-600">{fmtMM(egrDleo)}</td>
                      <td className="text-right text-danger fw-600">{fmtMM(egrAprat)}</td>
                      <td className="text-right text-danger fw-700">{fmtMM(totalEgresosDin)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          )}

          {/* RESUMEN ANUAL */}
          {tab === 'resumen' && (
            <div className="ae-table-wrap">
              <table className="ae-table">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th className="text-right">Valor UF</th>
                    <th className="text-right">Total Ingresos</th>
                    <th className="text-right">Total Egresos</th>
                    <th className="text-right">Flujo Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {RESUMEN_MESES.map(r => (
                    <tr key={r.mes} className={r.mes === mesSel ? 'row-highlight' : ''}>
                      <td className="fw-600">{r.mes}</td>
                      <td className="text-right">${r.valorUF.toLocaleString('es-CL')}</td>
                      <td className="text-right text-success">{fmtMM(r.totalIngresos)}</td>
                      <td className="text-right text-danger">{fmtMM(r.totalEgresos)}</td>
                      <td className={`text-right fw-600 ${r.flujoNeto >= 0 ? 'text-success' : 'text-danger'}`}>
                        {r.flujoNeto >= 0 ? '+' : ''}{fmtMM(r.flujoNeto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Panel lateral ── */}
        <div className="ae-side-panel">

          {/* Validaciones */}
          <div className="ae-validaciones">
            <div className="ae-val-header">
              <span className="ae-val-title">⏱ VALIDACIONES</span>
              <span className="ae-badge warning">3 Avisos</span>
            </div>
            <div className="ae-val-item error">
              <span className="ae-val-tag error">error</span>
              <span>Faltan categorías en 12 filas</span>
            </div>
            <div className="ae-val-item warning">
              <span className="ae-val-tag warning">warning</span>
              <span>Mapeo ambiguo detectado</span>
            </div>
            <div className="ae-val-item info">
              <span className="ae-val-tag info">info</span>
              <span>Fecha de transacción futura</span>
            </div>
          </div>

          {/* Distribución */}
          <div className="ae-distrib">
            <p className="ae-distrib-title">↗ DISTRIBUCIÓN POR CATEGORÍA</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={distribData} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 4 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
                <Tooltip formatter={v => [fmtMM(v)]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill="#2b7fe0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="ae-distrib-meta">Basado en 98% del mapeo automático</p>
          </div>

          {/* Saldos por sociedad */}
          <div className="ae-saldos">
            <p className="ae-distrib-title">🏢 SALDOS INICIALES</p>
            <div className="saldo-row">
              <span className="saldo-soc">I.ALEF</span>
              <span className={`saldo-val ${resumen.saldoInicialAlef >= 0 ? 'pos' : 'neg'}`}>
                {fmtMM(resumen.saldoInicialAlef)}
              </span>
            </div>
            <div className="saldo-row">
              <span className="saldo-soc">I.DON LEONARDO</span>
              <span className={`saldo-val ${resumen.saldoInicialDleo >= 0 ? 'pos' : 'neg'}`}>
                {fmtMM(resumen.saldoInicialDleo)}
              </span>
            </div>
            <div className="saldo-row">
              <span className="saldo-soc">I.A.PRAT 431</span>
              <span className={`saldo-val ${resumen.saldoInicialAprat >= 0 ? 'pos' : 'neg'}`}>
                {fmtMM(resumen.saldoInicialAprat)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modales ── */}
      {editItem && (
        <EditModal
          item={editItem.item}
          tipo={editItem.tipo === 'ingresos' ? 'ingreso' : 'egreso'}
          onSave={updated => updateRow(editItem.tipo, updated)}
          onClose={() => setEditItem(null)}
        />
      )}
      {deleteItem && (
        <ConfirmModal
          desc={deleteItem.desc}
          onConfirm={() => deleteRow(deleteItem.tipo, deleteItem.id)}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}