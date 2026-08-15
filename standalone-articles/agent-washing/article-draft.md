# Most of What You're Being Sold Isn't an AI Agent

## 84% of leaders are increasing agent spend. Gartner found only 130 vendors out of thousands are genuinely agentic. Here's how to tell the difference.

---

Last month, I sat in a procurement review at a bank. Eight vendors on the shortlist. Every one of them described their product as an "AI agent."

The first was a customer service chatbot with an LLM wrapper. It could answer questions about account balances. It could not access the core banking system, take action on a request, or remember the conversation an hour later. The vendor called it an "autonomous customer agent."

The second was a document summarisation tool. Upload a PDF, get a summary. It could not reason across multiple documents, validate data against external sources, or execute a workflow. The vendor called it an "intelligent document agent."

The third was a robotic process automation script. Screen-scraping and rule-following, relabelled after someone in marketing discovered the word "agentic." It broke on every exception outside its script. The vendor called it an "agentic process automation platform."

Three vendors. Three products. Not one of them was an agent.

---

## The scale of the problem

Gartner's analysis of the agentic AI vendor landscape found that only approximately 130 out of thousands of vendors offering "agentic AI" products are genuinely agentic. The rest are chatbots, copilots, RPA tools, and search assistants with a new label.

This is not a minor naming dispute. Gartner predicts that over 40% of agentic AI projects will be cancelled by the end of 2027, driven by escalating costs, unclear business value, and inadequate risk controls. They name agent-washing explicitly as a contributing factor: "the rebranding of existing products, such as AI assistants, RPA and chatbots, without substantial agentic capabilities."

Meanwhile, 84% of C-suite executives say they will increase AI agent investment in the next twelve months. The money is flowing. The problem is where it lands.

Today, only 17% of organisations have actually deployed AI agents. Only 11% are running agents in production. That is a 68-percentage-point gap between "adopted" and "deployed," the largest in enterprise technology history.

In financial services specifically, the top fifty global banks announced over 160 agentic AI use cases in 2025 alone. But when you strip away the demos, the proofs of concept, and the press releases, the number of agents operating autonomously inside a production workflow, with real data, real guardrails, and a real audit trail, is a fraction of what the announcements suggest.

---

## What actually makes an agent

An agent is not a chatbot that got promoted.

Here is the difference:

A **chatbot** responds to prompts. You ask a question, it answers. It does not take action, access systems, or persist state. Session ends, memory resets.

An **RPA bot** follows a script. It clicks buttons, moves data between fields, and executes rules. It does not reason. When it encounters an exception, it breaks.

A **copilot** assists a human. It drafts, summarises, suggests. The human initiates every action. The copilot never acts independently.

An **agent** pursues a goal. It decomposes the objective into sub-tasks. It reasons about which tools to use. It accesses multiple systems, takes actions, handles exceptions, and maintains state across sessions. It operates within defined guardrails, and when it encounters something outside its authority, it escalates rather than guesses.

The distinction matters because each category carries a fundamentally different risk profile. Deploying a chatbot under agent governance is wasteful. Deploying an agent under chatbot governance is dangerous.

---

## The seven-question test

When I advise banks on agent procurement, I bring seven questions to the evaluation. These are not technical. They are architectural. Any vendor that cannot answer them is not selling you an agent.

**One: Goal decomposition.** Give it a business objective, not a question, an objective. "Process this broker submission and produce a triage report." Can it break that into sub-tasks without human prompting? Or does it wait for instructions at every step?

**Two: Cross-system orchestration.** Does it connect to and act across core banking, CRM, document management, and compliance systems? Or does it operate in a single interface and call that "integration"?

**Three: Exception handling.** Feed it an edge case outside its training data. A submission with contradictory information. A regulatory requirement that changed last month. Does it reason through it, or does it hallucinate an answer or simply break?

**Four: Audit trail.** Does every decision produce a traceable log? Timestamp, inputs, reasoning, output. Not just a final answer, but the path it took to get there. In financial services, if it is not auditable, it does not exist.

**Five: Human override.** Can a compliance officer halt the agent mid-workflow? Can they reverse an action? Can they correct a decision without restarting the entire process? This is not optional under the EU AI Act.

