import { severityConfig } from '../data/conflicts'

export default function ConflictDetail({ conflicts, selected, onSelect }) {
  const sorted = [...conflicts].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, watchlist: 4 }
    return (order[a.severity] ?? 5) - (order[b.severity] ?? 5)
  })

  const display = selected ? [selected] : sorted

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
      {display.map(conflict => {
        const sev = severityConfig[conflict.severity]
        return (
          <div
            key={conflict.id}
            className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-5 hover:border-gray-700/50 transition-all cursor-pointer"
            onClick={() => onSelect(selected?.id === conflict.id ? null : conflict)}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${sev.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: sev.color }}
                  />
                  <h3 className="text-lg font-bold text-gray-100">{conflict.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{conflict.country}</span>
                  <span className="text-gray-700">•</span>
                  <span>{conflict.region}</span>
                  <span className="text-gray-700">•</span>
                  <span>{conflict.type}</span>
                </div>
              </div>
              <span
                className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono uppercase font-medium"
                style={{
                  backgroundColor: sev.color + '20',
                  color: sev.color,
                  border: `1px solid ${sev.color}40`,
                }}
              >
                {sev.label}
              </span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {conflict.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatBox label="Casualties" value={conflict.casualties} color="text-red-400" />
              <StatBox label="Displaced" value={conflict.displaced} color="text-amber-400" />
              <StatBox label="Start Date" value={conflict.startDate} color="text-gray-300" />
              <StatBox label="Last Update" value={conflict.lastUpdate} color="text-emerald-400" />
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-[10px] text-gray-500 font-mono uppercase self-center mr-1">
                Parties:
              </span>
              {conflict.parties.map(party => (
                <span
                  key={party}
                  className="text-xs px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400 border border-gray-700/50"
                >
                  {party}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-800/50">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: sev.color }}
              />
              <span className="text-xs text-gray-500 font-mono">{conflict.status}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-gray-800/30 rounded-lg p-2.5 border border-gray-800/50">
      <div className="text-[10px] text-gray-500 font-mono uppercase mb-1">{label}</div>
      <div className={`text-sm font-mono font-semibold ${color}`}>{value}</div>
    </div>
  )
}
