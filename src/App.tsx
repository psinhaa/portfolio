import { useEffect, useRef, useState } from 'react'
import './App.css'
import { COMPANIES, COLLEGE_PROJECTS, type Company } from './data'
import CompanyPage from './CompanyPage'

// ── Static data ────────────────────────────────────────────────────────────────
const ROLES = ['Software Engineer', 'Angular Developer', 'Full Stack Developer', 'React Developer', 'UI Craftsperson', 'Node.JS Developer', 'AI Enuthusiastic', 'Ionic Developer']

const STATS = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 2, suffix: '', label: 'Companies' },
  { value: 10, suffix: '+', label: 'Projects Built' },
  { value: 8, suffix: '+', label: 'Technologies' },
]

const TERMINAL_LINES = [
  { text: '$ whoami', type: 'cmd' },
  { text: 'parul_sinha  ✓', type: 'ok' },
  { text: '', type: 'empty' },
  { text: '$ cat about.json', type: 'cmd' },
  { text: '{', type: 'code' },
  { text: '  role:     "Software Engineer"', type: 'prop' },
  { text: '  exp:      "4+ years"', type: 'prop' },
  { text: '  stack:    ["Angular","React"]', type: 'prop' },
  { text: '  location: "Rajasthan, India"', type: 'prop' },
  { text: '  open:      true  🟢', type: 'highlight' },
  { text: '}', type: 'code' },
  { text: '', type: 'empty' },
  { text: '$ git log --oneline', type: 'cmd' },
  { text: 'a3f2b  feat: Venue Advantage', type: 'git' },
  { text: 'b2e1c  feat: NeuroSum healthcare app', type: 'git' },
  { text: 'c1g5d  feat: Kart e-commerce platform', type: 'git' },
]


const SKILL_GROUPS = [
  { label: 'Languages', icon: '{ }', color: '#e91e8c', skills: ['JavaScript', 'TypeScript', 'Python', 'C/C++'] },
  { label: 'Frameworks', icon: '⚙', color: '#6c63ff', skills: ['Angular', 'React.js', 'Ionic', 'Node.js', 'Express.js'] },
  { label: 'Databases', icon: '🗄', color: '#00bcd4', skills: ['MongoDB', 'MySQL', 'SQLite'] },
  { label: 'Tools & Concepts', icon: '🛠', color: '#ff9800', skills: ['Git', 'HTML5', 'CSS3', 'REST API', 'DSA', 'OOP', 'Jira', 'Bitbucket'] },
]

const JOURNEY = [
  {
    year: 'Aug 2017 – Jul 2021', type: 'education', title: 'B.Tech — Electronics & Communication',
    subtitle: 'SKIT, Jaipur · RTU', detail: '85.60% · Swami Keshvanand Institute of Technology.',
    icon: '🎓', color: '#6c63ff',
    projects: [{ icon: '🛒', name: 'Kart', desc: 'Full-stack e-commerce' }, { icon: '📰', name: 'Board', desc: 'Flipboard news feed' }],
  },
  {
    year: 'Mar 2021 – Mar 2023', type: 'work', title: 'Software Engineer',
    subtitle: 'In Time Tec · Jaipur', detail: 'Front-end & Python development for US-based clients across healthcare and non-profit sectors.',
    icon: '💻', color: '#ff9800',
    projects: [{ icon: '🌱', name: 'AEYC-IDAHO', desc: 'Non-profit membership portal' }, { icon: '🖨️', name: 'AHA 3D Printer', desc: 'Python hardware controller' }],
  },
  {
    year: 'Mar 2023 – Present', type: 'now', title: 'Software Engineer',
    subtitle: 'Squint Metrics · Gurugram / Remote', detail: 'Pixel-perfect UIs with Angular, Ionic & React. Close collaboration with UX/UI designers.',
    icon: '🚀', color: '#e91e8c',
    projects: [{ icon: '🧠', name: 'NeuroSum', desc: 'Healthcare symptom tracker' }, { icon: '🏟️', name: 'Venue Advantage', desc: 'Sports sponsorship platform' }],
  },
  {
    year: '2024 – Now', type: 'milestone', title: 'Current Focus',
    subtitle: 'Full Stack · AI Integration', detail: 'Shipping Venue Advantage and exploring AI-powered product features.',
    icon: '⚡', color: '#a855f7',
    projects: [],
  },
  {
    year: 'Future', type: 'start', title: 'Next Chapter',
    subtitle: 'Open to Opportunities', detail: 'Looking for roles that combine great engineering culture with impactful products.',
    icon: '🌟', color: '#00bcd4',
    projects: [],
  },
]

