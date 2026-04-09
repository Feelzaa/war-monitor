import { motion } from 'framer-motion'

const SEVERITY_COLORS = {
  critical: '#ff4757',
  high:     '#ff6348',
  medium:   '#ffa502',
  low:      '#2ed573',
  watchlist: '#5352ed',
}

function parseYear(dateStr) {
  return new Date(dateStr).getFullYear()
}

export default function TimelineView({ conflicts = [], selected, onSelect }) {
  if (!conflicts.length) return null

  const now = new Date()
  const nowMs = now.getTime()

  const sorted = [...conflicts].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  // Determine time range
  const earliestMs = new Date(sorted[0].startDate).getTime()
  const totalSpan = nowMs - earliestMs

  const toPercent = (ms) => ((ms - earliestMs) / totalSpan) * 100

  // Year markers
  const startYear = parseYear(sorted[0].startDate)
  const endYear = now.getFullYear()
  const years = []
  for (let y = startYear; y <= endYear; y++) {
    const ms = new Date(`${y}-01-01`).getTime()
    if (ms >= earliestMs && ms <= nowMs) {
      years.push({ year: y, pct: toPercent(ms) })
    }
  }

  // Only show every Nth year to avoid crowding
  const step = years.length > 20 ? 5 : years.length > 10 ? 2 : 1
  const visibleYears = years.filter((_, i) => i % step === 0)

  const rowHeight = 32
  const labelWidth = 160
  const chartPadding = 8

  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">
        Conflict Timeline
      </h3>

      {/* Scrollable container */}
      <div className="overflow-x-auto overflow-y-auto max-h-[520px] scrollbar-thin scrollbar-thumb-slate-700">
        <div style={{ minWidth: 500 }}>
          {/* Year axis */}
          <div className="flex" style={{ paddingLeft: labelWidth + chartPadding }}>
            <div className="relative w-full h-5">
              {visibleYears.map(({ year, pct }) => (
                <span
                  key={year}
                  className="absolute text-[10px] text-slate-500 -translate-x-1/2"
                  style={{ left: `${pct}%` }}
                >
                  {year}
                </span>
              ))}
            </div>
          </div>

          {/* Tick marks + grid */}
          <div className="flex" style={{ paddingLeft: labelWidth + chartPadding }}>
            <div className="relative w-full h-2 border-b border-slate-700/40">
              {visibleYears.map(({ year, pct }) => (
                <span
                  key={year}
                  className="absolute w-px h-2 bg-slate-600"
                  style={{ left: `${pct}%` }}
                />
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="relative mt-1">
            {/* Vertical grid lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ left: labelWidth + chartPadding }}
            >
              {visibleYears.map(({ year, pct }) => (
                <div
                  key={year}
                  className="absolute top-0 bottom-0 w-px bg-slate-700/20"
                  style={{ left: `${pct}%` }}
                />
              ))}
            </div>

            {sorted.map((conflict, i) => {
              const startMs = new Date(conflict.startDate).getTime()
              const leftPct = toPercent(startMs)
              const widthPct = toPercent(nowMs) - leftPct
              const isSelected = selected === conflict.id
              const barColor = SEVERITY_COLORS[conflict.severity] || '#64748b'

              return (
                <motion.div
                  key={conflict.id}
                  className="flex items-center group"
                  style={{ height: rowHeight }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: 'easeOut' }}
                >
                  {/* Label */}
                  <button
                    onClick={() => onSelect?.(conflict.id)}
                    className="text-left shrink-0 pr-2 truncate text-xs transition-colors"
                    style={{ width: labelWidth }}
                    title={conflict.name}
                  >
                    <span
                      className={
                        isSelected
                          ? 'text-slate-100 font-semibold'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }
                    >
                      {conflict.name}
                    </span>
                  </button>

                  {/* Bar area */}
                  <div className="flex-1 relative h-4">
                    <motion.div
                      className="absolute top-0.5 h-3 rounded-sm cursor-pointer transition-all"
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.max(widthPct, 0.5)}%`,
                        backgroundColor: barColor,
                        opacity: isSelected ? 1 : 0.7,
                        boxShadow: isSelected
                          ? `0 0 8px ${barColor}88, inset 0 0 0 1px rgba(255,255,255,0.3)`
                          : 'none',
                      }}
                      whileHover={{ opacity: 1, scaleY: 1.3 }}
                      onClick={() => onSelect?.(conflict.id)}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + i * 0.04,
                        ease: 'easeOut',
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Severity legend */}
      <div className="mt-3 pt-2 border-t border-slate-700/30 flex flex-wrap gap-3">
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <span
              className="w-2.5 h-1.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
            {sev}
          </div>
        ))}
      </div>
    </div>
  )
}
