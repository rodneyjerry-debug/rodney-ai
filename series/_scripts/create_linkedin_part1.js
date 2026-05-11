const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system (matches CV + model brand) ----------
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

// Section heading with bottom border
const sectionHeading = (text) => new Paragraph({
  spacing: { before: 260, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 4 } },
  children: [new TextRun({
    text: text.toUpperCase(),
    font: "Calibri", size: 22, bold: true, color: NAVY, characterSpacing: 40
  })],
});

// Lever block (bold label + body paragraph)
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

// Callout box (single-cell table with left accent bar)
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

// Headline stat box — dark navy background with a giant number
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
                text: "THE PRIZE", font: "Calibri", size: 18, bold: true,
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

// Scoreboard mini-table (Low / Base / High for each lever)
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
        headerCell("LEVER", widths[0]),
        headerCell("LOW", widths[1]),
        headerCell("BASE", widths[2]),
        headerCell("HIGH", widths[3]),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("L1  //  Monetization", widths[0], { bold: true, color: ACCENT }),
        bodyCell("15.9", widths[1], { align: AlignmentType.CENTER }),
        bodyCell("29.5", widths[2], { align: AlignmentType.CENTER, bold: true }),
        bodyCell("38.6", widths[3], { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("L2  //  Tokenization (direct)", widths[0], { bold: true, color: ACCENT }),
        bodyCell("0.5", widths[1], { align: AlignmentType.CENTER }),
        bodyCell("2.7", widths[2], { align: AlignmentType.CENTER, bold: true }),
        bodyCell("11.9", widths[3], { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("L3  //  Capital Efficiency", widths[0], { bold: true, color: ACCENT }),
        bodyCell("0.5", widths[1], { align: AlignmentType.CENTER }),
        bodyCell("2.5", widths[2], { align: AlignmentType.CENTER, bold: true }),
        bodyCell("5.3", widths[3], { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("L4  //  Sovereign Ecosystem", widths[0], { bold: true, color: ACCENT }),
        bodyCell("2.7", widths[1], { align: AlignmentType.CENTER }),
        bodyCell("7.1", widths[2], { align: AlignmentType.CENTER, bold: true }),
        bodyCell("13.7", widths[3], { align: AlignmentType.CENTER }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("Less: L1/L4 overlap", widths[0], { color: GREY }),
        bodyCell("(0.3)", widths[1], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("(1.1)", widths[2], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("(2.7)", widths[3], { align: AlignmentType.CENTER, color: GREY }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("TOTAL  //  SAR B / yr", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
        bodyCell("19.2", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
        bodyCell("40.8", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
        bodyCell("66.8", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("2030 Scoreboard ROE", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
        bodyCell("21%", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
        bodyCell("25%", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
        bodyCell("30%", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      ],
    }),
    new TableRow({
      children: [
        bodyCell("Market cap unlock", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
        bodyCell("$212B", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
        bodyCell("$295B", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
        bodyCell("$392B", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      ],
    }),
  ];

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows,
  });
};

// Image helper — scales PNG to full content width (9360 DXA ≈ 6.5"). docx uses pixels (EMU-ish) in transformation.
const dashboardImage = (filename, widthPx, heightPx) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 160, after: 160 },
  children: [new ImageRun({
    type: "png",
    data: fs.readFileSync(`/sessions/cool-amazing-ptolemy/charts/${filename}`),
    transformation: { width: widthPx, height: heightPx },
    altText: {
      title: filename,
      description: filename,
      name: filename,
    },
  })],
});

// Brand asset helper — loads from Rodney's AI Desk brand folder
const BRAND_DIR = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand";

const brandImage = (filename, widthPx, heightPx, opts = {}) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: opts.before || 0, after: opts.after || 0 },
  children: [new ImageRun({
    type: "png",
    data: fs.readFileSync(`${BRAND_DIR}/${filename}`),
    transformation: { width: widthPx, height: heightPx },
    altText: {
      title: filename,
      description: filename,
      name: filename,
    },
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
  title: "The Vision 2030 Bank Scoreboard - Part 1",
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

      // ===== HERO PANEL (page-1 scroll-stopper, Rodney's AI Desk style) =====
      brandImage("07_hero_part1.png", 620, 413, { after: 180 }),

      // ===== MASTHEAD (Rodney's AI Desk brand strip) =====
      brandImage("05_carousel_masthead.png", 620, 70, { after: 240 }),

      // ===== SERIES / TITLE =====
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({
          text: "SERIES 01  //  THE VISION 2030 BANK SCOREBOARD  //  PART 1 OF 5  //  MONETIZATION",
          font: "Calibri", size: 18, bold: true, color: ACCENT, characterSpacing: 60,
        })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "Are Saudi Banks Underpricing the Biggest P&L Opportunity of the Decade?",
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
        run("Five opportunities will define which Saudi banks lead the next decade — and which simply watch it happen.", { size: 24 }),
        { after: 120 }
      ),
      new Paragraph({
        spacing: { after: 200, line: 320 },
        children: [new TextRun({
          text: "Monetization. Tokenization. Capital Efficiency. AI-Led Sovereign Ecosystem. The Scoreboard.",
          font: "Calibri", size: 24, bold: true, color: ACCENT,
        })],
      }),
      para(
        run("I've modelled the whole thing. Four levers. Three scenarios. One number for the board."),
        { after: 200 }
      ),

      // ===== HEADLINE BOX (THE PRIZE) =====
      headlineBox(
        "$295 Billion",
        "of Saudi bank market cap unlock by 2030, in the Base case.",
        "SAR 40.8B of new annual income  //  25% sector ROE  //  Source: KSA Scoreboard Model"
      ),
      spacer(160),

      // ===== DASHBOARD 1 =====
      dashboardImage("dashboard_1_scorecard.png", 560, 235),

      para(
        run("That's not a forecast. It's a scoreboard — built bottom-up across four levers, with every input sourced and stress-tested. The number moves between $212B and $392B depending on how ambitious the sector chooses to be. The Base case assumes nothing heroic."),
        { after: 180 }
      ),

      // ===== THE MAP =====
      sectionHeading("The map  //  where the value actually comes from"),

      para(
        run("Four levers do the work. Each one is anchored in something already in motion — SAMA's open banking framework going live, HUMAIN's $100B sovereign AI commitment, Basel IV biting, the first tokenised sukuks trading on regulated venues. None of this requires anyone to invent anything."),
        { after: 120 }
      ),

      dashboardImage("dashboard_2_levers.png", 560, 265),

      para(
        run("Monetization alone delivers three-quarters of the Base case. Which is why we start here."),
        { after: 180 }
      ),

      // ===== LEVER 1 DEEP DIVE =====
      sectionHeading("Lever 1  //  the opportunity most boards haven't yet sized"),

      para(
        run("Non-interest income is around 25% of Saudi bank operating income. Saudi banks grew net fees and commissions 16.4% in 2024 — the direction is right, the level is still a long way from what the best-run banks in the world run their P&Ls on.")
      ),

      para(
        run("The global picture makes the size of the prize unmistakable. GCC peers like Emirates NBD and FAB are running at roughly 45% non-interest income share. DBS Singapore — the fairest apples-to-apples comparison for a sovereign-backed universal bank in a high-growth economy — is at 40%. JPMorgan Chase runs a 48% fee-led P&L. UBS, the wealth endgame, runs at 75%. Saudi banks are not just behind the region. They are behind the world.")
      ),

      spacer(80),
      dashboardImage("dashboard_3_underpricing.png", 560, 265),
      spacer(140),

      para(
        run("Close even half the gap to global peers on a roughly SAR 160B sector operating income base and you are looking at SAR 29.5B of new recurring, capital-light income every year — before the balance sheet moves, before a single Basel IV optimisation, before the first tokenised asset clears. That is the Base case.")
      ),

      spacer(120),
      dashboardImage("dashboard_4_build.png", 560, 225),
      spacer(140),

      calloutBox("Monetization is the fastest, least capital-intensive route to the P&L Saudi banks are already capable of running. The building blocks exist. The regulation is live. The fee pools are real. What's missing is a named owner, a target number, and a date."),
      spacer(200),

      // ===== SUB-LEVERS =====
      sectionHeading("The four fee pools already on the table"),

      ...lever(
        "BaaS and embedded finance.",
        "Saudi embedded finance is tracking from $17.8B to over $28B by 2030. The rails are being laid right now. The fees accrue to whoever owns them. Conservative estimate of the bank-addressable slice: SAR 8B a year in the Base case, SAR 13B at the top."
      ),
      ...lever(
        "Data products.",
        "Saudi banks hold the richest behavioural datasets in the Kingdom and monetise almost none of them. Anonymised transaction, merchant and risk intelligence is a live market — and every sovereign AI model being trained here needs it. Worth SAR 5B a year without any change to the core book."
      ),
      ...lever(
        "Open Banking APIs.",
        "SAMA's framework went live in 2026. First-movers earn platform economics for a decade. The addressable fee pool is a direct function of how many fintechs, corporates and sovereign platforms plug into your rails. Every day you wait is a day your API competitor compounds."
      ),
      ...lever(
        "Intelligence-as-a-Service.",
        "The AI capability a bank builds for fraud, credit and advisory is a product, not a cost line. Packaged properly it becomes a recurring revenue stream sold to corporates, SMEs and government. This is how the AI investment pays itself back twice — once on efficiency, once on the fee line. Budget SAR 6B/year in Base, with real upside as HUMAIN scales."
      ),

      // ===== SCOREBOARD MINI =====
      sectionHeading("The scoreboard so far"),

      para(
        run("The four-lever view for the Saudi banking sector. Low is the 'anchor and hold' path. Base is the 'execute what's already committed' path. High is the path available to any bank that moves fast across all four levers in parallel.", { size: 20, italics: true, color: GREY }),
        { after: 140 }
      ),

      scoreboardTable(),
      spacer(200),

      // ===== BOARDROOM QUESTION =====
      sectionHeading("One question for the boardroom this week"),

      new Paragraph({
        spacing: { before: 80, after: 240, line: 320 },
        children: [new TextRun({
          text: "Of your five largest fee-income opportunities, how many have a named owner, a target number, and a date on the calendar?",
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
          roadmapRow("01", "Monetization",              "Growing the top line through fees, data, BaaS and Intelligence-as-a-Service. (You are here.)", true),
          roadmapRow("02", "Tokenization",              "Why the first Saudi bank to put sukuk, deposits and real estate on-chain resets the map."),
          roadmapRow("03", "Capital Efficiency",        "RWA optimisation, Basel IV response and the balance sheet of a 2030 bank."),
          roadmapRow("04", "AI-Led Sovereign Ecosystem","Financing, building and monetising HUMAIN, Project Transcendence and the $150B+ build-out."),
          roadmapRow("05", "The Scoreboard",            "ROE, P/B and the KPIs that actually move. How the four levers compound into shareholder value."),
        ],
      }),

      spacer(240),

      // ===== CLOSING CARD (full-page brand closer) =====
      new Paragraph({ children: [new PageBreak()] }),
      brandImage("06_closing_card.png", 620, 362, { before: 600, after: 120 }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney Coutinho - Vision 2030 Bank Scoreboard Part 1.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath, "(" + buffer.length + " bytes)");
});
