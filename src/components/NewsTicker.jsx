import { useState, useEffect, useRef } from 'react'
import { severityConfig } from '../data/conflicts'

export default function NewsTicker({ conflicts }) {
  const [offset, setOffset] = useState(0)
  const containerRef = useRef(null)

  const critical = conflicts.filter(c => c.severity === 'critical' || c.severity === 'high')
  const items = critical.map(c => ({
    text: `${severityConfig[c.severity].icon} ${c.name} — ${c.status}`,
    color: severityConfig[c.severity].color,
  }))

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => prev - 1)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // Reset position when scrolled past all items
  const repeated = [...items, ...items, ...items]

  return (
    <div className="bg-gray-900/80 border-b border-gray-800/30 overflow-hidden h-7 flex items-center">
      <div className="shrink-0 px-3 py-1 bg-red-600/20 border-r border-red-500/30 flex items-center gap-1.5 h-full z-10">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider">Alert</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-8 whitespace-nowrap absolute"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {repeated.map((item, i) => (
            <span key={i} className="text-xs font-mono" style={{ color: item.color + 'cc' }}>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
