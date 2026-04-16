import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, ArrowRight, Sofa, Armchair, BedDouble, Package, Phone, MapPin, Clock, ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'

const CAT_PREVIEW = 3
const WA = import.meta.env.VITE_WHATSAPP || '212671998528'
const WA_URL = `https://wa.me/${WA}?text=${encodeURIComponent('Bonjour, je voudrais des informations sur vos produits')}`

const CAT_ICON_MAP = {
  'salon-marocain': Sofa, 'salon': Sofa,
  'canape': Armchair, 'canapes': Armchair,
  'lit': BedDouble, 'chambre': BedDouble, 'lits': BedDouble,
}
function CatIcon({ slug }) {
  const Icon = CAT_ICON_MAP[slug] || Package
  return <Icon size={28} strokeWidth={1.2} />
}

// Moroccan 8-point star SVG for decoration
const STAR_SVG = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5 L61.8 38.2 L97.6 38.2 L68.1 59 L79.9 92.2 L50 71.4 L20.1 92.2 L31.9 59 L2.4 38.2 L38.2 38.2 Z" fill="none" stroke="%23d4a96a" stroke-width="1.5" opacity="0.6"/><path d="M50 20 L56 40 L77 40 L61 52 L67 72 L50 60 L33 72 L39 52 L23 40 L44 40 Z" fill="none" stroke="%23d4a96a" stroke-width="0.8" opacity="0.3"/></svg>`)}`

const fadeUp = { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.15 } } }

