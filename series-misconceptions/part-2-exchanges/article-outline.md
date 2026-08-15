# Part 2 — Exchanges: "AI replaces the analyst."

## Series: AI in Financial Services — Misconceptions and First Principles
## Part 2 of 4 | Vertical: Stock Exchanges / Capital Markets Regulators

---

## The Misconception

"AI will replace prospectus review analysts."

Two versions of this misconception circulate in every exchange and capital markets authority:

**Version A (tech optimists):** "We can automate prospectus review. Deploy the model, reduce headcount by 60%, and clear the IPO backlog."

**Version B (tech sceptics):** "AI can't be trusted with listing decisions. Too much liability. We'll wait."

Both are wrong. The first misunderstands what the analyst's value is. The second misunderstands what the technology does.

---

## The First Principle

**AI writes the first draft. Humans own the listing decision.**

The analyst's role doesn't disappear — it elevates. From data extraction (reading 200 pages) to judgment (asking the questions the model can't).

The questions the AI can't ask:
- "Is this management team credible?"
- "Does this business model survive a rate cycle?"
- "Is the market timing right for this sector?"
- "What did we learn from the last IPO in this vertical?"

---

## The Working Example

**Prospectus Review Agent** — built for a Tadawul-context workflow.

### Before (current state):
- Analyst receives 200-page prospectus PDF
- Manually reads cover-to-cover
- Cross-references 47 CMA disclosure requirements
- Checks financial statements against auditor opinions
- Drafts completeness report
- Reviews with senior analyst
- **Timeline: 3 days per prospectus**
- **Bottleneck: 12 IPO applications queued, 4 analysts**

### After (with agent):
- Agent ingests prospectus PDF
- Extracts against defined disclosure ontology (47 CMA requirements)
- Flags gaps: "Section 8.3 (Related Party Transactions) — no disclosure of board member interests in supplier contracts. CMA Rule 42(b) requires explicit disclosure."
- Cross-references financial figures against auditor opinion
- Drafts completeness report with gap analysis
- **Analyst reviews structured output in 45 minutes**
- **Focus shifts to judgment calls: management credibility, market timing, sector risk**

### Key architecture points (cross-reference to Part 1):
- Phase 1 (code computes): PDF extraction, section mapping, disclosure checklist cross-referencing — all deterministic
- Phase 2 (AI judges): Gap analysis, risk narrative, quality assessment of disclosures — qualitative
- Human gate: Analyst reviews, edits, signs off. AI never makes the listing decision.
- Audit trail: Every extraction logged. Every flag traceable to source page and CMA rule number.

---

## Key Numbers

- 200-page prospectus → 45-minute analyst review
- 47 CMA disclosure requirements cross-referenced automatically
- 3 days → same-day turnaround
- Analyst headcount doesn't decrease — **throughput increases 4x**
- 12 queued applications → cleared in one week instead of one month
- Cost per review: ~$2.50 at AI layer (longer document, more extraction)

---

## The Advisory Conversation

When I sit with a Head of Listings or a Chief Regulatory Officer at an exchange:

**"Won't this replace our analysts?"**
No. It replaces the reading. The analyst's value isn't in reading 200 pages — it's in the questions they ask after.

**"How do we handle liability?"**
The AI flags. The analyst decides. The listing decision is always human. The audit trail is better than the manual process.

**"What about edge cases — unusual structures, dual-class shares, SPACs?"**
The ontology defines what the agent looks for. Edge cases surface as anomalies, not as missed items. The agent says "I don't recognise this structure" rather than silently skipping it.

**"Our prospectuses are in Arabic and English."**
Language is where AI excels. Bilingual extraction is a strength, not a limitation.

---

## Cross-References

- **To Part 1:** "In Part 1, I showed how code computes and AI judges in a credit memo. The same separation applies here — but extends from numbers to documents. The architecture principle doesn't change when the input is a 200-page PDF instead of a JSON data feed."

- **Teaser for Part 3:** "Next week — Part 3: We've established that code computes and humans decide. But who governs the AI itself? In investment management, the answer is usually a PDF in the compliance folder. That's the misconception."

---

## Credibility Signals

- Tadawul transformation (direct experience with exchange modernisation)
- Zora AI — 200+ engineers, NVIDIA Llama Nemotron (you helped build the technology)
- CMA GenAI supervisory programme (you know the regulatory context)
- Bilingual Arabic/English processing (relevant to GCC exchanges)

---

## Tone Notes

- This part is the most personal — it connects directly to your Tadawul/CMA work
- Be careful with specifics: describe the workflow generically enough that it's not revealing client confidential details, but specific enough that readers know you've done this
- The "analyst replacement" fear is real and politically sensitive — be empathetic, not dismissive
- The throughput argument (4x, not -60% headcount) is the key reframe
