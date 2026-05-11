const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system (same as Part 1 & 2) ----------
const NAVY   = "0D1B2A";
const ACCENT = "1B4F72";
const BLUE   = "2874A6";
const GREY   = "6C757D";
const LIGHT  = "F2F6FA";
const GOLD   = "C9A227";
const INK    = "1F2933";

// ---------- Helpers (same as Part 1 & 2) ----------
const run = (text, opts = {}) => new TextRun({
  text,
  font: "Calibri",
  size: opts.size || 22,
  color: opts.color || INK,
  bold: opts.bold || false,
  italics: opts.italics || false,
});

const para = (children, opts = {}) => new Paragraph({
  alignment: opts.alignment || AlignmentType.LEFT,
  spacing: { before: opts.before || 0, after: opts.after || 120, line: 300 },
  indent: opts.indent,
  children: Array.isArray(children) ? children : [children],
});

const spacer = (after = 120) => new Paragraph({ spacing: { after }, children: [run("")] });

const sectionHeading = (text) => new Paragraph({
  spacing: { before: 260, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 4 } },
  children: [new TextRun({
    text: text.toUpperCase(),
    font: "Calibri", size: 22, bold: true, color: NAVY, characterSpacing: 40
  })],
});

const lever = (label, body) => [
  new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text: label, font: "Calibri", size: 22, bold: true, color: ACCENT })],
  }),
  new Paragraph({
    spacing: { after: 120, line: 300 },
    children: [run(body)],
  }),
];

const calloutBox = (text) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    bottom: { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    left:   { style: BorderStyle.SINGLE, size: 24, color: BLUE },
    right:  { style: BorderStyle.SINGLE, size: 1,  color: BLUE },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: LIGHT, type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 280, right: 280 },
          children: [
            new Paragraph({
              spacing: { line: 320 },
              children: [new TextRun({ text, font: "Calibri", size: 22, italics: true, color: NAVY })],
            }),
          ],
        }),
      ],
    }),
  ],
});

const headlineBox = (stat, context, caption) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [9360],
  borders: {
    top:    { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    left:   { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    right:  { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  },
  rows: [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 9360, type: WidthType.DXA },
          shading: { fill: NAVY, type: ShadingType.CLEAR },
          margins: { top: 260, bottom: 260, left: 320, right: 320 },
          children: [
            new Paragraph({
              spacing: { after: 40 },
              children: [new TextRun({
                text: "THE LEVER", font: "Calibri", size: 18, bold: true,
                color: "BFD4E8", characterSpacing: 80,
              })],
            }),
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({
                text: stat, font: "Calibri", size: 48, bold: true, color: "FFFFFF",
              })],
            }),
            new Paragraph({
              spacing: { after: 20, line: 300 },
              children: [new TextRun({
                text: context, font: "Calibri", size: 22, color: "FFFFFF",
              })],
            }),
            new Paragraph({
              children: [new TextRun({
                text: caption, font: "Calibri", size: 18, italics: true, color: "9FB6CC",
              })],
            }),
          ],
        }),
      ],
    }),
  ],
});

