# AuditLens - Product Technical Description

**Version:** 1.0
**Date:** March 2026
**Classification:** External - For Investors & Partners

---

## 1. Product Overview

AuditLens is a Windows desktop application that automates IT audit evidence documentation using artificial intelligence. It enables auditors to capture screenshots, receive instant AI-powered analysis, and generate professional Word-format workpapers - reducing hours of manual documentation to seconds.

**Product Category:** AI-Powered Audit Technology (AuditTech)
**Platform:** Windows 10/11 (64-bit)
**Distribution:** Digital download (.exe installer)
**Creator:** Akshat Ratanpal, Mumbai, India

---

## 2. Problem Statement

IT auditors spend a disproportionate amount of time on evidence documentation rather than the audit itself. The current workflow involves:

- Manually capturing screenshots of IT systems under review
- Manually writing findings, observations, and risk assessments for each screenshot
- Manually assembling Word documents with proper figure numbering and formatting
- Maintaining evidence integrity and chain of custody
- Managing evidence across multiple audit engagements simultaneously

**Industry pain point:** An estimated 40-60% of an IT auditor's time is spent on documentation rather than analysis and judgement - the activities that actually drive audit quality.

---

## 3. Solution Architecture

### 3.1 High-Level Architecture

```
+---------------------------+
|     AuditLens Desktop     |
|      (Windows App)        |
+---------------------------+
|  Screenshot Capture       |  <-- Global Hotkey (Ctrl+Shift+S)
|  Local Image Storage      |  <-- All data stays on user's machine
|  AI Analysis Engine       |  --> Direct API call to AI provider
|  Evidence Management      |  <-- Local project database
|  Report Generation        |  --> Word (.docx) export
+---------------------------+
            |
            | Direct encrypted API call (HTTPS/TLS)
            | User's own API key (BYOK)
            v
+---------------------------+
|   AI Provider APIs        |
|   - OpenAI (GPT-4o)      |
|   - Anthropic (Claude)    |
|   - Google (Gemini)       |
+---------------------------+
```

### 3.2 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Desktop-first (not SaaS)** | Audit data sensitivity demands local-only storage. Eliminates cloud breach risk. |
| **BYOK (Bring Your Own Key)** | No AuditLens server in the data path. Users connect directly to AI providers. Preserves auditor independence. |
| **Multi-model AI support** | Avoids vendor lock-in. Users choose the AI provider that meets their organization's policies. |
| **One-time purchase (not subscription)** | Aligns with audit firm procurement models. Reduces friction for individual practitioners. |

### 3.3 Data Flow

1. User presses `Ctrl+Shift+S` (global hotkey, works from any application)
2. Crosshair cursor appears for screen region selection
3. Screenshot is captured and stored locally on the user's machine
4. SHA-256 hash is computed immediately for tamper-proof integrity
5. Screenshot is sent directly to the user's chosen AI provider via encrypted API call
6. AI returns structured analysis (findings, risk level, recommendations, tags)
7. Analysis is displayed alongside the screenshot for review and editing
8. User can copy, export, or save the evidence to a project

**No data passes through AuditLens infrastructure at any point.**

---

## 4. Core Feature Set

### 4.1 Screenshot Capture Engine

- **Global hotkey:** `Ctrl+Shift+S` activates capture from any application
- **Crosshair cursor:** Precision area selection for targeted evidence capture
- **Instant capture:** Sub-second screenshot acquisition
- **SHA-256 hashing:** Automatic tamper-proof integrity verification on every capture
- **Figure numbering:** Automatic sequential numbering (e.g., Fig 1.1, Fig 3.2)

### 4.2 AI Analysis Engine

| Analysis Mode | Description | Use Case |
|--------------|-------------|----------|
| **Quick** | Concise summary with key findings | Rapid evidence triage |
| **Detailed** | Comprehensive analysis with full risk assessment | Formal workpaper documentation |
| **Custom** | User-defined prompt templates | Methodology-specific analysis |

**AI capabilities per screenshot:**
- System/application identification
- Finding and observation extraction
- Risk level classification (High / Medium / Low)
- Automated tagging (e.g., "access-control", "firewall", "password-policy")
- Actionable recommendation generation

**Supported AI providers:**
- OpenAI GPT-4o (vision-capable models)
- Anthropic Claude (multimodal)
- Google Gemini (multimodal)

### 4.3 Project Management

- Create and manage multiple audit engagements
- Track client information and audit periods
- Organize evidence by project with tags and risk scores
- Cross-project evidence search and retrieval

### 4.4 Batch Processing

- Drag-and-drop bulk import of existing screenshots
- Parallel AI analysis of multiple images
- Real-time progress tracking per file
- Automatic tagging and classification across batch

### 4.5 Evidence Comparison

- Side-by-side evidence comparison view
- Synced scrolling between paired screenshots
- Visual diff support for before/after evidence
- Annotation and markup tools

### 4.6 Report Generation

