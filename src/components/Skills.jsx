import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Skills.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Skill data ─────────────────────────────────────────── */
const SKILL_GROUPS = [
  {
    id: 'programming',
    title: 'Programming',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="12,14 4,20 12,26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="28,14 36,20 28,26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="22" y1="10" x2="18" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#334155',
    bg: 'rgba(51,65,85,0.06)',
    items: ['Python', 'SQL', 'JavaScript', 'TypeScript'],
  },
  {
    id: 'ml',
    title: 'Machine Learning',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="34" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="6" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="34" cy="28" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="8.5" y1="13.5" x2="16" y2="18" stroke="currentColor" strokeWidth="1"/>
        <line x1="31.5" y1="13.5" x2="24" y2="18" stroke="currentColor" strokeWidth="1"/>
        <line x1="8.5" y1="26.5" x2="16" y2="22" stroke="currentColor" strokeWidth="1"/>
        <line x1="31.5" y1="26.5" x2="24" y2="22" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    color: '#2d6a3f',
    bg: 'rgba(45,106,63,0.06)',
    items: ['TensorFlow', 'Keras', 'PyTorch', 'CNNs', 'BiLSTM', 'Transformers', 'NLP'],
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="20" cy="20" rx="16" ry="9" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="20" cy="20" r="2" fill="currentColor"/>
        <line x1="20" y1="4" x2="20" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="20" y1="32" x2="20" y2="36" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    color: '#642f9e',
    bg: 'rgba(100,47,158,0.06)',
    items: ['MediaPipe', 'OpenCV', 'Image Processing', 'Landmark Detection'],
  },
  {
    id: 'genai',
    title: 'Generative AI',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6 L22.5 14 L30 14 L24 19 L26.5 27 L20 22 L13.5 27 L16 19 L10 14 L17.5 14 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3"/>
      </svg>
    ),
    color: '#9a4714',
    bg: 'rgba(154,71,20,0.06)',
    items: ['FLAN-T5', 'Text Generation', 'Image Generation', 'Prompt Engineering'],
  },
  {
    id: 'mleng',
    title: 'ML Engineering',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="6" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="1"/>
        <line x1="14" y1="8" x2="14" y2="28" stroke="currentColor" strokeWidth="0.8"/>
        <line x1="26" y1="8" x2="26" y2="28" stroke="currentColor" strokeWidth="0.8"/>
        <path d="M12 32 L28 32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M17 28 L17 32" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M23 28 L23 32" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
    color: '#1f6e3a',
    bg: 'rgba(31,110,58,0.06)',
    items: ['Model Training', 'Data Preprocessing', 'Data Augmentation', 'Hyperparameter Tuning', 'Model Evaluation', 'Inference Optimization'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack',
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="6" width="30" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 18 L35 18" stroke="currentColor" strokeWidth="1"/>
        <circle cx="9" cy="12" r="1.2" fill="currentColor"/>
        <circle cx="13" cy="12" r="1.2" fill="currentColor"/>
        <circle cx="17" cy="12" r="1.2" fill="currentColor"/>
        <path d="M12 28 L16 34 L24 34 L28 28" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M10 34 L30 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: '#0284c7',
    bg: 'rgba(2,132,199,0.06)',
    items: ['React', 'Next.js', 'Node.js', 'Express', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Vercel'],
  },
]

/* ── Floating orb positions (deterministic) ──────────────── */
const ORBS = [
  { cx: 15, cy: 20, r: 28, delay: 0 },
  { cx: 75, cy: 60, r: 22, delay: 2.4 },
  { cx: 50, cy: 85, r: 18, delay: 1.2 },
]

/* ── Card component ──────────────────────────────────────── */
function SkillCard({ group, index }) {
  const cardRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    gsap.fromTo(el,
      { opacity: 0, y: 48, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * 0.07,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      }
    )
  }, [index])

  return (
    <div
      ref={cardRef}
      className={`sk-card sk-card--${group.id}${hovered ? ' sk-card--hovered' : ''}`}
      style={{ '--card-color': group.color, '--card-bg': group.bg }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow blob */}
      <div className="sk-card__blob" />

      {/* Icon */}
      <div className="sk-card__icon" style={{ color: group.color }}>
        {group.icon}
      </div>

      {/* Title */}
      <h3 className="sk-card__title">{group.title}</h3>

      {/* Pills */}
      <div className="sk-card__pills">
        {group.items.map((item) => (
          <span key={item} className="sk-pill">{item}</span>
        ))}
      </div>

      {/* Corner index */}
      <span className="sk-card__idx">0{index + 1}</span>
    </div>
  )
}

/* ── Marquee strip ───────────────────────────────────────── */
const ALL_SKILLS = SKILL_GROUPS.flatMap(g => g.items)

function MarqueeStrip() {
  return (
    <div className="sk-marquee" aria-hidden="true">
      <div className="sk-marquee__track">
        {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
          <span key={i} className="sk-marquee__item">
            {s}<span className="sk-marquee__dot">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Main section ────────────────────────────────────────── */
export default function Skills() {
  const sectionRef = useRef(null)
  const headRef    = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 85%', once: true }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="skills" className="sk-section" aria-labelledby="skills-title">

      {/* Background ambient orbs */}
      <div className="sk-orbs" aria-hidden="true">
        {ORBS.map((o, i) => (
          <div
            key={i}
            className="sk-orb"
            style={{
              left: `${o.cx}%`,
              top: `${o.cy}%`,
              width: `${o.r}vw`,
              height: `${o.r}vw`,
              animationDelay: `${o.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Header ── */}
      <div ref={headRef} className="sk-head container">
        <h2 id="skills-title" className="sk-head__h2">
          Tools&nbsp;&amp;&nbsp;<em>Expertise</em>
        </h2>
      </div>

      {/* ── Card grid ── */}
      <div className="sk-grid container">
        {SKILL_GROUPS.map((group, i) => (
          <SkillCard key={group.id} group={group} index={i} />
        ))}
      </div>

      {/* ── Marquee ── */}
      <MarqueeStrip />
    </section>
  )
}
