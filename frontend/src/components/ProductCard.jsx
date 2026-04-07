import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Star, Images, ArrowRight } from 'lucide-react'
import { img, waLink } from '../config'

const PLACEHOLDER = 'https://placehold.co/400x300/f5e6d3/9a6a3a?text=Tapisri'

export default function ProductCard({ product, index = 0, horizontal = false }) {
  const imageUrl = img(product.main_image?.path) || PLACEHOLDER
  const waUrl = waLink(product.whatsapp_number, `Bonjour, je suis intéressé(e) par: ${product.name}`)
  const imgCount = product.images?.length || 0

  /* ── Horizontal layout (mobile 1-col) ── */
  if (horizontal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
        style={h.card}
      >
        {/* Image */}
        <Link to={`/produits/${product.slug}`} style={h.imgWrap}>
          <img src={imageUrl} alt={product.name} style={h.img} loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER }} />
          {product.is_featured && (
            <span style={h.badge}><Star size={9} fill="#2c1810" color="#2c1810" /> Vedette</span>
          )}
          {imgCount > 1 && (
            <span style={h.imgCount}><Images size={10} /> {imgCount}</span>
          )}
        </Link>

        {/* Info */}
        <div style={h.body}>
          <span style={h.cat}>{product.category?.name}</span>
          <Link to={`/produits/${product.slug}`} style={h.name}>
            {product.name}
          </Link>
          <p style={h.price}>
            {product.price
              ? `${Number(product.price).toLocaleString('fr-MA')} DH`
              : 'Sur demande'}
          </p>
          <div style={h.btns}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={h.btnWa}>
              <MessageCircle size={14} /> Commander
            </a>
            <Link to={`/produits/${product.slug}`} style={h.btnView}>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ── Vertical / grid layout ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(44,24,16,0.16)' }}
      style={v.card}
    >
      {/* Image */}
      <Link to={`/produits/${product.slug}`} style={v.imgWrap}>
        <img src={imageUrl} alt={product.name} style={v.img} loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER }} />
        <div className="card-overlay" style={v.overlay} />
        {product.is_featured && (
          <span style={v.badge}>
            <Star size={9} fill="#2c1810" color="#2c1810" /> Vedette
          </span>
        )}
        {imgCount > 1 && (
          <span style={v.imgCount}><Images size={10} /> {imgCount}</span>
        )}
      </Link>

      {/* Body */}
      <div style={v.body}>
        <span style={v.cat}>{product.category?.name}</span>
        <Link to={`/produits/${product.slug}`} style={v.name}>{product.name}</Link>
        <div style={v.footer}>
          <span style={v.price}>
            {product.price
              ? `${Number(product.price).toLocaleString('fr-MA')} DH`
              : 'Sur demande'}
          </span>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={v.btnWa}>
            <MessageCircle size={14} /> Commander
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Horizontal styles ─────────────────────────────────── */
const h = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(44,24,16,0.08)',
    border: '1px solid #f0e8e0',
    minHeight: '120px',
  },
  imgWrap: {
    position: 'relative',
    width: '120px',
    flexShrink: 0,
    overflow: 'hidden',
    background: '#f5ede4',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  badge: {
    position: 'absolute', top: '0.45rem', left: '0.45rem',
    background: '#d4a96a', color: '#2c1810',
    padding: '0.18rem 0.45rem', borderRadius: '20px',
    fontSize: '0.6rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', gap: '0.18rem',
  },
  imgCount: {
    position: 'absolute', bottom: '0.35rem', right: '0.35rem',
    background: 'rgba(0,0,0,0.55)', color: '#fff',
    padding: '0.12rem 0.38rem', borderRadius: '10px',
    fontSize: '0.6rem', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: '0.18rem',
  },
  body: {
    flex: 1,
    padding: '0.75rem 0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    justifyContent: 'space-between',
    minWidth: 0,
  },
  cat: {
    fontSize: '0.6rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.7px', color: '#b08060',
  },
  name: {
    fontSize: '0.95rem',
    fontWeight: 800, color: '#2c1810',
    textDecoration: 'none', lineHeight: 1.3,
    display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  price: {
    fontSize: '1rem',
    fontWeight: 900, color: '#c0522a',
    margin: 0,
  },
  btns: {
    display: 'flex', gap: '0.5rem', alignItems: 'center',
    marginTop: '0.3rem',
  },
  btnWa: {
    flex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem',
    background: '#25D366', color: '#fff',
    padding: '0.55rem 0.7rem',
    borderRadius: '10px', textDecoration: 'none',
    fontSize: '0.82rem', fontWeight: 800,
    boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
  },
  btnView: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f5e6d3', color: '#9a6a3a',
    padding: '0.55rem', borderRadius: '10px',
    textDecoration: 'none', flexShrink: 0,
  },
}

/* ─── Vertical styles ───────────────────────────────────── */
const v = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 2px 12px rgba(44,24,16,0.08)',
    border: '1px solid #f0e8e0',
    transition: 'box-shadow 0.25s, transform 0.25s',
  },
  imgWrap: {
    display: 'block', position: 'relative',
    overflow: 'hidden', background: '#f5ede4',
    aspectRatio: '4 / 3',
  },
  img: {
    width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
    transition: 'transform 0.5s ease',
  },
  overlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(44,24,16,0.2)',
    opacity: 0, transition: 'opacity 0.25s',
  },
  badge: {
    position: 'absolute', top: '0.6rem', left: '0.6rem',
    background: '#d4a96a', color: '#2c1810',
    padding: '0.22rem 0.6rem', borderRadius: '20px',
    fontSize: '0.65rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  imgCount: {
    position: 'absolute', bottom: '0.5rem', right: '0.5rem',
    background: 'rgba(0,0,0,0.55)', color: '#fff',
    padding: '0.18rem 0.45rem', borderRadius: '12px',
    fontSize: '0.65rem', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
  },
  body: {
    padding: '0.85rem 0.9rem 1rem',
    display: 'flex', flexDirection: 'column', flex: 1, gap: '0.25rem',
  },
  cat: {
    fontSize: '0.63rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.8px', color: '#b08060',
  },
  name: {
    fontSize: 'clamp(0.88rem, 2.2vw, 1rem)',
    fontWeight: 700, color: '#2c1810',
    textDecoration: 'none', lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden', flex: 1,
  },
  footer: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: '0.5rem',
    marginTop: '0.6rem',
  },
  price: {
    fontSize: 'clamp(0.92rem, 2vw, 1.05rem)',
    fontWeight: 900, color: '#c0522a',
    flexShrink: 0,
  },
  btnWa: {
    display: 'flex', alignItems: 'center', gap: '0.35rem',
    background: '#25D366', color: '#fff',
    padding: '0.52rem 0.9rem',
    borderRadius: '10px', textDecoration: 'none',
    fontSize: '0.82rem', fontWeight: 700,
    whiteSpace: 'nowrap', flexShrink: 0,
    boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
  },
}
