# Rodney.AI — Project Notes

**Last updated:** 12 April 2026
**Current build:** `index.html` (≈2,180 lines, 85 KB, single-file HTML)
**Backup zip:** `rodney-ai-site-2026-04-12.zip`

---

## Objective

Build a state-of-the-art AI consultancy website that is underpinned by two things in
equal measure:

1. **Rodney's personal experience and expertise** — drawn from real CVs, real clients,
   real numbers, the Vision 2030 Bank Scoreboard series, Zora AI™, Tadawul, CMA KSA.
2. **Industry benchmarks** — peer comparisons (DBS, JPM, UBS), regulatory frameworks
   (SR 11-7, SS1/23, NIST AI RMF, EU AI Act, Basel IV), sovereign AI programmes
   (HUMAIN, PIF, Vision 2030).

Positioning: **Executive Advisor on AI** for banks, capital markets, regulators and
sovereign institutions. Pan-industry framing, content focused on Financial Services
and the Middle East first.

---

## Brand system (SCALE · GOVERN · UNLOCK)

- **Master brand:** Rodney.AI
- **Three-word promise:** SCALE / GOVERN / UNLOCK (white box, gold border)
- **Wordmark:** RODNEY.AI
- **Advisor line:** Rodney Coutinho // Executive Advisor on AI // Banking, Capital
  Markets & Sovereign Institutions // Middle East

**Palette:**
`NAVY #0D1B2A` · `ACCENT #1B4F72` · `BLUE #2874A6` · `SOFT #BFD4E8` · `LIGHT #F2F6FA`
· `GOLD #C9A227` · `WHITE #FFFFFF`

**Typography:** Space Grotesk (headlines) · Inter (body) · Fraunces (pull quotes)

Brand PNGs in `assets/brand/` — wordmarks (light/dark), LinkedIn banner, avatar,
carousel masthead, closing card, Part 1 hero.

---

## Current site structure

1. **Top strip** — advisor line + live series flag
2. **Nav** — brand mark + wordmark + primary links
3. **Hero** — "Turning AI ambition into P&L, ROE and market cap" + SCALE/GOVERN/UNLOCK
   inline + 4 impact stats (25+ yrs, $500M+, $295B, 10×)
4. **Clients marquee** — Tadawul, CMA KSA, FAB, SAMA, RAKBANK, ENBD, HSBC, LBG,
   Fidelity, UBS, RBS, HUMAIN, NVIDIA
5. **SCALE · GOVERN · UNLOCK** — three-card framework section
6. **About** — Deloitte profile voice + 4 pillars
7. **Featured article** — full $295B Scoreboard Part 1 (prize panel + 4 fee pools +
   full levers scoreboard table Low/Base/High)
8. **Series roadmap** — all 5 parts of the Vision 2030 series (Part 1 live, 2–5 queued)
9. **Services** — 6 cards (Board AI Strategy, Governance Uplift, Enterprise Platform,
   Capital Markets AI, Regulator Advisory, Sovereign Advisory)
10. **Case notes** — 4 programmes (Tadawul, CMA KSA, LBG/HSBC, Fidelity)
11. **Writing · LinkedIn** — the 3 real March 2026 articles + 3 supporting cards
    + LinkedIn footer strip with follower count
12. **Capabilities** — dual Business + Technology stacks
13. **Accelerators** — 6 interactive HTML tools
14. **Speaking** — LEAP, GITEX, Money20/20, Gov AI Summit
15. **Credentials strip** — Deloitte, languages, education, certs, awards, geography
16. **Contact** — email, LinkedIn, phone + CTA
17. **Footer** — 4-column with SCALE · GOVERN · UNLOCK lockup

---

## Open threads for tomorrow

