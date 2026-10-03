import { memo, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Helper to get the total length of any SVG shape for stroke-dash animation
 */
function getPathLength(el) {
  try {
    if (typeof el.getTotalLength === 'function') {
      const len = el.getTotalLength()
      if (len > 0) return len
    }
    const tag = el.tagName.toLowerCase()
    if (tag === 'circle') {
      const r = parseFloat(el.getAttribute('r') || '20')
      return 2 * Math.PI * r
    }
    if (tag === 'ellipse') {
      const rx = parseFloat(el.getAttribute('rx') || '20')
      const ry = parseFloat(el.getAttribute('ry') || '20')
      return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))
    }
    if (tag === 'rect') {
      const w = parseFloat(el.getAttribute('width') || '100')
      const h = parseFloat(el.getAttribute('height') || '100')
      return 2 * (w + h)
    }
    if (tag === 'line') {
      const x1 = parseFloat(el.getAttribute('x1') || '0')
      const y1 = parseFloat(el.getAttribute('y1') || '0')
      const x2 = parseFloat(el.getAttribute('x2') || '0')
      const y2 = parseFloat(el.getAttribute('y2') || '0')
      return Math.hypot(x2 - x1, y2 - y1)
    }
  } catch {
    // fallback
  }
  return 300
}

/**
 * Hook to animate black & white SVG line art drawing when the slide is active.
 * Draws strokes smoothly with GSAP strokeDashoffset, then pops accents & sparkles.
 */
function useLineArtDraw(isActive) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    const container = containerRef.current
    if (!svg || !container) return

    const strokes = Array.from(svg.querySelectorAll('.lineart-stroke'))
    const accents = Array.from(svg.querySelectorAll('.lineart-accent'))
    const fills = Array.from(svg.querySelectorAll('.lineart-fill'))

    if (isActive) {
      // 1. Measure and prime each stroke with its exact length
      strokes.forEach((el) => {
        const len = Math.ceil(getPathLength(el))
        el.style.strokeDasharray = `${len} ${len}`
        el.style.strokeDashoffset = `${len}`
      })

      // 2. Kill any running tweens
      gsap.killTweensOf([container, ...strokes, ...accents, ...fills])

      // 3. Orchestrate the entrance & drawing timeline
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      // Container entrance: smooth slide-in from right and soft scale
      tl.fromTo(
        container,
        { opacity: 0, x: 45, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 0.72, ease: 'power3.out' }
      )

      // Animate line art path drawing
      tl.to(
        strokes,
        {
          strokeDashoffset: 0,
          duration: 1.4,
          stagger: {
            amount: 0.8,
            from: 'start',
          },
          ease: 'power2.inOut',
        },
        '-=0.4'
      )

      // Softly reveal fills / shading
      if (fills.length > 0) {
        tl.fromTo(
          fills,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, stagger: 0.02 },
          '-=0.7'
        )
      }

      // Pop celestial stars, keypoints, and decorative accents
      if (accents.length > 0) {
        tl.fromTo(
          accents,
          { opacity: 0, scale: 0, transformOrigin: 'center' },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.02,
            ease: 'back.out(1.8)',
          },
          '-=0.55'
        )
      }

      return () => {
        tl.kill()
      }
    } else {
      // Reset strokes so that when user revisits, it sketches again
      strokes.forEach((el) => {
        const len = Math.ceil(getPathLength(el))
        el.style.strokeDasharray = `${len} ${len}`
        el.style.strokeDashoffset = `${len}`
      })
      accents.forEach((el) => {
        el.style.opacity = '0'
      })
      fills.forEach((el) => {
        el.style.opacity = '0'
      })
    }
  }, [isActive])

  return { containerRef, svgRef }
}

/**
 * Pure Black & White Line Art Drawings
 * Completely transparent background, purely the drawings without any cards or writings.
 */
