import { useState } from 'react'
import { regionList, typeList, severityList, severityConfig } from '../data/conflicts'

export default function FilterPanel({ filters, setFilters }) {
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

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-gray-800/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conflicts, countries, parties..."
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-xs text-gray-400 hover:text-gray-200 transition-colors"
      >
        <span className="font-mono uppercase tracking-wider">
          Filters {hasFilters ? `(active)` : ''}
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="p-3 pt-0 space-y-3">
          {/* Severity */}
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase mb-1.5">Severity</div>
            <div className="flex flex-wrap gap-1.5">
              {severityList.map(s => (
                <button
                  key={s}
                  onClick={() => toggle('severity', s)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
                    filters.severity.includes(s)
                      ? 'border text-white'
                      : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 border border-transparent'
                  }`}
                  style={
                    filters.severity.includes(s)
                      ? {
                          backgroundColor: severityConfig[s].color + '20',
                          borderColor: severityConfig[s].color + '50',
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
            <div className="text-[10px] text-gray-500 font-mono uppercase mb-1.5">Region</div>
            <div className="flex flex-wrap gap-1.5">
              {regionList.map(r => (
                <button
                  key={r}
                  onClick={() => toggle('region', r)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                    filters.region.includes(r)
                      ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 border-transparent'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <div className="text-[10px] text-gray-500 font-mono uppercase mb-1.5">Conflict Type</div>
            <div className="flex flex-wrap gap-1.5">
              {typeList.map(t => (
                <button
                  key={t}
                  onClick={() => toggle('type', t)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all border ${
                    filters.type.includes(t)
                      ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-800/50 text-gray-500 hover:text-gray-300 border-transparent'
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
              className="w-full py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 bg-gray-800/30 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
