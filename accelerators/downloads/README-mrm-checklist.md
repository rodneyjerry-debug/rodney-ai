# Model Risk Management Checklist for AI/ML

**Document ID:** mrm-checklist.pdf  
**Version:** 1.0  
**Last Updated:** April 2025

## Overview

A comprehensive checklist for implementing Model Risk Management (MRM) for AI/ML systems in financial institutions. Aligned with Federal Reserve SR 11-7 guidance and industry best practices. Covers the full model lifecycle from development through ongoing monitoring.

## What's Included

- **Pre-Implementation Checklist**: Design, data, and governance preparation
- **Development & Testing Checklist**: Model training, validation, and bias testing
- **Production Deployment Checklist**: Pre-deployment review and transition
- **Ongoing Monitoring Checklist**: Performance, bias, and risk monitoring
- **Governance & Documentation**: Required records and oversight framework
- **Implementation Roadmap**: How to operationalize MRM

## Target Audience

- Chief Risk Officer
- Model Risk Management Team
- Data Science Leaders
- Compliance Officers
- Internal Audit
- Model Owners

## How to Use This Document

1. **Before development**: Complete Pre-Implementation Checklist
2. **During development**: Track Development & Testing Checklist
3. **Before deployment**: Complete Production Deployment Checklist
4. **In production**: Execute Ongoing Monitoring Checklist monthly
5. **Annually**: Update governance and documentation
6. **On issues**: Use risk escalation procedures

## The Three Lines of Defense

**1st Line: Model Developers**
- Responsible for quality development
- Build in monitoring and safeguards
- Document assumptions and limitations
- Test thoroughly before deployment

**2nd Line: Risk Function**
- Independent review and validation
- Risk assessment and mitigation
- Performance monitoring and oversight
- Model governance enforcement

**3rd Line: Internal Audit**
- Periodic audits of model governance
- Validation of controls and documentation
- Compliance with SR 11-7 guidance
- Reporting to audit committee

## Four Key MRM Components

1. **Model Development**: Sound methodologies, quality standards
2. **Independent Validation**: Testing by neutral party before deployment
3. **Documentation**: Complete, accurate model records
4. **Governance**: Clear policies, oversight, accountability

## Pre-Implementation Checklist

### Business Objective Definition
- [ ] Clear business objective stated
- [ ] Success criteria defined and measurable
- [ ] Business case approved
- [ ] Stakeholder alignment confirmed
- [ ] Model owner assigned with clear accountability

### Data Requirements & Planning
- [ ] Data sources identified and documented
- [ ] Data quality requirements established
- [ ] Data lineage documented
- [ ] Data governance owner assigned
- [ ] Data refresh frequency defined
- [ ] Data security and privacy plan

### Model Design & Approach
- [ ] Model architecture chosen and justified
- [ ] Alternative approaches evaluated and documented
- [ ] Limitations and assumptions documented
- [ ] Regulatory requirements assessed
- [ ] Bias and fairness considerations in design
- [ ] Interpretability approach determined

### Risk Assessment
- [ ] Initial risk assessment completed
- [ ] Escalation triggers identified
- [ ] Mitigation strategies planned
- [ ] Risk appetite alignment confirmed
- [ ] Fallback procedures designed

## Development & Testing Checklist

### Data Preparation & Quality
- [ ] Data sources and lineage fully documented
- [ ] Data completeness assessed (target: >95%)
- [ ] Missing value handling documented
- [ ] Outlier detection and treatment completed
- [ ] Data quality metrics established
- [ ] Train/validation/test splits determined
- [ ] Cross-validation approach defined

### Model Development
- [ ] Multiple models or approaches tested
- [ ] Hyperparameters optimized appropriately
- [ ] Model selection rationale documented
- [ ] Feature engineering approaches justified
- [ ] Cross-validation performed
- [ ] Regularization applied to prevent overfitting
- [ ] Model coefficients/parameters documented

