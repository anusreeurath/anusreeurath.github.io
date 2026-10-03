import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner container">
        <span className="footer__name section-label">Anusree Urath — AI &amp; Full Stack Developer</span>
        <nav className="footer__nav" aria-label="Footer navigation">
          <a
            href="#hero"
            className="footer__link"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              window.__lenis?.start()
              if (window.__lenis) window.__lenis.scrollTo('#hero', { duration: 1.2, force: true })
              else document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Top
          </a>
          <a
            href="#projects"
            className="footer__link"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              window.__lenis?.start()
              if (window.__lenis) window.__lenis.scrollTo('#projects', { duration: 1.2, force: true })
              else document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Work
          </a>
          <a
            href="#contact"
            className="footer__link"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              window.__lenis?.start()
              if (window.__lenis) window.__lenis.scrollTo('#contact', { duration: 1.2, force: true })
              else document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Contact
          </a>
        </nav>
        <span className="footer__copy section-label">© {year} All rights reserved.</span>
      </div>
    </footer>
  )
}
