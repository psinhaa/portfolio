import { useEffect, useRef, useState } from 'react'
import './App.css'

// ── SVG canvas dimensions (viewBox units) ────────────────────────────────────
const VW = 1000
const VH = 1960

// Dot positions on the snake path (x < 500 = left side, x > 500 = right side)
const DOTS = [
  { x: 180, y: 130 },
  { x: 820, y: 390 },
  { x: 180, y: 650 },
  { x: 820, y: 910 },
  { x: 180, y: 1170 },
  { x: 820, y: 1430 },
  { x: 180, y: 1690 },
  { x: 500, y: 1880 },
]

// Smooth S-curve connecting all dots
const PATH_D = [
  `M ${DOTS[0].x} ${DOTS[0].y}`,
  ...DOTS.slice(1).map((d, i) => `C 500 ${DOTS[i].y} 500 ${d.y} ${d.x} ${d.y}`),
].join(' ')

// ── Data (present → graduation) ───────────────────────────────────────────────
const milestones = [
  {
    year: 'Mar 2023 – Present',
    type: 'now',
    title: 'Software Engineer',
    subtitle: 'Squint Metrics · Gurugram / Remote',
    detail: 'Collaborating with UX/UI designers to translate designs into pixel-perfect interfaces using Angular, Ionic & React.',
    icon: '🚀',
    color: '#e91e8c',
  },
  {
    year: '2023',
    type: 'project',
    title: 'Project — NeuroSum',
    subtitle: 'Healthcare Tracker App',
    detail: 'Track health, monitor performance, record symptoms & document attacks — built with Angular.',
    icon: '🧠',
    color: '#00bcd4',
  },
  {
    year: '2022',
    type: 'project',
    title: 'Project — Kart',
    subtitle: 'E-Commerce Application',
    detail: 'Full REST API suite, authentication, shopping cart & checkout with MongoDB as the data store.',
    icon: '🛒',
    color: '#00bcd4',
  },
  {
    year: '2022',
    type: 'project',
    title: 'Project — Board',
    subtitle: 'News Feed Website',
    detail: 'HTML, CSS, Bootstrap & JS — accordions, image carousels & Flipboard RSS API integration.',
    icon: '📰',
    color: '#00bcd4',
  },
  {
    year: 'Mar 2021 – Mar 2023',
    type: 'work',
    title: 'Junior Software Engineer',
    subtitle: 'In Time Tec · Jaipur',
    detail: 'Coded and programmed enhancements for subsystems of end-user applications; assisted in debugging.',
    icon: '💼',
    color: '#ff9800',
  },
  {
    year: 'Jul 2021',
    type: 'education',
    title: 'Graduated B.Tech',
    subtitle: 'Rajasthan Technical University',
    detail: '85.60% — Electronics & Communication Engineering.',
    icon: '🏆',
    color: '#6c63ff',
  },
  {
    year: 'Aug 2017',
    type: 'education',
    title: 'Started B.Tech',
    subtitle: 'Rajasthan Technical University · Jaipur',
    detail: 'Electronics & Communication Engineering — the first step.',
    icon: '🎓',
    color: '#6c63ff',
  },
  {
    year: '✦ Origin',
    type: 'start',
    title: 'The Beginning',
    subtitle: 'Rajasthan, India',
    detail: 'Every journey starts somewhere. This is where it all began.',
    icon: '🌱',
    color: '#4caf50',
  },
]

const SKILLS = {
  Languages: 'C/C++, JavaScript, Python',
  Frameworks: 'Angular, React.js, TypeScript, Express.js, Node.js',
  Databases: 'MySQL, SQLite, MongoDB',
  Tools: 'Git, HTML5, CSS, DSA, OOP, Jira, Bitbucket',
}

