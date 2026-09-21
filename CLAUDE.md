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
- **Google Fonts** — Inter (400/500/600) + DM Mono (400/500, micro-labels only)
- **Express** — `server.js`, the only dependency, for static serving + the `/subscribe` endpoint
- **Lemon Squeezy** — Payment processing, license delivery, checkout widget (`https://app.lemonsqueezy.com/js/lemon.js`)

No bundler, no transpiler, no build step. `npm start` runs it locally; `public/` can also be dropped
on any static host, minus the subscribe form.

## Project Structure

`server.js` serves **only `public/`** — nothing outside it is reachable, which is what keeps
`server.js`, `package.json` and the subscriber CSV (in `data/`, gitignored) out of the static root.

```
landing/
├── server.js               # Express static server + POST /subscribe (writes data/subscribers.csv)
└── public/                 # The entire public site — the only directory served
    ├── index.html          # Landing page, all sections, no build step
    ├── privacy.html · terms.html · refund.html
    ├── icon.png
    ├── media/              # Product screenshots (PNG, real app captures)
    └── video/              # Product tour + the four autoplay section clips
```

Media comes from the desktop-app repo and is copied in, never hand-drawn:
`deliverables/auditlens-product-demo-v2/captures/*.png` → `public/media/`,
`deliverables/landing/auditlens-{evidence,agent,population,toolstudio}.{mp4,webm,jpg}` →
`public/video/`, and `AuditLens-86s-Widescreen.mp4` transcoded to 720p as
`public/video/auditlens-product-tour.mp4`. See `deliverables/landing/README.md` there for how the
clips are re-recorded.

## Design System

Quiet, monochrome, editorial — modelled on lightfield.app. **No blue, no gradients, no glass, no
float animations.** The only colour on the page comes from the product screenshots and clips, which
is the point: the chrome stays out of their way.

Tokens live in one `:root` block in `public/index.html`:

```
--paper #f4f4f2   page background        --ink   #0d0d0c  text and buttons
--panel #ececea   feature-row containers --mute  rgba(13,13,12,.58)  body copy
--card  #ffffff   screenshot surfaces    --faint rgba(13,13,12,.38)  micro-labels
--line  rgba(13,13,12,.10)  hairlines    --hair  rgba(13,13,12,.07)
```

- **Type:** Inter for everything, DM Mono for the tiny uppercase micro-labels. Headings are
  weight **400** (never bold) with tight tracking (`-0.032em`/`-0.035em`); body is 14–15px.
- **Buttons:** 36px tall, 7px radius, 13px label. `.btn-dark` (near-black) is the only CTA style;
  `.btn-ghost` is the secondary. No pill-shaped CTAs.
- **Micro-label (`.mono`):** 10px DM Mono, uppercase, `.14em` tracking — the "PRODUCT / 1.0" style
  markers above every heading and in each section header.
- **Section header (`.sechead`):** title left, eyebrow + index number right, hairline underneath.

## Component Patterns

### Section header
```html
<div class="sechead">
  <h2 class="headline">How AuditLens works</h2>
  <div class="flex items-baseline gap-10">
    <span class="mono hidden sm:inline">Platform</span><span class="mono">2.0</span>
  </div>
</div>
```

### Feature row (narrow copy column, large visual)
```html
<div class="wrap grid lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-8 lg:gap-14">
  <div class="lg:py-8">
    <p class="mono mb-4">1.1</p>
    <h3 class="subhead mb-3">Heading</h3>
    <p class="muted text-[14px] mb-6">Body</p>
    <p class="faint text-[12px] border-l border-[color:var(--line)] pl-3">Factual footnote</p>
  </div>
  <div class="panel p-3 sm:p-5"><div class="shot"><!-- img or video --></div></div>
</div>
```

### Section clip
Autoplay clips carry **`data-src` on their `<source>` elements, not `src`** — an IntersectionObserver
sets the real src and calls `play()` the first time the clip scrolls into view, and pauses it on the
way out. Nothing downloads until it is needed. `muted` + `playsinline` are required or iOS refuses
to autoplay; `.webm` is listed first (≈30% smaller) with `.mp4` as the fallback.

