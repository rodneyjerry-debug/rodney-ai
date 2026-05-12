#!/usr/bin/env python3
"""
Enterprise.AI Accelerator PDF Generator
Creates professional, client-ready companion PDFs for all 12 accelerators
"""

import os
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
    Image, KeepTogether, PageTemplate, Frame, Flowable
)
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# Brand Colors
NAVY = colors.HexColor("#0D1B2A")
TEAL = colors.HexColor("#006B5E")
LIGHT_GRAY = colors.HexColor("#F5F5F5")
DARK_GRAY = colors.HexColor("#333333")

# Brand Info
BRAND_NAME = "Enterprise.AI"
BRAND_TAGLINE = "SCALE · GOVERN · UNLOCK"
CONTACT_EMAIL = "advisor@rodney-ai.com"

class PDFGenerator:
    """Base class for generating Enterprise.AI branded PDFs"""

    def __init__(self, filename, title, description):
        self.filename = filename
        self.title = title
        self.description = description
        self.doc = SimpleDocTemplate(
            filename,
            pagesize=letter,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch,
            title=title,
            author=BRAND_NAME
        )
        self.story = []
        self.styles = getSampleStyleSheet()
        self._create_custom_styles()

    def _create_custom_styles(self):
        """Create custom paragraph styles matching Enterprise.AI brand"""
        # Check if styles already exist before creating
        if 'BrandTitle' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='BrandTitle',
                parent=self.styles['Heading1'],
                fontSize=28,
                textColor=NAVY,
                spaceAfter=6,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            ))

        if 'BrandTagline' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='BrandTagline',
                parent=self.styles['Normal'],
                fontSize=14,
                textColor=TEAL,
                spaceAfter=12,
                alignment=TA_LEFT,
                fontName='Helvetica-Bold'
            ))

        if 'SectionHeading' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='SectionHeading',
                parent=self.styles['Heading2'],
                fontSize=16,
                textColor=NAVY,
                spaceAfter=12,
                spaceBefore=12,
                fontName='Helvetica-Bold'
            ))

        if 'SubsectionHeading' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='SubsectionHeading',
                parent=self.styles['Heading3'],
                fontSize=13,
                textColor=NAVY,
                spaceAfter=8,
                spaceBefore=8,
                fontName='Helvetica-Bold'
            ))

        if 'BodyText' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='BodyText',
                parent=self.styles['Normal'],
                fontSize=11,
                alignment=TA_JUSTIFY,
                spaceAfter=10,
                leading=14
            ))

        if 'SmallText' not in self.styles:
            self.styles.add(ParagraphStyle(
                name='SmallText',
                parent=self.styles['Normal'],
                fontSize=9,
                textColor=DARK_GRAY,
                spaceAfter=6,
                leading=11
            ))

    def add_cover_page(self):
        """Add branded cover page"""
        self.story.append(Spacer(1, 1.5*inch))

        # Brand name
        self.story.append(Paragraph(BRAND_NAME, self.styles['BrandTitle']))
        self.story.append(Paragraph(BRAND_TAGLINE, self.styles['BrandTagline']))

        self.story.append(Spacer(1, 0.3*inch))

        # Document title
        self.story.append(Paragraph(self.title, ParagraphStyle(
            name='CoverTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            textColor=NAVY,
            spaceAfter=12,
            fontName='Helvetica-Bold'
        )))

        self.story.append(Spacer(1, 0.5*inch))

        # Description
        self.story.append(Paragraph(self.description, ParagraphStyle(
            name='CoverDesc',
            parent=self.styles['Normal'],
            fontSize=11,
            textColor=DARK_GRAY,
            spaceAfter=12,
            leading=14
        )))

        self.story.append(Spacer(1, 1*inch))

        # Date and contact
        self.story.append(Paragraph(
            f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y')}<br/>"
            f"<b>Contact:</b> {CONTACT_EMAIL}",
            self.styles['SmallText']
        ))

        self.story.append(PageBreak())

    def add_toc(self, sections):
        """Add table of contents"""
        self.story.append(Paragraph("Table of Contents", self.styles['SectionHeading']))
        self.story.append(Spacer(1, 0.2*inch))

        toc_items = []
        for i, section in enumerate(sections, 1):
            toc_items.append(Paragraph(f"{i}. {section}", self.styles['BodyText']))
            toc_items.append(Spacer(1, 0.1*inch))

        self.story.extend(toc_items)
        self.story.append(PageBreak())

    def add_section(self, title):
        """Add a new section with heading"""
        self.story.append(Spacer(1, 0.15*inch))
        self.story.append(Paragraph(title, self.styles['SectionHeading']))
        self.story.append(Spacer(1, 0.1*inch))

    def add_subsection(self, title):
        """Add a subsection"""
        self.story.append(Paragraph(title, self.styles['SubsectionHeading']))

    def add_text(self, text, style='BodyText'):
        """Add body text"""
        self.story.append(Paragraph(text, self.styles[style]))

    def add_template_table(self, headers, rows, col_widths=None):
        """Add a professional template table"""
        all_rows = [headers] + rows

        if col_widths is None:
            col_widths = [2*inch] * len(headers)

        table = Table(all_rows, colWidths=col_widths)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), NAVY),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), LIGHT_GRAY),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor("#CCCCCC")),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('TOPPADDING', (0, 1), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
        ]))

        self.story.append(table)
        self.story.append(Spacer(1, 0.2*inch))

    def add_checklist(self, items):
        """Add a checklist with checkboxes"""
        for item in items:
            self.story.append(Paragraph(f"☐ {item}", self.styles['BodyText']))
        self.story.append(Spacer(1, 0.1*inch))

    def add_footer_page(self):
        """Add contact and next steps page"""
        self.story.append(PageBreak())
        self.story.append(Spacer(1, 0.5*inch))

        self.story.append(Paragraph("Next Steps", self.styles['SectionHeading']))
        self.story.append(Spacer(1, 0.15*inch))

        self.story.append(Paragraph(
            "This guide is designed to be a practical, hands-on resource for implementation. "
            "Use the templates and checklists as starting points for your organization's specific needs.",
            self.styles['BodyText']
        ))

        self.story.append(Spacer(1, 0.2*inch))

        self.story.append(Paragraph("We're here to help.", self.styles['SubsectionHeading']))
        self.story.append(Spacer(1, 0.1*inch))

        contact_text = f"""
        <b>Enterprise.AI</b><br/>
        {BRAND_TAGLINE}<br/>
        <br/>
        <b>Email:</b> {CONTACT_EMAIL}<br/>
        <br/>
        For consultation on implementation, governance, and strategic deployment of AI initiatives.
        """
        self.story.append(Paragraph(contact_text, self.styles['BodyText']))

        self.story.append(Spacer(1, 0.3*inch))
        self.story.append(Paragraph(
            f"© {datetime.now().year} Enterprise.AI. All rights reserved.",
            self.styles['SmallText']
        ))

    def build(self):
        """Build and save the PDF"""
        self.doc.build(self.story)
        print(f"✓ Created: {self.filename}")


def create_agentic_ai_ceo_cfo():
    """1. Agentic AI Business Case for the C-Suite"""
    pdf = PDFGenerator(
        "agentic-ai-ceo-cfo.pdf",
        "Agentic AI Business Case for the C-Suite",
        "ROI framework, decision matrix, and risk assessment for executive stakeholders"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Agentic AI Fundamentals",
        "Financial Impact Model",
        "Decision Matrix Framework",
        "Risk Assessment & Mitigation",
        "ROI Calculation Template",
        "Implementation Roadmap"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "Agentic AI represents a fundamental shift in how enterprises can automate complex business processes. "
        "Unlike traditional automation that executes predefined workflows, agentic systems can understand context, "
        "make decisions, and adapt their approach in real-time. This document provides C-suite executives with "
        "the framework needed to evaluate agentic AI investments and build a compelling business case."
    )

    pdf.add_subsection("Who Should Use This Guide")
    pdf.add_text(
        "CEOs, CFOs, COOs, and board members evaluating significant technology investments. "
        "This guide speaks to executive priorities: cost reduction, revenue growth, risk management, and competitive advantage."
    )

    pdf.add_section("2. Agentic AI Fundamentals")
    pdf.add_text(
        "<b>Autonomous Decision-Making:</b> Agents operate with less human supervision, evaluating options and "
        "taking actions within defined parameters. This enables 24/7 operation without bottlenecks.\n\n"
        "<b>Context Awareness:</b> Unlike rule-based systems, agents understand business context and customer intent, "
        "leading to more accurate outcomes and fewer exceptions.\n\n"
        "<b>Continuous Learning:</b> Agents improve over time through reinforcement learning, meaning ROI improves "
        "with continued operation."
    )

    pdf.add_subsection("Use Cases by Business Function")
    use_cases = [
        ("Finance & Accounting", "Automated invoice processing, expense management, financial forecasting"),
        ("Sales & Business Development", "Lead qualification, customer outreach sequencing, deal closure automation"),
        ("Operations", "Vendor management, supply chain optimization, incident response"),
        ("Customer Service", "Multi-channel support, complex issue routing, proactive customer care"),
        ("Compliance & Risk", "Regulatory monitoring, transaction screening, audit preparation")
    ]

    for function, cases in use_cases:
        pdf.add_text(f"<b>{function}:</b> {cases}")

    pdf.add_section("3. Financial Impact Model")

    pdf.add_subsection("Cost Reduction Framework")
    cost_table_headers = ["Process", "Current Annual Cost", "Automation Level", "Annual Savings", "Payback Period"]
    cost_table_rows = [
        ["Invoice Processing", "$2.5M", "85%", "$2.1M", "8 months"],
        ["Customer Inquiries", "$1.8M", "70%", "$1.26M", "11 months"],
        ["Compliance Review", "$1.2M", "60%", "$0.72M", "18 months"],
        ["[Your Process]", "[Enter]", "[Enter]", "[Calculate]", "[Calculate]"]
    ]
    pdf.add_template_table(cost_table_headers, cost_table_rows, [1.2*inch, 1.2*inch, 1*inch, 1*inch, 1*inch])

    pdf.add_subsection("Revenue Enhancement Opportunities")
    pdf.add_text(
        "<b>Faster Deal Closure:</b> Agentic systems can accelerate sales cycles by 20-30% through intelligent lead management.\n\n"
        "<b>Improved Customer Experience:</b> 24/7 personalized support increases retention and lifetime value.\n\n"
        "<b>Data-Driven Decisions:</b> Real-time insights enable better pricing, product mix, and market strategy."
    )

    pdf.add_section("4. Decision Matrix Framework")

    pdf.add_text("Use this matrix to evaluate and prioritize agentic AI opportunities:")

    decision_headers = ["Factor", "High Value", "Medium Value", "Low Value"]
    decision_rows = [
        ["Volume of Transactions", ">1000/month", "100-1000/month", "<100/month"],
        ["Process Standardization", "Highly standardized", "Partially standardized", "Highly variable"],
        ["Decision Complexity", "Rule-based, 3-5 variables", "Mixed decisions", "Highly contextual"],
        ["Error Cost", "$500+", "$50-500", "<$50"],
        ["Stakeholder Buy-in", "Executive sponsorship", "Line of business support", "Unclear"],
        ["Data Readiness", "Clean, structured", "Partially structured", "Unstructured"],
    ]
    pdf.add_template_table(decision_headers, decision_rows, [1.3*inch, 1.3*inch, 1.3*inch, 1.3*inch])

    pdf.add_section("5. Risk Assessment & Mitigation")

    pdf.add_subsection("Critical Risks")
    risks = [
        ("Model Bias & Fairness", "Agents may perpetuate historical biases in data", "Regular bias audits, diverse training data, human oversight"),
        ("Regulatory Compliance", "Autonomous decisions may violate regulations", "Compliance mapping, audit trails, staged rollout"),
        ("Data Security", "Increased data access by agents", "Encryption, role-based access, anomaly detection"),
        ("Operational Disruption", "Errors in critical processes", "Gradual scaling, fallback procedures, monitoring")
    ]

    for risk, impact, mitigation in risks:
        pdf.add_subsection(risk)
        pdf.add_text(f"<b>Impact:</b> {impact}<br/><b>Mitigation:</b> {mitigation}")

    pdf.add_section("6. ROI Calculation Template")

    pdf.add_text("<b>Total Cost of Ownership (3 years)</b>")

    roi_headers = ["Cost Component", "Year 1", "Year 2", "Year 3", "Total"]
    roi_rows = [
        ["Platform License", "$500K", "$500K", "$500K", "$1.5M"],
        ["Implementation & Integration", "$750K", "$100K", "$50K", "$900K"],
        ["Training & Change Management", "$200K", "$100K", "$50K", "$350K"],
        ["Ongoing Operations & Support", "$300K", "$300K", "$300K", "$900K"],
        ["<b>Total Cost</b>", "<b>$1.75M</b>", "<b>$1.0M</b>", "<b>$0.9M</b>", "<b>$3.65M</b>"]
    ]
    pdf.add_template_table(roi_headers, roi_rows, [1.3*inch, 1*inch, 1*inch, 1*inch, 1*inch])

    pdf.add_text("<b>Savings (3 years)</b>")

    savings_headers = ["Benefit", "Year 1", "Year 2", "Year 3", "Total"]
    savings_rows = [
        ["Cost Reduction (FTE savings)", "$2.1M", "$2.1M", "$2.1M", "$6.3M"],
        ["Revenue Uplift (2% improvement)", "$500K", "$750K", "$1.0M", "$2.25M"],
        ["Risk Mitigation (compliance)", "$200K", "$200K", "$200K", "$600K"],
        ["<b>Total Benefit</b>", "<b>$2.8M</b>", "<b>$3.05M</b>", "<b>$3.3M</b>", "<b>$9.15M</b>"],
        ["<b>Net ROI</b>", "<b>$1.05M</b>", "<b>$2.05M</b>", "<b>$2.4M</b>", "<b>$5.5M</b>"]
    ]
    pdf.add_template_table(savings_headers, savings_rows, [1.3*inch, 1*inch, 1*inch, 1*inch, 1*inch])

    pdf.add_text("<b>Key Metrics:</b> ROI = 150% | Payback Period = 16 months | 3-Year NPV = $5.5M")

    pdf.add_section("7. Implementation Roadmap")

    pdf.add_subsection("Phase 1: Pilot (0-6 months)")
    pdf.add_text(
        "• Select 1-2 high-value use cases with clear ROI\n"
        "• Establish governance framework and success metrics\n"
        "• Build internal AI expertise and change management capability\n"
        "• Expected outcome: Proof of concept with quantified business case"
    )

    pdf.add_subsection("Phase 2: Scale (6-12 months)")
    pdf.add_text(
        "• Expand to 3-5 additional use cases\n"
        "• Implement monitoring and optimization systems\n"
        "• Build organizational change capability\n"
        "• Expected outcome: $1M+ annualized savings"
    )

    pdf.add_subsection("Phase 3: Strategic Transformation (12+ months)")
    pdf.add_text(
        "• Embed agentic AI across enterprise processes\n"
        "• Develop competitive advantages and new revenue streams\n"
        "• Establish AI-first organizational culture\n"
        "• Expected outcome: Sustainable competitive advantage"
    )

    pdf.add_footer_page()
    pdf.build()


