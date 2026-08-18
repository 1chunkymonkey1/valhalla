import { useCallback, useMemo, useState } from 'react'
import { Download, Heart, Play, Share2 } from 'lucide-react'
import CasurfPhoto from '../../components/casurf/CasurfPhoto'
import CasurfLightbox from '../../components/casurf/CasurfLightbox'
import { CASURF, GALLERY, GALLERY_SETS } from '../../data/casurf'
import {
  photosInSet,
  readFavorites,
  readSavedEmail,
  shareUrl,
  toggleFavorite,
  writeFavorites,
  writeSavedEmail,
} from '../../lib/casurfGallery'

function downloadStem(stem) {
  const exts = ['png', 'jpg', 'jpeg', 'webp', 'JPG', 'PNG']
  let i = 0
  const tryNext = () => {
    if (i >= exts.length) return
    const a = document.createElement('a')
    a.href = `${stem}.${exts[i]}`
    a.download = `${stem.split('/').pop()}.${exts[i]}`
    a.click()
    i += 1
  }
  tryNext()
}

export default function CasurfGalleryPage() {
  const [entered, setEntered] = useState(false)
  const [setId, setSetId] = useState('all')
  const [index, setIndex] = useState(null)
  const [favorites, setFavorites] = useState(() =>
    typeof window === 'undefined' ? [] : readFavorites(),
  )
  const [modal, setModal] = useState(null)
  const [slideshow, setSlideshow] = useState(false)
  const [email, setEmail] = useState(() =>
    typeof window === 'undefined' ? '' : readSavedEmail(),
  )

  const photos = useMemo(() => photosInSet(GALLERY, setId), [setId])
  const openPhoto = index != null ? photos[index] : null

  const persistFav = useCallback((next) => {
    setFavorites(next)
    writeFavorites(next)
  }, [])

  const onPrev = useCallback(() => {
    setIndex((i) => (i == null ? 0 : (i + photos.length - 1) % photos.length))
  }, [photos.length])

  const onNext = useCallback(() => {
    setIndex((i) => (i == null ? 0 : (i + 1) % photos.length))
  }, [photos.length])

  function afterEmail(kind) {
    writeSavedEmail(email)
    setModal(null)
    if (kind === 'download' && openPhoto) downloadStem(openPhoto.src)
    if (kind === 'download-all') photos.forEach((p) => downloadStem(p.src))
  }

  function copyShare() {
    const href = shareUrl(window.location.origin, '/casurfberkeley/gallery', {
      set: setId,
      photo: openPhoto?.id,
    })
    navigator.clipboard?.writeText(href)
    setModal({
      kind: 'share',
      href,
    })
  }

  if (!entered) {
    return (
      <section className="cs-cover">
        <CasurfPhoto stem="/casurf/gallery/memorial-glade" alt="" />
        <div className="cs-cover__inner">
          <div>
            <p className="cs-kicker">{CASURF.name}</p>
            <h1>Founders collection</h1>
          </div>
          <button type="button" className="cs-btn cs-btn--gold" onClick={() => setEntered(true)}>
            View gallery
          </button>
        </div>
      </section>
    )
  }

  return (
    <>
      <div className="cs-ghead">
        <h1>CA-SURF Berkeley</h1>
        <div className="cs-tabs">
          {GALLERY_SETS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={setId === s.id ? 'is-on' : ''}
              onClick={() => {
                setSetId(s.id)
                setIndex(null)
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="cs-tools">
          <button
            type="button"
            className="cs-icon-btn"
            aria-label="Favorites"
            onClick={() => setModal({ kind: 'favorites' })}
          >
            <Heart size={18} />
          </button>
          <button
            type="button"
            className="cs-icon-btn"
            aria-label="Download"
            onClick={() => setModal({ kind: 'download' })}
          >
            <Download size={18} />
          </button>
          <button type="button" className="cs-icon-btn" aria-label="Share" onClick={copyShare}>
            <Share2 size={18} />
          </button>
          <button
            type="button"
            className="cs-icon-btn"
            aria-label="Slideshow"
            onClick={() => {
              setIndex(0)
              setSlideshow(true)
            }}
          >
            <Play size={18} />
          </button>
        </div>
      </div>

      <div className="cs-grid">
        {photos.map((photo, i) => (
          <button key={photo.id} type="button" onClick={() => setIndex(i)}>
            <CasurfPhoto stem={photo.src} alt={photo.title} />
          </button>
        ))}
      </div>

      {openPhoto && (
        <CasurfLightbox
          photos={photos.map((p) => ({
            ...p,
            resolvedSrc: `${p.src}.jpg`,
          }))}
          index={index}
          onClose={() => {
            setIndex(null)
            setSlideshow(false)
          }}
          onPrev={onPrev}
          onNext={onNext}
          isFavorite={favorites.includes(openPhoto.id)}
          onToggleFavorite={() => persistFav(toggleFavorite(favorites, openPhoto.id))}
          onDownload={() => setModal({ kind: 'download' })}
          onShare={copyShare}
          slideshow={slideshow}
          onToggleSlideshow={() => setSlideshow((v) => !v)}
        />
      )}

      {modal && (
        <div className="cs-modal" onClick={() => setModal(null)} role="presentation">
          <div
            className="cs-modal__card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {modal.kind === 'favorites' && (
              <>
                <h2>Favorites</h2>
                <p>
                  Save your favorite photos and reopen them with your email. You can share this
                  list with the chapter.
                </p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p>
                  {favorites.length} saved
                  {favorites.length
                    ? `: ${favorites
                        .map((id) => GALLERY.find((p) => p.id === id)?.title)
                        .filter(Boolean)
                        .join(', ')}`
                    : ''}
                </p>
                <button
                  type="button"
                  className="cs-btn cs-btn--navy"
                  onClick={() => {
                    writeSavedEmail(email)
                    setModal(null)
                  }}
                >
                  Sign in
                </button>
              </>
            )}
            {modal.kind === 'download' && (
              <>
                <h2>Download photos</h2>
                <p>Your email is used to note that files were requested. Downloads are original files, unmodified.</p>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="cs-row">
                  <button
                    type="button"
                    className="cs-btn cs-btn--navy"
                    onClick={() => afterEmail('download')}
                  >
                    This photo
                  </button>
                  <button
                    type="button"
                    className="cs-btn cs-btn--navy"
                    onClick={() => afterEmail('download-all')}
                  >
                    This set
                  </button>
                </div>
              </>
            )}
            {modal.kind === 'share' && (
              <>
                <h2>Share</h2>
                <p>{modal.href}</p>
                <div className="cs-row">
                  <button
                    type="button"
                    className="cs-btn cs-btn--navy"
                    onClick={() => navigator.clipboard?.writeText(modal.href)}
                  >
                    Copy
                  </button>
                  <a
                    className="cs-btn cs-btn--navy"
                    href={`mailto:?subject=CA-SURF Berkeley&body=${encodeURIComponent(modal.href)}`}
                  >
                    Email
                  </a>
                  <a
                    className="cs-btn cs-btn--navy"
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(modal.href)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    X
                  </a>
                  <a
                    className="cs-btn cs-btn--navy"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(modal.href)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Facebook
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
