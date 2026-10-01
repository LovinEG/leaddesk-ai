import { ChevronRight, Send } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './RecentLeadsCard.css'

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function RecentLeadsCard({ leads }) {
  return (
    <Card className="recent-leads">
      <header className="recent-leads__header">
        <div className="recent-leads__heading">
          <h2 className="recent-leads__title">Последние лиды</h2>
          <p className="recent-leads__subtitle">
            Обращения, созданные AI-ассистентом
          </p>
        </div>

        <Link to="/leads" className="recent-leads__all">
          Все лиды
          <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </header>

      <div className="recent-leads__head-row" aria-hidden="true">
        <span>Клиент</span>
        <span>Проект</span>
        <span>Источник</span>
        <span>Статус</span>
      </div>

      <ul className="recent-leads__list">
        {leads.map((lead) => (
          <li key={lead.id}>
            <Link className="recent-leads__row" to={`/leads/${lead.id}`}>
              <span className="recent-leads__client">
                <span className="recent-leads__avatar" aria-hidden="true">
                  {getInitials(lead.name)}
                </span>
                <span className="recent-leads__name">{lead.name}</span>
              </span>

              <span className="recent-leads__project">{lead.project}</span>

              <span className="recent-leads__source">
                <Send size={13} strokeWidth={1.9} aria-hidden="true" />
                {lead.source}
              </span>

              <Badge tone={lead.tone}>{lead.status}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default RecentLeadsCard