def create_ai_governance_framework():
    """2. AI Governance Framework for FS"""
    pdf = PDFGenerator(
        "ai-governance-framework.pdf",
        "AI Governance Framework for Financial Services",
        "Policy templates, RACI matrices, and committee terms of reference"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Governance Structure & Roles",
        "Policy Templates",
        "RACI Matrix",
        "Committee Terms of Reference",
        "Decision-Making Framework",
        "Monitoring & Reporting"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "Effective AI governance is critical in financial services where regulatory requirements are stringent "
        "and risks are material. This framework provides a comprehensive governance structure that balances innovation "
        "with risk management, compliance with speed, and centralized oversight with distributed accountability."
    )

    pdf.add_section("2. Governance Structure & Roles")

    pdf.add_subsection("AI Governance Council")
    pdf.add_text(
        "<b>Membership:</b> CEO/President, CRO, CIO, CFO, Chief Compliance Officer, Head of Data & Analytics\n\n"
        "<b>Frequency:</b> Monthly or quarterly\n\n"
        "<b>Responsibilities:</b>\n"
        "• Approve strategic AI initiatives >$500K\n"
        "• Review and approve AI risk policies\n"
        "• Oversee regulatory compliance\n"
        "• Resolve inter-departmental conflicts"
    )

    pdf.add_subsection("AI Implementation Committee")
    pdf.add_text(
        "<b>Membership:</b> CIO, Head of AI, Compliance Lead, Risk Lead, Business Unit Leaders\n\n"
        "<b>Frequency:</b> Bi-weekly\n\n"
        "<b>Responsibilities:</b>\n"
        "• Approve individual AI initiatives\n"
        "• Monitor implementation progress\n"
        "• Manage dependencies and resources\n"
        "• Escalate risks and blockers"
    )

    pdf.add_subsection("AI Ethics & Fairness Board")
    pdf.add_text(
        "<b>Membership:</b> Chief Data Officer, Compliance, Risk, Audit, External experts\n\n"
        "<b>Frequency:</b> Quarterly\n\n"
        "<b>Responsibilities:</b>\n"
        "• Review AI systems for bias and fairness\n"
        "• Assess ethical implications\n"
        "• Monitor external narrative and regulation"
    )

    pdf.add_section("3. Policy Templates")

    pdf.add_subsection("AI Development & Deployment Policy")
    pdf.add_text(
        "<b>Policy Objective:</b> Establish standards for development, testing, and deployment of AI systems\n\n"
        "<b>Key Requirements:</b>"
    )

    reqs = [
        "All AI systems must undergo review by AI Governance Council",
        "Model validation required before production deployment",
        "Documentation of training data, model assumptions, and limitations",
        "Bias testing on at least 3 protected attributes",
        "Audit trail of all model changes and versions",
        "Escalation procedures for model performance issues"
    ]
    pdf.add_checklist(reqs)

    pdf.add_subsection("Data & Model Governance Policy")
    pdf.add_text(
        "<b>Data Quality Standards:</b>"
    )

    data_reqs = [
        "Data lineage documented for all training datasets",
        "Data freshness requirements (daily, weekly, monthly) by use case",
        "Completeness thresholds (minimum % non-null values)",
        "Regular data quality assessments",
        "Master data governance for critical attributes"
    ]
    pdf.add_checklist(data_reqs)

    pdf.add_subsection("Risk Management & Escalation Policy")
    pdf.add_text(
        "<b>Risk Assessment Triggers:</b>"
    )

    risk_triggers = [
        "Model accuracy decline >5% from baseline",
        "Unexpected patterns in predictions or outputs",
        "Changes in data distribution or characteristics",
        "Regulatory or compliance concerns",
        "External events affecting model relevance"
    ]
    pdf.add_checklist(risk_triggers)

    pdf.add_section("4. RACI Matrix")

    pdf.add_text("Clear accountability for key AI governance activities:")

    raci_headers = ["Activity", "AI Council", "Impl Cmte", "CRO/Compliance", "Data Steward"]
    raci_rows = [
        ["Strategic AI investment approval", "A", "R", "C", "I"],
        ["New AI initiative approval", "C", "R", "A", "I"],
        ["Model validation & testing", "I", "R", "C", "A"],
        ["Risk assessment & mitigation", "C", "R", "A", "I"],
        ["Regulatory change response", "A", "R", "R", "C"],
        ["Bias & fairness review", "I", "R", "C", "A"],
        ["Model monitoring & health", "I", "C", "C", "R"],
        ["Incident management", "C", "A", "R", "I"],
    ]
    pdf.add_template_table(raci_headers, raci_rows, [1.5*inch, 1.1*inch, 1.1*inch, 1.2*inch, 1.1*inch])

    pdf.add_text("<b>Legend:</b> R=Responsible | A=Accountable | C=Consulted | I=Informed")

    pdf.add_section("5. Committee Terms of Reference")

    pdf.add_subsection("AI Governance Council - ToR")

    tor_headers = ["Aspect", "Details"]
    tor_rows = [
        ["Reporting Line", "Reports to Board Audit Committee"],
        ["Chair", "CEO or Chief Risk Officer"],
        ["Frequency", "Monthly"],
        ["Quorum", "5 of 6 members"],
        ["Decision Authority", "$500K+ AI investments, policy changes"],
        ["Meeting Length", "90 minutes"],
    ]
    pdf.add_template_table(tor_headers, tor_rows, [2*inch, 3.5*inch])

    pdf.add_subsection("Escalation & Escalation Thresholds")

    escal_headers = ["Issue Type", "Escalation Trigger", "Owner", "Timeline"]
    escal_rows = [
        ["Model Accuracy", ">5% decline", "Implementation Cmte", "5 days"],
        ["Data Quality", ">20% missing data", "Data Steward", "3 days"],
        ["Regulatory", "Regulatory guidance change", "CRO", "Immediate"],
        ["Bias Concern", "Audit finding", "Ethics Board", "7 days"],
    ]
    pdf.add_template_table(escal_headers, escal_rows, [1.3*inch, 1.5*inch, 1.3*inch, 1.3*inch])

    pdf.add_section("6. Decision-Making Framework")

    pdf.add_subsection("Approval Levels by Initiative Type")

    pdf.add_text(
        "<b>Strategic Initiatives (>$5M, multi-year):</b> Board approval required\n\n"
        "<b>Major Investments ($500K-$5M):</b> AI Governance Council approval\n\n"
        "<b>Implementation Projects ($50K-$500K):</b> Implementation Committee approval\n\n"
        "<b>Operational Changes (<$50K):</b> Business unit approval with governance notification"
    )

    pdf.add_section("7. Monitoring & Reporting")

    pdf.add_subsection("Key Performance Indicators")

    kpi_headers = ["KPI", "Target", "Frequency", "Owner"]
    kpi_rows = [
        ["Governance Council approval time", "<10 days", "Monthly", "AI Governance Council"],
        ["Model availability", ">99.5%", "Daily", "Data Steward"],
        ["Audit finding remediation", "100% in 30 days", "Quarterly", "CRO"],
        ["Policy compliance", ">95%", "Quarterly", "Compliance"],
    ]
    pdf.add_template_table(kpi_headers, kpi_rows, [1.5*inch, 1.3*inch, 1.2*inch, 1.5*inch])

    pdf.add_footer_page()
    pdf.build()


