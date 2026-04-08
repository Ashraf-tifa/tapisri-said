import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, ArrowLeft, Tag, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import { img, waLink } from '../config'

const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="#f0e8df"/><rect x="140" y="200" width="320" height="120" rx="12" fill="#d4b896"/><rect x="110" y="280" width="60" height="40" rx="6" fill="#c4a882"/><rect x="430" y="280" width="60" height="40" rx="6" fill="#c4a882"/><rect x="150" y="160" width="300" height="55" rx="10" fill="#c4a882"/><rect x="110" y="195" width="380" height="20" rx="6" fill="#b8967a"/><circle cx="240" cy="185" r="18" fill="#e8d0b8"/><circle cx="360" cy="185" r="18" fill="#e8d0b8"/><text x="300" y="380" text-anchor="middle" font-size="18" fill="#9a7a5a" font-family="system-ui" font-weight="600">Tapisri-Said</text></svg>`)}`
const IMG = (path) => img(path) || PLACEHOLDER

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 768)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

export default function ProductDetailPage() {
  const { slug } = useParams()
  const [selectedIdx, setSelectedIdx] = useState(0)
  const isMobile = useIsMobile()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then((r) => r.data),
  })

  // Must be before any conditional returns (Rules of Hooks)
  useEffect(() => {
    if (!product) return
    document.title = `${product.name} — Tapisri-Said`
    return () => { document.title = 'Tapisri-Said — Mobilier Marocain Artisanal' }
  }, [product?.name])

  if (isLoading) return (
    <div style={{ minHeight: '100vh', background: '#faf6f1' }}>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
        {[300, 140, 80, 80].map((h, i) => (
          <div key={i} style={{ height: h, background: '#ede8e3', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#faf6f1' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <p style={{ color: '#9a6a3a', fontSize: '1.1rem', fontWeight: 600 }}>Produit introuvable.</p>
        <Link to="/produits" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', color: '#2c1810', fontWeight: 700, textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Retour aux produits
        </Link>
      </div>
    </div>
  )

  const images = product.images || []
  const mainIdx = selectedIdx < images.length ? selectedIdx : 0
  const mainPath = images[mainIdx]?.path ?? null

  const waUrl = waLink(product.whatsapp_number, `Bonjour, je suis intéressé(e) par: ${product.name}`)

  const prevImg = () => setSelectedIdx((i) => (i - 1 + images.length) % images.length)
  const nextImg = () => setSelectedIdx((i) => (i + 1) % images.length)

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f1', paddingBottom: isMobile ? '90px' : '0' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Back link */}
        <div style={{ padding: isMobile ? '1rem 1rem 0' : '1.5rem 2rem 0' }}>
          <Link to="/produits" style={s.back}>
            <ArrowLeft size={16} /> Retour
          </Link>
        </div>

        {isMobile ? (
          /* ─── MOBILE LAYOUT ─── */
          <div>
            {/* Main image with arrows */}
            <div style={s.mobileImgWrap}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainIdx}
                  src={IMG(mainPath)}
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                  alt={product.name}
                  style={s.mobileMainImg}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button style={{ ...s.arrowBtn, left: '0.7rem' }} onClick={prevImg}>
                    <ChevronLeft size={20} />
                  </button>
                  <button style={{ ...s.arrowBtn, right: '0.7rem' }} onClick={nextImg}>
                    <ChevronRight size={20} />
                  </button>
                  {/* Dots */}
                  <div style={s.dots}>
                    {images.map((_, i) => (
                      <button
                        key={i} style={{ ...s.dot, ...(i === mainIdx ? s.dotActive : {}) }}
                        onClick={() => setSelectedIdx(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails scroll */}
            {images.length > 1 && (
              <div style={s.thumbScroll}>
                {images.map((img, i) => (
                  <motion.img
                    key={img.id}
                    src={IMG(img.path)}
                    onError={(e) => { e.target.src = PLACEHOLDER }}
                    alt=""
                    style={{ ...s.thumb, ...(i === mainIdx ? s.thumbActive : {}) }}
                    whileTap={{ scale: 0.93 }}
                    onClick={() => setSelectedIdx(i)}
                  />
                ))}
              </div>
            )}

            {/* Info */}
            <div style={s.mobileInfo}>
              <div style={s.categoryBadge}>
                <Tag size={13} /> {product.category?.name}
              </div>
              <h1 style={s.mobileName}>{product.name}</h1>
              {product.price && (
                <p style={s.mobilePrice}>
                  {Number(product.price).toLocaleString('fr-MA')} MAD
                </p>
              )}

              <div style={s.features}>
                {['Fait à la main', 'Qualité artisanale', 'Sur commande'].map((f) => (
                  <div key={f} style={s.featureItem}>
                    <CheckCircle size={15} color="#25D366" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {product.description && (
                <div style={s.descBlock}>
                  <p style={s.descTitle}>Description</p>
                  <p style={s.desc}>{product.description}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ─── DESKTOP LAYOUT ─── */
          <div style={s.desktopLayout}>
            {/* Images */}
            <div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainIdx}
                  src={IMG(mainPath)}
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                  alt={product.name}
                  style={s.desktopMainImg}
                  initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <div style={s.thumbRow}>
                  {images.map((img, i) => (
                    <motion.img
                      key={img.id}
                      src={IMG(img.path)}
                      onError={(e) => { e.target.src = PLACEHOLDER }}
                      alt=""
                      style={{ ...s.thumb, width: '72px', height: '72px', ...(i === mainIdx ? s.thumbActive : {}) }}
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
                      onClick={() => setSelectedIdx(i)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={s.desktopInfo}>
              <div style={s.categoryBadge}>
                <Tag size={13} /> {product.category?.name}
              </div>
              <h1 style={s.desktopName}>{product.name}</h1>

              {product.price && (
                <motion.p
                  style={s.desktopPrice}
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                >
                  {Number(product.price).toLocaleString('fr-MA')} MAD
                </motion.p>
              )}

              <div style={s.features}>
                {['Fait à la main', 'Qualité artisanale', 'Sur commande'].map((f) => (
                  <div key={f} style={s.featureItem}>
                    <CheckCircle size={16} color="#25D366" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {product.description && (
                <div style={s.descBlock}>
                  <p style={s.descTitle}>Description</p>
                  <p style={s.desc}>{product.description}</p>
                </div>
              )}

              <motion.a
                href={waUrl}
                target="_blank" rel="noopener noreferrer"
                style={s.desktopWaBtn}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              >
                <MessageCircle size={22} />
                Commander via WhatsApp
              </motion.a>
              <p style={s.note}>Contactez-nous pour les dimensions, couleurs et livraison.</p>
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY MOBILE BOTTOM BAR ─── */}
      {isMobile && (
        <div style={s.stickyBar}>
          {product.price && (
            <div style={s.stickyPrice}>
              <span style={s.stickyPriceLabel}>Prix</span>
              <span style={s.stickyPriceValue}>{Number(product.price).toLocaleString('fr-MA')} MAD</span>
            </div>
          )}
          <motion.a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            style={s.stickyWaBtn}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={20} />
            Commander via WhatsApp
          </motion.a>
        </div>
      )}
    </div>
  )
}

const s = {
  back: {
    display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
    color: '#9a6a3a', textDecoration: 'none', fontWeight: 600,
    fontSize: '0.9rem', marginBottom: '1rem',
  },

  /* Mobile image */
  mobileImgWrap: {
    position: 'relative', background: '#f5e6d3',
    overflow: 'hidden',
  },
  mobileMainImg: {
    width: '100%', height: 'clamp(240px, 70vw, 400px)',
    objectFit: 'cover', display: 'block',
  },
  arrowBtn: {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%',
    width: '36px', height: '36px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  dots: {
    position: 'absolute', bottom: '0.7rem', left: 0, right: 0,
    display: 'flex', justifyContent: 'center', gap: '0.4rem',
  },
  dot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0,
    transition: 'all 0.2s',
  },
  dotActive: { background: '#fff', width: '18px', borderRadius: '3px' },

  thumbScroll: {
    display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '0.8rem 1rem',
    WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
    background: '#fdfaf7', borderBottom: '1px solid #f0e8de',
  },
  thumb: {
    width: '60px', height: '60px', objectFit: 'cover',
    borderRadius: '8px', cursor: 'pointer', flexShrink: 0,
    border: '2px solid transparent', transition: 'border-color 0.2s',
  },
  thumbActive: { border: '2px solid #d4a96a' },

  mobileInfo: {
    padding: '1.2rem 1rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.8rem',
  },

  /* Desktop layout */
  desktopLayout: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem',
    alignItems: 'start', padding: '2rem',
  },
  desktopMainImg: {
    width: '100%', borderRadius: '16px', objectFit: 'cover',
    maxHeight: '460px', boxShadow: '0 8px 32px rgba(44,24,16,0.12)',
  },
  thumbRow: { display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' },
  desktopInfo: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  desktopName: {
    fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 900,
    color: '#2c1810', margin: 0, lineHeight: 1.2,
  },
  desktopPrice: {
    fontSize: '2rem', fontWeight: 900, color: '#c0522a', margin: 0,
    background: '#fff8f5', padding: '0.7rem 1.2rem', borderRadius: '10px',
    display: 'inline-block', border: '1px solid #f5ddd5',
  },
  desktopWaBtn: {
    display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center',
    background: '#25D366', color: '#fff', padding: '1.1rem',
    borderRadius: '12px', textDecoration: 'none', fontWeight: 800, fontSize: '1.05rem',
    boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
  },

  /* Shared */
  categoryBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: '#f5e6d3', color: '#9a6a3a',
    padding: '0.3rem 0.85rem', borderRadius: '20px',
    fontSize: '0.82rem', fontWeight: 700, width: 'fit-content',
  },
  mobileName: {
    fontSize: 'clamp(1.3rem, 5vw, 1.8rem)', fontWeight: 900,
    color: '#2c1810', margin: 0, lineHeight: 1.2,
  },
  mobilePrice: {
    fontSize: '1.6rem', fontWeight: 900, color: '#c0522a', margin: 0,
  },
  features: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  featureItem: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    color: '#555', fontSize: '0.88rem',
  },
  descBlock: {
    background: '#fff', borderRadius: '12px', padding: '1rem',
    border: '1px solid #f0e8de',
  },
  descTitle: { margin: '0 0 0.4rem', fontWeight: 700, color: '#9a6a3a', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.8px' },
  desc: { margin: 0, color: '#555', lineHeight: 1.75, fontSize: '0.92rem' },
  note: { color: '#aaa', fontSize: '0.8rem', textAlign: 'center', margin: 0 },

  /* Sticky bottom bar (mobile only) */
  stickyBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
    background: '#fff', padding: '0.8rem 1rem',
    borderTop: '1px solid #f0e8de',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
    display: 'flex', alignItems: 'center', gap: '0.8rem',
  },
  stickyPrice: {
    display: 'flex', flexDirection: 'column', flexShrink: 0,
  },
  stickyPriceLabel: { fontSize: '0.68rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase' },
  stickyPriceValue: { fontSize: '1.1rem', fontWeight: 900, color: '#c0522a', lineHeight: 1 },
  stickyWaBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '0.5rem', background: '#25D366', color: '#fff',
    padding: '0.85rem', borderRadius: '10px',
    textDecoration: 'none', fontWeight: 800, fontSize: '0.95rem',
  },
}
