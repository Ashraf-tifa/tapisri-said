import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Star, Images, Eye } from 'lucide-react'
import { img, waLink } from '../config'

const PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450"><rect width="600" height="450" fill="#f0e8df"/><rect x="140" y="200" width="320" height="120" rx="12" fill="#d4b896"/><rect x="110" y="280" width="60" height="40" rx="6" fill="#c4a882"/><rect x="430" y="280" width="60" height="40" rx="6" fill="#c4a882"/><rect x="150" y="160" width="300" height="55" rx="10" fill="#c4a882"/><rect x="110" y="195" width="380" height="20" rx="6" fill="#b8967a"/><circle cx="240" cy="185" r="18" fill="#e8d0b8"/><circle cx="360" cy="185" r="18" fill="#e8d0b8"/><text x="300" y="380" text-anchor="middle" font-size="18" fill="#9a7a5a" font-family="system-ui" font-weight="600">Tapisri-Said</text></svg>`)}`

// Only use Cloudinary URLs (https://). Old Railway paths → placeholder
function getImageUrl(path) {
  if (!path) return PLACEHOLDER
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return PLACEHOLDER   // old local Railway path — broken, show placeholder
}

export default function ProductCard({ product, index = 0, horizontal = false }) {
  const imageUrl = getImageUrl(product.main_image?.path)
  const waUrl = waLink(product.whatsapp_number, `Bonjour, je suis intéressé(e) par: ${product.name}`)
  const imgCount = product.images?.length || 0

  /* ── Horizontal layout (mobile 1-col) ── */
  if (horizontal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
        style={h.card}
      >
        {/* Image */}
        <Link to={`/produits/${product.slug}`} style={h.imgWrap}>
          <img
            src={imageUrl}
            alt={product.name}
            style={h.img}
            loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER }}
          />
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
              <Eye size={14} />
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  /* ── Vertical / grid layout (HOMY style) ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(44,24,16,0.18)' }}
      style={v.card}
    >
      {/* Full image */}
      <Link to={`/produits/${product.slug}`} style={v.imgWrap}>
        <img
          src={imageUrl}
          alt={product.name}
          style={v.img}
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER }}
        />
        {/* Gradient overlay */}
        <div style={v.gradient} />

        {/* Top badges */}
        <div style={v.topRow}>
          {product.is_featured && (
            <span style={v.badge}>
              <Star size={9} fill="#2c1810" color="#2c1810" /> Vedette
            </span>
          )}
          {imgCount > 1 && (
            <span style={v.imgCount}><Images size={10} /> {imgCount}</span>
          )}
        </div>

        {/* Bottom info overlay */}
        <div style={v.overlay}>
          <span style={v.cat}>{product.category?.name}</span>
          <p style={v.name}>{product.name}</p>
          <div style={v.priceRow}>
            <span style={v.price}>
              {product.price
                ? `${Number(product.price).toLocaleString('fr-MA')} DH`
                : 'Sur demande'}
            </span>
          </div>
        </div>
      </Link>

      {/* Action button */}
      <a href={waUrl} target="_blank" rel="noopener noreferrer" style={v.btnWa}>
        <MessageCircle size={16} /> Commander via WhatsApp
      </a>
    </motion.div>
  )
}

/* ─── Horizontal styles (mobile) ─────────────────────────────────── */
const h = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    boxShadow: '0 2px 16px rgba(44,24,16,0.09)',
    border: '1px solid #ede8e3',
    minHeight: '120px',
  },
  imgWrap: {
    position: 'relative',
    width: '130px',
    flexShrink: 0,
    overflow: 'hidden',
    background: '#f5ede4',
    display: 'block',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.4s ease',
  },
  badge: {
    position: 'absolute', top: '0.4rem', left: '0.4rem',
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
    padding: '0.8rem 1rem',
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
    fontSize: '0.97rem',
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
  },
  btnView: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f5e6d3', color: '#9a6a3a',
    padding: '0.55rem', borderRadius: '10px',
    textDecoration: 'none', flexShrink: 0,
  },
}

/* ─── Vertical styles (desktop grid - HOMY style) ───────────────────────────────────── */
const v = {
  card: {
    borderRadius: '18px',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 4px 20px rgba(44,24,16,0.10)',
    border: '1px solid #ede8e3',
    transition: 'box-shadow 0.3s, transform 0.3s',
    background: '#fff',
    cursor: 'pointer',
  },
  imgWrap: {
    display: 'block', position: 'relative',
    overflow: 'hidden',
    paddingBottom: '75%',   /* 4:3 ratio — works with absolute img */
    background: '#f5ede4',
  },
  img: {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
    transition: 'transform 0.5s ease',
  },
  gradient: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'linear-gradient(to top, rgba(20,8,4,0.88) 0%, rgba(20,8,4,0.25) 55%, transparent 100%)',
    pointerEvents: 'none',
  },
  topRow: {
    position: 'absolute', top: '0.7rem', left: '0.7rem', right: '0.7rem', zIndex: 2,
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  badge: {
    background: '#d4a96a', color: '#2c1810',
    padding: '0.25rem 0.65rem', borderRadius: '20px',
    fontSize: '0.65rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  imgCount: {
    background: 'rgba(0,0,0,0.5)', color: '#fff',
    padding: '0.2rem 0.5rem', borderRadius: '12px',
    fontSize: '0.65rem', fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
    backdropFilter: 'blur(4px)',
    marginLeft: 'auto',
  },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
    padding: '1.2rem 1rem 0.9rem',
    display: 'flex', flexDirection: 'column', gap: '0.15rem',
  },
  cat: {
    fontSize: '0.62rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '1px',
    color: 'rgba(212,169,106,0.85)',
  },
  name: {
    fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
    fontWeight: 800, color: '#fff',
    margin: '0 0 0.3rem', lineHeight: 1.25,
    display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  priceRow: {
    display: 'flex', alignItems: 'center',
  },
  price: {
    fontSize: '1rem', fontWeight: 900,
    color: '#fff',
    background: 'rgba(212,169,106,0.25)',
    padding: '0.15rem 0.6rem', borderRadius: '6px',
    backdropFilter: 'blur(4px)',
  },
  btnWa: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    background: '#25D366', color: '#fff',
    padding: '0.8rem',
    textDecoration: 'none',
    fontSize: '0.88rem', fontWeight: 800,
    transition: 'background 0.2s',
  },
}
