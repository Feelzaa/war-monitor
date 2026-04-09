import { motion } from 'framer-motion'
import { severityConfig } from '../data/conflicts'

function getDuration(startDate) {
  const start = new Date(startDate)
  const now = new Date()
  const years = now.getFullYear() - start.getFullYear()
  const months = now.getMonth() - start.getMonth()
  const totalMonths = years * 12 + months
  if (totalMonths < 12) return `${totalMonths}mo`
  const y = Math.floor(totalMonths / 12)
  const m = totalMonths % 12
  return m > 0 ? `${y}y ${m}mo` : `${y}y`
}

export default function ConflictDetail({ conflicts, selected, onSelect }) {
  const sorted = [...conflicts].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, watchlist: 4 }
    return (order[a.severity] ?? 5) - (order[b.severity] ?? 5)
  })

  const display = selected ? [selected] : sorted

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
      {display.map((conflict, i) => {
        const sev = severityConfig[conflict.severity]
        const duration = getDuration(conflict.startDate)
        return (
          <motion.div
            key={conflict.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05, ease: 'easeOut' }}
            className={`glass rounded-xl p-5 hover:border-slate-600/40 transition-all cursor-pointer relative overflow-hidden ${sev.cardClass}`}
            onClick={() => onSelect(selected?.id === conflict.id ? null : conflict)}
          >
            {/* Severity gradient top border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, ${sev.color}, ${sev.color}40, transparent)` }}
            />

            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${sev.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: sev.color, boxShadow: `0 0 8px ${sev.color}50` }}
                  />
                  <h3 className="text-lg font-bold text-slate-100">{conflict.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{conflict.country}</span>
                  <span className="text-slate-700">•</span>
                  <span>{conflict.region}</span>
                  <span className="text-slate-700">•</span>
                  <span>{conflict.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/60 text-slate-400 border border-slate-700/40"
                  title="Duration"
                >
                  ⏱ {duration}
                </span>
                <span
                  className="px-2.5 py-1 rounded-lg text-xs font-mono uppercase font-medium"
                  style={{
                    backgroundColor: sev.color + '18',
                    color: sev.color,
                    border: `1px solid ${sev.color}35`,
                  }}
                >
                  {sev.label}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {conflict.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatBox label="Casualties" value={conflict.casualties} color="#ff4757" icon="💀" />
              <StatBox label="Displaced" value={conflict.displaced} color="#ffa502" icon="🏚️" />
              <StatBox label="Start Date" value={conflict.startDate} color="#94a3b8" icon="📅" />
              <StatBox label="Last Update" value={conflict.lastUpdate} color="#22d3ee" icon="🔄" />
            </div>

            {/* Parties - VS layout */}
            <div className="mb-3">
              <div className="text-[10px] text-slate-500 font-mono uppercase mb-2">Parties Involved</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {conflict.parties.map((party, pi) => (
                  <span key={party} className="flex items-center gap-1.5">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/40 font-medium">
                      {party}
                    </span>
                    {pi < conflict.parties.length - 1 && (
                      <span className="text-[10px] text-slate-600 font-mono">vs</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-700/30">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: sev.color, boxShadow: `0 0 6px ${sev.color}50` }}
              />
              <span className="text-xs text-slate-500 font-mono">{conflict.status}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function StatBox({ label, value, color, icon }) {
  return (
    <div className="bg-slate-800/30 rounded-lg p-2.5 border border-slate-700/30 hover:border-slate-600/40 transition-colors">
      <div className="flex items-center gap-1 mb-1">
        <span className="text-[10px]">{icon}</span>
        <span className="text-[10px] text-slate-500 font-mono uppercase">{label}</span>
      </div>
      <div className="text-sm font-mono font-semibold" style={{ color }}>{value}</div>
    </div>
  )
}
