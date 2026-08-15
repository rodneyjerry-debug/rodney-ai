# Part 4 — Insurance: "You need perfect data before you start."

## Series: AI in Financial Services — Misconceptions and First Principles
## Part 4 of 4 | Vertical: Insurance (Life, P&C, Reinsurance)

---

## The Misconception

"Our data isn't clean enough for AI."

Every insurer I advise has a variation of this conversation:

"We have 15 years of claims data in three systems. The formats are different. The codes changed twice. Medical reports are PDFs scanned in 2012. Loss adjuster notes are free text in emails. We need to clean the data first — then we can deploy AI."

So they launch a data lake project. It takes 18 months. It's never finished. Meanwhile, underwriters still read 40-page broker submissions manually, and claims adjusters still search through scanned PDFs for relevant medical history.

The data lake becomes the prerequisite for everything and the deliverable of nothing.

---

## The First Principle

**Start with structure, not cleanliness.**

An ontology tells the AI what to look for. Clean data is the **output**, not the prerequisite.

The insight: you don't need to clean 15 years of claims data before you start. You need to define the schema — the risk categories, the features, the acceptable ranges — and then let the AI extract against it. Every extraction is a validation. Data quality improves as a byproduct of the workflow, not as a separate multi-year project.

### Ontology-First AI (the framework):

1. **Define the ontology:** What are the risk categories? What features matter? What are acceptable ranges? What documentation is required?
2. **Build the extraction agent:** Point it at the unstructured data. It extracts against the ontology — not freeform, but structured.
3. **Validate and flag:** Extracted data that doesn't match the ontology triggers a flag, not a failure. The human reviews the flag.
4. **Data quality improves:** Every extraction populates the structured dataset. Anomalies surface. Patterns emerge. The data lake fills as a byproduct of productive work.

---

## The Working Example

**Underwriting Triage Agent** — ingests broker submissions and extracts risk features.

### The scenario:
A commercial insurer receives 50-80 broker submissions per week for commercial property and liability coverage. Each submission is 20-40 pages: PDFs, emails, spreadsheets, loss runs, prior policy schedules, financial statements.

### Before (current state):
- Underwriter opens submission package (typically 6-10 documents)
- Reads through broker narrative (20-40 pages)
- Manually extracts risk features: property location, construction type, occupancy, revenue, claims history, limits requested, deductibles
- Enters data into quoting system
- Identifies coverage gaps and anomalies
- **Timeline: 2-3 hours per submission**
- **Bottleneck: underwriters spend 70% of time on data extraction, 30% on actual underwriting judgment**

### After (with agent):
- Agent ingests submission package
- Extracts risk features against defined ontology:
  - 15 risk categories (property, liability, workers comp, auto, umbrella, cyber, etc.)
  - 40+ features per category (location, construction, occupancy, square footage, sprinkler grade, distance to fire station, loss history, etc.)
  - Acceptable ranges and required documentation for each feature
- Flags anomalies: "Declared revenue ($12M) inconsistent with employee count (3). Expected range for this SIC code: $2M-$8M with 3 employees."
- Flags missing items: "No loss run provided for years 2021-2023. Required for submission completeness."
- Produces structured triage summary
- **Underwriter reviews in 20 minutes**
- **Focus shifts to: pricing judgment, coverage structuring, broker negotiation**

### Architecture cross-reference to Parts 1-3:
- Phase 1 (code computes): Document classification, structured extraction against ontology, range validation — all deterministic
- Phase 2 (AI judges): Anomaly detection, coverage gap analysis, risk narrative — qualitative
- Human gate: Underwriter reviews, adjusts, quotes. AI never binds coverage.
- Guardrails (from Part 3): PII handling (medical data in workers comp), data perimeter (no submission data leaves the environment), audit trail
- Governance is architecture (from Part 3): not a data governance policy — a runtime ontology that enforces structure

---

## Key Numbers

- 40 pages broker narrative → structured risk summary in minutes
- 15 risk categories, 40+ features per category
- 2-3 hours → 20-minute underwriter review
- 70% of underwriter time recovered (from extraction to judgment)
- Data quality improves with every extraction — not a separate cleanup project
- NDMO data readiness framework: structure before cleanliness (GCC regulatory context)
- The data lake project that never finishes: average 18 months, 60% never reach production

---

## The Advisory Conversation

When I sit with a Chief Underwriting Officer or a Head of Claims:

**"Our data is too messy for AI."**
That's exactly why you need AI. The agent extracts structure from mess. Every extraction improves the data. Waiting for clean data is waiting forever.

**"We tried an AI project and it failed because of data quality."**
Did you define the ontology first? Or did you point the model at raw data and hope? Structure is the prerequisite, not cleanliness.

**"What about regulatory requirements — Solvency II, IFRS 17?"**
The ontology is your regulatory map. Define features that align with Solvency II risk categories and IFRS 17 measurement models. The extraction produces the data in the shape the regulator needs.

**"How do we handle medical data in workers comp / life claims?"**
PII guardrails from Part 3. Medical data never leaves the environment. Extraction produces structured risk features, not raw medical text. The claim handler sees "Prior back surgery — 2019 — recovered" not the full medical report.

**"What about our legacy systems?"**
The agent reads what your systems produce — PDFs, emails, spreadsheets. It doesn't require system integration. It requires document access. That's a much simpler problem.

---

## Cross-References

- **From Part 1:** "Code computes — the extraction against the ontology is deterministic. AI judges — the anomaly detection and coverage gap analysis is qualitative."

- **From Part 2:** "At the exchange, AI reads 200-page prospectuses and flags disclosure gaps. In insurance, the same principle applies to 40-page broker submissions."

- **From Part 3:** "Governance is architecture — the ontology isn't just a data model, it's a governance mechanism. It defines what the AI can see, what it extracts, and what it flags."

- **Series closer:** "Four industries, one pattern — the misconception changes, the first principles don't. Code computes. Humans decide. Governance is architecture. Structure before cleanliness."

---

## Credibility Signals

- Data practice build-out at Deloitte ME (10x growth — data is core to his story)
- Ontology-First AI framework (his branded methodology, published on Enterprise.AI site)
- NDMO data readiness work (GCC regulatory context for data governance)
- Insurance experience through Deloitte client portfolio

---

## Tone Notes

- This part is the most empathetic — insurers are genuinely stuck, and the "clean your data first" advice from consultants has been unhelpful for years
- The "data lake that never finishes" is a universally recognised pain point — name it directly
- The Ontology-First AI framework is Rodney's branded IP — this is where it gets its origin story
- End the series with the unifying statement: "Four industries, one pattern"
- This part should feel like a culmination, not just another instalment
- The closing should invite follow-up: "If you want to discuss how this applies to your institution, DM or email."
