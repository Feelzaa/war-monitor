import { motion } from 'framer-motion'

const SEVERITY_COLORS = {
  critical:  { label: 'Critical',  color: '#ff4757' },
  high:      { label: 'High',      color: '#ff6348' },
  medium:    { label: 'Medium',    color: '#ffa502' },
  low:       { label: 'Low',       color: '#2ed573' },
  watchlist: { label: 'Watchlist',  color: '#5352ed' },
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'watchlist']

export default function SeverityChart({ conflicts = [] }) {
  const counts = SEVERITY_ORDER.reduce((acc, sev) => {
    acc[sev] = conflicts.filter(c => c.severity === sev).length
    return acc
  }, {})

  const total = conflicts.length
  const radius = 70
  const stroke = 18
  const cx = 100
  const cy = 100
  const circumference = 2 * Math.PI * radius

  // Build segments
  let accumulated = 0
  const segments = SEVERITY_ORDER.filter(sev => counts[sev] > 0).map(sev => {
    const fraction = counts[sev] / total
    const dashLength = fraction * circumference
    const dashOffset = -accumulated * circumference
    accumulated += fraction
    return { severity: sev, fraction, dashLength, dashOffset }
  })

  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 max-w-[380px]">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">
        Conflicts by Severity
      </h3>

      {/* SVG Donut */}
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" width="180" height="180">
          {/* Background ring */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none" stroke="#334155" strokeWidth={stroke}
          />

          {/* Animated segments */}
          {segments.map((seg, i) => (
            <motion.circle
              key={seg.severity}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={SEVERITY_COLORS[seg.severity].color}
              strokeWidth={stroke}
              strokeDasharray={`${seg.dashLength} ${circumference - seg.dashLength}`}
              strokeDashoffset={seg.dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
              initial={{ opacity: 0, strokeWidth: 0 }}
              animate={{ opacity: 1, strokeWidth: stroke }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
            />
          ))}

          {/* Center text */}
          <text
            x={cx} y={cy - 6}
            textAnchor="middle"
            className="fill-slate-100 text-3xl font-bold"
            style={{ fontSize: '32px', fontWeight: 700 }}
          >
            {total}
          </text>
          <text
            x={cx} y={cy + 14}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ fontSize: '11px' }}
          >
            conflicts
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {SEVERITY_ORDER.map((sev, i) => (
          <motion.div
            key={sev}
            className="flex items-center gap-2 text-xs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: SEVERITY_COLORS[sev].color }}
            />
            <span className="text-slate-400">{SEVERITY_COLORS[sev].label}</span>
            <span className="text-slate-200 font-medium ml-auto">{counts[sev]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
