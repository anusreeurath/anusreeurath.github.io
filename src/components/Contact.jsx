import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Contact.css'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anusree-urath-09b724325' },
  { label: 'GitHub',   href: 'https://github.com/anusreeurath' },
]

export default function Contact() {
  const sectionRef  = useRef(null)
  const leftRef     = useRef(null)
  const rightRef    = useRef(null)

  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | null

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )
      gsap.fromTo(rightRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1,
          delay: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Please enter your name'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      const firstField = Object.keys(newErrors)[0]
      const el = document.getElementById(`cf-${firstField}`)
      if (el) el.focus()
      return
    }

    setErrors({})
    setStatus('sending')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '5a218ba5-53ef-49c1-9d94-269987457d9a',
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || `Portfolio Contact from ${form.name.trim()}`,
          message: form.message.trim() || '(No message provided)',
          from_name: form.name.trim(),
        }),
      })

      const data = await res.json()

      if (data.success) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus(null), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus(null), 4000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__inner container">
        <div className="contact__cols">

          {/* ── LEFT: heading + form ── */}
          <div ref={leftRef} className="contact__left" style={{ opacity: 0 }}>
            <div className="contact__head">
              <p className="contact__eyebrow">Get in touch</p>
              <h2 id="contact-title" className="contact__title">
                Let's build something <em>together</em>
              </h2>
              <p className="contact__sub">
                Have a project in mind, a question, or just want to say hi?
                Drop me a message and I'll get back to you.
              </p>
            </div>

            <form className="contact__form" onSubmit={handleSubmit} noValidate aria-label="Contact form">
              <div className="cform__row">
                <div className="cform__field">
                  <label className="cform__label" htmlFor="cf-name">Name *</label>
                  <input
                    id="cf-name"
                    className={`cform__input${errors.name ? ' cform__input--error' : ''}`}
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'cf-name-error' : undefined}
                  />
                  {errors.name && (
                    <span id="cf-name-error" className="cform__error" role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>
                <div className="cform__field">
                  <label className="cform__label" htmlFor="cf-email">Email *</label>
                  <input
                    id="cf-email"
                    className={`cform__input${errors.email ? ' cform__input--error' : ''}`}
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'cf-email-error' : undefined}
                  />
                  {errors.email && (
                    <span id="cf-email-error" className="cform__error" role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="cform__field">
                <label className="cform__label" htmlFor="cf-subject">Subject</label>
                <input
                  id="cf-subject" className="cform__input" type="text"
                  name="subject" placeholder="What's this about?"
                  value={form.subject} onChange={handleChange}
                />
              </div>

              <div className="cform__field">
                <label className="cform__label" htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message" className="cform__input cform__textarea"
                  name="message" placeholder="Tell me what you have in mind…"
                  rows={5} value={form.message} onChange={handleChange} required
                />
              </div>

              <button
                id="contact-submit-btn"
                className={`cform__btn${status === 'sending' ? ' cform__btn--loading' : ''}${status === 'sent' ? ' cform__btn--sent' : ''}${status === 'error' ? ' cform__btn--error' : ''}`}
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
              >
                {status === 'sending' && <span className="cform__spinner" aria-hidden="true" />}
                <span className="cform__btn-text">
                  {status === 'sending'
                    ? 'Sending…'
                    : status === 'sent'
                    ? 'Message sent ✓'
                    : status === 'error'
                    ? 'Failed to send · Try again'
                    : 'Send message'}
                </span>
                {!status && <span className="cform__btn-arrow" aria-hidden="true">↗</span>}
              </button>
            </form>
          </div>

          {/* ── RIGHT: contact details ── */}
          <div ref={rightRef} className="contact__right" style={{ opacity: 0 }}>

            <div className="cdetail__block">
              <p className="cdetail__eyebrow">Email me directly</p>
              <a
                href="mailto:anusreeurath2004@gmail.com"
                className="cdetail__email"
                aria-label="Send email to anusreeurath2004@gmail.com"
              >
                anusreeurath2004@gmail.com
                <span className="cdetail__underline" aria-hidden="true" />
              </a>
            </div>

            <div className="cdetail__divider" />

            <div className="cdetail__block">
              <p className="cdetail__eyebrow">Find me on</p>
              <div className="cdetail__socials">
                {SOCIALS.map(({ label, href }) => (
                  <a
                    key={label} href={href}
                    className="cdetail__social cdetail__social--card"
                    target="_blank" rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <span className="cdetail__social-name">{label}</span>
                    <span className="cdetail__arrow" aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
