import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, Tag, LogOut, Menu, X, Settings } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import ConfirmModal from '../../components/ConfirmModal'

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/produits', icon: Package, label: 'Produits' },
  { to: '/admin/categories', icon: Tag, label: 'Catégories' },
  { to: '/admin/parametres', icon: Settings, label: 'Paramètres' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function AdminLayout() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useIsMobile()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => setDrawerOpen(false), [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div style={s.sidebarInner}>
      <div style={s.brand}>
        Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
        <span style={s.brandSub}>Administration</span>
      </div>

      <nav style={s.nav}>
        {NAV.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to} to={to} end={end}
            style={({ isActive }) => ({ ...s.navLink, ...(isActive ? s.navActive : {}) })}
          >
            <div style={s.navIcon}><Icon size={18} /></div>
            <span style={{ flex: 1 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button onClick={() => setConfirmLogout(true)} style={s.logoutBtn}>
        <LogOut size={17} />
        <span>Déconnexion</span>
      </button>
    </div>
  )

  return (
    <div style={s.root}>

      {/* Mobile top bar */}
      {isMobile && (
        <header style={s.topBar}>
          <button style={s.burgerBtn} onClick={() => setDrawerOpen(true)}>
            <Menu size={24} color="#d4a96a" />
          </button>
          <span style={s.topBarTitle}>
            Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
          </span>
          <div style={{ width: 40 }} />
        </header>
      )}

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* Desktop sidebar */}
        {!isMobile && (
          <aside style={s.sidebar}>
            <SidebarContent />
          </aside>
        )}

        {/* Mobile drawer */}
        <AnimatePresence>
          {isMobile && drawerOpen && (
            <>
              <motion.div
                style={s.overlay}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.aside
                style={s.drawer}
                initial={{ x: -270 }} animate={{ x: 0 }} exit={{ x: -270 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <button style={s.closeBtn} onClick={() => setDrawerOpen(false)}>
                  <X size={20} color="#f5e6d3" />
                </button>
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main style={{
          ...s.main,
          paddingTop: isMobile ? '1rem' : '2rem',
          marginTop: isMobile ? '56px' : 0,
        }}>
          <Outlet />
        </main>
      </div>

      <ConfirmModal
        open={confirmLogout}
        title="Déconnexion"
        message="Voulez-vous vraiment vous déconnecter ?"
        onConfirm={handleLogout}
        onCancel={() => setConfirmLogout(false)}
        danger={false}
      />
    </div>
  )
}

const s = {
  root: { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f7f3ee' },

  topBar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
    height: '56px', background: '#1c0e08',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
  },
  burgerBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', display: 'flex' },
  topBarTitle: { fontSize: '1.1rem', fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif' },

  sidebar: {
    width: '230px', background: '#1c0e08', flexShrink: 0,
    display: 'flex', flexDirection: 'column',
    boxShadow: '2px 0 16px rgba(0,0,0,0.25)',
  },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 400 },
  drawer: {
    position: 'fixed', top: 0, left: 0, bottom: 0, width: '270px',
    background: '#1c0e08', zIndex: 500, display: 'flex', flexDirection: 'column',
    boxShadow: '6px 0 24px rgba(0,0,0,0.5)',
  },
  closeBtn: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
    padding: '0.45rem', cursor: 'pointer', display: 'flex',
  },

  sidebarInner: { display: 'flex', flexDirection: 'column', height: '100%' },
  brand: {
    padding: '1.4rem 1.4rem 1.2rem',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    fontSize: '1.2rem', fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif',
  },
  brandSub: { display: 'block', fontSize: '0.65rem', color: 'rgba(212,169,106,0.55)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginTop: '0.15rem' },

  nav: { flex: 1, padding: '0.6rem 0', overflowY: 'auto' },
  navLink: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    padding: '0.82rem 1.2rem', color: 'rgba(245,230,211,0.65)',
    textDecoration: 'none', fontSize: '0.92rem', fontWeight: 500,
    borderLeft: '3px solid transparent',
  },
  navActive: {
    background: 'rgba(212,169,106,0.08)', color: '#d4a96a', fontWeight: 700,
    borderLeft: '3px solid #d4a96a',
  },
  navIcon: {
    width: '32px', height: '32px', borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    padding: '1rem 1.2rem', background: 'none', border: 'none',
    color: 'rgba(245,230,211,0.4)', cursor: 'pointer', fontSize: '0.9rem',
    borderTop: '1px solid rgba(255,255,255,0.07)', width: '100%',
  },

  main: {
    flex: 1, padding: '2rem 1.5rem',
    overflowX: 'hidden', maxWidth: '100%',
  },
}
