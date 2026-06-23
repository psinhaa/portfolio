---
name: portfolio-dev
description: >
  Development guide for Parul Sinha's personal portfolio (React + TypeScript + Vite + pnpm,
  deployed on Vercel at https://portfolio-iota-nine-62.vercel.app/). Use this skill for ANY
  change to this portfolio — new sections, design tweaks, bug fixes, component additions,
  performance work, or content updates. It encodes every design decision, architecture rule,
  performance constraint, and "never do this" that was established while building the portfolio.
  Trigger whenever the user asks to add, change, or fix anything in this project.
---

# Portfolio Dev Guide — Parul Sinha

## Project at a glance

| Item | Value |
|------|-------|
| Stack | React 19 · TypeScript · Vite 8 · pnpm |
| Styling | Plain CSS (App.css) — no CSS-in-JS, no Tailwind |
| Deploy | Vercel, auto-deploy on push to `main` |
| Live URL | https://portfolio-iota-nine-62.vercel.app/ |
| Root | `/Users/parulsinha/Documents/My Project/portfolio` |

Build: `pnpm build` · Dev: `pnpm dev` (port 5173)

---

## File map

```
src/
  App.tsx          — entire portfolio: all section data arrays + all JSX
  App.css          — all styles (single file, no modules)
  data.ts          — Company/Project types, COMPANIES[], COLLEGE_PROJECTS[]
  CompanyPage.tsx  — company detail overlay (not a route — local state)
  CompanyPage.css  — overlay styles
  main.tsx         — createRoot only, NO router
  index.css        — base reset (minimal, rarely touched)
public/
  favicon.svg      — PS monogram, pink→purple gradient
vercel.json        — SPA rewrite rule (keep it, even without routing)
```

All section data (JOURNEY, ROLES, STATS, SKILL_GROUPS, TERMINAL_LINES) lives **inside App.tsx** — do not scatter data into separate files unless the user explicitly asks.

---

## Design system

### Color tokens (defined in `:root`)

```css
--pink:   #e91e8c   /* primary accent — CTAs, active states */
--purple: #6c63ff   /* secondary accent */
--cyan:   #00bcd4   /* tertiary */
--orange: #ff9800
--green:  #4caf50
--bg:     #0a0a16   /* dark bg */
--bg2:    #0f0f22
--bg3:    #141430
--card:   #161628
--text:   #eeeef8
--muted:  #7878a0
--border: rgba(255,255,255,0.07)
```

Light theme: `[data-theme="light"]` overrides `--bg`, `--card`, `--text`, `--muted`, `--border`.  
Theme toggled via `data-theme` attribute on `<html>`.

### Typography rules

- Body: `Segoe UI, system-ui, -apple-system, sans-serif`
- Code / year badges: `'Courier New', monospace`
- Year badges: `font-size: .6-.65rem; letter-spacing: 1.5px; text-transform: uppercase`
- Section headings: `.section-heading` class (gradient or solid, consistent size)
- Keep font sizes small and tight — this is a professional portfolio, not a poster

### Card design philosophy

Cards must look **professional and minimal**:
- Thin colored accent border on ONE edge only (left or right), not all four
- Subtle top bar (`height: 2px`) is acceptable as a secondary accent
- Background: `var(--card)` with `border: 1px solid var(--border)`
- `border-radius: 10-16px` (consistent within a section)
- No big emoji circles as dot/node indicators — keep icons small (≤11px in SVG, or as decorative text)
- No type-badge pills (work / education / now) — they look amateur
- No rainbow multi-colored top bars per card — use a single color per card, sourced from the milestone/company color

### Hover states

Cards: subtle `translateY(-3px)` + enhanced `box-shadow`. Never more than 4-6px lift.  
Buttons: `opacity .9` + `translateY(-2px)`.  
Never add `filter: blur()` on hover — causes repaints.

---

## Architecture rules

### No routing — ever

React Router was removed entirely because it caused slow remount-on-back-navigation.  
**Never add `react-router-dom`** back.

Detail pages (CompanyPage) open as a **full-screen fixed overlay** controlled by local state:

```tsx
const [activeCompany, setActiveCompany] = useState<Company | null>(null)

// Open
onClick={() => setActiveCompany(c)}

// Render
{activeCompany && (
  <div className="company-overlay">
    <CompanyPage company={activeCompany} onClose={() => setActiveCompany(null)} />
  </div>
)}
```

`company-overlay` is `position: fixed; inset: 0; z-index: 500; overflow-y: auto`.

### One-time loader

