import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Plus, Sofa, BedDouble, Armchair, Package, Search, Tag } from 'lucide-react'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'
import FormModal from '../../components/FormModal'
import { useToast } from '../../components/Toast'

const CAT_ICONS = {
  'salon-marocain': Sofa,
  'canape': Armchair,
  'lit': BedDouble,
}

function CatIcon({ slug, size = 22 }) {
  const Icon = CAT_ICONS[slug] || Package
  return <Icon size={size} strokeWidth={1.6} />
}

export default function AdminCategories() {
  const qc = useQueryClient()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', description: '' })
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const save = useMutation({
    mutationFn: (data) => editId
      ? api.put(`/admin/categories/${editId}`, data)
      : api.post('/admin/categories', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setForm({ name: '', description: '' })
      setEditId(null)
      setShowForm(false)
      toast(editId ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès', 'success')
    },
    onError: () => toast('Une erreur est survenue', 'error'),
  })

  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setDeleteTarget(null)
      toast('Catégorie supprimée', 'warning')
    },
    onError: () => toast('Impossible de supprimer cette catégorie', 'error'),
  })

  const openAdd = () => { setForm({ name: '', description: '' }); setEditId(null); setShowForm(true) }
  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '' })
    setEditId(cat.id); setShowForm(true)
  }
  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) })

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Catégories</h1>
          <p style={s.pageCount}>{categories.length} catégorie{categories.length !== 1 ? 's' : ''} au total</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} style={s.addBtn} onClick={openAdd}>
          <Plus size={18} /> Ajouter
        </motion.button>
      </div>

      {/* Search bar */}
      {categories.length > 0 && (
        <div style={s.searchWrap}>
          <Search size={16} style={s.searchIcon} />
          <input
            style={s.searchInput}
            placeholder="Rechercher une catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={s.clearBtn} onClick={() => setSearch('')}>×</button>
          )}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={s.loading}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={s.skeleton} />
          ))}
        </div>
      )}

      {/* Cards */}
      <div style={s.grid}>
        <AnimatePresence>
          {filtered.map((cat, i) => (
            <motion.div
              key={cat.id} style={s.card}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
            >
              <div style={s.cardIcon}>
                <CatIcon slug={cat.slug} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={s.catName}>{cat.name}</p>
                {cat.description
                  ? <p style={s.catDesc}>{cat.description}</p>
                  : <p style={{ ...s.catDesc, fontStyle: 'italic', opacity: 0.5 }}>Aucune description</p>
                }
                <span style={s.countBadge}>
                  {cat.products_count} produit{cat.products_count !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={s.actions}>
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  style={s.editBtn} onClick={() => openEdit(cat)}
                  title="Modifier"
                >
                  <Pencil size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                  style={s.deleteBtn} onClick={() => setDeleteTarget(cat)}
                  title="Supprimer"
                >
                  <Trash2 size={15} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.emptyState}>
            <div style={s.emptyIcon}><Tag size={32} strokeWidth={1.3} /></div>
            <p style={s.emptyTitle}>
              {search ? 'Aucun résultat' : 'Aucune catégorie'}
            </p>
            <p style={s.emptyDesc}>
              {search
                ? `Aucune catégorie ne correspond à "${search}"`
                : 'Commencez par créer votre première catégorie.'}
            </p>
            {!search && (
              <motion.button whileTap={{ scale: 0.96 }} style={s.emptyBtn} onClick={openAdd}>
                <Plus size={16} /> Créer une catégorie
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* Form Modal */}
      <FormModal
        open={showForm}
        title={editId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        onClose={() => setShowForm(false)}
        width={480}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={s.label}>Nom *</label>
            <input style={s.input} placeholder="Ex: Salon Marocain" {...f('name')} />
          </div>
          <div>
            <label style={s.label}>Description</label>
            <textarea
              style={{ ...s.input, minHeight: '85px', resize: 'vertical' }}
              placeholder="Description de la catégorie..."
              {...f('description')}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.7rem', paddingTop: '0.2rem' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{ ...s.saveBtn, opacity: (!form.name.trim() || save.isPending) ? 0.6 : 1 }}
              onClick={() => save.mutate(form)}
              disabled={save.isPending || !form.name.trim()}
            >
              {save.isPending ? 'Sauvegarde...' : 'Enregistrer'}
            </motion.button>
            <button style={s.cancelBtn} onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer la catégorie"
        message={`Supprimer "${deleteTarget?.name}" ? Tous ses produits seront supprimés.`}
        onConfirm={() => remove.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  pageTitle: { fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 800, color: '#2c1810', margin: '0 0 0.15rem' },
  pageCount: { margin: 0, fontSize: '0.82rem', color: '#9a8070', fontWeight: 500 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#d4a96a', color: '#2c1810', border: 'none', padding: '0.65rem 1.2rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', flexShrink: 0 },

  searchWrap: {
    position: 'relative', marginBottom: '1rem',
    display: 'flex', alignItems: 'center',
  },
  searchIcon: { position: 'absolute', left: '0.9rem', color: '#aaa', pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '0.7rem 0.9rem 0.7rem 2.5rem',
    border: '1.5px solid #e8ddd4', borderRadius: '10px',
    fontSize: '0.92rem', background: '#fff', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  clearBtn: {
    position: 'absolute', right: '0.8rem',
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '1.1rem', color: '#aaa', lineHeight: 1, padding: '0.2rem',
  },

  loading: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  skeleton: { height: '80px', borderRadius: '12px', background: '#f0e8de', animation: 'pulse 1.5s ease-in-out infinite' },

  grid: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  card: {
    background: '#fff', padding: '1rem 1.1rem', borderRadius: '14px',
    display: 'flex', alignItems: 'center', gap: '0.9rem',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)', border: '1px solid #f5ede4',
  },
  cardIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    background: '#fdf4e8', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: '#9a6a3a', flexShrink: 0,
  },
  catName: { margin: '0 0 0.2rem', fontWeight: 800, color: '#2c1810', fontSize: '0.97rem' },
  catDesc: { margin: '0 0 0.45rem', color: '#999', fontSize: '0.82rem', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  countBadge: { display: 'inline-block', background: '#f5e6d3', color: '#9a6a3a', padding: '0.12rem 0.6rem', borderRadius: '20px', fontSize: '0.73rem', fontWeight: 700 },
  actions: { display: 'flex', gap: '0.4rem', flexShrink: 0 },
  editBtn: { background: '#eef2fd', color: '#3b6de8', border: 'none', padding: '0.55rem', borderRadius: '9px', cursor: 'pointer', display: 'flex' },
  deleteBtn: { background: '#fdedf0', color: '#d93025', border: 'none', padding: '0.55rem', borderRadius: '9px', cursor: 'pointer', display: 'flex' },

  emptyState: {
    textAlign: 'center', padding: '3rem 1.5rem',
    background: '#fff', borderRadius: '16px', border: '1.5px dashed #e8ddd4',
  },
  emptyIcon: { color: '#d4b896', marginBottom: '0.8rem', display: 'flex', justifyContent: 'center' },
  emptyTitle: { fontWeight: 800, color: '#2c1810', fontSize: '1.1rem', margin: '0 0 0.4rem' },
  emptyDesc: { color: '#aaa', fontSize: '0.88rem', margin: '0 0 1.2rem', lineHeight: 1.5 },
  emptyBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#d4a96a', color: '#2c1810', border: 'none', padding: '0.7rem 1.4rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' },

  label: { display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#888', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '0.78rem 0.95rem', border: '1.5px solid #e0d0c0', borderRadius: '9px', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fdfaf7', outline: 'none' },
  saveBtn: { flex: 1, background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.82rem', borderRadius: '9px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { flex: 1, background: '#f0e8de', color: '#777', border: 'none', padding: '0.82rem', borderRadius: '9px', cursor: 'pointer', fontWeight: 600 },
}
