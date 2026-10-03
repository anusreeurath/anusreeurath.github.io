import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './About.css'

const STATS = [
  { number: '5',    sup: '+', label: 'Projects'     },
  { number: '2',    sup: '+', label: 'Internships'  },
  { number: '9.86', sup: '',  label: 'CGPA'         },
]

const TAGS = [
  'Computer Vision', 'NLP', 'Machine Learning',
  'Full Stack', 'React', 'Python', 'Deep Learning', 'REST APIs',
]

const META = [
  { label: 'Based in',     value: 'Sharjah, UAE'        },
  { label: 'Currently at', value: 'SQD'                 },
  { label: 'Discipline',   value: 'AI / ML + Full Stack' },
  { label: 'University',   value: 'CUSAT'               },
  { label: 'Graduated',    value: 'B.Tech CSE · 2026'   },
]

export default function About() {
  const sectionRef   = useRef(null)
  const statementRef = useRef(null)
  const statsRef     = useRef(null)
  const bioRef       = useRef(null)
  const sideRef      = useRef(null)
  const decoRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── Statement: word-by-word scrub reveal ── */
      const words = statementRef.current.querySelectorAll('.about__word em')
      gsap.set(words, { opacity: 0.12, y: 14 })
      ScrollTrigger.create({
        trigger: statementRef.current,
        start: 'top 78%',
        end:   'bottom 35%',
        scrub: 0.8,
        onUpdate(self) {
          words.forEach((el, i) => {
            const t = gsap.utils.clamp(0, 1,
              (self.progress * words.length) - i * 0.7
            )
            gsap.set(el, { opacity: 0.12 + t * 0.88, y: (1 - t) * 14 })
          })
        }
      })

      /* ── Stats: stagger entrance + count up & down on scroll ── */
      const statEls   = statsRef.current.querySelectorAll('.about__stat')
      const numValEls = statsRef.current.querySelectorAll('.about__stat-numval')

      const statsTl = gsap.timeline({
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      })

      // Cards slide up and fade in
      statsTl.fromTo(statEls,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
        },
        0
      )

      // Count up numbers to target on scroll down, count down on scroll up
      STATS.forEach((stat, i) => {
        const numEl = numValEls[i]
        if (!numEl) return
        const target  = parseFloat(stat.number)
        const isFloat = stat.number.includes('.')
        const counter = { val: 0 }

        statsTl.fromTo(counter,
          { val: 0 },
          {
            val: target,
            duration: isFloat ? 1.6 : (target > 3 ? 1.3 : 0.9),
            ease: isFloat ? 'power2.out' : 'power1.out',
            onUpdate() {
              numEl.textContent = isFloat
                ? counter.val.toFixed(2)
                : Math.round(counter.val)
            }
          },
          0.06 * i
        )
      })

      /* ── Decorative word: parallax float ── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end:   'bottom top',
        scrub: 0.5,
        onUpdate(self) {
          gsap.set(decoRef.current, { y: (self.progress - 0.5) * -60, force3D: true })
        }
      })

      /* ── Bio panel: slide up ── */
      gsap.fromTo(bioRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: bioRef.current, start: 'top 84%', once: true }
        }
      )

      /* ── Side panel: slide up (slight delay) ── */
      gsap.fromTo(sideRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1, y: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sideRef.current, start: 'top 84%', once: true }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const statement  = "I teach machines to see, think, and occasionally do things smarter than expected."
  const wordNodes  = statement.split(' ').map((w, i) => (
    <span key={i} className="about__word"><em>{w}</em>{' '}</span>
  ))

  return (
    <section ref={sectionRef} id="about" className="about" aria-labelledby="about-title">
      <div className="container">

        {/* ── Statement ── */}
        <h2 id="about-title" ref={statementRef} className="about__statement" aria-label={statement}>
          {wordNodes}
        </h2>

        {/* ── Stats Row ── */}
        <div ref={statsRef} className="about__stats" role="list" aria-label="Key statistics">
          {STATS.map(({ number, sup, label }) => {
            const isFloat = number.includes('.')
            return (
              <div key={label} className="about__stat" role="listitem" aria-label={`${number}${sup || ''} ${label}`}>
                <div className="about__stat-number">
                  <span className="about__stat-numval" data-target={number}>
                    {isFloat ? '0.00' : '0'}
                  </span>
                  {sup && <sup>{sup}</sup>}
                </div>
                <span className="about__stat-label">{label}</span>
              </div>
            )
          })}
        </div>

        {/* ── Bento Layout ── */}
        <div className="about__bento">

          {/* ── Left: Bio card ── */}
          <div ref={bioRef} className="about__bio-card">
            {/* Giant decorative background word */}
            <span ref={decoRef} className="about__deco-word" aria-hidden="true">AI</span>

            {/* Bio text */}
            <p className="about__bio">
              I'm an <strong>AI/ML Engineer and Full Stack Developer</strong> currently working
              at <strong>SQD, Sharjah UAE</strong>, passionate about building intelligent
              systems that solve real-world problems. From{' '}
              <strong>computer vision</strong> and <strong>gesture recognition</strong> to
              scalable web applications, I transform ideas into solutions that are both
              innovative and production-ready.
            </p>
            <p className="about__bio">
              A <strong>2026 B.Tech CSE graduate from CUSAT</strong> (Cochin University of
              Science and Technology), with experience spanning <strong>NLP, disaster
              communication systems,</strong> and collaborative platforms. I focus on work that
              holds up technically and moves people on first impression.
            </p>

            {/* Tags */}
            <div className="about__tags" aria-label="Core skills">
              {TAGS.map(tag => (
                <span key={tag} className="about__tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* ── Right: Side panel ── */}
          <div ref={sideRef} className="about__side">

            {/* Meta items — editorial stacked list */}
            <div className="about__meta-stack">
              {META.map(({ label, value }) => (
                <div key={label} className="about__meta-row">
                  <span className="about__meta-key section-label">{label}</span>
                  <strong className="about__meta-val">{value}</strong>
                </div>
              ))}
            </div>

            {/* Decorative quote */}
            <blockquote className="about__quote">
              "Building at the intersection of intelligence and engineering."
            </blockquote>

          </div>

        </div>

      </div>
    </section>
  )
}
