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
├── index.html              # Main landing page (~93KB, all sections)
├── media/                  # Product recordings + poster frames
│   ├── overview.{mp4,webm,jpg}             # 14s hero montage of all four surfaces
│   ├── tool-studio.{mp4,webm,jpg}
│   ├── population-testing.{mp4,webm,jpg}
│   ├── agent-fieldwork.{mp4,webm,jpg}
│   └── evidence-workpapers.{mp4,webm,jpg}
├── privacy.html            # Privacy policy
├── terms.html              # Terms and conditions
├── refund.html             # Refund policy
├── server.js               # Express static host + /subscribe lead capture
└── icon.png                # App icon
```

Media notes: every clip ships as **WebM (VP9) first, MP4 (H.264) fallback**, with a JPG
poster. Clips are muted, looping and lazy (`preload="none"`); an IntersectionObserver
plays them on screen and pauses them off screen. Source recordings are 1280x720; the web
copies are scaled to 1120px wide with no audio track.

## Design System

### Theme: Light Mode

- **Background:** `#ffffff` (white)
- **Surface:** `#f9fafb` → `#f3f4f6` (gray-50 to gray-100)
- **Text:** `#111827` (gray-900) primary, `#6b7280` (gray-500) secondary
- **Primary gradient:** `#0075de` → `#097fe8` (for accent text)
- **Body font:** Inter
- **Display font:** Playfair Display — the app titles every surface with a serif, and the
  site mirrors that. Pair it with a lighter sans qualifier, exactly as the app does
  ("Tool Studio *Gallery*", "Population Testing").

### Palette — sampled from the application

These values were read pixel-by-pixel off the product recordings; keep them in sync with
the app rather than re-inventing them.

```
warm-50   #f6f4f3   app page ground
warm-900  #30302e   app ink / dark buttons
accent    #0075de   app primary button (Capture, Build tool, Implement)
stage-amber  #f19e0c   active stage chip
stage-green  #15803d   deliverable/export actions
```

### Visual Patterns

- **Card:** `background:#fff; border:1px solid rgba(0,0,0,0.09); border-radius:10px` — the
  app's standard surface. `.elevated` adds the layered shadow.
- **Glass:** `rgba(255,255,255,0.86)` + `backdrop-filter: saturate(180%) blur(20px)` — nav only.
- **Micro-label:** 11px uppercase amber (`#b45309`) eyebrow above a heading, lifted from the
  app's in-product callouts ("HASHED ON CAPTURE", "ROW-LEVEL PROVENANCE").
- **Stat tile:** bordered box, big number + small-caps key, tinted green/red/amber — matches
  how the app renders population results.
- **Stage rail:** the app's six-stage pill stepper. Fits on one row at ≥1280px; scrolls
  horizontally below that (scrollbar hidden), as it does in the app.

## Component Patterns

### Feature Card
```html
<div class="card lift p-6 reveal">
  <div class="w-11 h-11 rounded-card bg-accent/10 flex items-center justify-center mb-4"><!-- SVG --></div>
  <h3 class="text-warm-900 font-semibold mb-2">Title</h3>
  <p class="text-warm-500 text-sm leading-relaxed">Description</p>
</div>
```

### Product Film
Real footage only — do **not** build fake app mock-ups. The recordings already carry the
app's own chrome, so the frame around them stays plain (no macOS traffic lights; the app
is Windows and has no such titlebar).
```html
<div class="film-wrap relative reveal">
  <div class="film">
    <video class="al-video" poster="media/x.jpg" muted loop playsinline preload="none" aria-label="…">
      <source src="media/x.webm" type="video/webm">
      <source src="media/x.mp4" type="video/mp4">
    </video>
  </div>
  <button type="button" class="film-replay al-replay" aria-label="Replay">…</button>
</div>
```

### Section Heading
```html
<p class="micro-label mb-3">Eyebrow</p>
<h2 class="display text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-4 text-warm-900">
  Serif headline <span class="display-qualifier">sans qualifier</span>
</h2>
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

1. Navigation — Light glass header mirroring the app's own top bar (`#top`)
2. Hero — Headline, value prop, CTAs + the 14s overview montage
3. Stage rail — the app's six-stage spine, animated
4. Receipts strip — four stat tiles quoting real numbers from the recordings
5. See it work (`#see-it`) — the four product films, alternating left/right
6. Lifecycle (`#lifecycle`) — the six stages as cards
7. Features (`#features`) — 9 cards + 4 compact cards
8. Your data (`#privacy`) — local-first architecture + data-path diagram
9. Pricing (`#pricing`) — single tier ($499 one-time + optional $59/year renewal)
10. FAQ — 10 questions using `<details>` elements
11. CTA — Dark band, final call to action
12. Footer — Policy links + contact
13. Subscribe modal — fires at 20s or 50% scroll, posts to `/subscribe`