function ProjectFigureComponent({ id, isActive = true }) {
  const { containerRef, svgRef } = useLineArtDraw(isActive)

  switch (id) {
    // ── Slide 00: Selected Work (Intro / Celestial Compass) ──
    case '00':
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Coordinate & Celestial Rings */}
            <circle cx="230" cy="170" r="142" className="lineart-stroke" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="230" cy="170" r="122" className="lineart-stroke" stroke="currentColor" strokeOpacity="0.32" strokeWidth="1.2" />
            <circle cx="230" cy="170" r="82" className="lineart-stroke" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="230" cy="170" r="32" className="lineart-stroke" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />

            {/* Cardinal Tick Marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="230"
                y1="46"
                x2="230"
                y2={deg % 90 === 0 ? "36" : "41"}
                className="lineart-stroke"
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.2"
                transform={`rotate(${deg} 230 170)`}
              />
            ))}

            {/* Golden Ratio Logarithmic Spiral */}
            <path
              d="M 230,170 A 16,16 0 0,1 246,186 A 32,32 0 0,1 214,218 A 58,58 0 0,1 156,160 A 102,102 0 0,1 258,58 A 162,162 0 0,1 420,220"
              className="lineart-stroke"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Classical Drafting Compass */}
            {/* Top Pivot Knob */}
            <circle cx="230" cy="58" r="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="230" cy="58" r="3" className="lineart-accent" fill="currentColor" />
            <line x1="230" y1="42" x2="230" y2="50" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

            {/* Compass Left Arm (Needle tip) */}
            <path
              d="M 225,65 C 216,98 196,165 162,260"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <line x1="162" y1="260" x2="155" y2="280" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="155" cy="281" r="1.5" className="lineart-accent" fill="currentColor" />

            {/* Compass Right Arm (Pencil lead mount) */}
            <path
              d="M 235,65 C 244,98 264,165 298,260"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Lead Mount & Tip */}
            <rect x="292" y="256" width="13" height="16" rx="1.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" transform="rotate(18 298 260)" />
            <path d="M 302,272 L 305,286 L 309,275 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />

            {/* Adjustment Screw Rod & Knurled Wheel */}
            <line x1="188" y1="150" x2="272" y2="150" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" />
            <rect x="223" y="142" width="14" height="16" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" />
            <line x1="227" y1="142" x2="227" y2="158" className="lineart-stroke" stroke="currentColor" strokeWidth="0.8" />
            <line x1="233" y1="142" x2="233" y2="158" className="lineart-stroke" stroke="currentColor" strokeWidth="0.8" />

            {/* Radiating Celestial 8-Pointed Star of Creation */}
            <g transform="translate(230, 114)">
              <path
                d="M 0,-26 L 5,-9 L 22,-4 L 7,5 L 15,22 L 0,9 L -15,22 L -7,5 L -22,-4 L -5,-9 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="0" cy="0" r="3" className="lineart-accent" fill="currentColor" />
            </g>

            {/* Sinuous Atelier Ribbon Banner Loops */}
            <path
              d="M 115,295 C 155,280 195,292 230,285 C 265,278 305,292 345,295"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 115,303 C 155,288 195,300 230,293 C 265,286 305,300 345,303"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M 115,295 L 98,304 L 115,303" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" />
            <path d="M 345,295 L 362,304 L 345,303" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" />

            {/* Laurel Sprig Details (Left & Right) */}
            <path d="M 108,245 Q 102,220 112,198" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 106,234 Q 92,230 96,221 Q 106,225 106,234 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
            <path d="M 104,214 Q 90,210 94,202 Q 104,206 104,214 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />

            <path d="M 352,245 Q 358,220 348,198" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 354,234 Q 368,230 364,221 Q 354,225 354,234 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
            <path d="M 356,214 Q 370,210 366,202 Q 356,206 356,214 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />

            {/* Celestial 4-Pointed Sparkles */}
            {[
              [382, 95, 9],
              [88, 165, 5],
              [372, 160, 6],
              [230, 24, 7],
              [165, 95, 4],
              [295, 95, 4],
              [135, 320, 5],
              [325, 320, 5],
            ].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )

    // ── Slide 01: ResQMesh (Disaster Communication) ──
    case '01':
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Topographic Contour Curves Across the Mountain Range */}
            <path
              d="M 20,295 C 65,286 95,302 140,290 C 185,278 225,294 270,286 C 315,276 355,294 400,286 C 425,280 445,294 455,290"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeDasharray="2 3"
              strokeOpacity="0.45"
            />
            <path
              d="M 20,312 C 75,304 125,318 180,307 C 235,296 290,312 345,302 C 400,292 435,312 455,306"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeDasharray="2 3"
              strokeOpacity="0.35"
            />

            {/* Distant Mountain Peak (Left) */}
            <path
              d="M 25,288 L 115,195 L 190,268"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 115,195 L 128,278" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55" />
            <path d="M 92,232 L 120,244" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />
            <path d="M 80,254 L 122,268" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />

            {/* Central Summit Peak (Beacon Location) */}
            <path
              d="M 145,282 L 240,148 L 340,268"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 240,148 L 246,288" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.65" />
            <path d="M 218,188 L 242,200" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
            <path d="M 202,222 L 244,236" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />
            <path d="M 180,254 L 245,272" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.45" />

            {/* Mountain Peak (Right) */}
            <path
              d="M 292,268 L 380,190 L 445,288"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M 380,190 L 372,280" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55" />
            <path d="M 358,224 L 374,236" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />
            <path d="M 346,248 L 372,262" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.4" />

            {/* Emergency Transmission Tower on Summit */}
            <g transform="translate(240, 148)">
              <line x1="-9" y1="0" x2="-2" y2="-58" className="lineart-stroke" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="9" y1="0" x2="2" y2="-58" className="lineart-stroke" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* Lattice cross struts */}
              <line x1="-8" y1="-14" x2="6" y2="-28" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              <line x1="8" y1="-14" x2="-6" y2="-28" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              <line x1="-6" y1="-28" x2="4" y2="-44" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              <line x1="6" y1="-28" x2="-4" y2="-44" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              <line x1="-4" y1="-44" x2="2" y2="-58" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              <line x1="4" y1="-44" x2="-2" y2="-58" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />

              {/* Antenna Spire & Beacon Orb */}
              <line x1="0" y1="-58" x2="0" y2="-80" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="0" cy="-80" r="4.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="0" cy="-80" r="2" className="lineart-accent" fill="currentColor" />
            </g>

            {/* Expanding Concentric LoRa Radio Wave Arcs */}
            <g transform="translate(240, 68)">
              <path d="M -24,-6 A 26,26 0 0,1 24,-6" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M -42,-18 A 46,46 0 0,1 42,-18" className="lineart-stroke" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M -62,-30 A 70,70 0 0,1 62,-30" className="lineart-stroke" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M -85,-44 A 98,98 0 0,1 85,-44" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" strokeLinecap="round" />
            </g>

            {/* Carrier Rescue Swallow in Flight */}
            <g transform="translate(95, 88)">
              <path
                d="M -15,7 C -9,0 4,-7 19,-4 C 13,1 9,9 3,13 C -6,15 -11,11 -15,7 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M 19,-4 L 27,-5 L 19,-1" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="15" cy="-2" r="1.2" className="lineart-accent" fill="currentColor" />

              {/* Sweeping Upper Wing */}
              <path
                d="M 4,-4 C 9,-20 22,-42 38,-52 C 27,-37 18,-24 4,-13"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M 31,-46 C 24,-33 18,-22 7,-11" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 24,-37 C 20,-26 13,-17 4,-9" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />

              {/* Lower Wing */}
              <path
                d="M 0,11 C -4,24 -11,37 -20,48 C -13,35 -7,24 -2,13"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M -16,42 C -11,31 -7,20 -2,11" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />

              {/* Split Tail Feathers */}
              <path
                d="M -15,7 C -28,12 -42,20 -52,32 C -42,20 -30,14 -17,9"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M -15,7 C -30,7 -45,9 -58,14 C -45,9 -32,7 -17,7"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />

              {/* SOS Lifeline Ribbon in Beak */}
              <path
                d="M 27,-5 C 48,-14 75,6 105,-4 C 122,-11 138,-4 154,-18"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </g>

            {/* Distributed Mesh Node Targets Across Ridges */}
            <g transform="translate(115, 195)">
              <circle r="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <circle r="3" className="lineart-accent" fill="currentColor" />
            </g>
            <g transform="translate(380, 190)">
              <circle r="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <circle r="3" className="lineart-accent" fill="currentColor" />
            </g>
            {/* P2P Radio Link Beams (Dashed) */}
            <line x1="115" y1="195" x2="232" y2="92" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 3" strokeOpacity="0.55" />
            <line x1="248" y1="92" x2="380" y2="190" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 3" strokeOpacity="0.55" />
            <line x1="115" y1="195" x2="380" y2="190" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeDasharray="2 4" strokeOpacity="0.35" />

            {/* Crescent Moon & Stars */}
            <path
              d="M 395,48 C 386,48 377,56 377,67 C 377,78 386,86 395,86 C 390,83 386,76 386,67 C 386,58 390,52 395,48 Z"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            {[[165, 36, 5], [335, 44, 6], [422, 105, 7], [32, 130, 5], [428, 240, 5]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )

    // ── Slide 02: CollabCode (Collaborative Code Editor) ──
    case '02':
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Monumental Art Nouveau Code Braces Framing the Composition */}
            {/* Left Curly Brace */}
            <path
              d="M 72,55 C 46,55 35,78 35,112 C 35,145 24,156 12,168 C 24,178 35,190 35,222 C 35,258 46,280 72,280"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            {/* Right Curly Brace */}
            <path
              d="M 388,55 C 414,55 425,78 425,112 C 425,145 436,156 448,168 C 436,178 425,190 425,222 C 425,258 414,280 388,280"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
            />

            {/* Laptop Display in Clean Architectural Linework */}
            <g transform="translate(125, 82)">
              {/* Outer screen shell */}
              <rect x="0" y="0" width="210" height="142" rx="6" className="lineart-stroke" stroke="currentColor" strokeWidth="2" />
              {/* Inner bezel */}
              <rect x="7" y="7" width="196" height="128" rx="3" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
              {/* Window header line */}
              <line x1="7" y1="26" x2="203" y2="26" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
              {/* Three window control dots */}
              <circle cx="20" cy="16" r="2.8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="29" cy="16" r="2.8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="38" cy="16" r="2.8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />

              {/* Code lines inside editor */}
              <line x1="24" y1="44" x2="60" y2="44" className="lineart-stroke" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="68" y1="44" x2="130" y2="44" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
              <line x1="138" y1="44" x2="175" y2="44" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.45" />

              <line x1="24" y1="58" x2="78" y2="58" className="lineart-stroke" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="86" y1="58" x2="155" y2="58" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />

              {/* Cursor 1 (User Alpha) */}
              <line x1="158" y1="52" x2="158" y2="65" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              <rect x="146" y="40" width="24" height="10" rx="1.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />

              <line x1="24" y1="74" x2="50" y2="74" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.5" />
              <line x1="58" y1="74" x2="120" y2="74" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />

              {/* Cursor 2 (User Beta) */}
              <line x1="78" y1="82" x2="78" y2="95" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              <rect x="68" y="71" width="22" height="10" rx="1.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />

              <line x1="24" y1="88" x2="105" y2="88" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
              <line x1="24" y1="102" x2="70" y2="102" className="lineart-stroke" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="78" y1="102" x2="145" y2="102" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
            </g>

            {/* Laptop Base (Isometric Keyboard Deck) */}
            <path
              d="M 90,224 L 370,224 L 402,266 L 58,266 Z"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Front lip */}
            <path d="M 58,266 L 58,272 L 402,272 L 402,266" className="lineart-stroke" stroke="currentColor" strokeWidth="2" />
            {/* Trackpad */}
            <rect x="192" y="238" width="76" height="24" rx="3" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55" />

            {/* Two Stylized Hand Profiles Typing Toward the Keyboard */}
            {/* Left Hand Profile */}
            <g transform="translate(62, 240)">
              <path
                d="M -30,55 C -15,44 6,30 28,19 C 38,15 46,13 55,16"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M -15,60 C 6,46 28,32 50,25 C 59,23 68,21 74,24"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M -5,66 C 16,52 38,38 64,32 C 72,30 81,29 88,33"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>

            {/* Right Hand Profile */}
            <g transform="translate(398, 240)">
              <path
                d="M 30,55 C 15,44 -6,30 -28,19 C -38,15 -46,13 -55,16"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 15,60 C -6,46 -28,32 -50,25 C -59,23 -68,21 -74,24"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M 5,66 C -16,52 -38,38 -64,32 C -72,30 -81,29 -88,33"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>

            {/* Floating CRDT Directed Acyclic Graph (DAG) Sync Nodes */}
            <g transform="translate(230, 40)">
              {/* Root Node S0 */}
              <circle cx="0" cy="0" r="10" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="3.5" className="lineart-accent" fill="currentColor" />

              {/* Diverging Branches */}
              <path d="M -7,7 L -38,26" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M 7,7 L 38,26" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />

              {/* Branch Node Delta 1 (Left) */}
              <circle cx="-42" cy="28" r="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              {/* Branch Node Delta 2 (Right) */}
              <circle cx="42" cy="28" r="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />

              {/* Merging Convergent Branches */}
              <path d="M -38,35 L -8,52" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 38,35 L 8,52" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />

              {/* Converged State S_SYNC */}
              <circle cx="0" cy="56" r="11" className="lineart-stroke" stroke="currentColor" strokeWidth="2" />
              <circle cx="0" cy="56" r="4.5" className="lineart-accent" fill="currentColor" />
            </g>

            {/* Floating Code Symbols & Sparkle Stars */}
            <g transform="translate(95, 115)" className="lineart-accent">
              <path d="M 13,-9 L 0,0 L 13,9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M 24,9 L 37,0 L 24,-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <g transform="translate(330, 115)" className="lineart-accent">
              <path d="M 0,0 L 9,0 M 4.5,-4.5 L 4.5,4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 18,-7 L 27,0 L 18,7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>

            {[[350, 48, 7], [65, 150, 5], [395, 150, 5], [230, 310, 6]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )

    // ── Slide 03: SpeakMySigns (Gesture-to-Speech AI) ──
    case '03':
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Expressive Hand Silhouette in Sign Language Gesture (Art Nouveau / Line Art) */}
            <g transform="translate(115, 65)">
              {/* Wrist & Forearm */}
              <path
                d="M -30,235 C -25,195 -18,162 -10,140"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M 28,235 C 26,195 24,162 20,140"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Ornate Braided Wrist Cuff (Echoing user's reference drawing) */}
              <path d="M -30,205 Q -2,198 28,205" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M -28,215 Q -2,208 26,215" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              {[-20, -10, 0, 10, 20].map((x) => (
                <line key={x} x1={x} y1="203" x2={x + 3} y2="217" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              ))}

              {/* Palm & Thumb */}
              <path
                d="M -10,140 C -25,120 -35,100 -45,76 C -48,68 -44,62 -36,66 C -28,70 -18,84 -8,104"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Index Finger Poised Upward */}
              <path
                d="M -8,104 C -12,68 -16,32 -18,4 C -19,-8 -9,-10 -6,2 C 0,24 6,68 8,98"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Middle Finger Poised Upward */}
              <path
                d="M 8,98 C 10,62 14,26 18,-6 C 19,-16 29,-16 30,-4 C 31,26 28,70 24,105"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Ring Finger Gently Curled */}
              <path
                d="M 24,105 C 34,82 44,64 55,56 C 62,50 68,56 62,66 C 52,82 40,105 32,122"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pinky Finger Gently Curled */}
              <path
                d="M 32,122 C 45,105 58,90 68,84 C 75,80 80,86 72,96 C 60,115 42,134 20,140"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* MediaPipe Keypoint Joint Indicator Rings */}
              {[
                [-45, 76], [-36, 66], [-18, 4], [-6, 2],
                [18, -6], [30, -4], [55, 56], [68, 84],
                [-8, 104], [8, 98], [24, 105], [32, 122],
                [-2, 150]
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="2.8" className="lineart-accent" stroke="currentColor" strokeWidth="1.2" fill="#fff" />
              ))}
            </g>

            {/* Sinuous Soundwave Ribbons Swirling from Fingertips into Speech */}
            <path
              d="M 132,58 C 160,28 210,20 255,46 C 300,72 325,128 375,122 C 410,118 430,90 440,70"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M 144,52 C 172,22 222,14 268,40 C 312,66 338,122 388,115 C 418,111 435,85 445,65"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            {/* Audio Waveform Oscillations Emerging from Ribbon */}
            <path
              d="M 230,175 Q 240,150 250,175 T 270,175 T 290,135 T 310,205 T 330,155 T 350,185 T 370,168 T 390,175 T 410,175"
              className="lineart-stroke"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line x1="220" y1="175" x2="425" y2="175" className="lineart-stroke" stroke="currentColor" strokeWidth="0.9" strokeDasharray="3 3" strokeOpacity="0.45" />

            {/* Singing Crowned Bird in Flight (Direct Homage to Reference Drawing!) */}
            <g transform="translate(345, 68)">
              {/* Bird Body */}
              <path
                d="M -13,4 C -7,-2 4,-6 15,-4 C 9,2 4,9 -2,11 C -9,12 -12,9 -13,4 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              {/* Singing Open Beak */}
              <path d="M 15,-4 L 22,-6 M 15,-2 L 21,0" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="-2" r="1.2" className="lineart-accent" fill="currentColor" />

              {/* Wings */}
              <path
                d="M 2,-4 C 8,-18 19,-33 32,-42 C 23,-31 15,-20 4,-11"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path d="M 26,-35 C 19,-26 13,-18 4,-9" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M 0,9 C -4,20 -9,30 -16,39 C -11,28 -5,20 -2,11" className="lineart-stroke" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />

              {/* Crown on Bird */}
              <path d="M 9,-6 L 8,-11 L 10,-9 L 12,-12 L 14,-9 L 16,-11 L 15,-6" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
            </g>

            {/* Delicate Line-Art Rose at the Base of the Forearm */}
            <g transform="translate(58, 270)">
              {/* Outer Petals */}
              <path
                d="M -16,-5 C -28,-19 -11,-34 4,-28 C 19,-34 35,-19 24,-5 C 35,9 16,24 2,18 C -13,24 -29,9 -16,-5 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              {/* Inner Petal Swirl */}
              <path
                d="M -9,-6 C -15,-15 -2,-24 6,-20 C 13,-24 22,-13 15,-4 C 20,4 9,13 0,9 C -9,13 -17,4 -9,-6 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path d="M -2,-4 C 2,-9 9,-7 7,-2 C 4,2 -2,2 -2,-4 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
              {/* Rose Leaves */}
              <path d="M 24,-5 Q 42,-13 39,0 Q 30,4 24,-5 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -16,-5 Q -35,-11 -31,2 Q -24,4 -16,-5 Z" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
            </g>

            {/* Celestial Sparkles */}
            {[[225, 30, 8], [420, 120, 7], [290, 92, 5], [36, 150, 5], [430, 40, 6], [240, 315, 6]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )

    // ── Slide 04: PlantVision (Botanical Computer Vision / CNN) ──
    case '04':
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Majestic Botanical Monstera / Flora Leaf Linework */}
            <g transform="translate(180, 170)">
              {/* Elegant Central Midrib Vein Curving Across */}
              <path
                d="M -125,125 C -72,76 -12,16 52,-54 C 100,-108 142,-135 164,-142"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />

              {/* Main Outer Leaf Silhouette with Deep Natural Lobes */}
              <path
                d="M -125,125
                   C -130,65 -98,22 -65,-22
                   C -44,-54 -11,-86 38,-118
                   C 86,-150 128,-152 164,-142
                   C 150,-102 132,-58 100,-16
                   C 68,26 26,80 -38,112
                   C -80,134 -112,130 -125,125 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />

              {/* Leaf Fenestrations (Monstera Oval Cutouts) */}
              <ellipse cx="-22" cy="-38" rx="9" ry="24" transform="rotate(-35 -22 -38)" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="30" cy="-70" rx="8" ry="20" transform="rotate(-38 30 -70)" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <ellipse cx="80" cy="-98" rx="6.5" ry="16" transform="rotate(-40 80 -98)" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />

              {/* Lateral Vein Hierarchy Radiating Outward */}
              <path d="M -92,98 C -76,76 -54,65 -28,67" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -54,60 C -38,35 -11,24 16,28" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -16,20 C 5,-4 35,-13 60,-7" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 24,-24 C 45,-48 74,-54 100,-46" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M 70,-70 C 88,-88 116,-95 138,-86" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

              {/* Left Veins */}
              <path d="M -82,82 C -90,54 -85,32 -68,11" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -42,44 C -52,16 -46,-9 -28,-28" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M -4,6 C -13,-22 -7,-44 13,-64" className="lineart-stroke" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />

              {/* Dewdrops on leaf */}
              <circle cx="164" cy="-142" r="2.8" className="lineart-accent" stroke="currentColor" strokeWidth="1.2" fill="#fff" />
              <circle cx="-68" cy="-24" r="2.2" className="lineart-accent" stroke="currentColor" strokeWidth="1.2" fill="#fff" />
            </g>

            {/* Precision Optical Scanner Reticle / Viewfinder Loupe */}
            <g transform="translate(258, 155)">
              {/* Outer Loupe Frame */}
              <circle cx="0" cy="0" r="82" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="0" cy="0" r="74" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeDasharray="3 4" strokeOpacity="0.45" />
              <circle cx="0" cy="0" r="28" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeOpacity="0.55" />

              {/* 360-Degree Calibration Ticks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="-82"
                  x2="0"
                  y2={deg % 90 === 0 ? "-70" : "-76"}
                  className="lineart-stroke"
                  stroke="currentColor"
                  strokeWidth={deg % 90 === 0 ? "1.8" : "1.1"}
                  transform={`rotate(${deg})`}
                />
              ))}

              {/* Crosshair Reticle Lines with Center Gap */}
              <line x1="-102" y1="0" x2="-35" y2="0" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="35" y1="0" x2="102" y2="0" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="-102" x2="0" y2="-35" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="35" x2="0" y2="102" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

              {/* Computer Vision Detection Bounding Box Brackets [  ] */}
              <g transform="translate(-27, -27)">
                <path d="M 0,11 V 0 H 11" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 54,11 V 0 H 43" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 0,43 V 54 H 11" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 54,43 V 54 H 43" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />

                {/* Detected Pathology Contour */}
                <ellipse cx="27" cy="27" rx="15" ry="11" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="27" cy="27" r="3" className="lineart-accent" fill="currentColor" />
              </g>

              {/* Botanical Tendril Curling around the Loupe Frame */}
              <path
                d="M 74,40 C 92,60 102,92 92,124 C 84,145 65,156 45,150 C 32,145 30,131 39,124 C 48,116 60,123 56,135"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* 3x3 Convolution Matrix Kernel Floating at Upper Left */}
            <g transform="translate(50, 70)">
              <rect x="0" y="0" width="80" height="80" rx="3" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" />
              <line x1="26.6" y1="0" x2="26.6" y2="80" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
              <line x1="53.3" y1="0" x2="53.3" y2="80" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
              <line x1="0" y1="26.6" x2="80" y2="26.6" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
              <line x1="0" y1="53.3" x2="80" y2="53.3" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.45" />
              {/* Highlight active kernel cell */}
              <rect x="26.6" y="26.6" width="26.6" height="26.6" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              <circle cx="40" cy="40" r="3.5" className="lineart-accent" fill="currentColor" />
            </g>

            {/* Celestial Sparkles */}
            {[[42, 190, 6], [420, 70, 7], [385, 255, 6], [265, 35, 6], [230, 320, 6]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )

    // ── Slide 05: SQD Website (Production Full-Stack Platform) ──
    case '05':
    case '06':
    default:
      return (
        <div ref={containerRef} className="proj-sketch proj-sketch--pure" aria-hidden="true">
          <svg
            ref={svgRef}
            className="proj-sketch__canvas"
            viewBox="0 0 460 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Perspective Horizon Ground Plane Grid */}
            <line x1="15" y1="225" x2="445" y2="225" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 4" />
            <line x1="230" y1="225" x2="45" y2="305" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 4" />
            <line x1="230" y1="225" x2="135" y2="305" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 4" />
            <line x1="230" y1="225" x2="230" y2="305" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 4" />
            <line x1="230" y1="225" x2="325" y2="305" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 4" />
            <line x1="230" y1="225" x2="415" y2="305" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 4" />

            {/* Desktop Display Monitor (Centerpiece) */}
            <g transform="translate(140, 68)">
              {/* Monitor Frame */}
              <rect x="0" y="0" width="205" height="135" rx="5" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              {/* Screen Bezel */}
              <rect x="6" y="6" width="193" height="123" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
              {/* Browser Bar */}
              <line x1="6" y1="23" x2="199" y2="23" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
              <circle cx="17" cy="15" r="2.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="25" cy="15" r="2.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="33" cy="15" r="2.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.2" />
              <rect x="46" y="10" width="112" height="9" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.55" />

              {/* Wireframe Hero Layout */}
              <line x1="19" y1="40" x2="52" y2="40" className="lineart-stroke" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              <line x1="138" y1="40" x2="185" y2="40" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeOpacity="0.55" />

              {/* Hero Banner Box */}
              <rect x="19" y="50" width="167" height="45" rx="3" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="30" y1="65" x2="112" y2="65" className="lineart-stroke" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="30" y1="76" x2="90" y2="76" className="lineart-stroke" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeOpacity="0.65" />
              <rect x="132" y="58" width="45" height="30" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />

              {/* 3 Product Cards */}
              {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${19 + i * 58}, 102)`}>
                  <rect width="51" height="21" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="7" y1="8" x2="30" y2="8" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
                  <line x1="7" y1="15" x2="41" y2="15" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" strokeOpacity="0.55" />
                </g>
              ))}

              {/* Monitor Stand */}
              <line x1="102.5" y1="135" x2="102.5" y2="162" className="lineart-stroke" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M 72,162 L 133,162" className="lineart-stroke" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
            </g>

            {/* Tablet Device Angled on Left */}
            <g transform="translate(60, 120)">
              <rect x="0" y="0" width="74" height="102" rx="4" className="lineart-stroke" stroke="currentColor" strokeWidth="2" />
              <rect x="5" y="5" width="64" height="92" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
              <line x1="13" y1="19" x2="38" y2="19" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <rect x="13" y="28" width="49" height="30" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2" />
              <rect x="13" y="64" width="49" height="15" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" />
              <rect x="13" y="83" width="49" height="9" rx="1.5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" />
            </g>

            {/* Smartphone Device Standing in Foreground Right */}
            <g transform="translate(352, 135)">
              <rect x="0" y="0" width="56" height="96" rx="6" className="lineart-stroke" stroke="currentColor" strokeWidth="2.2" />
              <rect x="4" y="4" width="48" height="88" rx="3" className="lineart-stroke" stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
              {/* Dynamic Island / Notch */}
              <rect x="21" y="9" width="15" height="3.5" rx="1.7" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" />
              {/* Mobile layout */}
              <line x1="11" y1="21" x2="30" y2="21" className="lineart-stroke" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="11" y="30" width="34" height="24" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 2" />
              <rect x="11" y="58" width="34" height="13" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" />
              <rect x="11" y="75" width="34" height="11" rx="2" className="lineart-stroke" stroke="currentColor" strokeWidth="1.1" />
            </g>

            {/* Cloud & Network Architecture Above */}
            <g transform="translate(230, 36)">
              {/* Isometric Cloud Monolith */}
              <path
                d="M -32,0 C -48,0 -54,-15 -42,-24 C -45,-36 -27,-45 -13,-38 C -4,-48 18,-48 27,-38 C 41,-42 54,-32 50,-19 C 59,-13 54,0 38,0 Z"
                className="lineart-stroke"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {/* Up/Down sync lines connecting to monitor */}
              <line x1="-13" y1="0" x2="-13" y2="30" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="13" y1="0" x2="13" y2="30" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="-13" cy="16" r="2.2" className="lineart-accent" fill="currentColor" />
              <circle cx="13" cy="16" r="2.2" className="lineart-accent" fill="currentColor" />
            </g>

            {/* Production Badge Emblem */}
            <g transform="translate(400, 72)">
              <circle cx="0" cy="0" r="15" className="lineart-stroke" stroke="currentColor" strokeWidth="1.5" />
              <path d="M -6,0 L -2,4 L 7,-5" className="lineart-stroke" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Celestial Sparkles */}
            {[[115, 38, 5], [345, 38, 6], [435, 175, 6], [32, 245, 5], [230, 320, 6]].map(([x, y, s], i) => (
              <g key={i} transform={`translate(${x}, ${y})`} className="lineart-accent">
                <path
                  d={`M 0,-${s} Q 0,0 ${s},0 Q 0,0 0,${s} Q 0,0 -${s},0 Q 0,0 0,-${s}`}
                  stroke="currentColor"
                  strokeWidth="1.3"
                  fill="none"
                />
              </g>
            ))}
          </svg>
        </div>
      )
  }
}

export const ProjectFigure = memo(ProjectFigureComponent)
export default ProjectFigure
