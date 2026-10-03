import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectFigure from './ProjectFigure'
import './Projects.css'

const PROJECTS = [
  {
    id: '01',
    name: 'ResQMesh',
    category: 'Disaster Communication',
    year: '2025',
    desc: 'Hybrid disaster communication system using ESP32 + LoRa mesh networking with a real-time web dashboard for offline alert propagation. Built multi-hop transmission from mobile to backend, ensuring reliable communication without internet.',
    tech: ['ESP32', 'LoRa', 'Node.js', 'Socket.IO', 'React'],
    github: 'https://github.com/anusreeurath/resqmesh-web',
    live: null,
    grad: 'linear-gradient(135deg, #f3f6f9 0%, #e3e9f0 55%, #d4dde7 100%)',
    orb1: 'rgba(100, 116, 139, 0.22)',
    orb2: 'rgba(71, 85, 105, 0.16)',
    accent: '#334155',
  },
  {
    id: '02',
    name: 'CollabCode',
    category: 'Collaborative Editor',
    year: '2025',
    desc: 'CRDT-based real-time collaborative code editor using Yjs + Monaco enabling multi-user editing with conflict-free sync. Integrated Judge0 for multi-language code execution and LLaMA-3 for AI-powered error explanation.',
    tech: ['Yjs', 'Monaco', 'Node.js', 'WebSockets', 'Judge0', 'LLaMA-3'],
    github: 'https://github.com/anusreeurath/CollabCode',
    live: null,
    grad: 'linear-gradient(135deg, #f2f7f2 0%, #e3ede3 55%, #d3e4d4 100%)',
    orb1: 'rgba(74, 150, 90, 0.2)',
    orb2: 'rgba(120, 185, 135, 0.18)',
    accent: '#2d6a3f',
  },
  {
    id: '03',
    name: 'SpeakMySigns',
    category: 'Gesture-to-Speech AI',
    year: '2025',
    desc: 'Real-time Indian Sign Language recognition using MediaPipe (126 keypoints) and BiLSTM for temporal gesture classification. Integrated FLAN-T5 for grammatically correct sentence generation and TTS for speech output.',
    tech: ['MediaPipe', 'BiLSTM', 'FLAN-T5', 'TTS', 'Python'],
    github: 'https://github.com/anusreeurath/SpeakMySigns',
    live: null,
    grad: 'linear-gradient(135deg, #f7f3fa 0%, #ede4f5 55%, #e1d3ee 100%)',
    orb1: 'rgba(147, 85, 210, 0.2)',
    orb2: 'rgba(180, 120, 230, 0.16)',
    accent: '#642f9e',
  },
  {
    id: '04',
    name: 'PlantVision',
    category: 'Computer Vision · ML',
    year: '2024',
    desc: 'CNN-based plant disease classification system achieving 97% accuracy on multi-class datasets using TensorFlow/Keras. Built full ML pipeline from preprocessing to a Streamlit web app for real-time disease prediction.',
    tech: ['TensorFlow', 'Keras', 'CNN', 'Streamlit', 'Python'],
    github: 'https://github.com/anusreeurath/Plant-Disease-Detection-System-for-Sustainable-Agriculture',
    live: null,
    grad: 'linear-gradient(135deg, #eff7f0 0%, #deeede 55%, #cde5ce 100%)',
    orb1: 'rgba(50, 160, 95, 0.22)',
    orb2: 'rgba(95, 185, 110, 0.18)',
    accent: '#1f6e3a',
  },
  {
    id: '05',
    name: 'SQD Website',
    category: 'Full-Stack · Production',
    year: '2026',
    desc: 'Engineered and deployed SQD\'s full production website integrating frontend, backend services, and business-specific functionality. Built to scale alongside the company\'s growing AI product suite.',
    tech: ['React', 'FastAPI', 'Full Stack', 'Production'],
    github: 'https://github.com/anusreeurath/SQD',
    live: 'https://sqd.ae',
    grad: 'linear-gradient(135deg, #e8f4fd 0%, #d4ebfc 50%, #bee1fa 100%)',
    orb1: 'rgba(56, 160, 240, 0.28)',
    orb2: 'rgba(14, 140, 225, 0.22)',
    accent: '#0284c7',
  },
]

// Slide 0 is "Selected Work" intro, slides 1-5 are projects
const TOTAL_SLIDES = PROJECTS.length + 1

