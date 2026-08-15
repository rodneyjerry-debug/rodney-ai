const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system ----------
const NAVY   = "0D1B2A";
const ACCENT = "1B4F72";
const BLUE   = "2874A6";
const GREY   = "6C757D";
const LIGHT  = "F2F6FA";
const GOLD   = "C9A227";
const INK    = "1F2933";
const RED    = "B22222";
const WHITE  = "FFFFFF";

// ---------- Helpers ----------
const run = (text, opts = {}) => new TextRun({
  text,
  font: "Calibri",
  size: opts.size || 26,
  color: opts.color || INK,
  bold: opts.bold || false,
  italics: opts.italics || false,
});

const para = (children, opts = {}) => new Paragraph({
  alignment: opts.alignment || AlignmentType.LEFT,
  spacing: { before: opts.before || 0, after: opts.after || 200, line: 340 },
  children: Array.isArray(children) ? children : [children],
});

const spacer = (after = 200) => new Paragraph({ spacing: { after }, children: [run("")] });

const sectionHeading = (text) => new Paragraph({
  spacing: { before: 120, after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 6 } },
  children: [new TextRun({
    text: text.toUpperCase(),
    font: "Calibri", size: 26, bold: true, color: NAVY, characterSpacing: 60
  })],
});

// Branded footer for every page
const pageFooter = (pageNum) => [
  spacer(100),
  new Paragraph({
    spacing: { before: 100, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 8 } },
    children: [
      new TextRun({
        text: `ENTERPRISE.AI  //  AI IN FS: MISCONCEPTIONS & FIRST PRINCIPLES  //  PART 1 OF 4  //  ${pageNum}`,
        font: "Calibri", size: 16, color: GREY, characterSpacing: 40,
      }),
    ],
  }),
];

const calloutBox = (text, opts = {}) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    bottom: { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    left:   { style: BorderStyle.SINGLE, size: 24, color: opts.accent || BLUE },
    right:  { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: WHITE },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: WHITE },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: opts.fill || LIGHT, type: ShadingType.CLEAR },
          margins: { top: 240, bottom: 240, left: 300, right: 300 },
          children: [
            new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({
                text, font: "Calibri",
                size: opts.size || 26,
                italics: opts.italics !== false,
                bold: opts.bold || false,
                color: opts.color || NAVY,
              })],
            }),
          ],
        }),
      ],
    }),
  ],
});

const headlineBox = (label, stat, context, caption) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    left:   { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    right:  { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: WHITE },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: WHITE },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          margins: { top: 300, bottom: 300, left: 360, right: 360 },
          children: [
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({
                text: label, font: "Calibri", size: 20, bold: true,
                color: "BFD4E8", characterSpacing: 80,
              })],
            }),
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({
                text: stat, font: "Calibri", size: 52, bold: true, color: WHITE,
              })],
            }),
            new Paragraph({
              spacing: { after: 40, line: 340 },
              children: [new TextRun({
                text: context, font: "Calibri", size: 26, color: WHITE,
              })],
            }),
            new Paragraph({
              children: [new TextRun({
                text: caption, font: "Calibri", size: 22, italics: true, color: "9FB6CC",
              })],
            }),
          ],
        }),
      ],
    }),
  ],
});

// Three-column stat row
const statRow = (items) => {
  const colWidth = Math.floor(9360 / items.length);
  const border = { style: BorderStyle.SINGLE, size: 2, color: GOLD };
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: items.map(() => colWidth),
    rows: [new TableRow({
      children: items.map(([val, label]) => new TableCell({
        width: { size: colWidth, type: WidthType.DXA },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        margins: { top: 260, bottom: 260, left: 200, right: 200 },
        borders: { top: border, bottom: border, left: border, right: border },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: val, font: "Calibri", size: 48, bold: true, color: GOLD })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: label, font: "Calibri", size: 18, bold: true, color: "BFD4E8", characterSpacing: 40 })],
          }),
        ],
      })),
    })],
  });
};

// Image helpers
const CHARTS_DIR = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-1-banks/charts";
const BRAND_DIR = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/_brand-assets";

const chartImage = (filename, widthPx, heightPx) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 160, after: 160 },
  children: [new ImageRun({
    type: "png",
    data: fs.readFileSync(`${CHARTS_DIR}/${filename}`),
    transformation: { width: widthPx, height: heightPx },
    altText: { title: filename, description: filename, name: filename },
  })],
});

