import './Badge.css'

const TONE_CLASS = {
  hot: 'badge--hot',
  ai: 'badge--ai',
  new: 'badge--new',
  qualified: 'badge--qualified',
  takeover: 'badge--takeover',
  accent: 'badge--hot',
  neutral: 'badge--ai',
  muted: 'badge--new',
}

function Badge({ children, tone = 'new' }) {
  const toneClass = TONE_CLASS[tone] || TONE_CLASS.new

  return <span className={`badge ${toneClass}`}>{children}</span>
}

export default Badge