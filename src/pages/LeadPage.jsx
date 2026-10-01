import { ArrowLeft, Inbox } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import LeadAiSummary from '../components/leads/LeadAiSummary.jsx'
import LeadHeader from '../components/leads/LeadHeader.jsx'
import LeadNotes from '../components/leads/LeadNotes.jsx'
import LeadParams from '../components/leads/LeadParams.jsx'
import LeadScore from '../components/leads/LeadScore.jsx'
import LeadTimeline from '../components/leads/LeadTimeline.jsx'
import { getLeadById } from '../lib/leads.js'
import './LeadPage.css'

function LeadPage() {
  const { id } = useParams()
  const lead = getLeadById(id)

  if (!lead) {
    return (
      <div className="lead-page__empty">
        <Inbox size={22} strokeWidth={1.7} aria-hidden="true" />

        <p className="lead-page__empty-title">Лид не найден</p>
        <p className="lead-page__empty-text">
          Возможно, заявка была удалена или ссылка устарела
        </p>

        <Link to="/leads" className="lead-page__empty-link">
          <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
          Вернуться к лидам
        </Link>
      </div>
    )
  }

  return (
    <div className="lead-page">
      <LeadHeader key={lead.id} lead={lead} />

      <div className="lead-page__grid">
        <LeadAiSummary summary={lead.aiSummary} updated={lead.aiUpdated} />

        <LeadScore score={lead.score} label={lead.scoreLabel} />

        <div className="lead-page__span">
          <LeadParams lead={lead} />
        </div>

        <LeadNotes key={lead.id} initialNotes={lead.notes} />

        <LeadTimeline events={lead.activityHistory} />
      </div>
    </div>
  )
}

export default LeadPage
