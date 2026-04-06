import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

const WA = import.meta.env.VITE_WHATSAPP || '212671998528'

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)

  return (
    <div style={s.wrap}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            style={s.popup}
          >
            <div style={s.popupHeader}>
              <div style={s.avatar}>T</div>
              <div>
                <p style={s.popupName}>Tapisri-Said</p>
                <p style={s.popupStatus}>● En ligne</p>
              </div>
            </div>
            <div style={s.bubble}>
              Bonjour 👋 Comment puis-je vous aider ?
            </div>
            <a
              href={`https://wa.me/${WA}?text=Bonjour%2C%20je%20voudrais%20des%20informations`}
              target="_blank" rel="noopener noreferrer"
              style={s.popupBtn}
              onClick={() => setOpen(false)}
            >
              <MessageCircle size={16} /> Démarrer la conversation
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        style={s.btn}
        onClick={() => setOpen(!open)}
        aria-label="WhatsApp"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={24} /></motion.span>
            : <motion.span key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={26} /></motion.span>
          }
        </AnimatePresence>
        {!open && <span style={s.pulse} />}
      </motion.button>
    </div>
  )
}

const s = {
  wrap: {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem',
    zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem',
  },
  btn: {
    width: '58px', height: '58px', borderRadius: '50%',
    background: '#25D366', color: '#fff', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
    position: 'relative',
  },
  pulse: {
    position: 'absolute', inset: '-4px',
    borderRadius: '50%', border: '3px solid rgba(37,211,102,0.35)',
    animation: 'pulse 2s infinite',
  },
  popup: {
    background: '#fff', borderRadius: '18px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
    width: '280px', overflow: 'hidden',
    border: '1px solid #eee',
  },
  popupHeader: {
    background: '#25D366', padding: '1rem 1.1rem',
    display: 'flex', alignItems: 'center', gap: '0.7rem',
  },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 900, fontSize: '1.1rem',
  },
  popupName: { margin: 0, color: '#fff', fontWeight: 700, fontSize: '0.92rem' },
  popupStatus: { margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' },
  bubble: {
    margin: '1rem', background: '#f0f0f0', borderRadius: '12px 12px 12px 0',
    padding: '0.75rem 1rem', fontSize: '0.88rem', color: '#333', lineHeight: 1.5,
  },
  popupBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    background: '#25D366', color: '#fff', margin: '0 1rem 1rem',
    padding: '0.7rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
  },
}
