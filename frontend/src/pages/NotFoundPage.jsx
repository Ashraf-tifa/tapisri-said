import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function NotFoundPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#faf6f1' }}>
      <Navbar />
      <div style={s.page}>
        <motion.div
          style={s.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={s.code}>404</div>
          <h1 style={s.title}>Page introuvable</h1>
          <p style={s.desc}>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div style={s.btns}>
            <Link to="/" style={s.btnPrimary}>
              <Home size={18} /> Accueil
            </Link>
            <Link to="/produits" style={s.btnSecondary}>
              <ShoppingBag size={18} /> Voir les produits
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const s = {
  page: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 'calc(100vh - 66px)',
    padding: '2rem 1rem',
  },
  card: {
    textAlign: 'center', maxWidth: '420px', width: '100%',
    padding: '3rem 2rem',
  },
  code: {
    fontSize: 'clamp(5rem, 20vw, 8rem)',
    fontWeight: 900, color: '#f0e0cc',
    fontFamily: 'Georgia, serif', lineHeight: 1,
    marginBottom: '1rem',
  },
  title: {
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 800, color: '#2c1810', margin: '0 0 0.8rem',
  },
  desc: {
    color: '#9a8070', fontSize: '0.95rem',
    lineHeight: 1.6, margin: '0 0 2rem',
  },
  btns: {
    display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#2c1810', color: '#d4a96a',
    padding: '0.85rem 1.6rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#f5e6d3', color: '#2c1810',
    padding: '0.85rem 1.6rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem',
  },
}
