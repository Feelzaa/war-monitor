import { useEffect, useMemo, useRef, useState } from 'react'
import { severityConfig } from '../data/conflicts'

export default function NewsTicker({ conflicts }) {
  const critical = useMemo(() =>
    conflicts.filter(c => c.severity === 'critical' || c.severity === 'high'),
    [conflicts]
  )

  const items = useMemo(() =>
    critical.map(c => ({
      text: `${severityConfig[c.severity].icon} ${c.name} — ${c.status}`,
      color: severityConfig[c.severity].color,
    })),
    [critical]
  )

  // Duplicate items for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/30 overflow-hidden h-8 flex items-center">
      <div className="shrink-0 px-3 py-1 bg-gradient-to-r from-red-600/20 to-red-600/5 border-r border-red-500/20 flex items-center gap-1.5 h-full z-10">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
        <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider">Alert</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex items-center gap-10 whitespace-nowrap ticker-scroll">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="text-xs font-mono inline-flex items-center gap-1"
              style={{ color: item.color + 'cc' }}
            >
              {item.text}
              <span className="text-slate-700 mx-2">│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