```tsx
const [loading, setLoading] = useState(() => !sessionStorage.getItem('ps_loaded'))
useEffect(() => {
  if (!loading) return
  const t = setTimeout(() => { setLoading(false); sessionStorage.setItem('ps_loaded', '1') }, 2200)
  return () => clearTimeout(t)
}, [loading])
```

Key: `ps_loaded`. Loader shows only on first page load per browser session.

### Scroll listeners

Always add with `{ passive: true }`. Clean up in `useEffect` return.

### Refs for animations

Use `useRef` on DOM/SVG elements for imperative scroll-driven animations (spine fill, counter start). Avoid state for things that animate on every scroll tick — use direct `.style` mutation instead.

---

## Journey / helix timeline

The journey section uses an **SVG S-curve helix** spine animated via `stroke-dashoffset` on scroll.

### Constants (in App.tsx, before the component)

```typescript
const ITEM_H = 200                    // px per milestone row
const SVG_H  = JOURNEY.length * ITEM_H
const HX_CX  = 60                     // SVG center x
const HX_AMP = 46                     // how far the curve bulges left/right

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
```

### Scroll animation (useEffect)

```typescript
const journeyLineRef = useRef<SVGPathElement>(null)

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
```

### Layout

- `.helix-wrap`: `position: relative; height: var(--helix-h); max-width: 920px; margin: 0 auto`
- SVG: `position: absolute; left: 50%; transform: translateX(-50%); overflow: visible`
- Cards: `position: absolute; top: var(--hx-top); transform: translateY(-50%)`
  - Left cards (even index): `right: calc(50% + 68px)` · `border-right: 2px solid`
  - Right cards (odd index): `left: calc(50% + 68px)` · `border-left: 2px solid`
- Dots in SVG: `<circle r="10">` at each S-curve peak, colored/glowing when active

### Mobile collapse

Hide the SVG, show a straight gradient line via `::before`, cards go `position: relative` and stack in normal flow with a colored `::before` dot connector.

---

## Performance rules (mobile)

These exist because mobile was freezing. **Do not revert them.**

| What | Rule |
|------|------|
| `filter: blur()` on orbs | `none !important` on mobile via `@media (max-width: 640px)` |
| Canvas particle count | Max 20 on mobile (`isMobile` check inside `ParticleField`) |
| Canvas line drawing | Skip O(n²) loop on mobile — dots only |
| Canvas itself | `display: none` via CSS on mobile (`.particle-canvas`) |
| SVG filter effects | Never use `<feGaussianBlur>` — causes GPU perf issues even on desktop |

`isMobile` is a **local variable inside `ParticleField`**, not a state — recalculated on mount.

---

## Things to never do

- **Inline phone number in UI** — use `<a href="tel:+91...">📞 Call Me</a>` to hide the digits
- **React Router / `useHistory` / `useParams`** — these don't exist cleanly in v7 and we removed routing
- **`filter: blur()` on section orbs on mobile** — GPU freeze
- **Big emoji as primary node indicators** — small (≤12px) is fine as decoration
- **Type-badge pills** (work / education / now) on journey cards
- **Comments explaining WHAT code does** — only add a comment when the WHY is non-obvious
- **Scope creep** — don't add features, error handling, or abstractions beyond what's asked
- **Multi-file data scattering** — keep JOURNEY, STATS, etc. in App.tsx unless user asks otherwise

---

## JOURNEY data shape

```typescript
const JOURNEY = [
  {
    year: 'Aug 2017 – Jul 2021',
    type: 'education',
    title: 'B.Tech — Electronics & Communication',
    subtitle: 'SKIT, Jaipur · RTU',
    detail: '85.60% · Swami Keshvanand Institute of Technology.',
    icon: '🎓',
    color: '#6c63ff',
    projects: [
      { icon: '🛒', name: 'Kart', desc: 'Full-stack e-commerce' },
      { icon: '📰', name: 'Board', desc: 'Flipboard news feed' },
    ],
  },
  // ... (chronological: education → InTimeTec → Squint Metrics → current → future)
]
```

5 milestones total. Chronological order: college first, then work experience, then current/future.

---

## Useful hooks / utilities already in codebase

| Name | Purpose |
|------|---------|
| `useReveal()` | IntersectionObserver scroll reveal → returns `[ref, visible]` |
| `useTyping(words, speed, pause)` | Typewriter effect for hero role text |
| `Counter({ value, suffix })` | Animated number counter, starts on viewport entry |
| `ParticleField({ theme })` | Canvas particle network (hero only) |
| `HeroTerminal()` | Typewriter terminal animation in hero |

---

## Commit convention

One commit per logical change. Message format:
```
<verb> <what changed>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push to `main` — Vercel auto-deploys.
