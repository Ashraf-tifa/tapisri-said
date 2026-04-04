import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle, User } from 'lucide-react'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import { useToast } from '../../components/Toast'

export default function AdminSettings() {
  const user = useAuthStore((s) => s.user)
  const toast = useToast()
  const [form, setForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [error, setError] = useState('')

  const change = useMutation({
    mutationFn: (data) => api.post('/admin/change-password', data),
    onSuccess: () => {
      setError('')
      setForm({ current_password: '', new_password: '', new_password_confirmation: '' })
      toast('Mot de passe modifié avec succès !', 'success')
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Une erreur est survenue.')
      toast(err.response?.data?.message || 'Mot de passe actuel incorrect', 'error')
    },
  })

  const handleSubmit = () => {
    if (!form.current_password || !form.new_password || !form.new_password_confirmation) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    if (form.new_password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (form.new_password !== form.new_password_confirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setError('')
    change.mutate(form)
  }

  return (
    <div>
      <h1 style={s.pageTitle}>Paramètres</h1>

      <div style={s.layout}>
        {/* Profile card */}
        <div style={s.profileCard}>
          <div style={s.avatar}>
            <User size={32} color="#d4a96a" />
          </div>
          <div>
            <p style={s.userName}>{user?.name || 'Admin'}</p>
            <p style={s.userEmail}>{user?.email || 'admin@tapisri.ma'}</p>
          </div>
        </div>

        {/* Change password card */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardIconWrap}><Lock size={20} color="#9a6a3a" /></div>
            <div>
              <h2 style={s.cardTitle}>Changer le mot de passe</h2>
              <p style={s.cardSub}>Utilisez un mot de passe fort d'au moins 8 caractères.</p>
            </div>
          </div>

          <div style={s.form}>
            <div>
              <label style={s.label}>Mot de passe actuel</label>
              <div style={s.inputWrap}>
                <input
                  type={show.current ? 'text' : 'password'}
                  style={s.input}
                  placeholder="Mot de passe actuel"
                  value={form.current_password}
                  onChange={(e) => { setForm({ ...form, current_password: e.target.value }); setError('') }}
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShow({ ...show, current: !show.current })}>
                  {show.current ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label style={s.label}>Nouveau mot de passe</label>
              <div style={s.inputWrap}>
                <input
                  type={show.new ? 'text' : 'password'}
                  style={s.input}
                  placeholder="Nouveau mot de passe (min. 8 car.)"
                  value={form.new_password}
                  onChange={(e) => { setForm({ ...form, new_password: e.target.value }); setError('') }}
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShow({ ...show, new: !show.new })}>
                  {show.new ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label style={s.label}>Confirmer le mot de passe</label>
              <div style={s.inputWrap}>
                <input
                  type={show.confirm ? 'text' : 'password'}
                  style={s.input}
                  placeholder="Répéter le nouveau mot de passe"
                  value={form.new_password_confirmation}
                  onChange={(e) => { setForm({ ...form, new_password_confirmation: e.target.value }); setError('') }}
                />
                <button type="button" style={s.eyeBtn} onClick={() => setShow({ ...show, confirm: !show.confirm })}>
                  {show.confirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error inline */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={s.errorMsg}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{ ...s.saveBtn, opacity: change.isPending ? 0.7 : 1 }}
              onClick={handleSubmit}
              disabled={change.isPending}
            >
              {change.isPending ? 'Modification...' : 'Enregistrer le nouveau mot de passe'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  pageTitle: { fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 800, color: '#2c1810', margin: '0 0 1.5rem' },
  layout: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '540px' },

  profileCard: {
    background: '#fff', borderRadius: '14px', padding: '1.2rem 1.4rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  avatar: {
    width: '56px', height: '56px', borderRadius: '14px',
    background: '#fdf4e8', display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  userName: { margin: '0 0 0.15rem', fontWeight: 800, color: '#2c1810', fontSize: '1rem' },
  userEmail: { margin: 0, color: '#9a6a3a', fontSize: '0.85rem' },

  card: {
    background: '#fff', borderRadius: '16px', overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '1rem',
    padding: '1.3rem 1.5rem', borderBottom: '1px solid #f5ede4',
    background: '#fdfaf7',
  },
  cardIconWrap: {
    width: '44px', height: '44px', borderRadius: '12px', background: '#fdf4e8',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardTitle: { margin: '0 0 0.15rem', fontWeight: 800, color: '#2c1810', fontSize: '1rem' },
  cardSub: { margin: 0, color: '#999', fontSize: '0.8rem' },
  form: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#666', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  inputWrap: { position: 'relative' },
  input: {
    width: '100%', padding: '0.8rem 2.8rem 0.8rem 0.95rem',
    border: '1.5px solid #e0d0c0', borderRadius: '10px',
    fontSize: '0.95rem', boxSizing: 'border-box',
    fontFamily: 'inherit', background: '#fdfaf7', outline: 'none',
  },
  eyeBtn: {
    position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#aaa',
    display: 'flex', padding: '0.2rem',
  },
  errorMsg: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#fce4ec', color: '#c62828', padding: '0.75rem 1rem',
    borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600,
  },
  successMsg: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem 1rem',
    borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600,
  },
  saveBtn: {
    background: '#2c1810', color: '#d4a96a', border: 'none',
    padding: '0.9rem', borderRadius: '10px', fontWeight: 800,
    cursor: 'pointer', fontSize: '0.95rem', width: '100%',
  },
}
