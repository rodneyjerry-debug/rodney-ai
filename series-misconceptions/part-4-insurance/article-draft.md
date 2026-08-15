# AI in Financial Services — Misconceptions and First Principles
## Part 4 of 4: Insurance
## "You need perfect data before you start." You don't. Here's what you need instead.

---

There is a conversation I have had at every insurer I have advised.

It goes like this: "We have fifteen years of claims data sitting in three systems. The formats are different. The coding changed twice. Medical reports are PDFs scanned in 2012. Loss adjuster notes are free text buried in emails. We need to clean the data first — then we can deploy AI."

So the firm launches a data lake project. Eighteen months later, it is not finished. The data engineering team is still reconciling schemas from the legacy claims system. The actuaries cannot use the lake because nobody built the connectors to the reserving models. The underwriters are still doing what they were doing before — reading forty-page broker submissions manually, extracting risk features by hand, entering data into the quoting system one field at a time.

The data lake becomes the prerequisite for everything and the deliverable of nothing.

This is not an isolated case. Research consistently shows that approximately 80% of data lake initiatives fail to deliver their promised value. In one documented case, a large broker spent thirty months implementing a data lake for risk modelling. Twelve months after the project concluded, their catastrophe modellers had not been able to use it.

---

## The misconception

The misconception is that you need perfect data before you start with AI. Clean the data. Standardise the formats. Build the lake. Then deploy.

This sounds reasonable. It is the most expensive mistake in insurance AI today.

The problem is that data cleaning in insurance is not a finite project. Claims data from 2012 was coded differently from claims data from 2018. Medical reports are unstructured PDFs. Broker submissions arrive as a bundle of emails, spreadsheets, and scanned documents — no two formatted the same way. The notion that you can clean all of this into a pristine dataset before you start is a fantasy that consumes budgets and delivers nothing.

Meanwhile, the competitive landscape is moving. Seventy-four percent of Lloyd's firms now use AI for data extraction. But only 14% have deployed agents inside the underwriting workflow itself. The gap between extracting data and acting on it is where the advantage is being built — and the firms waiting for clean data are not building it.

---

## The first principle: start with structure, not cleanliness

An ontology tells the AI what to look for. Clean data is the output, not the prerequisite.

This is the principle I call Ontology-First AI. Instead of cleaning fifteen years of historical data before deploying the agent, you define the schema — the risk categories, the features, the acceptable ranges, the required documentation — and then the agent extracts against it. Every extraction is a validation. Data quality improves as a byproduct of productive work, not as a separate multi-year project.

The four-step pattern:

**Define the ontology.** What are the risk categories? What features matter for each? What are the acceptable ranges? What documentation is required for a complete submission?

**Build the extraction agent.** Point it at the unstructured data — PDFs, emails, spreadsheets. It extracts against the ontology. Not freeform extraction. Structured extraction against a defined schema.

**Validate and flag.** Extracted data that does not match the ontology triggers a flag, not a failure. The underwriter reviews the flag. Is the declared revenue inconsistent with the employee count? Is the loss run missing for two years? The agent surfaces the anomaly. The human resolves it.

**Data quality improves.** Every extraction populates the structured dataset. Anomalies surface. Patterns emerge. The data lake fills as a byproduct of productive work — not as a prerequisite for it.

---

## What this looks like in practice

I designed an underwriting triage agent to demonstrate this principle. A commercial insurer receives fifty to eighty broker submissions per week for property and liability coverage. Each submission is twenty to forty pages: PDFs, emails, spreadsheets, loss runs, prior policy schedules, financial statements. No two look the same.

Before the agent, the underwriter opens the submission package — typically six to ten documents — reads through the broker narrative, manually extracts risk features, enters data into the quoting system, and identifies coverage gaps. Two to three hours per submission. Seventy percent of the underwriter's time spent on data extraction. Thirty percent on actual underwriting judgment.

The agent changes this ratio entirely.

The ontology defines fifteen risk categories — property, liability, workers compensation, auto, umbrella, cyber — and forty-plus features per category. Location, construction type, occupancy, square footage, sprinkler grade, distance to fire station, loss history, limits requested, deductibles. Each feature has an acceptable range and required documentation.

