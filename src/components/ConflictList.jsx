import { severityConfig } from '../data/conflicts'

export default function ConflictList({ conflicts, selected, onSelect }) {
  const sorted = [...conflicts].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3, watchlist: 4 }
    return (order[a.severity] ?? 5) - (order[b.severity] ?? 5)
  })

  return (
    <div className="flex-1 bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden flex flex-col min-h-0">
      <div className="px-3 py-2 border-b border-gray-800/50">
        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
          Conflict Index — {conflicts.length} entries
        </span>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-580px)] lg:max-h-[calc(100vh-480px)]">
        {sorted.map(conflict => {
          const sev = severityConfig[conflict.severity]
          const isSelected = selected?.id === conflict.id
          return (
            <button
              key={conflict.id}
              onClick={() => onSelect(isSelected ? null : conflict)}
              className={`w-full text-left px-3 py-2.5 border-b border-gray-800/30 transition-all hover:bg-gray-800/50 ${
                isSelected ? 'bg-gray-800/70 border-l-2' : 'border-l-2 border-l-transparent'
              }`}
              style={isSelected ? { borderLeftColor: sev.color } : {}}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    sev.pulse ? 'animate-pulse' : ''
                  }`}
                  style={{ backgroundColor: sev.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-200 truncate">
                    {conflict.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500">{conflict.country}</span>
                    <span className="text-[10px] text-gray-700">•</span>
                    <span
                      className="text-[10px] font-mono uppercase"
                      style={{ color: sev.color }}
                    >
                      {sev.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5 truncate">
                    {conflict.status}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
        {conflicts.length === 0 && (
          <div className="p-8 text-center text-gray-600 text-sm">
            No conflicts match the current filters
          </div>
        )}
      </div>
    </div>
  )
}