- **Summary dashboard:** Risk heatmap with High/Medium/Low distribution
- **Word (.docx) export:** Professional audit workpaper with:
  - All evidence screenshots with figure numbers
  - AI-generated analysis and findings
  - Risk scores and tag summaries
  - Executive summary with risk distribution
- **Clipboard integration:** One-click copy as formatted HTML for pasting into Word, Outlook, or other applications

### 4.7 Custom Templates

- Create reusable AI prompt templates
- Align analysis with specific audit methodologies (COBIT, NIST, ISO 27001, etc.)
- Share templates across projects

### 4.8 Cost Tracking

- Real-time AI API cost monitoring per analysis
- Per-project cost aggregation
- Approximate cost: **$0.01 per 5-10 screenshots** (~$0.001-0.002 per screenshot)

---

## 5. Security & Privacy Architecture

### 5.1 BYOK (Bring Your Own Key) Model

AuditLens implements a zero-trust architecture with respect to its own infrastructure:

```
User's Machine  ───────────>  AI Provider (Enterprise API)
     ^                              |
     |                              |
     +--------- Analysis <---------+

     AuditLens servers are NOT in this path.
```

- **API keys** are stored locally on the user's machine only
- **Screenshots** are never transmitted to AuditLens infrastructure
- **AI analysis** flows directly between the user's machine and the AI provider
- **No telemetry** or data collection beyond license verification

### 5.2 Evidence Integrity

- **SHA-256 hashing** is computed at the moment of capture
- Hash can be verified at any time to confirm evidence has not been tampered with
- Supports audit-grade chain of custody requirements

### 5.3 Enterprise API Standards

AuditLens connects to AI providers via their **enterprise/API tier** (not consumer tier):
- OpenAI's API has a separate data policy from ChatGPT consumer (no training on API data by default)
- Anthropic's API has enterprise-grade data handling
- Google's Gemini API operates under enterprise terms

### 5.4 License Verification

- One-time license verification on first launch (machine identifier + license key)
- No ongoing phone-home or telemetry
- App functions fully offline after initial activation (except for AI analysis calls)

---

## 6. Technical Specifications

| Specification | Detail |
|--------------|--------|
| **Platform** | Windows 10/11 (64-bit) |
| **Application Type** | Native desktop application (.exe) |
| **Data Storage** | Local-only (SQLite + file system) |
| **AI Connectivity** | HTTPS/TLS to provider APIs |
| **UI Framework** | Native Windows UI with dark mode |
| **Export Formats** | Word (.docx), Clipboard (HTML) |
| **Hashing** | SHA-256 |
| **Hotkey** | Configurable (default: Ctrl+Shift+S) |
| **Installation** | Single .exe installer, no dependencies |

---

## 7. User Workflow

```
                    +-------------------+
                    |  1. CAPTURE       |
                    |  Ctrl+Shift+S     |
                    |  Select region    |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |  2. ANALYZE       |
                    |  AI processes     |
                    |  screenshot       |
                    |  instantly        |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |  3. REVIEW        |
                    |  Edit findings    |
                    |  Adjust risk      |
                    |  Add tags         |
                    +---------+---------+
                              |
                              v
                    +-------------------+
                    |  4. EXPORT        |
                    |  Word document    |
                    |  Clipboard copy   |
                    |  Project archive  |
                    +-------------------+
```

**Time to first workpaper:** Under 5 minutes from purchase to completed export.

---

## 8. Pricing & Business Model

| Component | Price | Notes |
|-----------|-------|-------|
| **AuditLens license** | $129 one-time | Includes 12 months of updates |
| **Continued updates** | $59/year (optional) | App continues to work without renewal |
| **AI usage costs** | ~$0.01 per 5-10 screenshots | Paid directly to AI provider by user |

**Key characteristics:**
- Perpetual license (not subscription-dependent)
- No per-seat or per-user licensing complexity
- AI costs are transparent and pass-through
- $5 AI credit covers hundreds of screenshots

---

## 9. Target Users & Industries

| Segment | Use Case |
|---------|----------|
| **IT Auditors** | ITGC testing, access reviews, configuration assessments |
| **Internal Audit** | Control testing documentation, SOX evidence |
| **SOX Compliance** | Section 404 IT control evidence capture |
| **Risk Advisory** | IT risk assessment documentation |
| **Cybersecurity Auditors** | Security configuration reviews, vulnerability documentation |

---

## 10. Competitive Differentiation

| Differentiator | AuditLens | Traditional Approach |
|---------------|-----------|---------------------|
| Evidence capture | Global hotkey, instant | Manual screenshot + paste |
| Analysis | AI-generated in seconds | Hours of manual writing |
| Risk assessment | Automatic classification | Manual judgement per item |
| Report generation | One-click Word export | Hours of formatting |
| Evidence integrity | SHA-256 automatic | Manual or none |
| Data privacy | BYOK, zero cloud storage | Varies; often cloud-dependent |
| Cost per screenshot | ~$0.001-0.002 | Auditor hourly rate |

---

*For questions or partnership inquiries, contact: akshat.ratanpal@gmail.com*
