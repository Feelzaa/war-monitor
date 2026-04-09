import { useState, useMemo } from 'react'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import ConflictMap from './components/ConflictMap'
import ConflictList from './components/ConflictList'
import ConflictDetail from './components/ConflictDetail'
import FilterPanel from './components/FilterPanel'
import NewsTicker from './components/NewsTicker'
import { conflicts } from './data/conflicts'

export default function App() {
  const [selectedConflict, setSelectedConflict] = useState(null)
  const [filters, setFilters] = useState({
    severity: [],
    region: [],
    type: [],
    search: '',
  })
  const [view, setView] = useState('map') // 'map' | 'list'

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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />
      <NewsTicker conflicts={conflicts} />

      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-[1920px] mx-auto w-full">
        {/* Left panel */}
        <div className="lg:w-80 xl:w-96 flex flex-col gap-4 shrink-0">
          <StatsCards conflicts={filtered} allConflicts={conflicts} />
          <FilterPanel filters={filters} setFilters={setFilters} />
          <ConflictList
            conflicts={filtered}
            selected={selectedConflict}
            onSelect={setSelectedConflict}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* View toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'map'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-200'
              }`}
            >
              🗺️ Map View
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'list'
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:text-gray-200'
              }`}
            >
              📋 Detail View
            </button>
            <span className="ml-auto text-xs text-gray-500 font-mono">
              {filtered.length} / {conflicts.length} conflicts shown
            </span>
          </div>

          {view === 'map' ? (
            <ConflictMap
              conflicts={filtered}
              selected={selectedConflict}
              onSelect={setSelectedConflict}
            />
          ) : (
            <ConflictDetail
              conflicts={filtered}
              selected={selectedConflict}
              onSelect={setSelectedConflict}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 px-4 py-3 text-center text-xs text-gray-600 font-mono">
        WAR MONITOR v1.0 — Data for informational purposes only — Sources: ACLED, UCDP, ICG, IISS —{' '}
        <a href="https://github.com/Feelzaa/war-monitor" className="text-gray-500 hover:text-emerald-400 transition-colors">
          GitHub
        </a>
      </footer>
    </div>
  )
}
