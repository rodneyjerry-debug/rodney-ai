# Athar — AI Register & Guardrails

Working prototype of the platform product, built into the site. **Nothing is committed.** Everything below sits in the working tree for you to review, amend or discard.

Built overnight, 25 August 2026.

---

## What was added

```
athar.html                 Product page — full site chrome, shared.css, working tiering demo
athar/_demo.css            App chrome: dark surface built from the Enterprise.AI palette
athar/_data.js             Shared content pack + illustrative tenant. One source of truth.
athar/register.html        The inventory of record, with detail drawer
athar/intake.html          Four-step submission wizard, live tier derivation
athar/approvals.html       Decision workspace — enforced quorum, gating controls
athar/coverage.html        Position against each instrument, computed from the register
athar/map.html             All 22 modules, object model, release bands
athar/README.md            This file
```

## What was modified

**`tools.html` — one insertion, nothing removed.** A new `<section id="platform">` sits between the page hero and the existing Accelerators section, carrying a navy feature card for Athar and direct links to the five screens. Every existing accelerator card is untouched.

To see exactly what changed:

```
git diff tools.html
```

To revert just that:

```
git checkout -- tools.html
```

## What was NOT touched

- No commits, no branches, no pushes. `main` is exactly where you left it.
- No nav changes on the other eight top-level pages. Adding a ninth item risks wrapping the nav bar, so Athar is reachable from Tools rather than the main navigation. **Your call** — see open decisions below.
- No accelerator files, no `_gate.js`, no PDFs, no `admin.html`.
- None of the items in your handoff list (PDF regeneration, Misconceptions series, dead-file cleanup) were started.

## Preview locally

The pages are plain files, but `athar/*.html` load `_data.js` via `<script src>`, which some browsers block over `file://`. Serve the folder instead:

```
cd C:\Users\rodne\Dev\rodney-ai
python -m http.server 8000
```

Then open `http://localhost:8000/athar.html` and `http://localhost:8000/tools.html#platform`.

---

## Design decisions worth your review

**Marketing light, product dark.** `athar.html` inherits the site exactly — Fraunces, navy hero, sand alternating sections, `--gold` (which is the green `#006B5E`). The five app screens run a dark chrome built from the same palette, on the reasoning that dense working software earns a different surface while keeping the same hues, type and radius. Linear and Vercel do the same. If you would rather the app screens were light too, that is a change to `_demo.css` only.

**One accent adjustment.** `#006B5E` is too dark to read on a navy application background, so `_demo.css` defines `--accent: #00A891` as its on-dark sibling. Same hue family, lifted for legibility. Nothing else in the palette changed.

**Content as data.** `_data.js` holds the control library, tier weights, boundaries and instrument mappings — all of it as data, not logic. This mirrors how the real product must work: a regulatory change ships as a content release, not a code release, and one engine serves different sector packs. It is also why all five screens agree with each other: they compute from the same source.

**Evidence assignment is hashed, not sequential.** Which controls are evidenced per system is derived from a stable hash of system ID plus control ID, hitting each system's stated coverage percentage. An earlier version marked the first N controls in library order, which made every single system show the same control as its gap — obviously synthetic to anyone looking closely.

## Verified

- All inline and external scripts parse cleanly (Node 22).
- Every relative link across the six pages resolves to a file that exists.
- Derivation checks pass: tier arithmetic, control applicability, per-system coverage percentages honoured, determinism across calls.
- Three systems are blocked on unevidenced gating controls (AIS-0043, AIS-0063, AIS-0074); the rest are clear. Coverage lands at 68–73% across the five instruments.

## Open decisions for you

1. **The name.** "Athar" (أثر — *trace, evidence, imprint*) is a placeholder chosen because it names the tamper-evident decision chain. Change it and it is a find-and-replace across seven files.
2. **Main navigation.** Athar currently lives under Tools. If it warrants its own nav item, that is one line in each of the nine top-level pages plus each mobile drawer.
3. **Design-partner CTA.** The product page and `tools.html` both say you are selecting three design partners. Honest about where the product is, but it is a public statement — check you are comfortable before this goes live.
4. **Fictional-data labelling.** Every screen carries a ribbon saying Nakhla Bank is fictional. Worth keeping even when the product is real, for as long as the demo data is.
5. **Arabic.** Dropped from the app screens per your instruction. The product page keeps the Arabic board-pack card and the wordmark. `_demo.css` already reserves an `--ar` font stack for when it comes back.

## Not built

Seventeen of the twenty-two modules on the product map are specified, not built — exceptions, incidents, control library admin, evidence vault, reviews, content pack manager, tier rules admin, forums, SSO, dashboards, board pack, audit trail, and the whole v2 value layer. The map shows exactly where the work sits, and it clusters in *Configure and report*, which is unglamorous and is the difference between a demo and a product.
