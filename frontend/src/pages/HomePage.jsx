import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Star, Shield, Truck, Sofa, Armchair, BedDouble, Package, Phone, MapPin, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'

const fadeUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.12 } } }

const CAT_ICON_MAP = {
  'salon-marocain': Sofa,
  'canape': Armchair,
  'lit': BedDouble,
}

function CatIcon({ slug }) {
  const Icon = CAT_ICON_MAP[slug] || Package
  return <Icon size={36} strokeWidth={1.4} />
}

export default function HomePage() {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })
  const { data: featured = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products?featured=1').then((r) => r.data),
  })

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f1' }}>
      <Navbar />

      {/* Hero */}
      <section style={styles.hero}>
        <motion.div style={styles.heroContent} variants={stagger} initial="initial" animate="animate">
          <motion.span variants={fadeUp} style={styles.heroBadge}>
            Artisanat Marocain Authentique
          </motion.span>
          <motion.h1 variants={fadeUp} style={styles.heroTitle}>
            Mobilier Marocain<br />
            <span style={{ color: '#d4a96a' }}>Fait à la Main</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={styles.heroSub}>
            Découvrez notre collection de meubles artisanaux, alliant tradition marocaine et élégance moderne. Chaque pièce est unique.
          </motion.p>
          <motion.div variants={fadeUp} style={styles.heroBtns}>
            <Link to="/produits" style={styles.heroCta}>
              Voir la Collection <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '212671998528'}?text=Bonjour%2C%20je%20voudrais%20des%20informations`}
              target="_blank" rel="noopener noreferrer"
              style={styles.heroWaBtn}
            >
              <MessageCircle size={18} /> WhatsApp
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features bar */}
      <section style={styles.featuresSection}>
        {[
          { icon: <Star size={22} />, title: 'Qualité Artisanale', desc: 'Chaque meuble est fabriqué à la main par nos artisans.' },
          { icon: <Shield size={22} />, title: 'Garantie Qualité', desc: 'Matériaux sélectionnés et finitions soignées.' },
          { icon: <Truck size={22} />, title: 'Livraison Maroc', desc: 'Livraison dans tout le Maroc.' },
        ].map((f, i) => (
          <motion.div
            key={i} style={styles.featureCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
          >
            <div style={styles.featureIcon}>{f.icon}</div>
            <div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <p style={styles.sectionBadge}>Nos Collections</p>
          <h2 style={styles.sectionTitle}>Explorez par Catégorie</h2>
        </motion.div>
        <div style={styles.categoryGrid}>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(44,24,16,0.14)' }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
            >
              <Link to={`/produits?category=${cat.slug}`} style={styles.catCard}>
                <div style={styles.catIconWrap}>
                  <CatIcon slug={cat.slug} />
                </div>
                <h3 style={styles.catName}>{cat.name}</h3>
                <p style={styles.catCount}>{cat.products_count} produit{cat.products_count !== 1 ? 's' : ''}</p>
                <span style={styles.catCta}>Découvrir <ArrowRight size={13} /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section style={styles.featuredSection}>
          <div style={styles.featuredInner}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: '2.5rem' }}
            >
              <p style={styles.sectionBadge}>Sélection</p>
              <h2 style={styles.sectionTitle}>Produits Vedettes</h2>
            </motion.div>
            <div style={styles.productGrid}>
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ textAlign: 'center', marginTop: '2.5rem' }}
            >
              <Link to="/produits" style={{ ...styles.heroCta, display: 'inline-flex' }}>
                Voir tous les produits <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          {/* Brand column */}
          <div style={styles.footerCol}>
            <p style={styles.footerBrand}>
              Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
            </p>
            <p style={styles.footerTagline}>
              Mobilier marocain artisanal alliant tradition et élégance moderne.
            </p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP || '212671998528'}`}
              target="_blank" rel="noopener noreferrer"
              style={styles.footerWa}
            >
              <MessageCircle size={16} /> Contacter via WhatsApp
            </a>
          </div>

          {/* Links column */}
          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Navigation</p>
            <div style={styles.footerLinks}>
              <Link to="/" style={styles.footerLink}>Accueil</Link>
              <Link to="/produits" style={styles.footerLink}>Tous les produits</Link>
              {categories.slice(0, 4).map((cat) => (
                <Link key={cat.id} to={`/produits?category=${cat.slug}`} style={styles.footerLink}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact column */}
          <div style={styles.footerCol}>
            <p style={styles.footerColTitle}>Contact</p>
            <div style={styles.footerContacts}>
              <div style={styles.footerContact}>
                <Phone size={14} style={{ flexShrink: 0 }} />
                <span>+212 671 998 528</span>
              </div>
              <div style={styles.footerContact}>
                <MapPin size={14} style={{ flexShrink: 0 }} />
                <span>Maroc</span>
              </div>
              <div style={styles.footerContact}>
                <Clock size={14} style={{ flexShrink: 0 }} />
                <span>Lun – Sam, 9h – 19h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={styles.footerBottom}>
          <span>© 2025 Tapisri-Said — Tous droits réservés</span>
          <Link to="/admin/login" style={styles.footerAdminLink}>Espace Admin</Link>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(to bottom, rgba(10,4,2,0.82) 0%, rgba(44,24,16,0.68) 100%), url(/images/tapi.jpg) center/cover no-repeat',
    minHeight: '92vh',
    display: 'flex', alignItems: 'center',
    padding: 'clamp(2rem, 6vw, 5rem) clamp(1.5rem, 6vw, 6rem)',
  },
  heroContent: { maxWidth: '640px' },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(212,169,106,0.15)',
    color: '#d4a96a', padding: '0.4rem 1.1rem', borderRadius: '20px',
    fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.2rem',
    border: '1px solid rgba(212,169,106,0.3)', letterSpacing: '0.5px',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5.5vw, 3.8rem)', fontWeight: 900, color: '#fff',
    margin: '0 0 1.2rem', lineHeight: 1.1, letterSpacing: '-0.5px',
  },
  heroSub: { fontSize: 'clamp(0.92rem, 2vw, 1.1rem)', color: 'rgba(245,230,211,0.82)', lineHeight: 1.75, margin: '0 0 2.2rem' },
  heroBtns: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  heroCta: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#d4a96a', color: '#2c1810', padding: '0.85rem 1.8rem',
    borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '1rem',
  },
  heroWaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#25D366', color: '#fff', padding: '0.85rem 1.8rem',
    borderRadius: '10px', textDecoration: 'none', fontWeight: 800, fontSize: '1rem',
  },

  featuresSection: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    background: '#2c1810',
  },
  featureCard: {
    padding: '1.8rem 1.5rem', borderRight: '1px solid rgba(255,255,255,0.06)',
    color: '#f5e6d3', display: 'flex', alignItems: 'flex-start', gap: '0.9rem',
  },
  featureIcon: {
    color: '#d4a96a', flexShrink: 0, marginTop: '0.1rem',
  },
  featureTitle: { fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.3rem', color: '#fff' },
  featureDesc: { fontSize: '0.82rem', opacity: 0.58, margin: 0, lineHeight: 1.6 },

  section: { padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)', maxWidth: '1200px', margin: '0 auto' },
  sectionBadge: { color: '#9a6a3a', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '2px', margin: '0 0 0.4rem' },
  sectionTitle: { fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 800, color: '#2c1810', margin: 0 },

  categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem' },
  catCard: {
    display: 'block', background: '#fff', borderRadius: '16px', padding: '1.8rem 1.3rem',
    textAlign: 'center', textDecoration: 'none',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0e8de',
    transition: 'box-shadow 0.2s',
  },
  catIconWrap: {
    width: '68px', height: '68px', borderRadius: '18px', background: '#fdf4e8',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1rem', color: '#9a6a3a',
  },
  catName: { fontSize: '1rem', fontWeight: 800, color: '#2c1810', margin: '0 0 0.3rem' },
  catCount: { color: '#9a6a3a', fontSize: '0.84rem', margin: '0 0 0.9rem' },
  catCta: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#d4a96a', fontWeight: 700, fontSize: '0.84rem' },

  featuredSection: { background: '#fff', padding: 'clamp(2.5rem, 5vw, 4rem) 0' },
  featuredInner: { maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2rem)' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },

  /* Footer */
  footer: { background: '#1c0e08', color: '#f5e6d3' },
  footerInner: {
    maxWidth: '1100px', margin: '0 auto',
    padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem',
  },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  footerBrand: {
    fontSize: '1.6rem', fontWeight: 900, color: '#fff', fontFamily: 'Georgia, serif',
    margin: '0 0 0.2rem',
  },
  footerTagline: { fontSize: '0.86rem', color: 'rgba(245,230,211,0.55)', lineHeight: 1.6, margin: 0 },
  footerWa: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem',
    marginTop: '0.5rem', width: 'fit-content',
  },
  footerColTitle: {
    fontWeight: 800, color: '#d4a96a', textTransform: 'uppercase',
    fontSize: '0.72rem', letterSpacing: '1.5px', margin: '0 0 0.3rem',
  },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  footerLink: {
    color: 'rgba(245,230,211,0.6)', textDecoration: 'none', fontSize: '0.88rem',
    transition: 'color 0.15s',
  },
  footerContacts: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  footerContact: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    color: 'rgba(245,230,211,0.6)', fontSize: '0.87rem',
  },
  footerBottom: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
    padding: '1.1rem clamp(1.5rem, 4vw, 3rem)',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    fontSize: '0.8rem', color: 'rgba(245,230,211,0.38)',
    maxWidth: '100%',
  },
  footerAdminLink: {
    color: 'rgba(212,169,106,0.5)', textDecoration: 'none', fontSize: '0.8rem',
  },
}
