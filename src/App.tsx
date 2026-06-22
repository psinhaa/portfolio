import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'
import { COMPANIES, COLLEGE_PROJECTS } from './data'

// ── Journey SVG constants (shorter + more curvy) ───────────────────────────────
const VW = 1000
const VH = 1520
const DOTS = [
  { x: 180, y: 100 },
  { x: 820, y: 300 },
  { x: 180, y: 500 },
  { x: 820, y: 700 },
  { x: 180, y: 900 },
  { x: 820, y: 1100 },
  { x: 180, y: 1300 },
  { x: 500, y: 1450 },
]


// Organic path — each segment has unique control points for a winding-road feel
const SEGMENT_CP: [number, number, number, number][] = [
  [920,  60,   80,  330],
  [ 50, 270,  950,  530],
  [900, 460,  100,  740],
  [ 30, 660,  970,  950],
  [880, 860,  120, 1140],
  [ 60,1060,  940, 1340],
  [240,1420,  760, 1330],
]
const PATH_D = (() => {
  let d = `M ${DOTS[0].x} ${DOTS[0].y}`
  DOTS.slice(1).forEach((curr, i) => {
    const [cp1x, cp1y, cp2x, cp2y] = SEGMENT_CP[i]
    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${curr.x} ${curr.y}`
  })
  return d
})()
// ── Static data ────────────────────────────────────────────────────────────────
const ROLES = ['Software Engineer', 'Angular Developer', 'Full Stack Developer', 'React Developer', 'UI Craftsperson', 'Node.JS Developer', 'AI Enuthusiastic', 'Ionic Developer']

const STATS = [
  { value: 3, suffix: '+', label: 'Years Experience' },
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
  { text: '  exp:      "3+ years"', type: 'prop' },
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
  { year: 'Mar 2023–Present', type: 'now',       title: 'Software Engineer',       subtitle: 'Squint Metrics · Gurugram/Remote', detail: 'Pixel-perfect UIs with Angular, Ionic & React. Close collaboration with UX/UI designers.', icon: '🚀', color: '#e91e8c' },
  { year: '2023',             type: 'project',    title: 'Project — NeuroSum',      subtitle: 'Healthcare Tracker',              detail: 'Track health, performance & symptoms with Angular.', icon: '🧠', color: '#00bcd4' },
  { year: '2022',             type: 'project',    title: 'Project — Kart',          subtitle: 'E-Commerce App',                  detail: 'REST APIs, auth, cart & checkout with MongoDB.', icon: '🛒', color: '#00bcd4' },
  { year: '2022',             type: 'project',    title: 'Project — Board',         subtitle: 'News Feed Website',               detail: 'Bootstrap + JS + Flipboard RSS API integration.', icon: '📰', color: '#00bcd4' },
  { year: 'Mar 2021–Mar 2023',type: 'work',       title: 'Junior Software Engineer',subtitle: 'In Time Tec · Jaipur',            detail: 'Enhanced end-user application subsystems; assisted debugging.', icon: '💼', color: '#ff9800' },
  { year: 'Jul 2021',         type: 'education',  title: 'Graduated B.Tech',        subtitle: 'Rajasthan Technical University',  detail: '85.60% — Electronics & Communication.', icon: '🏆', color: '#6c63ff' },
  { year: 'Aug 2017',         type: 'education',  title: 'Started B.Tech',          subtitle: 'RTU · Jaipur',                   detail: 'Electronics & Communication Engineering.', icon: '🎓', color: '#6c63ff' },
  { year: '✦ Origin',         type: 'start',      title: 'The Beginning',           subtitle: 'Rajasthan, India',               detail: 'Every great journey starts with a single step.', icon: '🌱', color: '#4caf50' },
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
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1
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

// ── Runner ─────────────────────────────────────────────────────────────────────
function RunnerShape() {
  return (
    <>
      <circle r="32" fill="rgba(233,30,140,0.1)" />
      <circle cy="-24" r="9" fill="#f4c2a1" />
      <ellipse cy="-31" rx="9" ry="5" fill="#2c1a0e" />
      <rect x="-7" y="-15" width="14" height="14" rx="4" fill="#e91e8c" />
      <line x1="-7" y1="-12" x2="-14" y2="-4" stroke="#f4c2a1" strokeWidth="3" strokeLinecap="round" />
      <line x1="7"  y1="-12" x2="14"  y2="-4" stroke="#f4c2a1" strokeWidth="3" strokeLinecap="round" />
      <line x1="-3" y1="-1"  x2="-7"  y2="11" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="3"  y1="-1"  x2="7"   y2="11" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round" />
    </>
  )
}

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
  const navigate = useNavigate()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [navScrolled, setNavScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [progress, setProgress] = useState(0)
  const [runnerPos, setRunnerPos] = useState({ x: DOTS[0].x, y: DOTS[0].y, angle: 90 })
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(-1)
  const [mileFracs, setMileFracs] = useState<number[]>([])

  const journeyRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)
  const typed = useTyping(ROLES)

  const [aboutRef, aboutVisible]     = useReveal()
  const [statsRef, statsVisible]     = useReveal()
  const [projRef, projVisible]       = useReveal()
  const [skillRef, skillVisible]     = useReveal()
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
    const path = svgPathRef.current; if (!path) return
    const total = path.getTotalLength()
    const fracs = DOTS.map(dot => {
      let best = 0, bestDist = Infinity
      for (let s = 0; s <= 3000; s++) {
        const f = s / 3000
        const pt = path.getPointAtLength(f * total)
        const d = Math.hypot(pt.x - dot.x, pt.y - dot.y)
        if (d < bestDist) { bestDist = d; best = f }
      }
      return best
    })
    setMileFracs(fracs)
  }, [])

  useEffect(() => {
    const fn = () => {
      const journey = journeyRef.current, path = svgPathRef.current
      if (!journey || !path) return
      const rect = journey.getBoundingClientRect()
      // 0 when top of wrap enters viewport, 1 when bottom leaves viewport
      const raw = (window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.2)
      const p = Math.max(0, Math.min(1, raw))
      setProgress(p)
      const total = path.getTotalLength(), len = p * total
      const pt = path.getPointAtLength(len)
      const pt2 = path.getPointAtLength(Math.min(len + 12, total))
      setRunnerPos({ x: pt.x, y: pt.y, angle: Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI })
      if (mileFracs.length) setActiveJourneyIdx(Math.max(-1, mileFracs.filter(f => p >= f - 0.01).length - 1))
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [mileFracs])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  const scrollTo = (id: string) => {
    const target = id.toLowerCase() === 'experience' ? 'projects' : id.toLowerCase()
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }
  const year = new Date().getFullYear()

  return (
    <>
    {loading && (
      <div className={`loader-overlay ${!loading ? 'loader-hide' : ''}`}>
        <div className="loader-content">
          <div className="loader-logo">PS</div>
          <div className="loader-bar"><div className="loader-fill" /></div>
          <p className="loader-text">Crafting experience…</p>
        </div>
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
              <span><strong>3+</strong> yrs</span>
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
          <div className="orb" style={{ width:500,height:500,background:'#e91e8c',top:'-10%',left:'-5%',animation:'orbFloat1 14s ease-in-out infinite' }} />
          <div className="orb" style={{ width:400,height:400,background:'#6c63ff',bottom:'0%',right:'-5%',animation:'orbFloat2 18s ease-in-out infinite' }} />
        </div>
        <div className="about-inner">
          <div className="about-text">
            <h2 className="section-heading left-heading">About Me</h2>
            <p className="about-para">
              I'm a <strong>Software Engineer</strong> with 3+ years building modular, scalable frontends.
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
  experience: "3+ years",

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
          <div className="orb" style={{ width:600,height:600,background:'#00bcd4',top:'-30%',left:'30%',animation:'orbFloat3 20s ease-in-out infinite' }} />
          <div className="orb" style={{ width:300,height:300,background:'#e91e8c',bottom:'-20%',right:'5%',animation:'orbFloat1 16s ease-in-out infinite reverse' }} />
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

        <div className="journey-wrap" ref={journeyRef}>
          <svg className="journey-svg" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e91e8c" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6c63ff" />
              </linearGradient>
              <filter id="glowWide" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="18" result="blur" />
                <feMerge><feMergeNode in="blur" /></feMerge>
              </filter>
              <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="7" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glowDot" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Wide soft halo behind active path */}
            {/* Outer halo — grows brighter and wider as progress increases */}
            <path d={PATH_D} fill="none" stroke="url(#pathGrad)" strokeWidth={24 + progress * 24} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={`${1 - progress}`} filter="url(#glowWide)" opacity={0.18 + progress * 0.42} />
            <path d={PATH_D} fill="none" className="track-bg" strokeWidth="8" strokeLinecap="round" />
            <path ref={svgPathRef} d={PATH_D} fill="none" stroke="url(#pathGrad)" strokeWidth={6 + progress * 4} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={`${1 - progress}`} filter="url(#glow)" className="active-path" />
            {/* Moving light dot just ahead of runner */}
            <path d={PATH_D} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="0.04 0.96" strokeDashoffset={`${1 - Math.max(0, progress - 0.03)}`} opacity="0.85" />
            {DOTS.map((dot, i) => {
              const m = JOURNEY[i], active = activeJourneyIdx >= i
              return (
                <g key={i}>
                  {active && !isMobile && (
                    <>
                      <circle cx={dot.x} cy={dot.y} r="38" fill="none" stroke={m.color} strokeWidth="2" opacity="0.6">
                        <animate attributeName="r" values="38;60;38" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={dot.x} cy={dot.y} r="38" fill="none" stroke={m.color} strokeWidth="2" opacity="0.4">
                        <animate attributeName="r" values="38;60;38" dur="2s" begin="0.7s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" begin="0.7s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  <circle cx={dot.x} cy={dot.y} r={active ? 32 : 22} fill={m.color} opacity={active ? 1 : 0.2} filter={active ? 'url(#glowDot)' : undefined} style={{ transition: 'r .4s, opacity .4s' }} />
                  <text x={dot.x} y={dot.y + 10} textAnchor="middle" fontSize="26" style={{ userSelect: 'none' }}>{m.icon}</text>
                </g>
              )
            })}
            <g transform={`translate(${runnerPos.x},${runnerPos.y}) rotate(${runnerPos.angle - 90})`} filter="url(#glow)">
              <RunnerShape />
            </g>
          </svg>

          {DOTS.map((dot, i) => {
            const m = JOURNEY[i], active = activeJourneyIdx >= i, onLeft = dot.x < VW / 2
            return (
              <div key={i} className={`mile-card ${onLeft ? 'card-right' : 'card-left'} ${active ? 'active' : ''}`} style={{ left: `${(dot.x / VW) * 100}%`, top: `${(dot.y / VH) * 100}%`, borderColor: m.color }}>
                <span className="mile-year" style={{ color: m.color }}>{m.year}</span>
                <h3 className="mile-title">{m.title}</h3>
                <p className="mile-sub">{m.subtitle}</p>
                <p className="mile-detail">{m.detail}</p>
                <span className={`mile-tag tag-${m.type}`}>{m.type}</span>
              </div>
            )
          })}
        </div>

        <div className="mobile-timeline">
          {JOURNEY.map((m, i) => (
            <div key={i} className="mob-item">
              <div className="mob-dot" style={{ background: m.color }}><span>{m.icon}</span></div>
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

      {/* ── Experience ── */}
      <section id="projects" className={`projects-section reveal ${projVisible ? 'revealed' : ''}`} ref={projRef}>
        <div className="section-orbs" aria-hidden="true">
          <div className="orb" style={{ width:550,height:550,background:'#6c63ff',top:'-15%',right:'-8%',animation:'orbFloat2 17s ease-in-out infinite' }} />
          <div className="orb" style={{ width:350,height:350,background:'#ff9800',bottom:'-10%',left:'5%',animation:'orbFloat3 22s ease-in-out infinite' }} />
        </div>
        <h2 className="section-heading">Experience</h2>
        <p className="section-sub">Companies I've worked at — click to explore projects</p>

        <div className="exp-cards">
          {COMPANIES.map(c => (
            <div key={c.id} className="exp-card" style={{ '--accent': c.color } as React.CSSProperties} onClick={() => navigate(`/company/${c.id}`)}>
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
          <div className="orb" style={{ width:480,height:480,background:'#4caf50',top:'-20%',left:'-5%',animation:'orbFloat1 19s ease-in-out infinite' }} />
          <div className="orb" style={{ width:400,height:400,background:'#a855f7',bottom:'-15%',right:'10%',animation:'orbFloat2 15s ease-in-out infinite reverse' }} />
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
          <div className="orb" style={{ width:600,height:600,background:'#e91e8c',top:'-25%',right:'-10%',animation:'orbFloat3 18s ease-in-out infinite' }} />
          <div className="orb" style={{ width:400,height:400,background:'#6c63ff',bottom:'-20%',left:'0%',animation:'orbFloat1 24s ease-in-out infinite reverse' }} />
          <div className="orb" style={{ width:250,height:250,background:'#00bcd4',top:'40%',left:'40%',animation:'orbFloat2 12s ease-in-out infinite' }} />
        </div>
        <div className="contact-inner">
          <h2 className="section-heading">Let's Connect</h2>
          <p className="contact-sub">
            I'm currently open to new opportunities — feel free to reach out whether it's a role,
            a freelance project, or just a chat about tech.
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
