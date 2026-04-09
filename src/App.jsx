import { useState, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import SeverityChart from './components/SeverityChart'
import RegionChart from './components/RegionChart'
import ConflictMap from './components/ConflictMap'
import ConflictList from './components/ConflictList'
import ConflictDetail from './components/ConflictDetail'
import TimelineView from './components/TimelineView'
import FilterPanel from './components/FilterPanel'
import NewsTicker from './components/NewsTicker'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import { conflicts, severityList } from './data/conflicts'

const VIEWS = [
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'list', label: 'Detail', icon: '📋' },
  { id: 'timeline', label: 'Timeline', icon: '📊' },
]

export default function App() {
  const [selectedConflict, setSelectedConflict] = useState(null)
  const [filters, setFilters] = useState({
    severity: [],
    region: [],
    type: [],
    search: '',
  })
  const [view, setView] = useState('map')
  const searchRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    return conflicts.filter(c => {
      if (filters.severity.length && !filters.severity.includes(c.severity)) return false
      if (filters.region.length && !filters.region.includes(c.region)) return false
      if (filters.type.length && !filters.type.includes(c.type)) return false
      if (filters.search) {
        const q = filters.search.toLowerCase()
        return (
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.parties.some(p => p.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [filters])

  const handleSeverityToggle = useCallback((severity) => {
    const sevKeys = severityList
    const idx = parseInt(severity) - 1
    if (idx >= 0 && idx < sevKeys.length) {
      const key = sevKeys[idx]
      setFilters(prev => ({
        ...prev,
        severity: prev.severity.includes(key)
          ? prev.severity.filter(s => s !== key)
          : [...prev.severity, key],
      }))
    }
  }, [])

  const handleNavigateList = useCallback((direction) => {
    listRef.current?.navigate(direction)
  }, [])

  const handleSelectCurrent = useCallback(() => {
    listRef.current?.selectCurrent()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      <Header />
      <NewsTicker conflicts={conflicts} />

      <KeyboardShortcuts
        onViewChange={setView}
        onSearch={() => searchRef.current?.focus()}
        onSeverityToggle={handleSeverityToggle}
        onClearSelection={() => setSelectedConflict(null)}
        onNavigateList={handleNavigateList}
        onSelectCurrent={handleSelectCurrent}
      />

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-[1920px] mx-auto w-full">
        {/* Left panel */}
        <div className="lg:w-80 xl:w-96 flex flex-col gap-3 shrink-0">
          <StatsCards conflicts={filtered} allConflicts={conflicts} />
          <SeverityChart conflicts={filtered} />
          <RegionChart conflicts={filtered} />
          <FilterPanel filters={filters} setFilters={setFilters} searchRef={searchRef} />
          <ConflictList
            ref={listRef}
            conflicts={filtered}
            selected={selectedConflict}
            onSelect={setSelectedConflict}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* View toggle */}
          <div className="flex items-center gap-1.5">
            {VIEWS.map(v => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  view === v.id
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-800/30 text-slate-500 border-slate-700/30 hover:text-slate-300 hover:border-slate-600/40'
                }`}
              >
                {v.icon} {v.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-slate-600 font-mono">
              {filtered.length}/{conflicts.length} conflicts
              <span className="hidden sm:inline text-slate-700 ml-2">• Press ? for shortcuts</span>
            </span>
          </div>

          {/* Animated view switching */}
          <AnimatePresence mode="wait">
            {view === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <ConflictMap
                  conflicts={filtered}
                  selected={selectedConflict}
                  onSelect={setSelectedConflict}
                />
              </motion.div>
            )}
            {view === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <ConflictDetail
                  conflicts={filtered}
                  selected={selectedConflict}
                  onSelect={setSelectedConflict}
                />
              </motion.div>
            )}
            {view === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <TimelineView
                  conflicts={filtered}
                  selected={selectedConflict}
                  onSelect={setSelectedConflict}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/40 px-4 py-3 text-center text-xs text-slate-600 font-mono">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400/60 to-orange-400/60 font-semibold">WAR MONITOR</span>
        {' '}v2.0 — Data for informational purposes only — Sources: ACLED, UCDP, ICG, IISS —{' '}
        <a href="https://github.com/Feelzaa/war-monitor" className="text-slate-500 hover:text-cyan-400 transition-colors">
          GitHub
        </a>
      </footer>
    </div>
  )
}
