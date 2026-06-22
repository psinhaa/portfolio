import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { COMPANIES } from './data'
import './CompanyPage.css'

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = COMPANIES.find(c => c.id === id);

  useEffect(() => { window.scrollTo(0, 0) }, [])

  if (!company) {
    return (
      <div className="cp-not-found">
        <h2>Company not found</h2>
        <button onClick={() => navigate('/')}>← Back</button>
      </div>
    )
  }

  return (
    <div className="cp-root" style={{ '--cp-color': company.color, '--cp-accent': company.accent } as React.CSSProperties}>

      {/* Ambient orbs */}
      <div className="cp-orbs" aria-hidden="true">
        <div className="cp-orb cp-orb1" style={{ background: company.color }} />
        <div className="cp-orb cp-orb2" style={{ background: company.accent }} />
      </div>

      {/* Back button */}
      <button className="cp-back" onClick={() => navigate(-1)}>
        ← Back to Portfolio
      </button>

      {/* Hero */}
      <header className="cp-hero">
        <div className="cp-logo">{company.logo}</div>
        <div className="cp-hero-text">
          <span className="cp-period">{company.period} · {company.location}</span>
          <h1 className="cp-company-name">{company.name}</h1>
          <p className="cp-role">{company.role}</p>
        </div>
      </header>

      <div className="cp-body">

        {/* Overview */}
        <section className="cp-section">
          <h2 className="cp-section-title">About the Company</h2>
          <p className="cp-overview">{company.overview}</p>
        </section>

        {/* Responsibilities */}
        <section className="cp-section">
          <h2 className="cp-section-title">What I Did</h2>
          <ul className="cp-resp-list">
            {company.responsibilities.map((r, i) => (
              <li key={i} className="cp-resp-item">
                <span className="cp-resp-dot" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section className="cp-section">
          <h2 className="cp-section-title">Projects I Worked On</h2>
          <div className="cp-projects">
            {company.projects.map(p => (
              <div key={p.name} className="cp-project-card" style={{ '--proj-color': p.color } as React.CSSProperties}>
                <div className="cp-proj-bar" style={{ background: p.color }} />
                <div className="cp-proj-header">
                  <span className="cp-proj-emoji">{p.emoji}</span>
                  <div>
                    <h3 className="cp-proj-name">{p.name}</h3>
                    <p className="cp-proj-tagline">{p.tagline}</p>
                  </div>
                  {p.badge && <span className="cp-proj-badge">{p.badge}</span>}
                </div>
                <p className="cp-proj-desc">{p.description}</p>
                <div className="cp-tech-chips">
                  {p.tech.map(t => <span key={t} className="cp-tech-chip" style={{ '--chip-color': p.color } as React.CSSProperties}>{t}</span>)}
                </div>
                {/* <a href={p.link} target="_blank" rel="noreferrer" className="cp-proj-link" style={{ color: p.color }}>
                  {p.badge ? '🌐 Visit Website →' : '⌥ View on GitHub →'}
                </a> */}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