const NAV_PROJECT_THEMES = [
  // 00: Selected Work (Intro) — warm ivory atelier
  { bg: 'rgba(247, 243, 236, 0.9)', border: 'rgba(122, 50, 37, 0.12)', accent: '#7a3225' },
  // 01: ResQMesh — cool slate tone
  { bg: 'rgba(243, 246, 249, 0.9)', border: 'rgba(51, 65, 85, 0.12)', accent: '#334155' },
  // 02: CollabCode — soft sage green
  { bg: 'rgba(242, 247, 242, 0.9)', border: 'rgba(45, 106, 63, 0.12)', accent: '#2d6a3f' },
  // 03: SpeakMySigns — delicate lavender purple
  { bg: 'rgba(247, 243, 250, 0.9)', border: 'rgba(100, 47, 158, 0.12)', accent: '#642f9e' },
  // 04: PlantVision — fresh botanical mint green
  { bg: 'rgba(239, 247, 240, 0.9)', border: 'rgba(31, 110, 58, 0.12)', accent: '#1f6e3a' },
  // 05: SQD Website — crisp sky blue
  { bg: 'rgba(232, 244, 253, 0.9)', border: 'rgba(2, 132, 199, 0.14)', accent: '#0284c7' },
]

function updateNavbarTheme(idx) {
  const theme = NAV_PROJECT_THEMES[idx] || NAV_PROJECT_THEMES[0]
  document.body.style.setProperty('--nav-proj-bg', theme.bg)
  document.body.style.setProperty('--nav-proj-border', theme.border)
  document.body.style.setProperty('--nav-proj-accent', theme.accent)
}

