import { Inbox, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getStatusMeta } from '../../lib/leads.js'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './LeadsTable.css'

const COLUMNS = [
  'Клиент',
  'Запрос',
  'Источник',
  'Бюджет',
  'Статус',
  'Последняя активность',
]

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function LeadsTable({ leads }) {
  return (
    <Card className="leads-table">
      <div className="leads-table__scroll">
        <div className="leads-table__head" aria-hidden="true">
          {COLUMNS.map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>

        {leads.length === 0 ? (
          <div className="leads-table__empty">
            <Inbox size={22} strokeWidth={1.7} aria-hidden="true" />
            <p className="leads-table__empty-title">Ничего не найдено</p>
            <p className="leads-table__empty-text">
              Измените фильтры или поисковый запрос
            </p>
          </div>
        ) : (
          <ul className="leads-table__list">
            {leads.map((lead) => {
              const status = getStatusMeta(lead.status)

              return (
                <li key={lead.id}>
                  <Link className="leads-table__row" to={`/leads/${lead.id}`}>
                    <span className="leads-table__client">
                      <span className="leads-table__avatar" aria-hidden="true">
                        {getInitials(lead.name)}
                      </span>
                      <span className="leads-table__name">{lead.name}</span>
                    </span>

                    <span className="leads-table__request">{lead.request}</span>

                    <span className="leads-table__source">
                      <Send size={13} strokeWidth={1.9} aria-hidden="true" />
                      {lead.source}
                    </span>

                    <span className="leads-table__budget">
                      {lead.budget ? (
                        lead.budget
                      ) : (
                        <span className="leads-table__budget-empty">
                          не указан
                        </span>
                      )}
                    </span>

                    <span className="leads-table__status">
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </span>

                    <span className="leads-table__activity">
                      {lead.activity}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Card>
  )
}

export default LeadsTable