#!/usr/bin/env node
/**
 * Enterprise.AI — Reusable LinkedIn Carousel Builder
 *
 * Usage:
 *   node carousel-template.js --config article.json
 *
 * The config JSON defines the article metadata and slide content.
 * See README or the example config for the full schema.
 *
 * Design system, helpers, and closing card are all baked in.
 * You only supply: title, subtitle, hero image path, and an array of slides.
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, ImageRun, PageBreak,
} = require('docx');

// =====================================================================
// DESIGN SYSTEM (Enterprise.AI brand — consistent across all carousels)
// =====================================================================
const COLORS = {
  NAVY:   "0D1B2A",
  ACCENT: "1B4F72",
  BLUE:   "2874A6",
  GREY:   "6C757D",
  LIGHT:  "F2F6FA",
  GOLD:   "C9A227",
  INK:    "1F2933",
  RED:    "B22222",
  WHITE:  "FFFFFF",
};

const { NAVY, ACCENT, BLUE, GREY, LIGHT, GOLD, INK, RED, WHITE } = COLORS;

// Brand constants
const BRAND = {
  name: "ENTERPRISE.AI",
  tagline: "SCALE  ·  GOVERN  ·  UNLOCK",
  author: "RODNEY COUTINHO",
  title: "AI Builder and Advisor",
  role: "Founder, Enterprise.AI  //  AI Builder and Advisor",
  service: "AI Strategy, Governance & Deployment  //  Financial Services",
  regions: "Middle East  ·  Europe",
  sectors: "Banking  ·  Capital Markets  ·  Insurance  ·  Investment Management",
  email: "rodney@bost.sa",
  website: "theenterpriseai.co.uk",
  linkedin: "linkedin.com/in/rodneycoutinho",
};

// =====================================================================
// HELPER FUNCTIONS
// =====================================================================

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
    font: "Calibri", size: 26, bold: true, color: NAVY, characterSpacing: 60,
  })],
});

const pageFooter = (pageNum, seriesLabel) => [
  spacer(100),
  new Paragraph({
    spacing: { before: 100, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: GOLD, space: 8 } },
    children: [new TextRun({
      text: `ENTERPRISE.AI  //  ${seriesLabel}  //  ${pageNum}`,
      font: "Calibri", size: 16, color: GREY, characterSpacing: 40,
    })],
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
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9360, type: WidthType.DXA },
      shading: { fill: opts.fill || LIGHT, type: ShadingType.CLEAR },
      margins: { top: 240, bottom: 240, left: 300, right: 300 },
      children: [new Paragraph({
        spacing: { line: 360 },
        children: [new TextRun({
          text, font: "Calibri",
          size: opts.size || 26,
          italics: opts.italics !== false,
          bold: opts.bold || false,
          color: opts.color || NAVY,
        })],
      })],
    })],
  })],
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
  rows: [new TableRow({
    children: [new TableCell({
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
            text: stat, font: "Calibri", size: 44, bold: true, color: WHITE,
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
    })],
  })],
});

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

const numberedCard = (num, title, body) => new Table({
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

// =====================================================================
// SLIDE RENDERERS — each slide type maps to a function
// =====================================================================

const SLIDE_RENDERERS = {

  // Plain text paragraphs
  text: (slide, footerLabel) => {
    const elements = [];
    if (slide.heading) elements.push(sectionHeading(slide.heading));
    for (const block of (slide.blocks || [])) {
      if (block.type === "paragraph" || !block.type) {
        elements.push(para([run(block.text, {
          size: block.size || 28,
          bold: block.bold || false,
          italics: block.italics || false,
          color: block.color,
        })], { after: block.after || 280 }));
      } else if (block.type === "callout") {
        elements.push(calloutBox(block.text, {
          accent: COLORS[block.accent] || block.accent || BLUE,
          bold: block.bold, italics: block.italics,
          color: block.color ? (COLORS[block.color] || block.color) : undefined,
          size: block.size,
        }));
        elements.push(spacer(block.after || 200));
      } else if (block.type === "spacer") {
        elements.push(spacer(block.after || 200));
      } else if (block.type === "headline") {
        elements.push(headlineBox(block.label, block.stat, block.context, block.caption));
        elements.push(spacer(block.after || 300));
      } else if (block.type === "stats") {
        elements.push(statRow(block.items));
        elements.push(spacer(block.after || 400));
      }
    }
    return elements;
  },

  // Numbered cards (e.g. seven-question test)
  cards: (slide, footerLabel) => {
    const elements = [];
    if (slide.heading) elements.push(sectionHeading(slide.heading));
    if (slide.intro) {
      elements.push(para([run(slide.intro, { size: 26 })], { after: 240 }));
    }
    for (const card of (slide.cards || [])) {
      elements.push(numberedCard(card.num, card.title, card.body));
      elements.push(spacer(card.spacing || 160));
    }
    return elements;
  },

  // Q&A pairs (advisory conversation style)
  qa: (slide, footerLabel) => {
    const elements = [];
    if (slide.heading) elements.push(sectionHeading(slide.heading));
    if (slide.intro) {
      elements.push(para([run(slide.intro, { size: 28, italics: true })], { after: 300 }));
    }
    for (const pair of (slide.pairs || [])) {
      elements.push(...qaPair(pair.q, pair.a));
    }
    return elements;
  },
};


// =====================================================================
// BUILDER — assembles the document from config
// =====================================================================

function buildCarousel(config) {
  const { meta, slides } = config;
  const footerLabel = meta.footerLabel || `STANDALONE ARTICLE  //  ${meta.slug || "ARTICLE"}`;

  const children = [];

  // ---- PAGE 1: HERO ----
  if (meta.heroImage && fs.existsSync(meta.heroImage)) {
    const heroData = fs.readFileSync(meta.heroImage);
    // Maintain original aspect ratio: default landscape hero at 648x432
    const heroW = meta.heroWidth || 648;
    const heroH = meta.heroHeight || 432;
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [new ImageRun({
        type: "png",
        data: heroData,
        transformation: { width: heroW, height: heroH },
        altText: { title: "Hero", description: meta.title || "Hero", name: "hero" },
      })],
    }));
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // ---- PAGE 2: BRANDED INTRO ----
  // Header
  children.push(new Paragraph({
    spacing: { before: 0, after: 40 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 12 } },
    children: [new TextRun({
      text: BRAND.name,
      font: "Calibri", size: 36, bold: true, color: NAVY, characterSpacing: 80,
    })],
  }));

  children.push(new Paragraph({
    spacing: { before: 120, after: 40 },
    children: [new TextRun({
      text: footerLabel,
      font: "Calibri", size: 20, bold: true, color: BLUE, characterSpacing: 40,
    })],
  }));

  children.push(new Paragraph({
    spacing: { before: 40, after: 240 },
    children: [new TextRun({
      text: `${BRAND.author}  //  AI BUILDER AND ADVISOR`,
      font: "Calibri", size: 20, color: GOLD, characterSpacing: 60,
    })],
  }));

  // Title
  children.push(new Paragraph({
    spacing: { after: 280 },
    children: [new TextRun({
      text: meta.title,
      font: "Calibri", size: 44, bold: true, color: NAVY,
    })],
  }));

  // Intro slide content (first slide in the array is the intro)
  const introSlide = slides[0];
  if (introSlide) {
    const renderer = SLIDE_RENDERERS[introSlide.type] || SLIDE_RENDERERS.text;
    children.push(...renderer(introSlide, footerLabel));
  }
  children.push(...pageFooter("02", footerLabel));

  // ---- REMAINING SLIDES ----
  for (let i = 1; i < slides.length; i++) {
    children.push(new Paragraph({ children: [new PageBreak()] }));
    const slide = slides[i];
    const renderer = SLIDE_RENDERERS[slide.type] || SLIDE_RENDERERS.text;
    children.push(...renderer(slide, footerLabel));
    children.push(...pageFooter(String(i + 2).padStart(2, "0"), footerLabel));
  }

  // ---- CLOSING CARD (auto-generated) ----
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(spacer(600));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({
      text: BRAND.name,
      font: "Calibri", size: 56, bold: true, color: NAVY, characterSpacing: 120,
    })],
  }));

  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 12 } },
    children: [new TextRun({
      text: BRAND.tagline,
      font: "Calibri", size: 22, bold: true, color: GOLD, characterSpacing: 160,
    })],
  }));

  children.push(spacer(200));

  // Author info
  const centeredLine = (text, size, color) => new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Calibri", size, color })],
  });

  children.push(centeredLine(BRAND.title, 28, ACCENT));
  children.push(centeredLine(BRAND.sectors, 22, GREY));
  children.push(centeredLine(BRAND.regions, 22, GREY));
  children.push(spacer(400));
  children.push(centeredLine(BRAND.website, 20, BLUE));
  children.push(centeredLine(BRAND.email, 20, BLUE));
  children.push(centeredLine(BRAND.linkedin, 20, BLUE));
  children.push(spacer(300));
  children.push(centeredLine(`${BRAND.name}  //  ${footerLabel}`, 16, GREY));

  // ---- BUILD DOCUMENT ----
  const doc = new Document({
    creator: "Rodney Coutinho",
    title: meta.title,
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
      children,
    }],
  });

  return doc;
}


// =====================================================================
// CLI
// =====================================================================

async function main() {
  const args = process.argv.slice(2);
  const configIdx = args.indexOf("--config");
  if (configIdx === -1 || !args[configIdx + 1]) {
    console.error("Usage: node carousel-template.js --config <path-to-config.json>");
    console.error("\nThe config JSON defines article metadata and slide content.");
    console.error("See the example config for the schema.");
    process.exit(1);
  }

  const configPath = args[configIdx + 1];
  if (!fs.existsSync(configPath)) {
    console.error(`Config file not found: ${configPath}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Resolve hero image path relative to config file
  if (config.meta.heroImage && !path.isAbsolute(config.meta.heroImage)) {
    config.meta.heroImage = path.resolve(path.dirname(configPath), config.meta.heroImage);
  }

  const doc = buildCarousel(config);
  const buf = await Packer.toBuffer(doc);

  // Output path: same directory as config, named from slug
  const slug = config.meta.slug || "carousel";
  const outDir = config.meta.outputDir || path.dirname(configPath);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, `${slug}-Carousel.docx`);
  fs.writeFileSync(outPath, buf);
  console.log(`Carousel DOCX: ${outPath} (${buf.length} bytes)`);

  // Also copy to CV root if specified
  if (config.meta.copyTo) {
    fs.mkdirSync(path.dirname(config.meta.copyTo), { recursive: true });
    fs.writeFileSync(config.meta.copyTo, buf);
    console.log(`Copy: ${config.meta.copyTo}`);
  }

  console.log(`\nNext steps:`);
  console.log(`  1. Convert: python mnt/.claude/skills/docx/scripts/office/soffice.py --headless --convert-to pdf "${outPath}"`);
  console.log(`  2. QA:      pdftoppm -jpeg -r 150 ${slug}-Carousel.pdf slide`);
  console.log(`  3. Post to LinkedIn as document`);
}

main().catch(err => { console.error(err); process.exit(1); });