const brandImage = (filename, widthPx, heightPx, opts = {}) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: opts.before || 0, after: opts.after || 0 },
  children: [new ImageRun({
    type: "png",
    data: fs.readFileSync(`${BRAND_DIR}/${filename}`),
    transformation: { width: widthPx, height: heightPx },
    altText: { title: filename, description: filename, name: filename },
  })],
});

// Series tracker row
const seriesRow = (num, vertical, misconception, active) => new TableRow({
  children: [
    new TableCell({
      width: { size: 640, type: WidthType.DXA },
      shading: { fill: active ? BLUE : LIGHT, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 120, right: 80 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: WHITE },
        right: { style: BorderStyle.NONE, size: 0, color: WHITE },
      },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: num, font: "Calibri", size: 24, bold: true, color: active ? WHITE : NAVY })],
      })],
    }),
    new TableCell({
      width: { size: 2200, type: WidthType.DXA },
      shading: { fill: active ? "E8F0F8" : WHITE, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 180, right: 120 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: WHITE },
        right: { style: BorderStyle.NONE, size: 0, color: WHITE },
      },
      children: [new Paragraph({
        children: [new TextRun({ text: vertical, font: "Calibri", size: 22, bold: true, color: active ? NAVY : ACCENT })],
      })],
    }),
    new TableCell({
      width: { size: 6520, type: WidthType.DXA },
      shading: { fill: active ? "E8F0F8" : WHITE, type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 120, right: 180 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: WHITE },
        right: { style: BorderStyle.NONE, size: 0, color: WHITE },
      },
      children: [new Paragraph({
        children: [new TextRun({ text: misconception, font: "Calibri", size: 22, color: active ? NAVY : GREY, italics: !active, bold: active })],
      })],
    }),
  ],
});

// Numbered reason card
const reasonCard = (num, title, body) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [720, 8640],
  borders: {
    top: { style: BorderStyle.NONE, size: 0, color: WHITE },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
    left: { style: BorderStyle.NONE, size: 0, color: WHITE },
    right: { style: BorderStyle.NONE, size: 0, color: WHITE },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: WHITE },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: WHITE },
  },
  rows: [new TableRow({
    children: [
      new TableCell({
        width: { size: 720, type: WidthType.DXA },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        margins: { top: 200, bottom: 200, left: 100, right: 100 },
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: num, font: "Calibri", size: 36, bold: true, color: GOLD })],
        })],
      }),
      new TableCell({
        width: { size: 8640, type: WidthType.DXA },
        margins: { top: 200, bottom: 200, left: 240, right: 200 },
        children: [
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: title, font: "Calibri", size: 26, bold: true, color: NAVY })],
          }),
          new Paragraph({
            spacing: { line: 340 },
            children: [new TextRun({ text: body, font: "Calibri", size: 24, color: INK })],
          }),
        ],
      }),
    ],
  })],
});

// Q&A pair
const qaPair = (question, answer) => [
  new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 8 } },
    indent: { left: 200 },
    children: [new TextRun({ text: question, font: "Calibri", size: 26, bold: true, color: NAVY })],
  }),
  new Paragraph({
    spacing: { after: 160 },
    indent: { left: 200 },
    children: [new TextRun({ text: answer, font: "Calibri", size: 24, color: ACCENT })],
  }),
];

