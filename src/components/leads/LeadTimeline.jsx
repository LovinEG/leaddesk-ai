import { History } from 'lucide-react'

import Card from '../ui/Card.jsx'
import './LeadTimeline.css'

function LeadTimeline({ events }) {
  return (
    <Card className="lead-timeline">
      <header className="lead-timeline__header">
        <span className="lead-timeline__icon" aria-hidden="true">
          <History size={15} strokeWidth={1.9} />
        </span>
        <h2 className="lead-timeline__title">История</h2>
      </header>

      <ol className="lead-timeline__list">
        {events.map((event) => (
          <li className="lead-timeline__item" key={event.id}>
            <span className="lead-timeline__dot" aria-hidden="true" />
            <span className="lead-timeline__text">{event.title}</span>
            <span className="lead-timeline__time">{event.time}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}

export default LeadTimeline