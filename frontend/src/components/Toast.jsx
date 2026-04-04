import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

/* ── Context ── */
const ToastCtx = createContext(null)

const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
}

const COLORS = {
  success: { bg: '#f0faf4', border: '#a8dab5', icon: '#2e7d32', bar: '#43a047' },
  error:   { bg: '#fef2f2', border: '#fca5a5', icon: '#c62828', bar: '#e53935' },
  warning: { bg: '#fffbeb', border: '#fcd34d', icon: '#b45309', bar: '#f59e0b' },
  info:    { bg: '#eff6ff', border: '#93c5fd', icon: '#1565c0', bar: '#1e88e5' },
}

const DURATION = 3500

/* ── Single toast ── */
function ToastItem({ id, message, type = 'success', onClose }) {
  const c = COLORS[type] || COLORS.success
  const [paused, setPaused] = useState(false)
  const startRef = useRef(Date.now())
  const remainRef = useRef(DURATION)
  const timerRef = useRef(null)

  const schedule = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onClose(id), remainRef.current)
    startRef.current = Date.now()
  }, [id, onClose])

  useEffect(() => { schedule(); return () => clearTimeout(timerRef.current) }, [schedule])

  const pause = () => {
    clearTimeout(timerRef.current)
    remainRef.current -= Date.now() - startRef.current
    setPaused(true)
  }
  const resume = () => { setPaused(false); schedule() }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.88, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{ ...ts.toast, background: c.bg, border: `1px solid ${c.border}` }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Icon */}
      <div style={{ ...ts.icon, color: c.icon }}>{ICONS[type]}</div>

      {/* Message */}
      <p style={ts.msg}>{message}</p>

      {/* Close */}
      <button style={ts.closeBtn} onClick={() => onClose(id)}>
        <X size={14} color="#aaa" />
      </button>

      {/* Progress bar */}
      <motion.div
        style={{ ...ts.bar, background: c.bar }}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: DURATION / 1000, ease: 'linear', paused }}
      />
    </motion.div>
  )
}

/* ── Provider ── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastCtx.Provider value={addToast}>
      {children}
      <div style={ts.container}>
        <AnimatePresence mode="sync">
          {toasts.map((t) => (
            <ToastItem key={t.id} {...t} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/* ── Hook ── */
export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

/* ── Styles ── */
const ts = {
  container: {
    position: 'fixed', bottom: '1.2rem', right: '1rem',
    zIndex: 9999,
    display: 'flex', flexDirection: 'column', gap: '0.6rem',
    maxWidth: 'min(340px, calc(100vw - 2rem))',
    width: '100%',
    pointerEvents: 'none',
  },
  toast: {
    borderRadius: '12px',
    padding: '0.85rem 1rem 1.1rem',
    display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    position: 'relative', overflow: 'hidden',
    pointerEvents: 'all',
    cursor: 'default',
  },
  icon: { flexShrink: 0, marginTop: '0.05rem' },
  msg: {
    flex: 1, margin: 0, fontSize: '0.88rem',
    fontWeight: 600, color: '#1a1a1a', lineHeight: 1.45,
  },
  closeBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    padding: '0.1rem', display: 'flex', flexShrink: 0,
    marginTop: '-0.1rem',
  },
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: '3px', transformOrigin: 'left',
  },
}
