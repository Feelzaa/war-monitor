import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { regionList, typeList, severityList, severityConfig } from '../data/conflicts'

export default function FilterPanel({ filters, setFilters, searchRef }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  const clear = () => setFilters({ severity: [], region: [], type: [], search: '' })
  const hasFilters = filters.severity.length || filters.region.length || filters.type.length || filters.search
  const activeCount = filters.severity.length + filters.region.length + filters.type.length + (filters.search ? 1 : 0)

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-slate-700/30">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 text-xs">🔍</span>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search conflicts, countries, parties..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-slate-800/60 border border-slate-700/40 rounded-lg pl-8 pr-8 py-3 lg:py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span className="font-mono uppercase tracking-wider flex items-center gap-2">
          Filters
          {activeCount > 0 && (
            <span className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded-md text-[10px] font-medium">
              {activeCount}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-600"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-3 pt-0 space-y-3">
              {/* Severity */}
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase mb-1.5">Severity</div>
                <div className="flex flex-wrap gap-1.5">
                  {severityList.map(s => (
                    <button
                      key={s}
                      onClick={() => toggle('severity', s)}
                      className={`px-3 py-2 lg:px-2 lg:py-1 rounded-md text-xs lg:text-[11px] font-medium transition-all border min-h-[44px] lg:min-h-0 ${
                        filters.severity.includes(s)
                          ? ''
                          : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border-transparent hover:border-slate-600/50'
                      }`}
                      style={
                        filters.severity.includes(s)
                          ? {
                              backgroundColor: severityConfig[s].color + '18',
                              borderColor: severityConfig[s].color + '40',
                              color: severityConfig[s].color,
                            }
                          : {}
                      }
                    >
                      {severityConfig[s].icon} {severityConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region */}
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase mb-1.5">Region</div>
                <div className="flex flex-wrap gap-1.5">
                  {regionList.map(r => (
                    <button
                      key={r}
                      onClick={() => toggle('region', r)}
                      className={`px-3 py-2 lg:px-2 lg:py-1 rounded-md text-xs lg:text-[11px] font-medium transition-all border min-h-[44px] lg:min-h-0 ${
                        filters.region.includes(r)
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border-transparent hover:border-slate-600/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase mb-1.5">Conflict Type</div>
                <div className="flex flex-wrap gap-1.5">
                  {typeList.map(t => (
                    <button
                      key={t}
                      onClick={() => toggle('type', t)}
                      className={`px-3 py-2 lg:px-2 lg:py-1 rounded-md text-xs lg:text-[11px] font-medium transition-all border min-h-[44px] lg:min-h-0 ${
                        filters.type.includes(t)
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : 'bg-slate-800/50 text-slate-500 hover:text-slate-300 border-transparent hover:border-slate-600/50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters && (
                <button
                  onClick={clear}
                  className="w-full py-1.5 rounded-lg text-xs text-slate-500 hover:text-red-400 bg-slate-800/30 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
