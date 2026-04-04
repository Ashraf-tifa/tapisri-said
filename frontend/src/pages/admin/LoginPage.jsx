import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@tapisri.ma')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Background pattern */}
      <div style={s.bg} />

      <motion.div
        style={s.card}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Back link */}
        <Link to="/" style={s.backLink}>
          <ArrowLeft size={15} /> Retour au site
        </Link>

        {/* Logo */}
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>T</div>
        </div>
        <h1 style={s.title}>
          Tapisri<span style={{ color: '#d4a96a' }}>-Said</span>
        </h1>
        <p style={s.sub}>Espace Administration</p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={s.error}
          >
            <AlertCircle size={15} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Adresse email</label>
            <input
              style={s.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@tapisri.ma"
            />
          </div>

          <div style={s.field}>
            <label style={s.label}>Mot de passe</label>
            <div style={s.passWrap}>
              <input
                style={{ ...s.input, paddingRight: '2.8rem' }}
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <button
                type="button"
                style={s.eyeBtn}
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <span style={s.spinner} />
            ) : 'Se connecter'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#1c0e08',
    padding: '1.5rem',
    position: 'relative', overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 30% 20%, rgba(212,169,106,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(44,24,16,0.6) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  card: {
    background: '#fff', borderRadius: '20px',
    width: '100%', maxWidth: '400px',
    padding: 'clamp(1.8rem, 5vw, 2.5rem)',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
    position: 'relative', zIndex: 1,
  },
  backLink: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    color: '#aaa', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600,
    marginBottom: '1.5rem',
  },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' },
  logoIcon: {
    width: '52px', height: '52px', borderRadius: '14px',
    background: '#2c1810',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem', fontWeight: 900, color: '#d4a96a',
    fontFamily: 'Georgia, serif',
  },
  title: {
    textAlign: 'center', color: '#2c1810',
    fontSize: '1.8rem', fontWeight: 900, margin: '0 0 0.2rem',
    fontFamily: 'Georgia, serif',
  },
  sub: { textAlign: 'center', color: '#9a8070', marginBottom: '1.8rem', fontSize: '0.88rem' },
  error: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#fce4ec', color: '#c62828', padding: '0.75rem 1rem',
    borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem', fontWeight: 600,
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  label: { fontWeight: 700, color: '#555', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.4px' },
  passWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '0.82rem 1rem',
    border: '1.5px solid #e0d0c0', borderRadius: '10px',
    fontSize: '1rem', boxSizing: 'border-box',
    fontFamily: 'inherit', background: '#fdfaf7', outline: 'none',
    transition: 'border-color 0.15s',
  },
  eyeBtn: {
    position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex',
  },
  submitBtn: {
    width: '100%', padding: '0.95rem',
    background: '#2c1810', color: '#d4a96a',
    border: 'none', borderRadius: '10px',
    fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginTop: '0.4rem',
  },
  spinner: {
    width: '20px', height: '20px',
    border: '2.5px solid rgba(212,169,106,0.3)',
    borderTopColor: '#d4a96a',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    display: 'inline-block',
  },
}