const NAV_LINKS = ['About', 'Journey', 'Experience', 'Skills', 'Contact']

// ── Canvas particle network ────────────────────────────────────────────────────
function ParticleField({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const isMobile = window.innerWidth < 640
    const count = isMobile ? 20 : Math.min(65, Math.floor(window.innerWidth / 20))
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.8 + 0.7,
      hue: Math.random() > 0.5 ? 280 : 330,
    }))

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const light = theme === 'light'

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      })

      if (!isMobile) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j]
            const dist = Math.hypot(a.x - b.x, a.y - b.y)
            if (dist < 130) {
              ctx.strokeStyle = `rgba(${light ? '108,99,255' : '180,130,255'},${(light ? 0.22 : 0.16) * (1 - dist / 130)})`
              ctx.lineWidth = 0.8
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          }
        }
      }

      particles.forEach(p => {
        ctx.fillStyle = `hsla(${p.hue},70%,65%,${light ? 0.45 : 0.6})`
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [theme])

  return <canvas ref={canvasRef} className="particle-canvas" />
}

// ── Animated terminal ──────────────────────────────────────────────────────────
function HeroTerminal() {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (shown >= TERMINAL_LINES.length) return
    const delay = TERMINAL_LINES[shown].type === 'empty' ? 100 : shown < 2 ? 550 : 240
    const t = setTimeout(() => setShown(s => s + 1), delay)
    return () => clearTimeout(t)
  }, [shown])

  const COLOR: Record<string, string> = {
    cmd: '#00bcd4', ok: '#4caf50', code: '#abb2bf',
    prop: '#e06c75', highlight: '#ff9800', git: '#c678dd', empty: 'transparent',
  }

  return (
    <div className="hero-terminal">
      <div className="term-header">
        <span className="tdot red" /><span className="tdot yellow" /><span className="tdot green" />
        <span className="term-title">bash — parul@portfolio</span>
      </div>
      <div className="term-body">
        {TERMINAL_LINES.slice(0, shown).map((line, i) => (
          <div key={i} className="term-line" style={{ color: COLOR[line.type] ?? '#abb2bf' }}>
            {line.text || ' '}
          </div>
        ))}
        {shown <= TERMINAL_LINES.length && <span className="term-cursor">▮</span>}
      </div>
    </div>
  )
}

// ── Typing hook ────────────────────────────────────────────────────────────────
function useTyping(words: string[], speed = 78, pause = 1900) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed)
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), pause)
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2)
    else { setDeleting(false); setWordIdx((wordIdx + 1) % words.length) }
    return () => clearTimeout(t)
  }, [displayed, deleting, wordIdx, words, speed, pause])

  return displayed
}

// ── Animated counter ───────────────────────────────────────────────────────────
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let n = 0
        const step = () => { n++; setCount(n); if (n < value) requestAnimationFrame(step) }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value])

  return <span ref={ref} className="stat-num">{count}{suffix}</span>
}

// ── Helix path ────────────────────────────────────────────────────────────────
const ITEM_H = 200
const SVG_H  = JOURNEY.length * ITEM_H  // 1000
const HX_CX  = 60
const HX_AMP = 46

