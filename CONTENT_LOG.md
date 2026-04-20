# Rodney.AI — Content Log

Tracks all changes, additions, and decisions made to the site across sessions.

---

## 2026-04-19 — Session 2: Polish, UX & Spacing

### Changes Made
1. **Email replacement** — Replaced `rodneyjerry@yahoo.com` with `advisor@rodney-ai.com` across all 11 instances (resource cards, CTAs, contact section, footer)
2. **Text contrast improvement** — Bumped CSS variables `--text-dim` (#BFD4E8 → #D4E3F2) and `--text-muted` (#8aa0b8 → #9db5cd) for readability on dark background
3. **Section navigator (v1)** — Added right-side sticky dot navigator with 10 sections, hover labels, gold active state
4. **Section navigator (v2)** — Replaced dot navigator with bottom section bar (dots overlapped content). Thin frosted-glass strip at bottom edge, section names as text links, gold underline on active, slides up after hero scroll, hidden on mobile
5. **Nav button sizing** — Scoped `.nav-links .btn` to `padding:8px 18px; font-size:12.5px; border-radius:5px` so "Book a consultation" is proportional to nav text
6. **Hero spacing reduction (round 1)** — Hero padding-top 84px → 36px, hero-title margin 24px → 16px, hero-grid gap 48px → 32px, SGU margin tightened, hero-cta margin 48px → 24px
7. **Hero scroll-reveal fix** — Removed `.hero-grid` from IntersectionObserver selector so hero content renders immediately on load (was showing blank page)
8. **Hero spacing reduction (round 2)** — Hero padding-top 36px → 20px, nav-inner padding 18px → 10px, brand-mark 62×62 → 50×50, wordmark 26px → 22px, hero-sub 15px → 14px, impact-stats padding 18px → 12px, hero-cta margin 24px → 16px, hero-hooks margin 24px → 14px, hook padding 12px 18px → 9px 16px
9. **Hero hook reorder** — New order: (1) A Trillion for Saudi Banks, (2) The KPIs we move, (3) Why Rodney.AI, (4) Three ways to start

### Design Decisions
- **Dark theme confirmed** — Appropriate for Saudi FS executive audience; white background rejected
- **Bottom bar over dot nav** — Right-side dots overlapped page content, looked unprofessional
- **Hero visible on load** — Exempting hero from scroll-reveal is critical; blank first screen is unacceptable

### Known Issues
- Scroll-reveal animations cause blank sections on fast scroll or nav jumps (non-hero sections)
- Arabic toggle (عربي) completeness not verified
- Counter animation numbers briefly show wrong values before animating to correct ones

---

## 2026-04-12 — Session 1: Initial Build

### What Was Built
- Full single-page site (`index-staging.html`, ~4700 lines)
- SCALE · GOVERN · UNLOCK brand system applied end-to-end
- 7 services section, About, Why Us, Scoreboard (Part 1 embedded in full), How I Work (6-step journey), Evidence, Case Studies, Resources, Contact, FAQ
- 10 interactive accelerator tools (separate HTML pages)
- Hero with impact stats, 4 hooks, Rodney's photo
- Marquee with client logos
- Arabic language toggle (partial)
- Responsive design with mobile drawer nav
- Brand kit assets (wordmarks, avatar, LinkedIn banner, carousel)
- GitHub Pages hosting with CNAME

---

## Upcoming — Session 3 (2026-04-20)

### Planned Topics
- **Admin & maintainability** — How to keep the site updated without manual HTML editing
- **Writing & news articles** — Content pipeline for blog posts, thought leadership, news
- **CMS / content management** options for a single-page site
- **Other features** to simplify ongoing maintenance
