import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { mockData } from './data/mockData';
import './styles/global.css';
import './styles/responsive.css';
import './app.css';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('inicio');
  const [selectedSociety, setSelectedSociety] = useState('todas');

  return (
    <div className="main-layout">
      <Header
        selectedSociety={selectedSociety}
        onSocietyChange={setSelectedSociety}
        societies={mockData.sociedades}
      />

      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      <main className="content">
        {activeMenu === 'inicio' && <Dashboard data={mockData} selectedSociety={selectedSociety} />}
        {activeMenu === 'flujo-caja' && (
          <div className="placeholder-section">
            <h1>📊 Flujo de Caja Detallado</h1>
            <p>Sección en desarrollo...</p>
          </div>
        )}
        {activeMenu === 'analizar-excel' && (
          <div className="placeholder-section">
            <h1>📄 Analizar Excel</h1>
            <p>Sección en desarrollo...</p>
          </div>
        )}
        {activeMenu === 'sociedades' && (
          <div className="placeholder-section">
            <h1>🏢 Gestión de Sociedades</h1>
            <p>Sección en desarrollo...</p>
          </div>
        )}
      </main>
    </div>
  );
}