const HELIX_PATH = (() => {
  let d = `M ${HX_CX} 0`
  for (let i = 0; i < JOURNEY.length; i++) {
    const y0 = i * ITEM_H, ym = y0 + ITEM_H / 2, y1 = (i + 1) * ITEM_H
    const px = HX_CX + (i % 2 === 0 ? -HX_AMP : HX_AMP)
    d += ` C ${HX_CX} ${y0 + 50},${px} ${ym - 10},${px} ${ym}`
    d += ` C ${px} ${ym + 10},${HX_CX} ${y1 - 50},${HX_CX} ${y1}`
  }
  return d
})()

// ── Reveal hook ────────────────────────────────────────────────────────────────
function useReveal(): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCompany, setActiveCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('ps_loaded'))
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(-1)
  const journeyRef = useRef<HTMLDivElement>(null)
  const journeyLineRef = useRef<SVGPathElement>(null)
  const typed = useTyping(ROLES)

  const [aboutRef, aboutVisible] = useReveal()
  const [statsRef, statsVisible] = useReveal()
  const [projRef, projVisible] = useReveal()
  const [skillRef, skillVisible] = useReveal()
  const [contactRef, contactVisible] = useReveal()

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  useEffect(() => {
    const fn = () => setNavScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map(id => document.getElementById(id.toLowerCase()))
    const fn = () => {
      const mid = window.scrollY + window.innerHeight * 0.4
      let cur = ''
      sections.forEach(s => { if (s && s.offsetTop <= mid) cur = s.id })
      setActiveSection(cur)
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const pathEl = journeyLineRef.current
    if (!pathEl) return
    const len = pathEl.getTotalLength()
    pathEl.style.strokeDasharray = `${len}`
    pathEl.style.strokeDashoffset = `${len}`

    const fn = () => {
      const wrap = journeyRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height))
      pathEl.style.strokeDashoffset = `${len * (1 - p)}`
      const step = 1 / JOURNEY.length
      setActiveJourneyIdx(Math.min(JOURNEY.length - 1, Math.floor(p / step) - 1 + (p > 0.05 ? 1 : 0)))
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('ps_loaded', '1')
    }, 2200)
    return () => clearTimeout(t)
  }, [loading])

  const scrollTo = (id: string) => {
    const target = id.toLowerCase() === 'experience' ? 'projects' : id.toLowerCase()
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }
  const year = new Date().getFullYear()

  return (
    <>
      {loading && (
        <div className="loader-overlay">
          <div className="loader-content">
            <div className="loader-logo">PS</div>
            <div className="loader-bar"><div className="loader-fill" /></div>
            <p className="loader-text">Crafting experience…</p>
          </div>
        </div>
      )}
      {activeCompany && (
        <div className="company-overlay">
          <CompanyPage company={activeCompany} onClose={() => setActiveCompany(null)} />
        </div>
      )}
      <div className="portfolio" style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.6s ease' }}>

        {/* ── Navbar ── */}
        <nav className={`navbar ${navScrolled ? 'scrolled' : ''}`}>
          <span className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-b">&lt;</span>PS<span className="logo-b">/&gt;</span>
          </span>
          <ul className="nav-links">
            {NAV_LINKS.map(l => (
              <li key={l}>
                <button className={`nav-btn ${activeSection === l.toLowerCase() ? 'active' : ''}`} onClick={() => scrollTo(l)}>{l}</button>
              </li>
            ))}
          </ul>
          <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* ── Hero ── */}
        <header className="hero-section" id="home">
          <div className="hero-bg" />
          <ParticleField theme={theme} />

          <div className="hero-layout">
            <div className="hero-text">
              <div className="hero-badge"><span className="badge-dot" />Open to opportunities</div>

              <h1 className="hero-name">
                <span className="name-light">Parul</span>
                <span className="name-bold">Sinha</span>
              </h1>

              <p className="hero-role">
                <span className="role-prefix">{'// '}</span>
                <span className="typed-text">{typed}</span>
                <span className="cursor">|</span>
              </p>

              <p className="hero-tagline">
                I turn Figma mockups into <em>pixel-perfect experiences</em>.
                <br className="hide-mobile" /> Angular by day, React by choice.
              </p>

              <div className="hero-mini-stats">
                <span><strong>4+</strong> yrs</span>
                <span className="divider">·</span>
                <span><strong>2</strong> companies</span>
                <span className="divider">·</span>
                <span><strong>10+</strong> shipped projects</span>
              </div>

              <div className="hero-ctas">
                <a href="mailto:2308parulsinha@gmail.com" className="btn-primary">✉ Hire Me</a>
                <a href="https://linkedin.com/in/psinhaa" target="_blank" rel="noreferrer" className="btn-outline">in LinkedIn</a>
                <a href="https://github.com/psinhaa" target="_blank" rel="noreferrer" className="btn-outline">⌥ GitHub</a>
              </div>

              <div className="scroll-hint">
                <span>Scroll to explore</span>
                <div className="bounce-arrow">↓</div>
              </div>
            </div>

            <div className="hero-right">
              <HeroTerminal />
            </div>
          </div>
        </header>

        {/* ── About ── */}
        <section id="about" className={`about-section reveal ${aboutVisible ? 'revealed' : ''}`} ref={aboutRef}>
          <div className="section-orbs" aria-hidden="true">
            <div className="orb" style={{ width: 500, height: 500, background: '#e91e8c', top: '-10%', left: '-5%', animation: 'orbFloat1 14s ease-in-out infinite' }} />
            <div className="orb" style={{ width: 400, height: 400, background: '#6c63ff', bottom: '0%', right: '-5%', animation: 'orbFloat2 18s ease-in-out infinite' }} />
          </div>
          <div className="about-inner">
            <div className="about-text">
              <h2 className="section-heading left-heading">About Me</h2>
              <p className="about-para">
                I'm a <strong>Software Engineer</strong> with 4+ years building modular, scalable frontends.
                My stack is Angular-first with React growing stronger every day. I care deeply about{' '}
                <em>pixel-perfect UI</em>, clean component architecture, and code that future-me won't hate.
              </p>
              <p className="about-para">
                Beyond code: I enjoy breaking down complex problems into simple interfaces —
                turning design mockups into living, breathing web experiences. Currently at{' '}
                <strong className="text-pink">Squint Metrics</strong>, Gurugram.
              </p>
              <div className="about-chips">
                {['Problem Solver', 'UI Enthusiast', 'Team Player', 'Fast Learner', 'Detail-Oriented'].map(c => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </div>
            <div className="code-block">
              <div className="code-header">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                <span className="code-filename">parul.config.ts</span>
              </div>
              <pre className="code-body"><code>{`const parul = {
  role: "Software Engineer",
  location: "Rajasthan, India",
  experience: "4+ years",

  stack: {
    primary:  ["Angular", "React"],
    backend:  ["Node.js", "Express"],
    database: ["MongoDB", "MySQL"],
    lang:     ["TypeScript", "JS"],
  },

  strengths: [
    "Pixel-perfect UI",
    "Component architecture",
    "Cross-team collaboration",
  ],

  available: true, // 🟢
}`}</code></pre>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className={`stats-section reveal ${statsVisible ? 'revealed' : ''}`} ref={statsRef}>
          <div className="section-orbs" aria-hidden="true">
            <div className="orb" style={{ width: 600, height: 600, background: '#00bcd4', top: '-30%', left: '30%', animation: 'orbFloat3 20s ease-in-out infinite' }} />
            <div className="orb" style={{ width: 300, height: 300, background: '#e91e8c', bottom: '-20%', right: '5%', animation: 'orbFloat1 16s ease-in-out infinite reverse' }} />
          </div>
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-card">
                <Counter value={s.value} suffix={s.suffix} />
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Journey ── */}
        <section id="journey" className="journey-section">
          <h2 className="section-heading">My Journey</h2>
          <p className="section-sub">From student to engineer — the road so far</p>

          <div className="helix-wrap" ref={journeyRef} style={{ '--helix-h': `${SVG_H}px` } as React.CSSProperties}>
            {/* Winding spine SVG */}
            <svg
              className="helix-spine-svg"
              viewBox={`0 0 120 ${SVG_H}`}
              width="120"
              height={SVG_H}
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hxGrad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={SVG_H}>
                  <stop offset="0%" stopColor="#6c63ff" />
                  <stop offset="50%" stopColor="#e91e8c" />
                  <stop offset="100%" stopColor="#00bcd4" />
                </linearGradient>
              </defs>
              {/* Faint background track */}
              <path d={HELIX_PATH} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Scroll-animated glowing fill */}
              <path
                ref={journeyLineRef}
                d={HELIX_PATH}
                fill="none"
                stroke="url(#hxGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Milestone dots at S-curve peaks */}
              {JOURNEY.map((m, i) => {
                const px = HX_CX + (i % 2 === 0 ? -HX_AMP : HX_AMP)
                const py = (i + 0.5) * ITEM_H
                const active = activeJourneyIdx >= i
                return (
                  <g key={i}>
                    <circle cx={px} cy={py} r="10"
                      fill={active ? m.color : 'var(--bg3)'}
                      stroke={m.color} strokeWidth="2.5"
                      style={{ transition: 'fill .4s, filter .4s', filter: active ? `drop-shadow(0 0 10px ${m.color}90)` : 'none' }}
                    />
                    <text x={px} y={py} textAnchor="middle" dominantBaseline="central"
                      fontSize="10" style={{ pointerEvents: 'none', userSelect: 'none' }}>{m.icon}</text>
                  </g>
                )
              })}
            </svg>

            {/* Milestone cards */}
            {JOURNEY.map((m, i) => {
              const isLeft = i % 2 === 0
              const active = activeJourneyIdx >= i
              return (
                <div
                  key={i}
                  className={`hx-card ${isLeft ? 'hx-left' : 'hx-right'} ${active ? 'hx-active' : ''}`}
                  style={{ '--hx-top': `${(i + 0.5) * ITEM_H}px`, '--hx-color': m.color } as React.CSSProperties}
                >
                  <div className="hx-top-bar" style={{ background: m.color }} />
                  <span className="hx-year">{m.year}</span>
                  <h3 className="hx-title">{m.title}</h3>
                  <p className="hx-sub">{m.subtitle}</p>
                  <p className="hx-detail">{m.detail}</p>
                  {m.projects.length > 0 && (
                    <div className="hx-projs">
                      {m.projects.map(p => (
                        <span key={p.name} className="hx-proj"
                          style={{ '--proj-color': m.color } as React.CSSProperties}
                          title={p.desc}
                        >{p.icon} {p.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="projects" className={`projects-section reveal ${projVisible ? 'revealed' : ''}`} ref={projRef}>
          <div className="section-orbs" aria-hidden="true">
            <div className="orb" style={{ width: 550, height: 550, background: '#6c63ff', top: '-15%', right: '-8%', animation: 'orbFloat2 17s ease-in-out infinite' }} />
            <div className="orb" style={{ width: 350, height: 350, background: '#ff9800', bottom: '-10%', left: '5%', animation: 'orbFloat3 22s ease-in-out infinite' }} />
          </div>
          <h2 className="section-heading">Experience</h2>
          <p className="section-sub">Companies I've worked at — click to explore projects</p>

          <div className="exp-cards">
            {COMPANIES.map(c => (
              <div key={c.id} className="exp-card" style={{ '--accent': c.color } as React.CSSProperties} onClick={() => setActiveCompany(c)}>
                <div className="exp-glow" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.accent})` }} />
                <div className="exp-top">
                  <div className="exp-logo" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.accent})` }}>{c.logo}</div>
                  <div>
                    <h3 className="exp-name">{c.name}</h3>
                    <p className="exp-role">{c.role}</p>
                    <p className="exp-period">{c.period} · {c.location}</p>
                  </div>
                </div>
                <div className="exp-proj-preview">
                  {c.projects.map(p => (
                    <span key={p.name} className="exp-proj-tag" style={{ '--chip-color': p.color } as React.CSSProperties}>
                      {p.emoji} {p.name}
                    </span>
                  ))}
                </div>
                <div className="exp-cta">View details &amp; projects →</div>
              </div>
            ))}
          </div>

          <h2 className="section-heading" style={{ marginTop: '4rem' }}>College Projects</h2>
          <p className="section-sub">Built during B.Tech at SKIT</p>
          <div className="projects-grid">
            {COLLEGE_PROJECTS.map(p => (
              <div key={p.name} className="project-card" style={{ '--accent': p.color } as React.CSSProperties}>
                <div className="project-glow" style={{ background: p.color }} />
                <div className="project-header">
                  <span className="project-emoji">{p.emoji}</span>
                  <div className="project-badges">
                    <span className="project-type-badge">College · Minor Project</span>
                  </div>
                </div>
                <h3 className="project-name">{p.name}</h3>
                <p className="project-tagline">{p.tagline}</p>
                <p className="project-desc">{p.description}</p>
                <div className="tech-chips">
                  {p.tech.map(t => <span key={t} className="tech-chip">{t}</span>)}
                </div>
                <a href={p.link} target="_blank" rel="noreferrer" className="proj-link">⌥ View on GitHub →</a>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills" className={`skills-section reveal ${skillVisible ? 'revealed' : ''}`} ref={skillRef}>
          <div className="section-orbs" aria-hidden="true">
            <div className="orb" style={{ width: 480, height: 480, background: '#4caf50', top: '-20%', left: '-5%', animation: 'orbFloat1 19s ease-in-out infinite' }} />
            <div className="orb" style={{ width: 400, height: 400, background: '#a855f7', bottom: '-15%', right: '10%', animation: 'orbFloat2 15s ease-in-out infinite reverse' }} />
          </div>
          <h2 className="section-heading">Technical Skills</h2>
          <p className="section-sub">Technologies I work with daily</p>
          <div className="skills-groups">
            {SKILL_GROUPS.map(g => (
              <div key={g.label} className="skill-group">
                <div className="sg-header">
                  <span className="sg-icon" style={{ color: g.color }}>{g.icon}</span>
                  <h4 className="sg-label">{g.label}</h4>
                </div>
                <div className="sg-chips">
                  {g.skills.map(s => (
                    <span key={s} className="sg-chip" style={{ '--chip-color': g.color } as React.CSSProperties}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact" className={`contact-section reveal ${contactVisible ? 'revealed' : ''}`} ref={contactRef}>
          <div className="section-orbs" aria-hidden="true">
            <div className="orb" style={{ width: 600, height: 600, background: '#e91e8c', top: '-25%', right: '-10%', animation: 'orbFloat3 18s ease-in-out infinite' }} />
            <div className="orb" style={{ width: 400, height: 400, background: '#6c63ff', bottom: '-20%', left: '0%', animation: 'orbFloat1 24s ease-in-out infinite reverse' }} />
            <div className="orb" style={{ width: 250, height: 250, background: '#00bcd4', top: '40%', left: '40%', animation: 'orbFloat2 12s ease-in-out infinite' }} />
          </div>
          <div className="contact-inner">
            <h2 className="section-heading">Let's Connect</h2>
            <p className="contact-sub">
              I'm currently open to new opportunities — feel free to reach out whether it's a role, or just a chat about tech.
            </p>
            <a href="mailto:2308parulsinha@gmail.com" className="btn-primary btn-lg">✉ Say Hello</a>
            <div className="contact-links">
              <a href="https://linkedin.com/in/psinhaa" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/psinhaa" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="tel:+919057542454">📞 Call Me ↗</a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>Designed &amp; built by <strong>Parul Sinha</strong> © {year}</p>
          <p className="footer-sub">Made with ❤ and too much coffee</p>
        </footer>
      </div>
    </>
  )
}
