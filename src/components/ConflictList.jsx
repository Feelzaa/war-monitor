import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { severityConfig } from '../data/conflicts'

const SORT_OPTIONS = [
  { value: 'severity', label: 'Severity' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'date', label: 'Start Date' },
  { value: 'updated', label: 'Last Updated' },
]

const ConflictList = forwardRef(function ConflictList({ conflicts, selected, onSelect }, ref) {
  const [sortBy, setSortBy] = useState('severity')
  const [focusIndex, setFocusIndex] = useState(-1)
  const listRef = useRef(null)
  const itemRefs = useRef({})

  const sorted = [...conflicts].sort((a, b) => {
    switch (sortBy) {
      case 'severity': {
        const order = { critical: 0, high: 1, medium: 2, low: 3, watchlist: 4 }
        return (order[a.severity] ?? 5) - (order[b.severity] ?? 5)
      }
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(a.startDate) - new Date(b.startDate)
      case 'updated':
        return new Date(b.lastUpdate) - new Date(a.lastUpdate)
      default:
        return 0
    }
  })

  useImperativeHandle(ref, () => ({
    navigate(direction) {
      setFocusIndex(prev => {
        const next = direction === 'down'
          ? Math.min(prev + 1, sorted.length - 1)
          : Math.max(prev - 1, 0)
        return next
      })
    },
    selectCurrent() {
      if (focusIndex >= 0 && focusIndex < sorted.length) {
        onSelect(sorted[focusIndex])
      }
    },
  }))

  useEffect(() => {
    if (focusIndex >= 0 && sorted[focusIndex]) {
      const id = sorted[focusIndex].id
      itemRefs.current[id]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [focusIndex, sorted])

  return (
    <div className="flex-1 glass rounded-xl overflow-hidden flex flex-col min-h-0">
      <div className="px-3 py-2 border-b border-slate-700/30 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
          Index — {conflicts.length}
        </span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-[10px] bg-slate-800/60 border border-slate-700/40 rounded-md px-1.5 py-0.5 text-slate-400 focus:outline-none focus:border-cyan-500/40 cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto max-h-[calc(100vh-580px)] lg:max-h-[calc(100vh-520px)]">
        <AnimatePresence mode="popLayout">
          {sorted.map((conflict, i) => {
            const sev = severityConfig[conflict.severity]
            const isSelected = selected?.id === conflict.id
            const isFocused = focusIndex === i
            return (
              <motion.button
                ref={el => { itemRefs.current[conflict.id] = el }}
                key={conflict.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                onClick={() => onSelect(isSelected ? null : conflict)}
                className={`w-full text-left px-3 py-2.5 border-b border-slate-800/30 transition-all hover:bg-slate-800/40 group ${
                  isSelected
                    ? 'bg-slate-800/60 border-l-2'
                    : isFocused
                    ? 'bg-slate-800/30 border-l-2 border-l-cyan-500/50'
                    : 'border-l-2 border-l-transparent'
                }`}
                style={isSelected ? { borderLeftColor: sev.color } : {}}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${sev.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: sev.color, boxShadow: `0 0 6px ${sev.color}40` }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-200 truncate group-hover:text-slate-100 transition-colors">
                      {conflict.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500">{conflict.country}</span>
                      <span className="text-[10px] text-slate-700">•</span>
                      <span
                        className="text-[10px] font-mono uppercase font-medium"
                        style={{ color: sev.color }}
                      >
                        {sev.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5 truncate">
                      {conflict.status}
                    </div>
                    {/* Hover preview */}
                    {(isSelected || isFocused) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-1.5 flex gap-3 text-[10px]"
                      >
                        <span className="text-slate-600">☠️ <span style={{ color: '#ff4757' }}>{conflict.casualties}</span></span>
                        <span className="text-slate-600">🏚️ <span style={{ color: '#ffa502' }}>{conflict.displaced}</span></span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
        {conflicts.length === 0 && (
          <div className="p-8 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-slate-500 text-sm">No conflicts match filters</div>
            <div className="text-slate-600 text-xs mt-1">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ConflictList
