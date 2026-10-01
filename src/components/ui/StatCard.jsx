import Card from './Card.jsx'
import Sparkline from './Sparkline.jsx'
import './StatCard.css'

function StatCard({ label, value, meta, icon: Icon, accent = 'blue', trend }) {
  return (
    <Card className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>

        {Icon ? (
          <span className="stat-card__icon" aria-hidden="true">
            <Icon size={15} strokeWidth={1.9} />
          </span>
        ) : null}
      </div>

      <span className="stat-card__value">{value}</span>

      <div className="stat-card__bottom">
        {meta ? <span className="stat-card__meta">{meta}</span> : null}
        {trend ? <Sparkline values={trend} accent={accent} /> : null}
      </div>
    </Card>
  )
}

export default StatCard