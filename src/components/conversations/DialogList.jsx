import { Inbox, Search } from 'lucide-react'

import { DIALOG_FILTERS } from '../../lib/conversations.js'
import { getStatusMeta } from '../../lib/leads.js'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './DialogList.css'

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function DialogList({ dialogs, filters, onChange, activeLeadId, onSelect }) {
  return (
    <Card className="dialog-list">
      <header className="dialog-list__header">
        <div className="dialog-list__heading">
          <h2 className="dialog-list__title">Диалоги</h2>
          <span className="dialog-list__count">{dialogs.length}</span>
        </div>

        <label className="dialog-list__search">
          <Search
            className="dialog-list__search-icon"
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <input
            type="search"
            className="dialog-list__search-input"
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder="Поиск по диалогам"
            aria-label="Поиск по диалогам"
          />
        </label>

        <div className="dialog-list__filters" role="group" aria-label="Фильтр диалогов">
          {DIALOG_FILTERS.map((filter) => {
            const isActive = filters.filter === filter.id

            return (
              <button
                key={filter.id}
                type="button"
                className={
                  isActive
                    ? 'dialog-list__filter dialog-list__filter--active'
                    : 'dialog-list__filter'
                }
                onClick={() => onChange('filter', filter.id)}
                aria-pressed={isActive}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </header>

      {dialogs.length === 0 ? (
        <div className="dialog-list__empty">
          <Inbox size={20} strokeWidth={1.7} aria-hidden="true" />
          <p className="dialog-list__empty-title">Диалогов не найдено</p>
          <p className="dialog-list__empty-text">
            Измените фильтр или поисковый запрос
          </p>
        </div>
      ) : (
        <ul className="dialog-list__items">
          {dialogs.map((dialog) => {
            const status = getStatusMeta(dialog.lead.status)
            const isActive = dialog.leadId === activeLeadId

            return (
              <li key={dialog.leadId}>
                <button
                  type="button"
                  className={
                    isActive ? 'dialog-item dialog-item--active' : 'dialog-item'
                  }
                  onClick={() => onSelect(dialog.leadId)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className="dialog-item__avatar" aria-hidden="true">
                    {getInitials(dialog.lead.name)}
                  </span>

                  <span className="dialog-item__body">
                    <span className="dialog-item__row">
                      <span className="dialog-item__name">
                        {dialog.lead.name}
                      </span>
                      <span className="dialog-item__time">{dialog.time}</span>
                    </span>

                    <span className="dialog-item__row">
                      <span className="dialog-item__request">
                        {dialog.lead.request}
                      </span>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </span>

                    <span className="dialog-item__preview">
                      {dialog.preview}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

export default DialogList