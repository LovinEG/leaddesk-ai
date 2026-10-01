import { CalendarClock, MapPin, Phone, Ruler, Send, Wallet } from 'lucide-react'

import Card from '../ui/Card.jsx'
import './LeadParams.css'

function LeadParams({ lead }) {
  const items = [
    { id: 'type', icon: Ruler, label: 'Тип заказа', value: lead.requestType },
    {
      id: 'budget',
      icon: Wallet,
      label: 'Бюджет',
      value: lead.budget || 'не указан',
      muted: !lead.budget,
    },
    { id: 'city', icon: MapPin, label: 'Город', value: lead.city },
    { id: 'deadline', icon: CalendarClock, label: 'Срок', value: lead.deadline },
    {
      id: 'source',
      icon: Send,
      label: 'Источник',
      value: lead.source,
      accent: true,
    },
    {
      id: 'contact',
      icon: Phone,
      label: 'Контакт',
      value: lead.phone,
      hint: lead.username,
    },
  ]

  return (
    <Card className="lead-params">
      <h2 className="lead-params__title">Параметры заявки</h2>

      <div className="lead-params__grid">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <div
              className={
                item.accent
                  ? 'lead-params__item lead-params__item--accent'
                  : 'lead-params__item'
              }
              key={item.id}
            >
              <span className="lead-params__icon" aria-hidden="true">
                <Icon size={15} strokeWidth={1.9} />
              </span>

              <span className="lead-params__body">
                <span className="lead-params__label">{item.label}</span>
                <span
                  className={
                    item.muted
                      ? 'lead-params__value lead-params__value--muted'
                      : 'lead-params__value'
                  }
                >
                  {item.value}
                </span>
                {item.hint ? (
                  <span className="lead-params__hint">{item.hint}</span>
                ) : null}
              </span>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default LeadParams