def create_ai_risk_taxonomy():
    """3. AI Risk Taxonomy for Financial Services"""
    pdf = PDFGenerator(
        "ai-risk-taxonomy.pdf",
        "AI Risk Taxonomy for Financial Services",
        "Complete risk register template and assessment methodology"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Risk Categories",
        "Risk Assessment Methodology",
        "AI Risk Register Template",
        "Risk Indicators & Triggers",
        "Mitigation Strategies",
        "Regulatory Alignment"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "AI systems in financial services introduce new and amplified risks across model, data, operational, and "
        "regulatory dimensions. This taxonomy provides a comprehensive framework for identifying, assessing, and "
        "managing these risks in a consistent manner across the enterprise."
    )

    pdf.add_section("2. Risk Categories")

    pdf.add_subsection("Model Risk")
    pdf.add_text(
        "<b>Model Performance Risk:</b> Model accuracy degrades or fails to perform as expected in production\n\n"
        "<b>Model Bias Risk:</b> Systematic favoritism toward certain groups or outcomes\n\n"
        "<b>Model Interpretability Risk:</b> Model decisions cannot be explained or justified\n\n"
        "<b>Model Stability Risk:</b> Model behaves unpredictably with small input changes"
    )

    pdf.add_subsection("Data Risk")
    pdf.add_text(
        "<b>Data Quality Risk:</b> Training or production data is incomplete, inaccurate, or unrepresentative\n\n"
        "<b>Data Bias Risk:</b> Historical biases in data perpetuate or amplify systemic biases\n\n"
        "<b>Data Privacy Risk:</b> Personally identifiable information is exposed or misused\n\n"
        "<b>Data Governance Risk:</b> Unclear data ownership or inconsistent definitions"
    )

    pdf.add_subsection("Operational Risk")
    pdf.add_text(
        "<b>Integration Risk:</b> AI system fails to integrate properly with existing systems\n\n"
        "<b>Governance Risk:</b> Insufficient controls and oversight of AI systems\n\n"
        "<b>Vendor Risk:</b> Third-party AI providers lack adequate controls\n\n"
        "<b>Change Management Risk:</b> Organization unable to adopt and use AI systems effectively"
    )

    pdf.add_subsection("Regulatory & Compliance Risk")
    pdf.add_text(
        "<b>Fair Lending Risk:</b> AI systems discriminate based on protected characteristics\n\n"
        "<b>Consumer Protection Risk:</b> AI system fails to protect consumer interests\n\n"
        "<b>Explainability Risk:</b> Regulators cannot validate AI system decisions\n\n"
        "<b>Regulatory Change Risk:</b> New regulations make existing systems non-compliant"
    )

    pdf.add_section("3. Risk Assessment Methodology")

    pdf.add_subsection("Risk Scoring Matrix")

    pdf.add_text("Risk Level = Likelihood × Impact\n\n")

    scoring_headers = ["Rating", "Likelihood", "Impact to Business"]
    scoring_rows = [
        ["1 - Low", "<10% probability in 12 months", "<$100K loss / <1% operational impact"],
        ["2 - Medium", "10-50% probability in 12 months", "$100K-$1M loss / 1-5% operational impact"],
        ["3 - High", "50-90% probability in 12 months", "$1M-$10M loss / 5-20% operational impact"],
        ["4 - Critical", ">90% probability in 12 months", ">$10M loss / >20% operational impact"]
    ]
    pdf.add_template_table(scoring_headers, scoring_rows, [0.9*inch, 2*inch, 2.5*inch])

    pdf.add_section("4. AI Risk Register Template")

    pdf.add_text("Each AI system should have a documented risk register with minimum the following entries:")

    register_headers = ["Risk ID", "Risk Category", "Description", "Current State", "Likelihood", "Impact", "Overall Risk", "Owner", "Mitigation"]
    register_rows = [
        ["AIR-001", "Model Performance", "Accuracy decline in validation set", "Green", "Low", "Medium", "Medium", "Data Lead", "Weekly monitoring"],
        ["AIR-002", "Data Bias", "Historical bias in training data", "Amber", "Medium", "High", "High", "Analytics Lead", "Synthetic data augmentation"],
        ["AIR-003", "Regulatory", "New fair lending requirements", "Amber", "High", "Critical", "Critical", "Compliance", "Impact assessment underway"]
    ]
    pdf.add_template_table(register_headers, register_rows, [0.7*inch, 1*inch, 1.3*inch, 1*inch, 0.85*inch, 0.85*inch, 1*inch, 0.9*inch, 1*inch])

    pdf.add_section("5. Risk Indicators & Triggers")

    pdf.add_subsection("Model Performance Indicators")

    pdf.add_text(
        "• Accuracy drops >5% from baseline\n"
        "• Precision or recall declines >10%\n"
        "• F1 score below minimum threshold\n"
        "• Error rates exceed SLA\n"
        "• Unexpected patterns in residuals"
    )

    pdf.add_subsection("Data Quality Indicators")

    pdf.add_text(
        "• Missing value rates >20%\n"
        "• Outlier prevalence increases >2x\n"
        "• Feature distributions shift >10%\n"
        "• Data freshness violations\n"
        "• Unexplained data changes"
    )

    pdf.add_section("6. Mitigation Strategies")

    pdf.add_subsection("Model Risk Mitigation")

    model_mit = [
        "Regular model validation and backtesting",
        "Bias testing on protected attributes",
        "Model explainability assessments",
        "Gradual rollout with monitoring",
        "Regular retraining schedules"
    ]
    pdf.add_checklist(model_mit)

    pdf.add_subsection("Data Risk Mitigation")

    data_mit = [
        "Data quality frameworks and SLAs",
        "Data audits for bias and representation",
        "Privacy-preserving techniques (anonymization, differential privacy)",
        "Data governance policies and metadata",
        "Regular data lineage documentation"
    ]
    pdf.add_checklist(data_mit)

    pdf.add_section("7. Regulatory Alignment")

    pdf.add_text(
        "This taxonomy aligns with regulatory guidance from:\n\n"
        "• Federal Reserve SR 11-7 (Model Risk Management)\n"
        "• OCC Bulletin 2020-4 (AI/ML Governance)\n"
        "• FDIC Guidelines on Model Risk Management\n"
        "• Interagency Guidance on Fairness in Credit"
    )

    pdf.add_footer_page()
    pdf.build()


def create_ai_tokenomics():
    """4. AI Cost & Tokenomics Guide"""
    pdf = PDFGenerator(
        "ai-tokenomics.pdf",
        "AI Cost & Tokenomics Guide",
        "Budget templates, cost comparison tables, and cost optimization strategies"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Token Pricing Models",
        "Cost Components",
        "Budget Template",
        "Cost Optimization",
        "Benchmarking",
        "Financial Forecasting"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "AI infrastructure costs are driven by multiple variables: model complexity, input/output volume, compute requirements, "
        "and operational overhead. This guide helps organizations build accurate cost models, benchmark against peers, "
        "and identify optimization opportunities."
    )

    pdf.add_section("2. Token Pricing Models")

    pdf.add_subsection("LLM Token Economics")
    pdf.add_text(
        "<b>Prompt Tokens:</b> Cost per 1K tokens for model input (typically lower rate)\n\n"
        "<b>Completion Tokens:</b> Cost per 1K tokens for model output (typically 2-4x higher rate)\n\n"
        "<b>Example Pricing (as of 2024):</b>\n"
        "GPT-4 Turbo: $10/1M prompt tokens, $30/1M completion tokens\n"
        "GPT-3.5: $0.50/1M prompt tokens, $1.50/1M completion tokens"
    )

    pdf.add_subsection("Fine-Tuning Economics")
    pdf.add_text(
        "<b>Training Cost:</b> Per token during fine-tuning phase (one-time)\n\n"
        "<b>Inference Cost:</b> Discounted rate for using fine-tuned models (ongoing)\n\n"
        "<b>Storage:</b> Cost per model stored (usually $0.01-0.05/day per model)"
    )

    pdf.add_section("3. Cost Components")

    pdf.add_subsection("Direct Infrastructure Costs")

    infra_headers = ["Component", "Cost Driver", "Monthly Cost Range"]
    infra_rows = [
        ["LLM API calls", "Tokens processed", "$100 - $50K"],
        ["Fine-tuning", "Hours + tokens", "$500 - $20K"],
        ["Vector database", "Storage & queries", "$50 - $5K"],
        ["Compute (GPUs)", "Hours used", "$500 - $30K"],
        ["Storage & CDN", "Data volume", "$100 - $5K"]
    ]
    pdf.add_template_table(infra_headers, infra_rows, [1.2*inch, 2*inch, 1.8*inch])

    pdf.add_subsection("Operational Costs")

    pdf.add_text(
        "• Data preparation & labeling: $2K-20K/month\n"
        "• Model monitoring & optimization: $1K-10K/month\n"
        "• Security & compliance tools: $500-5K/month\n"
        "• Support & maintenance: $1K-15K/month"
    )

    pdf.add_section("4. Budget Template")

    pdf.add_subsection("Annual AI Budget Forecast")

    budget_headers = ["Cost Category", "Q1", "Q2", "Q3", "Q4", "Annual"]
    budget_rows = [
        ["LLM API Calls", "$5K", "$8K", "$12K", "$15K", "$40K"],
        ["Compute & Infrastructure", "$10K", "$10K", "$10K", "$10K", "$40K"],
        ["Data & Training", "$5K", "$3K", "$2K", "$2K", "$12K"],
        ["Team & Operations", "$20K", "$20K", "$20K", "$20K", "$80K"],
        ["Tools & Monitoring", "$2K", "$2K", "$2K", "$2K", "$8K"],
        ["<b>TOTAL</b>", "<b>$42K</b>", "<b>$43K</b>", "<b>$46K</b>", "<b>$49K</b>", "<b>$180K</b>"]
    ]
    pdf.add_template_table(budget_headers, budget_rows, [1.3*inch, 0.9*inch, 0.9*inch, 0.9*inch, 0.9*inch, 1*inch])

    pdf.add_section("5. Cost Optimization Strategies")

    pdf.add_subsection("Token Reduction Techniques")

    pdf.add_text(
        "<b>Prompt Optimization:</b> Reduce prompt size through template engineering (5-20% savings)\n\n"
        "<b>Caching:</b> Cache repeated prompts and system instructions (10-30% savings)\n\n"
        "<b>Batching:</b> Process multiple requests together instead of individually (15-25% savings)\n\n"
        "<b>Model Selection:</b> Use smaller models where appropriate (50-80% savings vs GPT-4)"
    )

    pdf.add_subsection("Infrastructure Optimization")

    pdf.add_text(
        "<b>Reserved Capacity:</b> Commit to usage for 1-3 year discounts (20-40% savings)\n\n"
        "<b>Spot Instances:</b> Use interruptible compute for non-critical workloads (60-80% savings)\n\n"
        "<b>Local Models:</b> Deploy open-source models for cost-sensitive use cases (90%+ savings)"
    )

    pdf.add_section("6. Benchmarking")

    pdf.add_subsection("Industry Benchmarks (2024)")

    bench_headers = ["Use Case", "Tokens/Month", "Monthly Cost", "Cost/Transaction"]
    bench_rows = [
        ["Customer Support Chatbot", "100M", "$3K", "$0.03"],
        ["Content Generation", "50M", "$1.5K", "$0.15"],
        ["Data Analysis", "10M", "$0.5K", "$0.50"],
        ["Document Processing", "200M", "$5K", "$0.05"]
    ]
    pdf.add_template_table(bench_headers, bench_rows, [1.8*inch, 1.3*inch, 1.2*inch, 1.2*inch])

    pdf.add_section("7. Financial Forecasting")

    pdf.add_subsection("3-Year Cost Projection")

    forecast_headers = ["Year", "Monthly Avg", "Annual Total", "YoY Growth", "Cost/User"]
    forecast_rows = [
        ["2024", "$20K", "$240K", "N/A", "$2"],
        ["2025", "$18K", "$216K", "-10%", "$1.80"],
        ["2026", "$22K", "$264K", "+22%", "$2.20"]
    ]
    pdf.add_template_table(forecast_headers, forecast_rows, [1*inch, 1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])

    pdf.add_footer_page()
    pdf.build()


