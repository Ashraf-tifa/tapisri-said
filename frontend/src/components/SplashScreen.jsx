import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in') // 'in' | 'out'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('out'), 2200)
    const t2 = setTimeout(() => onDone(), 2900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <AnimatePresence>
      {phase === 'in' && (
        <motion.div
          style={s.overlay}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Moroccan geometric background pattern */}
          <svg style={s.bgPattern} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            {[...Array(6)].map((_, i) =>
              [...Array(6)].map((_, j) => (
                <motion.polygon
                  key={`${i}-${j}`}
                  points="30,0 60,20 60,50 30,70 0,50 0,20"
                  transform={`translate(${i * 70 - 20}, ${j * 75 - 20})`}
                  fill="none"
                  stroke="rgba(212,169,106,0.07)"
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + (i + j) * 0.04, duration: 0.6 }}
                />
              ))
            )}
          </svg>

          {/* Center content */}
          <div style={s.center}>
            {/* Top decorative line */}
            <motion.div
              style={s.lineTop}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />

            {/* Diamond ornament */}
            <motion.div
              style={s.diamond}
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
            >
              <div style={s.diamondInner} />
            </motion.div>

            {/* Brand name */}
            <div style={s.brandWrap}>
              <motion.span
                style={s.brandMain}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                Tapisri
              </motion.span>
              <motion.span
                style={s.brandAccent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              >
                -Said
              </motion.span>
            </div>

            {/* Tagline */}
            <motion.p
              style={s.tagline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              Mobilier Marocain Artisanal
            </motion.p>

            {/* Bottom decorative line */}
            <motion.div
              style={s.lineBottom}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            />

            {/* Loading bar */}
            <motion.div style={s.loadBarTrack}>
              <motion.div
                style={s.loadBar}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2, ease: 'linear', delay: 0.2 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: '#1c0e08',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  bgPattern: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    opacity: 0.6,
  },
  center: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '0.6rem',
    position: 'relative', zIndex: 1,
    padding: '0 2rem',
  },

  lineTop: {
    width: '160px', height: '1px',
    background: 'linear-gradient(90deg, transparent, #d4a96a, transparent)',
    transformOrigin: 'center', marginBottom: '0.8rem',
  },

  diamond: {
    width: '14px', height: '14px',
    background: '#d4a96a',
    marginBottom: '0.8rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  diamondInner: {
    width: '6px', height: '6px',
    background: '#1c0e08',
    transform: 'rotate(0deg)',
  },

  brandWrap: {
    display: 'flex', alignItems: 'baseline', gap: '2px',
  },
  brandMain: {
    fontSize: 'clamp(2.2rem, 8vw, 3.2rem)',
    fontWeight: 900, color: '#fff',
    fontFamily: 'Georgia, serif', letterSpacing: '1px',
    lineHeight: 1,
  },
  brandAccent: {
    fontSize: 'clamp(2.2rem, 8vw, 3.2rem)',
    fontWeight: 900, color: '#d4a96a',
    fontFamily: 'Georgia, serif', letterSpacing: '1px',
    lineHeight: 1,
  },

  tagline: {
    color: 'rgba(212,169,106,0.6)',
    fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
    letterSpacing: '3px', textTransform: 'uppercase',
    fontWeight: 500, margin: '0.3rem 0 0.8rem',
  },

  lineBottom: {
    width: '160px', height: '1px',
    background: 'linear-gradient(90deg, transparent, #d4a96a, transparent)',
    transformOrigin: 'center', marginBottom: '2rem',
  },

  loadBarTrack: {
    width: '120px', height: '2px',
    background: 'rgba(212,169,106,0.15)',
    borderRadius: '2px', overflow: 'hidden',
    marginTop: '0.5rem',
  },
  loadBar: {
    height: '100%', background: '#d4a96a',
    transformOrigin: 'left', borderRadius: '2px',
  },
}
