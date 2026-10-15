import { useEffect, useRef } from 'react'
import { projectPhoto } from '../data'
import type { Project } from '../types'

type ProjectGalleryProps = { project: Project | null; onClose: () => void }

export default function ProjectGallery({ project, onClose }: ProjectGalleryProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const scroll = (direction: 1 | -1) => strip.current?.scrollBy({ left: direction * strip.current.clientWidth * 0.8, behavior: 'smooth' })

  useEffect(() => {
    if (project) dialog.current?.showModal()
    else dialog.current?.close()
  }, [project])

  return (
    <dialog
      ref={dialog}
      className="gallery"
      aria-labelledby="gallery-title"
      onClose={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      {project && (
        <>
          <header className="gallery-head">
            <div><span>{project.category}</span><h2 id="gallery-title">{project.title}</h2><p>{project.label}</p></div>
            <div className="gallery-controls">
              <button type="button" onClick={() => scroll(-1)} aria-label="Предыдущие фото">←</button>
              <button type="button" onClick={() => scroll(1)} aria-label="Следующие фото">→</button>
              <button type="button" onClick={onClose} aria-label="Закрыть галерею">✕</button>
            </div>
          </header>
          {/* data-lenis-prevent lets the strip scroll natively instead of through Lenis */}
          <div ref={strip} className="gallery-strip" data-lenis-prevent tabIndex={0} aria-label="Фотографии проекта, листайте вбок">
            {Array.from({ length: project.photoCount }, (_, i) => (
              <img key={i} src={projectPhoto(project.id, i + 1)} alt={`${project.alt}, фото ${i + 1} из ${project.photoCount}`} loading="lazy" decoding="async" />
            ))}
          </div>
        </>
      )}
    </dialog>
  )
}
