const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, BorderStyle, WidthType, ShadingType,
  HeadingLevel, ImageRun, PageBreak,
} = require('docx');

// ---------- Design system (same as Part 1) ----------
const NAVY   = "0D1B2A";
const ACCENT = "1B4F72";
const BLUE   = "2874A6";
const GREY   = "6C757D";
const LIGHT  = "F2F6FA";
const GOLD   = "C9A227";
const INK    = "1F2933";
const GREEN  = "1B7A3D";
const AMBER  = "B8860B";
const RED    = "A93226";

// ---------- Helpers (same as Part 1) ----------
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

const headlineBox = (label, stat, context, caption) => new Table({
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
                text: label, font: "Calibri", size: 18, bold: true,
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

// ---------- Part 2 specific: Race comparison table ----------
const raceTable = () => {
  const hCell = (text, width) => new TableCell({
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
      children: [new TextRun({ text, font: "Calibri", size: 17, bold: true, color: "FFFFFF" })],
    })],
  });

  const bCell = (text, width, opts = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: opts.fill || "FFFFFF", type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
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
        size: opts.size || 18,
        bold: opts.bold || false,
        color: opts.color || INK,
      })],
    })],
  });

  const w = [2000, 1840, 1840, 1840, 1840];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ tableHeader: true, children: [
        hCell("", w[0]), hCell("SAUDI ARABIA", w[1]), hCell("UAE", w[2]), hCell("MALAYSIA", w[3]), hCell("GLOBAL", w[4]),
      ]}),
      new TableRow({ children: [
        bCell("Tokenized sukuk", w[0], { bold: true, color: ACCENT }),
        bCell("Sandbox only", w[1], { color: AMBER }),
        bCell("FAB + HSBC live", w[2], { color: GREEN }),
        bCell("Khazanah + CIMB pilot", w[3], { color: AMBER }),
        bCell("UK gilt pilot (HSBC)", w[4], { color: GREEN }),
      ]}),
      new TableRow({ children: [
        bCell("Tokenized deposits", w[0], { bold: true, color: ACCENT }),
        bCell("Not live", w[1], { color: RED }),
        bCell("HSBC live (5 mkts)", w[2], { color: GREEN }),
        bCell("BNM pilot", w[3], { color: AMBER }),
        bCell("HK 7-bank pilot", w[4], { color: GREEN }),
      ]}),
      new TableRow({ children: [
        bCell("Real estate tokenization", w[0], { bold: true, color: ACCENT }),
        bCell("REGA blockchain live", w[1], { color: GREEN }),
        bCell("DLD AED 60B target", w[2], { color: GREEN }),
        bCell("Early stage", w[3], { color: RED }),
        bCell("Multiple pilots", w[4], { color: AMBER }),
      ]}),
      new TableRow({ children: [
        bCell("Regulatory framework", w[0], { bold: true, color: ACCENT }),
        bCell("CMA sandbox + stablecoin plan", w[1], { color: AMBER }),
        bCell("DFSA + ADGM (mature)", w[2], { color: GREEN }),
        bCell("SC + BNM (expanding)", w[3], { color: AMBER }),
        bCell("EU MiCA live", w[4], { color: GREEN }),
      ]}),
      new TableRow({ children: [
        bCell("Stablecoins", w[0], { bold: true, color: ACCENT }),
        bCell("SAMA developing", w[1], { color: AMBER }),
        bCell("AED Coin (regulated)", w[2], { color: GREEN }),
        bCell("Not announced", w[3], { color: RED }),
        bCell("Multiple live", w[4], { color: GREEN }),
      ]}),
    ],
  });
};

