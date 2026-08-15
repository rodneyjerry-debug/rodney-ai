# AI doesn't compute. Code computes. AI judges.

## The most expensive misconception in banking AI.

---

There is a misconception that is quietly burning through AI budgets in every major bank I advise.

It goes like this: "We gave the model our financial data and asked it to write the credit memo."

Then the committee received a memo where the DSCR was 2.56x in one paragraph and 2.81x three paragraphs later. Same borrower. Same data. Two different numbers. Nobody noticed until Internal Audit flagged it four months later.

This is not an edge case. This is what happens when you ask a language model to do arithmetic.

I have spent the last twenty years building AI and data capabilities inside financial institutions — HSBC, UBS, Lloyds, Deloitte, Tadawul. And the pattern I see repeating in 2026 is the same pattern I saw in 2018 with robotic process automation: banks deploy the technology before designing the architecture.

**The result is always the same. Impressive demos. Failed pilots. Sceptical boards.**

---

## The misconception

The misconception is that AI should do everything. Ingest the data. Compute the ratios. Assess the risks. Write the narrative. Assign the rating. Produce the memo.

It shouldn't. And here's why.

Large language models are, by design, probabilistic. They predict the next token. That's what makes them extraordinary at reasoning, synthesis, and narrative — and fundamentally unreliable at arithmetic. When Claude or GPT computes a ratio, it's not dividing two numbers. It's predicting what the answer *probably looks like* based on patterns in its training data.

For a chatbot, that's fine. For a credit memorandum that goes to committee, it's negligent.

---

## The principle: AI orchestrates, code computes

The architecture that works in production separates two concerns completely.

**Phase 1 — Code computes.** Every number in the credit memo is calculated by deterministic Python functions. Current Ratio, Debt/Equity, Net Debt/EBITDA, DSCR, Interest Coverage — twelve ratios, each a pure function. Same input, same output, every time. Unit-tested. Auditable. A regulator can inspect the calculation and verify it independently.

**Phase 2 — AI judges.** The language model receives the pre-computed ratios, the risk flags, the peer benchmarks, and the market context. It never touches a calculator. Instead, it does what it's genuinely good at: it reads the 1.26x Net Debt/EBITDA, sees the peer median at 1.40x, notes the leverage trajectory rising from 0.89x, connects that to the SAR 500M capex expansion, and writes: *"Current leverage is below peer median, but post-facility pro-forma leverage of approximately 1.99x warrants covenant protection at 2.75x."*

That's qualitative judgment informed by structured data. No hallucinated numbers. No inconsistent ratios. No audit findings.

---

## What this looks like in practice

I built a credit memo agent to test this principle. Not a slide deck — a working agent that runs on the Claude Agent SDK and produces committee-ready structured output.

Here's what happens when you feed it a SAR 500M term loan request for a Tadawul-listed cement company:

**Phase 1 completes in under a second.** Ten credit ratios computed. Three risk flags raised (construction delivery risk: high; regulatory risk: medium; energy cost risk: medium). Data completeness validated at 100%. Every number traceable to source.

**Phase 2 takes thirty seconds.** The AI reads the structured output from Phase 1 and produces a full credit memorandum: financial narrative, ratio-by-ratio commentary, five risk factors with mitigation strategies, and a recommendation — APPROVE WITH CONDITIONS — with eighteen specific covenants. Conditions precedent. Financial covenants. Structural covenants (milestone-gated drawdown at 40/30/30). Reporting covenants. A sustainability-linked margin ratchet on carbon intensity.

The total cost: $0.35.

A senior analyst doing the same work manually: 4–6 hours and approximately $500 in fully loaded cost.

---

## Why banks keep getting this wrong

Three reasons.

**First, they start with the demo.** A vendor shows the board a prompt that turns a PDF into a credit memo in sixty seconds. The board is impressed. Nobody asks whether the DSCR in paragraph four matches the DSCR in the ratio table. By the time someone checks, the pilot is funded and the architecture is locked.

**Second, they treat the AI as a black box.** The model ingests data and produces output. Nobody can explain what happened in between. When the regulator asks "how did you arrive at this rating?", the answer is "the model said so." That answer does not survive a SAMA examination.

**Third, they skip the guardrails.** In production, every tool call should pass through safety checks (block writes to sensitive paths), quality checks (flag infinity or NaN values), and compliance checks (enforce policy limits — maximum leverage, minimum DSCR). These are not optional features. They are the difference between a system that works and a system that gets shut down after the first incident.

---

## The production architecture

A credit memo agent that survives in a regulated environment has five stages and three human gates.

**Stage 1 — Data ingestion.** Financial data flows from core banking (T24, Finacle, Flexcube), CRM, and market data feeds. Schema validation rejects incomplete submissions. If data completeness is below 85%, the system sends it back to the relationship manager. The agent does not proceed on bad data.

**Stage 2 — Deterministic analysis.** Ratios computed. Risk flags raised. Credit policy limits enforced. If leverage exceeds the hard policy ceiling, the system auto-declines. No AI compute wasted. No committee time consumed.

**Stage 3 — AI qualitative analysis.** The model receives structured, pre-computed inputs and produces the draft memo. A JSON schema enforces the output structure — if the memo doesn't match the schema, the agent retries. Every tool call is logged to an append-only audit trail.

**Stage 4 — Analyst review.** A human reviews the draft. Edits the commentary. Adjusts the rating if needed. Adds what the AI couldn't know — the management meeting last Tuesday, the site visit findings, the rumour about a regulatory change. Every edit is captured as a diff with an override reason.

**Stage 5 — Credit committee.** The committee receives a memo that took twenty minutes of analyst time instead of six hours. They make the decision. The AI's role ended at Stage 3.

---

## The advisory conversation

When I sit with a CRO or a Head of Credit, the question is never "can AI write a credit memo?" They know it can. The question is always one of these:

*"How do I make sure the numbers are right?"* — Deterministic tools. Unit-tested. The AI never computes.

*"How do I explain this to the regulator?"* — Audit trail. Every tool call logged. Every analyst edit captured. Source data tagged with lineage.

*"What happens when it gets it wrong?"* — Guardrails that catch it before the committee sees it. And a human who always signs off.

*"What does it cost?"* — $0.35 per memo at the AI layer. The real cost is the architecture: the data pipeline, the integration, the testing, the change management. Budget six months and a dedicated team.

*"Who else is doing this?"* — Everyone is experimenting. Almost nobody is in production. The banks that will lead are the ones that get the architecture right now — before the regulator mandates it.

---

## The bottom line

AI in credit is not a technology problem. It is an architecture problem.

The model is a commodity. Claude, GPT, Gemini — they all reason well enough. What separates a demo from a production system is the discipline to split deterministic computation from qualitative judgment, wrap every AI action in guardrails, and keep a human in the loop where it matters.

The bank that gets this right does not just save analyst hours. It changes the economics of credit origination. More deals analysed. Deeper risk coverage. Faster time-to-decision. Better audit trail than the manual process ever produced.

The misconception — that AI should do everything — is the most expensive mistake in banking AI today. The principle — that code computes and AI judges — is the cheapest fix.

---

*Rodney Coutinho is the founder of Enterprise.AI and an executive advisor on AI strategy, governance, and deployment for financial institutions across the GCC and Europe. He previously built and led the AI & Data practice at Deloitte Middle East.*

*The credit memo agent referenced in this article is available as a working prototype at rodney-ai.com/accelerators/agent-credit-memo.html.*
