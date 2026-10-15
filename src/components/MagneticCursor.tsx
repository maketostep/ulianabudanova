import { useEffect, useRef } from 'react'

export default function MagneticCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    let x = -100
    let y = -100
    let ringX = -100
    let ringY = -100
    let hover = false
    let frame = 0

    const update = () => {
      ringX += (x - ringX) * 0.17
      ringY += (y - ringY) * 0.17
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${hover ? 1.8 : 1})`
      if (ring.current) ring.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${hover ? 1.38 : 1})`
      frame = requestAnimationFrame(update)
    }
    const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY }
    const over = (event: Event) => { hover = (event.target as HTMLElement).closest('[data-magnetic]') !== null }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    frame = requestAnimationFrame(update)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="cursor" aria-hidden="true"><span ref={ring} className="cursor-ring" /><span ref={dot} className="cursor-dot" /></div>
}
