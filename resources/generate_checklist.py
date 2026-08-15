#!/usr/bin/env python3
"""
AI Governance Readiness Checklist PDF Generator
For Enterprise.AI - AI Executive Advisory Practice
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak,
    Image, KeepTogether, Frame, PageTemplate
)
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# Brand colors
NAVY = colors.HexColor('#0D1B2A')
GOLD = colors.HexColor('#C9A227')
WHITE = colors.HexColor('#FFFFFF')
LIGHT_GRAY = colors.HexColor('#F5F5F5')
DARK_GRAY = colors.HexColor('#333333')

# Page dimensions
PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 0.6 * inch

class NumberedCanvasWithFooter(canvas.Canvas):
    """Canvas with page numbers and footer"""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.page_num = 0

    def showPage(self):
        self.page_num += 1
        self._showPage()

    def _showPage(self):
        # Add footer
        self.setFont("Helvetica", 9)
        self.setFillColor(DARK_GRAY)
        self.drawString(
            MARGIN,
            0.4 * inch,
            f"© 2026 Enterprise.AI. Confidential. Page {self.page_num}"
        )
        self.drawRightString(
            PAGE_WIDTH - MARGIN,
            0.4 * inch,
            "rodney@theenterpriseai.co.uk"
        )
        # Draw footer line
        self.setStrokeColor(GOLD)
        self.setLineWidth(0.5)
        self.line(MARGIN, 0.5 * inch, PAGE_WIDTH - MARGIN, 0.5 * inch)
        super().showPage()

def get_custom_styles():
    """Create custom styles for the document"""
    styles = getSampleStyleSheet()

    # Title style
    if 'CustomTitle' not in styles:
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=36,
            textColor=NAVY,
            spaceAfter=12,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))

    # Subtitle style
    if 'Subtitle' not in styles:
        styles.add(ParagraphStyle(
            name='Subtitle',
            parent=styles['Normal'],
            fontSize=14,
            textColor=GOLD,
            spaceAfter=24,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))

    # Section heading
    if 'SectionHead' not in styles:
        styles.add(ParagraphStyle(
            name='SectionHead',
            parent=styles['Heading1'],
            fontSize=16,
            textColor=NAVY,
            spaceAfter=12,
            spaceBefore=12,
            fontName='Helvetica-Bold',
            borderColor=GOLD,
            borderWidth=0,
            borderPadding=6
        ))

    # Subsection heading
    if 'SubsectionHead' not in styles:
        styles.add(ParagraphStyle(
            name='SubsectionHead',
            parent=styles['Heading2'],
            fontSize=13,
            textColor=NAVY,
            spaceAfter=8,
            spaceBefore=8,
            fontName='Helvetica-Bold'
        ))

    # Body text
    if 'BodyText' not in styles:
        styles.add(ParagraphStyle(
            name='BodyText',
            parent=styles['Normal'],
            fontSize=11,
            textColor=DARK_GRAY,
            spaceAfter=6,
            alignment=TA_JUSTIFY,
            fontName='Helvetica'
        ))

    # Small text
    if 'SmallText' not in styles:
        styles.add(ParagraphStyle(
            name='SmallText',
            parent=styles['Normal'],
            fontSize=9,
            textColor=DARK_GRAY,
            spaceAfter=4,
            fontName='Helvetica'
        ))

    return styles

def create_cover_page(story, styles):
    """Create the professional cover page"""
    story.append(Spacer(1, 1.2 * inch))

    # Logo/Brand
    story.append(Paragraph("ENTERPRISE.AI", styles['CustomTitle']))
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph("SCALE · GOVERN · UNLOCK", styles['Subtitle']))
    story.append(Spacer(1, 0.8 * inch))

    # Main title
    story.append(Paragraph(
        "AI Governance Readiness Checklist",
        styles['CustomTitle']
    ))
    story.append(Spacer(1, 0.4 * inch))

    # Subtitle
    story.append(Paragraph(
        "40-Point Assessment Against SR 11-7, SS1/23, NIST AI RMF & EU AI Act",
        styles['BodyText']
    ))
    story.append(Spacer(1, 1.2 * inch))

    # Key information
    cover_info = [
        ["Assessment Framework", "SR 11-7 | SS1/23 | NIST AI RMF | EU AI Act"],
        ["Target Audience", "Financial Services (Banks, Capital Markets, Sovereigns)"],
        ["Regions", "Middle East, UK, Europe"],
        ["Completion Time", "Under 1 hour"],
        ["Assessment Points", "40+ governance checkpoints"],
    ]

    cover_table = Table(cover_info, colWidths=[2 * inch, 3.5 * inch])
    cover_table.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 11),
        ('FONT', (1, 0), (1, -1), 'Helvetica', 11),
        ('TEXTCOLOR', (0, 0), (0, -1), GOLD),
        ('TEXTCOLOR', (1, 0), (1, -1), DARK_GRAY),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    story.append(cover_table)
    story.append(Spacer(1, 1.0 * inch))

    # Footer
    story.append(Spacer(1, 0.5 * inch))
    story.append(Paragraph(
        "Contact: <b>rodney@theenterpriseai.co.uk</b>",
        styles['BodyText']
    ))
    story.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y')}",
        styles['SmallText']
    ))

    story.append(PageBreak())

def create_executive_summary(story, styles):
    """Create the executive summary page"""
    story.append(Paragraph("Executive Summary", styles['SectionHead']))
    story.append(Spacer(1, 0.2 * inch))

    summary_text = """
    This comprehensive checklist guides financial institutions through a systematic assessment of their
    AI governance maturity across regulatory frameworks and organizational domains. Designed for Chief Risk
    Officers, Heads of AI, and Governance leaders, this tool evaluates 40+ critical governance dimensions.
    """
    story.append(Paragraph(summary_text, styles['BodyText']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Why This Assessment Matters</b>", styles['SubsectionHead']))

    why_items = [
        "Regulatory Convergence: SR 11-7, SS1/23, NIST AI RMF, and EU AI Act establish increasingly consistent expectations for AI governance",
        "Risk Concentration: AI model failures in financial services create systemic risks requiring robust governance frameworks",
        "Maturity Gap: Many institutions lack comprehensive policies across the AI lifecycle from strategy through monitoring",
        "Competitive Advantage: Strong governance creates operational efficiency and stakeholder confidence"
    ]

    for item in why_items:
        story.append(Paragraph(f"• {item}", styles['BodyText']))

    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>How to Use This Checklist</b>", styles['SubsectionHead']))

    how_items = [
        "<b>1. Self-Assessment:</b> Score each item from 1-5 based on your institution's current state",
        "<b>2. Cross-Functional Review:</b> Engage Risk, Compliance, Model Risk, Technology, and Business teams",
        "<b>3. Regulatory Mapping:</b> Each item references specific regulatory requirements for documented compliance",
        "<b>4. Prioritization:</b> Use the scoring methodology to identify critical gaps and roadmap improvements",
        "<b>5. Follow-Up:</b> Enterprise.AI advisory engagement can support remediation planning and implementation"
    ]

    for item in how_items:
        story.append(Paragraph(item, styles['BodyText']))

    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Assessment Domains</b>", styles['SubsectionHead']))

    domains = [
        ("Policy & Strategy", "8 items - Governance framework, AI strategy, risk appetite"),
        ("Model Risk Management", "8 items - SR 11-7 alignment, model development, validation"),
        ("SS1/23 Compliance", "6 items - UK PRA operational resilience for AI systems"),
        ("NIST AI RMF", "6 items - NIST AI Risk Management Framework alignment"),
        ("EU AI Act Readiness", "6 items - EU AI Act compliance preparation and controls"),
        ("Data Governance", "6 items - Data quality, lineage, bias detection, privacy"),
        ("People & Culture", "4 items - Skills, training, accountability, AI ethics")
    ]

    domain_data = [[d[0], d[1]] for d in domains]
    domain_table = Table(domain_data, colWidths=[2.0 * inch, 4.0 * inch])
    domain_table.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 10),
        ('FONT', (1, 0), (1, -1), 'Helvetica', 10),
        ('TEXTCOLOR', (0, 0), (0, -1), NAVY),
        ('TEXTCOLOR', (1, 0), (1, -1), DARK_GRAY),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [LIGHT_GRAY, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))

    story.append(domain_table)
    story.append(PageBreak())

def create_checklist_items():
    """Define all 40+ checklist items organized by domain"""

    checklist = {
        "Policy & Strategy": [
            {
                "id": "PS-1",
                "item": "Formal AI governance charter and board-approved AI strategy",
                "description": "Board-level charter defining AI governance structure, roles, accountabilities, and escalation procedures",
                "regulatory": "SR 11-7 (governance framework), NIST AI RMF (governance), EU AI Act (AI Act compliance)",
                "maturity": 5
            },
            {
                "id": "PS-2",
                "item": "Defined AI risk appetite statement aligned with institutional risk appetite",
                "description": "Documented risk appetite for different AI model types, use cases, and deployment contexts",
                "regulatory": "SR 11-7 (risk governance), NIST AI RMF (risk determination)",
                "maturity": 4
            },
            {
                "id": "PS-3",
                "item": "Comprehensive AI policy framework covering development through decommissioning",
                "description": "End-to-end policies covering AI strategy, development, testing, deployment, monitoring, and retirement",
                "regulatory": "SS1/23 (operational resilience), SR 11-7 (AI governance), EU AI Act (Article 9-13 controls)",
                "maturity": 5
            },
            {
                "id": "PS-4",
                "item": "Three lines of defense model for AI governance and controls",
                "description": "Clear separation between business ownership (1st), risk/compliance oversight (2nd), and internal audit (3rd)",
                "regulatory": "SR 11-7 (three lines model), Basel governance frameworks",
                "maturity": 4
            },
            {
                "id": "PS-5",
                "item": "Board and senior management reporting on AI risk, performance, and incidents",
                "description": "Regular board-level and executive reports on AI portfolio health, emerging risks, and compliance status",
                "regulatory": "SR 11-7 (governance), SS1/23 (senior management awareness)",
                "maturity": 3
            },
            {
                "id": "PS-6",
                "item": "AI ethics principles and responsible AI framework",
                "description": "Documented principles covering fairness, transparency, accountability, and societal impact",
                "regulatory": "EU AI Act (Article 2-3), NIST AI RMF (responsible AI)",
                "maturity": 3
            },
            {
                "id": "PS-7",
                "item": "Model inventory and registry with ownership and metadata",
                "description": "Centralized registry of all AI models in production with owner, purpose, risk classification, data sources",
                "regulatory": "SR 11-7 (model inventory), SS1/23 (system inventory)",
                "maturity": 3
            },
            {
                "id": "PS-8",
                "item": "Change management and versioning procedures for AI models",
                "description": "Documented procedures for model updates, retraining, versioning, and change approval workflows",
                "regulatory": "SR 11-7 (governance), NIST AI RMF (continuous monitoring)",
                "maturity": 3
            }
        ],
        "Model Risk Management / SR 11-7": [
            {
                "id": "MRM-1",
                "item": "Model development standards and lifecycle governance framework",
                "description": "Documented standards for model development, including requirements, architecture, testing protocols",
                "regulatory": "SR 11-7 (independent governance), NIST AI RMF (map, measure, manage)",
                "maturity": 4
            },
            {
                "id": "MRM-2",
                "item": "Independent model validation and sign-off process",
                "description": "Segregated validation team independent from development, with documented validation plans and sign-off criteria",
                "regulatory": "SR 11-7 (independent validation mandatory)",
                "maturity": 5
            },
            {
                "id": "MRM-3",
                "item": "Backtesting, benchmarking, and performance monitoring framework",
                "description": "Regular backtesting against benchmarks, monitoring of actual vs. predicted performance, error analysis",
                "regulatory": "SR 11-7 (ongoing monitoring), Basel III framework",
                "maturity": 4
            },
            {
                "id": "MRM-4",
                "item": "Model documentation standards (including explainability requirements)",
                "description": "Comprehensive documentation of model purpose, inputs, methodology, assumptions, limitations, and explainability",
                "regulatory": "SR 11-7 (model documentation), EU AI Act (technical documentation)",
                "maturity": 4
            },
            {
                "id": "MRM-5",
                "item": "Stress testing and scenario analysis for AI models",
                "description": "Regular stress tests under adverse scenarios, sensitivity analysis, and edge case evaluation",
                "regulatory": "SR 11-7 (stress testing), SS1/23 (resilience testing)",
                "maturity": 3
            },
            {
                "id": "MRM-6",
                "item": "Model risk capital allocation and impact assessment",
                "description": "Quantification of model risk, capital allocation for model risk, and impact on institution's risk profile",
                "regulatory": "SR 11-7 (risk management), Basel capital frameworks",
                "maturity": 2
            },
            {
                "id": "MRM-7",
                "item": "Model governance for third-party/vendor models and frameworks",
                "description": "Due diligence, SLAs, performance monitoring, and risk assessment for external models and AI services",
                "regulatory": "SR 11-7 (vendor risk), NIST AI RMF (supply chain)",
                "maturity": 3
            },
            {
                "id": "MRM-8",
                "item": "Incident management and remediation procedures for model failures",
                "description": "Rapid escalation, root cause analysis, client notification, and remediation procedures for model failures",
                "regulatory": "SR 11-7 (incident handling), SS1/23 (incident reporting)",
                "maturity": 3
            }
        ],
        "SS1/23 Compliance (UK PRA)": [
            {
                "id": "SS-1",
                "item": "Senior manager accountable for AI model risk (SMAR designation)",
                "description": "Clear designation of senior manager with accountability for model risk governance",
                "regulatory": "SS1/23 (SMAR requirement)",
                "maturity": 4
            },
            {
                "id": "SS-2",
                "item": "Operational resilience impact tolerance for AI-dependent processes",
                "description": "Documented impact tolerance for critical functions supported by AI, with regular testing and monitoring",
                "regulatory": "SS1/23 (impact tolerance), EMIR Article 31",
                "maturity": 3
            },
            {
                "id": "SS-3",
                "item": "AI model resilience testing and scenario analysis",
                "description": "Regular testing of model performance under adverse conditions, data quality degradation, and operational stress",
                "regulatory": "SS1/23 (operational resilience)",
                "maturity": 3
            },
            {
                "id": "SS-4",
                "item": "Data quality and availability controls for production AI models",
                "description": "Monitoring of data quality metrics, availability thresholds, and contingency arrangements",
                "regulatory": "SS1/23 (data resilience), NIST AI RMF (data governance)",
                "maturity": 3
            },
            {
                "id": "SS-5",
                "item": "Fallback arrangements and model override procedures",
                "description": "Documented procedures for manual review, model override, and fallback to non-AI processes when needed",
                "regulatory": "SS1/23 (operational resilience), EU AI Act (human oversight)",
                "maturity": 3
            },
            {
                "id": "SS-6",
                "item": "Regular reporting to PRA on model risk and resilience status",
                "description": "Compliance with SS1/23 reporting requirements, including model inventory and resilience assessments",
                "regulatory": "SS1/23 (reporting requirements)",
                "maturity": 2
            }
        ],
        "NIST AI RMF Alignment": [
            {
                "id": "NIST-1",
                "item": "NIST AI RMF governance and accountability structure",
                "description": "Roles and responsibilities aligned with NIST AI RMF framework (MAP, MEASURE, MANAGE, MONITOR)",
                "regulatory": "NIST AI RMF (governance framework)",
                "maturity": 3
            },
            {
                "id": "NIST-2",
                "item": "Risk mapping for AI models (MAP function)",
                "description": "Systematic identification and documentation of AI risks across the model lifecycle",
                "regulatory": "NIST AI RMF (risk mapping)",
                "maturity": 3
            },
            {
                "id": "NIST-3",
                "item": "Measurement of AI risks and performance metrics (MEASURE function)",
                "description": "Metrics and measurement protocols for model accuracy, bias, fairness, robustness, and other risk dimensions",
                "regulatory": "NIST AI RMF (risk measurement)",
                "maturity": 3
            },
            {
                "id": "NIST-4",
                "item": "Risk mitigation and control implementation (MANAGE function)",
                "description": "Active management of identified risks through controls, model updates, and process improvements",
                "regulatory": "NIST AI RMF (risk management)",
                "maturity": 3
            },
            {
                "id": "NIST-5",
                "item": "Continuous monitoring and feedback loops (MONITOR function)",
                "description": "Ongoing monitoring of model performance, feedback collection, and incorporation into improvement processes",
                "regulatory": "NIST AI RMF (continuous monitoring)",
                "maturity": 2
            },
            {
                "id": "NIST-6",
                "item": "Integration with enterprise risk management framework",
                "description": "AI risk management integrated with broader enterprise risk management and reporting structures",
                "regulatory": "NIST AI RMF (enterprise integration)",
                "maturity": 2
            }
        ],
        "EU AI Act Readiness": [
            {
                "id": "EU-1",
                "item": "Classification of AI systems by risk level (prohibited/high/limited/minimal)",
                "description": "Documented classification of AI systems according to EU AI Act risk categories",
                "regulatory": "EU AI Act (Articles 6-10, risk classification)",
                "maturity": 2
            },
            {
                "id": "EU-2",
                "item": "Risk assessment and mitigation for high-risk AI systems",
                "description": "Comprehensive risk assessments and mitigation strategies for AI systems classified as high-risk",
                "regulatory": "EU AI Act (Article 9, risk assessment)",
                "maturity": 2
            },
            {
                "id": "EU-3",
                "item": "Prohibited AI practices policy (compliance with Article 5)",
                "description": "Explicit policies prohibiting subliminal manipulation, exploiting vulnerable groups, social scoring systems",
                "regulatory": "EU AI Act (Article 5, prohibited practices)",
                "maturity": 2
            },
            {
                "id": "EU-4",
                "item": "Transparency and disclosure for AI-based decision making",
                "description": "Clear disclosure to customers when AI is used in decision-making, explainability of decisions",
                "regulatory": "EU AI Act (Article 13-14, transparency)",
                "maturity": 2
            },
            {
                "id": "EU-5",
                "item": "AI governance and compliance management system (Articles 16-29)",
                "description": "Documented compliance with Articles 16-29 including record-keeping, documentation, and quality management",
                "regulatory": "EU AI Act (Articles 16-29)",
                "maturity": 1
            },
            {
                "id": "EU-6",
                "item": "EU AI Act conformity assessment and CE marking readiness",
                "description": "Preparation for conformity assessment procedures and potential CE marking requirements",
                "regulatory": "EU AI Act (Articles 43-49, conformity assessment)",
                "maturity": 1
            }
        ],
        "Data Governance & Quality": [
            {
                "id": "DG-1",
                "item": "Data governance framework and data ownership structure",
                "description": "Documented framework defining data stewardship, ownership, quality standards, and retention policies",
                "regulatory": "GDPR (data governance), NIST AI RMF (data management)",
                "maturity": 3
            },
            {
                "id": "DG-2",
                "item": "Data quality monitoring and validation controls",
                "description": "Automated and manual controls monitoring data completeness, accuracy, consistency, and timeliness",
                "regulatory": "SS1/23 (data quality), SR 11-7 (data governance)",
                "maturity": 3
            },
            {
                "id": "DG-3",
                "item": "Bias detection, measurement, and mitigation procedures",
                "description": "Tools and processes to detect algorithmic bias, measure disparate impact, and implement mitigation strategies",
                "regulatory": "EU AI Act (fairness), NIST AI RMF (bias assessment), Fair Lending rules",
                "maturity": 2
            },
            {
                "id": "DG-4",
                "item": "Data lineage, provenance, and traceability documentation",
                "description": "Complete tracking of data sources, transformations, and flow through AI model pipeline",
                "regulatory": "GDPR (data accountability), EU AI Act (documentation)",
                "maturity": 2
            },
            {
                "id": "DG-5",
                "item": "Privacy and consent management for training and operational data",
                "description": "Controls ensuring proper consent, data minimization, and privacy protection for all AI data uses",
                "regulatory": "GDPR (privacy), CCPA, financial services data regulations",
                "maturity": 3
            },
            {
                "id": "DG-6",
                "item": "Data retention, deletion, and versioning policies for model training",
                "description": "Policies defining training data retention periods, secure deletion procedures, and version control",
                "regulatory": "GDPR (data retention), SR 11-7 (record keeping)",
                "maturity": 2
            }
        ],
        "People, Culture & Training": [
            {
                "id": "PC-1",
                "item": "AI skills assessment and hiring plan for governance and risk roles",
                "description": "Identification of required AI governance, data science, and technical skills; hiring and development plans",
                "regulatory": "SR 11-7 (governance capability), SS1/23 (senior manager requirements)",
                "maturity": 2
            },
            {
                "id": "PC-2",
                "item": "Regular training program on AI risks for board, management, and staff",
                "description": "Tiered training covering AI fundamentals, governance frameworks, and role-specific AI risk knowledge",
                "regulatory": "SR 11-7 (skills and knowledge), SS1/23 (senior manager awareness)",
                "maturity": 2
            },
            {
                "id": "PC-3",
                "item": "Clear accountabilities and escalation procedures for AI incidents",
                "description": "Documented roles, responsibilities, and escalation paths for model failures, bias discoveries, and data issues",
                "regulatory": "SR 11-7 (governance), SS1/23 (accountability)",
                "maturity": 2
            },
            {
                "id": "PC-4",
                "item": "Ethical framework for AI development and decision-making",
                "description": "Ethics review processes, guidelines for responsible AI use, and protection of whistleblower concerns",
                "regulatory": "EU AI Act (ethical AI), SR 11-7 (governance)",
                "maturity": 1
            }
        ]
    }

    return checklist

def create_checklist_pages(story, styles):
    """Create pages with checklist items"""

    checklist = create_checklist_items()

    for domain_name, items in checklist.items():
        story.append(Paragraph(domain_name, styles['SectionHead']))
        story.append(Spacer(1, 0.15 * inch))

        for item in items:
            # Item header with ID
            item_header = f"<b>{item['id']}: {item['item']}</b>"
            story.append(Paragraph(item_header, styles['BodyText']))

            # Description
            story.append(Paragraph(f"<i>{item['description']}</i>", styles['SmallText']))

            # Create checkbox row with regulatory and scoring
            checkbox_data = [
                ["☐", "Assessment Score: 1 (Not in place) to 5 (Fully implemented)"],
                ["", "Score: ____ / 5"],
            ]

            checkbox_table = Table(checkbox_data, colWidths=[0.3 * inch, 5.2 * inch])
            checkbox_table.setStyle(TableStyle([
                ('FONT', (0, 0), (-1, -1), 'Helvetica', 10),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('LEFTPADDING', (0, 0), (-1, -1), 4),
                ('RIGHTPADDING', (0, 0), (-1, -1), 4),
                ('TOPPADDING', (0, 0), (-1, -1), 3),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ]))

            story.append(checkbox_table)

            # Regulatory reference
            reg_text = f"<font size=8><b>Regulatory Reference:</b> {item['regulatory']}</font>"
            story.append(Paragraph(reg_text, styles['SmallText']))

            story.append(Spacer(1, 0.12 * inch))

        story.append(PageBreak())

def create_scoring_methodology(story, styles):
    """Create the scoring methodology page"""
    story.append(Paragraph("Scoring Methodology & Interpretation", styles['SectionHead']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Maturity Scoring Scale (1-5)</b>", styles['SubsectionHead']))

    scoring_data = [
        ["Score", "Level", "Definition"],
        ["1", "Initial/Ad-hoc", "Practice is not in place or only ad-hoc; significant work required"],
        ["2", "Developing", "Practice is partially implemented; many gaps remain"],
        ["3", "Defined", "Practice is documented and implemented; some gaps in consistency or coverage"],
        ["4", "Managed", "Practice is well-implemented and monitored; minor gaps only"],
        ["5", "Optimized", "Practice is fully implemented, monitored, and continuously improved"],
    ]

    scoring_table = Table(scoring_data, colWidths=[0.8 * inch, 1.2 * inch, 3.5 * inch])
    scoring_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
        ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [LIGHT_GRAY, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))

    story.append(scoring_table)
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph("<b>Scoring Calculation</b>", styles['SubsectionHead']))

    calc_text = """
    <b>Domain Scores:</b> Average the scores for all items within each governance domain (Policy & Strategy,
    Model Risk Management, etc.) to obtain domain-level maturity scores.<br/>
    <br/>
    <b>Overall Governance Maturity Score:</b> Average all individual item scores to obtain an overall
    governance maturity rating.<br/>
    <br/>
    <b>Gap Analysis:</b> Items scoring below 3 indicate significant control gaps requiring attention.
    Items scoring 3-4 benefit from enhancement. Items at 5 represent best practice benchmarks.
    """
    story.append(Paragraph(calc_text, styles['BodyText']))

    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Interpretation Guide</b>", styles['SubsectionHead']))

    interpretation_data = [
        ["Overall Score", "Governance Posture", "Recommended Actions"],
        ["1.0 - 2.0", "High Risk", "Urgent remediation required; significant regulatory exposure"],
        ["2.1 - 3.0", "Moderate Risk", "Material gaps; prioritize critical domain improvements"],
        ["3.1 - 4.0", "Manageable Risk", "Solid foundation; continue maturation of controls"],
        ["4.1 - 5.0", "Low Risk", "Strong governance posture; focus on continuous improvement"],
    ]

    interpretation_table = Table(interpretation_data, colWidths=[1.2 * inch, 1.8 * inch, 2.5 * inch])
    interpretation_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
        ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [LIGHT_GRAY, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))

    story.append(interpretation_table)
    story.append(PageBreak())

def create_scorecard_template(story, styles):
    """Create the summary scorecard template"""
    story.append(Paragraph("Assessment Summary Scorecard", styles['SectionHead']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph(
        "Complete this template to summarize your assessment results across governance domains.",
        styles['BodyText']
    ))
    story.append(Spacer(1, 0.15 * inch))

    domains_list = [
        "Policy & Strategy",
        "Model Risk Management / SR 11-7",
        "SS1/23 Compliance (UK PRA)",
        "NIST AI RMF Alignment",
        "EU AI Act Readiness",
        "Data Governance & Quality",
        "People, Culture & Training"
    ]

    scorecard_data = [["Domain", "# Items", "Total Score", "Average Score (÷ items)", "Rating"]]

    for domain in domains_list:
        scorecard_data.append([domain, "___", "___", "___", ""])

    scorecard_data.append(["<b>OVERALL GOVERNANCE MATURITY</b>", "", "", "<b>___/5</b>", ""])

    scorecard_table = Table(scorecard_data, colWidths=[2.0 * inch, 0.8 * inch, 1.0 * inch, 1.2 * inch, 1.0 * inch])
    scorecard_table.setStyle(TableStyle([
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold', 11),
        ('BACKGROUND', (0, -1), (-1, -1), GOLD),
        ('TEXTCOLOR', (0, -1), (-1, -1), NAVY),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [LIGHT_GRAY, WHITE]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CCCCCC')),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
    ]))

    story.append(scorecard_table)
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph("<b>Priority Gap Areas (Scores 1-2)</b>", styles['SubsectionHead']))
    story.append(Paragraph(
        "Identify and list the 5-10 most critical governance gaps for focused remediation planning.",
        styles['SmallText']
    ))

    gap_template = """
    <b>Gap 1:</b> _____________________________________________ (Score: ___/5)<br/>
    <b>Gap 2:</b> _____________________________________________ (Score: ___/5)<br/>
    <b>Gap 3:</b> _____________________________________________ (Score: ___/5)<br/>
    <b>Gap 4:</b> _____________________________________________ (Score: ___/5)<br/>
    <b>Gap 5:</b> _____________________________________________ (Score: ___/5)<br/>
    """

    story.append(Paragraph(gap_template, styles['BodyText']))
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("<b>Next Steps & Remediation Planning</b>", styles['SubsectionHead']))

    next_steps_text = """
    Based on your assessment, consider the following roadmap:<br/>
    <br/>
    <b>Immediate (0-3 months):</b> Address critical gaps in high-risk areas (MRM, Policy & Strategy)<br/>
    <b>Near-term (3-6 months):</b> Complete foundational governance framework and data governance<br/>
    <b>Medium-term (6-12 months):</b> Build advanced monitoring, bias detection, and continuous improvement<br/>
    <b>Ongoing:</b> Maintain alignment with evolving regulations (EU AI Act, NIST updates, emerging guidance)<br/>
    <br/>
    <b>Enterprise.AI Advisory Support:</b> We specialize in accelerating governance maturity through
    strategic planning, framework development, control implementation, and regulatory alignment.
    """

    story.append(Paragraph(next_steps_text, styles['BodyText']))
    story.append(PageBreak())

def create_contact_page(story, styles):
    """Create the contact/closing page"""
    story.append(Spacer(1, 1.5 * inch))

    story.append(Paragraph("About This Assessment", styles['SectionHead']))
    story.append(Spacer(1, 0.2 * inch))

    about_text = """
    This AI Governance Readiness Checklist has been developed by Enterprise.AI to help financial institutions
    systematically assess their governance maturity across leading regulatory frameworks and best practices.<br/>
    <br/>
    The assessment framework integrates guidance from:<br/>
    • <b>SR 11-7:</b> Federal Reserve Guidance on Model Risk Management<br/>
    • <b>SS1/23:</b> PRA Supervisory Statement on Operational Resilience<br/>
    • <b>NIST AI RMF:</b> National Institute of Standards & Technology AI Risk Management Framework<br/>
    • <b>EU AI Act:</b> European Union Artificial Intelligence Act (Regulation (EU) 2024/1689)<br/>
    <br/>
    This document is designed for use by Chief Risk Officers, Heads of AI, Compliance leaders, and
    governance teams within financial institutions across Middle East, UK, and European markets.
    """

    story.append(Paragraph(about_text, styles['BodyText']))
    story.append(Spacer(1, 0.4 * inch))

    story.append(Paragraph("Contact Enterprise.AI", styles['SectionHead']))
    story.append(Spacer(1, 0.2 * inch))

    contact_data = [
        ["Email:", "rodney@theenterpriseai.co.uk"],
        ["Services:", "Strategic AI advisory, governance frameworks, regulatory alignment, capability building"],
        ["Expertise:", "Financial Services AI, Risk Management, Regulatory Compliance"],
    ]

    contact_table = Table(contact_data, colWidths=[1.5 * inch, 4.0 * inch])
    contact_table.setStyle(TableStyle([
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 11),
        ('FONT', (1, 0), (1, -1), 'Helvetica', 11),
        ('TEXTCOLOR', (0, 0), (0, -1), GOLD),
        ('ROWBACKGROUNDS', (0, 0), (-1, -1), [WHITE, LIGHT_GRAY]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))

    story.append(contact_table)
    story.append(Spacer(1, 0.4 * inch))

    story.append(Paragraph("SCALE · GOVERN · UNLOCK", styles['Subtitle']))

    footer_text = """
    <font size=9>
    This assessment is provided for informational purposes. Results should be reviewed with appropriate
    legal, compliance, and risk management teams. Enterprise.AI recommendations are not legal or regulatory
    advice and should be validated against your specific jurisdiction and regulatory requirements.
    </font>
    """

    story.append(Paragraph(footer_text, styles['SmallText']))

def create_pdf(output_path):
    """Create the complete PDF document"""

    # Create document with custom page template
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=MARGIN,
        leftMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=0.8 * inch,
        title="AI Governance Readiness Checklist",
        author="Enterprise.AI",
        subject="40-Point AI Governance Assessment Framework",
        creator="Enterprise.AI Advisory"
    )

    # Build story
    story = []
    styles = get_custom_styles()

    # Create all pages
    create_cover_page(story, styles)
    create_executive_summary(story, styles)
    create_checklist_pages(story, styles)
    create_scoring_methodology(story, styles)
    create_scorecard_template(story, styles)
    create_contact_page(story, styles)

    # Build PDF with custom canvas
    doc.build(story, canvasmaker=NumberedCanvasWithFooter)

    print(f"PDF created successfully: {output_path}")

if __name__ == "__main__":
    # Always write alongside this script, wherever the repo happens to live.
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                               "ai-governance-readiness-checklist.pdf")
    create_pdf(output_path)
    print(f"\nFile size: {os.path.getsize(output_path) / 1024:.1f} KB")