### Model Performance & Validation
- [ ] Performance metrics defined and calculated
- [ ] Accuracy/precision/recall/F1 assessed
- [ ] Baseline models built for comparison
- [ ] Performance acceptable vs. requirements
- [ ] Errors analyzed and categorized
- [ ] Performance on holdout test set validated
- [ ] Sensitivity analysis completed

### Interpretability & Explainability
- [ ] Model type chosen for interpretability
- [ ] Feature importance calculated
- [ ] SHAP values or similar explanations generated
- [ ] Decision rules documented
- [ ] Model transparency assessed
- [ ] Explanations validated for accuracy
- [ ] Plan for explaining to regulators

### Bias & Fairness Testing
- [ ] Protected attributes identified (race, gender, age, etc.)
- [ ] Model performance evaluated by group
- [ ] Disparate impact analysis performed
- [ ] Statistical parity tested
- [ ] Fairness metrics calculated
- [ ] Bias mitigation strategies identified if needed
- [ ] Resampling or synthetic data used if appropriate
- [ ] Post-mitigation fairness verified

### Stress Testing & Robustness
- [ ] Extreme value scenarios tested
- [ ] Adversarial examples evaluated
- [ ] Concept drift scenarios simulated
- [ ] Data distribution shifts tested
- [ ] Model stability under perturbations
- [ ] Failure modes identified
- [ ] Recovery procedures established
- [ ] Degradation limits defined

### Documentation
- [ ] Model development report completed
- [ ] Data dictionary created
- [ ] Code documentation and comments
- [ ] Testing results documented
- [ ] Assumptions and limitations listed
- [ ] Known issues and workarounds documented

## Production Deployment Checklist

### Pre-Deployment Governance
- [ ] Independent validation review completed
- [ ] Validation issues remediated or accepted
- [ ] Risk assessment approved by CRO
- [ ] Governance framework documented
- [ ] Escalation procedures established
- [ ] Monitoring plan finalized
- [ ] Incident response procedures drafted
- [ ] Approval obtained from risk/compliance

### System Integration & Testing
- [ ] Data pipelines designed and tested
- [ ] Model integration tested end-to-end
- [ ] API performance validated
- [ ] Error handling and fallback procedures
- [ ] Input validation programmed
- [ ] Output range checking implemented
- [ ] Latency and throughput requirements met
- [ ] Security testing completed (penetration testing if needed)

### Monitoring & Alerting Setup
- [ ] Performance monitoring dashboard built
- [ ] Alert thresholds set
- [ ] Escalation procedures for alerts
- [ ] Monitoring system tested
- [ ] Data freshness monitoring
- [ ] Model prediction distribution monitoring
- [ ] Input distribution monitoring
- [ ] Alert response procedures documented

### User & Stakeholder Readiness
- [ ] User training completed
- [ ] User acceptance testing passed
- [ ] Change management completed
- [ ] Documentation provided to users
- [ ] Support procedures established
- [ ] Escalation contacts identified and trained

### Historical Baseline
- [ ] Performance baseline established
- [ ] Comparison metrics captured
- [ ] Historical data preserved
- [ ] Deployment performance documented

## Ongoing Monitoring Checklist

### Daily/Weekly Monitoring
- [ ] Model availability checked (uptime)
- [ ] Input volume and distribution
- [ ] Performance metrics reviewed
- [ ] Error rates monitored
- [ ] Alert thresholds checked

### Monthly Monitoring & Reporting
- [ ] Performance report generated
- [ ] Accuracy and other metrics vs. baseline
- [ ] Error patterns analyzed
- [ ] Input distribution analysis
- [ ] Prediction distribution analysis
- [ ] Management reporting completed
- [ ] Issues and root causes documented

### Quarterly Reviews
- [ ] Comprehensive model assessment
- [ ] Risk assessment update
- [ ] Business case vs. actual ROI
- [ ] Bias and fairness monitoring
- [ ] Model retraining evaluation
- [ ] Technology/framework updates
- [ ] Regulatory change impact assessment
- [ ] Steering committee reporting

