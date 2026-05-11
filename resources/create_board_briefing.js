const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Enterprise.AI";
pres.title = "Board AI Briefing Pack Template";

// Brand Colors
const colors = {
  navy: "0D1B2A",
  gold: "C9A227",
  white: "FFFFFF",
  accentBlue: "1B4F72",
  lightGray: "E8E8E8",
  darkGray: "1A1A1A",
};

// Fonts
const fonts = {
  title: "Calibri",
  body: "Calibri",
};

// Helper: Create shadow for depth
const makeShadow = () => ({
  type: "outer",
  blur: 8,
  offset: 3,
  color: "000000",
  opacity: 0.15,
});

// ============================================
// SLIDE 1: TITLE SLIDE
// ============================================
let slide1 = pres.addSlide();
slide1.background = { color: colors.navy };

// Gold accent bar at top
slide1.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.15,
  fill: { color: colors.gold },
  line: { type: "none" },
});

// Main title
slide1.addText("Board AI Briefing Pack", {
  x: 0.5,
  y: 1.2,
  w: 9,
  h: 0.8,
  fontSize: 48,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "center",
});

// Subtitle placeholder
slide1.addText("[Bank Name] AI Strategy", {
  x: 0.5,
  y: 2.1,
  w: 9,
  h: 0.6,
  fontSize: 32,
  color: colors.white,
  fontFace: fonts.body,
  align: "center",
});

// Subtext
slide1.addText("Strategic Board Briefing", {
  x: 0.5,
  y: 2.8,
  w: 9,
  h: 0.4,
  fontSize: 16,
  color: colors.lightGray,
  fontFace: fonts.body,
  align: "center",
  italic: true,
});

// Date and confidential notice
slide1.addText("Date: [INSERT DATE]", {
  x: 0.5,
  y: 4.5,
  w: 9,
  h: 0.3,
  fontSize: 12,
  color: colors.lightGray,
  fontFace: fonts.body,
  align: "center",
});

slide1.addText("CONFIDENTIAL - For Board Members Only", {
  x: 0.5,
  y: 5.0,
  w: 9,
  h: 0.3,
  fontSize: 11,
  color: colors.gold,
  bold: true,
  fontFace: fonts.body,
  align: "center",
});

// Speaker notes for slide 1
slide1.notes =
  "Title Slide Notes: This is the opening slide. Replace [Bank Name] with the institution name and [INSERT DATE] with the presentation date. This slide sets a premium, executive tone with navy background and gold accents aligned with Enterprise.AI brand.";

// ============================================
// SLIDE 2: EXECUTIVE SUMMARY
// ============================================
let slide2 = pres.addSlide();
slide2.background = { color: colors.white };

// Navy header bar
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

// Gold accent
slide2.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