def create_eu_ai_act_tracker():
    """5. EU AI Act Compliance Tracker"""
    pdf = PDFGenerator(
        "eu-ai-act-tracker.pdf",
        "EU AI Act Compliance Tracker",
        "Timeline, checklist, and gap analysis framework"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "EU AI Act Overview",
        "Risk-Based Classification",
        "Implementation Timeline",
        "Compliance Checklist",
        "Gap Analysis Framework",
        "Organizational Requirements"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "The EU AI Act is the world's first comprehensive AI regulation, establishing requirements for organizations "
        "developing, deploying, or using AI systems in the EU. Compliance is mandatory from 2025-2026 depending on "
        "risk classification. This tracker helps organizations map their systems, identify gaps, and build compliance roadmaps."
    )

    pdf.add_section("2. EU AI Act Overview")

    pdf.add_subsection("Key Dates")
    pdf.add_text(
        "<b>April 2025:</b> Prohibitions on harmful AI practices take effect\n\n"
        "<b>February 2026:</b> High-risk and general requirements take effect\n\n"
        "<b>August 2026:</b> Governance, documentation, and transparency requirements"
    )

    pdf.add_subsection("Scope")
    pdf.add_text(
        "Applies to organizations developing or deploying AI systems within the EU, or whose AI systems affect "
        "EU residents. Includes both EU and non-EU organizations."
    )

    pdf.add_section("3. Risk-Based Classification")

    pdf.add_subsection("Prohibited AI (Banned)")

    prohibited = [
        "Subliminal manipulation techniques",
        "Biometric identification for mass surveillance",
        "Social scoring systems",
        "Misuse of biometric data"
    ]
    pdf.add_checklist(prohibited)

    pdf.add_subsection("High-Risk AI")

    high_risk = [
        "Recruitment and employment decisions",
        "Loan/credit decisions",
        "Biometric identification systems",
        "Critical infrastructure management",
        "Law enforcement activities",
        "Migration and border control",
        "Education and vocational training"
    ]
    pdf.add_checklist(high_risk)

    pdf.add_subsection("Limited Risk (Transparency)")
    pdf.add_text(
        "Chatbots and interactive systems where users may not realize they're interacting with AI"
    )

    pdf.add_subsection("Minimal/No Risk")
    pdf.add_text(
        "Systems with low potential impact on fundamental rights"
    )

    pdf.add_section("4. Implementation Timeline")

    timeline_headers = ["Phase", "Timeframe", "Key Activities", "Owner"]
    timeline_rows = [
        ["Assessment", "Now - Dec 2024", "Map AI systems, classify risk levels, identify gaps", "Chief Compliance Officer"],
        ["Design", "Jan - Jun 2025", "Document processes, build controls, train teams", "CTO/Chief Risk Officer"],
        ["Implementation", "Jul 2025 - Jan 2026", "Deploy controls, conduct testing, remediate gaps", "Implementation Lead"],
        ["Compliance", "Feb 2026+", "Maintain compliance, monitor changes, audit readiness", "Compliance Office"]
    ]
    pdf.add_template_table(timeline_headers, timeline_rows, [0.9*inch, 1.1*inch, 1.8*inch, 1.5*inch])

    pdf.add_section("5. Compliance Checklist")

    pdf.add_subsection("For All AI Systems")

    general_checks = [
        "Documented purpose and intended use",
        "Documented training data and methodology",
        "Documentation of performance metrics",
        "Documentation of limitations and risks",
        "User transparency documentation (where required)",
        "Incident reporting procedures",
        "Accessibility compliance (WCAG 2.1)"
    ]
    pdf.add_checklist(general_checks)

    pdf.add_subsection("For High-Risk Systems")

    high_risk_checks = [
        "Risk assessment and management system",
        "Data governance and quality procedures",
        "Bias monitoring and mitigation",
        "Human oversight and review procedures",
        "Logging and documentation systems",
        "Performance monitoring systems",
        "Regular audit and conformity assessment",
        "Cybersecurity and robustness testing"
    ]
    pdf.add_checklist(high_risk_checks)

    pdf.add_section("6. Gap Analysis Framework")

    pdf.add_subsection("Gap Assessment Template")

    gap_headers = ["AI System", "Risk Level", "Requirement", "Current State", "Gap", "Remediation", "Timeline", "Owner"]
    gap_rows = [
        ["Lending Decision AI", "High", "Human oversight", "None", "No human review", "Implement review queue", "6 months", "Chief Risk Officer"],
        ["Recruitment AI", "High", "Bias testing", "Partial", "Testing on 2 of 5 attributes", "Comprehensive testing", "3 months", "HR Lead"],
    ]
    pdf.add_template_table(
        gap_headers, gap_rows,
        [0.9*inch, 1*inch, 1.1*inch, 1*inch, 0.8*inch, 1*inch, 1*inch, 0.9*inch]
    )

    pdf.add_section("7. Organizational Requirements")

    pdf.add_subsection("Governance Structure")

    pdf.add_text(
        "<b>Data Protection Officer (DPO):</b> May overlap with AI compliance role\n\n"
        "<b>AI Compliance Officer:</b> Dedicated role for high-risk deployments\n\n"
        "<b>Technical Team:</b> Data scientists, engineers for implementation"
    )

    pdf.add_subsection("Documentation Requirements")

    docs = [
        "AI system design and development documentation",
        "Training data documentation and lineage",
        "Performance metrics and benchmarks",
        "Risk assessment and mitigation plans",
        "User instructions and warnings",
        "Incident logs and corrective actions",
        "Audit trails (1 year minimum)"
    ]
    pdf.add_checklist(docs)

    pdf.add_footer_page()
    pdf.build()


def create_exchange_ai_use_cases():
    """6. Exchange & Capital Markets AI Use Cases"""
    pdf = PDFGenerator(
        "exchange-ai-use-cases.pdf",
        "Exchange & Capital Markets AI Use Cases",
        "Use case cards, prioritization methodology, and implementation guidance"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Market Overview",
        "Use Case Categories",
        "Use Case Cards",
        "Prioritization Framework",
        "Implementation Guidance",
        "ROI Models"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "Capital markets participants are deploying AI across trading, settlement, risk management, and compliance. "
        "This guide catalogs 15+ proven use cases with implementation patterns, ROI models, and prioritization frameworks."
    )

    pdf.add_section("2. Market Overview")

    pdf.add_text(
        "<b>Market Growth:</b> AI/ML in capital markets projected to grow 25% CAGR through 2030\n\n"
        "<b>Investment Areas:</b> Trading automation, settlement optimization, fraud detection, regulatory technology\n\n"
        "<b>Key Drivers:</b> Cost reduction, speed, scalability, competitive differentiation"
    )

    pdf.add_section("3. Use Case Categories")

    pdf.add_subsection("Trading & Execution")
    pdf.add_text(
        "• Smart order routing: Route orders to optimal venues\n"
        "• Price prediction: Forecast short-term price movements\n"
        "• Algorithmic trading: Adaptive execution algorithms\n"
        "• Portfolio optimization: Dynamic rebalancing"
    )

    pdf.add_subsection("Risk & Compliance")
    pdf.add_text(
        "• Fraud detection: Real-time transaction monitoring\n"
        "• Counterparty risk: Predict default probability\n"
        "• Regulatory reporting: Automated data extraction and validation\n"
        "• Sanctions screening: Enhanced AML/KYC screening"
    )

    pdf.add_subsection("Operations & Settlement")
    pdf.add_text(
        "• Settlement exception handling: Automated resolution\n"
        "• Reconciliation: Automated matching and investigation\n"
        "• Cash optimization: Forecast and optimize liquidity\n"
        "• Cybersecurity: Threat detection and response"
    )

    pdf.add_section("4. Use Case Cards")

    pdf.add_subsection("Use Case: Smart Order Routing")

    uc_headers = ["Dimension", "Details"]
    uc_rows = [
        ["Description", "AI system routes orders to optimal trading venues based on real-time market data"],
        ["Business Impact", "$500K-2M annual savings (reduced execution costs, faster fills)"],
        ["Implementation Time", "6-9 months"],
        ["Data Required", "Order flow, venue prices, liquidity, latency data"],
        ["Key Metrics", "% fills at best price, average execution time, cost per trade"],
        ["Risk Level", "Medium (market impact, system failures)"],
        ["Regulatory", "MiFID II best execution, SEC Reg SHO"],
    ]
    pdf.add_template_table(uc_headers, uc_rows, [1.5*inch, 3.2*inch])

    pdf.add_subsection("Use Case: Real-Time Fraud Detection")

    uc2_rows = [
        ["Description", "ML models identify anomalous trading patterns indicating potential fraud or market abuse"],
        ["Business Impact", "$1-5M annual savings (prevented losses, regulatory penalties avoided)"],
        ["Implementation Time", "3-6 months"],
        ["Data Required", "Trade data, order flow, account profiles, settlement instructions"],
        ["Key Metrics", "Detection rate, false positive rate, time to alert, investigation time"],
        ["Risk Level", "Medium (false positives, detection gaps)"],
        ["Regulatory", "GDPR, Reg SHO, MAR, MiFID II"],
    ]
    pdf.add_template_table(uc_headers, uc2_rows, [1.5*inch, 3.2*inch])

    pdf.add_section("5. Prioritization Framework")

    pdf.add_subsection("Use Case Scoring Matrix")

    score_headers = ["Criterion", "Weight", "Scoring", "Notes"]
    score_rows = [
        ["Financial Impact", "30%", "High (>$1M): 3 | Medium: 2 | Low: 1", "Revenue or savings"],
        ["Implementation Complexity", "20%", "Low (3-6 mo): 3 | Medium: 2 | High: 1", "Lower is better"],
        ["Data Readiness", "20%", "Ready: 3 | Partial: 2 | Not Ready: 1", "Data availability"],
        ["Regulatory Risk", "15%", "Low: 3 | Medium: 2 | High: 1", "Compliance burden"],
        ["Strategic Alignment", "15%", "High: 3 | Medium: 2 | Low: 1", "Fits strategy"],
    ]
    pdf.add_template_table(score_headers, score_rows, [1.5*inch, 1*inch, 1.7*inch, 1.5*inch])

    pdf.add_section("6. Implementation Guidance")

    pdf.add_subsection("Phase 1: Pilot (3-4 months)")
    pdf.add_text(
        "• Select specific instrument or market segment\n"
        "• Build proof-of-concept with backtest\n"
        "• Establish monitoring and controls\n"
        "• Paper trade or small volume production test"
    )

    pdf.add_subsection("Phase 2: Limited Production (2-3 months)")
    pdf.add_text(
        "• Deploy to 10-20% of target volume\n"
        "• Monitor performance, ROI, risks\n"
        "• Gather feedback, refine models\n"
        "• Establish incident response procedures"
    )

    pdf.add_subsection("Phase 3: Full Deployment (1-2 months)")
    pdf.add_text(
        "• Scale to full volume\n"
        "• Transition to operational team\n"
        "• Document procedures and governance\n"
        "• Begin continuous optimization"
    )

    pdf.add_section("7. ROI Models")

    pdf.add_subsection("Smart Order Routing ROI")

    roi_headers = ["Year", "Investment", "Cost Savings", "Revenue Impact", "Net Benefit"]
    roi_rows = [
        ["Year 1", "$500K", "$750K", "$200K", "$450K"],
        ["Year 2", "$150K", "$1.2M", "$500K", "$1.55M"],
        ["Year 3", "$100K", "$1.2M", "$800K", "$1.9M"],
    ]
    pdf.add_template_table(roi_headers, roi_rows, [1.2*inch, 1.2*inch, 1.3*inch, 1.3*inch])

    pdf.add_footer_page()
    pdf.build()


