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
        text: `ENTERPRISE.AI  //  AI IN FS: MISCONCEPTIONS & FIRST PRINCIPLES  //  PART 4 OF 4  //  ${pageNum}`,
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
const CHARTS_DIR = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-4-insurance/charts";
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
  title: "AI in FS - Misconceptions & First Principles - Part 4 - Insurance",
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
      chartImage("hero_part4.png", 648, 480),

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
          text: "PART 4 OF 4  //  INSURANCE",
          font: "Calibri", size: 18, color: GOLD, characterSpacing: 60,
        })],
      }),

      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({
          text: "The most expensive mistake in insurance AI today.",
          font: "Calibri", size: 40, bold: true, color: NAVY,
        })],
      }),

      para([
        run("An insurer sits on fifteen years of claims data in three systems. Different formats. Different codes. Medical reports scanned as PDFs in 2012. Loss adjuster notes buried in emails.", { size: 26 }),
      ], { after: 200 }),

      para([
        run("So the firm launches a data lake project. Eighteen months later, it is not finished.", { size: 26 }),
      ], { after: 200 }),

      calloutBox("Research shows approximately 80% of data lake initiatives fail to deliver their promised value. The data lake becomes the prerequisite for everything and the deliverable of nothing.", { accent: RED, color: RED, size: 28 }),

      spacer(200),

      para([
        run("Meanwhile, underwriters still read forty-page broker submissions manually. Two to three hours per submission. Seventy percent of their time on data extraction.", { size: 26 }),
      ]),

      ...pageFooter("02"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 3: THE MISCONCEPTION =====
      sectionHeading("The misconception"),

      headlineBox(
        "THE MISCONCEPTION",
        '"You need perfect data before you start."',
        "Clean the data. Standardise the formats. Build the lake. Then deploy.",
        ""
      ),

      spacer(200),

      para([
        run("This sounds reasonable. ", { size: 24 }),
        run("It is the most expensive mistake in insurance AI today.", { size: 24, bold: true }),
      ], { after: 160 }),

      reasonCard("1", "Data cleaning is not a finite project",
        "Claims data from 2012 coded differently from 2018. Medical reports are unstructured PDFs. Broker submissions arrive as a bundle of formats — no two the same."
      ),

      spacer(80),

      reasonCard("2", "74% extract, only 14% deploy",
        "74% of Lloyd’s firms use AI for data extraction. Only 14% have deployed agents inside the underwriting workflow. The gap is where the advantage is being built."
      ),

      spacer(80),

      reasonCard("3", "80% of data lake projects fail",
        "The data lake becomes the prerequisite for everything and the deliverable of nothing. Average implementation: 18+ months."
      ),

      spacer(120),

      calloutBox("The firms waiting for clean data are not building the advantage. The competitive landscape is moving without them.", { accent: RED, bold: true, italics: false, size: 24 }),

      ...pageFooter("03"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 4: THE FIRST PRINCIPLE =====
      sectionHeading("The first principle"),

      headlineBox(
        "THE FIRST PRINCIPLE",
        "Start with structure, not cleanliness.",
        "An ontology tells the AI what to look for. Clean data is the output, not the prerequisite.",
        "Show me the schema."
      ),

      spacer(300),

      // Comparison table
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [4680, 4680],
        rows: [
          comparisonRow("CLEAN-DATA-FIRST", "ONTOLOGY-FIRST AI", true),
          comparisonRow("Clean 15 years of historical data", "Define the schema, extract against it"),
          comparisonRow("18-month data lake project", "Agent producing structured data from day one"),
          comparisonRow("Data quality as prerequisite", "Data quality as byproduct of productive work"),
          comparisonRow("Separate cleanup before AI", "Every extraction is a validation"),
          comparisonRow("Project that never finishes", "Incremental improvement with every submission"),
        ],
      }),

      ...pageFooter("04"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 5: WORKING EXAMPLE =====
      sectionHeading("What this looks like in practice"),

      para([
        run("I designed an underwriting triage agent — it ingests broker submissions and extracts risk features against a defined ontology.", { size: 24 }),
      ], { after: 160 }),

      statRow([
        ["15", "RISK CATEGORIES"],
        ["40+", "FEATURES PER CATEGORY"],
        ["20 min", "UNDERWRITER REVIEW"],
      ]),

      spacer(200),

      reasonCard("1", "Define the ontology",
        "15 risk categories — property, liability, workers comp, auto, umbrella, cyber. 40+ features per category. Acceptable ranges. Required documentation."
      ),

      spacer(100),

      reasonCard("2", "Extract against the schema",
        "Agent ingests the submission package — PDFs, emails, spreadsheets — and extracts structured data against the ontology. Not freeform. Structured."
      ),

      spacer(100),

      reasonCard("3", "Validate and flag",
        '"Declared revenue ($12M) inconsistent with employee count (3). Expected range: $2M–$8M." The agent surfaces the anomaly. The human resolves it.'
      ),

      spacer(100),

      reasonCard("4", "Data quality improves",
        "Every extraction populates the structured dataset. Anomalies surface. Patterns emerge. The data lake fills as a byproduct — not a prerequisite."
      ),

      ...pageFooter("05"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 6: REGULATORY ALIGNMENT =====
      sectionHeading("Regulatory alignment"),

      para([
        run("Ontology-first extraction maps directly to what regulators are now requiring.", { size: 24, bold: true }),
      ], { after: 200 }),

      reasonCard("✓", "EU AI Act (August 2026)",
        "Requires auditable documentation, bias testing, decision explainability. Ontology-defined extraction produces a structured, auditable record of what was extracted."
      ),

      spacer(100),

      reasonCard("✓", "SDAIA Responsible AI Policy (April 2026)",
        "Risk-tiering framework with proportionate obligations. An underwriting triage agent is high-tier. The ontology provides the documentation the regulator needs."
      ),

      spacer(100),

      reasonCard("✓", "IFRS 17",
        "Fundamentally changed how insurers measure and report contracts. Ontology-first extraction produces data in the shape that IFRS 17 measurement models require."
      ),

      spacer(100),

      reasonCard("✓", "LMA AI Adoption Toolkit (April 2026)",
        "Practical guidance on risk tiering, data protection, accountability. Encourages exactly the structured approach: define, govern, deploy incrementally."
      ),

      spacer(140),

      calloutBox("The firms that build structure first are not just better governed. They are the ones that will pass the audits that are coming.", { accent: GOLD, bold: true, italics: false, size: 24 }),

      ...pageFooter("06"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 7: THE ADVISORY CONVERSATION =====
      sectionHeading("The advisory conversation"),

      para([
        run('When I sit with a Chief Underwriting Officer or Head of Claims, the questions are always the same:', { size: 26, italics: true }),
      ], { after: 240 }),

      ...qaPair(
        '"Our data is too messy for AI."',
        'That is exactly why you need AI. The agent extracts structure from mess. Every extraction improves the data. Waiting for clean data is waiting forever.'
      ),

      ...qaPair(
        '"We tried an AI project and it failed because of data quality."',
        'Did you define the ontology first? Or did you point the model at raw data and hope? Structure is the prerequisite, not cleanliness.'
      ),

      ...qaPair(
        '"What about Solvency II and IFRS 17?"',
        'The ontology is your regulatory map. Define features that align with risk categories and measurement models. The extraction produces data in the shape the regulator needs.'
      ),

      ...qaPair(
        '"How do we handle medical data?"',
        'PII guardrails from Part 3. Medical data never leaves the environment. Extraction produces structured risk features, not raw medical text.'
      ),

      ...qaPair(
        '"What about legacy systems?"',
        'The agent reads what your systems produce — PDFs, emails, spreadsheets. It requires document access, not system integration. That is a much simpler problem.'
      ),

      ...pageFooter("07"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== PAGE 8: SERIES TRACKER + BOTTOM LINE =====
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
          seriesRow("03", "Investment Mgmt", '"AI governance is a compliance exercise." — Published', false),
          seriesRow("04", "Insurance", '"You need perfect data before you start." — This article', true),
        ],
      }),

      spacer(300),

      // Series closer — gold-bordered box with THREE paragraphs
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
                  text: "Four industries. One pattern.",
                  font: "Calibri", size: 26, bold: true, color: NAVY,
                })],
              }),
              new Paragraph({
                spacing: { line: 360, after: 160 },
                children: [new TextRun({
                  text: "Code computes. Humans decide. Governance is architecture. Structure before cleanliness.",
                  font: "Calibri", size: 26, bold: true, color: NAVY,
                })],
              }),
              new Paragraph({
                spacing: { line: 360 },
                children: [new TextRun({
                  text: "The misconception changes. The first principles do not.",
                  font: "Calibri", size: 26, bold: true, color: NAVY,
                })],
              }),
            ],
          })],
        })],
      }),

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
          text: "PART 4 OF 4  //  INSURANCE",
          font: "Calibri", size: 16, color: GOLD, characterSpacing: 60,
        })],
      }),

    ],
  }],
});

// Write
const OUT = "/sessions/cool-elegant-cori/mnt/Claude/rodney-ai/series-misconceptions/part-4-insurance";
Packer.toBuffer(doc).then(buf => {
  const outPath = `${OUT}/AI-in-FS-Misconceptions-Part4-Insurance.docx`;
  fs.writeFileSync(outPath, buf);
  console.log(`Saved: ${outPath} (${buf.length} bytes)`);
});