**Six: Persistence.** Does it maintain context across sessions? Or does it reset every time, forcing the user to re-explain the situation? Persistence is what separates a tool from a colleague.

**Seven: Failure mode.** When the agent is wrong (and it will be wrong), what happens? Does it flag uncertainty and escalate? Or does it present a confident, incorrect answer with no indication that anything is off?

Ask all seven. In the room. With the vendor's engineers present, not just the sales team. The answers will separate the 130 genuine vendors from the thousands who rebranded their way into the conversation.

---

## Why this matters now

Five regulatory developments across Europe and the Middle East make agent evaluation urgent.

The **EU AI Act** high-risk provisions take full effect in August 2026. Credit scoring, lending decisions, and insurance pricing all fall within Annex III scope. The Act requires risk management systems, logging, human oversight, and fundamental rights impact assessments before deployment. Fines run up to EUR 35 million or 7% of global turnover. The Act does not use the word "agent," but its definitions are broad enough to capture any autonomous system making decisions inside a regulated workflow. An agent that cannot produce an audit trail is a compliance failure on day one.

The **UK FCA's Mills Review**, published July 2026, is the first major regulatory document in any jurisdiction to explicitly name "agentic finance." It recommends building foundations for agentic AI in financial services and developing an AI-enabled supervisory model. The direction is clear. The FCA sees agents as the next frontier, and it plans to supervise them as such.

The **CBUAE** published binding guidance on responsible AI adoption in February 2026, with a compliance deadline of September 2026. It requires board-level accountability for AI decisions, human oversight of automated processes, and explainability. Fines up to AED 1 billion. If your agent operates inside a UAE-regulated entity, this applies now.

**Saudi Arabia's SDAIA** declared 2026 the "Year of AI" and published updated national AI governance guidelines in February 2026. The Saudi CMA approved a Robo-Advisory Regulation requiring algorithm pre-notification and periodic testing for any automated advisory system. With HUMAIN scaling sovereign AI infrastructure and SDAIA tightening governance, the Kingdom is building the rails and the rules at the same time. Any agent deployed inside a Saudi-regulated institution needs to be ready for both.

**DIFC** has gone further. Regulation 10 on autonomous and semi-autonomous systems has been in full enforcement since January 2026. DIFC is now consulting on amended regulations that would require firms to appoint an Autonomous Systems Officer. It has publicly stated its ambition to become the world's first "AI-native financial centre."

The regulatory direction across both regions is the same: agents will be governed as actors, not tools. If your "agent" is actually a chatbot with a new name, you are paying agent prices for chatbot capabilities and building governance for something that does not need it, while leaving actual agent risks ungoverned.

---

## The advisory conversation

When I sit with a CIO or CTO evaluating agentic AI:

*"The vendor demo was impressive."* Demos are designed to be impressive. Ask them to run it on your data, in your environment, with your edge cases. The gap between demo and production is where the cancelled projects live.

*"We need to move fast. Competitors are deploying agents."* They are announcing agents. Deploying is different. Moving fast into the wrong product means you will move fast again in eighteen months to replace it.

*"How do we know if our use case needs an agent?"* If the task requires multi-step reasoning, cross-system action, and exception handling, you need an agent. If it requires question-answering or document summarisation, you need a copilot. Buying an agent for a copilot task is like hiring a surgeon to take a temperature.

*"What about the AI governance implications?"* This is the question that separates leaders from followers. An agent that operates autonomously inside your workflow is a decision-maker. It needs the same governance architecture as any other decision-maker in your organisation. Defined authority, audit trail, escalation path, and override mechanism.

---

## The bottom line

The agentic AI market has an integrity problem. It is ESG-washing five years ago. It is cloud-washing a decade ago. The pattern is the same: a genuinely transformative technology gets diluted by vendors who rebrand existing products to capture the premium.

The firms that will extract real value from agentic AI are not the ones that buy the fastest. They are the ones that evaluate the hardest.

Seven questions. In the room. With the engineers.

That is the test.

---

*Rodney Coutinho is the founder of Enterprise.AI and an executive advisor on AI strategy, governance, and deployment for financial institutions across the GCC and Europe.*
