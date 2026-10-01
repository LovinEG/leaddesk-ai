import {
  ArrowUpRight,
  Flame,
  MessagesSquare,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import RecentLeadsCard from '../components/leads/RecentLeadsCard.jsx'
import StatCard from '../components/ui/StatCard.jsx'
import './DashboardPage.css'

const STATS = [
  {
    id: 'dialogues',
    label: 'Новые диалоги',
    value: 24,
    meta: 'за последние 24 часа',
    icon: MessagesSquare,
    accent: 'blue',
    trend: [4, 7, 6, 11, 9, 14, 13, 18],
  },
  {
    id: 'qualified',
    label: 'Квалифицированы',
    value: 11,
    meta: 'из 24 диалогов',
    icon: UserCheck,
    accent: 'violet',
    trend: [2, 3, 5, 4, 7, 6, 9, 11],
  },
  {
    id: 'hot',
    label: 'Горячие лиды',
    value: 5,
    meta: 'готовы к звонку',
    icon: Flame,
    accent: 'purple',
    trend: [1, 2, 2, 3, 2, 4, 4, 5],
  },
  {
    id: 'manager',
    label: 'Требуют менеджера',
    value: 3,
    meta: 'ожидают ответа',
    icon: UserRound,
    accent: 'cyan',
    trend: [0, 1, 1, 2, 1, 2, 3, 3],
  },
]

const RECENT_LEADS = [
  {
    id: 'andrey',
    name: 'Андрей',
    project: 'Кухня',
    source: 'Telegram',
    status: 'HOT',
    tone: 'hot',
  },
  {
    id: 'maria',
    name: 'Мария',
    project: 'Шкаф',
    source: 'Telegram',
    status: 'AI общается',
    tone: 'ai',
  },
  {
    id: 'igor',
    name: 'Игорь',
    project: 'Кухня',
    source: 'Telegram',
    status: 'NEW',
    tone: 'new',
  },
  {
    id: 'anna',
    name: 'Анна',
    project: 'Гардеробная',
    source: 'Telegram',
    status: 'QUALIFIED',
    tone: 'qualified',
  },
]

function DashboardPage() {
  return (
    <div className="dashboard">
      <section className="dashboard__hero">
        <div className="dashboard__hero-body">
          <span className="dashboard__hero-chip">
            <Sparkles size={13} strokeWidth={1.9} aria-hidden="true" />
            AI-ассистент активен
          </span>

          <h2 className="dashboard__hero-title">
            Добро пожаловать в LeadDesk AI
          </h2>

          <p className="dashboard__hero-text">
            AI-ассистент ведёт диалоги в Telegram, квалифицирует лиды и передаёт
            менеджеру только готовые к продаже обращения.
          </p>

          <div className="dashboard__hero-actions">
            <Link to="/leads" className="dashboard__cta">
              Открыть лиды
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>

            <span className="dashboard__hero-meta">
              <TrendingUp size={14} strokeWidth={1.9} aria-hidden="true" />
              +18% диалогов к прошлой неделе
            </span>
          </div>
        </div>
      </section>

      <div className="dashboard__stats">
        {STATS.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            meta={stat.meta}
            icon={stat.icon}
            accent={stat.accent}
            trend={stat.trend}
          />
        ))}
      </div>

      <RecentLeadsCard leads={RECENT_LEADS} />
    </div>
  )
}

export default DashboardPage