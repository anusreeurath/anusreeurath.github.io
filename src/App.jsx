import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Navbar   from './components/Navbar'
import Hero     from './components/Hero'
import About    from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills   from './components/Skills'
import Contact  from './components/Contact'
import Footer   from './components/Footer'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

// Global ScrollTrigger defaults
ScrollTrigger.defaults({ markers: false })

export default function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      infinite: false,
    })

    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger after fonts/images load
    const onAssetLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onAssetLoad)
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      window.__lenis = null
      window.removeEventListener('load', onAssetLoad)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
