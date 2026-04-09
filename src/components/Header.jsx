import { useState, useEffect } from 'react'

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const utc = time.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <header className="border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-xl">
              🌍
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-red-400">WAR</span>{' '}
              <span className="text-gray-100">MONITOR</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              Global Conflict Intelligence Dashboard
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/50 border border-gray-800/50">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400 font-mono">LIVE</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-emerald-400/80">{utc}</div>
            <div className="text-[10px] text-gray-600 font-mono">SYSTEM ACTIVE</div>
          </div>
        </div>
      </div>
    </header>
  )
}
