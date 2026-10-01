import { Sparkles } from 'lucide-react'

import Card from '../ui/Card.jsx'
import './LeadAiSummary.css'

function LeadAiSummary({ summary, updated }) {
  return (
    <Card className="lead-ai">
      <header className="lead-ai__header">
        <span className="lead-ai__icon" aria-hidden="true">
          <Sparkles size={15} strokeWidth={1.9} />
        </span>

        <div className="lead-ai__heading">
          <h2 className="lead-ai__title">AI-сводка</h2>
          <p className="lead-ai__updated">{updated}</p>
        </div>
      </header>

      <p className="lead-ai__text">{summary}</p>
    </Card>
  )
}

export default LeadAiSummary