export default function Projects() {
  const sectionRef = useRef(null)
  const slidesRef = useRef([])
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const isLockedRef = useRef(false)
  const stRef = useRef(null)

  // Smooth slide animation
  const goTo = useCallback((idx, animate = true) => {
    if (idx === activeRef.current) return
    const prev = activeRef.current
    const slides = slidesRef.current
    if (!slides[prev] || !slides[idx]) return

    activeRef.current = idx
    setActive(idx)
    updateNavbarTheme(idx)

    const goingForward = idx > prev

    if (animate) {
      gsap.to(slides[prev], {
        y: goingForward ? -30 : 30,
        opacity: 0,
        scale: 0.98,
        duration: 0.68,
        ease: 'power2.inOut',
        force3D: true,
      })

      gsap.fromTo(slides[idx],
        { y: goingForward ? 42 : -42, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          ease: 'power2.out',
          force3D: true,
          zIndex: 2,
        }
      )

      // Animate line art figure inside the active slide (glides in from the right)
      const sketch = slides[idx]?.querySelector('.proj-sketch')
      if (sketch) {
        gsap.fromTo(sketch,
          { opacity: 0, x: 45, y: goingForward ? 15 : -15, scale: 0.95 },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.82, delay: 0.06, ease: 'power3.out' }
        )
      }
    } else {
      slides.forEach((s, i) => {
        if (!s) return
        gsap.set(s, {
          y: 0,
          opacity: i === idx ? 1 : 0,
          scale: 1,
          zIndex: i === idx ? 2 : 1,
        })
      })
    }

    setTimeout(() => {
      if (slides[prev] && prev !== activeRef.current) {
        gsap.set(slides[prev], { zIndex: 1 })
      }
    }, 750)
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    // Show slide 0, hide all others
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return
      gsap.set(slide, {
        opacity: i === 0 ? 1 : 0,
        y: 0,
        scale: 1,
        zIndex: i === 0 ? 2 : 1,
      })
    })

    const ctx = gsap.context(() => {
      // Navbar dynamic project theme
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60px',
        end: () => `+=${(TOTAL_SLIDES - 1) * window.innerHeight + window.innerHeight}`,
        onEnter: () => {
          document.body.setAttribute('data-proj', '1')
          updateNavbarTheme(activeRef.current)
        },
        onLeave: () => {
          document.body.removeAttribute('data-proj')
          document.body.style.removeProperty('--nav-proj-bg')
          document.body.style.removeProperty('--nav-proj-border')
          document.body.style.removeProperty('--nav-proj-accent')
        },
        onEnterBack: () => {
          document.body.setAttribute('data-proj', '1')
          updateNavbarTheme(activeRef.current)
        },
        onLeaveBack: () => {
          document.body.removeAttribute('data-proj')
          document.body.style.removeProperty('--nav-proj-bg')
          document.body.style.removeProperty('--nav-proj-border')
          document.body.style.removeProperty('--nav-proj-accent')
        },
      })

      // Pinned track with natural scroll distance — never blocks or freezes Lenis
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${(TOTAL_SLIDES - 1) * window.innerHeight}`,
        pin: true,
        onEnter: () => {
          goTo(0, false)
        },
        onEnterBack: () => {
          goTo(TOTAL_SLIDES - 1, false)
        },
        onUpdate: (self) => {
          if (isLockedRef.current) return
          const slideIdx = Math.min(
            TOTAL_SLIDES - 1,
            Math.max(0, Math.round(self.progress * (TOTAL_SLIDES - 1)))
          )
          if (slideIdx !== activeRef.current) {
            goTo(slideIdx, false)
          }
        },
      })

      stRef.current = st
    }, sectionRef)

    // Wheel event handler: provides smooth deliberate slide steps
    const onWheel = (e) => {
      const st = stRef.current
      if (!st) return

      const scrollY = window.scrollY
      const skillsEl = document.getElementById('skills')
      const skillsTop = skillsEl ? skillsEl.offsetTop : (st.end + window.innerHeight)

      const delta = e.deltaY
      if (Math.abs(delta) < 12) return

      // Don't intercept if user is above Projects or already deep within Skills
      if (scrollY < st.start - 60 || scrollY > skillsTop + 30) return

      if (delta > 0) {
        // Scrolling DOWN
        if (scrollY >= skillsTop - 10) {
          // Inside Skills: allow natural scroll down into skills content
          return
        }

        e.preventDefault()
        if (isLockedRef.current) return
        isLockedRef.current = true

        if (activeRef.current < TOTAL_SLIDES - 1) {
          const next = activeRef.current + 1
          goTo(next, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + next * window.innerHeight, { duration: 0.7, lock: true })
          }
          setTimeout(() => {
            isLockedRef.current = false
          }, 650)
        } else {
          // On SQD Website (last project): scroll directly and smoothly to the next section (#skills)
          if (window.__lenis) {
            window.__lenis.scrollTo('#skills', { duration: 0.75, lock: true })
          } else if (skillsEl) {
            skillsEl.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => {
            isLockedRef.current = false
          }, 750)
        }
      } else {
        // Scrolling UP
        if (scrollY < st.start - 10) {
          // Above Projects: allow natural scroll up into Experience
          return
        }

        e.preventDefault()
        if (isLockedRef.current) return
        isLockedRef.current = true

        if (scrollY > st.end + 20) {
          // Scrolling back up from Skills: smoothly return to SQD Website
          goTo(TOTAL_SLIDES - 1, false)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.end, { duration: 0.75, lock: true })
          }
          setTimeout(() => {
            isLockedRef.current = false
          }, 750)
        } else if (activeRef.current > 0) {
          const prev = activeRef.current - 1
          goTo(prev, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + prev * window.innerHeight, { duration: 0.7, lock: true })
          }
          setTimeout(() => {
            isLockedRef.current = false
          }, 650)
        } else {
          // At first slide: smoothly scroll back up to Experience
          if (window.__lenis) {
            window.__lenis.scrollTo('#experience', { duration: 0.8, lock: true })
          } else {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => {
            isLockedRef.current = false
          }, 750)
        }
      }
    }

    // Touch events for mobile
    let touchStartY = 0
    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e) => {
      const st = stRef.current
      if (!st) return

      const scrollY = window.scrollY
      const skillsEl = document.getElementById('skills')
      const skillsTop = skillsEl ? skillsEl.offsetTop : (st.end + window.innerHeight)

      if (scrollY < st.start - 60 || scrollY > skillsTop + 30) return

      const diff = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(diff) < 25) return

      if (diff > 0) {
        // Swiping UP = Scrolling DOWN
        if (scrollY >= skillsTop - 10) {
          return
        }

        if (isLockedRef.current) return
        isLockedRef.current = true

        if (activeRef.current < TOTAL_SLIDES - 1) {
          const next = activeRef.current + 1
          goTo(next, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + next * window.innerHeight, { duration: 0.7, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 650)
        } else {
          if (window.__lenis) {
            window.__lenis.scrollTo('#skills', { duration: 0.75, lock: true })
          } else if (skillsEl) {
            skillsEl.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        }
      } else {
        // Swiping DOWN = Scrolling UP
        if (scrollY < st.start - 10) return

        if (isLockedRef.current) return
        isLockedRef.current = true

        if (scrollY > st.end + 20) {
          goTo(TOTAL_SLIDES - 1, false)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.end, { duration: 0.75, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        } else if (activeRef.current > 0) {
          const prev = activeRef.current - 1
          goTo(prev, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + prev * window.innerHeight, { duration: 0.7, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 650)
        } else {
          if (window.__lenis) {
            window.__lenis.scrollTo('#experience', { duration: 0.8, lock: true })
          } else {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        }
      }
    }

    // Keyboard navigation
    const onKeyDown = (e) => {
      const st = stRef.current
      if (!st) return
      const scrollY = window.scrollY
      const skillsEl = document.getElementById('skills')
      const skillsTop = skillsEl ? skillsEl.offsetTop : (st.end + window.innerHeight)

      if (scrollY < st.start - 10 || scrollY > skillsTop + 10) return

      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        if (scrollY >= skillsTop - 10) return

        e.preventDefault()
        if (isLockedRef.current) return
        isLockedRef.current = true

        if (activeRef.current < TOTAL_SLIDES - 1) {
          const next = activeRef.current + 1
          goTo(next, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + next * window.innerHeight, { duration: 0.75, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        } else {
          if (window.__lenis) {
            window.__lenis.scrollTo('#skills', { duration: 0.75, lock: true })
          } else if (skillsEl) {
            skillsEl.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        }
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
        if (scrollY < st.start - 10) return

        e.preventDefault()
        if (isLockedRef.current) return
        isLockedRef.current = true

        if (scrollY > st.end + 20) {
          goTo(TOTAL_SLIDES - 1, false)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.end, { duration: 0.75, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        } else if (activeRef.current > 0) {
          const prev = activeRef.current - 1
          goTo(prev, true)
          if (window.__lenis) {
            window.__lenis.scrollTo(st.start + prev * window.innerHeight, { duration: 0.75, lock: true })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        } else {
          if (window.__lenis) {
            window.__lenis.scrollTo('#experience', { duration: 0.8, lock: true })
          } else {
            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
          }
          setTimeout(() => { isLockedRef.current = false }, 750)
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      ctx.revert()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      document.body.removeAttribute('data-proj')
      document.body.style.removeProperty('--nav-proj-bg')
      document.body.style.removeProperty('--nav-proj-border')
      document.body.style.removeProperty('--nav-proj-accent')
    }
  }, [goTo])

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects"
      aria-labelledby="projects-title"
    >
      {/* ── Dot nav (right side) ── */}
      <nav className="proj-dots" aria-label="Project navigation">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            className={`proj-dot${active === i ? ' is-active' : ''}`}
            onClick={() => {
              isLockedRef.current = true
              goTo(i, true)
              const st = stRef.current
              if (st && window.__lenis) {
                window.__lenis.scrollTo(st.start + i * window.innerHeight, { duration: 0.75, lock: true })
              }
              setTimeout(() => {
                isLockedRef.current = false
              }, 750)
            }}
            aria-label={i === 0 ? 'Intro: Selected Work' : `Project ${i}: ${PROJECTS[i - 1]?.name}`}
          />
        ))}
      </nav>

      {/* ── Counter ── */}
      {active > 0 && (
        <div className="proj-counter" aria-live="polite">
          <span className="proj-counter__cur">{String(active).padStart(2, '0')}</span>
          <span className="proj-counter__sep">/</span>
          <span className="proj-counter__tot">{String(PROJECTS.length).padStart(2, '0')}</span>
        </div>
      )}

      {/* ── Slide 0: Intro ── */}
      <div
        ref={el => slidesRef.current[0] = el}
        className="proj-slide proj-slide--intro"
        style={{
          '--grad': 'linear-gradient(135deg, #f7f3ec 0%, #efe8dc 55%, #e6dfd1 100%)',
          '--orb1': 'rgba(196, 113, 61, 0.2)',
          '--orb2': 'rgba(122, 50, 37, 0.14)',
          '--accent-color': '#7a3225',
        }}
        aria-hidden={active !== 0}
      >
        <div className="proj-slide__orb proj-slide__orb--1" />
        <div className="proj-slide__orb proj-slide__orb--2" />
        <div className="proj-slide__grid" />
        <div className="proj-intro container">
          <div className="proj-intro__content">
            <h2 id="projects-title" className="proj-intro__title">
              Selected<br /><em>Work</em>
            </h2>
            <p className="proj-intro__sub">5 projects · AI, ML &amp; Full Stack</p>
            <p className="proj-intro__hint">Scroll to explore ↓</p>
          </div>
          <div className="proj-intro__figure">
            <ProjectFigure id="00" isActive={active === 0} />
          </div>
        </div>
      </div>

      {/* ── Project slides ── */}
      {PROJECTS.map((p, i) => (
        <article
          key={p.id}
          ref={el => slidesRef.current[i + 1] = el}
          className="proj-slide"
          style={{
            '--grad': p.grad,
            '--orb1': p.orb1,
            '--orb2': p.orb2,
            '--accent-color': p.accent,
          }}
          aria-hidden={active !== i + 1}
        >
          <div className="proj-slide__orb proj-slide__orb--1" />
          <div className="proj-slide__orb proj-slide__orb--2" />
          <div className="proj-slide__grid" />

          <div className="proj-slide__inner container">
            <div className="proj-slide__content">
              <h3 className="proj-slide__name">{p.name}</h3>

              <p className="proj-slide__desc">{p.desc}</p>

              <div className="proj-slide__tech">
                {p.tech.map(t => <span key={t}>{t}</span>)}
              </div>

              <div className="proj-slide__links">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="proj-slide__btn proj-slide__btn--ghost"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-slide__btn proj-slide__btn--solid"
                  >
                    Live Site
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="proj-slide__figure">
              <ProjectFigure id={p.id} isActive={active === i + 1} />
            </div>
          </div>
        </article>
      ))}
    </section>
  )
}