// ---------- Part 2 specific: What changes table ----------
const whatChangesTable = () => {
  const hCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: ACCENT, type: ShadingType.CLEAR },
    margins: { top: 140, bottom: 140, left: 160, right: 160 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: ACCENT },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: ACCENT },
      left:   { style: BorderStyle.SINGLE, size: 1, color: ACCENT },
      right:  { style: BorderStyle.SINGLE, size: 1, color: ACCENT },
    },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, font: "Calibri", size: 18, bold: true, color: "FFFFFF" })],
    })],
  });

  const bCell = (text, width, opts = {}) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: opts.fill || "FFFFFF", type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      left:   { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
      right:  { style: BorderStyle.SINGLE, size: 1, color: "D6E1EC" },
    },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { line: 280 },
      children: [new TextRun({
        text,
        font: "Calibri",
        size: opts.size || 19,
        bold: opts.bold || false,
        color: opts.color || INK,
      })],
    })],
  });

  const w = [2340, 2340, 2340, 2340];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ tableHeader: true, children: [
        hCell("SETTLEMENT", w[0]),
        hCell("SHARIAH COMPLIANCE", w[1]),
        hCell("ACCESS", w[2]),
        hCell("CAPITAL EFFICIENCY", w[3]),
      ]}),
      new TableRow({ children: [
        bCell("T+0 instant settlement vs T+2 today. Eliminates counterparty risk window and frees trapped liquidity.", w[0]),
        bCell("Smart contracts hard-wire compliance into the asset. Automated purification, profit distribution, and audit trail.", w[1]),
        bCell("Fractional ownership opens institutional sukuk to retail investors. SAR 1,000 minimums instead of SAR 1M.", w[2]),
        bCell("Lower issuance cost, reduced intermediary fees, and RWA savings that compound into the Part 3 capital story.", w[3]),
      ]}),
    ],
  });
};

// ---------- Scoreboard table (same as Part 1 but highlighting L2) ----------
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
  // Highlight L2 row with light blue background
  const L2_FILL = "D6EAF8";
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell("LEVER", widths[0]),
          headerCell("LOW", widths[1]),
          headerCell("BASE", widths[2]),
          headerCell("HIGH", widths[3]),
        ],
      }),
      new TableRow({ children: [
        bodyCell("L1  //  Monetization", widths[0], { bold: true, color: GREY }),
        bodyCell("15.9", widths[1], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("29.5", widths[2], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("38.6", widths[3], { align: AlignmentType.CENTER, color: GREY }),
      ]}),
      new TableRow({ children: [
        bodyCell("L2  //  Tokenization (direct)", widths[0], { bold: true, color: ACCENT, fill: L2_FILL }),
        bodyCell("0.5", widths[1], { align: AlignmentType.CENTER, bold: true, fill: L2_FILL }),
        bodyCell("2.7", widths[2], { align: AlignmentType.CENTER, bold: true, fill: L2_FILL, size: 22 }),
        bodyCell("11.9", widths[3], { align: AlignmentType.CENTER, bold: true, fill: L2_FILL }),
      ]}),
      new TableRow({ children: [
        bodyCell("L3  //  Capital Efficiency", widths[0], { bold: true, color: GREY }),
        bodyCell("0.5", widths[1], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("2.5", widths[2], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("5.3", widths[3], { align: AlignmentType.CENTER, color: GREY }),
      ]}),
      new TableRow({ children: [
        bodyCell("L4  //  Sovereign Ecosystem", widths[0], { bold: true, color: GREY }),
        bodyCell("2.7", widths[1], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("7.1", widths[2], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("13.7", widths[3], { align: AlignmentType.CENTER, color: GREY }),
      ]}),
      new TableRow({ children: [
        bodyCell("Less: L1/L4 overlap", widths[0], { color: GREY }),
        bodyCell("(0.3)", widths[1], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("(1.1)", widths[2], { align: AlignmentType.CENTER, color: GREY }),
        bodyCell("(2.7)", widths[3], { align: AlignmentType.CENTER, color: GREY }),
      ]}),
      new TableRow({ children: [
        bodyCell("TOTAL  //  SAR B / yr", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
        bodyCell("19.2", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
        bodyCell("40.8", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
        bodyCell("66.8", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      ]}),
      new TableRow({ children: [
        bodyCell("Market cap unlock", widths[0], { bold: true, color: NAVY, fill: LIGHT }),
        bodyCell("$212B", widths[1], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
        bodyCell("$295B", widths[2], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY, size: 22 }),
        bodyCell("$392B", widths[3], { align: AlignmentType.CENTER, bold: true, fill: LIGHT, color: NAVY }),
      ]}),
    ],
  });
};

// Sukuk market stats table
const sukukStatsTable = () => {
  const hCell = (text, width) => new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: { top: 160, bottom: 160, left: 200, right: 200 },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      left: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
      right: { style: BorderStyle.SINGLE, size: 1, color: NAVY },
    },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: text.split("|")[0], font: "Calibri", size: 36, bold: true, color: "FFFFFF" })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: text.split("|")[1], font: "Calibri", size: 16, color: "BFD4E8" })],
      }),
    ],
  });

  const w = [3120, 3120, 3120];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: [
        hCell("SAR 696B|Saudi listed sukuk & bonds (Q3 2025)", w[0]),
        hCell("$1 Trillion|Global sukuk outstanding (2025)", w[1]),
        hCell("$190\u2013200B|Annual sukuk issuance volume", w[2]),
      ]}),
    ],
  });
};

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

