import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, Plus, Images, Star, Search, Package } from 'lucide-react'
import api from '../../api/axios'
import ImageUploader from '../../components/ImageUploader'
import ConfirmModal from '../../components/ConfirmModal'
import FormModal from '../../components/FormModal'
import { useToast } from '../../components/Toast'


import { img as IMG, WHATSAPP } from '../../config'
const emptyForm = { category_id: '', name: '', description: '', price: '', whatsapp_number: '', is_active: true, is_featured: false }
const PLACEHOLDER = 'https://placehold.co/80x80/f5e6d3/9a6a3a?text=?'

function useIsMobile() {
  const [v, setV] = useState(window.innerWidth < 640)
  useEffect(() => {
    const h = () => setV(window.innerWidth < 640)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])
  return v
}

export default function AdminProducts() {
  const qc = useQueryClient()
  const isMobile = useIsMobile()
  const toast = useToast()
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploadProduct, setUploadProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then((r) => r.data),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const save = useMutation({
    mutationFn: (data) => editId ? api.put(`/admin/products/${editId}`, data) : api.post('/admin/products', data),
    onSuccess: (response) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      setForm(emptyForm)
      setShowForm(false)
      if (!editId) {
        // Automatically open ImageUploader for new product
        const created = response.data
        toast('Produit créé ! Ajoutez les photos maintenant.', 'success')
        setUploadProduct({ ...created, images: [] })
      } else {
        setEditId(null)
        toast('Produit modifié avec succès', 'success')
      }
    },
    onError: () => toast('Une erreur est survenue', 'error'),
  })
  const remove = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      setDeleteTarget(null)
      toast('Produit supprimé', 'warning')
    },
    onError: () => toast('Impossible de supprimer ce produit', 'error'),
  })

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true) }
  const openEdit = (p) => {
    setForm({ category_id: p.category_id, name: p.name, description: p.description || '', price: p.price || '', whatsapp_number: p.whatsapp_number || '', is_active: p.is_active, is_featured: p.is_featured })
    setEditId(p.id); setShowForm(true)
  }

  const f = (key) => ({ value: form[key], onChange: (e) => setForm({ ...form, [key]: e.target.value }) })

  const uploadFull = uploadProduct
    ? { ...uploadProduct, images: products.find((p) => p.id === uploadProduct.id)?.images || [] }
    : null

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !filterCat || String(p.category_id) === filterCat
    return matchSearch && matchCat
  })

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Produits</h1>
          <p style={s.pageCount}>{products.length} produit{products.length !== 1 ? 's' : ''} au total</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} style={s.addBtn} onClick={openAdd}>
          <Plus size={18} /> Ajouter
        </motion.button>
      </div>

      {/* Search + filter */}
      {products.length > 0 && (
        <div style={s.filterRow}>
          <div style={s.searchWrap}>
            <Search size={15} style={s.searchIcon} />
            <input
              style={s.searchInput}
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && <button style={s.clearBtn} onClick={() => setSearch('')}>×</button>}
          </div>
          <select
            style={s.filterSelect}
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Add/Edit Modal */}
      <FormModal
        open={showForm}
        title={editId ? 'Modifier le produit' : 'Nouveau produit'}
        onClose={() => setShowForm(false)}
        width={520}
      >
        <input style={s.input} placeholder="Nom du produit *" {...f('name')} />
        <select style={s.input} {...f('category_id')}>
          <option value="">— Sélectionner une catégorie *</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
          <input style={s.input} type="number" placeholder="Prix (MAD)" {...f('price')} />
          <input style={s.input} placeholder="WhatsApp (+212...)" {...f('whatsapp_number')} />
        </div>
        <textarea style={{ ...s.input, minHeight: '90px', resize: 'vertical' }} placeholder="Description du produit" {...f('description')} />
        {!editId && (
          <div style={{ background: '#fdf4e8', border: '1px solid #e8d5b0', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#9a6a3a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📸 Après avoir sauvegardé, vous pourrez ajouter les photos.
          </div>
        )}
        <div style={s.checkRow}>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Actif
          </label>
          <label style={s.checkLabel}>
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
            <Star size={14} style={{ color: '#d4a96a' }} /> Vedette
          </label>
        </div>
        <div style={{ display: 'flex', gap: '0.7rem' }}>
          <motion.button whileTap={{ scale: 0.97 }} style={s.saveBtn} onClick={() => save.mutate(form)} disabled={save.isPending}>
            {save.isPending ? 'Sauvegarde...' : '✓ Sauvegarder'}
          </motion.button>
          <button style={s.cancelBtn} onClick={() => setShowForm(false)}>Annuler</button>
        </div>
      </FormModal>

      {/* Empty state */}
      {filtered.length === 0 && products.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.emptyState}>
          <Package size={28} color="#d4b896" />
          <p style={{ margin: '0.5rem 0 0', color: '#aaa', fontSize: '0.9rem', fontWeight: 600 }}>Aucun résultat trouvé</p>
          <p style={{ margin: '0.2rem 0 0', color: '#bbb', fontSize: '0.82rem' }}>Essayez un autre terme ou catégorie</p>
        </motion.div>
      )}
      {products.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...s.emptyState, border: '1.5px dashed #e8ddd4' }}>
          <Package size={32} color="#d4b896" />
          <p style={{ margin: '0.6rem 0 0.3rem', color: '#2c1810', fontWeight: 800, fontSize: '1rem' }}>Aucun produit</p>
          <p style={{ margin: 0, color: '#aaa', fontSize: '0.85rem' }}>Commencez par ajouter votre premier produit.</p>
          <motion.button whileTap={{ scale: 0.96 }} style={s.emptyBtn} onClick={openAdd}>
            <Plus size={15} /> Ajouter un produit
          </motion.button>
        </motion.div>
      )}

      {/* Mobile cards */}
      {isMobile ? (
        <div style={s.cardList}>
          {filtered.map((p, i) => (
            <motion.div key={p.id} style={s.productCard}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            >
              <img src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER} alt={p.name} style={s.cardImg} />
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <span style={s.cardCategory}>{p.category?.name}</span>
                  <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                    {p.is_featured && <Star size={13} fill="#d4a96a" color="#d4a96a" />}
                    <span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>
                      {p.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
                <p style={s.cardName}>{p.name}</p>
                {p.price && <p style={s.cardPrice}>{Number(p.price).toLocaleString('fr-MA')} MAD</p>}
                <div style={s.cardActions}>
                  <button style={s.actionBtn} onClick={() => setUploadProduct(p)}><Images size={15} /> Photos</button>
                  <button style={{ ...s.actionBtn, background: '#e8f0fe', color: '#1a73e8' }} onClick={() => openEdit(p)}><Pencil size={15} /></button>
                  <button style={{ ...s.actionBtn, background: '#fce4ec', color: '#c62828' }} onClick={() => setDeleteTarget(p)}><Trash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Desktop table */
        <div style={{ overflowX: 'auto', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Photo', 'Nom', 'Catégorie', 'Prix', '★', 'Statut', 'Actions'].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <td style={s.td}><img src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER} alt="" style={{ width: 52, height: 42, objectFit: 'cover', borderRadius: 8 }} /></td>
                  <td style={s.td}><strong>{p.name}</strong></td>
                  <td style={s.td}>{p.category?.name}</td>
                  <td style={s.td}>{p.price ? `${Number(p.price).toLocaleString('fr-MA')} MAD` : '—'}</td>
                  <td style={s.td}>{p.is_featured ? <Star size={15} fill="#d4a96a" color="#d4a96a" /> : <span style={{ color: '#ccc' }}>—</span>}</td>
                  <td style={s.td}><span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>{p.is_active ? 'Actif' : 'Inactif'}</span></td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#f5e6d3', color: '#9a6a3a', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setUploadProduct(p)}><Images size={15} /></motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#e8f0fe', color: '#1a73e8', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => openEdit(p)}><Pencil size={15} /></motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} style={{ background: '#fce4ec', color: '#c62828', border: 'none', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setDeleteTarget(p)}><Trash2 size={15} /></motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {uploadProduct && <ImageUploader product={uploadFull} onClose={() => setUploadProduct(null)} />}
      </AnimatePresence>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer le produit"
        message={`Supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
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

  filterRow: { display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '0.85rem', color: '#aaa', pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '0.68rem 2.4rem', border: '1.5px solid #e8ddd4', borderRadius: '10px', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  clearBtn: { position: 'absolute', right: '0.7rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#aaa', lineHeight: 1, padding: '0.2rem' },
  filterSelect: { padding: '0.68rem 0.9rem', border: '1.5px solid #e8ddd4', borderRadius: '10px', fontSize: '0.88rem', background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#444', cursor: 'pointer' },

  emptyState: { textAlign: 'center', padding: '2.5rem 1.5rem', background: '#fff', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' },
  emptyBtn: { marginTop: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#d4a96a', color: '#2c1810', border: 'none', padding: '0.7rem 1.3rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' },
  input: { width: '100%', padding: '0.75rem 0.9rem', border: '1.5px solid #e0d0c0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fdfaf7', outline: 'none' },
  checkRow: { display: 'flex', gap: '1.5rem' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#444', cursor: 'pointer', fontSize: '0.9rem' },
  saveBtn: { flex: 1, background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.8rem', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { flex: 1, background: '#f0e8de', color: '#666', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  cardList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
  productCard: { background: '#fff', borderRadius: '12px', display: 'flex', gap: '0.8rem', padding: '0.9rem', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', alignItems: 'flex-start' },
  cardImg: { width: '72px', height: '72px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 },
  cardBody: { flex: 1, minWidth: 0 },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' },
  cardCategory: { fontSize: '0.7rem', fontWeight: 700, color: '#9a6a3a', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cardName: { margin: '0 0 0.15rem', fontWeight: 700, color: '#2c1810', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardPrice: { margin: '0 0 0.6rem', color: '#c0522a', fontWeight: 800, fontSize: '0.9rem' },
  cardActions: { display: 'flex', gap: '0.45rem' },
  actionBtn: { display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#f5e6d3', color: '#9a6a3a', border: 'none', padding: '0.38rem 0.65rem', borderRadius: '7px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', minWidth: '580px' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#9a6a3a', fontWeight: 700, borderBottom: '2px solid #f0e8de', fontSize: '0.78rem', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '0.8rem 1rem', color: '#333', borderBottom: '1px solid #faf5f0', verticalAlign: 'middle' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 },
}