// ---------- Document ----------
const doc = new Document({
  creator: "Rodney Coutinho",
  title: "AI in FS - Misconceptions & First Principles - Part 1 - Banks",
  styles: {
    default: { document: { run: { font: "Calibri", size: 26 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 720, left: 1440 },
      },
    },
    children: [

      // ===== PAGE 1: HERO =====
      chartImage("hero_part1.png", 648, 432),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 2: THE MISCONCEPTION INTRO =====
      brandImage("masthead_enterprise_ai.png", 620, 77, { after: 200 }),

      new Paragraph({
        spacing: { before: 60, after: 40 },
        children: [new TextRun({
          text: "AI IN FINANCIAL SERVICES  //  MISCONCEPTIONS & FIRST PRINCIPLES",
          font: "Calibri", size: 18, bold: true, color: BLUE, characterSpacing: 40,
        })],
      }),

      new Paragraph({
        spacing: { before: 40, after: 160 },
        children: [new TextRun({
          text: "PART 1 OF 4  //  BANKS",
          font: "Calibri", size: 18, color: GOLD, characterSpacing: 60,
        })],
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "The most expensive misconception in banking AI.",
          font: "Calibri", size: 40, bold: true, color: NAVY,
        })],
      }),

      para([
        run("There is a misconception that is quietly burning through AI budgets in every major bank I advise.", { size: 26 }),
      ], { after: 200 }),

      calloutBox('"We gave the model our financial data and asked it to write the credit memo."', { accent: RED, color: RED, size: 28 }),

      spacer(200),

      para([
        run("Then the committee received a memo where the DSCR was 2.56x in one paragraph and 2.81x three paragraphs later. Same borrower. Same data. Two different numbers.", { size: 26 }),
      ], { after: 200 }),

      para([
        run("I have spent twenty years building AI and data capabilities inside banks — HSBC, UBS, Lloyds, Deloitte. The pattern I see in 2026 is the same one I saw in 2018 with RPA: ", { size: 26 }),
        run("banks deploy the technology before designing the architecture.", { size: 26, bold: true }),
      ], { after: 200 }),

      calloutBox("The result is always the same. Impressive demos. Failed pilots. Sceptical boards.", { accent: GOLD, bold: true, italics: false }),

      ...pageFooter("02"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 3: THE MISCONCEPTION =====
      sectionHeading("The misconception"),

      headlineBox(
        "THE MISCONCEPTION",
        '"AI should do everything."',
        "Ingest the data. Compute the ratios. Assess the risks. Write the narrative. Assign the rating. Produce the memo.",
        ""
      ),

      spacer(300),

      para([
        run("Large language models are ", { size: 26 }),
        run("probabilistic.", { size: 26, bold: true }),
        run(" They predict the next token. That’s what makes them extraordinary at reasoning, synthesis, and narrative — and ", { size: 26 }),
        run("fundamentally unreliable at arithmetic.", { size: 26, bold: true, color: RED }),
      ], { after: 240 }),

      para([
        run("When the model computes a ratio, it’s not dividing two numbers. It’s predicting what the answer ", { size: 26 }),
        run("probably looks like", { size: 26, italics: true }),
        run(" based on patterns in its training data.", { size: 26 }),
      ], { after: 240 }),

      calloutBox("For a chatbot, that’s fine. For a credit memorandum that goes to committee, it’s negligent.", { accent: RED, size: 28, bold: true, italics: false }),

      ...pageFooter("03"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 4: THE FIRST PRINCIPLE =====
      sectionHeading("The first principle"),

      headlineBox(
        "THE FIRST PRINCIPLE",
        "AI orchestrates. Code computes.",
        "The architecture that works in production separates two concerns completely.",
        "Deterministic tools handle arithmetic. AI adds judgment."
      ),

      spacer(300),

      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [new TextRun({
          text: "Phase 1 — Code computes.",
          font: "Calibri", size: 28, bold: true, color: ACCENT,
        })],
      }),

      para([
        run("Every number in the credit memo is calculated by deterministic Python functions. Current Ratio, Debt/Equity, Net Debt/EBITDA, DSCR, Interest Coverage — twelve ratios, each a pure function. Same input, same output, every time. ", { size: 26 }),
        run("Unit-tested. Auditable.", { size: 26, bold: true }),
      ], { after: 300 }),

      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [new TextRun({
          text: "Phase 2 — AI judges.",
          font: "Calibri", size: 28, bold: true, color: ACCENT,
        })],
      }),

      para([
        run("The model receives the pre-computed ratios, the risk flags, the peer benchmarks. It never touches a calculator. Instead, it does what it’s genuinely good at:", { size: 26 }),
      ], { after: 200 }),

      calloutBox("“Current leverage is below peer median, but post-facility pro-forma leverage of approximately 1.99x warrants covenant protection at 2.75x.”", { size: 26 }),

      spacer(200),

      para([
        run("Qualitative judgment informed by structured data. ", { size: 26 }),
        run("No hallucinated numbers. No inconsistent ratios. No audit findings.", { size: 26, bold: true, color: NAVY }),
      ]),

      ...pageFooter("04"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 5: THE NUMBERS =====
      sectionHeading("What this looks like in practice"),

      para([
        run("I built a credit memo agent to test this principle. Not a slide deck — ", { size: 26 }),
        run("a working agent", { size: 26, bold: true }),
        run(" that runs on the Claude Agent SDK and produces committee-ready structured output.", { size: 26 }),
      ], { after: 200 }),

      para([
        run("SAR 500M term loan request. Tadawul-listed cement company.", { size: 26, italics: true, color: ACCENT }),
      ], { after: 300 }),

      statRow([
        ["$0.35", "COST PER MEMO"],
        ["10", "RATIOS COMPUTED"],
        ["18", "COVENANTS DRAFTED"],
      ]),

      spacer(300),

      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [new TextRun({
          text: "Phase 1 completes in under a second.",
          font: "Calibri", size: 26, bold: true, color: ACCENT,
        })],
      }),

      para([
        run("Ten credit ratios computed. Three risk flags raised. Data completeness validated at 100%. Every number traceable to source.", { size: 26 }),
      ], { after: 260 }),

      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [new TextRun({
          text: "Phase 2 takes thirty seconds.",
          font: "Calibri", size: 26, bold: true, color: ACCENT,
        })],
      }),

      para([
        run("Full credit memorandum: financial narrative, ratio-by-ratio commentary, five risk factors with mitigation strategies, and a recommendation — ", { size: 26 }),
        run("APPROVE WITH CONDITIONS", { size: 26, bold: true, color: NAVY }),
        run(" — with eighteen covenants.", { size: 26 }),
      ], { after: 260 }),

      calloutBox("A senior analyst doing the same work manually: 4–6 hours and ~$500 in fully loaded cost. The agent: 30 seconds and $0.35.", { accent: GOLD, italics: false, bold: true }),

      ...pageFooter("05"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 6: WHAT TO DO WITH THE CAPACITY =====
      sectionHeading("What to do with the capacity"),

      para([
        run("The question every CRO should be asking is not ", { size: 26 }),
        run('"how many analysts can I cut?"', { size: 26, italics: true }),
        run(" It is ", { size: 26 }),
        run('"what can my credit team do with 4,000 recovered hours per year?"', { size: 26, bold: true, color: NAVY }),
      ], { after: 200 }),

      reasonCard("1", "More deals analysed.",
        "200 memos at 6 hours each = 1,200 hours. At 20 minutes each, the team reclaims 1,000 hours. Capacity for 300 additional deal reviews — without a single new hire."
      ),

      spacer(160),

      reasonCard("2", "Deeper risk coverage.",
        "The analyst focuses on what the model cannot see: the management meeting, the site visit, the sector rumour, the regulatory change coming in Q3."
      ),

      spacer(160),

      reasonCard("3", "Faster time-to-decision.",
        "A 3-day credit turnaround becomes same-day. In syndicated facilities and acquisition finance, speed is the differentiator. The bank that responds in 24 hours wins the mandate."
      ),

      spacer(160),

      reasonCard("4", "A better audit trail than the manual process.",
        "Every ratio is traceable. Every AI judgment is logged. Every analyst edit is captured as a diff. The AI-assisted memo is more auditable than the one written by hand."
      ),

      spacer(200),

      calloutBox("The bank that gets this right does not just save analyst hours. It changes the economics of credit origination.", { accent: GOLD, bold: true, italics: false }),

      ...pageFooter("06"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 7: WHY BANKS GET IT WRONG =====
      sectionHeading("Why banks keep getting this wrong"),

      spacer(200),

      reasonCard("1", "They start with the demo.",
        "A vendor shows the board a prompt that turns a PDF into a credit memo in sixty seconds. The board is impressed. Nobody asks whether the DSCR in paragraph four matches the DSCR in the ratio table."
      ),

      spacer(240),

      reasonCard("2", "They treat the AI as a black box.",
        "The model ingests data and produces output. Nobody can explain what happened in between. When the regulator asks “how did you arrive at this rating?”, the answer is “the model said so.” That answer does not survive a SAMA examination."
      ),

      spacer(240),

      reasonCard("3", "They skip the guardrails.",
        "In production, every tool call passes through safety checks, quality checks, and compliance checks. These are the difference between a system that works and a system that gets shut down after the first incident."
      ),

      spacer(300),

      calloutBox("The banks that will lead are the ones that get the architecture right now — before the regulator mandates it.", { accent: GOLD, bold: true, italics: false }),

      ...pageFooter("07"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 7: THE ADVISORY CONVERSATION =====
      sectionHeading("The advisory conversation"),

      para([
        run("When I sit with a CRO or a Head of Credit, the question is never “can AI write a credit memo?” They know it can. The question is always:", { size: 26, italics: true }),
      ], { after: 240 }),

      ...qaPair(
        "“How do I make sure the numbers are right?”",
        "Deterministic tools. Unit-tested. The AI never computes."
      ),

      ...qaPair(
        "“How do I explain this to the regulator?”",
        "Audit trail. Every tool call logged. Every analyst edit captured."
      ),

      ...qaPair(
        "“What happens when it gets it wrong?”",
        "Guardrails catch it before the committee sees it. A human always signs off."
      ),

      ...qaPair(
        "“What does it cost?”",
        "$0.35 per memo at the AI layer. The real cost is the architecture."
      ),

      ...qaPair(
        "“Who else is doing this?”",
        "Everyone is experimenting. Almost nobody is in production."
      ),

      ...pageFooter("09"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 9: SERIES TRACKER =====
      sectionHeading("The series"),

      para([
        run("Four parts. Four verticals. Four misconceptions. Four first principles. Each with a working example.", { size: 26 }),
      ], { after: 280 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [640, 2200, 6520],
        rows: [
          seriesRow("01", "Banks", '"AI should do everything." — This article', true),
          seriesRow("02", "Exchanges", '"AI replaces the analyst." — Next week', false),
          seriesRow("03", "Investment Mgmt", '"AI governance is a compliance exercise."', false),
          seriesRow("04", "Insurance", '"You need perfect data before you start."', false),
        ],
      }),

      spacer(300),

      calloutBox("Next week — Part 2: What happens when you apply this principle to prospectus review at a stock exchange. The misconception changes. The first principle doesn’t.", { accent: BLUE }),

      spacer(300),

      // Bottom line — gold accent
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [9360],
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: GOLD },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD },
          left: { style: BorderStyle.SINGLE, size: 1, color: GOLD },
          right: { style: BorderStyle.SINGLE, size: 1, color: GOLD },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: WHITE },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: WHITE },
        },
        rows: [new TableRow({
          children: [new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            margins: { top: 240, bottom: 240, left: 300, right: 300 },
            children: [new Paragraph({
              spacing: { line: 360 },
              children: [new TextRun({
                text: "The misconception — that AI should do everything — is the most expensive mistake in banking AI today. The principle — that code computes and AI judges — is the cheapest fix.",
                font: "Calibri", size: 26, bold: true, color: NAVY,
              })],
            })],
          })],
        })],
      }),

      spacer(300),

      // Author block
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({
          text: "RODNEY COUTINHO",
          font: "Calibri", size: 24, bold: true, color: NAVY, characterSpacing: 40,
        })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({
          text: "Founder, Enterprise.AI  //  Executive Advisor on AI",
          font: "Calibri", size: 20, color: ACCENT,
        })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({
          text: "AI Strategy, Governance & Deployment  //  Financial Services",
          font: "Calibri", size: 20, color: GREY,
        })],
      }),

      ...pageFooter("09"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 10: CUSTOM CLOSING CARD =====
      // Enterprise.AI branded closer (no old RODNEY.AI asset)
      spacer(600),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({
          text: "ENTERPRISE.AI",
          font: "Calibri", size: 56, bold: true, color: NAVY, characterSpacing: 120,
        })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 12 } },
        children: [new TextRun({
          text: "SCALE  ·  GOVERN  ·  UNLOCK",
          font: "Calibri", size: 22, bold: true, color: GOLD, characterSpacing: 160,
        })],
      }),

      spacer(200),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Executive Advisor on AI",
          font: "Calibri", size: 28, color: ACCENT,
        })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Banking  ·  Capital Markets  ·  Insurance  ·  Investment Management",
          font: "Calibri", size: 22, color: GREY,
        })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({
          text: "Middle East  ·  Europe",
          font: "Calibri", size: 22, color: GREY,
        })],
      }),

      spacer(400),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({
          text: "theenterpriseai.co.uk",
          font: "Calibri", size: 20, color: BLUE,
        })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({
          text: "linkedin.com/in/rodneycoutinho",
          font: "Calibri", size: 20, color: BLUE,
        })],
      }),

      spacer(300),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({
          text: "AI IN FINANCIAL SERVICES  //  MISCONCEPTIONS & FIRST PRINCIPLES",
          font: "Calibri", size: 16, color: GREY, characterSpacing: 40,
        })],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({
          text: "PART 1 OF 4  //  BANKS",
          font: "Calibri", size: 16, color: GOLD, characterSpacing: 60,
        })],
      }),

    ],
  }],
});

// Write
const OUT = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-1-banks";
Packer.toBuffer(doc).then(buf => {
  const outPath = `${OUT}/AI-in-FS-Misconceptions-Part1-Banks.docx`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${buf.length} bytes)`);
});