## Pricing Model

- **$499** one-time purchase (was $129, and $49 in the earliest version)
- **$59/year** optional renewal for continued framework updates
- App works indefinitely even without renewal
- AI costs separate and billed by the user's own provider — the recorded ITGC engagement
  cost **$0.22** end to end; quote that figure rather than the old per-screenshot estimate
- All sales final (no refunds, see refund.html)

## Key Product Features (for marketing copy reference)

The app is now a **full audit workstation**, not a screenshot tool. Everything sits on a
six-stage rail: Plan & scope → Capture evidence → Test & reperform → Analyze & investigate
→ Conclude & report → Defend & sign off.

- **Population Testing** — 100% of a listing, no sampling. Deterministic rules decide most
  rows; AI drafts a call only on the ambiguous residue, flagged for confirmation. Row-level
  provenance: each exception names the row, rule and field values, and whether a rule or the
  model decided. Push to the Exception Tracker or export CSV.
- **Tool Studio** — describe an analysis in plain English, one AI call builds a tool, and it
  runs locally (Node, on the user's machine) at zero marginal cost. Data never goes to the
  model. Auto-drafted methodology sheet (purpose, population, logic, exception definition,
  limitations) is what a reviewer reads; the code is the appendix. Sign-off binds to the
  exact code version. Blueprints: IT General Controls, Financial & Journal Entries, Fraud &
  Forensics, Security Operations, Methodology & Sampling.
- **Framework library + agent fieldwork** — implement a control pack (e.g. Treasury & Cash)
  and each control becomes a live test. The agent runs the steps but **never rates severity
  and never decides risk**; it logs every exception at the lowest severity and pauses for the
  auditor's judgment. This human-gate framing is central — do not describe the agent as
  autonomous.
- **Evidence** — hotkey capture, hashed/timestamped/figure-numbered/control-tagged on
  capture, with risk severity and tags.
- **Workpaper Studio** — Excel Risk-Control Matrix, AI-drafted workpaper from selected
  figures, Word editor, and a **standalone audit file** (ZIP with browser-readable index
  that needs no AuditLens or licence to open).
- **Living workpapers** — roll forward a period as tracked changes with no AI involved;
  AI pre-review raises issues as Word comments without ever editing the text.
- **Evidence Connectors** — SAP, Dynamics, Oracle, NetSuite, REST, CSV/XLSX.
- **MCP** — read-only remote evidence chase (every fetch approved first); optional external
  access letting Claude Desktop or another agent drive AuditLens over localhost, off by
  default, with judgment still pausing locally.
- BYOK architecture — user's API keys, no AuditLens server in the path
- Multi-model (OpenAI, Claude, Gemini) with live cost metering in the title bar
- Command palette (Ctrl+K), PII redaction, SHA-256 hash chains
- Project/client/engagement management

## Important Notes

- Lemon Squeezy checkout links are live — be careful editing payment URLs
  (`45efba62-1223-47ea-925d-93cfd681f134`, referenced 5x in index.html)
- External dependencies are CDN-loaded (Tailwind, Google Fonts, Lemon Squeezy); the only
  local assets are `icon.png` and `media/`
- The site targets Windows users specifically (desktop app is .exe) — never show a macOS
  window frame or traffic-light dots in mock-ups
- Legal pages (privacy, terms, refund) reference Indian jurisdiction (Mumbai)
- Claims on the page are sourced from the product recordings in `media/`. Keep marketing
  copy traceable to something visible in the app — the numbers quoted (186 rows, 15
  exceptions, 0.3s, $0.22) all come from those clips
- **Verifying rendering locally:** the Tailwind CDN cannot be relied on in every sandbox.
  To screenshot the page, build a stylesheet instead — `npm i --no-save tailwindcss@3`,
  mirror the inline `tailwind.config` into a config file, run
  `npx tailwindcss -c cfg.js -i in.css -o tw.built.css`, and swap the CDN `<script>` for a
  `<link>` in a throwaway copy. Do not commit that copy or the built CSS.
