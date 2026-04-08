import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, ShoppingBag, Menu, X, Phone, ChevronRight,
  Tag, Sofa, Armchair, BedDouble, Package, ChevronDown,
  MessageCircle,
} from 'lucide-react'
import api from '../api/axios'

const WA = import.meta.env.VITE_WHATSAPP || '212671998528'
const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent('Bonjour, je voudrais des informations sur vos produits')}`

const CAT_ICONS = { 'salon-marocain': Sofa, 'canape': Armchair, 'lit': BedDouble }
function CatIcon({ slug, size = 18 }) {
  const Icon = CAT_ICONS[slug] || Package
  return <Icon size={size} strokeWidth={1.5} />
}

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return scrolled
}

/* ── Categories dropdown (desktop hover) ── */
function CategoriesDropdown({ categories }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const timerRef = useRef()

  const show = () => { clearTimeout(timerRef.current); setOpen(true) }
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger */}
      <NavLink
        to="/produits"
        style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}
      >
        <ShoppingBag size={15} strokeWidth={2} />
        Produits
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', opacity: 0.6 }}
        >
          <ChevronDown size={13} />
        </motion.span>
      </NavLink>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && categories.length > 0 && (
          <motion.div
            ref={ref}
            style={s.dropdown}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            {/* Arrow */}
            <div style={s.dropArrow} />

            <p style={s.dropLabel}><Tag size={11} /> Toutes les catégories</p>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/produits?category=${cat.slug}`}
                style={s.dropItem}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,169,106,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                onClick={() => setOpen(false)}
              >
                <span style={s.dropItemIcon}><CatIcon slug={cat.slug} size={16} /></span>
                <span style={{ flex: 1, color: '#2c1810', fontSize: '0.88rem', fontWeight: 600 }}>
                  {cat.name}
                </span>
                {cat.products_count !== undefined && (
                  <span style={s.dropCount}>{cat.products_count}</span>
                )}
              </Link>
            ))}

            <div style={s.dropDivider} />
            <Link
              to="/produits"
              style={{ ...s.dropItem, color: '#d4a96a' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,169,106,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={() => setOpen(false)}
            >
              <span style={{ ...s.dropItemIcon, background: 'rgba(212,169,106,0.12)', color: '#d4a96a' }}>
                <ShoppingBag size={15} />
              </span>
              <span style={{ flex: 1, color: '#d4a96a', fontSize: '0.88rem', fontWeight: 700 }}>
                Tous les produits
              </span>
              <ChevronRight size={14} style={{ opacity: 0.5 }} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isMobile = useIsMobile()
  const scrolled = useScrolled()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navHeight = scrolled ? '56px' : '66px'
  const navBg = scrolled
    ? 'rgba(18,8,4,0.97)'
    : '#1c0e08'
  const navBlur = scrolled ? 'blur(12px)' : 'none'
  const navShadow = scrolled
    ? '0 2px 24px rgba(0,0,0,0.55)'
    : '0 1px 0 rgba(255,255,255,0.06)'

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          ...s.nav,
          background: navBg,
          boxShadow: navShadow,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          height: navHeight,
          transition: 'background 0.35s, box-shadow 0.35s, height 0.3s, backdrop-filter 0.35s',
        }}
      >
        {/* Brand */}
        <Link to="/" style={s.brand}>
          <span style={s.brandText}>Tapisri</span>
          <span style={s.brandAccent}>-Said</span>
        </Link>

        {/* Desktop center links */}
        {!isMobile && (
          <div style={s.desktopLinks} className="desktop-links">
            <NavLink
              to="/"
              end
              style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}
            >
              <Home size={15} strokeWidth={2} />
              Accueil
            </NavLink>

            <CategoriesDropdown categories={categories} />
          </div>
        )}

        {/* Desktop right */}
        {!isMobile && (
          <div style={s.desktopRight} className="desktop-links">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={s.waBtn}>
              <MessageCircle size={16} strokeWidth={2.2} />
              <span>Contacter</span>
            </a>
          </div>
        )}

        {/* Mobile right */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={s.mobileWaIcon}>
              <MessageCircle size={18} />
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

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {isMobile && open && (
          <>
            <motion.div
              style={s.backdrop}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
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
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={s.footerWaBtn}>
                  <MessageCircle size={17} /> Contacter sur WhatsApp
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
    padding: '0 2rem',
    position: 'sticky', top: 0, zIndex: 300,
  },
  brand: {
    textDecoration: 'none', fontFamily: 'Georgia, serif',
    display: 'flex', alignItems: 'baseline', gap: '1px',
    flexShrink: 0,
  },
  brandText: {
    fontSize: '1.5rem', fontWeight: 900, color: '#fff',
    letterSpacing: '0.3px',
  },
  brandAccent: {
    fontSize: '1.5rem', fontWeight: 900, color: '#d4a96a',
    letterSpacing: '0.3px',
  },

  /* Desktop nav links */
  desktopLinks: {
    display: 'flex', gap: '0.1rem', alignItems: 'center',
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
  },
  link: {
    display: 'flex', alignItems: 'center', gap: '0.38rem',
    color: 'rgba(245,230,211,0.72)', textDecoration: 'none', fontSize: '0.9rem',
    padding: '0.48rem 1rem', borderRadius: '8px', fontWeight: 500,
    transition: 'color 0.18s, background 0.18s',
    whiteSpace: 'nowrap',
  },
  active: {
    color: '#d4a96a', fontWeight: 700,
    background: 'rgba(212,169,106,0.12)',
  },

  /* Desktop right */
  desktopRight: { display: 'flex', alignItems: 'center', gap: '0.7rem' },
  waBtn: {
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    background: '#25D366',
    color: '#fff',
    padding: '0.5rem 1.1rem', borderRadius: '10px',
    textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700,
    boxShadow: '0 3px 14px rgba(37,211,102,0.35)',
    whiteSpace: 'nowrap',
    transition: 'background 0.18s, box-shadow 0.18s',
  },

  /* Mobile */
  mobileWaIcon: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'rgba(37,211,102,0.14)', color: '#4ade80',
    width: '38px', height: '38px', borderRadius: '10px',
    border: '1px solid rgba(37,211,102,0.22)', textDecoration: 'none',
  },
  burger: {
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f5e6d3', cursor: 'pointer', padding: '0.42rem',
    display: 'flex', borderRadius: '10px',
  },

  /* ── Categories Dropdown ── */
  dropdown: {
    position: 'absolute', top: 'calc(100% + 10px)', left: '50%',
    transform: 'translateX(-50%)',
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 16px 48px rgba(44,24,16,0.18), 0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid rgba(212,169,106,0.15)',
    minWidth: '220px',
    overflow: 'hidden',
    padding: '0.5rem 0.4rem',
    zIndex: 400,
  },
  dropArrow: {
    position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
    width: '12px', height: '12px',
    background: '#fff',
    borderLeft: '1px solid rgba(212,169,106,0.15)',
    borderTop: '1px solid rgba(212,169,106,0.15)',
    rotate: '45deg',
  },
  dropLabel: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    color: '#b08060', fontSize: '0.68rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px',
    margin: '0 0.4rem 0.4rem', padding: '0.3rem 0.4rem 0.5rem',
    borderBottom: '1px solid rgba(212,169,106,0.12)',
  },
  dropItem: {
    display: 'flex', alignItems: 'center', gap: '0.65rem',
    padding: '0.6rem 0.7rem', borderRadius: '10px',
    textDecoration: 'none', transition: 'background 0.14s',
    background: 'transparent',
    cursor: 'pointer',
  },
  dropItemIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'rgba(44,24,16,0.06)', color: '#9a6a3a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  dropCount: {
    background: 'rgba(212,169,106,0.15)', color: '#9a6a3a',
    padding: '0.1rem 0.45rem', borderRadius: '20px',
    fontSize: '0.72rem', fontWeight: 700,
  },
  dropDivider: {
    height: '1px', background: 'rgba(212,169,106,0.12)',
    margin: '0.35rem 0.5rem',
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
  drawerBody: { flex: 1, overflowY: 'auto', padding: '0.8rem 0' },

  /* Nav links */
  navSection: { padding: '0.3rem 0.8rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  navLink: {
    display: 'flex', alignItems: 'center', gap: '0.85rem',
    color: 'rgba(245,230,211,0.72)', textDecoration: 'none',
    padding: '0.85rem 0.75rem', fontSize: '0.97rem', fontWeight: 500,
    borderRadius: '12px', transition: 'all 0.18s',
  },
  navLinkActive: {
    color: '#d4a96a', background: 'rgba(212,169,106,0.1)', fontWeight: 700,
  },
  navLinkIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },

  /* Categories in drawer */
  catSection: { padding: '0.4rem 1rem 0.6rem' },
  sectionLabel: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    color: '#9a6a3a', fontSize: '0.7rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1.2px',
    margin: '0 0 0.7rem', padding: '0.8rem 0.2rem 0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
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
