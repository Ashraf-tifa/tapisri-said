import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingBag, Menu, X, LogIn, Phone } from 'lucide-react'

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 680)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 680)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isMobile = useIsMobile()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={s.nav}
      >
        <Link to="/" style={s.brand}>
          Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <div style={s.desktopLinks}>
            <NavLink to="/" end style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>
              <Home size={15} /> Accueil
            </NavLink>
            <NavLink to="/produits" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>
              <ShoppingBag size={15} /> Produits
            </NavLink>
            <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '212671998528'}`} target="_blank" rel="noopener noreferrer" style={s.waLink}>
              <Phone size={14} /> WhatsApp
            </a>
            <Link to="/admin/login" style={s.loginBtn}>
              <LogIn size={14} /> Admin
            </Link>
          </div>
        )}

        {/* Mobile burger */}
        {isMobile && (
          <button style={s.burger} onClick={() => setOpen(!open)} aria-label="Menu">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'flex' }}
              >
                {open ? <X size={26} /> : <Menu size={26} />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}
      </motion.nav>

      {/* Mobile slide-in menu */}
      <AnimatePresence>
        {isMobile && open && (
          <>
            <motion.div
              style={s.backdrop}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              style={s.mobileMenu}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            >
              <div style={s.menuHeader}>
                <span style={s.menuBrand}>
                  Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
                </span>
                <button style={s.closeBtn} onClick={() => setOpen(false)}>
                  <X size={20} color="#f5e6d3" />
                </button>
              </div>

              <nav style={s.menuNav}>
                {[
                  { to: '/', icon: Home, label: 'Accueil', end: true },
                  { to: '/produits', icon: ShoppingBag, label: 'Produits' },
                ].map(({ to, icon: Icon, label, end }, i) => (
                  <motion.div
                    key={to}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.07 }}
                  >
                    <NavLink
                      to={to} end={end}
                      style={({ isActive }) => ({ ...s.menuLink, ...(isActive ? s.menuLinkActive : {}) })}
                    >
                      <div style={s.menuLinkIcon}><Icon size={20} /></div>
                      <span>{label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                style={s.menuBottom}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              >
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '212671998528'}?text=Bonjour%2C%20je%20voudrais%20des%20informations`}
                  target="_blank" rel="noopener noreferrer"
                  style={s.waBtn}
                >
                  <Phone size={18} /> Contacter sur WhatsApp
                </a>
                <Link to="/admin/login" style={s.adminBtn}>
                  <LogIn size={16} /> Connexion Admin
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const s = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1.3rem', height: '62px',
    background: '#1c0e08',
    position: 'sticky', top: 0, zIndex: 300,
    boxShadow: '0 1px 0 rgba(255,255,255,0.05), 0 4px 20px rgba(0,0,0,0.4)',
  },
  brand: {
    fontSize: '1.5rem', fontWeight: 900, color: '#fff',
    textDecoration: 'none', fontFamily: 'Georgia, serif', letterSpacing: '0.3px',
  },
  desktopLinks: { display: 'flex', gap: '0.25rem', alignItems: 'center' },
  link: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    color: 'rgba(245,230,211,0.78)', textDecoration: 'none', fontSize: '0.9rem',
    padding: '0.48rem 0.9rem', borderRadius: '8px', fontWeight: 500,
  },
  active: { background: 'rgba(212,169,106,0.13)', color: '#d4a96a', fontWeight: 700 },
  waLink: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    color: '#4ade80', textDecoration: 'none', fontSize: '0.86rem',
    padding: '0.45rem 0.85rem', borderRadius: '8px', fontWeight: 600,
    background: 'rgba(74,222,128,0.08)',
  },
  loginBtn: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    background: 'rgba(212,169,106,0.13)', color: '#d4a96a',
    textDecoration: 'none', fontSize: '0.86rem',
    padding: '0.45rem 0.9rem', borderRadius: '8px', fontWeight: 700,
    border: '1px solid rgba(212,169,106,0.22)',
  },
  burger: {
    background: 'none', border: 'none', color: '#f5e6d3',
    cursor: 'pointer', padding: '0.3rem', display: 'flex',
  },

  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    zIndex: 400,
  },
  mobileMenu: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '78%', maxWidth: '290px',
    background: '#1c0e08', zIndex: 500,
    display: 'flex', flexDirection: 'column',
    boxShadow: '-6px 0 30px rgba(0,0,0,0.6)',
  },
  menuHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.1rem 1.3rem',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    height: '62px', boxSizing: 'border-box',
  },
  menuBrand: {
    fontSize: '1.2rem', fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif',
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
    padding: '0.45rem', cursor: 'pointer', display: 'flex',
  },
  menuNav: { flex: 1, padding: '0.6rem 0' },
  menuLink: {
    display: 'flex', alignItems: 'center', gap: '0.9rem',
    color: 'rgba(245,230,211,0.72)', textDecoration: 'none',
    padding: '1rem 1.3rem', fontSize: '1rem', fontWeight: 500,
    borderLeft: '3px solid transparent',
  },
  menuLinkActive: {
    color: '#d4a96a', background: 'rgba(212,169,106,0.08)',
    borderLeft: '3px solid #d4a96a', fontWeight: 700,
  },
  menuLinkIcon: {
    width: '38px', height: '38px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  menuBottom: {
    padding: '1.1rem', borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', flexDirection: 'column', gap: '0.65rem',
  },
  waBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '0.9rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem',
  },
  adminBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
    background: 'rgba(212,169,106,0.08)', color: '#d4a96a',
    textDecoration: 'none', padding: '0.75rem', borderRadius: '10px',
    fontWeight: 600, fontSize: '0.88rem', border: '1px solid rgba(212,169,106,0.18)',
  },
}
