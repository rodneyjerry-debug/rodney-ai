# Banking 2030 Scoreboard — 5-Part LinkedIn Series

**Author:** Rodney Coutinho · Enterprise.AI
**Format:** LinkedIn document carousel (PDF upload)
**Brand:** RODNEY.AI masthead + closing card

---

## Series Overview

| Part | Lever | Title | Status | LinkedIn URL |
|------|-------|-------|--------|-------------|
| 1 | L1 · Monetization | The $295B Saudi bank market cap unlock | LIVE | [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7448958079272054784/) |
| 2 | L2 · Tokenization | Which Saudi bank puts the first sukuk on-chain? | LIVE | [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7451215346319028224/) |
| 3 | L3 · Capital Efficiency | Every basis point of RWA density is a board decision now | LIVE | [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7456026322725711873/) |
| 4 | L4 · Sovereign Ecosystem | PIF, HUMAIN, and the demand side of AI | QUEUED | Scheduled: Tuesday 6 May 2026 |
| 5 | The Scoreboard | All four levers, three scenarios, one number for the board | QUEUED | TBD |

---

## Scoreboard Model (SAR B / year)

| Lever | Low | Base | High |
|-------|-----|------|------|
| L1 · Monetization | 15.9 | 29.5 | 38.6 |
| L2 · Tokenization | 0.5 | 2.7 | 11.9 |
| L3 · Capital Efficiency | 0.5 | 2.5 | 5.3 |
| L4 · Sovereign Ecosystem | 2.7 | 7.1 | 13.7 |
| Less: L1/L4 overlap | (0.3) | (1.1) | (2.7) |
| **TOTAL** | **19.2** | **40.8** | **66.8** |
| 2030 Sector ROE | 21% | 25% | 30% |
| Market cap unlock | $212B | $295B | $392B |

---

## Folder Structure

```
series/
├── SERIES_README.md              ← this file
├── _brand-assets/                ← shared hero photos, masthead, closing card, wordmarks
├── _scripts/                     ← all generator scripts (Python charts, Node.js docx)
├── part-1-monetization/
│   ├── posting-kit/              ← caption, pinned comment, posting guide
│   └── (carousel PDF/DOCX)
├── part-2-tokenization/
│   ├── posting-kit/
│   └── (carousel PDF/DOCX)
├── part-3-capital-efficiency/
│   ├── charts/                   ← dashboard PNGs + hero banner
│   ├── posting-kit/              ← caption, pinned comment, posting guide
│   ├── part3-capital-efficiency-draft.md
│   ├── Rodney Coutinho - Vision 2030 Bank Scoreboard Part 3.docx
│   └── Rodney Coutinho - Vision 2030 Bank Scoreboard Part 3.pdf
├── part-4-sovereign-ecosystem/   ← scheduled for Tuesday 6 May 2026
└── part-5-the-scoreboard/
```

---

## Production Workflow (per part)

1. **Research** — Web search for latest data, regulatory updates, peer benchmarks
2. **Draft** — Write article content as markdown (article body + caption + pinned comment)
3. **Charts** — Generate dashboard PNGs with Python (matplotlib/PIL), match brand palette
4. **Hero** — Generate hero banner with boardroom ecosystem image + stat overlays
5. **Carousel** — Build docx with Node.js (docx-js), embed charts + brand assets
6. **PDF** — Convert docx → PDF via LibreOffice
7. **Post** — Upload PDF carousel to LinkedIn, paste caption, pin comment
8. **Site** — Update Enterprise.AI site (series ribbon, thought leadership cards, CTA links)
9. **Sync** — Copy index.html → index-staging.html + meridian.html

## Brand Assets Used

- `05_carousel_masthead.png` — RODNEY.AI masthead strip (top of page 2)
- `06_closing_card.png` — brand closer (final page)
- `Ecosystem.jpg` — boardroom photo with AI ecosystem layers (hero background)
- `rodney_desk.png` — desk portrait with ROE density chart (used in Parts 1 & 2)

## Design System

- **Font:** Calibri (all text in carousel)
- **Colors:** NAVY #0D1B2A, ACCENT #1B4F72, BLUE #2874A6, GOLD #C9A227, LIGHT #F2F6FA
- **Section headings:** uppercase, character-spacing 40, blue bottom border (12pt)
- **Callout boxes:** left blue accent bar (24pt), light background
- **Headline boxes:** navy background, white text, large stat
- **Stat boxes in hero:** gold border, navy fill, gold values
