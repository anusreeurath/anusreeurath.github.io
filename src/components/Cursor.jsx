import { useEffect, useRef, useState } from 'react'
import './Cursor.css'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [label, setLabel] = useState('')

  useEffect(() => {
    // Only on devices with a fine pointer (mouse)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current

    let mX = -100, mY = -100
    let rX = -100, rY = -100
    let raf

    // Instant dot, lagged ring
    const onMove = (e) => {
      mX = e.clientX
      mY = e.clientY
      dot.style.transform = `translate(${mX}px, ${mY}px)`
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const loop = () => {
      rX = lerp(rX, mX, 0.1)
      rY = lerp(rY, mY, 0.1)
      ring.style.transform = `translate(${rX}px, ${rY}px)`
      raf = requestAnimationFrame(loop)
    }
    loop()

    // Delegation-based hover detection
    const onOver = (e) => {
      const target = e.target.closest('[data-cursor]')
      const type   = target ? target.getAttribute('data-cursor') : 'default'

      ring.className = `cursor-ring cursor-ring--${type}`

      if (type === 'view')   setLabel('View')
      else if (type === 'link') setLabel('')
      else                   setLabel('')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring cursor-ring--default" aria-hidden="true">
        {label && <span className="cursor-ring__label">{label}</span>}
      </div>
    </>
  )
}
