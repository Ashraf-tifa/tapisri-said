import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil, Trash2, Plus, Sofa, BedDouble, Armchair,
  Package, Tag, Check, X, Layers,
} from 'lucide-react'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'
import { useToast } from '../../components/Toast'

/* ─── Category icon + color palette ──────────────────────── */
const PALETTE = [
  { bg: '#fdf0e0', icon: '#c0804a', border: '#f0d5a8' },
  { bg: '#edf5ff', icon: '#3b7de8', border: '#bdd6f8' },
  { bg: '#f0fdf4', icon: '#2e9e5b', border: '#a8dfc0' },
  { bg: '#fdf0f8', icon: '#c050a0', border: '#f0bae0' },
  { bg: '#f5f0ff', icon: '#7050d0', border: '#cfc0f8' },
  { bg: '#fff7ed', icon: '#d06030', border: '#f8d0a8' },
]

const CAT_ICONS = { 'salon-marocain': Sofa, 'canape': Armchair, 'lit': BedDouble }

function CatIcon({ slug, size = 28 }) {
  const Icon = CAT_ICONS[slug] || Package
  return <Icon size={size} strokeWidth={1.5} />
}

/* ─── Inline editable card ────────────────────────────────── */
function CategoryCard({ cat, index, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(cat.name)
  const inputRef = useRef()
  const palette = PALETTE[index % PALETTE.length]

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleSave = () => {
    if (value.trim() && value.trim() !== cat.name) {
      onEdit(cat.id, value.trim())
    }
    setEditing(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setValue(cat.name); setEditing(false) }
  }

  return (
    <motion.div
      style={{ ...s.card, borderColor: palette.border, background: '#fff' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      {/* Top accent bar */}
      <div style={{ ...s.topBar, background: palette.bg, borderBottomColor: palette.border }}>
        <div style={{ ...s.iconCircle, background: palette.bg, color: palette.icon, border: `2px solid ${palette.border}` }}>
          <CatIcon slug={cat.slug} />
        </div>
      </div>

      {/* Body */}
      <div style={s.cardBody}>
        {/* Name: editable inline */}
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={s.editRow}
            >
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKey}
                style={{ ...s.editInput, borderColor: palette.icon }}
              />
              <button style={{ ...s.iconBtn, background: '#e8f5e9', color: '#2e7d32' }} onClick={handleSave}>
                <Check size={15} />
              </button>
              <button style={{ ...s.iconBtn, background: '#fce4ec', color: '#c62828' }} onClick={() => { setValue(cat.name); setEditing(false) }}>
                <X size={15} />
              </button>
            </motion.div>
          ) : (
            <motion.p key="name" style={s.catName} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {cat.name}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Count */}
        <div style={s.countRow}>
          <span style={{ ...s.countBadge, background: palette.bg, color: palette.icon, borderColor: palette.border }}>
            <Layers size={11} />
            {cat.products_count ?? 0} produit{(cat.products_count ?? 0) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Actions */}
      {!editing && (
        <div style={s.actions}>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            style={{ ...s.iconBtn, background: palette.bg, color: palette.icon }}
            onClick={() => setEditing(true)}
            title="Renommer"
          >
            <Pencil size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
            style={{ ...s.iconBtn, background: '#fdedf0', color: '#d93025' }}
            onClick={() => onDelete(cat)}
            title="Supprimer"
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Add Modal (name only) ───────────────────────────────── */
function AddModal({ open, onClose, onSave, isPending }) {
  const [name, setName] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    if (open) { setName(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [open])

  const handleSave = () => {
    if (name.trim()) { onSave(name.trim()); setName('') }
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        style={ms.overlay}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          style={ms.modal}
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        >
          {/* Icon header */}
          <div style={ms.iconHeader}>
            <div style={ms.bigIcon}><Tag size={28} /></div>
            <button style={ms.closeX} onClick={onClose}><X size={18} /></button>
          </div>

          <h2 style={ms.title}>Nouvelle catégorie</h2>
          <p style={ms.subtitle}>Donnez un nom à votre nouvelle catégorie</p>

          <input
            ref={inputRef}
            style={ms.input}
            placeholder="Ex: Salon Marocain, Tapis, Canapé..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
          />

          <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.2rem' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              style={{ ...ms.saveBtn, opacity: (!name.trim() || isPending) ? 0.6 : 1 }}
              onClick={handleSave}
              disabled={isPending || !name.trim()}
            >
              <Plus size={17} />
              {isPending ? 'Création...' : 'Créer la catégorie'}
            </motion.button>
            <button style={ms.cancelBtn} onClick={onClose}>Annuler</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const ms = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(20,10,5,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { background: '#fff', borderRadius: '24px', width: '100%', maxWidth: '420px', padding: '2rem', boxShadow: '0 32px 80px rgba(0,0,0,0.28)', textAlign: 'center', position: 'relative' },
  iconHeader: { display: 'flex', justifyContent: 'center', marginBottom: '1.2rem', position: 'relative' },
  bigIcon: { width: '64px', height: '64px', borderRadius: '18px', background: '#fdf4e8', color: '#d4a96a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(212,169,106,0.3)' },
  closeX: { position: 'absolute', top: '-0.5rem', right: 0, background: '#f0e8de', border: 'none', borderRadius: '8px', padding: '0.38rem', cursor: 'pointer', color: '#888', display: 'flex' },
  title: { margin: '0 0 0.35rem', fontSize: '1.3rem', fontWeight: 900, color: '#2c1810' },
  subtitle: { margin: '0 0 1.3rem', color: '#aaa', fontSize: '0.88rem' },
  input: { width: '100%', padding: '0.88rem 1rem', border: '2px solid #e8ddd4', borderRadius: '12px', fontSize: '1rem', fontFamily: 'inherit', background: '#fdfaf7', outline: 'none', boxSizing: 'border-box', textAlign: 'left', color: '#2c1810', transition: 'border-color 0.2s' },
  saveBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.88rem', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.96rem' },
  cancelBtn: { flex: 1, background: '#f0e8de', color: '#777', border: 'none', padding: '0.88rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem' },
}

/* ─── Main page ───────────────────────────────────────────── */
export default function AdminCategories() {
  const qc = useQueryClient()
  const toast = useToast()
  const [showAdd, setShowAdd] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: (name) => api.post('/admin/categories', { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      setShowAdd(false)
      toast('Catégorie créée avec succès', 'success')
    },
    onError: () => toast('Une erreur est survenue', 'error'),
  })

  const update = useMutation({
    mutationFn: ({ id, name }) => api.put(`/admin/categories/${id}`, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast('Catégorie renommée', 'success')
    },
    onError: () => toast('Impossible de modifier', 'error'),
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

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Catégories</h1>
          <p style={s.pageCount}>
            {categories.length} catégorie{categories.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} style={s.addBtn} onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Ajouter
        </motion.button>
      </div>

      {/* Skeleton loading */}
      {isLoading && (
        <div style={s.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={s.skeleton} />
          ))}
        </div>
      )}

      {/* Grid of cards */}
      {!isLoading && (
        <motion.div style={s.grid} layout>
          <AnimatePresence>
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.id}
                cat={cat}
                index={i}
                onEdit={(id, name) => update.mutate({ id, name })}
                onDelete={(cat) => setDeleteTarget(cat)}
              />
            ))}

            {/* Add card button */}
            <motion.button
              key="add-card"
              style={s.addCard}
              onClick={() => setShowAdd(true)}
              whileHover={{ scale: 1.03, borderColor: '#d4a96a' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={s.addCardIcon}><Plus size={22} /></div>
              <span style={s.addCardText}>Nouvelle catégorie</span>
            </motion.button>
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && categories.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.emptyState}>
          <div style={s.emptyIconWrap}><Tag size={34} strokeWidth={1.3} /></div>
          <p style={s.emptyTitle}>Aucune catégorie</p>
          <p style={s.emptyDesc}>Créez votre première catégorie pour organiser vos produits.</p>
          <motion.button whileTap={{ scale: 0.96 }} style={s.emptyBtn} onClick={() => setShowAdd(true)}>
            <Plus size={16} /> Créer une catégorie
          </motion.button>
        </motion.div>
      )}

      <AddModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={(name) => create.mutate(name)}
        isPending={create.isPending}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer la catégorie"
        message={`Supprimer "${deleteTarget?.name}" ? Les produits associés seront aussi supprimés.`}
        onConfirm={() => remove.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' },
  pageTitle: { fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 800, color: '#2c1810', margin: '0 0 0.15rem' },
  pageCount: { margin: 0, fontSize: '0.82rem', color: '#9a8070', fontWeight: 500 },
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.68rem 1.3rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.92rem', flexShrink: 0, boxShadow: '0 4px 16px rgba(44,24,16,0.22)' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' },

  skeleton: { height: '160px', borderRadius: '16px', background: 'linear-gradient(90deg, #f5ede4 25%, #fdf8f2 50%, #f5ede4 75%)', backgroundSize: '200%', animation: 'shimmer 1.4s infinite' },

  card: { borderRadius: '16px', border: '1.5px solid #f0e8de', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#fff', boxShadow: '0 2px 10px rgba(44,24,16,0.06)', position: 'relative' },
  topBar: { padding: '1.4rem 1rem 0.9rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid' },
  iconCircle: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '0.85rem 0.9rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center', textAlign: 'center' },
  catName: { margin: 0, fontWeight: 800, color: '#2c1810', fontSize: '0.97rem', lineHeight: 1.3 },
  countRow: { display: 'flex', justifyContent: 'center' },
  countBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.28rem', padding: '0.22rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid' },
  actions: { display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 0.9rem', borderTop: '1px solid #f5ede4' },
  iconBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', borderRadius: '8px', padding: '0.42rem', cursor: 'pointer' },
  editRow: { display: 'flex', gap: '0.3rem', width: '100%', alignItems: 'center' },
  editInput: { flex: 1, padding: '0.42rem 0.6rem', border: '2px solid', borderRadius: '7px', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', background: '#fdfaf7', color: '#2c1810', minWidth: 0 },

  addCard: { borderRadius: '16px', border: '2px dashed #e8d5b0', background: '#fdfaf7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', padding: '2rem 1rem', cursor: 'pointer', minHeight: '160px', transition: 'border-color 0.2s' },
  addCardIcon: { width: '44px', height: '44px', borderRadius: '12px', background: '#fdf0e0', color: '#d4a96a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e8d5b0' },
  addCardText: { color: '#b08060', fontWeight: 700, fontSize: '0.88rem' },

  emptyState: { textAlign: 'center', padding: '3rem 1.5rem', background: '#fff', borderRadius: '16px', border: '1.5px dashed #e8ddd4', marginTop: '0.5rem' },
  emptyIconWrap: { color: '#d4b896', marginBottom: '1rem', display: 'flex', justifyContent: 'center' },
  emptyTitle: { fontWeight: 800, color: '#2c1810', fontSize: '1.1rem', margin: '0 0 0.4rem' },
  emptyDesc: { color: '#aaa', fontSize: '0.88rem', margin: '0 0 1.2rem' },
  emptyBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' },
}
