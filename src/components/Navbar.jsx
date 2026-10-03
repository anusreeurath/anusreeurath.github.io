import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Navbar.css'

const links = [
  { label: 'About',    target: 'about'      },
  { label: 'Work',     target: 'experience' },
  { label: 'Projects', target: 'projects'   },
  { label: 'Skills',   target: 'skills'     },
  { label: 'Contact',  target: 'contact'    },
]

export default function Navbar() {
  const navRef     = useRef(null)
  const [solid,    setSolid]    = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Entrance — after hero has loaded
    gsap.fromTo(navRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 1, delay: 1.6, ease: 'power2.out' }
    )

    const onScroll = () => setSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock scroll behind mobile overlay
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollTo = (id) => {
    window.__lenis?.start()
    if (window.__lenis) {
      window.__lenis.scrollTo('#' + id, { duration: 1.2, force: true })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`nav${solid ? ' nav--solid' : ''}`}
        aria-label="Main navigation"
        style={{ opacity: 0 }}
      >
        <div className="nav__inner container">
          {/* Logo */}
          <a
            href="#hero"
            className="nav__logo"
            onClick={(e) => {
              e.preventDefault()
              scrollTo('hero')
            }}
            aria-label="Anusree Urath — Home"
          >
            <img
              src="/images/logo.png?v=2"
              alt="AU Monogram Logo"
              className="nav__logo-img"
            />
          </a>

          {/* Desktop links */}
          <ul className="nav__links" role="list">
            {links.map(({ label, target }) => (
              <li key={label}>
                <button
                  className="nav__link"
                  onClick={() => scrollTo(target)}
                  data-cursor="link"
                  aria-label={`Go to ${label}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            className={`nav__burger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`nav__overlay${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <ul className="nav__overlay-links" role="list">
          {links.map(({ label, target }, i) => (
            <li key={label} style={{ '--i': i }}>
              <button onClick={() => scrollTo(target)} className="nav__overlay-link">
                <span className="nav__overlay-num">0{i + 1}</span>
                {label}
              </button>
            </li>
          ))}
        </ul>
        <p className="nav__overlay-footer section-label">© 2026 Anusree Urath — AI &amp; Full Stack Developer</p>
      </div>
    </>
  )
}