// ---------- Brand assets ----------
const BRAND_DIR = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney's AI Desk/brand";
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
  title: "The Vision 2030 Bank Scoreboard - Part 2: Tokenization",
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

      // ===== HERO PANEL (same as Part 1) =====
      brandImage("08_hero_part2.png", 620, 413, { after: 180 }),

      // ===== MASTHEAD =====
      brandImage("05_carousel_masthead.png", 620, 70, { after: 240 }),

      // ===== SERIES / TITLE =====
      new Paragraph({
        spacing: { before: 80, after: 80 },
        children: [new TextRun({
          text: "SERIES 01  //  THE VISION 2030 BANK SCOREBOARD  //  PART 2 OF 5  //  TOKENIZATION",
          font: "Calibri", size: 18, bold: true, color: ACCENT, characterSpacing: 60,
        })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({
          text: "Which Saudi Financial Institution Puts the First Sukuk On-Chain?",
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
        run("In Part 1 we sized the fee-income opportunity. SAR 29.5 billion a year of recurring, capital-light revenue — the fastest route to the P&L Saudi banks are already capable of running."),
        { after: 120 }
      ),
      para(
        run("Now we move from the fee line to the balance sheet. Part 2 asks a different question: what happens when the infrastructure underneath the capital markets is rebuilt on-chain?"),
        { after: 200 }
      ),

      // ===== RACE SNAPSHOT (visual on page 1) =====
      brandImage("09_race_snapshot.png", 620, 170, { after: 200 }),

      // ===== HEADLINE BOX =====
      headlineBox(
        "THE OPPORTUNITY",
        "$500 Billion",
        "of real-world asset tokenization addressable in the GCC by 2030.",
        "Conservative estimate  //  Global tokenized asset market projected to exceed $2T by 2030"
      ),
      spacer(200),

      // ===== THE MARKET TODAY =====
      sectionHeading("The sukuk market today  //  scale without infrastructure"),

      para(
        run("The numbers are enormous. Saudi-listed sukuk and bonds stand at SAR 696 billion. Global outstanding sukuk crossed $1 trillion in 2025, with GCC nations accounting for more than 56% of the total. Annual issuance runs at $190\u2013200 billion. Saudi Arabia alone accounts for 38% of all sustainable sukuk issuance."),
        { after: 160 }
      ),

      sukukStatsTable(),
      spacer(160),

      para(
        run("Every major Saudi bank is an active issuer. Al Rajhi raised $1 billion in AT1 sustainable sukuk. SAB closed a $1.1 billion deal. Riyad Bank issued $750 million. Saudi banks raised approximately $11.5 billion in debt markets in 2024 alone."),
        { after: 120 }
      ),
      para(
        run("The pipeline is live. The scale is real. And every one of these instruments settles the same way it has for decades: T+2, manual reconciliation, multiple intermediaries, paper-heavy compliance verification. The infrastructure underneath this trillion-dollar market has not changed."),
        { after: 120 }
      ),

      calloutBox("A trillion-dollar market running on infrastructure built for a fraction of that volume. That is the gap tokenization is built to close."),
      spacer(200),

      // ===== THE RACE =====
      sectionHeading("The race  //  who is moving and who is still in sandbox"),

      para(
        run("No Saudi bank has issued a tokenized sukuk. But the race around them is accelerating."),
        { after: 160 }
      ),

      brandImage("10_race_detail.png", 620, 430, { after: 160 }),

      ...lever(
        "UAE: Live and scaling.",
        "Abu Dhabi's FAB is listing the region's first blockchain-based bond on ADX using HSBC's Orion digital asset platform. Dubai's DFSA updated its crypto token rules in January 2026. ADGM streamlined digital securities licensing in mid-2025. HSBC's tokenized deposit service is live across five markets including the UAE. The regulatory frameworks are mature and institutional capital is flowing."
      ),
      ...lever(
        "Malaysia: Piloting with intent.",
        "Khazanah and Malaysia's Securities Commission launched a tokenized bond and sukuk pilot in 2025. CIMB has committed to the programme across structuring, execution, custody, and lifecycle servicing \u2014 with workstreams progressing through 2026. CIMB intends to convert pilot learnings into live issuance, tokenizing a portion of future funding requirements."
      ),
      ...lever(
        "Global: Infrastructure going live.",
        "The UK appointed HSBC for a blockchain gilt pilot in February 2026. Hong Kong launched a real-value tokenized deposit pilot with seven banks running through 2026. On-chain tokenized real-world assets grew from $5.5 billion to $18.6 billion in 2025 alone \u2014 tripling in a single year."
      ),
      ...lever(
        "Saudi Arabia: Pieces moving, but no bank live yet.",
        "The CMA operates a FinTech Lab allowing tokenized debt pilots \u2014 volumes hit SAR 3.4 billion in 2024, up from SAR 1.5 billion the year before. In early 2026, Saudi Arabia executed its first blockchain-based property deed transfer under the Real Estate General Authority. SAMA has announced plans for nationally regulated stablecoins. The building blocks are in motion. What is missing is a bank that goes first."
      ),
      spacer(120),

      // ===== WHAT CHANGES =====
      sectionHeading("What tokenized sukuk actually changes"),

      para(
        run("Tokenization is not a technology upgrade. It rewrites four things simultaneously."),
        { after: 160 }
      ),

      brandImage("11_what_changes.png", 620, 260, { after: 160 }),

      para(
        run("The capital efficiency gains are the bridge to Part 3 of this series. When you reduce issuance costs, compress settlement windows, and eliminate intermediaries, the RWA savings flow directly into the ROE story. Tokenization and capital efficiency are not separate levers \u2014 they compound."),
        { after: 200 }
      ),

      // ===== THE FIRST-MOVER PRIZE =====
      sectionHeading("The first-mover prize  //  why this is not just a technology bet"),

      para(
        run("In every capital market that has been rebuilt on new infrastructure, the first institution to go live captures a disproportionate share of the value. Not because the technology is exclusive \u2014 it never stays exclusive for long \u2014 but because the first mover shapes the standard."),
        { after: 120 }
      ),
      ...lever(
        "Standard-setting.",
        "The bank that issues the first regulated tokenized sukuk in Saudi Arabia defines the template: the smart contract structure, the compliance framework, the custody model. Every issuer that follows builds on your architecture."
      ),
      ...lever(
        "Regulatory shaping.",
        "CMA and SAMA are writing the rules in real time. The bank that goes first has a seat at the table. The bank that waits inherits someone else's framework."
      ),
      ...lever(
        "Platform economics.",
        "Tokenized issuance platforms create network effects. Investors, intermediaries, and secondary market liquidity cluster around the platform that goes live first. This is the same dynamic that gave Tadawul its dominance in conventional listing \u2014 but in digital capital markets, it moves faster."
      ),
      ...lever(
        "Global visibility.",
        "The first tokenized sukuk from a Saudi bank will be covered by every financial publication from Bloomberg to Islamic Finance News. In a world where Saudi banks are competing for international capital and sovereign fund mandates, that is not a small thing."
      ),

      spacer(120),

      // ===== SCOREBOARD =====
      sectionHeading("The scoreboard  //  where tokenization sits"),

      para(
        run("Lever 2 contributes SAR 2.7 billion a year in the Base case \u2014 the direct fee and efficiency impact of tokenized issuance, custody, and settlement. But the indirect effects are larger: tokenization enables the capital efficiency gains in Lever 3, and it creates new distribution rails for the fee products in Lever 1. The levers do not add \u2014 they compound.", { size: 20, italics: true, color: GREY }),
        { after: 140 }
      ),

      scoreboardTable(),
      spacer(200),

      // ===== BOARDROOM QUESTION =====
      sectionHeading("One question for the next ALCO meeting"),

      new Paragraph({
        spacing: { before: 80, after: 240, line: 320 },
        children: [new TextRun({
          text: "If a competitor puts a regulated sukuk on-chain before you do, what does your catch-up plan look like \u2014 and how much does it cost you in standard-setting, regulatory influence, and platform economics that you can never recover?",
          font: "Calibri", size: 26, bold: true, color: NAVY, italics: true,
        })],
      }),

      // ===== SERIES ROADMAP =====
      sectionHeading("The full series"),
      spacer(80),

      brandImage("12_series_tracker.png", 620, 130, { after: 80 }),

      // ===== CLOSING CARD =====
      new Paragraph({ children: [new PageBreak()] }),
      brandImage("06_closing_card.png", 620, 362, { before: 400, after: 120 }),
    ],
  }],
});

Packer.toBuffer(doc).then(buffer => {
  const outPath = "/sessions/cool-amazing-ptolemy/mnt/CV/Rodney Coutinho - Vision 2030 Bank Scoreboard Part 2.docx";
  fs.writeFileSync(outPath, buffer);
  console.log("Written:", outPath, "(" + buffer.length + " bytes)");
});
