import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download, Heart, Pause, Play, Share2, X } from 'lucide-react'
import CasurfPhoto from './CasurfPhoto'

export default function CasurfLightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
  onToggleFavorite,
  isFavorite,
  onDownload,
  onShare,
  slideshow,
  onToggleSlideshow,
}) {
  const photo = photos[index]

  useEffect(() => {
    if (!photo) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [photo, onClose, onPrev, onNext])

  useEffect(() => {
    if (!photo || !slideshow) return undefined
    const id = window.setInterval(onNext, 3500)
    return () => window.clearInterval(id)
  }, [photo, slideshow, onNext, index])

  if (!photo) return null

  return (
    <div className="cs-lb" role="dialog" aria-modal="true" aria-label={photo.title}>
      <header className="cs-lb__bar">
        <button type="button" className="cs-icon-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        <p className="cs-lb__title">
          {photo.title}
          <span>
            {index + 1} / {photos.length}
          </span>
        </p>
        <div className="cs-lb__tools">
          <button
            type="button"
            className={`cs-icon-btn ${isFavorite ? 'is-on' : ''}`}
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove favorite' : 'Favorite'}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="cs-icon-btn" onClick={onDownload} aria-label="Download">
            <Download size={18} />
          </button>
          <button type="button" className="cs-icon-btn" onClick={onShare} aria-label="Share">
            <Share2 size={18} />
          </button>
          <button
            type="button"
            className="cs-icon-btn"
            onClick={onToggleSlideshow}
            aria-label={slideshow ? 'Pause slideshow' : 'Play slideshow'}
          >
            {slideshow ? <Pause size={18} /> : <Play size={18} />}
          </button>
        </div>
      </header>

      <button type="button" className="cs-lb__nav cs-lb__nav--prev" onClick={onPrev} aria-label="Previous">
        <ChevronLeft size={32} />
      </button>
      <button type="button" className="cs-lb__nav cs-lb__nav--next" onClick={onNext} aria-label="Next">
        <ChevronRight size={32} />
      </button>

      <div className="cs-lb__stage">
        <CasurfPhoto stem={photo.src} alt={photo.title} />
      </div>
      <p className="cs-lb__file">{photo.filename}</p>
    </div>
  )
}
