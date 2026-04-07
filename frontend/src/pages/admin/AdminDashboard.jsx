import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Tag, Star, TrendingDown, ArrowRight, Clock, Plus, CheckCircle2, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import { img as IMG } from '../../config'

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 640)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

const PLACEHOLDER = 'https://placehold.co/44x44/f5e6d3/9a6a3a?text=?'

export default function AdminDashboard() {
  const isMobile = useIsMobile()
  const user = useAuthStore((s) => s.user)

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/admin/products').then((r) => r.data),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const active   = products.filter((p) => p.is_active).length
  const inactive = products.filter((p) => !p.is_active).length

  const stats = [
    { icon: Package,       label: 'Total Produits', value: products.length,   color: '#3b6de8', bg: '#eef2fd' },
    { icon: CheckCircle2,  label: 'Actifs',          value: active,            color: '#2e7d32', bg: '#f0faf0' },
    { icon: XCircle,       label: 'Inactifs',         value: inactive,          color: '#c62828', bg: '#fce4ec' },
    { icon: Tag,           label: 'Catégories',       value: categories.length, color: '#9a6a3a', bg: '#fdf4e8' },
  ]

  const recent = [...products].slice(0, isMobile ? 5 : 8)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Welcome Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={s.welcomeCard}
      >
        <div style={s.welcomeGlow} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={s.welcomeGreeting}>Bonjour, {user?.name?.split(' ')[0] || 'Admin'} 👋</p>
          <h1 style={s.welcomeTitle}>Tableau de bord</h1>
          <p style={s.welcomeSub}>{products.length} produit{products.length !== 1 ? 's' : ''} · {categories.length} catégorie{categories.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={s.welcomeDate}>
          <Clock size={14} />
          {new Date().toLocaleDateString('fr-MA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </motion.div>

      {/* ── Stats Grid ── */}
      <div style={s.statsGrid}>
        {stats.map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label} style={s.statCard}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
          >
            <div style={{ ...s.statIconWrap, background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={s.statValue}>{value}</p>
              <p style={s.statLabel}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={s.actionsCard}
      >
        <p style={s.actionsTitle}>Actions rapides</p>
        <div style={s.actionsRow}>
          <Link to="/admin/produits" style={{ ...s.actionBtn, background: '#d4a96a', color: '#2c1810' }}>
            <Plus size={17} /> Ajouter un produit
          </Link>
          <Link to="/admin/categories" style={{ ...s.actionBtn, background: '#fff', color: '#2c1810', border: '1.5px solid #e8d5b0' }}>
            <Plus size={17} /> Ajouter une catégorie
          </Link>
        </div>
      </motion.div>

      {/* ── Recent Products ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        style={s.section}
      >
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Produits récents</h2>
          <Link to="/admin/produits" style={s.seeAll}>
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {products.length === 0 ? (
          <div style={s.emptyState}>
            <Package size={36} color="#d4b896" />
            <p style={{ margin: '0.8rem 0 0', color: '#aaa', fontSize: '0.95rem', fontWeight: 600 }}>Aucun produit pour l'instant.</p>
            <Link to="/admin/produits" style={s.emptyBtn}>+ Ajouter votre premier produit</Link>
          </div>
        ) : isMobile ? (
          <div style={s.recentList}>
            {recent.map((p, i) => (
              <motion.div
                key={p.id} style={s.recentCard}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.04 }}
              >
                <img
                  src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                  alt={p.name}
                  style={s.recentImg}
                />
                <div style={s.recentBody}>
                  <p style={s.recentName}>{p.name}</p>
                  <p style={s.recentCat}>{p.category?.name}</p>
                  {p.price && <p style={s.recentPrice}>{Number(p.price).toLocaleString('fr-MA')} MAD</p>}
                </div>
                <span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>
                  {p.is_active ? 'Actif' : 'Inactif'}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['Photo', 'Nom', 'Catégorie', 'Prix', 'Statut'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? '#fff' : '#fdfaf7' }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.04 }}
                  >
                    <td style={s.td}>
                      <img
                        src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                        onError={(e) => { e.target.src = PLACEHOLDER }}
                        alt=""
                        style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: '10px', border: '1px solid #f0e8de' }}
                      />
                    </td>
                    <td style={s.td}><strong style={{ color: '#2c1810', fontSize: '0.92rem' }}>{p.name}</strong></td>
                    <td style={s.td}><span style={s.catChip}>{p.category?.name || '—'}</span></td>
                    <td style={s.td}><span style={{ color: '#c0522a', fontWeight: 700 }}>{p.price ? `${Number(p.price).toLocaleString('fr-MA')} MAD` : '—'}</span></td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>
                        {p.is_active ? '● Actif' : '● Inactif'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}

const s = {
  /* Welcome */
  welcomeCard: {
    background: '#1c0e08',
    borderRadius: '18px',
    padding: 'clamp(1.2rem, 3vw, 2rem)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '1rem',
    boxShadow: '0 8px 32px rgba(28,14,8,0.25)',
  },
  welcomeGlow: {
    position: 'absolute', top: '-40px', right: '-40px',
    width: '200px', height: '200px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,169,106,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  welcomeGreeting: { margin: '0 0 0.2rem', color: 'rgba(245,230,211,0.6)', fontSize: '0.88rem', fontWeight: 600 },
  welcomeTitle: { margin: '0 0 0.3rem', color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900 },
  welcomeSub: { margin: 0, color: '#d4a96a', fontSize: '0.9rem', fontWeight: 600 },
  welcomeDate: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.78rem', color: 'rgba(245,230,211,0.45)', fontWeight: 500,
    background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem',
    borderRadius: '8px', flexShrink: 0,
  },

  /* Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.8rem',
  },
  statCard: {
    background: '#fff', borderRadius: '14px', padding: '1.1rem 1.2rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4',
  },
  statIconWrap: {
    width: '48px', height: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statValue: { fontSize: '1.7rem', fontWeight: 900, color: '#2c1810', margin: '0 0 0.1rem', lineHeight: 1 },
  statLabel: { fontSize: '0.8rem', fontWeight: 600, color: '#9a8070', margin: 0 },

  /* Quick actions */
  actionsCard: {
    background: '#fff', borderRadius: '14px', padding: '1.2rem 1.4rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4',
  },
  actionsTitle: { margin: '0 0 0.9rem', fontWeight: 800, color: '#2c1810', fontSize: '0.95rem' },
  actionsRow: { display: 'flex', gap: '0.7rem', flexWrap: 'wrap' },
  actionBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.65rem 1.2rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
    fontFamily: 'inherit',
  },

  /* Recent */
  section: {
    background: '#fff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4',
  },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.4rem', borderBottom: '1px solid #f5ede4',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 800, color: '#2c1810', margin: 0 },
  seeAll: {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    color: '#d4a96a', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700,
  },
  recentList: { display: 'flex', flexDirection: 'column' },
  recentCard: {
    display: 'flex', alignItems: 'center', gap: '0.85rem',
    padding: '0.85rem 1.4rem', borderBottom: '1px solid #faf5f0',
  },
  recentImg: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid #f0e8de' },
  recentBody: { flex: 1, minWidth: 0 },
  recentName: { margin: '0 0 0.1rem', fontWeight: 700, color: '#2c1810', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  recentCat: { margin: '0 0 0.1rem', color: '#9a6a3a', fontSize: '0.75rem', fontWeight: 600 },
  recentPrice: { margin: 0, color: '#c0522a', fontSize: '0.82rem', fontWeight: 800 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  th: { padding: '0.8rem 1.2rem', textAlign: 'left', color: '#9a8070', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#fdfaf7', borderBottom: '1px solid #f5ede4' },
  td: { padding: '0.85rem 1.2rem', borderBottom: '1px solid #faf5f0', verticalAlign: 'middle' },
  catChip: { background: '#fdf4e8', color: '#9a6a3a', padding: '0.2rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 },
  badge: { padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' },
  emptyState: { textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  emptyBtn: { marginTop: '0.8rem', background: '#d4a96a', color: '#2c1810', textDecoration: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' },
}
