import { motion } from 'framer-motion'

const SEVERITY_COLORS = {
  critical: '#ff4757',
  high:     '#ff6348',
  medium:   '#ffa502',
  low:      '#2ed573',
  watchlist: '#5352ed',
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low', 'watchlist']

export default function RegionChart({ conflicts = [] }) {
  // Group by region with severity breakdown
  const regionMap = {}
  conflicts.forEach(c => {
    if (!regionMap[c.region]) regionMap[c.region] = { total: 0, severities: {} }
    regionMap[c.region].total++
    regionMap[c.region].severities[c.severity] =
      (regionMap[c.region].severities[c.severity] || 0) + 1
  })

  const regions = Object.entries(regionMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)

  const maxCount = Math.max(...regions.map(r => r.total), 1)

  return (
    <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 max-w-[380px]">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">
        Conflicts by Region
      </h3>

      <div className="space-y-2.5">
        {regions.map((region, i) => {
          const barWidth = (region.total / maxCount) * 100

          // Build stacked segments as percentages of the bar
          let segOffset = 0
          const segs = SEVERITY_ORDER
            .filter(sev => region.severities[sev])
            .map(sev => {
              const count = region.severities[sev]
              const width = (count / region.total) * 100
              const seg = { sev, width, offset: segOffset }
              segOffset += width
              return seg
            })

          return (
            <div key={region.name} className="flex items-center gap-2">
              {/* Region label */}
              <span className="text-xs text-slate-400 w-20 shrink-0 text-right truncate">
                {region.name}
              </span>

              {/* Bar container */}
              <div className="flex-1 h-5 relative">
                <div className="absolute inset-0 bg-slate-800/60 rounded" />

                <motion.div
                  className="h-full relative rounded overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                >
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="w-full h-full"
                  >
                    {segs.map(seg => (
                      <rect
                        key={seg.sev}
                        x={seg.offset}
                        y="0"
                        width={seg.width}
                        height="100"
                        fill={SEVERITY_COLORS[seg.sev]}
                        rx="0"
                      />
                    ))}
                  </svg>
                </motion.div>
              </div>

              {/* Count */}
              <motion.span
                className="text-xs font-medium text-slate-200 w-5 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              >
                {region.total}
              </motion.span>
            </div>
          )
        })}
      </div>

      {/* Mini severity legend */}
      <div className="mt-3 pt-2 border-t border-slate-700/30 flex flex-wrap gap-3">
        {SEVERITY_ORDER.map(sev => (
          <div key={sev} className="flex items-center gap-1 text-[10px] text-slate-500">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: SEVERITY_COLORS[sev] }}
            />
            {sev}
          </div>
        ))}
      </div>
    </div>
  )
}
