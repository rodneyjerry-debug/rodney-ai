const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system (same as Part 1, 2 & 3) ----------
const NAVY   = "0D1B2A";
const ACCENT = "1B4F72";
const BLUE   = "2874A6";
const GREY   = "6C757D";
const LIGHT  = "F2F6FA";
const GOLD   = "C9A227";
const INK    = "1F2933";

// ---------- Helpers ----------
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

// Scoreboard table — Sovereign Ecosystem sub-lever view
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
      bodyCell("PIF & HUMAIN ecosystem banking", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.8", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("2.0", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("4.0", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("AI-asset & infrastructure project finance", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.5", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("1.5", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("3.5", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("VRP-aligned commercial banking", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.8", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("2.0", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("3.5", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("Sovereign-aligned digital wallets, payroll & treasury", widths[0], { bold: true, color: ACCENT }),
      bodyCell("0.6", widths[1], { align: AlignmentType.CENTER }),
      bodyCell("1.6", widths[2], { align: AlignmentType.CENTER, bold: true }),
      bodyCell("2.7", widths[3], { align: AlignmentType.CENTER }),
    ]}),
    new TableRow({ children: [
      bodyCell("TOTAL  //  SAR B / yr", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
      bodyCell("2.7", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      bodyCell("7.1", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
      bodyCell("13.7", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
    ]}),
  ];

  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: widths, rows });
};

// Image helpers
const CHARTS_DIR = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/part-4-sovereign-ecosystem/charts";
const BRAND_DIR  = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/_brand-assets";

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
  title: "The Vision 2030 Bank Scoreboard - Part 4 - Sovereign Ecosystem",
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
      dashboardImage("hero_part4.png", 620, 413),
      spacer(80),

      // ===== MASTHEAD =====
      brandImage("05_carousel_masthead.png", 620, 70, { after: 240 }),

      // ===== SERIES / TITLE =====
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({
          text: "SERIES 04  //  THE VISION 2030 BANK SCOREBOARD  //  PART 4 OF 5  //  SOVEREIGN ECOSYSTEM",
          font: "Calibri", size: 18, bold: true, color: ACCENT, characterSpacing: 60,
        })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "The Sovereign Is The Customer Now",
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
        run("Parts 1 to 3 sized levers Saudi banks have to build themselves — new fee pools, on-chain sukuk, capital they release through better risk-weighting. Part 4 is different. It is the lever the Saudi state is already building for them, whether or not they are ready to receive it.", { size: 24 }),
        { after: 120 }
      ),
      new Paragraph({
        spacing: { after: 200, line: 320 },
        children: [new TextRun({
          text: "Sovereign Ecosystem. PIF, HUMAIN and the Vision Realisation Programmes. The SAR 7.1B lever the demand side has already underwritten.",
          font: "Calibri", size: 24, bold: true, color: ACCENT,
        })],
      }),

      // ===== HEADLINE BOX =====
      headlineBox(
        "SAR 7.1 Billion",
        "of sovereign-driven banking revenue per year, in the Base case. The second-largest lever in the Scoreboard — and the one with the lowest execution risk, because the demand side is already committed.",
        "Low: SAR 2.7B  //  High: SAR 13.7B  //  Source: KSA Scoreboard Model"
      ),
      spacer(160),

      // ===== THE STACK =====
      sectionHeading("The HUMAIN stack  //  flows landing on Saudi bank balance sheets"),

      para(
        run("PIF has just approved a 2026–2030 strategy that elevates HUMAIN to flagship status. Aramco has signed a non-binding term sheet to take a significant minority stake. NVIDIA is shipping the first 18,000 GB300 chips of a several-hundred-thousand-GPU programme. AMD is reported to be taking equity in a $10B Saudi joint venture. AWS has committed $5B to a Saudi AI Zone. Google Cloud and PIF are putting in $10B for a domestic AI hub. The Saudi National Infrastructure Fund has agreed a $1.2B framework with HUMAIN.")
      ),
      para(
        run("Every one of these flows lands somewhere on a Saudi bank's balance sheet. As project finance. As trade finance. As payroll. As treasury deposits. As digital wallet float. As the working capital of HUMAIN's 600,000-GPU build-out and the contractors that wire it.")
      ),

      spacer(80),
      dashboardImage("dashboard_p4_1_sovereign_timeline.png", 560, 246),
      spacer(80),

      calloutBox("The question is not whether the money flows. It is which Saudi banks have the AI, the relationships, and the operating model to capture it. The risk is not that the demand fails to materialise — it is that it lands on a competitor's balance sheet, possibly outside Saudi."),
      spacer(200),

      // ===== THREE FORCES =====
      sectionHeading("Three forces  //  shaping the sovereign ecosystem flow"),

      ...lever(
        "Force 1: PIF as a portfolio multiplier, not just an LP.",
        "PIF's 2026–2030 strategy reframes the fund — less raw mega-construction, more AI, advanced manufacturing, energy infrastructure and value creation across six domestic ecosystems. The Line construction has been suspended. HUMAIN has been elevated to flagship. PIF portfolio companies — HUMAIN, Lucid, Ceer, Diriyah, Red Sea, NEOM, ROSHN — now form an interconnected ecosystem that needs treasury services, FX hedging, supply chain finance, custody, capital markets execution, and structured AI-related financing. Half of every major Saudi corporate banking flow now traces back, one or two steps, to PIF."
      ),

      spacer(80),
      dashboardImage("dashboard_p4_2_pif_portfolio.png", 560, 235),
      spacer(80),

      ...lever(
        "Force 2: HUMAIN as the AI infrastructure backbone.",
        "HUMAIN's first data centres in Riyadh and Dammam are expected to go live Q2 2026 with 100MW each, scaling toward 500MW. The NVIDIA partnership covers up to several hundred thousand GPUs over five years. AMD's reported $10B JV. National Infrastructure Fund's $1.2B framework. The 250MW expansion alone will require a syndicate of Saudi banks to underwrite. Banks that have done the AI work to model GPU residual values, power-purchase agreements and AI-asset-backed lending will price the risk better — and lead, not follow."
      ),
      ...lever(
        "Force 3: VRP demand creating captive bank revenue.",
        "Saudi Arabia's thirteen Vision Realisation Programmes are budget envelopes with targets, KPIs and payment flows. The Financial Sector Development Programme has driven Tadawul into MSCI, S&P Dow Jones and FTSE Russell, lifted indirect SME lending past USD 695M, and is the policy backbone behind digital bank licensing and instant-payment infrastructure. Every VRP has at least one budgeted AI-enabled component, and SDAIA's regulatory sandbox is the supervised channel for AI-enabled financial products. Banks inside the sandbox are pricing risk that competitors can only watch."
      ),

      spacer(120),

      // ===== FOUR MOVES =====
      sectionHeading("The four moves  //  that capture sovereign ecosystem value"),

      para(
        run("The Scoreboard model decomposes the Sovereign Ecosystem lever into four distinct revenue and balance-sheet moves. None requires Saudi banks to build a new product category from scratch — all four sit inside existing licences. The differentiator is the AI layer."),
        { after: 160 }
      ),

      ...lever(
        "Move 1: PIF & HUMAIN ecosystem banking.",
        "Build a dedicated PIF-ecosystem coverage model — a single relationship architecture across PIF itself, the giga-project SPVs, the portfolio companies, and HUMAIN's joint ventures. Layer in AI for cash-flow forecasting, intercompany netting, FX exposure consolidation, and capital structure optimisation across the entire ecosystem. Base case: SAR 2.0B. High case: SAR 4.0B."
      ),
      ...lever(
        "Move 2: AI-asset and infrastructure project finance.",
        "AI infrastructure is a new asset class that needs old project-finance skills with new variables: GPU residual values, software-defined depreciation, power purchase economics, sovereign offtake guarantees, training-data revenue rights. Banks that build an AI Project Finance desk — quants who model GPU vintages and structured product specialists who carve risk into senior, mezzanine and equity tranches — will lead the HUMAIN data-centre stack, the AWS AI Zone and the Google Cloud hub. Base case: SAR 1.5B. High case: SAR 3.5B."
      ),
      ...lever(
        "Move 3: VRP-aligned commercial banking.",
        "Each VRP creates a captive demand channel. Mortgage finance through Sakani. SME lending through Monsha'at and Kafalah. Contractor finance through SIDF. Supplier finance through Tadawul's nascent supply-chain finance market. The AI play is volume credit decisioning at SME scale with policy-aligned risk weighting and rapid turnaround — the kind of process traditional Saudi banking has historically not been built for. Base case: SAR 2.0B. High case: SAR 3.5B."
      ),
      ...lever(
        "Move 4: Sovereign-aligned digital wallets, payroll & treasury.",
        "Riyadh accounted for 35% of 2025 mobile-payment value, anchored by government payrolls and corporate treasuries. The next leg is enterprise — contractor payroll for the giga-project workforce, supplier payments on Sarie rails, audit-grade digital wallets that integrate with government tendering, and treasury-as-a-service for hundreds of new Vision 2030 SPVs. Base case: SAR 1.6B. High case: SAR 2.7B."
      ),

      spacer(80),
      dashboardImage("dashboard_p4_3_four_moves.png", 560, 255),
      spacer(160),

      // ===== SCOREBOARD =====
      sectionHeading("The scoreboard  //  Sovereign Ecosystem lever"),

      para(
        run("Low is generic large-corporates coverage. Base assumes a coordinated sovereign-ecosystem programme with dedicated coverage, AI-PF desk and VRP-aligned product. High assumes the bank operates as a full strategic partner — embedded in HUMAIN JVs, lead arranger on AI infrastructure, sandbox member.", { size: 20, italics: true, color: GREY }),
        { after: 140 }
      ),

      scoreboardTable(),
      spacer(160),

      dashboardImage("dashboard_p4_4_base_vs_high.png", 560, 225),
      spacer(200),

      // ===== GOVERNANCE GAP =====
      sectionHeading("Why this lever has the lowest execution risk in the Scoreboard"),

      para(
        run("A Base case bank treats the sovereign ecosystem as a list of names to call on. It has a public-sector banker. It bids on giga-project deals when they are syndicated. It runs a mortgage programme aligned to Sakani. It sends a senior banker to PIF events.")
      ),
      para(
        run("A High case bank treats the sovereign ecosystem as the architecture of the next decade of Saudi corporate finance. It builds a PIF-ecosystem coverage model with named owners across every portfolio company. It has an AI Project Finance desk staffed jointly with credit quants and structured product specialists. It is a participant in the SDAIA regulatory sandbox. It has board-level dialogue with HUMAIN, with the National Infrastructure Fund, and with the VRP delivery offices.")
      ),

      calloutBox("Monetization, Tokenization and Capital Efficiency all depend on the bank's ability to build something. The Sovereign Ecosystem lever depends on the bank's ability to receive a flow that has already been committed. The risk is not that the demand fails to materialise. It is that it lands on a competitor's balance sheet."),
      spacer(200),

      // ===== PEER PRESSURE =====
      sectionHeading("Peer pressure  //  UAE and Qatar are not standing still"),

      para(
        run("UAE sovereign-backed AI vehicles — MGX, G42 and Mubadala — invested USD 12.9B in AI and digitisation in 2025 alone, with stakes in OpenAI, xAI, Anthropic and Mistral, and the USD 30B Global AI Infrastructure Partnership with Microsoft and BlackRock. Qatar Investment Authority has formed a USD 20B JV with Brookfield to build AI data centres, and has taken positions in xAI.")
      ),
      para(
        run("AI-asset project finance will be a syndicated GCC product, not a single-jurisdiction one. Saudi banks need credible AI-PF capability to lead, not just participate. The window for Saudi banks to lead the sovereign-AI capital markets category — green sukuk for AI infrastructure, AI-asset-backed sukuk, sovereign-AI green bonds — is open today. It is not open indefinitely.")
      ),

      spacer(200),

      // ===== CONNECTION =====
      sectionHeading("The connection  //  why this is the demand engine for Levers 1, 2 and 3"),

      para(
        run("Sovereign Ecosystem does not stand alone. It is the demand engine that makes the other three levers add up.")
      ),
      para([
        run("Monetization (SAR 29.5B) needs a customer base big enough to absorb the new products. The PIF ecosystem, the giga-project SPVs and VRP-aligned authorities ", { size: 22 }),
        run("are that customer base.", { size: 22, bold: true, color: ACCENT }),
      ]),
      para(
        run("Tokenization (SAR 2.7B) needs an issuer pipeline. HUMAIN financing, the giga-project refinancing wave and AI-asset-backed sukuk give that pipeline a sovereign anchor.")
      ),
      para(
        run("Capital Efficiency (SAR 2.5B) sets the speed limit. Banks that capture the largest share of sovereign ecosystem flow will be the banks with capital to deploy. Capital Efficiency funds Sovereign Ecosystem; Sovereign Ecosystem fills the capital that Capital Efficiency releases.")
      ),
      para(
        run("The Scoreboard is one system with four pumps. Sovereign Ecosystem is the largest sustained inlet.")
      ),

      spacer(200),

      // ===== BOARDROOM QUESTION =====
      sectionHeading("One question for the boardroom this week"),

      new Paragraph({
        spacing: { before: 80, after: 240, line: 320 },
        children: [new TextRun({
          text: "Who in your bank owns the PIF–HUMAIN relationship — and do they have an AI engineer sitting next to them?",
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
          roadmapRow("01", "Monetization",          "Growing the top line through fees, data, BaaS and Intelligence-as-a-Service.", true),
          roadmapRow("02", "Tokenization",          "Why the first Saudi bank to put sukuk, deposits and real estate on-chain resets the map.", true),
          roadmapRow("03", "Capital Efficiency",    "RWA optimisation, Basel IV response and the balance sheet of a 2030 bank.", true),
          roadmapRow("04", "Sovereign Ecosystem",   "PIF, HUMAIN, VRPs and the demand side of AI. (You are here.)", true),
          roadmapRow("05", "The Scoreboard",        "ROE, P/B and the KPIs that actually move. How the four levers compound into shareholder value."),
        ],
      }),

      spacer(240),

      // ===== CLOSING CARD =====
      new Paragraph({ children: [new PageBreak()] }),
      brandImage("06_closing_card.png", 620, 362, { before: 600, after: 120 }),
    ],
  }],
});

const outPath = "/sessions/focused-loving-meitner/mnt/CV/Claude/rodney-ai/series/part-4-sovereign-ecosystem/Rodney Coutinho - Vision 2030 Bank Scoreboard Part 4.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath, "(" + buffer.length + " bytes)");
});
