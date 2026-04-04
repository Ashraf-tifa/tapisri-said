import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function FormModal({ open, title, onClose, children, width = 500 }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={s.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            style={{ ...s.modal, maxWidth: width }}
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <div style={s.header}>
              <h2 style={s.title}>{title}</h2>
              <button style={s.closeBtn} onClick={onClose}><X size={20} /></button>
            </div>
            <div style={s.body}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem',
  },
  modal: {
    background: '#fff', borderRadius: '16px', width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.25)', overflow: 'hidden',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.2rem 1.5rem', borderBottom: '1px solid #f0e8de',
    background: '#fdfaf7',
  },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#2c1810' },
  closeBtn: {
    background: '#f0e8de', border: 'none', borderRadius: '8px',
    padding: '0.4rem', cursor: 'pointer', color: '#666', display: 'flex',
  },
  body: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' },
}
