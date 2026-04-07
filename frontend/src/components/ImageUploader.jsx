import { useState, useRef } from 'react'
import ConfirmModal from './ConfirmModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Star, ImagePlus, X } from 'lucide-react'
import api from '../api/axios'
import { useToast } from './Toast'
import { img as IMG } from '../config'

export default function ImageUploader({ product, onClose }) {
  const qc = useQueryClient()
  const toast = useToast()
  const inputRef = useRef()
  const [previews, setPreviews] = useState([])
  const [dragging, setDragging] = useState(false)
  const [confirmImgId, setConfirmImgId] = useState(null)

  const images = product.images || []

  const upload = useMutation({
    mutationFn: (files) => {
      const form = new FormData()
      files.forEach((f) => form.append('images[]', f))
      return api.post(`/admin/products/${product.id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      setPreviews([])
      toast('Photos ajoutées avec succès', 'success')
    },
    onError: () => toast('Échec du téléchargement', 'error'),
  })

  const setMain = useMutation({
    mutationFn: (imgId) => api.patch(`/admin/products/${product.id}/images/${imgId}/main`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast('Photo principale définie', 'info') },
  })

  const remove = useMutation({
    mutationFn: (imgId) => api.delete(`/admin/products/${product.id}/images/${imgId}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-products'] }); toast('Photo supprimée', 'warning') },
  })

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'))
    setPreviews(valid.map((f) => ({ file: f, url: URL.createObjectURL(f) })))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <motion.div
      style={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        style={styles.modal}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            <ImagePlus size={22} /> Photos — {product.name}
          </h2>
          <button style={styles.closeBtn} onClick={onClose}><X size={22} /></button>
        </div>

        {/* Existing images */}
        {images.length > 0 && (
          <div style={styles.existingGrid}>
            {images.map((img) => (
              <motion.div
                key={img.id}
                style={{ ...styles.imgWrap, ...(img.is_main ? styles.imgMain : {}) }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={IMG(img.path)} alt="" style={styles.thumbImg} />
                {img.is_main && <span style={styles.mainBadge}>⭐ Principale</span>}
                <div style={styles.imgActions}>
                  {!img.is_main && (
                    <button style={styles.starBtn} onClick={() => setMain.mutate(img.id)} title="Définir comme principale">
                      <Star size={15} />
                    </button>
                  )}
                  <button style={styles.delBtn} onClick={() => setConfirmImgId(img.id)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Drop zone — label for mobile compatibility */}
        <label
          style={{ ...styles.dropZone, ...(dragging ? styles.dropActive : {}), display: 'block', cursor: 'pointer' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div style={{ textAlign: 'center' }}>
            <Upload size={32} color="#d4a96a" />
            <p style={{ margin: '0.5rem 0 0', color: '#9a6a3a', fontWeight: 600 }}>
              Appuyez pour ajouter des photos
            </p>
            <p style={{ margin: '0.2rem 0 0', color: '#bbb', fontSize: '0.8rem' }}>JPG, PNG, WEBP — max 4 Mo</p>
          </div>
          <input
            ref={inputRef} type="file" multiple accept="image/*"
            style={{ position: 'absolute', opacity: 0, width: '1px', height: '1px', overflow: 'hidden' }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        {/* Previews */}
        <AnimatePresence>
          {previews.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div style={styles.previewGrid}>
                {previews.map((p, i) => (
                  <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.previewWrap}>
                    <img src={p.url} alt="" style={styles.thumbImg} />
                    <button style={styles.delBtn} onClick={() => setPreviews(previews.filter((_, idx) => idx !== i))}>
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
              <motion.button
                style={styles.uploadBtn}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => upload.mutate(previews.map((p) => p.file))}
                disabled={upload.isPending}
              >
                <Upload size={18} />
                {upload.isPending ? 'Envoi en cours...' : `Envoyer ${previews.length} photo(s)`}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <ConfirmModal
        open={!!confirmImgId}
        title="Supprimer la photo ?"
        message="Cette action est irréversible. La photo sera définitivement supprimée."
        danger
        onCancel={() => setConfirmImgId(null)}
        onConfirm={() => { remove.mutate(confirmImgId); setConfirmImgId(null) }}
      />
    </motion.div>
  )
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  modal: { background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflow: 'auto', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem', fontWeight: 800, color: '#2c1810', margin: 0 },
  closeBtn: { background: '#f5f5f5', border: 'none', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', color: '#666' },
  existingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' },
  imgWrap: { position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '2px solid transparent' },
  imgMain: { border: '2px solid #d4a96a' },
  thumbImg: { width: '100%', height: '100px', objectFit: 'cover', display: 'block' },
  mainBadge: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(212,169,106,0.9)', color: '#2c1810', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem', textAlign: 'center' },
  imgActions: { position: 'absolute', top: '0.3rem', right: '0.3rem', display: 'flex', gap: '0.2rem' },
  starBtn: { background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '0.3rem', cursor: 'pointer', color: '#d4a96a' },
  delBtn: { background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '0.3rem', cursor: 'pointer', color: '#c62828' },
  dropZone: { border: '2px dashed #e0c89a', borderRadius: '12px', padding: '2.5rem', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem', transition: 'all 0.2s' },
  dropActive: { background: '#fdf5e8', borderColor: '#d4a96a' },
  previewGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.6rem', marginBottom: '1rem' },
  previewWrap: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
  uploadBtn: { width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center', background: '#d4a96a', color: '#2c1810', border: 'none', padding: '0.9rem', borderRadius: '10px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' },
}