**Content gaps to close**
- [ ] Full article bodies for the 3 March 2026 LinkedIn pieces (currently
      interpretive summaries — the LinkedIn article bodies are behind login and
      couldn't be pulled through WebFetch). Rodney can paste them into this folder
      for a next pass.
- [ ] Parts 2–5 of the Vision 2030 Bank Scoreboard (queued; not yet drafted)
- [ ] The two `.docx` CVs that failed to parse (Accenture, RAKBANK — actually
      old `.doc` format) need re-saving as true `.docx`
- [ ] Older LinkedIn posts (before March 2026) — not yet pulled in

**Industry benchmark layer to strengthen**
- [ ] Deeper peer comparison charts — ROE distribution across DBS / JPM / UBS / GCC
- [ ] Regulatory framework matrix — SR 11-7 × SS1/23 × NIST × EU AI Act × NDMO × PDPL
- [ ] HUMAIN / PIF / Vision 2030 narrative as a dedicated section (currently inside
      the Scoreboard article)
- [ ] Market infrastructure angle (CCP, CSD, tokenization) could be its own section

**Possible new sections**
- [ ] **Research lab / Insights data** — original peer benchmark dataset, downloadable
- [ ] **Press & media mentions** — Deloitte publications, conference appearances
- [ ] **Book a consultation form** — currently a mailto link; could become a typeform/
      native form for lead capture
- [ ] **Newsletter signup** — "The Scoreboard" as a serialised newsletter
- [ ] **Downloads** — the open Excel model from the Scoreboard archive

**Hero image fix (in progress)**
- [ ] The original `rodney-hero.jpg` is 1280×853 landscape (a composite: portrait
      + text bubble + ROE chart). Displayed in a 4/5 portrait container with
      `object-fit:cover`, so ~23% gets cropped each side — head and chart lost.
- Three cleaned-up variants have been generated:
  1. `rodney-hero-cropped.jpg` (1260×558, landscape) — text banner removed,
     keeps Rodney + ROE Density chart. **Recommended pick.**
  2. `rodney-portrait.jpg` (420×558, portrait) — tight crop of Rodney only,
     no text, no chart. Clean but loses the ROE visual.
  3. `rodney-hero-full.jpg` (1280×853) — original kept for reference.
- [ ] Update `.hero-visual` CSS aspect-ratio + `object-fit` to match the chosen
      image. The recommended change for `rodney-hero-cropped.jpg`:
      - `aspect-ratio: 16/7;` (matches 2.26 ratio)
      - `object-fit: cover; object-position: center;`
      - Lighten or remove bottom gradient overlay
- [ ] Alternatively: Rodney can upload a professional headshot — would let us
      keep the tall 4/5 portrait container and get a cleaner look.

**Engineering / polish**
- [ ] Convert single HTML file into a tidier multi-file structure if it outgrows ~120 KB
- [ ] Add an `og:image` rendered from the Part 1 hero so link previews look right
- [ ] Test on mobile (breakpoints at 1100px and 720px already in place)
- [ ] Consider lightweight analytics (privacy-friendly — Plausible / self-hosted)

---

## File inventory

```
rodney-ai/
├── index.html                          # main single-file site
├── PROJECT_NOTES.md                    # this file
├── accelerators/
│   ├── _shared.css
│   ├── ai-governance-framework.html
│   ├── ai-risk-taxonomy.html
│   ├── eu-ai-act-tracker.html
│   ├── fs-ai-maturity-assessment.html
│   ├── genai-prioritization-matrix.html
│   └── mrm-checklist.html
└── assets/
    ├── rodney-hero.jpg                 # original LinkedIn Part 1 hero (1280×853)
    ├── rodney-hero.jpeg                # same, legacy extension
    ├── rodney-hero-full.jpg            # copy of original, kept for reference
    ├── rodney-hero-cropped.jpg         # text banner removed (1260×558) ← RECOMMENDED
    ├── rodney-portrait.jpg             # tight portrait only (420×558)
    ├── rodney-portrait-chart.jpg       # portrait + chart (earlier variant)
    └── brand/
        ├── 01_wordmark_light.png
        ├── 02_wordmark_dark.png
        ├── 03_linkedin_banner.png
        ├── 04_avatar_square.png
        ├── 05_carousel_masthead.png
        ├── 06_closing_card.png
        └── 07_hero_part1.png
```

---

## Source material (outside `rodney-ai/`)

- `../../CV/` — full CV library (Deloitte, Cisco, Accenture, Tadawul, RAKBANK, etc.)
- `../../CV/Rodney.AI - Vision 2030 Bank Scoreboard Archive/` — brand kit master,
  Part 1 published docs, source Excel model, generator scripts
- `../../CV/Part 1 - Ready to Post/` — LinkedIn caption + pinned comment
- `../../CV/Personal AI Brand - Name and Visual Kit.md` — original brand shortlist
