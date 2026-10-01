import { ArrowLeft, Check, MessageSquare, Send, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getStatusMeta } from '../../lib/leads.js'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import './LeadHeader.css'

function getInitials(name) {
  return name.trim().charAt(0).toUpperCase()
}

function LeadHeader({ lead }) {
  const [isTaken, setIsTaken] = useState(false)
  const status = getStatusMeta(lead.status)

  return (
    <Card className="lead-header">
      <div className="lead-header__top">
        <Link to="/leads" className="lead-header__back">
          <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
          К лидам
        </Link>

        <div className="lead-header__actions">
          <Link to="/conversations" className="lead-header__action">
            <MessageSquare size={15} strokeWidth={1.9} aria-hidden="true" />
            Открыть диалог
          </Link>

          <button
            type="button"
            className={
              isTaken
                ? 'lead-header__take lead-header__take--taken'
                : 'lead-header__take'
            }
            onClick={() => setIsTaken(true)}
            disabled={isTaken}
          >
            {isTaken ? (
              <Check size={15} strokeWidth={2.2} aria-hidden="true" />
            ) : (
              <UserCheck size={15} strokeWidth={1.9} aria-hidden="true" />
            )}
            {isTaken ? 'Диалог у вас' : 'Забрать диалог'}
          </button>
        </div>
      </div>

      <div className="lead-header__identity">
        <span className="lead-header__avatar" aria-hidden="true">
          {getInitials(lead.name)}
        </span>

        <div className="lead-header__text">
          <h2 className="lead-header__name">{lead.fullName}</h2>

          <div className="lead-header__meta">
            <span className="lead-header__request">{lead.request}</span>
            <span className="lead-header__dot" aria-hidden="true" />
            <span className="lead-header__source">
              <Send size={13} strokeWidth={1.9} aria-hidden="true" />
              {lead.source}
            </span>
            <span className="lead-header__dot" aria-hidden="true" />
            <span className="lead-header__username">{lead.username}</span>
          </div>
        </div>

        <Badge tone={status.tone}>{status.label}</Badge>
      </div>
    </Card>
  )
}

export default LeadHeader