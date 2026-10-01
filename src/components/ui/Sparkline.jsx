import { useId } from 'react'

import './Sparkline.css'

const WIDTH = 92
const HEIGHT = 30
const PADDING = 3

function toPoints(values) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const span = max - min || 1
  const step = (WIDTH - PADDING * 2) / (values.length - 1)

  return values.map((value, index) => [
    PADDING + index * step,
    HEIGHT - PADDING - ((value - min) / span) * (HEIGHT - PADDING * 2),
  ])
}

function Sparkline({ values, accent = 'blue' }) {
  const gradientId = `sparkline-${useId().replace(/:/g, '')}`
  const points = toPoints(values)

  const line = points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')

  const first = points[0]
  const last = points[points.length - 1]
  const area = `${line} L${last[0].toFixed(1)} ${HEIGHT} L${first[0].toFixed(1)} ${HEIGHT} Z`

  return (
    <svg
      className={`sparkline sparkline--${accent}`}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path className="sparkline__area" d={area} fill={`url(#${gradientId})`} />
      <path
        className="sparkline__line"
        d={line}
        fill="none"
        stroke="currentColor"
      />
    </svg>
  )
}

export default Sparkline