The agent ingests the submission package and extracts against the ontology in minutes. It flags anomalies: "Declared revenue ($12M) inconsistent with employee count (3). Expected range for this SIC code: $2M–$8M with 3 employees." It flags missing items: "No loss run provided for years 2021–2023. Required for submission completeness."

The underwriter reviews a structured triage summary in twenty minutes. The focus shifts from data extraction to pricing judgment, coverage structuring, and broker negotiation — the work that actually requires underwriting expertise.

The architecture follows the same pattern from Parts 1 through 3. Code computes: document classification, structured extraction against the ontology, range validation — all deterministic. AI judges: anomaly detection, coverage gap analysis, risk narrative — qualitative. A human gate: the underwriter reviews, adjusts, and quotes. The agent never binds coverage. And guardrails govern at runtime: PII handling for medical data in workers compensation claims, a data perimeter that prevents submission data from leaving the environment, and an audit trail for every extraction.

---

## The regulatory alignment

The principle maps directly to where regulators are heading.

The EU AI Act takes effect for high-risk systems in August 2026. AI used in insurance underwriting falls within scope. The Act requires auditable documentation, bias testing, and decision explainability. An ontology-defined extraction produces exactly this: a structured, auditable record of what was extracted, against which schema, with which confidence score.

SDAIA opened its draft Responsible AI Policy for consultation in April 2026, with a risk-tiering framework — critical, high, limited, and low — and proportionate obligations at each tier. An underwriting triage agent that informs pricing decisions is high-tier. The ontology provides the documentation the regulator needs: defined features, acceptable ranges, flagged anomalies, and a complete extraction trail.

IFRS 17 has fundamentally changed how insurers measure and report insurance contracts. The data requirements are pervasive — from policy administration to actuarial models to the general ledger. Ontology-first extraction produces data in the shape that IFRS 17 measurement models require, because the ontology is designed to align with reporting categories.

In Lloyd's, the LMA launched an AI Adoption Toolkit in April 2026 — practical guidance on risk tiering, data protection, and accountability. The toolkit encourages exactly the structured approach: define what you are building, govern it from the start, and deploy incrementally.

---

## The advisory conversation

When I sit with a Chief Underwriting Officer or a Head of Claims:

*"Our data is too messy for AI."* — That is exactly why you need AI. The agent extracts structure from mess. Every extraction improves the data. Waiting for clean data is waiting forever.

*"We tried an AI project and it failed because of data quality."* — Did you define the ontology first? Or did you point the model at raw data and hope? Structure is the prerequisite, not cleanliness.

*"What about regulatory requirements — Solvency II, IFRS 17?"* — The ontology is your regulatory map. Define features that align with Solvency II risk categories and IFRS 17 measurement models. The extraction produces the data in the shape the regulator needs.

*"How do we handle medical data in workers comp and life claims?"* — PII guardrails from Part 3. Medical data never leaves the environment. Extraction produces structured risk features, not raw medical text. The claims handler sees "Prior back surgery — 2019 — recovered" not the full medical report.

*"What about our legacy systems?"* — The agent reads what your systems produce — PDFs, emails, spreadsheets. It does not require system integration. It requires document access. That is a much simpler problem.

---

## The bottom line

Four industries. One pattern.

In Part 1, I showed that code computes and AI judges — the credit memo agent separates deterministic arithmetic from qualitative reasoning.

In Part 2, I showed that AI writes the first draft and humans own the decision — the prospectus review agent elevates the analyst from data extraction to judgment.

In Part 3, I showed that governance is architecture, not paperwork — the portfolio risk agent embeds guardrails in code that runs at inference time.

Here, in Part 4, the principle is: start with structure, not cleanliness. The ontology tells the AI what to look for. Clean data is the output. The data lake that never finishes is replaced by an agent that produces structured, validated, audit-ready data as a byproduct of productive work.

The misconception changes. The first principles do not.

Code computes. Humans decide. Governance is architecture. Structure before cleanliness.

If you are a Chief Underwriting Officer, Chief Data Officer, or Head of Claims at an insurer exploring how AI fits into your data strategy — the answer is not a bigger data lake. The answer is a better ontology.

Show me the schema.

---

*Rodney Coutinho is the founder of Enterprise.AI and an executive advisor on AI strategy, governance, and deployment for financial institutions across the GCC and Europe.*

*This is Part 4 of a 4-part series: AI in Financial Services — Misconceptions and First Principles.*
