import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const categorySlug = searchParams.get('category') || ''
  const inputRef = useRef(null)
  const isMobile = useIsMobile()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: () => api.get(`/products${categorySlug ? `?category=${categorySlug}` : ''}`).then((r) => r.data),
  })

  const filtered = search.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  const activeCat = categories.find((c) => c.slug === categorySlug)

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr'
      : 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: isMobile ? '0.7rem' : '1.2rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f3ee' }}>
      <Navbar />

      {/* ── Sticky filter bar ── */}
      <div style={s.filterBar}>
        <div style={s.searchWrap} onClick={() => inputRef.current?.focus()}>
          <Search size={15} color="#aaa" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            style={s.searchInput}
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                style={s.clearBtn}
                onClick={(e) => { e.stopPropagation(); setSearch('') }}
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div style={s.chipsWrap}>
          <div style={s.chipsScroll}>
            {[{ slug: '', name: 'Tout' }, ...categories].map((cat) => {
              const active = categorySlug === (cat.slug ?? '')
              return (
                <motion.button
                  key={cat.slug ?? 'all'}
                  whileTap={{ scale: 0.92 }}
                  style={{ ...s.chip, ...(active ? s.chipActive : {}) }}
                  onClick={() => { setSearch(''); setSearchParams(cat.slug ? { category: cat.slug } : {}) }}
                >
                  {cat.name}
                </motion.button>
              )
            })}
          </div>
          {/* Right fade — shows more chips are hidden */}
          <div style={s.chipsFade} />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={s.page}>
        {/* Header row */}
        <div style={s.titleRow}>
          <h1 style={s.pageTitle}>
            {activeCat ? activeCat.name : 'Tous les produits'}
          </h1>
          {!isLoading && (
            <span style={s.countBadge}>
              {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Skeletons */}
        {isLoading && (
          <div style={gridStyle}>
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} style={s.skeleton} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.emptyWrap}>
            <div style={s.emptyIcon}><Package size={32} strokeWidth={1.3} /></div>
            <p style={s.emptyTitle}>{search ? 'Aucun résultat' : 'Aucun produit'}</p>
            <p style={s.emptyDesc}>
              {search ? `Aucun produit pour "${search}"` : 'Aucun produit dans cette catégorie.'}
            </p>
            {(search || categorySlug) && (
              <button style={s.resetBtn} onClick={() => { setSearch(''); setSearchParams({}) }}>
                Voir tout
              </button>
            )}
          </motion.div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={categorySlug + '|' + search}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={gridStyle}
            >
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} horizontal={isMobile} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

const s = {
  filterBar: {
    position: 'sticky', top: '62px', zIndex: 100,
    background: '#fff',
    borderBottom: '1px solid #ede8e3',
    padding: '0.7rem 1rem',
    display: 'flex', flexDirection: 'column', gap: '0.55rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  searchWrap: {
    display: 'flex', alignItems: 'center', gap: '0.55rem',
    background: '#f7f3ee', borderRadius: '10px',
    padding: '0.6rem 0.9rem', cursor: 'text',
    border: '1.5px solid #ede8e3',
  },
  searchInput: {
    flex: 1, border: 'none', background: 'transparent',
    fontSize: '0.93rem', outline: 'none', color: '#2c1810', minWidth: 0,
  },
  clearBtn: {
    background: '#ddd', border: 'none', borderRadius: '50%',
    width: '18px', height: '18px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#666', flexShrink: 0, padding: 0,
  },
  chipsWrap: {
    position: 'relative', overflow: 'hidden',
  },
  chipsScroll: {
    display: 'flex', gap: '0.4rem',
    overflowX: 'auto', scrollbarWidth: 'none',
    paddingBottom: '4px', paddingRight: '2rem',
    msOverflowStyle: 'none',
  },
  chipsFade: {
    position: 'absolute', right: 0, top: 0, bottom: 0,
    width: '48px',
    background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%)',
    pointerEvents: 'none',
  },
  chip: {
    padding: '0.35rem 1rem', borderRadius: '20px',
    border: '1.5px solid #e0d4ca',
    background: 'transparent', color: '#7a5c48',
    cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
    whiteSpace: 'nowrap', flexShrink: 0,
  },
  chipActive: { background: '#2c1810', color: '#d4a96a', borderColor: '#2c1810' },

  page: {
    maxWidth: '1200px', margin: '0 auto',
    padding: 'clamp(1rem, 3vw, 1.5rem) clamp(0.8rem, 2.5vw, 1.5rem) 3rem',
  },
  titleRow: {
    display: 'flex', alignItems: 'center', gap: '0.8rem',
    marginBottom: '1.1rem', flexWrap: 'wrap',
  },
  pageTitle: {
    fontSize: 'clamp(1.2rem, 3.5vw, 1.7rem)', fontWeight: 800,
    color: '#2c1810', margin: 0, fontFamily: 'Georgia, serif',
  },
  countBadge: {
    background: '#f5e6d3', color: '#9a6a3a',
    padding: '0.2rem 0.75rem', borderRadius: '20px',
    fontSize: '0.78rem', fontWeight: 700,
  },

  skeleton: {
    height: 'clamp(120px, 28vw, 200px)',
    background: 'linear-gradient(90deg, #ede8e3 25%, #f5f0eb 50%, #ede8e3 75%)',
    backgroundSize: '200% 100%',
    borderRadius: '14px',
    animation: 'shimmer 1.5s infinite',
  },

  emptyWrap: {
    textAlign: 'center', padding: '5rem 1.5rem',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
  },
  emptyIcon: {
    width: '68px', height: '68px', borderRadius: '18px',
    background: '#f5e6d3', color: '#d4b896',
    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.3rem',
  },
  emptyTitle: { fontWeight: 800, color: '#2c1810', fontSize: '1.1rem', margin: 0 },
  emptyDesc: { color: '#aaa', fontSize: '0.86rem', margin: 0 },
  resetBtn: {
    marginTop: '0.7rem', background: '#2c1810', color: '#d4a96a',
    border: 'none', padding: '0.65rem 1.4rem', borderRadius: '10px',
    cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
  },
}
