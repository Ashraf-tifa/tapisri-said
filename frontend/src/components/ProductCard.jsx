import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Eye, Star } from 'lucide-react'
import { img, waLink } from '../config'

const PLACEHOLDER = 'https://placehold.co/400x300/f5e6d3/9a6a3a?text=Tapisri'

export default function ProductCard({ product, index = 0 }) {
  const imageUrl = img(product.main_image?.path) || PLACEHOLDER
  const waUrl = waLink(product.whatsapp_number, `Bonjour, je suis intéressé(e) par: ${product.name}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(44,24,16,0.14)' }}
      style={s.card}
    >
      {/* Image */}
      <Link to={`/produits/${product.slug}`} style={s.imgWrap}>
        <img src={imageUrl} alt={product.name} style={s.img} loading="lazy" />

        {product.is_featured && (
          <span style={s.badge}>
            <Star size={9} fill="#2c1810" color="#2c1810" /> Vedette
          </span>
        )}
      </Link>

      {/* Info */}
      <div style={s.body}>
        <span style={s.cat}>{product.category?.name}</span>

        <Link to={`/produits/${product.slug}`} style={s.name}>
          {product.name}
        </Link>

        <div style={s.footer}>
          <span style={s.price}>
            {product.price
              ? `${Number(product.price).toLocaleString('fr-MA')} DH`
              : 'Sur demande'}
          </span>

          <div style={s.btns}>
            <Link to={`/produits/${product.slug}`} style={s.btnView} title="Voir">
              <Eye size={14} />
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={s.btnWa}>
              <MessageCircle size={13} /> Commander
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const s = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(44,24,16,0.08)',
    border: '1px solid #f0e8e0',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },

  imgWrap: {
    display: 'block', position: 'relative',
    overflow: 'hidden', background: '#f5ede4',
    aspectRatio: '4 / 3',
  },
  img: {
    width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
    transition: 'transform 0.4s ease',
  },
  badge: {
    position: 'absolute', top: '0.5rem', left: '0.5rem',
    background: '#d4a96a', color: '#2c1810',
    padding: '0.18rem 0.5rem', borderRadius: '20px',
    fontSize: '0.65rem', fontWeight: 800,
    display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
  },

  body: {
    padding: '0.75rem 0.85rem 0.9rem',
    display: 'flex', flexDirection: 'column', flex: 1, gap: '0.22rem',
  },
  cat: {
    fontSize: '0.65rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.7px', color: '#b08060',
  },
  name: {
    fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
    fontWeight: 700, color: '#2c1810',
    textDecoration: 'none', lineHeight: 1.35,
    display: '-webkit-box',
    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
    overflow: 'hidden', flex: 1,
  },

  footer: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', gap: '0.4rem',
    marginTop: '0.5rem', flexWrap: 'wrap',
  },
  price: {
    fontSize: 'clamp(0.88rem, 2vw, 1rem)',
    fontWeight: 900, color: '#c0522a',
  },

  btns: { display: 'flex', gap: '0.3rem' },
  btnView: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px',
    background: '#f5ede4', color: '#9a6a3a',
    borderRadius: '8px', textDecoration: 'none', flexShrink: 0,
  },
  btnWa: {
    display: 'flex', alignItems: 'center', gap: '0.28rem',
    background: '#25D366', color: '#fff',
    padding: '0 0.75rem', height: '32px',
    borderRadius: '8px', textDecoration: 'none',
    fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', fontWeight: 700,
    whiteSpace: 'nowrap',
  },
}
