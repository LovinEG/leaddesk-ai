import { NavLink } from 'react-router-dom'

import { NAV_ITEMS } from '../../lib/navigation.js'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar__brand">
        <span className="sidebar__brand-mark" aria-hidden="true">
          LD
        </span>
        <span className="sidebar__brand-text">
          <span className="sidebar__brand-name">LeadDesk AI</span>
          <span className="sidebar__brand-tag">AI Sales Desk</span>
        </span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Основная навигация">
        <p className="sidebar__eyebrow">Workspace</p>

        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                title={label}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                <Icon
                  className="sidebar__icon"
                  size={17}
                  strokeWidth={1.85}
                  aria-hidden="true"
                />
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="sidebar__footer">
        <span className="sidebar__status-dot" aria-hidden="true" />
        <span className="sidebar__status-text">AI-ассистент онлайн</span>
      </footer>
    </aside>
  )
}

export default Sidebar