export default function HomePage() {
  const [showAllCats, setShowAllCats] = useState(false)

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
  })
  const { data: featured = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products?featured=1').then(r => r.data),
  })

  const visibleCats = showAllCats ? categories : categories.slice(0, CAT_PREVIEW)

  return (
    <div style={{ minHeight: '100vh', background: '#faf6f1', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      {/* ══════════════════════ HERO ══════════════════════ */}
      <section style={st.hero}>
        {/* Background image */}
        <div style={st.heroBg} />
        {/* Atmospheric overlay */}
        <div style={st.heroOverlay} />
        {/* Moroccan pattern texture overlay */}
        <div style={st.heroPattern} />

        {/* Decorative star — top right */}
        <img
          src={STAR_SVG} alt=""
          style={{ position: 'absolute', top: '8%', right: '6%', width: 'clamp(80px,12vw,160px)', opacity: 0.4, zIndex: 2, pointerEvents: 'none' }}
        />
        {/* Decorative star — bottom left */}
        <img
          src={STAR_SVG} alt=""
          style={{ position: 'absolute', bottom: '12%', left: '4%', width: 'clamp(60px,8vw,110px)', opacity: 0.2, zIndex: 2, pointerEvents: 'none', transform: 'rotate(22.5deg)' }}
        />

        {/* Vertical label left */}
        <div style={st.heroVertLabel}>
          <span style={{ display: 'block', width: '1px', height: '60px', background: 'rgba(212,169,106,0.5)', margin: '0 auto 0.8rem' }} />
          <span style={{ writingMode: 'vertical-rl', fontSize: '0.65rem', letterSpacing: '3px', color: 'rgba(212,169,106,0.7)', fontWeight: 600, textTransform: 'uppercase' }}>Artisanat Marocain</span>
          <span style={{ display: 'block', width: '1px', height: '60px', background: 'rgba(212,169,106,0.5)', margin: '0.8rem auto 0' }} />
        </div>

        {/* Main content */}
        <motion.div
          style={st.heroContent}
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.7 }} style={st.heroBadge}>
            ✦ Meknès, Maroc ✦
          </motion.div>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.8, delay: 0.1 }} style={st.heroTitle}>
            Mobilier
            <br />
            <em style={st.heroTitleItalic}>Marocain</em>
            <br />
            <span style={st.heroTitleAccent}>Artisanal</span>
          </motion.h1>

          <motion.p variants={fadeUp} transition={{ duration: 0.7, delay: 0.3 }} style={st.heroSub}>
            Chaque pièce, une histoire. Façonnée à la main par nos artisans,
            alliant tradition séculaire et élégance contemporaine.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.45 }} style={st.heroBtns}>
            <Link to="/produits" style={st.heroCta}>
              Découvrir la Collection
              <ArrowRight size={17} />
            </Link>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={st.heroWa}>
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={st.scrollIndicator}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            style={st.scrollDot}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════ FEATURE STRIP ══════════════════════ */}
      <section style={st.featureStrip}>
        <div style={st.featureInner}>
          {[
            { num: '15+', label: 'Années d\'expérience' },
            { num: '500+', label: 'Créations réalisées' },
            { num: '100%', label: 'Fait à la main' },
            { num: 'Sur ✦', label: 'Commande possible' },
          ].map((f, i) => (
            <motion.div
              key={i}
              style={st.featureItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span style={st.featureNum}>{f.num}</span>
              <span style={st.featureLabel}>{f.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════ CATEGORIES ══════════════════════ */}
      <section style={st.section}>
        {/* Section header */}
        <motion.div
          style={st.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p style={st.sectionEyebrow}>Nos Collections</p>
          <h2 style={st.sectionTitle}>Explorez par<br /><em style={{ fontStyle: 'italic', color: '#d4a96a' }}>Catégorie</em></h2>
          <div style={st.titleUnderline} />
        </motion.div>

        {/* Category grid */}
        <div style={st.catGrid}>
          {visibleCats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
            >
              <Link to={`/produits?category=${cat.slug}`} style={st.catCard} className="cat-card-link">
                {/* Moroccan pattern BG */}
                <div style={st.catCardPattern} />
                {/* Icon */}
                <div style={st.catIconWrap}>
                  <CatIcon slug={cat.slug} />
                </div>
                <div style={st.catCardContent}>
                  <h3 style={st.catName}>{cat.name}</h3>
                  <p style={st.catCount}>{cat.products_count || 0} produit{(cat.products_count || 0) !== 1 ? 's' : ''}</p>
                </div>
                <span style={st.catArrow}>
                  <ArrowRight size={15} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Show more */}
        {categories.length > CAT_PREVIEW && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: '2rem' }}
          >
            <button style={st.showMoreBtn} onClick={() => setShowAllCats(!showAllCats)}>
              {showAllCats ? 'Réduire' : `Voir tout (${categories.length})`}
              <ChevronDown size={15} style={{ transform: showAllCats ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }} />
            </button>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════ SAVOIR-FAIRE INTERLUDE ══════════════════════ */}
      <section style={st.interlude}>
        <div style={st.interludePattern} />
        <div style={st.interludeContent}>
          <motion.img
            src={STAR_SVG} alt=""
            style={{ width: '60px', margin: '0 auto 1.5rem', display: 'block', opacity: 0.7 }}
            initial={{ opacity: 0, rotate: -45 }}
            whileInView={{ opacity: 0.7, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />
          <motion.p
            style={st.interludeQuote}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            "L'art de vivre marocain, sublimé dans chaque courbe,
            chaque motif, chaque touche de nos artisans."
          </motion.p>
          <motion.p
            style={st.interludeAuthor}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            — Tapisri-Said, Meknès
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════ FEATURED PRODUCTS ══════════════════════ */}
      {featured.length > 0 && (
        <section style={st.featuredSection}>
          <div style={st.featuredInner}>
            <motion.div
              style={{ ...st.sectionHeader, marginBottom: '2.5rem' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p style={st.sectionEyebrow}>Sélection</p>
              <h2 style={st.sectionTitle}>Pièces<br /><em style={{ fontStyle: 'italic', color: '#d4a96a' }}>Vedettes</em></h2>
              <div style={st.titleUnderline} />
            </motion.div>

            <div style={st.productGrid}>
              {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginTop: '3rem' }}
            >
              <Link to="/produits" style={st.heroCta}>
                Voir toute la collection <ArrowRight size={17} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════ WHY US ══════════════════════ */}
      <section style={st.whySection}>
        <div style={st.whyInner}>
          <motion.div
            style={{ ...st.sectionHeader, textAlign: 'left', marginBottom: '3rem' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p style={st.sectionEyebrow}>Notre Engagement</p>
            <h2 style={{ ...st.sectionTitle, textAlign: 'left' }}>Pourquoi<br /><em style={{ fontStyle: 'italic', color: '#d4a96a' }}>Tapisri-Said?</em></h2>
            <div style={{ ...st.titleUnderline, marginLeft: 0 }} />
          </motion.div>

          <div style={st.whyGrid}>
            {[
              { n: '01', title: 'Artisanat Pur', desc: 'Chaque meuble est façonné à la main par des artisans marocains qui transmettent leur savoir-faire de génération en génération.' },
              { n: '02', title: 'Matériaux Nobles', desc: 'Bois sélectionné, tissus premium, finitions soignées. Nous n\'utilisons que des matériaux de qualité supérieure.' },
              { n: '03', title: 'Sur Mesure', desc: 'Personnalisez vos meubles selon vos dimensions, couleurs et préférences. Chaque création est unique.' },
              { n: '04', title: 'Livraison Maroc', desc: 'Livraison soigneuse dans tout le Maroc. Votre mobilier arrive en parfait état, emballé avec soin.' },
            ].map((w, i) => (
              <motion.div
                key={i}
                style={st.whyCard}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                <span style={st.whyNum}>{w.n}</span>
                <h3 style={st.whyTitle}>{w.title}</h3>
                <p style={st.whyDesc}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer style={st.footer}>
        {/* Decorative top border */}
        <div style={st.footerTopBorder} />

        <div style={st.footerInner}>
          {/* Brand */}
          <div style={st.footerCol}>
            <p style={st.footerBrand}>
              Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
            </p>
            <p style={st.footerTagline}>
              Mobilier marocain artisanal,<br />façonné avec amour et tradition.
            </p>
            <img src={STAR_SVG} alt="" style={{ width: '40px', opacity: 0.4, margin: '0.8rem 0' }} />
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={st.footerWa}>
              <MessageCircle size={15} /> Nous contacter
            </a>
          </div>

          {/* Navigation */}
          <div style={st.footerCol}>
            <p style={st.footerColTitle}>Navigation</p>
            <div style={st.footerLinks}>
              <Link to="/" style={st.footerLink}>Accueil</Link>
              <Link to="/produits" style={st.footerLink}>Tous les produits</Link>
              {categories.slice(0, 4).map(cat => (
                <Link key={cat.id} to={`/produits?category=${cat.slug}`} style={st.footerLink}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={st.footerCol}>
            <p style={st.footerColTitle}>Contact</p>
            <div style={st.footerContacts}>
              {[
                { icon: <Phone size={13} />, text: '+212 671 998 528' },
                { icon: <MapPin size={13} />, text: 'Meknès, Maroc' },
                { icon: <Clock size={13} />, text: 'Lun – Sam, 9h – 19h' },
              ].map((c, i) => (
                <div key={i} style={st.footerContact}>
                  <span style={st.footerContactIcon}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={st.footerBottom}>
          <span>© 2026 Tapisri-Said — Tous droits réservés</span>
          <Link to="/admin/login" style={st.footerAdminLink}>Espace Admin</Link>
        </div>
      </footer>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ STYLES ═══ */
const st = {
  /* Hero */
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex', alignItems: 'center',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: `url(/images/tapi.jpg) center 40%/cover no-repeat`,
    zIndex: 0,
  },
  heroOverlay: {
    position: 'absolute', inset: 0, zIndex: 1,
    background: 'linear-gradient(120deg, rgba(8,3,1,0.88) 0%, rgba(18,8,4,0.75) 45%, rgba(44,18,8,0.45) 100%)',
  },
  heroPattern: {
    position: 'absolute', inset: 0, zIndex: 1,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="%23d4a96a" stroke-width="0.3" opacity="0.07"/></svg>')}")`,
    backgroundSize: '80px 80px',
    pointerEvents: 'none',
  },
  heroVertLabel: {
    position: 'absolute', left: 'clamp(1rem,3vw,2.5rem)',
    top: '50%', transform: 'translateY(-50%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    zIndex: 3,
  },
  heroContent: {
    position: 'relative', zIndex: 3,
    maxWidth: '680px',
    padding: 'clamp(2rem,6vw,5rem) clamp(1.5rem,6vw,7rem)',
    paddingLeft: 'clamp(4rem,9vw,9rem)',
  },
  heroBadge: {
    display: 'inline-block',
    color: '#d4a96a',
    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(212,169,106,0.3)',
    paddingBottom: '0.4rem',
  },
  heroTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(3rem, 9vw, 6.5rem)',
    fontWeight: 300,
    color: '#fff',
    lineHeight: 0.95,
    letterSpacing: '-1px',
    margin: '0 0 1.8rem',
  },
  heroTitleItalic: {
    fontStyle: 'italic',
    fontWeight: 400,
    color: 'rgba(245,230,211,0.9)',
  },
  heroTitleAccent: {
    color: '#d4a96a',
    fontWeight: 600,
    fontStyle: 'normal',
  },
  heroSub: {
    fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
    color: 'rgba(245,230,211,0.7)',
    lineHeight: 1.8,
    margin: '0 0 2.5rem',
    maxWidth: '420px',
    fontWeight: 300,
  },
  heroBtns: {
    display: 'flex', gap: '1rem', flexWrap: 'wrap',
  },
  heroCta: {
    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
    background: '#d4a96a', color: '#1c0e08',
    padding: '0.9rem 2rem', borderRadius: '4px',
    textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
    letterSpacing: '0.5px', textTransform: 'uppercase',
    boxShadow: '0 4px 20px rgba(212,169,106,0.4)',
    transition: 'background 0.2s, transform 0.2s',
  },
  heroWa: {
    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
    background: 'rgba(255,255,255,0.08)',
    color: '#f5e6d3',
    border: '1px solid rgba(245,230,211,0.25)',
    padding: '0.9rem 1.8rem', borderRadius: '4px',
    textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem',
    letterSpacing: '0.3px',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.2s',
  },
  scrollIndicator: {
    position: 'absolute', bottom: '2.5rem', left: '50%',
    transform: 'translateX(-50%)', zIndex: 3,
    width: '24px', height: '38px', borderRadius: '12px',
    border: '1.5px solid rgba(212,169,106,0.4)',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    padding: '5px',
  },
  scrollDot: {
    width: '4px', height: '8px', borderRadius: '2px',
    background: '#d4a96a',
  },

  /* Feature strip */
  featureStrip: {
    background: '#1c0e08',
    borderTop: '1px solid rgba(212,169,106,0.15)',
    borderBottom: '1px solid rgba(212,169,106,0.15)',
  },
  featureInner: {
    maxWidth: '1100px', margin: '0 auto',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
  },
  featureItem: {
    padding: '2rem 1.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.3rem',
    alignItems: 'center', textAlign: 'center',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  featureNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
    fontWeight: 600, color: '#d4a96a', lineHeight: 1,
  },
  featureLabel: {
    fontSize: '0.72rem', color: 'rgba(245,230,211,0.5)',
    fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px',
  },

  /* Sections */
  section: {
    padding: 'clamp(3rem, 6vw, 5rem) clamp(1.2rem, 4vw, 3rem)',
    maxWidth: '1200px', margin: '0 auto',
  },
  sectionHeader: { textAlign: 'center', marginBottom: '3rem' },
  sectionEyebrow: {
    color: '#b08060', fontWeight: 600,
    textTransform: 'uppercase', fontSize: '0.68rem',
    letterSpacing: '3px', margin: '0 0 0.8rem',
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
    fontWeight: 400, color: '#1c0e08', margin: '0 0 1rem',
    lineHeight: 1.1,
  },
  titleUnderline: {
    width: '40px', height: '1px',
    background: '#d4a96a', margin: '0 auto',
  },

  /* Categories */
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  catCard: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    background: '#fff', borderRadius: '8px',
    padding: '1.5rem', textDecoration: 'none',
    border: '1px solid #ede8e3',
    boxShadow: '0 2px 12px rgba(44,24,16,0.05)',
    transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
    position: 'relative', overflow: 'hidden',
  },
  catCardPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M15 0 L30 15 L15 30 L0 15 Z" fill="none" stroke="%23d4a96a" stroke-width="0.3" opacity="0.3"/></svg>')}")`,
    backgroundSize: '30px 30px',
    opacity: 0, transition: 'opacity 0.3s',
    pointerEvents: 'none',
  },
  catIconWrap: {
    width: '52px', height: '52px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #fdf4e8, #f5e6d3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#9a6a3a', flexShrink: 0,
    border: '1px solid rgba(212,169,106,0.2)',
  },
  catCardContent: { flex: 1, minWidth: 0 },
  catName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.15rem', fontWeight: 600, color: '#1c0e08',
    margin: '0 0 0.2rem',
  },
  catCount: { fontSize: '0.78rem', color: '#b08060', margin: 0, fontWeight: 500 },
  catArrow: { color: '#d4a96a', flexShrink: 0, opacity: 0.6 },

  /* Interlude quote */
  interlude: {
    position: 'relative',
    background: '#1c0e08',
    padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 6vw, 4rem)',
    overflow: 'hidden',
  },
  interludePattern: {
    position: 'absolute', inset: 0,
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="%23d4a96a" stroke-width="0.4" opacity="0.06"/></svg>')}")`,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  interludeContent: {
    position: 'relative', zIndex: 1,
    maxWidth: '700px', margin: '0 auto', textAlign: 'center',
  },
  interludeQuote: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
    fontWeight: 400, fontStyle: 'italic',
    color: 'rgba(245,230,211,0.9)',
    lineHeight: 1.5, margin: '0 0 1.5rem',
  },
  interludeAuthor: {
    fontSize: '0.78rem', color: 'rgba(212,169,106,0.7)',
    fontWeight: 600, letterSpacing: '2px',
    textTransform: 'uppercase', margin: 0,
  },

  /* Featured products */
  featuredSection: {
    background: '#fff',
    padding: 'clamp(3rem, 6vw, 5rem) 0',
  },
  featuredInner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 clamp(1.2rem, 4vw, 3rem)',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.4rem',
  },

  /* Why section */
  whySection: {
    background: '#faf6f1',
    padding: 'clamp(3rem, 6vw, 5rem) 0',
  },
  whyInner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 clamp(1.2rem, 4vw, 3rem)',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  whyCard: {
    background: '#fff', borderRadius: '8px', padding: '2rem',
    border: '1px solid #ede8e3',
    boxShadow: '0 2px 12px rgba(44,24,16,0.04)',
  },
  whyNum: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '2.5rem', fontWeight: 300, color: 'rgba(212,169,106,0.3)',
    display: 'block', lineHeight: 1, marginBottom: '0.8rem',
  },
  whyTitle: {
    fontSize: '1rem', fontWeight: 700, color: '#1c0e08',
    margin: '0 0 0.6rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  whyDesc: {
    fontSize: '0.86rem', color: '#7a6055', lineHeight: 1.75, margin: 0,
  },

  /* Footer */
  footer: { background: '#1c0e08', color: '#f5e6d3' },
  footerTopBorder: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(212,169,106,0.4), transparent)',
  },
  footerInner: {
    maxWidth: '1100px', margin: '0 auto',
    padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2.5rem',
  },
  footerCol: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  footerBrand: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: '2rem', fontWeight: 600, color: '#fff',
    margin: '0 0 0.2rem', letterSpacing: '0.5px',
  },
  footerTagline: { fontSize: '0.84rem', color: 'rgba(245,230,211,0.45)', lineHeight: 1.7, margin: 0 },
  footerWa: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#25D366', color: '#fff', textDecoration: 'none',
    padding: '0.6rem 1rem', borderRadius: '6px',
    fontWeight: 700, fontSize: '0.83rem', width: 'fit-content',
    marginTop: '0.3rem',
  },
  footerColTitle: {
    fontWeight: 700, color: '#d4a96a',
    textTransform: 'uppercase', fontSize: '0.68rem',
    letterSpacing: '2px', margin: '0 0 0.4rem',
  },
  footerLinks: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  footerLink: {
    color: 'rgba(245,230,211,0.55)', textDecoration: 'none',
    fontSize: '0.87rem', transition: 'color 0.15s',
  },
  footerContacts: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  footerContact: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    color: 'rgba(245,230,211,0.55)', fontSize: '0.86rem',
  },
  footerContactIcon: { color: '#d4a96a', flexShrink: 0 },
  footerBottom: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '0.5rem',
    padding: '1rem clamp(1.5rem, 4vw, 3rem)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: '0.78rem', color: 'rgba(245,230,211,0.3)',
    maxWidth: '100%',
  },
  footerAdminLink: {
    color: 'rgba(212,169,106,0.4)', textDecoration: 'none', fontSize: '0.78rem',
  },
  showMoreBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    background: '#fff', color: '#1c0e08',
    border: '1.5px solid #d4a96a',
    padding: '0.7rem 1.8rem', borderRadius: '4px',
    fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
    letterSpacing: '0.5px', textTransform: 'uppercase',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 2px 12px rgba(44,24,16,0.06)',
    transition: 'background 0.2s',
  },
}
