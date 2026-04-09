import { severityConfig } from '../data/conflicts'

export default function StatsCards({ conflicts, allConflicts }) {
  const bySeverity = {}
  for (const c of conflicts) {
    bySeverity[c.severity] = (bySeverity[c.severity] || 0) + 1
  }

  const totalDisplaced = conflicts.reduce((sum, c) => {
    const match = (c.displaced || '').match(/([\d,]+)/)
    if (match) return sum + parseInt(match[1].replace(/,/g, ''))
    return sum
  }, 0)

  const activeCount = conflicts.filter(c =>
    c.severity === 'critical' || c.severity === 'high'
  ).length

  const cards = [
    {
      label: 'Active Conflicts',
      value: conflicts.length,
      sub: `${activeCount} critical/high`,
      color: 'text-red-400',
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
    },
    {
      label: 'Critical',
      value: bySeverity.critical || 0,
      sub: 'Immediate attention',
      color: 'text-red-400',
      border: 'border-red-500/20',
      bg: 'bg-red-500/5',
    },
    {
      label: 'High Severity',
      value: bySeverity.high || 0,
      sub: 'Major conflicts',
      color: 'text-orange-400',
      border: 'border-orange-500/20',
      bg: 'bg-orange-500/5',
    },
    {
      label: 'Displaced People',
      value: totalDisplaced > 1_000_000
        ? `${(totalDisplaced / 1_000_000).toFixed(1)}M+`
        : `${(totalDisplaced / 1_000).toFixed(0)}K+`,
      sub: 'Refugees & IDPs',
      color: 'text-amber-400',
      border: 'border-amber-500/20',
      bg: 'bg-amber-500/5',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-3 transition-all hover:scale-[1.02]`}
        >
          <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">
            {card.label}
          </div>
          <div className={`text-2xl font-bold font-mono ${card.color}`}>
            {card.value}
          </div>
          <div className="text-[10px] text-gray-600 mt-0.5">{card.sub}</div>
        </div>
      ))}
    </div>
  )
}