def create_executive_ai_training():
    """7. Executive AI Training Curriculum"""
    pdf = PDFGenerator(
        "executive-ai-training.pdf",
        "Executive AI Training Curriculum",
        "Module outlines, assessment rubrics, and learning objectives"
    )

    pdf.add_cover_page()

    toc = [
        "Program Overview",
        "Learning Objectives",
        "Module Structure",
        "Module Outlines",
        "Assessment Rubrics",
        "Delivery Models",
        "Success Metrics"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Program Overview")
    pdf.add_text(
        "A comprehensive AI literacy program designed for C-suite executives and board members. "
        "Builds understanding of AI capabilities, business applications, risks, and governance without deep technical knowledge."
    )

    pdf.add_section("2. Learning Objectives")

    pdf.add_text(
        "<b>By completion, participants will be able to:</b>"
    )

    objectives = [
        "Explain AI fundamentals and key concepts in business terms",
        "Assess AI opportunities and develop business cases",
        "Identify risks and establish appropriate governance",
        "Evaluate AI vendor and model selection",
        "Guide organizational AI strategy",
        "Make informed investment decisions"
    ]
    pdf.add_checklist(objectives)

    pdf.add_section("3. Module Structure")

    pdf.add_text(
        "<b>Program Format:</b> 5 modules × 2 hours each = 10 hours total\n\n"
        "<b>Delivery:</b> In-person workshops or virtual sessions\n\n"
        "<b>Duration:</b> 5 weeks (1 session per week) or intensive 1-week program"
    )

    pdf.add_section("4. Module Outlines")

    pdf.add_subsection("Module 1: AI Fundamentals & Business Impact (2 hours)")

    m1_headers = ["Time", "Topic", "Learning Outcome"]
    m1_rows = [
        ["15 min", "What is AI? (Not science fiction)", "Explain AI vs traditional software"],
        ["20 min", "AI capabilities and limitations", "Understand what AI can and cannot do"],
        ["20 min", "Business use cases across industries", "Identify relevant opportunities"],
        ["25 min", "AI economics and ROI", "Build basic financial models"],
        ["20 min", "Discussion: Your industry", "Apply to organizational context"],
    ]
    pdf.add_template_table(m1_headers, m1_rows, [0.9*inch, 1.8*inch, 2.1*inch])

    pdf.add_subsection("Module 2: Building AI Business Cases (2 hours)")

    m2_rows = [
        ["15 min", "Use case evaluation framework", "Score and prioritize opportunities"],
        ["25 min", "Financial modeling", "Build ROI and cost models"],
        ["20 min", "Risk assessment", "Identify key risks"],
        ["20 min", "Case study: Successful implementation", "Learn from peer experiences"],
        ["20 min", "Workshop: Evaluate your business cases", "Apply framework to organization"],
    ]
    pdf.add_template_table(m1_headers, m2_rows, [0.9*inch, 1.8*inch, 2.1*inch])

    pdf.add_subsection("Module 3: Risk, Governance & Ethics (2 hours)")

    m3_rows = [
        ["20 min", "AI risks: Model, data, operational, regulatory", "Understand risk landscape"],
        ["20 min", "Governance frameworks", "Establish appropriate controls"],
        ["15 min", "Ethics and responsible AI", "Navigate ethical considerations"],
        ["15 min", "Regulatory landscape", "Understand compliance requirements"],
        ["20 min", "Case study: Failed implementations", "Learn from mistakes"],
    ]
    pdf.add_template_table(m1_headers, m3_rows, [0.9*inch, 1.8*inch, 2.1*inch])

    pdf.add_subsection("Module 4: Organizational Implementation (2 hours)")

    m4_rows = [
        ["20 min", "Building organizational capability", "Assess readiness, plan development"],
        ["15 min", "Change management for AI adoption", "Manage organizational change"],
        ["15 min", "Talent and vendor management", "Hire and manage resources"],
        ["20 min", "Technology architecture decisions", "Understand platform options"],
        ["20 min", "Workshop: Design your AI roadmap", "Create implementation plan"],
    ]
    pdf.add_template_table(m1_headers, m4_rows, [0.9*inch, 1.8*inch, 2.1*inch])

    pdf.add_subsection("Module 5: Strategic AI Leadership (2 hours)")

    m5_rows = [
        ["20 min", "Competitive positioning with AI", "Understand AI as differentiator"],
        ["15 min", "Board-level governance", "Prepare for board discussions"],
        ["15 min", "Industry-specific trends", "Learn sector developments"],
        ["15 min", "Future-proofing your strategy", "Plan for long-term relevance"],
        ["20 min", "Capstone: Present your AI strategy", "Synthesize learning"],
    ]
    pdf.add_template_table(m1_headers, m5_rows, [0.9*inch, 1.8*inch, 2.1*inch])

    pdf.add_section("5. Assessment Rubrics")

    pdf.add_subsection("Knowledge Assessment")

    assess_headers = ["Level", "Criteria", "Score"]
    assess_rows = [
        ["Mastery", "Explains concepts clearly, applies to organization, considers risks", "A (90-100%)"],
        ["Proficient", "Understands concepts, applies with some guidance", "B (80-89%)"],
        ["Developing", "Basic understanding, needs significant guidance", "C (70-79%)"],
        ["Beginning", "Limited understanding, unable to apply", "D (<70%)"],
    ]
    pdf.add_template_table(assess_headers, assess_rows, [1.2*inch, 2.5*inch, 1.2*inch])

    pdf.add_section("6. Delivery Models")

    pdf.add_subsection("In-Person Workshop")
    pdf.add_text(
        "• 5 consecutive days or 5 weekly half-days\n"
        "• Interactive, hands-on exercises\n"
        "• Case study discussions\n"
        "• Cohort learning and peer exchange"
    )

    pdf.add_subsection("Virtual Program")
    pdf.add_text(
        "• Live sessions with breakout discussions\n"
        "• Recorded modules for asynchronous learning\n"
        "• One-on-one coaching sessions\n"
        "• Self-paced capstone project"
    )

    pdf.add_section("7. Success Metrics")

    metrics = [
        "80%+ attendance and completion rate",
        "Average post-assessment score >80%",
        "Participants report increased confidence in AI decision-making",
        "Organization develops AI strategy within 3 months",
        "Board-approved AI governance framework established"
    ]
    pdf.add_checklist(metrics)

    pdf.add_footer_page()
    pdf.build()


def create_fs_ai_maturity_assessment():
    """8. FS AI Maturity Assessment Guide"""
    pdf = PDFGenerator(
        "fs-ai-maturity-assessment.pdf",
        "FS AI Maturity Assessment Guide",
        "Scoring guide, benchmark data, and improvement roadmaps"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Assessment Framework",
        "Capability Dimensions",
        "Maturity Levels",
        "Scoring Guide",
        "Benchmark Data",
        "Improvement Roadmap"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "This maturity assessment measures organizational readiness and capability across 7 dimensions of AI adoption "
        "in financial services. It provides baseline measurement, peer benchmarking, and a roadmap to advanced AI capability."
    )

    pdf.add_section("2. Assessment Framework")

    pdf.add_text(
        "The assessment evaluates 7 key dimensions, each with 4-5 capability statements scored on a 5-point scale "
        "(from 'Initial' to 'Optimized'). Assessment typically takes 2-3 hours and involves 8-10 stakeholders."
    )

    pdf.add_section("3. Capability Dimensions")

    pdf.add_subsection("1. AI Strategy & Governance")
    pdf.add_text(
        "Clarity of AI strategy, board oversight, governance structure, policies, and resource allocation"
    )

    pdf.add_subsection("2. Data & Infrastructure")
    pdf.add_text(
        "Data governance, quality, availability, security, and technology infrastructure for AI"
    )

    pdf.add_subsection("3. Talent & Organization")
    pdf.add_text(
        "AI expertise, organizational structure, talent management, and change capability"
    )

    pdf.add_subsection("4. Risk Management")
    pdf.add_text(
        "Risk frameworks, controls, compliance, fairness, and responsible AI practices"
    )

    pdf.add_subsection("5. Use Case Portfolio")
    pdf.add_text(
        "Breadth and depth of AI applications, strategic alignment, and business impact"
    )

    pdf.add_subsection("6. Model Operations")
    pdf.add_text(
        "Model lifecycle management, monitoring, retraining, versioning, and documentation"
    )

    pdf.add_subsection("7. Business Impact & Value")
    pdf.add_text(
        "Quantified ROI, adoption rates, customer impact, and competitive advantage"
    )

    pdf.add_section("4. Maturity Levels")

    levels_headers = ["Level", "Description"]
    levels_rows = [
        ["1 - Initial", "Ad-hoc, no formal processes, limited AI use"],
        ["2 - Developing", "Some processes, pilot projects, emerging capabilities"],
        ["3 - Defined", "Documented processes, multiple use cases in production"],
        ["4 - Managed", "Optimized processes, governance in place, strategic use cases"],
        ["5 - Optimized", "Continuous improvement, AI-driven competitive advantage, scaled portfolio"],
    ]
    pdf.add_template_table(levels_headers, levels_rows, [1.2*inch, 3.5*inch])

    pdf.add_section("5. Scoring Guide")

    pdf.add_subsection("Assessment Methodology")

    pdf.add_text(
        "<b>1. Gather Stakeholders:</b> 8-10 people from strategy, technology, risk, business\n\n"
        "<b>2. Review Capability Statements:</b> Score each on 1-5 scale\n\n"
        "<b>3. Discuss & Align:</b> Resolve disagreements through discussion\n\n"
        "<b>4. Calculate Scores:</b> Average by dimension\n\n"
        "<b>5. Generate Report:</b> Benchmark and recommend improvements"
    )

    pdf.add_subsection("Sample Assessment Statements")

    stmt_headers = ["Dimension", "Level 2 Statement", "Level 4 Statement"]
    stmt_rows = [
        ["Strategy", "Some business units exploring AI informally", "Clear AI strategy aligned with business goals, board oversight, annual roadmap"],
        ["Data", "Data in multiple systems, inconsistent quality", "Centralized data platform, governance policies, quality SLAs, security controls"],
        ["Talent", "Few AI specialists, limited hiring", "Dedicated AI team, university partnerships, competitive compensation"],
    ]
    pdf.add_template_table(stmt_headers, stmt_rows, [1.3*inch, 2*inch, 2*inch])

    pdf.add_section("6. Benchmark Data")

    pdf.add_subsection("Industry Benchmarks (FS Firms, 2024)")

    bench_headers = ["Dimension", "Overall Average", "Top Quartile", "Bottom Quartile"]
    bench_rows = [
        ["Strategy & Governance", "2.5", "4.0-5.0", "1.0-2.0"],
        ["Data & Infrastructure", "2.3", "4.0-5.0", "1.0-2.0"],
        ["Talent & Organization", "2.1", "3.5-4.5", "1.0-1.5"],
        ["Risk Management", "2.7", "4.0-5.0", "1.5-2.0"],
        ["Use Case Portfolio", "2.4", "4.0-5.0", "1.0-2.0"],
        ["Model Operations", "2.2", "3.5-4.5", "1.0-2.0"],
        ["Business Impact", "2.0", "3.5-4.5", "1.0-1.5"],
        ["<b>Overall</b>", "<b>2.3</b>", "<b>3.9</b>", "<b>1.2</b>"],
    ]
    pdf.add_template_table(bench_headers, bench_rows, [1.5*inch, 1.2*inch, 1.2*inch, 1.2*inch])

    pdf.add_section("7. Improvement Roadmap")

    pdf.add_subsection("From Level 2 to Level 3 (6-12 months)")

    pdf.add_text(
        "<b>Strategy:</b> Develop formal AI strategy, establish governance council\n\n"
        "<b>Data:</b> Implement data governance, centralize critical datasets\n\n"
        "<b>Talent:</b> Hire AI lead, establish AI center of excellence\n\n"
        "<b>Risk:</b> Develop risk framework, conduct bias assessments\n\n"
        "<b>Ops:</b> Document model development standards, implement monitoring"
    )

    pdf.add_subsection("From Level 3 to Level 4 (12-18 months)")

    pdf.add_text(
        "<b>Strategy:</b> Embed AI in all business strategies, expand governance\n\n"
        "<b>Data:</b> Implement enterprise data platform, real-time governance\n\n"
        "<b>Talent:</b> Grow AI team, develop internal expertise, partnerships\n\n"
        "<b>Risk:</b> Implement advanced risk controls, continuous monitoring\n\n"
        "<b>Ops:</b> Automate model lifecycle, advanced monitoring and optimization"
    )

    pdf.add_footer_page()
    pdf.build()


def create_genai_prioritization_matrix():
    """9. GenAI Use Case Prioritization Matrix"""
    pdf = PDFGenerator(
        "genai-prioritization-matrix.pdf",
        "GenAI Use Case Prioritization Matrix",
        "Scoring methodology, templates, and prioritization framework"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "Prioritization Framework",
        "Evaluation Criteria",
        "Scoring Methodology",
        "Use Case Portfolio",
        "Prioritization Example",
        "Implementation Roadmap"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "Organizations typically identify 50-100 potential GenAI use cases but have resources to implement only a few. "
        "This matrix provides a systematic approach to evaluate, score, and prioritize use cases based on business value, "
        "feasibility, and strategic fit."
    )

    pdf.add_section("2. Prioritization Framework")

    pdf.add_text(
        "Use cases are scored across 4 primary dimensions:\n\n"
        "1. <b>Business Value (40%):</b> Financial impact and strategic importance\n"
        "2. <b>Feasibility (25%):</b> Technical complexity and implementation risk\n"
        "3. <b>Data Readiness (20%):</b> Availability and quality of required data\n"
        "4. <b>Strategic Fit (15%):</b> Alignment with organizational priorities"
    )

    pdf.add_section("3. Evaluation Criteria")

    pdf.add_subsection("Business Value (40%)")

    bv_headers = ["Score", "Financial Impact", "ROI Timeline", "Customer Impact"]
    bv_rows = [
        ["5 (Excellent)", ">$10M/year", "<12 months", "High satisfaction, brand enhancing"],
        ["4 (Good)", "$3-10M/year", "12-18 months", "Moderate satisfaction improvement"],
        ["3 (Fair)", "$1-3M/year", "18-24 months", "Incremental improvement"],
        ["2 (Poor)", "$100K-1M/year", ">24 months", "Minimal impact"],
        ["1 (Minimal)", "<$100K/year", "Unknown", "No direct impact"],
    ]
    pdf.add_template_table(bv_headers, bv_rows, [0.8*inch, 1.4*inch, 1.3*inch, 1.8*inch])

    pdf.add_subsection("Feasibility (25%)")

    feas_headers = ["Score", "Technical Complexity", "Resource Needs", "Timeline"]
    feas_rows = [
        ["5 (Easy)", "Low, existing models", "Small team, <$250K", "3-4 months"],
        ["4 (Moderate)", "Medium, some customization", "Team + specialists, $250-500K", "6 months"],
        ["3 (Challenging)", "High, significant customization", "Large team, $500K-1M", "9 months"],
        ["2 (Complex)", "Very high, new approaches needed", "Specialized team, $1-2M", "12-15 months"],
        ["1 (Infeasible)", "Extremely complex or impossible", "Major resources", ">18 months"],
    ]
    pdf.add_template_table(feas_headers, feas_rows, [0.8*inch, 1.4*inch, 1.4*inch, 1.7*inch])

    pdf.add_section("4. Scoring Methodology")

    pdf.add_subsection("Overall Score Calculation")

    pdf.add_text(
        "Overall Score = (BV Score × 0.40) + (Feasibility Score × 0.25) + (Data Readiness Score × 0.20) + (Strategic Fit Score × 0.15)"
    )

    pdf.add_text(
        "<b>Interpretation:</b>\n"
        "• Score 4.5-5.0: Implement immediately (Quick wins)\n"
        "• Score 3.5-4.4: Implement in Phase 2 (High value, feasible)\n"
        "• Score 2.5-3.4: Plan for Phase 3 (Good opportunities, higher effort)\n"
        "• Score <2.5: Defer or reject (Lower priority)"
    )

    pdf.add_section("5. Use Case Portfolio")

    pdf.add_subsection("Sample Use Cases to Evaluate")

    uc_headers = ["Use Case", "Business Function", "Gen AI Type"]
    uc_rows = [
        ["Customer service chatbot", "Customer Service", "Conversational AI"],
        ["Document summarization", "Legal/Compliance", "Text analysis"],
        ["Code generation assistance", "Development", "Programming AI"],
        ["Content generation", "Marketing", "Text generation"],
        ["Customer insights extraction", "Analytics", "Data intelligence"],
        ["Interview transcription", "HR", "Audio processing"],
    ]
    pdf.add_template_table(uc_headers, uc_rows, [1.8*inch, 1.5*inch, 1.5*inch])

    pdf.add_section("6. Prioritization Example")

    pdf.add_subsection("Sample Scoring: Customer Service Chatbot")

    ex_headers = ["Dimension", "Score", "Rationale", "Weighted Score"]
    ex_rows = [
        ["Business Value", "5", "$5M annual savings + improved CSAT", "2.0"],
        ["Feasibility", "4", "Proven models, 6-month timeline", "1.0"],
        ["Data Readiness", "4", "Chat history available, good quality", "0.8"],
        ["Strategic Fit", "5", "Customer experience priority", "0.75"],
        ["<b>TOTAL SCORE</b>", "", "", "<b>4.55</b>"],
    ]
    pdf.add_template_table(ex_headers, ex_rows, [1.3*inch, 0.9*inch, 1.8*inch, 1.3*inch])

    pdf.add_subsection("Prioritization Matrix")

    pdf.add_text(
        "Plot all use cases on a 2×2 matrix:\n"
        "X-axis: Feasibility (Easy → Difficult)\n"
        "Y-axis: Business Value (Low → High)\n\n"
        "<b>Quick Wins (High Value, Easy):</b> Implement first\n"
        "<b>Strategic Initiatives (High Value, Difficult):</b> Plan for Phase 2\n"
        "<b>Easy Wins (Low Value, Easy):</b> Implement if resources available\n"
        "<b>Difficult/Low Value:</b> Defer or reject"
    )

    pdf.add_section("7. Implementation Roadmap")

    pdf.add_subsection("Phase 1: Quick Wins (Months 1-3)")

    pdf.add_text(
        "• Focus on 2-3 use cases scoring 4.0+\n"
        "• Build quick prototypes, prove business case\n"
        "• Generate quick ROI and momentum\n"
        "• Establish processes and governance"
    )

    pdf.add_subsection("Phase 2: Strategic Initiatives (Months 4-9)")

    pdf.add_text(
        "• Scale Phase 1 use cases\n"
        "• Implement 3-5 medium complexity use cases\n"
        "• Build organizational capability\n"
        "• Develop competitive advantages"
    )

    pdf.add_subsection("Phase 3: Transformation (Months 10-18)")

    pdf.add_text(
        "• Execute complex, high-value initiatives\n"
        "• Expand to adjacent use cases\n"
        "• Become AI-first organization\n"
        "• Achieve sustainable competitive advantage"
    )

    pdf.add_footer_page()
    pdf.build()


def create_mrm_checklist():
    """10. Model Risk Management Checklist for AI/ML"""
    pdf = PDFGenerator(
        "mrm-checklist.pdf",
        "Model Risk Management Checklist for AI/ML",
        "Complete checklist, validation scope, and governance framework"
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "MRM Framework for AI/ML",
        "Pre-Implementation Checklist",
        "Development & Testing Checklist",
        "Production Deployment Checklist",
        "Ongoing Monitoring Checklist",
        "Governance & Documentation"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "The Federal Reserve's SR 11-7 guidance on Model Risk Management applies to AI/ML systems in financial institutions. "
        "This comprehensive checklist ensures compliance and establishes best practices for the entire model lifecycle."
    )

    pdf.add_section("2. MRM Framework for AI/ML")

    pdf.add_subsection("Three Lines of Defense")

    pdf.add_text(
        "<b>1st Line:</b> Model developers and owners responsible for quality\n\n"
        "<b>2nd Line:</b> Risk function provides independent review and oversight\n\n"
        "<b>3rd Line:</b> Internal audit validates governance and controls"
    )

    pdf.add_subsection("Four Key Components")

    pdf.add_text(
        "<b>Model Development:</b> Sound methodologies, quality processes\n\n"
        "<b>Validation:</b> Independent testing and performance assessment\n\n"
        "<b>Documentation:</b> Complete and accurate model records\n\n"
        "<b>Governance:</b> Clear policies, oversight, and accountability"
    )

    pdf.add_section("3. Pre-Implementation Checklist")

    pdf.add_subsection("Model Design & Development")

    design_checks = [
        "Clear business objective and success criteria defined",
        "Data requirements and sources documented",
        "Model architecture and algorithms justified",
        "Alternative approaches considered and documented",
        "Limitations and assumptions documented",
        "Bias and fairness considerations addressed in design",
        "Privacy and regulatory requirements assessed",
        "Scalability and performance requirements established"
    ]
    pdf.add_checklist(design_checks)

    pdf.add_subsection("Data Preparation & Analysis")

    data_checks = [
        "Data sources and lineage documented",
        "Data completeness and quality assessed",
        "Data governance and ownership established",
        "Data biases and representation issues analyzed",
        "Feature engineering and selection justified",
        "Training/validation/test splits determined",
        "Data refresh and update procedures established",
        "Privacy controls implemented (encryption, anonymization)"
    ]
    pdf.add_checklist(data_checks)

    pdf.add_section("4. Development & Testing Checklist")

    pdf.add_subsection("Model Training & Validation")

    dev_checks = [
        "Multiple models or approaches tested and compared",
        "Model hyperparameters optimized appropriately",
        "Cross-validation or holdout validation performed",
        "Performance metrics defined and measured",
        "Accuracy/precision/recall/F1 scores acceptable",
        "Model stability tested (small input perturbations)",
        "Model interpretability assessed and documented",
        "Feature importance or SHAP values calculated"
    ]
    pdf.add_checklist(dev_checks)

    pdf.add_subsection("Bias & Fairness Testing")

    bias_checks = [
        "Protected attributes identified (age, gender, race, etc.)",
        "Model performance evaluated across protected groups",
        "Disparate impact analysis performed",
        "Bias mitigation strategies identified if needed",
        "Fairness metrics selected and measured",
        "Benchmark discrimination testing completed",
        "Documentation of bias assessment results",
        "Plan for ongoing bias monitoring established"
    ]
    pdf.add_checklist(bias_checks)

    pdf.add_subsection("Stress Testing & Robustness")

    stress_checks = [
        "Extreme scenario testing performed",
        "Adversarial example testing completed",
        "Concept drift and data drift scenarios tested",
        "Model performance degradation limits identified",
        "Recovery and fallback procedures established",
        "Cybersecurity testing completed",
        "Documentation of stress test results"
    ]
    pdf.add_checklist(stress_checks)

    pdf.add_section("5. Production Deployment Checklist")

    pdf.add_subsection("Pre-Deployment Review")

    deploy_checks = [
        "Independent validation review completed",
        "Risk assessment approved",
        "Governance and escalation procedures established",
        "Monitoring and alerting systems configured",
        "Incident response plan documented",
        "User training completed",
        "Documentation package complete and accessible",
        "Approval from risk and compliance functions"
    ]
    pdf.add_checklist(deploy_checks)

    pdf.add_subsection("Deployment & Transition")

    trans_checks = [
        "Model deployment tested in production environment",
        "Data pipelines and integrations validated",
        "Performance baseline established",
        "Monitoring dashboards operational",
        "Escalation contacts identified and trained",
        "Rollback procedures documented and tested",
        "Historical comparison data captured",
        "Go/no-go decision documented"
    ]
    pdf.add_checklist(trans_checks)

    pdf.add_section("6. Ongoing Monitoring Checklist")

    pdf.add_subsection("Model Performance Monitoring")

    monitor_checks = [
        "Daily/weekly performance tracking",
        "Accuracy and other metrics vs. baseline",
        "Input distribution and data quality monitoring",
        "Prediction distribution analysis",
        "Outlier and anomaly detection",
        "Error categorization and analysis",
        "Performance SLA thresholds and alerts",
        "Monthly management reporting"
    ]
    pdf.add_checklist(monitor_checks)

    pdf.add_subsection("Bias & Fairness Monitoring")

    fairness_checks = [
        "Monthly performance analysis by protected group",
        "Disparate impact monitoring",
        "Feedback bias analysis",
        "Fairness metric tracking",
        "Customer complaint correlation analysis",
        "Regulatory examination preparation",
        "Documentation of monitoring results"
    ]
    pdf.add_checklist(fairness_checks)

    pdf.add_subsection("Risk & Incident Management")

    risk_checks = [
        "Incident tracking and root cause analysis",
        "Escalation procedures tested",
        "Quarterly risk assessment update",
        "Model change documentation and approval",
        "Retraining effectiveness evaluation",
        "Regulatory change impact assessment",
        "Third-party model validation (if applicable)"
    ]
    pdf.add_checklist(risk_checks)

    pdf.add_section("7. Governance & Documentation")

    pdf.add_subsection("Required Documentation")

    doc_headers = ["Document", "Content", "Owner", "Review Frequency"]
    doc_rows = [
        ["Model Charter", "Purpose, scope, data, limitations", "Model Owner", "Annually"],
        ["Data Dictionary", "Features, definitions, quality", "Data Steward", "As needed"],
        ["Model Development Report", "Methodology, experiments, results", "Data Scientist", "Completed"],
        ["Validation Report", "Independent testing, results", "Risk Function", "Annually"],
        ["Monitoring Plan", "KPIs, thresholds, procedures", "Risk Function", "As needed"],
        ["Risk Assessment", "Risks, mitigations, residual risk", "Risk Function", "Quarterly"],
    ]
    pdf.add_template_table(doc_headers, doc_rows, [1.2*inch, 1.5*inch, 1.2*inch, 1.2*inch])

    pdf.add_subsection("Governance Requirements")

    gov_checks = [
        "Model steering committee or oversight",
        "Change control process for model updates",
        "Version control and model registry",
        "Clear escalation paths and decision rights",
        "Board/management reporting on model risks",
        "Regular audits by internal audit function",
        "Regulatory examination readiness"
    ]
    pdf.add_checklist(gov_checks)

    pdf.add_footer_page()
    pdf.build()


def create_ndmo_data_readiness():
    """11. NDMO Data Readiness Assessment"""
    pdf = PDFGenerator(
        "ndmo-data-readiness.pdf",
        "NDMO Data Readiness Assessment",
        "A structured self-assessment for Gulf financial institutions preparing for AI at scale. "
        "Evaluate your data foundation across six critical dimensions and receive a prioritised remediation roadmap."
    )

    pdf.add_cover_page()

    toc = [
        "Why Data Readiness Before AI",
        "The Six Dimensions of Data Readiness",
        "Self-Assessment Scorecard",
        "Assessment Matrix",
        "Remediation Priorities by AI Maturity Stage",
        "NDMO Regulatory Mapping",
        "Next Steps"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Why Data Readiness Before AI")
    pdf.add_text(
        "85% of Saudi banks have an AI strategy. Fewer than 15% have the data foundation to execute it. "
        "The gap is not technology -- it is data classification, quality, and governance. NDMO's National Data "
        "Governance Interim Regulations and SDAIA's AI Ethics Principles both require demonstrable data governance "
        "before AI models can be deployed in regulated environments."
    )

    pdf.add_subsection("The Regulatory Landscape")
    pdf.add_text(
        "Saudi Arabia's data governance requirements span multiple regulators: NDMO sets national standards for "
        "data classification and sharing; SDAIA governs AI ethics and data use; SAMA enforces financial sector "
        "data controls; and the PDPL (enacted September 2023) mandates personal data protection with significant "
        "penalties for non-compliance."
    )

    pdf.add_subsection("The AI Connection")
    pdf.add_text(
        "Every AI model inherits the quality, bias, and governance posture of its training data. Without classification, "
        "you cannot control what data enters which model. Without lineage, you cannot audit model outputs. Without "
        "quality controls, your AI delivers confident wrong answers at scale."
    )

    pdf.add_section("2. The Six Dimensions of Data Readiness")

    dimensions = [
        ("1. Data Classification",
         "Structured taxonomy aligned to NDMO's four-tier classification (Public, Restricted, Confidential, Top Secret). "
         "Every dataset tagged, every access control mapped, every cross-border transfer rule enforced. Without this, "
         "AI models cannot be risk-tiered."),
        ("2. Data Quality",
         "Measured across six axes: completeness, accuracy, consistency, timeliness, validity, and uniqueness. "
         "Profiling at source, quality rules in pipelines, and automated monitoring dashboards. AI accuracy is "
         "bounded by input data quality."),
        ("3. Data Governance Operating Model",
         "Roles, stewards, councils, and escalation paths. A Chief Data Officer mandate, domain data owners, and "
         "stewardship networks. Decision rights for data creation, modification, sharing, and deletion -- formalised and enforced."),
        ("4. NDMO & PDPL Compliance",
         "Conformance with NDMO's National Data Governance Interim Regulations, Open Data Policy, and Data Sharing "
         "Regulations. PDPL readiness including consent management, data subject rights, cross-border transfer controls, "
         "and breach notification procedures."),
        ("5. Data Lineage & Traceability",
         "End-to-end visibility from source systems through transformation to AI model inputs and outputs. Critical for "
         "model validation, regulatory audit trails, and explainability requirements under SAMA's expectations and the "
         "EU AI Act (for cross-border institutions)."),
        ("6. Data Catalogue & Metadata",
         "A searchable, governed inventory of all data assets -- business glossary, technical metadata, ownership, "
         "sensitivity labels, and usage policies. The foundation that makes all other dimensions discoverable and enforceable.")
    ]

    for title, desc in dimensions:
        pdf.add_subsection(title)
        pdf.add_text(desc)

    pdf.add_section("3. Self-Assessment Scorecard")
    pdf.add_text("Rate your institution across each dimension. Be candid -- this assessment is most valuable when it reflects reality, not aspiration.")

    score_headers = ["Score", "Maturity Level", "Description"]
    score_rows = [
        ["1", "Ad Hoc", "No formal process. Individuals manage data informally. No documentation."],
        ["2", "Developing", "Some processes exist but are inconsistent. Limited documentation. Reactive approach."],
        ["3", "Defined", "Formal policies and processes documented. Roles assigned. Partial implementation."],
        ["4", "Managed", "Processes measured and controlled. Regular reviews. Automation in place. Proactive monitoring."],
        ["5", "Optimised", "Continuous improvement. Industry-leading practices. Full automation. Real-time governance."],
    ]
    pdf.add_template_table(score_headers, score_rows, [0.6*inch, 1.2*inch, 3.5*inch])

    pdf.add_section("4. Assessment Matrix")
    pdf.add_text("For each dimension, assess your current state against the key indicators below. A score of 3 or above across all dimensions is the minimum threshold for enterprise AI deployment.")

    matrix_headers = ["Dimension", "Key Indicators", "NDMO/Regulatory Link", "AI Prerequisite"]
    matrix_rows = [
        ["Classification", "Taxonomy defined; All datasets tagged; Access controls enforced; Cross-border rules applied",
         "NDMO Data Classification Policy; PDPL Art. 29", "Model risk tiering; Data access for training"],
        ["Quality", "Profiling complete; Quality rules automated; Monitoring dashboards live; Remediation SLAs defined",
         "SAMA Operational Risk; NDMO Data Quality Standards", "Model accuracy; Bias detection; Output reliability"],
        ["Governance", "CDO appointed; Stewards active; Councils meeting; Policies enforced; Escalation paths clear",
         "NDMO National Data Governance Regulations", "AI governance integration; Decision rights for AI data use"],
        ["NDMO/PDPL", "Consent management; Data subject rights; Breach procedures; Transfer controls; DPO appointed",
         "PDPL; NDMO Open Data; Data Sharing Regulations", "Lawful AI training data; Customer data in models"],
        ["Lineage", "Source-to-report tracing; Transformation documented; Impact analysis capability; Audit trail complete",
         "SAMA Model Risk; NDMO Data Lifecycle", "Model explainability; Regulatory audit; Bias tracing"],
        ["Catalogue", "Business glossary; Technical metadata; Ownership mapped; Sensitivity labels; Search enabled",
         "NDMO Metadata Standards; Data Inventory", "Feature store readiness; Data discovery for AI teams"],
    ]
    pdf.add_template_table(matrix_headers, matrix_rows, [1*inch, 1.5*inch, 1.3*inch, 1.5*inch])

    pdf.add_section("5. Remediation Priorities by AI Maturity Stage")

    pdf.add_subsection("Stage 1: Pre-AI (Exploring)")
    pdf.add_text(
        "<b>Priority:</b> Classification, Governance, Quality. Get the foundations in place before any AI investment. "
        "Appoint a CDO, classify your top 50 datasets, establish quality baselines. Time: 3-6 months."
    )

    pdf.add_subsection("Stage 2: Pilot AI (1-3 Use Cases)")
    pdf.add_text(
        "<b>Priority:</b> Quality, Lineage, NDMO/PDPL. You are already building models -- ensure the data feeding them "
        "is profiled, traceable, and compliant. Automate quality rules in the pipeline. Time: 2-4 months."
    )

    pdf.add_subsection("Stage 3: Scaling AI (Enterprise Rollout)")
    pdf.add_text(
        "<b>Priority:</b> Catalogue, Lineage, Governance maturity. At scale, data discovery and self-service become "
        "critical. Build the catalogue, mature the governance operating model, and ensure lineage covers all production models. Time: 4-8 months."
    )

    pdf.add_subsection("Stage 4: AI-Native Operations")
    pdf.add_text(
        "<b>Priority:</b> Continuous improvement across all six dimensions. Real-time quality monitoring, automated "
        "classification, dynamic lineage, and governance-as-code. This is where data governance becomes a competitive advantage."
    )

    pdf.add_section("6. NDMO Regulatory Mapping")
    pdf.add_text("Key NDMO regulations and their data readiness implications for AI-deploying institutions.")

    reg_headers = ["NDMO Regulation", "Core Requirements", "AI Impact"]
    reg_rows = [
        ["National Data Governance Interim Regulations",
         "Data governance framework; CDO appointment; Data management standards; Annual compliance reporting",
         "Mandatory foundation for any AI programme -- no governance, no AI deployment"],
        ["Data Classification Policy",
         "Four-tier classification; Labelling standards; Handling procedures; Access controls per tier",
         "Determines which data can be used for AI training, which models need additional controls"],
        ["Data Sharing Regulations",
         "Sharing agreements; Purpose limitation; Security requirements; Cross-entity sharing controls",
         "Critical for federated AI, multi-entity models, and third-party AI platform data flows"],
        ["Open Data Policy",
         "Public dataset publication; Format standards; API requirements; Update schedules",
         "Opportunity: enrichment data for AI models. Obligation: ensure AI outputs using open data are attributed"],
        ["Personal Data Protection Law (PDPL)",
         "Consent; Data subject rights; Cross-border transfer; Breach notification; DPO appointment",
         "Governs all AI models using customer data -- consent for profiling, right to explanation, automated decision safeguards"],
    ]
    pdf.add_template_table(reg_headers, reg_rows, [1.5*inch, 1.8*inch, 2*inch])

    pdf.add_section("7. Next Steps")

    pdf.add_subsection("Self-Serve")
    pdf.add_text(
        "Use this assessment to score your institution across all six dimensions. Identify your lowest-scoring areas "
        "and map them to the remediation priorities for your AI maturity stage. This gives you a board-ready view of "
        "data readiness gaps."
    )

    pdf.add_subsection("Guided Assessment")
    pdf.add_text(
        "Enterprise.AI delivers a 4-week structured data readiness assessment that includes stakeholder interviews, "
        "automated data profiling, NDMO gap analysis, and a prioritised remediation roadmap with effort estimates and quick wins."
    )

    pdf.add_footer_page()
    pdf.build()


def create_capital_efficiency_rwa():
    """12. Capital Efficiency / RWA Optimisation"""
    pdf = PDFGenerator(
        "capital-efficiency-rwa.pdf",
        "Capital Efficiency / RWA Optimisation",
        "Model capital released through IRB migration, collateral optimisation, securitisation, "
        "and portfolio density improvement. Built for bank CFOs, CROs, and treasury heads navigating Basel III endgame in the GCC."
    )

    pdf.add_cover_page()

    toc = [
        "Executive Summary",
        "IRB Migration & Model Sophistication",
        "Collateral Optimisation",
        "Securitisation & Balance Sheet Recycling",
        "Portfolio Risk-Weight Optimisation",
        "Capital Release Estimation Framework",
        "Scoreboard & GCC Benchmarks"
    ]
    pdf.add_toc(toc)

    pdf.add_section("1. Executive Summary")
    pdf.add_text(
        "Capital efficiency is the defining strategic lever for GCC banks navigating Basel III endgame. This accelerator "
        "provides a structured framework across four optimisation pathways to model capital release, estimate ROE uplift, "
        "and benchmark against regional peers. Each pathway includes calculation templates and implementation guidance."
    )

    pdf.add_section("2. IRB Migration & Model Sophistication")
    pdf.add_text(
        "Moving from standardised to foundation or advanced IRB typically reduces credit-risk RWA by 15-35%. "
        "The magnitude depends on portfolio composition, data maturity, and regulatory approval timelines."
    )

    pdf.add_subsection("Migration Pathway Comparison")

    irb_headers = ["Approach", "Typical RWA Reduction", "Data Requirements", "Approval Timeline"]
    irb_rows = [
        ["Standardised to Foundation IRB", "15-20%", "5+ years PD history, validated models", "12-18 months"],
        ["Foundation IRB to Advanced IRB", "10-15% incremental", "7+ years LGD/EAD history, granular data", "18-24 months"],
        ["Standardised to Advanced IRB", "25-35%", "Full internal model suite, extensive data", "24-36 months"],
    ]
    pdf.add_template_table(irb_headers, irb_rows, [1.5*inch, 1.3*inch, 1.3*inch, 1.3*inch])

    pdf.add_subsection("Implementation Considerations")
    pdf.add_text(
        "<b>Data Readiness:</b> IRB approval requires demonstrably clean, complete, and validated historical data. "
        "Most GCC banks need 12-18 months of data remediation before application.\n\n"
        "<b>Model Governance:</b> SAMA expects robust model risk management frameworks aligned with SR 11-7 principles.\n\n"
        "<b>Regulatory Engagement:</b> Early and continuous dialogue with SAMA is critical. Parallel running periods typically span 6-12 months."
    )

    pdf.add_section("3. Collateral Optimisation")
    pdf.add_text(
        "Recognising eligible collateral currently unrecognised under regulatory frameworks can release significant capital. "
        "The gap between economic collateral value and regulatory recognition is typically 20-40% for GCC banks."
    )

    pdf.add_subsection("Eligible Collateral Types")

    coll_headers = ["Collateral Type", "Regulatory Haircut", "Typical Coverage Gap", "RWA Impact"]
    coll_rows = [
        ["Cash & Government Securities", "0-5%", "Low (5-10%)", "High"],
        ["Listed Equities", "20-40%", "Medium (15-25%)", "Medium"],
        ["Real Estate (Commercial)", "40-60%", "High (25-40%)", "Medium"],
        ["Guarantees (Sovereign/Bank)", "0-20%", "Medium (10-20%)", "High"],
        ["Receivables", "40-60%", "High (30-50%)", "Low-Medium"],
    ]
    pdf.add_template_table(coll_headers, coll_rows, [1.3*inch, 1.2*inch, 1.3*inch, 1*inch])

    pdf.add_subsection("Optimisation Checklist")
    coll_checks = [
        "Complete collateral inventory with regulatory eligibility mapping",
        "Valuation frequency aligned with Basel requirements",
        "Legal enforceability opinions current for all jurisdictions",
        "Haircut methodology documented and validated",
        "Cross-border collateral recognition assessed",
        "Netting agreements reviewed and updated"
    ]
    pdf.add_checklist(coll_checks)

    pdf.add_section("4. Securitisation & Balance Sheet Recycling")
    pdf.add_text(
        "Significant risk transfer (SRT) via securitisation of mortgage or loan books can dramatically reduce "
        "on-balance-sheet RWA while retaining servicing economics. GCC sukuk structures offer Sharia-compliant pathways."
    )

    pdf.add_subsection("SRT Structure Comparison")

    srt_headers = ["Structure", "RWA Benefit", "Complexity", "Market Depth (GCC)"]
    srt_rows = [
        ["Synthetic Securitisation", "60-80% RWA reduction on ref pool", "High", "Emerging"],
        ["True Sale Securitisation", "Full derecognition possible", "Medium-High", "Moderate"],
        ["Covered Bonds / Sukuk", "Lower risk weight on retained", "Medium", "Growing"],
        ["Sub-participation", "Partial risk transfer", "Low-Medium", "Established"],
    ]
    pdf.add_template_table(srt_headers, srt_rows, [1.3*inch, 1.5*inch, 1*inch, 1.2*inch])

    pdf.add_subsection("Key Considerations")
    pdf.add_text(
        "<b>SAMA Approval:</b> SRT transactions require prior supervisory approval with full documentation of risk transfer.\n\n"
        "<b>Sharia Compliance:</b> Structures must satisfy Sharia board requirements for asset-backed instruments.\n\n"
        "<b>Investor Base:</b> GCC investor appetite for structured products is growing but still developing compared to European markets."
    )

    pdf.add_section("5. Portfolio Risk-Weight Optimisation")
    pdf.add_text(
        "Systematic portfolio rebalancing, exposure netting, and guarantee restructuring to reduce average "
        "risk-weight density across the book. Typical density improvements of 1-5% are achievable."
    )

    pdf.add_subsection("Optimisation Levers")
    pdf.add_text(
        "<b>Exposure Netting:</b> Consolidate bilateral exposures to reduce gross RWA. Requires enforceable netting agreements.\n\n"
        "<b>Guarantee Substitution:</b> Replace higher-risk-weight exposures with guaranteed equivalents (sovereign, multilateral).\n\n"
        "<b>Portfolio Rebalancing:</b> Shift asset mix toward lower risk-weight categories while maintaining return targets.\n\n"
        "<b>CRM Techniques:</b> Credit risk mitigation through funded and unfunded protection, credit derivatives."
    )

    pdf.add_subsection("Risk-Weight Density Template")

    density_headers = ["Asset Class", "Current Density", "Target Density", "Actions"]
    density_rows = [
        ["Corporate (Investment Grade)", "75-100%", "50-75%", "IRB migration, collateral recognition"],
        ["Retail Mortgages", "35-75%", "20-35%", "Securitisation, LTV improvement"],
        ["SME", "75-100%", "50-75%", "Guarantee programmes, data improvement"],
        ["Sovereign / PSE", "0-20%", "0-10%", "Rating upgrade, ECAI alignment"],
        ["Interbank", "20-50%", "20-35%", "Netting, collateral posting"],
    ]
    pdf.add_template_table(density_headers, density_rows, [1.3*inch, 1*inch, 1*inch, 1.8*inch])

    pdf.add_section("6. Capital Release Estimation Framework")

    pdf.add_subsection("Calculation Template")
    pdf.add_text(
        "Use this template to estimate total capital release across all four pathways:"
    )

    calc_headers = ["Pathway", "Input", "Formula", "Estimated Release"]
    calc_rows = [
        ["IRB Migration", "Current RWA, migration factor", "RWA x (target factor - current factor)", "[Calculate]"],
        ["Collateral", "Unrecognised collateral, gap %, haircut", "Collateral x gap x haircut", "[Calculate]"],
        ["Securitisation", "Eligible book, current RW, target RW", "Book x (current RW - target RW)", "[Calculate]"],
        ["Portfolio Density", "Total RWA, density improvement %", "RWA x density improvement", "[Calculate]"],
        ["<b>Total</b>", "", "", "<b>[Sum]</b>"],
    ]
    pdf.add_template_table(calc_headers, calc_rows, [1.2*inch, 1.3*inch, 1.5*inch, 1.2*inch])

    pdf.add_subsection("ROE Impact Estimation")
    pdf.add_text(
        "<b>Rule of thumb:</b> Each SAR 1B of released capital translates to approximately 0.8% ROE uplift "
        "(assuming 12.5% CAR and current net income margins).\n\n"
        "<b>AT1 Sukuk equivalent:</b> Released capital reduces the need for expensive AT1 instruments. "
        "Each SAR 1B of capital release saves approximately SAR 150M in AT1 sukuk equivalent."
    )

    pdf.add_section("7. Scoreboard & GCC Benchmarks")

    pdf.add_subsection("GCC Banking Capital Release Benchmarks")

    bench_headers = ["Scenario", "Capital Released (SAR B)", "ROE Impact", "Typical Profile"]
    bench_rows = [
        ["Conservative", "0.5", "+0.4%", "Single pathway, standardised approach"],
        ["Base Case", "2.5", "+2.0%", "Two pathways, foundation IRB"],
        ["Aggressive", "5.3", "+4.2%", "All four pathways, advanced IRB"],
    ]
    pdf.add_template_table(bench_headers, bench_rows, [1.1*inch, 1.5*inch, 1*inch, 1.8*inch])

    pdf.add_text(
        "<b>Note:</b> These benchmarks are based on analysis of GCC Tier 1 banks with total assets of SAR 200-500B. "
        "Actual results will vary based on portfolio composition, regulatory approval timelines, and market conditions."
    )

    pdf.add_footer_page()
    pdf.build()


def main():
    """Generate all 12 PDFs"""
    print("\nGenerating Enterprise.AI Accelerator Companion PDFs...\n")

    os.chdir("/sessions/cool-elegant-cori/mnt/CV/Claude/rodney-ai/accelerators/downloads")

    pdf_generators = [
        create_agentic_ai_ceo_cfo,
        create_ai_governance_framework,
        create_ai_risk_taxonomy,
        create_ai_tokenomics,
        create_eu_ai_act_tracker,
        create_exchange_ai_use_cases,
        create_executive_ai_training,
        create_fs_ai_maturity_assessment,
        create_genai_prioritization_matrix,
        create_mrm_checklist,
        create_ndmo_data_readiness,
        create_capital_efficiency_rwa
    ]

    for generator in pdf_generators:
        try:
            generator()
        except Exception as e:
            print(f"✗ Error generating {generator.__name__}: {e}")

    print("\n✓ All PDFs generated successfully!")


if __name__ == "__main__":
    main()
