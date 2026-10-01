import { Gauge } from 'lucide-react'

import Card from '../ui/Card.jsx'
import './LeadScore.css'

function LeadScore({ score, label }) {
  return (
    <Card className="lead-score">
      <header className="lead-score__header">
        <span className="lead-score__icon" aria-hidden="true">
          <Gauge size={15} strokeWidth={1.9} />
        </span>
        <h2 className="lead-score__title">Качество лида</h2>
      </header>

      <p className="lead-score__value">
        <span className="lead-score__number">{score}</span>
        <span className="lead-score__total">/ 100</span>
      </p>

      <div
        className="lead-score__bar"
        role="progressbar"
        aria-label="Качество лида"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="lead-score__fill" style={{ width: `${score}%` }} />
      </div>

      <p className="lead-score__label">{label}</p>
    </Card>
  )
}

export default LeadScore