// ── Runner shape in SVG ────────────────────────────────────────────────────────
function RunnerShape() {
  return (
    <>
      {/* glow halo */}
      <circle r="28" fill="rgba(233,30,140,0.15)" />
      {/* head */}
      <circle cy="-24" r="9" fill="#f4c2a1" />
      <ellipse cy="-31" rx="9" ry="5" fill="#2c1a0e" />
      {/* body */}
      <rect x="-7" y="-15" width="14" height="14" rx="4" fill="#e91e8c" />
      {/* arms (alternating) */}
      <line x1="-7" y1="-12" x2="-14" y2="-4" stroke="#f4c2a1" strokeWidth="3" strokeLinecap="round" />
      <line x1="7" y1="-12" x2="14" y2="-4" stroke="#f4c2a1" strokeWidth="3" strokeLinecap="round" />
      {/* legs */}
      <line x1="-3" y1="-1" x2="-7" y2="11" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="3" y1="-1" x2="7" y2="11" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [progress, setProgress] = useState(0)
  const [runnerPos, setRunnerPos] = useState({ x: DOTS[0].x, y: DOTS[0].y, angle: 90 })
  const [activeIdx, setActiveIdx] = useState(-1)
  const [mileFracs, setMileFracs] = useState<number[]>([])

  const journeyRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Precompute the path-length fraction for each dot after mount
  useEffect(() => {
    const path = svgPathRef.current
    if (!path) return
    const total = path.getTotalLength()
    const SAMPLES = 3000
    const fracs = DOTS.map(dot => {
      let best = 0, bestDist = Infinity
      for (let s = 0; s <= SAMPLES; s++) {
        const f = s / SAMPLES
        const pt = path.getPointAtLength(f * total)
        const d = Math.hypot(pt.x - dot.x, pt.y - dot.y)
        if (d < bestDist) { bestDist = d; best = f }
      }
      return best
    })
    setMileFracs(fracs)
  }, [])

  // Scroll → progress → runner position
  useEffect(() => {
    const onScroll = () => {
      const journey = journeyRef.current
      const path = svgPathRef.current
      if (!journey || !path) return

      const journeyTop = journey.offsetTop
      const journeyH = journey.offsetHeight
      const raw = (window.scrollY + window.innerHeight * 0.55 - journeyTop) / journeyH
      const p = Math.max(0, Math.min(1, raw))
      setProgress(p)

      const total = path.getTotalLength()
      const len = p * total
      const pt = path.getPointAtLength(len)
      const pt2 = path.getPointAtLength(Math.min(len + 12, total))
      const angle = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI
      setRunnerPos({ x: pt.x, y: pt.y, angle })

      if (mileFracs.length) {
        const idx = mileFracs.filter(f => p >= f - 0.01).length - 1
        setActiveIdx(Math.max(-1, idx))
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [mileFracs])

  const year = new Date().getFullYear()

  return (
    <div className="portfolio">
      {/* Theme toggle */}
      <button
        className="theme-toggle"
        onClick={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        aria-label="Toggle theme"
        title="Toggle light / dark"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      {/* ── Hero ── */}
      <header className="hero-section">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="avatar">PS</div>
          <h1 className="hero-name">
            Parul <span>Sinha</span>
          </h1>
          <p className="hero-role">Software Engineer</p>
          <p className="hero-location">📍 Rajasthan, India</p>
          <div className="hero-links">
            <a href="mailto:2308parulsinha@gmail.com">✉ Email</a>
            <a href="https://linkedin.com/in/psinhaa" target="_blank" rel="noreferrer">in LinkedIn</a>
            <a href="https://github.com/psinhaa" target="_blank" rel="noreferrer">⌥ GitHub</a>
            <a href="tel:+919057542454">📞 Call</a>
          </div>
          <div className="scroll-hint">
            <span>Scroll to trace the journey</span>
            <div className="bounce-arrow">↓</div>
          </div>
        </div>
      </header>

      {/* ── Journey (desktop: SVG snake, mobile: vertical timeline) ── */}
      <section className="journey-section">
        <h2 className="section-heading">My Journey</h2>

        {/* ─ Desktop: SVG snake path ─ */}
        <div className="journey-wrap" ref={journeyRef}>
          <svg
            className="journey-svg"
            viewBox={`0 0 ${VW} ${VH}`}
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e91e8c" />
                <stop offset="100%" stopColor="#6c63ff" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track */}
            <path d={PATH_D} fill="none" className="track-bg" strokeWidth="8" strokeLinecap="round" />

            {/* Animated fill */}
            <path
              ref={svgPathRef}
              d={PATH_D}
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={`${1 - progress}`}
              filter="url(#glow)"
            />

            {/* Milestone dots */}
            {DOTS.map((dot, i) => {
              const m = milestones[i]
              const active = activeIdx >= i
              return (
                <g key={i}>
                  <circle cx={dot.x} cy={dot.y} r={active ? 28 : 22} fill={m.color} opacity={active ? 1 : 0.25} filter={active ? 'url(#glow)' : undefined} style={{ transition: 'r 0.3s, opacity 0.3s' }} />
                  <text x={dot.x} y={dot.y + 9} textAnchor="middle" fontSize="24" style={{ userSelect: 'none' }}>{m.icon}</text>
                </g>
              )
            })}

            {/* Runner */}
            <g
              transform={`translate(${runnerPos.x}, ${runnerPos.y}) rotate(${runnerPos.angle - 90})`}
              filter="url(#glow)"
            >
              <RunnerShape />
            </g>
          </svg>

          {/* Cards overlaid on the SVG */}
          {DOTS.map((dot, i) => {
            const m = milestones[i]
            const active = activeIdx >= i
            const onLeft = dot.x < VW / 2   // dot is on left → card goes right
            const xPct = (dot.x / VW) * 100
            const yPct = (dot.y / VH) * 100
            return (
              <div
                key={i}
                className={`mile-card ${onLeft ? 'card-right' : 'card-left'} ${active ? 'active' : ''}`}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  borderColor: m.color,
                }}
              >
                <span className="mile-year" style={{ color: m.color }}>{m.year}</span>
                <h3 className="mile-title">{m.title}</h3>
                <p className="mile-sub">{m.subtitle}</p>
                <p className="mile-detail">{m.detail}</p>
                <span className={`mile-tag tag-${m.type}`}>{m.type}</span>
              </div>
            )
          })}
        </div>

        {/* ─ Mobile: vertical timeline ─ */}
        <div className="mobile-timeline">
          {milestones.map((m, i) => (
            <div key={i} className="mob-item">
              <div className="mob-dot" style={{ background: m.color }}>
                <span>{m.icon}</span>
              </div>
              <div className="mob-card" style={{ borderColor: m.color }}>
                <span className="mile-year" style={{ color: m.color }}>{m.year}</span>
                <h3 className="mile-title">{m.title}</h3>
                <p className="mile-sub">{m.subtitle}</p>
                <p className="mile-detail">{m.detail}</p>
                <span className={`mile-tag tag-${m.type}`}>{m.type}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="skills-section">
        <h2 className="section-heading">Technical Skills</h2>
        <div className="skills-grid">
          {Object.entries(SKILLS).map(([cat, val]) => (
            <div className="skill-card" key={cat}>
              <h4>{cat}</h4>
              <p>{val}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>Software Engineer &nbsp;·&nbsp; Parul Sinha © {year}</p>
      </footer>
    </div>
  )
}