## Conventions

- **Styling:** custom CSS for the type scale, colours and components; Tailwind utilities for layout,
  spacing and breakpoints. Tailwind is still CDN-loaded with no config block.
- **Responsive breakpoints:** base (mobile) → `sm:` → `md:` → `lg:`
- **Interactivity:** Vanilla JS only — three small IIFEs at the bottom of the page
- **Navigation:** Anchor-based hash links (`#product`, `#platform`, `#pricing`, `#faq`, `#film`)
- **FAQ:** Native `<details>/<summary>` with a `+`/`–` marker via CSS
- **Icons:** Inline SVGs, no icon library
- **Accessibility:** Semantic HTML, proper heading hierarchy, alt text on every image and clip
- **Claims:** every number and behaviour on the page must be true of the shipped app. No invented
  customer quotes and no logo wall — where lightfield puts a testimonial, this page puts a factual
  note about what the clip beside it is showing.

## Landing Page Sections (public/index.html)

1. Nav — floating centred pill, links + "Buy — $129"
2. Hero — headline, sub, two CTAs, product screenshot bleeding off the right edge
3. Built for — industry row under a "BUILT FOR" micro-label
4. Manifesto — right-offset text column, the "AI drafts, you judge" boundary
5. Film — full-width product tour video, click-to-play from a "Watch" pill
6. Product (1.0) — four feature rows, each with one of the four autoplay clips
7. Platform (2.0) — screenshots left, four labelled capability blocks right
8. Privacy/BYOK — panel with the "no server in the middle" diagram
9. Pricing (3.0) — $129 one-time, feature list, $59/year optional renewal
10. Questions (4.0) — 11 `<details>` items
11. Get started — two cards (buy / email)
12. Footer — link columns + bottom bar
13. Email capture modal — after 20s or 50% scroll, `POST /subscribe`

## Pricing Model

- **$129** one-time purchase (was $49 in earlier version)
- **$59/year** optional renewal for continued framework updates
- App works indefinitely even without renewal
- AI costs separate (~$0.01 per 5-10 screenshots, user pays AI provider directly)
- All sales final (no refunds, see refund.html)

## Key Product Features (for marketing copy reference)

- Global hotkey capture (Ctrl+Shift+S) with markup before you confirm the shot
- Import Studio — messy Excel/CSV/PDF/screenshot exports become a reconciled, tested population
- 100% population testing, with random / stratified / monetary-unit sampling still available
- Agent runs that execute fieldwork and stop at every judgment call; overnight runs under a spend cap
- Tool Studio — a plain-English test compiled into a sandboxed tool with hash-bound reviewer sign-off
- AI workpaper drafting; edits land in Word as tracked changes authored "AuditLens AI"
- Excel RCM, PowerPoint and SharePoint export; standalone ZIP audit file
- Framework and assessment packs (SOX, SOC 2, ISO 27001, PCI DSS, NIST…)
- BYOK — OpenAI, Anthropic, Gemini, Azure, Bedrock, Ollama; no AuditLens server in the path
- SHA-256 evidence integrity, hash-chained engagement ledger, cryptographically signed sign-offs
- Multi-engagement staffing, review queues, and a disclosed sole-practitioner sign-off basis
- Real-time AI cost tracking; PII pre-flight scan and redaction the auditor drives

**Copy boundary:** the AI *drafts* and *catches* — it never decides risk severity, clears an
exception or signs anything. Do not write copy that implies otherwise, and do not describe the PII
tooling as an automatic scrubber; it is a pre-flight scan and an editor the auditor applies.

## Important Notes

- Lemon Squeezy checkout links are live — be careful editing payment URLs
- Third-party dependencies are CDN-loaded; product media is local under `public/media` and `public/video`
- The site targets Windows users specifically (desktop app is .exe)
- Legal pages (privacy, terms, refund) reference Indian jurisdiction (Mumbai)
