export const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage'
export const WHATSAPP    = import.meta.env.VITE_WHATSAPP    || '212671998528'

export const img = (path) => {
  if (!path) return null
  // Only return full URLs (Cloudinary). Old local paths (Railway) are broken.
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return null   // old Railway path — caller should use placeholder
}
export const waLink = (number, message) => {
  const num = (number || WHATSAPP).replace(/\D/g, '')
  const msg = encodeURIComponent(message || 'Bonjour, je voudrais des informations')
  return `https://wa.me/${num}?text=${msg}`
}
