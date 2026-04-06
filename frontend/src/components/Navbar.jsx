import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingBag, Menu, X, Phone, ChevronRight, Tag, Sofa, Armchair, BedDouble, Package } from 'lucide-react'
import api from '../api/axios'

const WA = import.meta.env.VITE_WHATSAPP || '212671998528'

const CAT_ICONS = { 'salon-marocain': Sofa, 'canape': Armchair, 'lit': BedDouble }
function CatIcon({ slug, size = 18 }) {
  const Icon = CAT_ICONS[slug] || Package
  return <Icon size={size} strokeWidth={1.5} />
}

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 680)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 680)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return scrolled
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isMobile = useIsMobile()
  const scrolled = useScrolled()
  const isHome = location.pathname === '/'

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Nav: always solid dark (hero now has its own overlay)
  const navBg = '#1c0e08'
  const navBlur = 'none'
  const navShadow = scrolled
    ? '0 2px 20px rgba(0,0,0,0.5)'
    : '0 1px 0 rgba(255,255,255,0.06)'

  return (
    <>
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ ...s.nav, background: navBg, boxShadow: navShadow, backdropFilter: navBlur, WebkitBackdropFilter: navBlur, transition: 'background 0.35s, box-shadow 0.35s, backdrop-filter 0.35s' }}
      >
        {/* Brand */}
        <Link to="/" style={s.brand}>
          Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
        </Link>

        {/* Desktop center links */}
        {!isMobile && (
          <div style={s.desktopLinks}>
            <NavLink to="/" end style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>
              <Home size={15} /> Accueil
            </NavLink>
            <NavLink to="/produits" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>
              <ShoppingBag size={15} /> Produits
            </NavLink>
          </div>
        )}

        {/* Desktop right */}
        {!isMobile && (
          <div style={s.desktopRight}>
            <a
              href={`https://wa.me/${WA}?text=Bonjour%2C%20je%20voudrais%20des%20informations`}
              target="_blank" rel="noopener noreferrer"
              style={s.waBtn}
            >
              <Phone size={14} />
              <span>+212 671 998 528</span>
            </a>
          </div>
        )}

        {/* Mobile right side */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" style={s.mobileWaIcon}>
              <Phone size={18} />
            </a>
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
                  {open ? <X size={24} /> : <Menu size={24} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        )}
      </motion.nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {isMobile && open && (
          <>
            {/* Backdrop */}
            <motion.div
              style={s.backdrop}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              style={s.drawer}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
            >
              {/* Drawer header */}
              <div style={s.drawerHeader}>
                <p style={s.drawerBrand}>
                  Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
                </p>
                <button style={s.drawerClose} onClick={() => setOpen(false)}>
                  <X size={20} color="#f5e6d3" />
                </button>
              </div>

              {/* Scroll content */}
              <div style={s.drawerBody}>
                {/* Main links */}
                <div style={s.navSection}>
                  {[
                    { to: '/', icon: Home, label: 'Accueil', end: true },
                    { to: '/produits', icon: ShoppingBag, label: 'Tous les produits' },
                  ].map(({ to, icon: Icon, label, end }, i) => (
                    <motion.div
                      key={to}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.04 + i * 0.06 }}
                    >
                      <NavLink
                        to={to} end={end}
                        style={({ isActive }) => ({ ...s.navLink, ...(isActive ? s.navLinkActive : {}) })}
                      >
                        <div style={s.navLinkIcon}><Icon size={19} /></div>
                        <span style={{ flex: 1 }}>{label}</span>
                        <ChevronRight size={15} style={{ opacity: 0.35 }} />
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <motion.div
                    style={s.catSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.18 }}
                  >
                    <p style={s.sectionLabel}>
                      <Tag size={12} /> Catégories
                    </p>
                    <div style={s.catGrid}>
                      {categories.map((cat, i) => (
                        <motion.div
                          key={cat.id}
                          initial={{ scale: 0.88, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.22 + i * 0.05 }}
                        >
                          <Link
                            to={`/produits?category=${cat.slug}`}
                            style={s.catChip}
                            onClick={() => setOpen(false)}
                          >
                            <span style={s.catChipIcon}><CatIcon slug={cat.slug} size={16} /></span>
                            <span style={s.catChipName}>{cat.name}</span>
                            <span style={s.catChipCount}>{cat.products_count ?? 0}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Drawer footer */}
              <motion.div
                style={s.drawerFooter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
              >
                <a
                  href={`https://wa.me/${WA}?text=Bonjour%2C%20je%20voudrais%20des%20informations`}
                  target="_blank" rel="noopener noreferrer"
                  style={s.footerWaBtn}
                >
                  <Phone size={17} /> Contacter sur WhatsApp
                </a>
                <Link to="/admin/login" style={s.footerAdminBtn}>
                  Espace Admin
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
  /* ── Navbar ── */
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1.4rem', height: '64px',
    position: 'sticky', top: 0, zIndex: 300,
  },
  brand: {
    fontSize: '1.45rem', fontWeight: 900, color: '#fff',
    textDecoration: 'none', fontFamily: 'Georgia, serif', letterSpacing: '0.3px',
    flexShrink: 0,
  },
  desktopLinks: {
    display: 'flex', gap: '0.15rem', alignItems: 'center',
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  link: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    color: 'rgba(245,230,211,0.78)', textDecoration: 'none', fontSize: '0.9rem',
    padding: '0.48rem 0.9rem', borderRadius: '8px', fontWeight: 500,
    transition: 'all 0.18s',
  },
  active: {
    background: 'rgba(212,169,106,0.15)', color: '#d4a96a', fontWeight: 700,
  },
  desktopRight: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  waBtn: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(37,211,102,0.12)', color: '#4ade80',
    border: '1px solid rgba(37,211,102,0.22)',
    padding: '0.42rem 0.95rem', borderRadius: '8px',
    textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  mobileWaIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(37,211,102,0.14)', color: '#4ade80',
    width: '36px', height: '36px', borderRadius: '10px',
    border: '1px solid rgba(37,211,102,0.2)', textDecoration: 'none',
  },
  burger: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f5e6d3', cursor: 'pointer', padding: '0.4rem',
    display: 'flex', borderRadius: '10px',
  },

  /* ── Backdrop ── */
  backdrop: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400,
    backdropFilter: 'blur(3px)',
  },

  /* ── Drawer ── */
  drawer: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: '82%', maxWidth: '300px',
    background: '#1c0e08',
    zIndex: 500,
    display: 'flex', flexDirection: 'column',
    boxShadow: '-8px 0 40px rgba(0,0,0,0.7)',
  },
  drawerHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1.2rem', height: '64px', flexShrink: 0,
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.2)',
  },
  drawerBrand: {
    fontSize: '1.2rem', fontWeight: 900, color: '#fff',
    fontFamily: 'Georgia, serif', margin: 0,
  },
  drawerClose: {
    background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
    padding: '0.42rem', cursor: 'pointer', display: 'flex',
  },
  drawerBody: {
    flex: 1, overflowY: 'auto', padding: '0.8rem 0',
  },

  /* Nav links */
  navSection: { padding: '0.3rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  navLink: {
    display: 'flex', alignItems: 'center', gap: '0.85rem',
    color: 'rgba(245,230,211,0.72)', textDecoration: 'none',
    padding: '0.85rem 0.75rem', fontSize: '0.97rem', fontWeight: 500,
    borderRadius: '12px', transition: 'all 0.18s',
  },
  navLinkActive: {
    color: '#d4a96a', background: 'rgba(212,169,106,0.1)',
    fontWeight: 700,
  },
  navLinkIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  /* Categories in menu */
  catSection: { padding: '0.4rem 1rem 0.6rem' },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    color: '#9a6a3a', fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1.2px',
    margin: '0 0 0.7rem', padding: '0 0.2rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '0.8rem',
  },
  catGrid: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  catChip: {
    display: 'flex', alignItems: 'center', gap: '0.7rem',
    background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
    padding: '0.65rem 0.8rem', textDecoration: 'none',
    border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s',
  },
  catChipIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'rgba(212,169,106,0.1)', color: '#d4a96a',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  catChipName: { color: 'rgba(245,230,211,0.8)', fontSize: '0.9rem', fontWeight: 600, flex: 1 },
  catChipCount: {
    background: 'rgba(212,169,106,0.15)', color: '#d4a96a',
    padding: '0.1rem 0.45rem', borderRadius: '20px',
    fontSize: '0.72rem', fontWeight: 700,
  },

  /* Drawer footer */
  drawerFooter: {
    padding: '0.9rem', flexShrink: 0,
    borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', flexDirection: 'column', gap: '0.55rem',
  },
  footerWaBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
    background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '0.88rem', borderRadius: '12px', fontWeight: 700, fontSize: '0.93rem',
    boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
  },
  footerAdminBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(212,169,106,0.08)', color: 'rgba(212,169,106,0.6)',
    textDecoration: 'none', padding: '0.65rem', borderRadius: '10px',
    fontWeight: 500, fontSize: '0.82rem', border: '1px solid rgba(212,169,106,0.12)',
  },
}
