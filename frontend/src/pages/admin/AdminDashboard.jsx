import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Package, Tag, Star, TrendingUp, ArrowRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 640)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

import { img as IMG } from '../../config'
const PLACEHOLDER = 'https://placehold.co/56x56/f5e6d3/9a6a3a?text=?'

export default function AdminDashboard() {
  const isMobile = useIsMobile()
  const user = useAuthStore((s) => s.user)

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then((r) => r.data),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const featured = products.filter((p) => p.is_featured).length
  const active = products.filter((p) => p.is_active).length

  const stats = [
    { icon: Package, label: 'Produits', value: products.length, sub: `${active} actifs`, color: '#3b6de8', bg: '#eef2fd' },
    { icon: Tag, label: 'Catégories', value: categories.length, sub: 'au total', color: '#9a6a3a', bg: '#fdf4e8' },
    { icon: Star, label: 'Vedettes', value: featured, sub: 'mis en avant', color: '#d4a96a', bg: '#fdf8ef' },
    { icon: TrendingUp, label: 'Actifs', value: active, sub: 'visibles', color: '#2e7d32', bg: '#f0faf0' },
  ]

  const recent = products.slice(0, isMobile ? 5 : 6)

  return (
    <div>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={s.welcome}
      >
        <div>
          <h1 style={s.welcomeTitle}>
            Bonjour, {user?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p style={s.welcomeSub}>Voici un aperçu de votre boutique.</p>
        </div>
        <div style={s.welcomeDate}>
          <Clock size={14} />
          {new Date().toLocaleDateString('fr-MA', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </motion.div>

      {/* Stats grid */}
      <div style={s.statsGrid}>
        {stats.map(({ icon: Icon, label, value, sub, color, bg }, i) => (
          <motion.div
            key={label} style={s.statCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <div style={{ ...s.statIconWrap, background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={s.statValue}>{value}</p>
              <p style={s.statLabel}>{label}</p>
              <p style={s.statSub}>{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent products */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>Produits récents</h2>
          <Link to="/admin/produits" style={s.seeAll}>
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {isMobile ? (
          /* Mobile: card list */
          <div style={s.recentList}>
            {recent.map((p, i) => (
              <motion.div
                key={p.id} style={s.recentCard}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <img
                  src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                  alt={p.name}
                  style={s.recentImg}
                />
                <div style={s.recentBody}>
                  <p style={s.recentName}>{p.name}</p>
                  <p style={s.recentCat}>{p.category?.name}</p>
                  {p.price && <p style={s.recentPrice}>{Number(p.price).toLocaleString('fr-MA')} MAD</p>}
                </div>
                <span style={{
                  ...s.badge,
                  background: p.is_active ? '#e8f5e9' : '#fce4ec',
                  color: p.is_active ? '#2e7d32' : '#c62828',
                }}>
                  {p.is_active ? 'Actif' : 'Inactif'}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Desktop: table */
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {['', 'Nom', 'Catégorie', 'Prix', 'Statut'].map((h) => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                  >
                    <td style={s.td}>
                      <img
                        src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                        alt=""
                        style={{ width: 44, height: 40, objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td style={s.td}><strong style={{ color: '#2c1810' }}>{p.name}</strong></td>
                    <td style={s.td}><span style={s.catChip}>{p.category?.name}</span></td>
                    <td style={s.td}>{p.price ? `${Number(p.price).toLocaleString('fr-MA')} MAD` : '—'}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>
                        {p.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length === 0 && (
          <div style={s.emptyState}>
            <Package size={28} color="#d4b896" />
            <p style={{ margin: '0.6rem 0 0', color: '#aaa', fontSize: '0.9rem' }}>Aucun produit pour l'instant.</p>
            <Link to="/admin/produits" style={s.emptyBtn}>Ajouter un produit</Link>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  welcome: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem',
  },
  welcomeTitle: { fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', fontWeight: 800, color: '#2c1810', margin: '0 0 0.2rem' },
  welcomeSub: { margin: 0, color: '#9a8070', fontSize: '0.85rem' },
  welcomeDate: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.8rem', color: '#b09880', fontWeight: 500,
    background: '#fff', padding: '0.4rem 0.8rem', borderRadius: '8px',
    border: '1px solid #f0e8de',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.8rem', marginBottom: '1.8rem',
  },
  statCard: {
    background: '#fff', borderRadius: '14px', padding: '1.1rem 1.2rem',
    display: 'flex', alignItems: 'center', gap: '0.9rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4',
  },
  statIconWrap: {
    width: '46px', height: '46px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statValue: { fontSize: '1.6rem', fontWeight: 900, color: '#2c1810', margin: '0 0 0.05rem', lineHeight: 1 },
  statLabel: { fontSize: '0.82rem', fontWeight: 700, color: '#2c1810', margin: '0 0 0.05rem' },
  statSub: { fontSize: '0.72rem', color: '#aaa', margin: 0 },

  section: { background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 1.3rem', borderBottom: '1px solid #f5ede4',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 800, color: '#2c1810', margin: 0 },
  seeAll: {
    display: 'flex', alignItems: 'center', gap: '0.3rem',
    color: '#d4a96a', textDecoration: 'none', fontSize: '0.83rem', fontWeight: 700,
  },

  /* Mobile recent list */
  recentList: { display: 'flex', flexDirection: 'column' },
  recentCard: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    padding: '0.85rem 1.3rem', borderBottom: '1px solid #faf5f0',
  },
  recentImg: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 },
  recentBody: { flex: 1, minWidth: 0 },
  recentName: { margin: '0 0 0.1rem', fontWeight: 700, color: '#2c1810', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  recentCat: { margin: '0 0 0.1rem', color: '#9a6a3a', fontSize: '0.75rem', fontWeight: 600 },
  recentPrice: { margin: 0, color: '#c0522a', fontSize: '0.82rem', fontWeight: 800 },

  /* Desktop table */
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '500px' },
  th: { padding: '0.8rem 1.2rem', textAlign: 'left', color: '#9a8070', fontWeight: 700, fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.5px', background: '#fdfaf7' },
  td: { padding: '0.8rem 1.2rem', color: '#444', borderBottom: '1px solid #faf5f0', verticalAlign: 'middle' },
  catChip: { background: '#fdf4e8', color: '#9a6a3a', padding: '0.15rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 },
  badge: { padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' },

  emptyState: { textAlign: 'center', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' },
  emptyBtn: { marginTop: '0.6rem', background: '#d4a96a', color: '#2c1810', textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem' },
}
