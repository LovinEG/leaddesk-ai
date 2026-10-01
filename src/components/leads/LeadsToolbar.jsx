import { List, Search } from 'lucide-react'

import { FILTER_ALL } from '../../lib/leads.js'
import Card from '../ui/Card.jsx'
import './LeadsToolbar.css'

function LeadsToolbar({
  filters,
  onChange,
  onReset,
  statuses,
  sources,
  total,
  shown,
}) {
  const hasFilters =
    filters.query.trim() !== '' ||
    filters.status !== FILTER_ALL ||
    filters.source !== FILTER_ALL

  return (
    <Card className="leads-toolbar">
      <div className="leads-toolbar__row">
        <label className="leads-toolbar__search">
          <Search
            className="leads-toolbar__search-icon"
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <input
            type="search"
            className="leads-toolbar__search-input"
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder="Поиск по имени или запросу"
            aria-label="Поиск по имени или запросу"
          />
        </label>

        <div className="leads-toolbar__selects">
          <select
            className="leads-toolbar__select"
            value={filters.status}
            onChange={(event) => onChange('status', event.target.value)}
            aria-label="Фильтр по статусу"
          >
            <option value={FILTER_ALL}>Все статусы</option>
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            className="leads-toolbar__select"
            value={filters.source}
            onChange={(event) => onChange('source', event.target.value)}
            aria-label="Фильтр по источнику"
          >
            <option value={FILTER_ALL}>Все источники</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={
            hasFilters
              ? 'leads-toolbar__all leads-toolbar__all--active'
              : 'leads-toolbar__all'
          }
          onClick={onReset}
          title={
            hasFilters ? 'Сбросить фильтры и показать все лиды' : 'Показаны все лиды'
          }
        >
          <List size={15} strokeWidth={1.9} aria-hidden="true" />
          <span>Все лиды</span>
          <span className="leads-toolbar__all-count">{total}</span>
        </button>
      </div>

      {hasFilters ? (
        <p className="leads-toolbar__meta">
          Показано {shown} из {total}
        </p>
      ) : null}
    </Card>
  )
}

export default LeadsToolbar