// Scoreboard table — Capital Efficiency sub-lever view
const scoreboardTable = () => {
  const headerCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      left:   { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      right:  { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: "Calibri", size: 18, bold: true, color: "FFFFFF" })],
    })],
  });

  const bodyCell = (text, width, opts = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: opts.fill || "FFFFFF", type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 160, right: 160 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      left:   { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      right:  { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
    },
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({
        text,
        font: "Calibri",
        size: opts.size || 20,
        bold: opts.bold || false,
        color: opts.color || INK,
      })],
    })],
  });

  const widths = [3760, 1600, 2400, 1600];
  const rows = [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell("PATHWAY", widths[0]),
        headerCell("LOW", widths[1]),
        headerCell("BASE", widths[2]),
        headerCell("HIGH", widths[3]),
      ],
    }),
    new TableRow({ children: [
      bodyCell("IRB migration & model sophistication", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.1", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("0.8", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("2.0", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("Collateral optimisation & data quality", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.1", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("0.5", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("0.8", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("Securitisation & balance sheet recycling", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.2", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("0.7", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("1.5", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("Portfolio risk-weight optimisation", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.1", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("0.5", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("1.0", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("TOTAL  //  SAR B / yr", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
      bodyCell("0.5", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      bodyCell("2.5", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
      bodyCell("5.3", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
    ]}),
  ];

  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: widths, rows });
};

// Image helper
const CHARTS_DIR = "/sessions/cool-elegant-cori/charts";
const BRAND_DIR = "/sessions/cool-elegant-cori/mnt/CV/Rodney's AI Desk/brand";

const dashboardImage = (filename, widthPx, heightPx) => new Paragraph({
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

// Roadmap row
const roadmapRow = (num, title, blurb, active) => new TableRow({
  children: [
    new TableCell({
      width: { size: 640, type: WidthType.DXA },
      shading: { fill: active ? BLUE : LIGHT, type: ShadingType.CLEAR },
      margins: { top: 140, bottom: 140, left: 120, right: 80 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: num, font: "Calibri", size: 22, bold: true, color: active ? "FFFFFF" : NAVY })],
      })],
    }),
    new TableCell({
      width: { size: 2720, type: WidthType.DXA },
      margins: { top: 140, bottom: 140, left: 160, right: 120 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      children: [new Paragraph({
        children: [new TextRun({ text: title, font: "Calibri", size: 20, bold: true, color: ACCENT })],
      })],
    }),
    new TableCell({
      width: { size: 6000, type: WidthType.DXA },
      margins: { top: 140, bottom: 140, left: 120, right: 160 },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      children: [new Paragraph({
        children: [new TextRun({ text: blurb, font: "Calibri", size: 20, color: GREY, italics: true })],
      })],
    }),
  ],
});

// ---------- Document ----------
const doc = new Document({
  creator: "Rodney Coutinho",
  title: "The Vision 2030 Bank Scoreboard - Part 3 - Capital Efficiency",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      },
    },
    children: [

      // ===== HERO PANEL =====
      dashboardImage("hero_part3.png", 620, 413),
      spacer(80),

      // ===== MASTHEAD =====
      brandImage("05_carousel_masthead.png", 620, 70, { after: 240 }),

      // ===== SERIES / TITLE =====
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({
          text: "SERIES 03  //  THE VISION 2030 BANK SCOREBOARD  //  PART 3 OF 5  //  CAPITAL EFFICIENCY",
          font: "Calibri", size: 18, bold: true, color: ACCENT, characterSpacing: 60,
        })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "Every Basis Point of RWA Density Is a Board Decision Now",
          font: "Calibri", size: 36, bold: true, color: NAVY,
        })],
      }),
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({
          text: "By Rodney Coutinho",
          font: "Calibri", size: 22, bold: true, color: NAVY,
        })],
      }),
      new Paragraph({
        spacing: { after: 240 },
        children: [new TextRun({
          text: "Executive Advisor on AI  //  Banking, Capital Markets & Sovereign Institutions  //  Middle East",
          font: "Calibri", size: 18, italics: true, color: GREY,
        })],
      }),

      // ===== OPENING =====
      para(
        run("Parts 1 and 2 of this series were about growth — new fee pools, new asset classes, new revenue lines. Part 3 is about something less glamorous and arguably more urgent: the capital you already have, and how much of it is being wasted.", { size: 24 }),
        { after: 120 }
      ),
      new Paragraph({
        spacing: { after: 200, line: 320 },
        children: [new TextRun({
          text: "Capital Efficiency. Basel IV. RWA Density. The SAR 2.5B lever hiding inside every Saudi bank’s balance sheet.",
          font: "Calibri", size: 24, bold: true, color: ACCENT,
        })],
      }),

      // ===== HEADLINE BOX =====
      headlineBox(
        "SAR 2.5 Billion",
        "of released capital per year, in the Base case. That’s not revenue — it’s capacity that can be redeployed into the growth levers from Parts 1 and 2 without issuing a single new share or AT1 sukuk.",
        "Low: SAR 0.5B  //  High: SAR 5.3B  //  Source: KSA Scoreboard Model"
      ),
      spacer(160),

      // ===== THE SQUEEZE =====
      sectionHeading("The capital squeeze  //  why this lever is urgent now"),

      para(
        run("Saudi banks are well capitalised. The sector-wide Capital Adequacy Ratio stood at 19.2% in September 2024, comfortably above SAMA’s minimums. Individual banks like Al Rajhi are running CARs above 21%. The numbers look healthy.")
      ),
      para(
        run("But look at the trajectory. SAMA has announced a countercyclical capital buffer of 1% effective May 2026. Basel III Final Reforms — what the industry calls Basel IV — are being phased in through 2028, with output floors rising by five percentage points annually until they hit 72.5%. And Saudi bank balance sheets are expanding aggressively to fund Vision 2030’s infrastructure, housing, and giga-project pipeline.")
      ),

      spacer(80),
      dashboardImage("dashboard_p3_1_capital_squeeze.png", 560, 235),
      spacer(80),

      calloutBox("Capital demand is growing faster than capital supply. Every SAR of capital that is locked up in an inefficient risk-weight is a SAR that cannot be deployed into the growth opportunities this series has been sizing. This is not a solvency conversation. It is a capacity conversation."),
      spacer(200),

      // ===== THREE FORCES =====
      sectionHeading("Three forces  //  reshaping the capital stack"),

      ...lever(
        "Force 1: Output floors bite harder than you think.",
        "The Basel IV output floor requires banks using internal ratings-based (IRB) models to hold capital equal to at least 72.5% of what the standardised approach would demand. In Europe, the estimated impact is an 18.5% average increase in RWAs, with a total capital shortfall of approximately EUR 52 billion. Saudi banks will feel this differently — most operate on the standardised approach, which means the direct output floor impact is smaller, but the opportunity cost is larger. Every bank not on IRB is carrying a higher risk-weight than its portfolio warrants."
      ),
      ...lever(
        "Force 2: AT1 sukuk issuance is accelerating — and that’s a signal.",
        "Saudi banks issued $4.2 billion in AT1 sukuk in 2025, more than double the $2 billion in 2024. Fitch projects $10 billion in 2026. This is banks recognising that organic capital generation alone cannot keep pace with balance sheet growth. AT1 sukuk are a valid tool — but also expensive capital. Every SAR of released capital from RWA optimisation is a SAR you didn’t need to raise externally."
      ),

      spacer(80),
      dashboardImage("dashboard_p3_2_at1_issuance.png", 560, 225),
      spacer(80),

      ...lever(
        "Force 3: Credit growth is outrunning capital formation.",
        "The Saudi banking sector’s ROE strengthened to 15.2% in FY2025, with a cost-to-income ratio of 29.5% in Q2 2025 — world-class operational efficiency. But the loan book is growing at double digits to support Vision 2030 financing. Banks that can run a leaner risk-weight per unit of exposure will compound that advantage across every lending decision, every quarter, for the rest of the decade."
      ),

      spacer(120),

      // ===== FOUR MOVES =====
      sectionHeading("The four moves  //  that release capital"),

      para(
        run("The Scoreboard model decomposes the Capital Efficiency lever into four distinct optimisation pathways. None requires a single new product or customer. All operate on the existing balance sheet."),
        { after: 160 }
      ),

      ...lever(
        "Move 1: IRB migration and model sophistication.",
        "Saudi banks that migrate from the standardised approach to foundation IRB (F-IRB) for their core credit portfolios can expect RWA density improvements of 5–15 percentage points on well-collateralised corporate and mortgage books. AI and machine learning enter the story here — neural network-based credit risk models deliver the strongest RWA reductions because they capture non-linear risk relationships that traditional scorecards miss. The challenge is regulatory acceptance, but the direction of travel is clear: banks with better models hold less capital for the same portfolio."
      ),
      ...lever(
        "Move 2: Collateral optimisation and data quality.",
        "European banks that have addressed poor collateral data quality have reported savings of EUR 20 million per annum in released capital. Saudi banks hold some of the richest collateral bases in the region — government-backed guarantees, real estate in appreciating markets, investment-grade securities. The question is whether the systems that calculate risk weights are capturing the full value. In many cases, they are not."
      ),
      ...lever(
        "Move 3: Securitisation and balance sheet recycling.",
        "A bank that originates SAR 10 billion in mortgage exposure at a 35% standardised risk weight is consuming SAR 3.5 billion of RWA. Securitised into a Significant Risk Transfer structure, the capital charge drops to a fraction — while retaining servicing income and customer relationships. Saudi Arabia’s securitisation market is nascent but developing, with the Saudi Real Estate Refinancing Company building the secondary mortgage market infrastructure."
      ),
      ...lever(
        "Move 4: Portfolio-level risk-weight optimisation.",
        "A bank that actively manages balance sheet composition — tilting towards exposures with lower risk weights per unit of expected return — compounds the capital efficiency benefit across the entire book. This is where the Ontology-First AI™ approach becomes load-bearing: a knowledge graph that maps every exposure to its risk weight, collateral coverage, expected loss and strategic value enables portfolio allocation decisions that are simultaneously credit-sound and capital-efficient."
      ),

      spacer(80),
      dashboardImage("dashboard_p3_3_four_moves.png", 560, 255),
      spacer(160),

      // ===== SCOREBOARD =====
      sectionHeading("The scoreboard  //  Capital Efficiency lever"),

      para(
        run("Low is the ‘comply only’ path. Base assumes a coordinated programme across at least two pathways. High assumes institution-wide capital efficiency transformation with board-level sponsorship.", { size: 20, italics: true, color: GREY }),
        { after: 140 }
      ),

      scoreboardTable(),
      spacer(160),

      dashboardImage("dashboard_p3_4_base_vs_high.png", 560, 225),
      spacer(200),

      // ===== GOVERNANCE GAP =====
      sectionHeading("What separates a Base case bank from a High case bank"),

      para(
        run("A Base case bank treats capital efficiency as a regulatory compliance exercise. It has a Basel IV programme, a capital planning team, and stress tests. It meets the numbers.")
      ),
      para(
        run("A High case bank treats capital as a strategic resource. It has a Chief Capital Officer who sits in the same room as the Chief AI Officer and the Chief Risk Officer. It uses AI to optimise the risk-return-capital equation across every new origination. It securitises not because it needs liquidity, but because recycling capital is a higher-ROE strategy than holding to maturity.")
      ),

      calloutBox("The difference between SAR 0.5B and SAR 5.3B per year is not technology. It is governance. It is a board that understands that every basis point of RWA density is a resource allocation decision — and treats it accordingly."),
      spacer(200),

      // ===== CONNECTION =====
      sectionHeading("The connection  //  why this lever feeds the others"),

      para(
        run("Capital efficiency is not an end in itself. It is the enabler of the other three levers in the Scoreboard. The Monetization play from Part 1 requires investment in BaaS platforms, data products, and API infrastructure. The Tokenization play from Part 2 requires new systems and regulatory capital allocations. Both consume capital.")
      ),
      para([
        run("Every SAR released through the Capital Efficiency lever is a SAR available to fund Levers 1, 2, and 4 — ", { size: 22 }),
        run("without dilution, without external issuance, without coupon payments.", { size: 22, bold: true, color: ACCENT }),
      ]),
      para(
        run("The Scoreboard is not four independent levers. It is a system. And capital efficiency is the circulation system that feeds the others.")
      ),

      spacer(200),

      // ===== BOARDROOM QUESTION =====
      sectionHeading("One question for the boardroom this week"),

      new Paragraph({
        spacing: { before: 80, after: 240, line: 320 },
        children: [new TextRun({
          text: "What is the current cost of your capital buffer — and who owns the programme to bring it down?",
          font: "Calibri", size: 26, bold: true, color: NAVY, italics: true,
        })],
      }),

      // ===== SERIES ROADMAP =====
      sectionHeading("The full series"),
      spacer(80),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [640, 2720, 6000],
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        rows: [
          roadmapRow("01", "Monetization",              "Growing the top line through fees, data, BaaS and Intelligence-as-a-Service.", true),
          roadmapRow("02", "Tokenization",              "Why the first Saudi bank to put sukuk, deposits and real estate on-chain resets the map.", true),
          roadmapRow("03", "Capital Efficiency",        "RWA optimisation, Basel IV response and the balance sheet of a 2030 bank. (You are here.)", true),
          roadmapRow("04", "Sovereign Ecosystem",       "Financing, building and monetising HUMAIN, Project Transcendence and the $150B+ build-out."),
          roadmapRow("05", "The Scoreboard",            "ROE, P/B and the KPIs that actually move. How the four levers compound into shareholder value."),
        ],
      }),

      spacer(240),

      // ===== CLOSING CARD =====
      new Paragraph({ children: [new PageBreak()] }),
      brandImage("06_closing_card.png", 620, 362, { before: 600, after: 120 }),
    ],
  }],
});

const outPath = "/sessions/cool-elegant-cori/mnt/CV/Claude/rodney-ai/content/Rodney Coutinho - Vision 2030 Bank Scoreboard Part 3.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath, "(" + buffer.length + " bytes)");
});
