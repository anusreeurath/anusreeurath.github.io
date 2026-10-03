import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Experience.css'

const JOBS = [
  {
    year: '2026',
    company: 'SQD',
    role: 'AI & Full-Stack Developer',
    location: 'Sharjah, UAE',
    type: 'Jun. 2026 – Present',
    desc: 'Engineered and deployed the company\'s full-stack website and currently developing a proprietary AI image generation system for interior visualization. Also building an e-commerce platform across web and mobile. Leading the AI architecture and experimentation pipeline for domain-specific image generation and production deployment.',
    tags: ['AI / ML', 'Full Stack', 'React', 'FastAPI', 'Interior AI'],
  },
  {
    year: '2025',
    company: 'IIIT Kottayam',
    role: 'AI/ML Research Intern',
    location: 'Kerala, India',
    type: 'May 2025 – Jul. 2025',
    desc: 'Engineered an end-to-end Indian Sign Language-to-Speech system using MediaPipe, BiLSTM, FLAN-T5, and TTS — converting real-time hand gestures into grammatically correct spoken sentences via a multi-stage computer vision and NLP pipeline.',
    tags: ['MediaPipe', 'BiLSTM', 'FLAN-T5', 'NLP', 'Computer Vision'],
  },
  {
    year: '2024',
    company: 'TechSaksham',
    role: 'AI in Agriculture Intern',
    location: 'Remote',
    type: 'Dec. 2024 – Jan. 2025',
    desc: 'Developed a CNN-based plant disease diagnosis system using TensorFlow/Keras, covering the full ML workflow from data preprocessing and augmentation to training and inference. Deployed a real-time Streamlit app for image-based disease prediction.',
    tags: ['TensorFlow', 'CNN', 'Streamlit', 'Computer Vision', 'Keras'],
  },
]

export default function Experience() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.exp__item')

      items.forEach((item) => {
        const dot  = item.querySelector('.exp__dot')
        const body = item.querySelector('.exp__body')
        const yr   = item.querySelector('.exp__year')

        gsap.fromTo([yr, dot],
          { opacity: 0, x: -16 },
          {
            opacity: 1, x: 0,
            duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 82%', once: true }
          }
        )

        gsap.fromTo(body,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out',
            delay: 0.1,
            scrollTrigger: { trigger: item, start: 'top 82%', once: true }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="experience" className="exp" aria-labelledby="exp-title">
      <div className="container">

        <h2 id="exp-title" className="exp__heading">
          Journey <em>so far</em>
        </h2>

        <div className="exp__list" role="list">
          {JOBS.map((job, i) => (
            <article key={i} className="exp__item" role="listitem">
              {/* Year */}
              <div className="exp__year">
                <span>{job.year}</span>
              </div>

              {/* Vertical timeline line + dot */}
              <div className="exp__timeline" aria-hidden="true">
                <div className="exp__dot" />
                {i < JOBS.length - 1 && <div className="exp__line" />}
              </div>

              {/* Content */}
              <div className="exp__body">
                <header className="exp__header">
                  <div className="exp__title-group">
                    <h3 className="exp__company">{job.company}</h3>
                    <p  className="exp__role">{job.role}</p>
                  </div>
                  <div className="exp__details">
                    <span className="section-label">{job.location}</span>
                    <span className="section-label">{job.type}</span>
                  </div>
                </header>

                <p className="exp__desc">{job.desc}</p>

                <div className="exp__tags" aria-label="Technologies">
                  {job.tags.map(t => (
                    <span key={t} className="exp__tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
