# AuditLens - Project Guide

## What Is This

Marketing/landing website for **AuditLens**, a Windows desktop application that helps IT auditors capture, analyze, and document evidence using AI. The desktop app itself is NOT in this repo — this is the public-facing sales site.

**Creator:** Akshat Ratanpal (akshat.ratanpal@gmail.com)
**GitHub:** https://github.com/vayuputra/AuditLens.git
**Branch:** main (only branch)

## Tech Stack

- **HTML5** — Static pages, no framework, no build step
- **Tailwind CSS** — Via CDN (`https://cdn.tailwindcss.com`), utility-first styling
- **Vanilla JavaScript** — Minimal, inline `<script>` blocks
- **Google Fonts** — Inter (weights 300–900)
- **Lemon Squeezy** — Payment processing, license delivery, checkout widget (`https://app.lemonsqueezy.com/js/lemon.js`)

No package manager, no bundler, no transpiler. Deploy as-is to any static host.

## Project Structure

```
AuditLens/
├── index.html              # Main landing page (~60KB, all sections)
├── index_from_github.html  # Archived older version (old $49 pricing)
├── privacy.html            # Privacy policy
├── terms.html              # Terms and conditions
├── refund.html             # Refund policy
└── icon.png                # App icon
```

## Design System

### Theme: Light Mode

- **Background:** `#ffffff` (white)
- **Surface:** `#f9fafb` → `#f3f4f6` (gray-50 to gray-100)
- **Text:** `#111827` (gray-900) primary, `#6b7280` (gray-500) secondary
- **Primary gradient:** `#60a5fa` → `#a78bfa` (blue to purple, for accent text)
- **Font:** Inter, sans-serif fallback

### Custom Tailwind Brand Palette

```
brand-50 → brand-900 (blue scale)
Primary CTA: brand-600 (#2563eb)
CTA Hover: brand-700 (#1d4ed8)
```

### Visual Patterns

- **Glass morphism:** `background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border: 1px solid rgba(209,213,219,0.6);`
- **Gradient text:** `background: linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa); -webkit-background-clip: text;`
- **Float animation:** `@keyframes float { 50% { transform: translateY(-8px); } }` (6s ease-in-out)
- **Glow effect:** `box-shadow` with rgba blue tones

## Component Patterns

### Feature Card
```html
<div class="glass rounded-xl p-6 hover:border-brand-500/30">
  <div class="feature-icon bg-blue-600/15"><!-- SVG --></div>
  <h3>Title</h3>
  <p>Description</p>
</div>
```

### Screenshot Mockup
```html
<div class="screenshot-card glow">
  <div class="screenshot-titlebar"><!-- Traffic light dots --></div>
  <div class="p-5"><!-- Content --></div>
</div>
```

## Conventions

- **Styling:** Tailwind utilities first, custom CSS only for animations/gradients/glass effects
- **Responsive breakpoints:** base (mobile) → `sm:` → `md:` → `lg:`
- **Layout:** Grid-based responsive (`md:grid-cols-2`, `lg:grid-cols-3`), max-width containers (`max-w-7xl`)
- **Interactivity:** Vanilla JS only, no frameworks — `classList.toggle()`, simple onclick handlers
- **Navigation:** Anchor-based hash links (`#features`, `#pricing`, `#how-it-works`)
- **FAQ:** Native `<details>/<summary>` elements
- **Icons:** Inline SVGs, no icon library
- **Accessibility:** Semantic HTML, proper heading hierarchy, alt text on images

## Landing Page Sections (index.html)

1. Navigation — Sticky glass header
2. Hero — Headline + value prop + CTA buttons
3. Trust Bar — Target industries
4. Features — 9 feature cards with icons
5. Screenshots — 3 application mockup walkthroughs
6. How It Works — 4-step process
7. Privacy/BYOK — Data architecture diagram
8. Pricing — Single-tier card ($129 one-time + optional $59/year renewal)
9. FAQ — 7 questions using `<details>` elements
10. CTA — Final call to action
11. Footer — Policy links + contact

## Pricing Model

- **$129** one-time purchase (was $49 in earlier version)
- **$59/year** optional renewal for continued framework updates
- App works indefinitely even without renewal
- AI costs separate (~$0.01 per 5-10 screenshots, user pays AI provider directly)
- All sales final (no refunds, see refund.html)

## Key Product Features (for marketing copy reference)

- Global hotkey capture (Ctrl+Shift+S)
- Multi-model AI analysis (GPT-4o, Claude, Gemini)
- Three analysis modes: Quick, Detailed, Custom
- BYOK architecture — user's API keys, data never touches AuditLens servers
- SHA-256 evidence integrity verification
- Word document (.docx) export
- Batch screenshot import with drag-and-drop
- Side-by-side comparison view
- Real-time AI cost tracking
- Project/client/engagement management

## Important Notes

- `index_from_github.html` is an archived version — do not modify unless restoring old content
- Lemon Squeezy checkout links are live — be careful editing payment URLs
- All external dependencies are CDN-loaded (no local copies)
- The site targets Windows users specifically (desktop app is .exe)
- Legal pages (privacy, terms, refund) reference Indian jurisdiction (Mumbai)
