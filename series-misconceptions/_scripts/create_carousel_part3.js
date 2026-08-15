const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system (same as Part 1) ----------
const NAVY   = "0D1B2A";
const ACCENT = "1B4F72";
const BLUE   = "2874A6";
const GREY   = "6C757D";
const LIGHT  = "F2F6FA";
const GOLD   = "C9A227";
const INK    = "1F2933";
const RED    = "B22222";
const WHITE  = "FFFFFF";
const GREEN  = "228B22";
const TEAL   = "0F766E";

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
        text: `ENTERPRISE.AI  //  AI IN FS: MISCONCEPTIONS & FIRST PRINCIPLES  //  PART 3 OF 4  //  ${pageNum}`,
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
    insideVertical: { style: BorderStyle.NONE, size: 0, color: WHITE },
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
            ...(caption ? [new Paragraph({
              children: [new TextRun({
                text: caption, font: "Calibri", size: 22, italics: true, color: "9FB6CC",
              })],
            })] : []),
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

// Comparison table row
const comparisonRow = (left, right, isHeader = false) => new TableRow({
  children: [
    new TableCell({
      width: { size: 4680, type: WidthType.DXA },
      shading: { fill: isHeader ? NAVY : "FFF5F5", type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      },
      children: [new Paragraph({
        children: [new TextRun({
          text: left, font: "Calibri",
          size: isHeader ? 22 : 24,
          bold: isHeader, color: isHeader ? RED : INK,
        })],
      })],
    }),
    new TableCell({
      width: { size: 4680, type: WidthType.DXA },
      shading: { fill: isHeader ? NAVY : "F0FFF0", type: ShadingType.CLEAR },
      margins: { top: 160, bottom: 160, left: 200, right: 200 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      },
      children: [new Paragraph({
        children: [new TextRun({
          text: right, font: "Calibri",
          size: isHeader ? 22 : 24,
          bold: isHeader, color: isHeader ? WHITE : ACCENT,
        })],
      })],
    }),
  ],
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

// Image helpers
const CHARTS_DIR = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-3-investment-management/charts";
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

// ---------- Document ----------
const doc = new Document({
  creator: "Rodney Coutinho",
  title: "AI in FS - Misconceptions & First Principles - Part 3 - Investment Management",
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
      chartImage("hero_part3.png", 648, 480),

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
          text: "PART 3 OF 4  //  INVESTMENT MANAGEMENT",
          font: "Calibri", size: 18, color: GOLD, characterSpacing: 60,
        })],
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "The most dangerous misconception in asset management AI.",
          font: "Calibri", size: 40, bold: true, color: NAVY,
        })],
      }),

      para([
        run("An asset manager deploys an AI agent to generate the daily Chief Investment Officer risk report. Factor exposures, sector tilts, VaR exceptions — synthesised into a narrative summary every morning.", { size: 26 }),
      ], { after: 200 }),

      calloutBox("One morning, the report includes a $40 million equity position that does not exist. The AI hallucinated it. Nobody catches it for three weeks.", { accent: RED, color: RED, size: 28 }),

      spacer(200),

      para([
        run('When the post-mortem happens, the first question is: "Where was the governance?"', { size: 26 }),
      ], { after: 200 }),

      para([
        run("The answer: a 40-page PDF in the compliance folder. Approved by the board. Last reviewed in Q1. It said all the right things. ", { size: 26 }),
        run("It governed nothing.", { size: 26, bold: true }),
      ]),

      ...pageFooter("02"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 3: THE MISCONCEPTION =====
      sectionHeading("The misconception"),

      headlineBox(
        "THE MISCONCEPTION",
        '"AI governance is a compliance exercise."',
        "Write the policy. Get the board to sign it. Tick the regulatory box. Move on.",
        ""
      ),

      spacer(200),

      para([
        run("This misconception is especially dangerous because ", { size: 24 }),
        run("the regulatory landscape is shifting underneath firms right now.", { size: 24, bold: true }),
      ], { after: 160 }),

      reasonCard("1", "SR 11-7 rescinded (April 2026)",
        'The new interagency guidance explicitly excludes generative AI as "novel and rapidly evolving." The regulators have not caught up yet.'
      ),

      spacer(80),

      reasonCard("2", "EU AI Act goes live (August 2026)",
        "Portfolio management, risk assessment, and client suitability AI now face mandatory requirements: risk management systems, bias testing, human oversight — all before deployment."
      ),

      spacer(80),

      reasonCard("3", "SDAIA Responsible AI Policy (April 2026)",
        "Saudi Arabia draft framework introduces risk-tiering with proportionate obligations. A Chief Investment Officer risk report agent is high-tier."
      ),

      spacer(120),

      calloutBox("The regulators are moving. The frameworks are multiplying. And most firms response is the same: update the policy document.", { accent: RED, bold: true, italics: false, size: 24 }),

      ...pageFooter("03"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 4: THE FIRST PRINCIPLE =====
      sectionHeading("The first principle"),

      headlineBox(
        "THE FIRST PRINCIPLE",
        "Governance is architecture, not paperwork.",
        "The policy describes governance. Governance is what runs in production.",
        "Show me the code."
      ),

      spacer(300),

      // Comparison table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          comparisonRow("GOVERNANCE-AS-PAPERWORK", "GOVERNANCE-AS-ARCHITECTURE", true),
          comparisonRow("AI policy signed by CRO", "Guardrail code deployed in production"),
          comparisonRow("Annual model validation", "Continuous output validation on every call"),
          comparisonRow("Risk register updated quarterly", "Runtime anomaly detection flags in real time"),
          comparisonRow("Data classification matrix", "Code that blocks PII from leaving the perimeter"),
          comparisonRow("Incident response plan (untested)", "Circuit breaker that halts the agent automatically"),
        ],
      }),

      ...pageFooter("04"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 5: THE THREE GUARDRAIL LAYERS =====
      sectionHeading("What this looks like in practice"),

      para([
        run("I designed a ", { size: 24 }),
        run("portfolio risk agent", { size: 24, bold: true }),
        run(" — it generates the daily Chief Investment Officer risk summary from factor exposures. Three guardrail layers, all runtime code.", { size: 24 }),
      ], { after: 160 }),

      statRow([
        ["Safety", "BLOCK BEFORE BREACH"],
        ["Quality", "CATCH BEFORE ERROR"],
        ["Compliance", "LOG BEFORE AUDIT"],
      ]),

      spacer(200),

      reasonCard("1", "Safety guardrails",
        "The agent is sandboxed: read-only access to the risk system. Cannot write, cannot access unapproved systems, cannot transmit position data externally. Blocked, logged, alerted."
      ),

      spacer(100),

      reasonCard("2", "Quality guardrails",
        "Every position is cross-validated against actual holdings. Hallucinated position? Caught in milliseconds. Narrative contradicts numbers? Flagged. NaN or out-of-range values? Rejected and regenerated."
      ),

      spacer(100),

      reasonCard("3", "Compliance guardrails",
        "Every query logged with timestamp, input hash, output hash — not the content. Satisfies audit trail without exposing position data. Restricted window? Trade-adjacent recommendations blocked entirely."
      ),

      ...pageFooter("05"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 6: REGULATORY ALIGNMENT =====
      sectionHeading("Regulatory alignment"),

      para([
        run("The three guardrail layers map directly to what regulators are now requiring.", { size: 24, bold: true }),
      ], { after: 200 }),

      reasonCard("✓", "New interagency MRM guidance",
        "Requires ongoing monitoring — not annual validation. Runtime guardrails provide continuous monitoring on every call."
      ),

      spacer(100),

      reasonCard("✓", "EU AI Act (August 2026)",
        "Requires risk management systems, human oversight, and documentation for high-risk AI. The guardrail architecture provides all three."
      ),

      spacer(100),

      reasonCard("✓", "SDAIA Responsible AI Policy",
        "Requires proportionate controls based on risk tier. A Chief Investment Officer risk report agent is high-tier. The code enforces it."
      ),

      spacer(100),

      reasonCard("✓", "ESMA AI Guidance",
        "Requires testing and monitoring proportionate to complexity. The circuit breaker halts the agent when quality degrades — monitoring that scales automatically."
      ),

      spacer(140),

      calloutBox("The firms that build governance into their architecture are not just better governed. They are the ones that will pass the audits that are coming.", { accent: GOLD, bold: true, italics: false, size: 24 }),

      ...pageFooter("06"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 7: THE ADVISORY CONVERSATION =====
      sectionHeading("The advisory conversation"),

      para([
        run('When I sit with a Chief Investment Officer or Head of Risk at an asset manager, the questions are always the same:', { size: 26, italics: true }),
      ], { after: 240 }),

      ...qaPair(
        '"We already have a governance framework."',
        'Show me the code. If your governance lives in a document, it governs nothing. If it lives in production, it governs everything.'
      ),

      ...qaPair(
        '"SR 11-7 compliance was our priority."',
        'SR 11-7 was rescinded in April 2026. The replacement explicitly excludes generative AI. The regulators have not caught up yet. That makes your architecture decisions more important, not less.'
      ),

      ...qaPair(
        '"We cannot log everything — data privacy."',
        'You log the hash, not the content. The audit trail proves what was asked and answered without exposing position-level data. This is a solved design problem.'
      ),

      ...qaPair(
        '"What about model drift?"',
        'In an LLM-based agent, drift means the model reasoning quality degrades after a version update. The quality guardrail catches it: if outputs start failing validation checks, the circuit breaker fires.'
      ),

      ...qaPair(
        '"Who owns this?"',
        'The CTO builds it. The CRO signs it. The CISO secures it. The COO operates it. If you are asking who owns it, you have identified the problem.'
      ),

      ...pageFooter("07"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 8: SERIES TRACKER =====
      sectionHeading("The series"),

      para([
        run("Four parts. Four verticals. Four misconceptions. Four first principles. Each with a working example.", { size: 26 }),
      ], { after: 280 }),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [640, 2200, 6520],
        rows: [
          seriesRow("01", "Banks", '"AI should do everything." — Published', false),
          seriesRow("02", "Exchanges", '"AI replaces the analyst." — Published', false),
          seriesRow("03", "Investment Mgmt", '"AI governance is a compliance exercise." — This article', true),
          seriesRow("04", "Insurance", '"You need perfect data before you start." — Next week', false),
        ],
      }),

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
            children: [
              new Paragraph({
                spacing: { line: 360, after: 160 },
                children: [new TextRun({
                  text: "The misconception — that writing the policy is the governance — is the most dangerous mistake in asset management AI today.",
                  font: "Calibri", size: 26, bold: true, color: NAVY,
                })],
              }),
              new Paragraph({
                spacing: { line: 360 },
                children: [new TextRun({
                  text: "The principle — that governance is architecture, not paperwork — means three things: safety guardrails that block before the breach, quality guardrails that catch before the error, compliance guardrails that log before the auditor asks.",
                  font: "Calibri", size: 26, bold: true, color: NAVY,
                })],
              }),
            ],
          })],
        })],
      }),

      spacer(200),

      calloutBox("Next week — Part 4: We have established that code computes, humans decide, and governance is architecture. Part 4 asks a harder question: what if your data is not ready?", { accent: BLUE }),

      spacer(200),

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

      ...pageFooter("08"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 9: CLOSING CARD =====
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
          text: "PART 3 OF 4  //  INVESTMENT MANAGEMENT",
          font: "Calibri", size: 16, color: GOLD, characterSpacing: 60,
        })],
      }),

    ],
  }],
});

// Write
const OUT = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-3-investment-management";
Packer.toBuffer(doc).then(buf => {
  const outPath = `${OUT}/AI-in-FS-Misconceptions-Part3-InvestmentMgmt.docx`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${buf.length} bytes)`);
});