// Title
slide2.addText("Executive Summary", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Four key messages
const messages = [
  {
    number: "1",
    title: "The AI Opportunity",
    content: "[Quantified market opportunity and competitive imperative]",
  },
  {
    number: "2",
    title: "Current State Assessment",
    content: "[Maturity level, strengths, and key capability gaps]",
  },
  {
    number: "3",
    title: "Risk & Governance Framework",
    content: "[Risk appetite, regulatory requirements, governance structure]",
  },
  {
    number: "4",
    title: "Recommended Action Plan",
    content: "[Priority initiatives, investment, and timeline]",
  },
];

let yPos = 1.2;
messages.forEach((msg, idx) => {
  // Number circle
  slide2.addShape(pres.shapes.OVAL, {
    x: 0.5,
    y: yPos,
    w: 0.35,
    h: 0.35,
    fill: { color: colors.gold },
    line: { type: "none" },
  });

  slide2.addText(msg.number, {
    x: 0.5,
    y: yPos,
    w: 0.35,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: colors.navy,
    fontFace: fonts.title,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  // Title
  slide2.addText(msg.title, {
    x: 1.0,
    y: yPos,
    w: 2.5,
    h: 0.35,
    fontSize: 14,
    bold: true,
    color: colors.navy,
    fontFace: fonts.title,
    valign: "middle",
  });

  // Content
  slide2.addText(msg.content, {
    x: 3.6,
    y: yPos,
    w: 6,
    h: 0.35,
    fontSize: 12,
    color: colors.darkGray,
    fontFace: fonts.body,
    valign: "middle",
  });

  yPos += 0.85;
});

slide2.notes =
  "Executive Summary Notes: Present the 4 key messages that frame the entire briefing. Customize each message with specific data and context for this institution. This slide should take 3-5 minutes to present and provide the strategic narrative arc.";

// ============================================
// SLIDE 3: MARKET CONTEXT
// ============================================
let slide3 = pres.addSlide();
slide3.background = { color: colors.white };

// Navy header bar
slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide3.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide3.addText("Market Context: AI in Banking", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Key statistics boxes
const stats = [
  { value: "$2.3T", label: "Projected AI Market Value in FS by 2030" },
  { value: "35%", label: "Average ROE Uplift Opportunity" },
  { value: "25%", label: "Cost/Income Improvement Target" },
];

let xPos = 0.5;
stats.forEach((stat) => {
  slide3.addShape(pres.shapes.RECTANGLE, {
    x: xPos,
    y: 1.2,
    w: 2.8,
    h: 1.8,
    fill: { color: colors.navy },
    line: { color: colors.gold, width: 2 },
    shadow: makeShadow(),
  });

  slide3.addText(stat.value, {
    x: xPos,
    y: 1.4,
    w: 2.8,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
  });

  slide3.addText(stat.label, {
    x: xPos + 0.1,
    y: 2.1,
    w: 2.6,
    h: 0.8,
    fontSize: 11,
    color: colors.white,
    fontFace: fonts.body,
    align: "center",
    valign: "middle",
  });

  xPos += 3.1;
});

// Peer benchmarks section
slide3.addText("Peer Benchmarks", {
  x: 0.5,
  y: 3.3,
  w: 9,
  h: 0.3,
  fontSize: 16,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

// Benchmark data
const benchmarks = [
  ["Bank", "AI Maturity", "Key Initiatives", "ROE Impact"],
  ["DBS Bank", "Leader", "End-to-end automation, Gen AI platforms", "+3.2%"],
  ["JPMorgan Chase", "Leader", "COIN, proprietary LLMs", "+2.8%"],
  ["UBS", "Advanced", "Risk AI, wealth management AI", "+2.1%"],
  ["[This Bank]", "[Current Level]", "[Current Initiatives]", "[To Achieve]"],
];

slide3.addTable(benchmarks, {
  x: 0.5,
  y: 3.7,
  w: 9,
  h: 1.6,
  colW: [2, 2.2, 3, 1.8],
  border: { pt: 1, color: "CCCCCC" },
  fill: { color: colors.lightGray },
  align: "left",
  fontSize: 11,
});

// Customize header row
benchmarks[0].forEach((header, idx) => {
  // Header styling is applied via table options
});

slide3.notes =
  "Market Context Notes: Establish the global AI opportunity and competitive landscape. Share peer benchmarks showing how leading banks are advancing AI. Customize the [This Bank] row with this institution's current maturity level and initiatives. This provides context for why urgent action is needed.";

// ============================================
// SLIDE 4: AI OPPORTUNITY SIZING
// ============================================
let slide4 = pres.addSlide();
slide4.background = { color: colors.white };

slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide4.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide4.addText("AI Opportunity Sizing: P&L Impact", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Sample chart data for P&L impact
slide4.addChart(
  pres.charts.BAR,
  [
    {
      name: "Annual P&L Impact",
      labels: ["Cost Reduction", "Revenue Enhancement", "Risk Mitigation", "Total Impact"],
      values: [120, 85, 45, 250],
    },
  ],
  {
    x: 0.5,
    y: 1.1,
    w: 6.5,
    h: 3.2,
    barDir: "col",
    chartColors: ["C9A227"],
    chartArea: { fill: { color: "FFFFFF" } },
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: "0D1B2A",
    showLegend: false,
    catAxisLabelColor: "1A1A1A",
    valAxisLabelColor: "1A1A1A",
  }
);

// Key metrics on right
const metrics = [
  { label: "3-Year ROI", value: "280%" },
  { label: "Payback Period", value: "18 Months" },
  { label: "COE Improvement", value: "22%" },
];

let metricY = 1.3;
metrics.forEach((metric) => {
  slide4.addShape(pres.shapes.RECTANGLE, {
    x: 7.3,
    y: metricY,
    w: 2.3,
    h: 0.8,
    fill: { color: colors.accentBlue },
    line: { type: "none" },
  });

  slide4.addText(metric.value, {
    x: 7.3,
    y: metricY + 0.08,
    w: 2.3,
    h: 0.35,
    fontSize: 18,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
  });

  slide4.addText(metric.label, {
    x: 7.3,
    y: metricY + 0.43,
    w: 2.3,
    h: 0.35,
    fontSize: 10,
    color: colors.white,
    fontFace: fonts.body,
    align: "center",
    valign: "top",
  });

  metricY += 1.0;
});

slide4.notes =
  "AI Opportunity Sizing Notes: Present the financial impact model. Customize the chart values and metrics based on detailed financial analysis. Include cost reduction opportunities (operational efficiency, FTE reduction), revenue enhancement (new services, cross-sell), and risk mitigation (fraud prevention, compliance). Show 3-year projections and payback period.";

// ============================================
// SLIDE 5: CURRENT STATE ASSESSMENT
// ============================================
let slide5 = pres.addSlide();
slide5.background = { color: colors.white };

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide5.addText("Current State: Maturity Assessment", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Maturity radar dimensions (simplified as table for clarity)
const maturityData = [
  ["Dimension", "Current", "Target", "Gap"],
  ["Strategy & Governance", "Level 2", "Level 4", "High"],
  ["Data & Infrastructure", "Level 2", "Level 4", "High"],
  ["Talent & Capabilities", "Level 1", "Level 3", "Very High"],
  ["Use Case Portfolio", "Level 2", "Level 4", "High"],
  ["Operating Model", "Level 1", "Level 4", "Very High"],
  ["Risk & Compliance", "Level 2", "Level 3", "Medium"],
];

slide5.addTable(maturityData, {
  x: 0.5,
  y: 1.1,
  w: 9,
  h: 2.2,
  colW: [3.2, 1.9, 1.9, 1.9],
  border: { pt: 1, color: "CCCCCC" },
  fill: { color: colors.lightGray },
  align: "center",
  fontSize: 10,
});

// Key strengths and gaps boxes
slide5.addText("Key Strengths", {
  x: 0.5,
  y: 3.5,
  w: 4.5,
  h: 0.3,
  fontSize: 13,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 0.5,
  y: 3.9,
  w: 4.5,
  h: 1.3,
  fill: { color: colors.lightGray },
  line: { color: colors.accentBlue, width: 1 },
});

slide5.addText(
  [
    {
      text: "Strong data foundation",
      options: { bullet: true, breakLine: true },
    },
    {
      text: "Executive AI awareness",
      options: { bullet: true, breakLine: true },
    },
    {
      text: "Existing PoCs underway",
      options: { bullet: true },
    },
  ],
  {
    x: 0.7,
    y: 4.0,
    w: 4.1,
    h: 1.1,
    fontSize: 11,
    color: colors.darkGray,
    fontFace: fonts.body,
  }
);

slide5.addText("Critical Gaps", {
  x: 5.2,
  y: 3.5,
  w: 4.3,
  h: 0.3,
  fontSize: 13,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

slide5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2,
  y: 3.9,
  w: 4.3,
  h: 1.3,
  fill: { color: colors.lightGray },
  line: { color: "FF6B6B", width: 1 },
});

slide5.addText(
  [
    {
      text: "No dedicated AI CoE",
      options: { bullet: true, breakLine: true },
    },
    {
      text: "Limited AI talent",
      options: { bullet: true, breakLine: true },
    },
    {
      text: "Fragmented governance",
      options: { bullet: true },
    },
  ],
  {
    x: 5.4,
    y: 4.0,
    w: 3.9,
    h: 1.1,
    fontSize: 11,
    color: colors.darkGray,
    fontFace: fonts.body,
  }
);

slide5.notes =
  "Current State Notes: Present a maturity assessment across 6 key dimensions. Use levels 1-4 (Emerging, Developing, Advanced, Leader). Show the gap between current and target state. Summarize key strengths to build on and critical gaps that the plan will address. This assessment justifies the recommended actions.";

// ============================================
// SLIDE 6: USE CASE PORTFOLIO
// ============================================
let slide6 = pres.addSlide();
slide6.background = { color: colors.white };

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide6.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide6.addText("Use Case Portfolio: Prioritization Matrix", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Matrix axes labels
slide6.addText("Low", {
  x: 0.5,
  y: 1.8,
  w: 0.4,
  h: 0.3,
  fontSize: 10,
  color: colors.darkGray,
  fontFace: fonts.body,
  align: "center",
});

slide6.addText("Complexity ➜", {
  x: 1.0,
  y: 1.6,
  w: 3.5,
  h: 0.3,
  fontSize: 10,
  color: colors.darkGray,
  fontFace: fonts.body,
  align: "center",
  italic: true,
});

slide6.addText("High", {
  x: 4.5,
  y: 1.8,
  w: 0.4,
  h: 0.3,
  fontSize: 10,
  color: colors.darkGray,
  fontFace: fonts.body,
  align: "center",
});

slide6.addText("High", {
  x: 0.3,
  y: 1.1,
  w: 0.4,
  h: 0.3,
  fontSize: 10,
  color: colors.darkGray,
  fontFace: fonts.body,
  align: "center",
});

slide6.addText("Val", {
  x: 0.15,
  y: 2.2,
  w: 0.2,
  h: 1.2,
  fontSize: 9,
  color: colors.darkGray,
  fontFace: fonts.body,
  align: "center",
  italic: true,
});

// Matrix quadrants
slide6.addShape(pres.shapes.RECTANGLE, {
  x: 1.0,
  y: 1.1,
  w: 3.8,
  h: 2.2,
  fill: { color: "F0F0F0" },
  line: { color: "CCCCCC", width: 2 },
});

// Dividing lines
slide6.addShape(pres.shapes.LINE, {
  x: 2.9,
  y: 1.1,
  w: 0,
  h: 2.2,
  line: { color: "CCCCCC", width: 1, dashType: "dash" },
});

slide6.addShape(pres.shapes.LINE, {
  x: 1.0,
  y: 2.2,
  w: 3.8,
  h: 0,
  line: { color: "CCCCCC", width: 1, dashType: "dash" },
});

// Use cases in quadrants
const useCases = [
  { name: "1. KYC Automation", x: 1.3, y: 1.3, quadrant: "Quick Win" },
  { name: "2. Fraud Detection", x: 2.7, y: 1.3, quadrant: "Strategic" },
  { name: "3. Portfolio Analytics", x: 1.3, y: 2.4, quadrant: "Build" },
  { name: "4. Gen AI Customer Service", x: 2.7, y: 2.4, quadrant: "Transform" },
  { name: "5. Credit Risk Modeling", x: 1.8, y: 3.0, quadrant: "Build" },
];

useCases.forEach((useCase) => {
  slide6.addShape(pres.shapes.OVAL, {
    x: useCase.x,
    y: useCase.y,
    w: 0.8,
    h: 0.8,
    fill: { color: colors.accentBlue },
    line: { type: "none" },
  });

  slide6.addText(useCase.name.split(".")[0], {
    x: useCase.x,
    y: useCase.y + 0.15,
    w: 0.8,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
    valign: "middle",
    margin: 0,
  });
});

// Legend
slide6.addText("Quick Wins: Priority 1 (3-6 months)", {
  x: 1.0,
  y: 3.5,
  w: 4.5,
  h: 0.3,
  fontSize: 11,
  color: colors.navy,
  fontFace: fonts.body,
});

// Top 5 use cases table on right
const useCasesTable = [
  ["Rank", "Use Case", "Value", "Implementation"],
  ["1", "KYC Automation", "$45M", "6 months"],
  ["2", "Fraud Detection", "$65M", "8 months"],
  ["3", "Gen AI Service", "$52M", "12 months"],
  ["4", "Portfolio Analytics", "$38M", "10 months"],
  ["5", "Credit Risk AI", "$42M", "9 months"],
];

slide6.addTable(useCasesTable, {
  x: 5.2,
  y: 1.1,
  w: 4.3,
  h: 2.2,
  colW: [0.65, 1.85, 0.95, 0.85],
  border: { pt: 1, color: "CCCCCC" },
  fill: { color: colors.lightGray },
  align: "center",
  fontSize: 9,
});

slide6.notes =
  "Use Case Portfolio Notes: Present a prioritization matrix showing value (vertical axis) vs. complexity (horizontal axis). Position your top 5 use cases. Identify quick wins (high value, low complexity) to build momentum. Show implementation timeline and expected value for each use case. This frames the investment strategy.";

// ============================================
// SLIDE 7: RISK & GOVERNANCE
// ============================================
let slide7 = pres.addSlide();
slide7.background = { color: colors.white };

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide7.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide7.addText("Risk & Governance Framework", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Risk appetite
slide7.addText("Risk Appetite Definition", {
  x: 0.5,
  y: 1.1,
  w: 4.5,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

const risks = [
  "Model Accuracy & Bias",
  "Data Privacy & Security",
  "Regulatory Compliance",
  "Operational Resilience",
  "Third-Party Risk",
];

let riskY = 1.5;
risks.forEach((risk) => {
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 0.5,
    y: riskY,
    w: 0.1,
    h: 0.3,
    fill: { color: colors.gold },
    line: { type: "none" },
  });

  slide7.addText(risk, {
    x: 0.75,
    y: riskY,
    w: 4.25,
    h: 0.3,
    fontSize: 11,
    color: colors.darkGray,
    fontFace: fonts.body,
    valign: "middle",
  });

  riskY += 0.45;
});

// Governance structure on right
slide7.addText("Proposed Governance Structure", {
  x: 5.2,
  y: 1.1,
  w: 4.3,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

const govStructure = [
  {
    title: "Board AI Committee",
    items: ["Strategic oversight", "Risk appetite", "Resource approval"],
    y: 1.5,
  },
  {
    title: "AI CoE Steering",
    items: ["Portfolio governance", "Use case prioritization", "Performance tracking"],
    y: 2.8,
  },
  {
    title: "Risk & Compliance",
    items: ["Model governance", "Bias/fairness review", "Audit & control"],
    y: 4.1,
  },
];

govStructure.forEach((gov) => {
  slide7.addShape(pres.shapes.RECTANGLE, {
    x: 5.2,
    y: gov.y,
    w: 4.3,
    h: 1.0,
    fill: { color: colors.accentBlue },
    line: { type: "none" },
  });

  slide7.addText(gov.title, {
    x: 5.4,
    y: gov.y + 0.05,
    w: 3.9,
    h: 0.25,
    fontSize: 11,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
  });

  let itemY = gov.y + 0.32;
  gov.items.forEach((item) => {
    slide7.addText(item, {
      x: 5.6,
      y: itemY,
      w: 3.7,
      h: 0.2,
      fontSize: 10,
      color: colors.white,
      fontFace: fonts.body,
      bullet: true,
    });
    itemY += 0.22;
  });
});

slide7.notes =
  "Risk & Governance Notes: Define risk appetite across key dimensions (model accuracy, data privacy, regulatory compliance, operational resilience, third-party risk). Present the proposed governance structure including Board AI Committee, AI CoE Steering, and Risk & Compliance functions. Ensure board understands that AI initiatives operate within controlled risk framework.";

// ============================================
// SLIDE 8: REGULATORY LANDSCAPE
// ============================================
let slide8 = pres.addSlide();
slide8.background = { color: colors.white };

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide8.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide8.addText("Regulatory Landscape & Compliance", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Regulatory requirements table
const regTable = [
  ["Regulation", "Requirement", "Our Approach"],
  ["SR 11-7 (US)", "Model risk governance", "Board oversight, independent review"],
  ["SS1/23 (ECB)", "AI governance framework", "CoE with risk/compliance integration"],
  ["NIST AI RMF", "Risk management", "Four-phase assessment & mitigation"],
  ["EU AI Act", "High-risk classification", "Transparency, audit trails, testing"],
  ["SAMA/CMA KSA", "Local AI governance", "Compliance matrix, quarterly reporting"],
];

slide8.addTable(regTable, {
  x: 0.5,
  y: 1.1,
  w: 9,
  h: 2.7,
  colW: [1.8, 3.3, 3.9],
  border: { pt: 1, color: "CCCCCC" },
  fill: { color: colors.lightGray },
  align: "left",
  fontSize: 10,
  valign: "middle",
});

// Compliance roadmap
slide8.addText("Compliance Roadmap", {
  x: 0.5,
  y: 4.0,
  w: 9,
  h: 0.3,
  fontSize: 13,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

const timeline = [
  { phase: "Q1 2024", items: "Governance framework, Risk policies" },
  { phase: "Q2 2024", items: "Vendor assessment, Security baseline" },
  { phase: "Q3 2024", items: "Model validation, Audit readiness" },
  { phase: "Q4 2024", items: "Full compliance, Board attestation" },
];

let phaseX = 0.5;
timeline.forEach((phase) => {
  slide8.addShape(pres.shapes.RECTANGLE, {
    x: phaseX,
    y: 4.4,
    w: 2.1,
    h: 0.9,
    fill: { color: colors.accentBlue },
    line: { type: "none" },
  });

  slide8.addText(phase.phase, {
    x: phaseX + 0.1,
    y: 4.45,
    w: 1.9,
    h: 0.25,
    fontSize: 11,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
  });

  slide8.addText(phase.items, {
    x: phaseX + 0.1,
    y: 4.72,
    w: 1.9,
    h: 0.5,
    fontSize: 9,
    color: colors.white,
    fontFace: fonts.body,
    align: "center",
    valign: "top",
  });

  phaseX += 2.3;
});

slide8.notes =
  "Regulatory Landscape Notes: Present key regulations impacting AI adoption (SR 11-7, SS1/23, NIST, EU AI Act, SAMA/CMA). Show how your governance framework addresses each requirement. Provide a compliance roadmap showing when key controls and attestations will be in place. This assures the board of regulatory readiness.";

// ============================================
// SLIDE 9: TARGET OPERATING MODEL
// ============================================
let slide9 = pres.addSlide();
slide9.background = { color: colors.white };

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide9.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide9.addText("Target Operating Model: CoE Structure", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// CoE structure
const coeRoles = [
  { title: "CoE Director", count: "1", reporting: "Chief Data Officer" },
  { title: "ML Engineers", count: "8-10", reporting: "CoE Director" },
  { title: "Data Scientists", count: "6-8", reporting: "CoE Director" },
  { title: "AI Product Mgrs", count: "4-5", reporting: "CoE Director" },
  { title: "Risk/Compliance", count: "2-3", reporting: "Chief Risk Officer" },
];

slide9.addText("Recommended Staffing", {
  x: 0.5,
  y: 1.1,
  w: 4.5,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

const staffTable = [
  ["Role", "FTEs", "Reporting To"],
  ...coeRoles.map((role) => [role.title, role.count, role.reporting]),
  ["TOTAL", "22-30", "Mixed"],
];

slide9.addTable(staffTable, {
  x: 0.5,
  y: 1.5,
  w: 4.5,
  h: 2.2,
  colW: [2.0, 1.0, 1.5],
  border: { pt: 1, color: "CCCCCC" },
  fill: { color: colors.lightGray },
  align: "center",
  fontSize: 10,
});

// Vendor strategy
slide9.addText("Vendor & Partnership Strategy", {
  x: 5.2,
  y: 1.1,
  w: 4.3,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

const vendors = [
  { category: "Cloud Platforms", partners: "AWS, Azure, GCP", role: "Infrastructure & LLMs" },
  {
    category: "Enterprise AI",
    partners: "Databricks, Palantir",
    role: "Data & ML platforms",
  },
  {
    category: "Consulting",
    partners: "Enterprise.AI, Deloitte",
    role: "Strategy & implementation",
  },
];

let vendorY = 1.5;
vendors.forEach((vendor) => {
  slide9.addShape(pres.shapes.RECTANGLE, {
    x: 5.2,
    y: vendorY,
    w: 4.3,
    h: 0.75,
    fill: { color: colors.lightGray },
    line: { color: colors.accentBlue, width: 1 },
  });

  slide9.addText(vendor.category, {
    x: 5.4,
    y: vendorY + 0.02,
    w: 3.9,
    h: 0.22,
    fontSize: 11,
    bold: true,
    color: colors.navy,
    fontFace: fonts.title,
  });

  slide9.addText(vendor.partners, {
    x: 5.4,
    y: vendorY + 0.27,
    w: 3.9,
    h: 0.18,
    fontSize: 9,
    color: colors.darkGray,
    fontFace: fonts.body,
    italic: true,
  });

  slide9.addText(vendor.role, {
    x: 5.4,
    y: vendorY + 0.47,
    w: 3.9,
    h: 0.22,
    fontSize: 9,
    color: colors.darkGray,
    fontFace: fonts.body,
  });

  vendorY += 0.95;
});

slide9.notes =
  "Target Operating Model Notes: Present the AI CoE organizational structure with recommended staffing levels. Show reporting lines (typically to CDO or CIO, with Risk/Compliance to CRO). Highlight the mix of internal talent needed (ML engineers, data scientists, product managers) and external partnerships (cloud vendors, consulting partners). Explain center-of-excellence model to drive consistency and scale.";

// ============================================
// SLIDE 10: INVESTMENT REQUIRED
// ============================================
let slide10 = pres.addSlide();
slide10.background = { color: colors.white };

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide10.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide10.addText("Investment Profile: 3-Year Plan", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Investment stacked bar chart
slide10.addChart(
  pres.charts.BAR,
  [
    {
      name: "Year 1",
      labels: ["Tech/Infrastructure", "Talent & Training", "Consulting", "Operations"],
      values: [45, 28, 22, 10],
    },
    {
      name: "Year 2",
      labels: ["Tech/Infrastructure", "Talent & Training", "Consulting", "Operations"],
      values: [35, 40, 15, 15],
    },
    {
      name: "Year 3",
      labels: ["Tech/Infrastructure", "Talent & Training", "Consulting", "Operations"],
      values: [25, 35, 10, 20],
    },
  ],
  {
    x: 0.5,
    y: 1.1,
    w: 6.5,
    h: 3.2,
    barDir: "col",
    chartColors: ["C9A227", "1B4F72", "6B8CAE", "A0C4E8"],
    chartArea: { fill: { color: "FFFFFF" } },
    valGridLine: { color: "E2E8F0", size: 0.5 },
    catGridLine: { style: "none" },
    dataLabelPosition: "inEnd",
    dataLabelColor: "FFFFFF",
    dataLabelFontSize: 9,
    catAxisLabelColor: "1A1A1A",
    valAxisLabelColor: "1A1A1A",
  }
);

// Investment summary boxes
const investmentSummary = [
  { label: "Total 3-Year Investment", value: "$85-105M" },
  { label: "Expected Annual Returns", value: "$250M" },
  { label: "NPV (@ 10% discount)", value: "$580M+" },
];

let invY = 1.2;
investmentSummary.forEach((inv) => {
  slide10.addShape(pres.shapes.RECTANGLE, {
    x: 7.3,
    y: invY,
    w: 2.3,
    h: 0.85,
    fill: { color: colors.navy },
    line: { color: colors.gold, width: 2 },
  });

  slide10.addText(inv.value, {
    x: 7.3,
    y: invY + 0.08,
    w: 2.3,
    h: 0.35,
    fontSize: 16,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
  });

  slide10.addText(inv.label, {
    x: 7.4,
    y: invY + 0.45,
    w: 2.1,
    h: 0.35,
    fontSize: 9,
    color: colors.white,
    fontFace: fonts.body,
    align: "center",
    valign: "top",
  });

  invY += 1.0;
});

// Payback analysis
slide10.addText("Payback Analysis", {
  x: 0.5,
  y: 4.6,
  w: 9,
  h: 0.25,
  fontSize: 12,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

slide10.addText(
  "Year 1 investments in infrastructure and talent lay foundation. Year 2 shows ROI from initial use cases. Year 3 reaches full payback as portfolio scales. Cumulative 3-year ROI: 280%.",
  {
    x: 0.5,
    y: 4.9,
    w: 9,
    h: 0.5,
    fontSize: 11,
    color: colors.darkGray,
    fontFace: fonts.body,
  }
);

slide10.notes =
  "Investment Profile Notes: Show 3-year investment breakdown by category (infrastructure, talent, consulting, operations). Include expected returns and NPV to justify the investment. Demonstrate that payback period is 18-24 months with cumulative 3-year ROI of 280%+. This financial case should convince the board to approve the investment.";

// ============================================
// SLIDE 11: RECOMMENDED ACTIONS
// ============================================
let slide11 = pres.addSlide();
slide11.background = { color: colors.white };

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.8,
  fill: { color: colors.navy },
  line: { type: "none" },
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0.8,
  w: 10,
  h: 0.08,
  fill: { color: colors.gold },
  line: { type: "none" },
});

slide11.addText("Recommended Actions: 90-Day to 12-Month Plan", {
  x: 0.5,
  y: 0.15,
  w: 9,
  h: 0.5,
  fontSize: 36,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
  valign: "middle",
  margin: 0,
});

// Action timeline
const actions = [
  {
    phase: "Days 1-90",
    title: "Foundation",
    items: ["Establish AI CoE", "Define governance framework", "Finalize vendor partnerships"],
  },
  {
    phase: "6 Months",
    title: "Acceleration",
    items: ["Deploy 2-3 quick wins", "Scale CoE team", "Implement monitoring/governance"],
  },
  {
    phase: "12 Months",
    title: "Portfolio Impact",
    items: ["5+ use cases live", "Demonstrate ROI", "Plan Year 2 scaling"],
  },
];

let actionX = 0.5;
actions.forEach((action) => {
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: actionX,
    y: 1.2,
    w: 3,
    h: 3.0,
    fill: { color: colors.lightGray },
    line: { color: colors.accentBlue, width: 2 },
  });

  // Timeline phase header
  slide11.addShape(pres.shapes.RECTANGLE, {
    x: actionX,
    y: 1.2,
    w: 3,
    h: 0.5,
    fill: { color: colors.accentBlue },
    line: { type: "none" },
  });

  slide11.addText(action.phase, {
    x: actionX,
    y: 1.25,
    w: 3,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: colors.gold,
    fontFace: fonts.title,
    align: "center",
    valign: "middle",
    margin: 0,
  });

  slide11.addText(action.title, {
    x: actionX + 0.15,
    y: 1.8,
    w: 2.7,
    h: 0.3,
    fontSize: 13,
    bold: true,
    color: colors.navy,
    fontFace: fonts.title,
  });

  let itemY = 2.15;
  action.items.forEach((item) => {
    slide11.addText(item, {
      x: actionX + 0.15,
      y: itemY,
      w: 2.7,
      h: 0.35,
      fontSize: 10,
      color: colors.darkGray,
      fontFace: fonts.body,
      bullet: true,
    });
    itemY += 0.45;
  });

  actionX += 3.2;
});

// Key decisions box
slide11.addText("Key Board Decisions Required", {
  x: 0.5,
  y: 4.5,
  w: 9,
  h: 0.25,
  fontSize: 12,
  bold: true,
  color: colors.navy,
  fontFace: fonts.title,
});

slide11.addShape(pres.shapes.RECTANGLE, {
  x: 0.5,
  y: 4.8,
  w: 9,
  h: 0.65,
  fill: { color: colors.lightGray },
  line: { color: colors.navy, width: 1 },
});

slide11.addText(
  [
    { text: "Approve $85-105M 3-year investment program", options: { bullet: true, breakLine: true } },
    { text: "Authorize CoE establishment and staffing", options: { bullet: true, breakLine: true } },
    {
      text: "Empower use case prioritization and execution governance",
      options: { bullet: true },
    },
  ],
  {
    x: 0.7,
    y: 4.85,
    w: 8.6,
    h: 0.55,
    fontSize: 10,
    color: colors.darkGray,
    fontFace: fonts.body,
  }
);

slide11.notes =
  "Recommended Actions Notes: Present a clear 90-day, 6-month, and 12-month roadmap. Foundation phase establishes governance and partnerships. Acceleration phase demonstrates early wins and builds confidence. Portfolio phase scales impact across the organization. Highlight 3 key board decisions required for execution. Frame this as an executable, time-bound plan.";

// ============================================
// SLIDE 12: NEXT STEPS & DISCUSSION
// ============================================
let slide12 = pres.addSlide();
slide12.background = { color: colors.navy };

// Gold accent bar at top
slide12.addShape(pres.shapes.RECTANGLE, {
  x: 0,
  y: 0,
  w: 10,
  h: 0.15,
  fill: { color: colors.gold },
  line: { type: "none" },
});

// Title
slide12.addText("Next Steps & Discussion", {
  x: 0.5,
  y: 0.6,
  w: 9,
  h: 0.6,
  fontSize: 40,
  bold: true,
  color: colors.gold,
  fontFace: fonts.title,
  align: "left",
});

// Key discussion points
slide12.addText("Key Discussion Topics for the Board", {
  x: 0.5,
  y: 1.4,
  w: 9,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.white,
  fontFace: fonts.title,
});

const discussions = [
  "Risk appetite and governance framework alignment",
  "Investment timing and phasing strategy",
  "Talent acquisition and retention plan",
  "Competitive response timeline",
  "Success metrics and board-level KPIs",
];

let discY = 1.8;
discussions.forEach((item) => {
  slide12.addShape(pres.shapes.RECTANGLE, {
    x: 0.5,
    y: discY,
    w: 0.08,
    h: 0.25,
    fill: { color: colors.gold },
    line: { type: "none" },
  });

  slide12.addText(item, {
    x: 0.7,
    y: discY,
    w: 8.8,
    h: 0.25,
    fontSize: 12,
    color: colors.white,
    fontFace: fonts.body,
    valign: "middle",
  });

  discY += 0.45;
});

// Next steps
slide12.addText("Next Steps", {
  x: 0.5,
  y: 4.0,
  w: 9,
  h: 0.3,
  fontSize: 14,
  bold: true,
  color: colors.white,
  fontFace: fonts.title,
});

const nextSteps = [
  "Board decision on strategic direction & investment",
  "Detailed 100-day planning with executives",
  "Vendor RFP and partnership agreements",
  "CoE leadership recruitment begins",
];

let nextY = 4.4;
nextSteps.forEach((step) => {
  slide12.addText(step, {
    x: 0.65,
    y: nextY,
    w: 8.7,
    h: 0.25,
    fontSize: 11,
    color: colors.lightGray,
    fontFace: fonts.body,
    bullet: true,
  });

  nextY += 0.35;
});

// Contact section
slide12.addShape(pres.shapes.RECTANGLE, {
  x: 0.5,
  y: 5.0,
  w: 9,
  h: 0.5,
  fill: { color: colors.accentBlue },
  line: { type: "none" },
});

slide12.addText(
  [
    { text: "Questions? Contact: ", options: { breakLine: false } },
    {
      text: "advisor@rodney-ai.com",
      options: { bold: true, breakLine: true },
    },
    { text: "Enterprise.AI AI Advisory Practice", options: {} },
  ],
  {
    x: 0.7,
    y: 5.08,
    w: 8.6,
    h: 0.34,
    fontSize: 11,
    color: colors.white,
    fontFace: fonts.body,
    align: "center",
    valign: "middle",
  }
);

slide12.notes =
  "Next Steps & Discussion Notes: Close with discussion topics for board consideration. Present final next steps with clear ownership and timelines. Provide Enterprise.AI contact for follow-up questions. This is the call-to-action slide that drives board decision. Ensure contact information is clearly visible for post-presentation engagement.";

// ============================================
// SAVE PRESENTATION
// ============================================
pres.writeFile({ fileName: "board-ai-briefing-pack-template.pptx" });
console.log(
  "Presentation created: board-ai-briefing-pack-template.pptx"
);
