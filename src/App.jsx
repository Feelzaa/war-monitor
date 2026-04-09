import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
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

const drawerVariants = {
  hidden: { x: '-100%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
  visible: { x: 0, transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export default function App() {
  const [selectedConflict, setSelectedConflict] = useState(null)
  const [filters, setFilters] = useState({
    severity: [],
    region: [],
    type: [],
    search: '',
  })
  const [view, setView] = useState('map')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  // Close drawer on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = () => { if (mq.matches) setSidebarOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

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

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  /* Sidebar content shared by desktop panel and mobile drawer */
  const sidebarContent = (
    <>
      <StatsCards conflicts={filtered} allConflicts={conflicts} />
      {/* Charts: hidden in main flow on mobile, always visible in drawer & desktop */}
      <div className="hidden lg:block">
        <SeverityChart conflicts={filtered} />
      </div>
      <div className="hidden lg:block">
        <RegionChart conflicts={filtered} />
      </div>
      <FilterPanel filters={filters} setFilters={setFilters} searchRef={searchRef} />
      <ConflictList
        ref={listRef}
        conflicts={filtered}
        selected={selectedConflict}
        onSelect={(c) => {
          setSelectedConflict(c)
          setSidebarOpen(false)
        }}
      />
    </>
  )

  /* Drawer-only charts (shown in mobile drawer) */
  const drawerCharts = (
    <>
      <SeverityChart conflicts={filtered} />
      <RegionChart conflicts={filtered} />
    </>
  )

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col pb-16 lg:pb-0">
      <Header onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
      <NewsTicker conflicts={conflicts} />

      <KeyboardShortcuts
        onViewChange={setView}
        onSearch={() => searchRef.current?.focus()}
        onSeverityToggle={handleSeverityToggle}
        onClearSelection={() => setSelectedConflict(null)}
        onNavigateList={handleNavigateList}
        onSelectCurrent={handleSelectCurrent}
      />

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[380px] bg-[#0a0f1e] border-r border-slate-700/40 z-50 lg:hidden overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between p-3 border-b border-slate-800/50 sticky top-0 bg-[#0a0f1e]/95 backdrop-blur-lg z-10">
                <span className="text-sm font-semibold text-slate-300 font-mono">PANELS</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg glass text-slate-400 hover:text-slate-200 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="16" y2="16" />
                    <line x1="16" y1="4" x2="4" y2="16" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-col gap-3 p-3">
                <StatsCards conflicts={filtered} allConflicts={conflicts} />
                {drawerCharts}
                <FilterPanel filters={filters} setFilters={setFilters} searchRef={searchRef} />
                <ConflictList
                  conflicts={filtered}
                  selected={selectedConflict}
                  onSelect={(c) => {
                    setSelectedConflict(c)
                    setSidebarOpen(false)
                  }}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col lg:flex-row gap-2 lg:gap-4 p-2 lg:p-4 max-w-[1920px] mx-auto w-full">
        {/* Desktop left panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-80 xl:w-96 flex-col gap-3 shrink-0">
          {sidebarContent}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-2 lg:gap-4 min-w-0">
          {/* Desktop view toggle — hidden on mobile (replaced by bottom nav) */}
          <div className="hidden lg:flex items-center gap-1.5">
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

          {/* Mobile conflict count */}
          <div className="flex lg:hidden items-center justify-between px-1">
            <span className="text-xs text-slate-600 font-mono">
              {filtered.length}/{conflicts.length} conflicts
            </span>
            <span className="text-[10px] text-slate-700 font-mono uppercase">
              {VIEWS.find(v => v.id === view)?.label} view
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
      <footer className="border-t border-slate-800/40 px-3 lg:px-4 py-3 text-center text-xs text-slate-600 font-mono leading-relaxed">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400/60 to-orange-400/60 font-semibold">WAR MONITOR</span>
        {' '}v2.0 — Data for informational purposes only
        <br className="sm:hidden" />
        {' '}— Sources: ACLED, UCDP, ICG, IISS —{' '}
        <a href="https://github.com/Feelzaa/war-monitor" className="text-slate-500 hover:text-cyan-400 transition-colors">
          GitHub
        </a>
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-slate-700/40">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {VIEWS.map(v => {
            const isActive = view === v.id
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-95 ${
                  isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 h-0.5 w-12 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="text-lg">{v.icon}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {v.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
