import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = true }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            style={styles.modal}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button style={styles.closeBtn} onClick={onCancel}><X size={18} /></button>
            <div style={styles.iconWrap}>
              <AlertTriangle size={32} color={danger ? '#c62828' : '#d4a96a'} />
            </div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.message}>{message}</p>
            <div style={styles.btns}>
              <button style={styles.cancelBtn} onClick={onCancel}>Annuler</button>
              <motion.button
                style={{ ...styles.confirmBtn, background: danger ? '#c62828' : '#d4a96a', color: danger ? '#fff' : '#2c1810' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
              >
                Confirmer
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '2rem',
    width: '100%', maxWidth: '400px', position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)', textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: '#f5f5f5', border: 'none', borderRadius: '8px',
    padding: '0.3rem', cursor: 'pointer', color: '#666',
  },
  iconWrap: {
    width: '64px', height: '64px', borderRadius: '50%',
    background: '#fce4ec', display: 'flex', alignItems: 'center',
    justifyContent: 'center', margin: '0 auto 1.2rem',
  },
  title: { fontSize: '1.2rem', fontWeight: 800, color: '#2c1810', margin: '0 0 0.5rem' },
  message: { color: '#777', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem' },
  btns: { display: 'flex', gap: '0.8rem', justifyContent: 'center' },
  cancelBtn: { flex: 1, padding: '0.75rem', background: '#f0f0f0', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, color: '#555', fontSize: '0.95rem' },
  confirmBtn: { flex: 1, padding: '0.75rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' },
}
