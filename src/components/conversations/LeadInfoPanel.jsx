import { ArrowUpRight, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { getStatusMeta } from '../../lib/leads.js'
import LeadScore from '../leads/LeadScore.jsx'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './LeadInfoPanel.css'

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function LeadInfoPanel({ lead }) {
  const status = getStatusMeta(lead.status)

  const params = [
    { id: 'request', label: 'Запрос', value: lead.requestType },
    {
      id: 'budget',
      label: 'Бюджет',
      value: lead.budget || 'не указан',
      muted: !lead.budget,
    },
    { id: 'city', label: 'Город', value: lead.city },
    { id: 'deadline', label: 'Срок', value: lead.deadline },
  ]

  return (
    <div className="lead-info">
      <Card className="lead-info__card">
        <div className="lead-info__identity">
          <span className="lead-info__avatar" aria-hidden="true">
            {getInitials(lead.name)}
          </span>

          <div className="lead-info__text">
            <h2 className="lead-info__name">{lead.fullName}</h2>
            <span className="lead-info__username">{lead.username}</span>
          </div>
        </div>

        <div className="lead-info__status">
          <Badge tone={status.tone}>{status.label}</Badge>

          <span className="lead-info__source">
            <Send size={13} strokeWidth={1.9} aria-hidden="true" />
            {lead.source}
          </span>
        </div>

        <dl className="lead-info__params">
          {params.map((item) => (
            <div className="lead-info__param" key={item.id}>
              <dt className="lead-info__param-label">{item.label}</dt>
              <dd
                className={
                  item.muted
                    ? 'lead-info__param-value lead-info__param-value--muted'
                    : 'lead-info__param-value'
                }
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <Link to={`/leads/${lead.id}`} className="lead-info__link">
          Открыть карточку лида
          <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
        </Link>
      </Card>

      <LeadScore score={lead.score} label={lead.scoreLabel} />

      <Card className="lead-info__ai">
        <header className="lead-info__ai-header">
          <span className="lead-info__ai-icon" aria-hidden="true">
            <Sparkles size={15} strokeWidth={1.9} />
          </span>
          <h2 className="lead-info__ai-title">AI-сводка</h2>
        </header>

        <p className="lead-info__ai-text" title={lead.aiSummary}>
          {lead.aiSummary}
        </p>
      </Card>
    </div>
  )
}

export default LeadInfoPanel