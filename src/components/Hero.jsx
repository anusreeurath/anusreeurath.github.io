import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import portraitImg from '../assets/portrait.png'
import './Hero.css'

// ─── Local portrait ───
const PORTRAIT = portraitImg

const ROWS = [
  { dir: 'ltr', speed: 50, terms: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'PyTorch', 'TensorFlow', 'Transformers', 'Computer Vision', 'NLP', 'Scikit-Learn'] },
  { dir: 'rtl', speed: 42, terms: ['Large Language Models', 'Generative AI', 'RAG Pipelines', 'LangChain', 'LlamaIndex', 'Fine-Tuning', 'Diffusion Models', 'Vector Databases', 'Hugging Face'] },
  { dir: 'ltr', speed: 55, terms: ['Python', 'TypeScript', 'React', 'Next.js', 'FastAPI', 'Node.js', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Tailwind CSS'] },
  { dir: 'rtl', speed: 46, terms: ['Data Structures', 'Algorithms', 'System Design', 'Distributed Systems', 'Operating Systems', 'Computer Networks', 'Database Internals'] },
  { dir: 'ltr', speed: 52, terms: ['MLOps', 'Model Deployment', 'Embeddings', 'Semantic Search', 'Docker', 'Kubernetes', 'ONNX', 'Inference Optimization', 'Weights & Biases'] },
  { dir: 'rtl', speed: 40, terms: ['Microservices', 'Redis', 'Cloud Architecture', 'AWS', 'CI/CD Pipelines', 'Scalable Systems', 'WebSockets', 'Concurrency', 'Async I/O'] },
  { dir: 'ltr', speed: 58, terms: ['Reinforcement Learning', 'Predictive Modeling', 'Feature Engineering', 'Data Analytics', 'Pandas', 'NumPy', 'Prompt Engineering', 'Autonomous AI Agents'] },
  { dir: 'rtl', speed: 38, terms: ['Object-Oriented Design', 'Design Patterns', 'Graph Algorithms', 'Complexity Analysis', 'Git', 'Linux / Unix', 'Full Stack Engineering'] },
]

function getSeamlessTerms(terms, minCount = 20) {
  let singleBlock = [...terms]
  while (singleBlock.length < minCount) {
    singleBlock = [...singleBlock, ...terms]
  }
  // Two identical blocks: when block 1 shifts -50%, block 2 takes its place seamlessly with 0 gap
  return [...singleBlock, ...singleBlock]
}

function MarqueeRow({ terms, dir, speed }) {
  const items = getSeamlessTerms(terms, 20)
  return (
    <div className="hm-row" role="presentation">
      <div
        className={`hm-track hm-track--${dir}`}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {items.map((t, i) => (
          <span key={i} className="hm-item">
            {t}
            <span className="hm-sep" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const portraitRef = useRef(null)
  const nameRef = useRef(null)
  const desigRef = useRef(null)
  const btnsRef = useRef(null)

  /* ── GSAP entrance + scroll parallax ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power4.out' } })

      // Portrait fades up
      tl.fromTo(portraitRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.3 },
        0
      )

      // Name fades up smoothly into position
      tl.fromTo(nameRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        0.15
      )

      // Designation
      tl.fromTo(desigRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.55
      )

      // Buttons
      tl.fromTo(btnsRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.72
      )

      // Scroll parallax
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.4,
        onUpdate(self) {
          const p = self.progress
          gsap.set(portraitRef.current, { xPercent: -50, y: p * 60, force3D: true })
          gsap.set(nameRef.current, { y: p * -18, force3D: true })
          gsap.set([desigRef.current, btnsRef.current], { opacity: Math.max(0, 1 - p * 3.5) })
        }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const scrollTo = (id) => {
    if (window.__lenis) {
      window.__lenis.scrollTo('#' + id, { duration: 1.2 })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={sectionRef} id="hero" className="hero" aria-label="Introduction">

      {/* ── LAYER 1: Marquee background ── */}
      <div className="hero__marquee-bg" aria-hidden="true">
        {ROWS.map((row, i) => <MarqueeRow key={i} {...row} />)}
      </div>

      {/* ── LAYER 2: Name — placed on top / above portrait ── */}
      <div ref={nameRef} className="hero__name-wrap hero__name-wrap--top">
        <h1 className="hero__name" aria-label="Anusree Urath">
          <span className="hero-name__part hero-name__first">Anusree</span>
          <span className="hero-name__part hero-name__last">Urath</span>
        </h1>
      </div>

      {/* ── LAYER 3: Portrait ── */}
      <div
        ref={portraitRef}
        className="hero__portrait"
        aria-label="Portrait of Anusree Urath"
      >
        <img src={PORTRAIT} alt="Anusree Urath" className="hero__img" loading="eager" decoding="async" />
      </div>

      {/* ── LAYER 4: Bottom content — designation → buttons ── */}
      <div className="hero__bottom">

        {/* Designation — big but smaller than name */}
        <p ref={desigRef} className="hero__designation" style={{ opacity: 0 }}>
          AI & Full Stack Developer

        </p>

        {/* CTA Buttons — larger */}
        <div ref={btnsRef} className="hero__actions" style={{ opacity: 0 }}>
          <button
            className="hero__btn hero__btn--primary"
            onClick={() => scrollTo('projects')}
            data-cursor="link"
            aria-label="View my projects"
          >
            <span>View My Projects</span>
            <span className="hero__btn-arrow" aria-hidden="true">→</span>
          </button>
          <button
            className="hero__btn hero__btn--ghost"
            onClick={() => scrollTo('contact')}
            data-cursor="link"
            aria-label="Contact me"
          >
            <span>Contact Me</span>
          </button>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="section-label">Scroll</span>
      </div>

    </section>
  )
}
