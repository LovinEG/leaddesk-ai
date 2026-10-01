import { Bell, Plus, Search } from 'lucide-react'

import './Topbar.css'

function Topbar({ title, description }) {
  return (
    <header className="topbar">
      <div className="topbar__heading">
        <h1 className="topbar__title">{title}</h1>
        {description ? (
          <p className="topbar__description">{description}</p>
        ) : null}
      </div>

      <div className="topbar__tools">
        <label className="topbar__search">
          <Search
            className="topbar__search-icon"
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <input
            type="search"
            className="topbar__search-input"
            placeholder="Поиск по лидам и диалогам"
            aria-label="Поиск по лидам и диалогам"
          />
        </label>

        <div className="topbar__actions">
          <button type="button" className="topbar__action" aria-label="Создать лида">
            <Plus size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="topbar__action topbar__action--alert"
            aria-label="Уведомления"
          >
            <Bell size={16} strokeWidth={1.9} aria-hidden="true" />
          </button>
        </div>

        <div className="topbar__user">
          <span className="topbar__avatar" aria-hidden="true">
            DB
          </span>
          <span className="topbar__user-text">
            <span className="topbar__user-name">Demo Business</span>
            <span className="topbar__user-role">Демо-доступ</span>
          </span>
        </div>
      </div>
    </header>
  )
}

export default Topbar