### Bias & Fairness Monitoring
- [ ] Performance analysis by protected group
- [ ] Disparate impact metrics calculated
- [ ] Fairness metrics tracked
- [ ] Bias testing results documented
- [ ] Remediation actions if needed
- [ ] Customer complaint correlation analysis
- [ ] Regulatory examination readiness

### Model Retraining & Updates
- [ ] Retraining schedule established
- [ ] Training data quality checked
- [ ] New model performance validated
- [ ] Model comparison testing
- [ ] Change control approval
- [ ] Version management
- [ ] Rollback procedures tested

### Incident Management
- [ ] Incidents logged and documented
- [ ] Root cause analysis completed
- [ ] Corrective actions identified
- [ ] Remediation timeline documented
- [ ] Escalation as needed to management
- [ ] Regulatory notification if required
- [ ] Preventive measures implemented

## Required Documentation

| Document | Purpose | Owner | Review Frequency |
|----------|---------|-------|------------------|
| Model Charter | Objective, scope, data, limitations | Model Owner | Annually |
| Data Dictionary | Feature definitions and quality standards | Data Steward | As needed |
| Model Development Report | Methodology, experiments, results | Data Scientist | Once |
| Validation Report | Independent testing and results | Risk Function | Annually |
| Monitoring Plan | KPIs, thresholds, procedures | Risk Function | As needed |
| Risk Assessment | Risks, mitigations, residual risk | Risk Function | Quarterly |
| Governance Framework | Policies, procedures, escalation | Risk Function | As needed |
| Testing & QA | Stress tests, bias tests, performance | Data Scientist | Monthly |
| Change Log | All model updates and versions | Model Owner | Ongoing |
| Incident Log | Issues, root causes, remediation | Risk Function | Ongoing |

## Governance Framework

### Key Governance Elements
- [ ] Model steering committee or oversight
- [ ] Change control process for model updates
- [ ] Model inventory and registry
- [ ] Escalation paths and decision rights
- [ ] Clear roles and responsibilities
- [ ] Training program for staff
- [ ] Regular audits and assessments
- [ ] Board-level reporting structure

### Board Reporting
- [ ] Quarterly model risk report
- [ ] Key metrics and trends
- [ ] Risk assessment summary
- [ ] Remediation status
- [ ] Regulatory examination updates
- [ ] Resource adequacy

## Regulatory Alignment

This checklist aligns with:
- **Federal Reserve SR 11-7**: Model Risk Management guidance
- **OCC Bulletin 2020-4**: AI and ML Governance and Risk Management
- **FDIC**: Sound Practices for Model Risk Management
- **Interagency Guidance**: Credit Risk Assessment Models

## Implementation Timeline

**Month 1**: Establish governance and assign owners  
**Month 2**: Develop documentation templates and procedures  
**Month 3-4**: Apply to new model development  
**Month 5-6**: Validate existing production models  
**Month 7+**: Ongoing monitoring and continuous improvement  

## Success Metrics

- [ ] 100% of AI/ML models with documented checklists
- [ ] Average validation time <30 days
- [ ] 90%+ checklist compliance for new models
- [ ] <2 month validation cycle for standard models
- [ ] Zero regulatory findings on model governance
- [ ] Zero material model failures

## Critical Success Factors

1. **Executive commitment** to MRM discipline
2. **Dedicated resources** for validation and monitoring
3. **Clear governance** with defined escalation
4. **Strong documentation** discipline
5. **Cross-functional collaboration** (business, tech, risk)
6. **Regular training** for all staff
7. **Automated monitoring** where possible
8. **Regular audits** by independent function

---

*Sound model risk management is foundational for safe AI deployment in regulated financial institutions.*

**Questions or Support**  
Email: advisor@rodney-ai.com
