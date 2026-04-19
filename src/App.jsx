import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AnalisisExcel from './components/AnalisisExcel';
import { dashboardData } from './data/dashboardData';
import { mockData } from './data/mockData';
import { VALOR_UF_POR_MES } from './data/excelData';
import './styles/global.css';
import './styles/responsive.css';
import './App.css';

export default function App() {
  const [activeMenu, setActiveMenu]       = useState('dashboard');
  const [selectedSociety, setSelectedSociety] = useState('todas');

  const valorUF = VALOR_UF_POR_MES['ABRIL 2026'];

  return (
    <div className="main-layout">
      <Header
        selectedSociety={selectedSociety}
        onSocietyChange={setSelectedSociety}
        societies={dashboardData.sociedades}
        valorUF={valorUF}
      />
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
      <main className="content">
        {activeMenu === 'dashboard' && (
          <Dashboard data={dashboardData} selectedSociety={selectedSociety} />
        )}
        {activeMenu === 'analisis-excel' && <AnalisisExcel />}
        {activeMenu === 'bh-terceros' && (
          <div className="placeholder-section">
            <h1>🏦 BH de Terceros</h1>
            <p>Sección en desarrollo...</p>
          </div>
        )}
      </main>
    </div>
  );
}