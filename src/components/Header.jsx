import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const utc = time.toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 gradient-border-top">
      <div className="max-w-[1920px] mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600/20 to-orange-600/10 border border-red-500/20 flex items-center justify-center text-xl shadow-lg shadow-red-500/5">
              🌍
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">WAR</span>{' '}
              <span className="text-slate-100">MONITOR</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              Global Conflict Intelligence Dashboard
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden sm:flex items-center gap-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-xs text-slate-400 font-mono">LIVE</span>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-cyan-400/80">{utc}</div>
            <div className="text-[10px] text-slate-600 font-mono">SYSTEM ACTIVE</div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
