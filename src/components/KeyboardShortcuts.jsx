import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SHORTCUT_GROUPS = [
  {
    label: 'Navigation',
    shortcuts: [
      { key: 'm', description: 'Switch to map view' },
      { key: 'd', description: 'Switch to detail view' },
      { key: 't', description: 'Switch to timeline view' },
      { key: '/', description: 'Focus search input' },
      { key: '↑', description: 'Navigate list up' },
      { key: '↓', description: 'Navigate list down' },
      { key: 'Enter', description: 'Select current item' },
    ],
  },
  {
    label: 'Severity Filters',
    shortcuts: [
      { key: '1', description: 'Toggle critical filter' },
      { key: '2', description: 'Toggle high filter' },
      { key: '3', description: 'Toggle medium filter' },
      { key: '4', description: 'Toggle low filter' },
      { key: '5', description: 'Toggle watchlist filter' },
    ],
  },
  {
    label: 'General',
    shortcuts: [
      { key: '?', description: 'Toggle this help overlay' },
      { key: 'Esc', description: 'Clear selection / close overlay' },
    ],
  },
];

const SEVERITY_MAP = {
  '1': 'critical',
  '2': 'high',
  '3': 'medium',
  '4': 'low',
  '5': 'watchlist',
};

function ShortcutKey({ children }) {
  return (
    <kbd className="bg-slate-800 rounded px-2 py-1 font-mono text-sm border border-slate-600 text-slate-200">
      {children}
    </kbd>
  );
}

function HelpOverlay({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-slate-100 mb-4">
          Keyboard Shortcuts
        </h2>

        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
              {group.label}
            </h3>
            <ul className="space-y-2">
              {group.shortcuts.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-slate-300">{s.description}</span>
                  <ShortcutKey>{s.key}</ShortcutKey>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-4 text-xs text-slate-500 text-center">
          Press <ShortcutKey>?</ShortcutKey> or <ShortcutKey>Esc</ShortcutKey> to
          close
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function KeyboardShortcuts({
  onViewChange,
  onSearch,
  onSeverityToggle,
  onClearSelection,
  onNavigateList,
  onSelectCurrent,
}) {
  const [showHelp, setShowHelp] = useState(false);

  const isInputFocused = useCallback(() => {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      const key = e.key;

      // `/` works globally (except when already in an input)
      if (key === '/' && !isInputFocused()) {
        e.preventDefault();
        onSearch?.();
        return;
      }

      // Ignore all other shortcuts when an input is focused
      if (isInputFocused()) return;

      // Help overlay toggle
      if (key === '?') {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // Escape: close help first, then clear selection
      if (key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
        } else {
          onClearSelection?.();
        }
        return;
      }

      // Don't process remaining shortcuts while help is open
      if (showHelp) return;

      // View switching
      if (key === 'm') {
        onViewChange?.('map');
        return;
      }
      if (key === 'd') {
        onViewChange?.('list');
        return;
      }
      if (key === 't') {
        onViewChange?.('timeline');
        return;
      }

      // Severity filters
      if (SEVERITY_MAP[key]) {
        onSeverityToggle?.(SEVERITY_MAP[key]);
        return;
      }

      // List navigation
      if (key === 'ArrowUp') {
        e.preventDefault();
        onNavigateList?.('up');
        return;
      }
      if (key === 'ArrowDown') {
        e.preventDefault();
        onNavigateList?.('down');
        return;
      }

      // Select current
      if (key === 'Enter') {
        onSelectCurrent?.();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    showHelp,
    isInputFocused,
    onViewChange,
    onSearch,
    onSeverityToggle,
    onClearSelection,
    onNavigateList,
    onSelectCurrent,
  ]);

  return (
    <AnimatePresence>
      {showHelp && (
        <HelpOverlay onClose={() => setShowHelp(false)} />
      )}
    </AnimatePresence>
  );
}
