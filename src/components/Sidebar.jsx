import { useState } from 'react';
import './sidebar.css';

const menuItems = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: '🏠',
    children: [
      {
        id: 'flujo-caja',
        label: 'Flujo de Caja',
        icon: '📊',
        children: [
          { id: 'dashboard',      label: 'Dashboard',      icon: '🗂️' },
          { id: 'analisis-excel', label: 'Análisis Excel', icon: '📄' },
        ],
      },
      {
        id: 'bh-terceros',
        label: 'BH de Terceros',
        icon: '🏦',
        children: [],
      },
    ],
  },
];

function NavItem({ item, activeMenu, onMenuChange, expanded, onToggle, depth = 0 }) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded  = expanded.has(item.id);
  const isActive    = activeMenu === item.id;

  const handleClick = () => {
    if (hasChildren) onToggle(item.id);
    else onMenuChange(item.id);
  };

  return (
    <li className="nav-item-wrapper">
      <button
        className={`nav-item depth-${depth} ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''}`}
        onClick={handleClick}
        style={{ paddingLeft: `${16 + depth * 14}px` }}
      >
        <span className="nav-icon">{item.icon}</span>
        <span className="nav-label">{item.label}</span>
        {hasChildren && (
          <span className={`nav-arrow ${isExpanded ? 'expanded' : ''}`}>›</span>
        )}
      </button>

      {hasChildren && isExpanded && (
        <ul className="nav-children">
          {item.children.map(child => (
            <NavItem
              key={child.id}
              item={child}
              activeMenu={activeMenu}
              onMenuChange={onMenuChange}
              expanded={expanded}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Sidebar({ activeMenu, onMenuChange }) {
  const [expanded, setExpanded] = useState(new Set(['inicio', 'flujo-caja']));

  const handleToggle = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map(item => (
            <NavItem
              key={item.id}
              item={item}
              activeMenu={activeMenu}
              onMenuChange={onMenuChange}
              expanded={expanded}
              onToggle={handleToggle}
              depth={0}
            />
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">RS</div>
          <div className="user-info">
            <p className="user-name">Roberto Soto</p>
            <p className="user-role">Administrador</p>
          </div>
        </div>
        <button className="logout-btn">🚪 Cerrar Sesión</button>
      </div>
    </aside>
  );
}