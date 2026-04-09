import { motion } from 'framer-motion'
import { severityConfig } from '../data/conflicts'

function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {value}
    </motion.span>
  )
}

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

  const totalCasualties = conflicts.reduce((sum, c) => {
    const match = (c.casualties || '').match(/([\d,]+)/)
    if (match) return sum + parseInt(match[1].replace(/,/g, ''))
    return sum
  }, 0)

  const cards = [
    {
      label: 'Active Conflicts',
      value: conflicts.length,
      sub: `${activeCount} critical/high`,
      color: '#ff4757',
      icon: '⚔️',
      pct: (conflicts.length / Math.max(allConflicts.length, 1)) * 100,
    },
    {
      label: 'Critical',
      value: bySeverity.critical || 0,
      sub: 'Immediate attention',
      color: '#ff4757',
      icon: '🔴',
      pct: ((bySeverity.critical || 0) / Math.max(conflicts.length, 1)) * 100,
    },
    {
      label: 'Casualties',
      value: totalCasualties > 1_000_000
        ? `${(totalCasualties / 1_000_000).toFixed(1)}M+`
        : `${(totalCasualties / 1_000).toFixed(0)}K+`,
      sub: 'Estimated total',
      color: '#ff6348',
      icon: '💀',
      pct: 100,
    },
    {
      label: 'Displaced',
      value: totalDisplaced > 1_000_000
        ? `${(totalDisplaced / 1_000_000).toFixed(1)}M+`
        : `${(totalDisplaced / 1_000).toFixed(0)}K+`,
      sub: 'Refugees & IDPs',
      color: '#ffa502',
      icon: '🏚️',
      pct: 100,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
          className="glass rounded-xl p-3 transition-all hover:scale-[1.02] group cursor-default relative overflow-hidden"
          style={{ borderColor: card.color + '25' }}
        >
          {/* Subtle gradient bg */}
          <div
            className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
            style={{ background: `radial-gradient(ellipse at top right, ${card.color}, transparent 70%)` }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                {card.label}
              </span>
              <span className="text-sm">{card.icon}</span>
            </div>
            <div className="text-2xl font-bold font-mono" style={{ color: card.color }}>
              <AnimatedNumber value={card.value} />
            </div>
            <div className="text-[10px] text-slate-600 mt-0.5">{card.sub}</div>

            {/* Mini progress bar */}
            <div className="mt-2 h-1 bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(card.pct, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.08, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: card.color + '80' }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
