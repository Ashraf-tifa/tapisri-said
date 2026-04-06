import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil, Trash2, Plus, Star, Search, Package,
  Upload, X, ImagePlus, Camera, Images, CheckCircle2,
} from 'lucide-react'
import api from '../../api/axios'
import ConfirmModal from '../../components/ConfirmModal'
import { useToast } from '../../components/Toast'
import { img as IMG } from '../../config'

const emptyForm = {
  category_id: '', name: '', description: '',
  price: '', whatsapp_number: '', is_active: true, is_featured: false,
}
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

/* ─── Inline Image Section ─────────────────────────────────── */
function PhotosSection({ product }) {
  const qc = useQueryClient()
  const toast = useToast()
  const inputRef = useRef()
  const [previews, setPreviews] = useState([])
  const [dragging, setDragging] = useState(false)

  // Own query — always fresh for this product
  const { data: freshImages = product?.images || [] } = useQuery({
    queryKey: ['product-images', product?.id],
    queryFn: async () => {
      const res = await api.get('/admin/products')
      const found = res.data.find((p) => p.id === product.id)
      return found?.images || []
    },
    enabled: !!product?.id,
    staleTime: 0,
  })

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    qc.invalidateQueries({ queryKey: ['product-images', product?.id] })
  }

  const upload = useMutation({
    mutationFn: (files) => {
      const fd = new FormData()
      files.forEach((f) => fd.append('images[]', f))
      return api.post(`/admin/products/${product.id}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      invalidate()
      setPreviews([])
      toast('Photos ajoutées !', 'success')
    },
    onError: () => toast('Échec du téléchargement', 'error'),
  })

  const setMain = useMutation({
    mutationFn: (imgId) => api.patch(`/admin/products/${product.id}/images/${imgId}/main`),
    onSuccess: () => { invalidate(); toast('Photo principale définie', 'info') },
  })

  const remove = useMutation({
    mutationFn: (imgId) => api.delete(`/admin/products/${product.id}/images/${imgId}`),
    onSuccess: () => { invalidate(); toast('Photo supprimée', 'warning') },
  })

  const images = freshImages

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'))
    setPreviews(valid.map((f) => ({ file: f, url: URL.createObjectURL(f) })))
  }

  if (!product?.id) {
    return (
      <div style={ps.locked}>
        <Camera size={36} color="#d4b896" />
        <p style={{ margin: '0.7rem 0 0.2rem', fontWeight: 700, color: '#9a6a3a' }}>
          Sauvegardez d'abord les informations
        </p>
        <p style={{ margin: 0, color: '#bbb', fontSize: '0.82rem' }}>
          Les photos seront disponibles après la création du produit.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Existing images grid */}
      {images.length > 0 && (
        <div>
          <p style={ps.sectionLabel}>Photos actuelles ({images.length})</p>
          <div style={ps.imgGrid}>
            {images.map((img) => (
              <motion.div
                key={img.id}
                style={{ ...ps.imgWrap, ...(img.is_main ? ps.imgMain : {}) }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={IMG(img.path)} alt="" style={ps.thumbImg} />
                {img.is_main && <span style={ps.mainBadge}>⭐ Principale</span>}
                <div style={ps.imgActions}>
                  {!img.is_main && (
                    <button
                      style={ps.starBtn}
                      onClick={() => setMain.mutate(img.id)}
                      title="Définir comme principale"
                    >
                      <Star size={13} />
                    </button>
                  )}
                  <button
                    style={ps.delBtn}
                    onClick={() => { if (confirm('Supprimer cette photo ?')) remove.mutate(img.id) }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        style={{ ...ps.dropZone, ...(dragging ? ps.dropActive : {}) }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={28} color="#d4a96a" />
        <p style={{ margin: '0.5rem 0 0.1rem', color: '#9a6a3a', fontWeight: 700, fontSize: '0.9rem' }}>
          Cliquez ou glissez des photos ici
        </p>
        <p style={{ margin: 0, color: '#bbb', fontSize: '0.78rem' }}>JPG, PNG, WEBP — max 4 Mo</p>
        <input
          ref={inputRef} type="file" multiple accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Previews + upload button */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={ps.sectionLabel}>Aperçu ({previews.length} photo{previews.length > 1 ? 's' : ''})</p>
            <div style={ps.previewGrid}>
              {previews.map((p, i) => (
                <motion.div
                  key={i}
                  style={ps.previewWrap}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <img src={p.url} alt="" style={ps.thumbImg} />
                  <button style={ps.delBtn} onClick={() => setPreviews(previews.filter((_, idx) => idx !== i))}>
                    <X size={13} />
                  </button>
                </motion.div>
              ))}
            </div>
            <motion.button
              style={ps.uploadBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => upload.mutate(previews.map((p) => p.file))}
              disabled={upload.isPending}
            >
              <Upload size={16} />
              {upload.isPending ? 'Envoi en cours...' : `Envoyer ${previews.length} photo(s)`}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ps = {
  locked: { textAlign: 'center', padding: '2.5rem 1rem', background: '#fdf9f5', borderRadius: '12px', border: '1.5px dashed #e8d5b0' },
  sectionLabel: { margin: '0 0 0.6rem', fontSize: '0.78rem', fontWeight: 700, color: '#9a6a3a', textTransform: 'uppercase', letterSpacing: '0.6px' },
  imgGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem', marginBottom: '0.8rem' },
  imgWrap: { position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid transparent' },
  imgMain: { border: '2px solid #d4a96a' },
  previewWrap: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
  thumbImg: { width: '100%', height: '90px', objectFit: 'cover', display: 'block' },
  mainBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(212,169,106,0.92)', color: '#2c1810', fontSize: '0.65rem', fontWeight: 700, padding: '0.18rem', textAlign: 'center' },
  imgActions: { position: 'absolute', top: '0.25rem', right: '0.25rem', display: 'flex', gap: '0.2rem' },
  starBtn: { background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.28rem', cursor: 'pointer', color: '#d4a96a', display: 'flex' },
  delBtn: { background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '5px', padding: '0.28rem', cursor: 'pointer', color: '#c62828', display: 'flex' },
  dropZone: { border: '2px dashed #e0c89a', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fffdf9' },
  dropActive: { background: '#fdf5e8', borderColor: '#d4a96a' },
  uploadBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', background: '#d4a96a', color: '#2c1810', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer' },
}

/* ─── Product Form Modal ────────────────────────────────────── */
function ProductModal({ open, editProduct, categories, onClose, onSaved }) {
  const qc = useQueryClient()
  const toast = useToast()
  const [tab, setTab] = useState('info')
  const [form, setForm] = useState(emptyForm)
  const [savedProduct, setSavedProduct] = useState(null)

  // When modal opens
  useEffect(() => {
    if (!open) return
    setTab('info')
    if (editProduct) {
      setForm({
        category_id: editProduct.category_id || '',
        name: editProduct.name || '',
        description: editProduct.description || '',
        price: editProduct.price || '',
        whatsapp_number: editProduct.whatsapp_number || '',
        is_active: editProduct.is_active ?? true,
        is_featured: editProduct.is_featured ?? false,
      })
      setSavedProduct(editProduct)
    } else {
      setForm(emptyForm)
      setSavedProduct(null)
    }
  }, [open, editProduct])

  // When products query updates (after image upload), sync savedProduct
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: () => api.get('/admin/products').then((r) => r.data) })
  useEffect(() => {
    if (savedProduct?.id) {
      const fresh = products.find((p) => p.id === savedProduct.id)
      if (fresh) setSavedProduct(fresh)
    }
  }, [products])

  const save = useMutation({
    mutationFn: (data) =>
      editProduct
        ? api.put(`/admin/products/${editProduct.id}`, data)
        : api.post('/admin/products', data),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      if (!editProduct) {
        setSavedProduct(res.data)
        setTab('photos')
        toast('Produit créé ! Ajoutez les photos.', 'success')
      } else {
        toast('Produit modifié avec succès', 'success')
        onSaved?.()
        onClose()
      }
    },
    onError: () => toast('Une erreur est survenue', 'error'),
  })

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  })

  const canShowPhotos = !!savedProduct?.id

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        style={ms.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          style={ms.modal}
          initial={{ scale: 0.93, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          {/* Header */}
          <div style={ms.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={ms.headerIcon}>
                {editProduct ? <Pencil size={16} /> : <Plus size={16} />}
              </div>
              <h2 style={ms.title}>
                {editProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
            </div>
            <button style={ms.closeBtn} onClick={onClose}><X size={20} /></button>
          </div>

          {/* Tabs */}
          <div style={ms.tabs}>
            <button
              style={{ ...ms.tab, ...(tab === 'info' ? ms.tabActive : {}) }}
              onClick={() => setTab('info')}
            >
              <Package size={15} /> Informations
            </button>
            <button
              style={{
                ...ms.tab,
                ...(tab === 'photos' ? ms.tabActive : {}),
                ...(canShowPhotos ? {} : ms.tabDisabled),
              }}
              onClick={() => canShowPhotos && setTab('photos')}
            >
              <ImagePlus size={15} />
              Photos
              {canShowPhotos && savedProduct?.images?.length > 0 && (
                <span style={ms.tabBadge}>{savedProduct.images.length}</span>
              )}
              {!canShowPhotos && <span style={ms.tabLock}>↑ d'abord</span>}
            </button>
          </div>

          {/* Body */}
          <div style={ms.body}>
            <AnimatePresence mode="wait">
              {tab === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
                >
                  {/* Name */}
                  <div style={ms.field}>
                    <label style={ms.label}>Nom du produit *</label>
                    <input style={ms.input} placeholder="Ex: Tapis Berbère 200x300" {...f('name')} />
                  </div>

                  {/* Category */}
                  <div style={ms.field}>
                    <label style={ms.label}>Catégorie *</label>
                    <select style={ms.input} {...f('category_id')}>
                      <option value="">— Sélectionner —</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  {/* Price + WhatsApp */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    <div style={ms.field}>
                      <label style={ms.label}>Prix (MAD)</label>
                      <input style={ms.input} type="number" placeholder="1200" {...f('price')} />
                    </div>
                    <div style={ms.field}>
                      <label style={ms.label}>WhatsApp</label>
                      <input style={ms.input} placeholder="+212..." {...f('whatsapp_number')} />
                    </div>
                  </div>

                  {/* Description */}
                  <div style={ms.field}>
                    <label style={ms.label}>Description</label>
                    <textarea
                      style={{ ...ms.input, minHeight: '85px', resize: 'vertical' }}
                      placeholder="Matière, dimensions, origine..."
                      {...f('description')}
                    />
                  </div>

                  {/* Toggles */}
                  <div style={ms.toggleRow}>
                    <label style={ms.toggle}>
                      <div
                        style={{ ...ms.toggleTrack, background: form.is_active ? '#25D366' : '#ddd' }}
                        onClick={() => setForm({ ...form, is_active: !form.is_active })}
                      >
                        <div style={{ ...ms.toggleThumb, transform: form.is_active ? 'translateX(18px)' : 'translateX(2px)' }} />
                      </div>
                      <span style={{ fontWeight: 600, color: form.is_active ? '#2e7d32' : '#999' }}>
                        {form.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </label>
                    <label style={ms.toggle}>
                      <div
                        style={{ ...ms.toggleTrack, background: form.is_featured ? '#d4a96a' : '#ddd' }}
                        onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                      >
                        <div style={{ ...ms.toggleThumb, transform: form.is_featured ? 'translateX(18px)' : 'translateX(2px)' }} />
                      </div>
                      <span style={{ fontWeight: 600, color: form.is_featured ? '#9a6a3a' : '#999', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Star size={13} fill={form.is_featured ? '#d4a96a' : 'none'} color={form.is_featured ? '#d4a96a' : '#ccc'} />
                        Vedette
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: '0.7rem', marginTop: '0.3rem' }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      style={{ ...ms.saveBtn, opacity: save.isPending ? 0.7 : 1 }}
                      onClick={() => save.mutate(form)}
                      disabled={save.isPending}
                    >
                      <CheckCircle2 size={17} />
                      {save.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                    </motion.button>
                    <button style={ms.cancelBtn} onClick={onClose}>Annuler</button>
                  </div>

                  {!editProduct && !savedProduct && (
                    <div style={ms.hint}>
                      📸 Après avoir sauvegardé, l'onglet "Photos" s'activera automatiquement.
                    </div>
                  )}
                </motion.div>
              )}

              {tab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                >
                  <PhotosSection product={savedProduct} />
                  <button
                    style={{ ...ms.cancelBtn, marginTop: '1.2rem', width: '100%' }}
                    onClick={() => { onSaved?.(); onClose() }}
                  >
                    Terminer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const ms = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(20,10,5,0.65)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem', borderBottom: '1px solid #f0e8de', background: '#fdfaf7', flexShrink: 0 },
  headerIcon: { width: '32px', height: '32px', borderRadius: '8px', background: '#2c1810', color: '#d4a96a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#2c1810' },
  closeBtn: { background: '#f0e8de', border: 'none', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#666', display: 'flex' },
  tabs: { display: 'flex', borderBottom: '1px solid #f0e8de', background: '#fdfaf7', flexShrink: 0 },
  tab: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, color: '#9a8070', borderBottom: '3px solid transparent', transition: 'all 0.2s' },
  tabActive: { color: '#2c1810', borderBottomColor: '#d4a96a', background: '#fff' },
  tabDisabled: { opacity: 0.45, cursor: 'default' },
  tabBadge: { background: '#d4a96a', color: '#2c1810', borderRadius: '20px', padding: '0.05rem 0.45rem', fontSize: '0.7rem', fontWeight: 800 },
  tabLock: { background: '#f0e8de', color: '#9a8070', borderRadius: '20px', padding: '0.05rem 0.45rem', fontSize: '0.68rem', fontWeight: 600 },
  body: { padding: '1.4rem', overflowY: 'auto', flex: 1 },
  field: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  label: { fontSize: '0.8rem', fontWeight: 700, color: '#7a5c44', letterSpacing: '0.3px' },
  input: { width: '100%', padding: '0.72rem 0.9rem', border: '1.5px solid #e8ddd4', borderRadius: '9px', fontSize: '0.93rem', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fdfaf7', outline: 'none', color: '#2c1810', transition: 'border-color 0.2s' },
  toggleRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' },
  toggle: { display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer' },
  toggleTrack: { width: '40px', height: '22px', borderRadius: '11px', position: 'relative', cursor: 'pointer', transition: 'background 0.25s', flexShrink: 0 },
  toggleThumb: { position: 'absolute', top: '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'transform 0.25s' },
  saveBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.82rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { flex: 1, background: '#f0e8de', color: '#666', border: 'none', padding: '0.82rem', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.93rem' },
  hint: { background: '#fdf4e8', border: '1px solid #e8d5b0', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: '#9a6a3a' },
}

/* ─── Main Component ────────────────────────────────────────── */
export default function AdminProducts() {
  const qc = useQueryClient()
  const isMobile = useIsMobile()
  const toast = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/admin/products').then((r) => r.data),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
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

  const openAdd = () => { setEditProduct(null); setShowModal(true) }
  const openEdit = (p) => { setEditProduct(p); setShowModal(true) }

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

      {/* Empty states */}
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
            <motion.div
              key={p.id}
              style={s.productCard}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div style={s.cardImgWrap}>
                <img
                  src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                  alt={p.name}
                  style={s.cardImg}
                />
                {p.images?.length > 1 && (
                  <span style={s.imgCountBadge}><Images size={10} /> {p.images.length}</span>
                )}
              </div>
              <div style={s.cardBody}>
                <div style={s.cardTop}>
                  <span style={s.cardCategory}>{p.category?.name || '—'}</span>
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
                  <button style={s.actionEdit} onClick={() => openEdit(p)}>
                    <Pencil size={14} /> Modifier
                  </button>
                  <button style={s.actionDel} onClick={() => setDeleteTarget(p)}>
                    <Trash2 size={14} />
                  </button>
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
              <tr>
                {['Photo', 'Nom', 'Catégorie', 'Prix', 'Statut', 'Actions'].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ cursor: 'default' }}
                >
                  <td style={s.td}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={p.main_image ? IMG(p.main_image.path) : PLACEHOLDER}
                        alt=""
                        style={{ width: 52, height: 48, objectFit: 'cover', borderRadius: 8 }}
                      />
                      {p.images?.length > 1 && (
                        <span style={{ ...s.imgCountBadge, fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}>
                          <Images size={9} /> {p.images.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={s.td}>
                    <strong style={{ color: '#2c1810' }}>{p.name}</strong>
                    {p.is_featured && <Star size={12} fill="#d4a96a" color="#d4a96a" style={{ marginLeft: '0.4rem' }} />}
                  </td>
                  <td style={s.td}><span style={s.catChip}>{p.category?.name || '—'}</span></td>
                  <td style={s.td}>
                    {p.price
                      ? <strong style={{ color: '#c0522a' }}>{Number(p.price).toLocaleString('fr-MA')} MAD</strong>
                      : <span style={{ color: '#ccc' }}>—</span>}
                  </td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: p.is_active ? '#e8f5e9' : '#fce4ec', color: p.is_active ? '#2e7d32' : '#c62828' }}>
                      {p.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={s.td}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        style={s.iconBtn}
                        onClick={() => openEdit(p)}
                        title="Modifier"
                      >
                        <Pencil size={15} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.08 }}
                        style={{ ...s.iconBtn, background: '#fce4ec', color: '#c62828' }}
                        onClick={() => setDeleteTarget(p)}
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <ProductModal
        open={showModal}
        editProduct={editProduct}
        categories={categories}
        onClose={() => setShowModal(false)}
        onSaved={() => qc.invalidateQueries({ queryKey: ['admin-products'] })}
      />

      {/* Confirm delete */}
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
  addBtn: { display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.68rem 1.3rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.92rem', flexShrink: 0, boxShadow: '0 4px 16px rgba(44,24,16,0.25)' },

  filterRow: { display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' },
  searchWrap: { position: 'relative', flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '0.85rem', color: '#aaa', pointerEvents: 'none' },
  searchInput: { width: '100%', padding: '0.68rem 2.4rem', border: '1.5px solid #e8ddd4', borderRadius: '10px', fontSize: '0.9rem', background: '#fff', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  clearBtn: { position: 'absolute', right: '0.7rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#aaa' },
  filterSelect: { padding: '0.68rem 0.9rem', border: '1.5px solid #e8ddd4', borderRadius: '10px', fontSize: '0.88rem', background: '#fff', outline: 'none', fontFamily: 'inherit', color: '#444', cursor: 'pointer' },

  emptyState: { textAlign: 'center', padding: '2.5rem 1.5rem', background: '#fff', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', marginBottom: '1rem' },
  emptyBtn: { marginTop: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.7rem 1.3rem', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' },

  cardList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  productCard: { background: '#fff', borderRadius: '14px', display: 'flex', gap: '0.9rem', padding: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', alignItems: 'flex-start', border: '1px solid #f5ede4' },
  cardImgWrap: { position: 'relative', flexShrink: 0 },
  cardImg: { width: '76px', height: '76px', objectFit: 'cover', borderRadius: '10px', display: 'block' },
  imgCountBadge: { position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', borderRadius: '10px', padding: '0.12rem 0.4rem', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' },
  cardBody: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardCategory: { fontSize: '0.68rem', fontWeight: 700, color: '#b08060', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cardName: { margin: '0.1rem 0', fontWeight: 700, color: '#2c1810', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardPrice: { margin: '0 0 0.4rem', color: '#c0522a', fontWeight: 800, fontSize: '0.9rem' },
  cardActions: { display: 'flex', gap: '0.45rem', marginTop: '0.3rem' },
  actionEdit: { display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#2c1810', color: '#d4a96a', border: 'none', padding: '0.42rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 },
  actionDel: { display: 'flex', alignItems: 'center', background: '#fce4ec', color: '#c62828', border: 'none', padding: '0.42rem 0.6rem', borderRadius: '8px', cursor: 'pointer' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 },
  catChip: { background: '#fdf0e0', color: '#9a6a3a', padding: '0.22rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 },

  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', minWidth: '560px' },
  th: { padding: '0.9rem 1rem', textAlign: 'left', color: '#9a6a3a', fontWeight: 700, borderBottom: '2px solid #f0e8de', fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' },
  td: { padding: '0.85rem 1rem', color: '#333', borderBottom: '1px solid #faf5f0', verticalAlign: 'middle' },
  iconBtn: { background: '#f5e6d3', color: '#9a6a3a', border: 'none', padding: '0.45rem', borderRadius: '7px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
}
