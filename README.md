# AuditLens — Landing Page

Marketing site for **AuditLens**, a Windows desktop application that helps IT auditors capture, analyze, and document evidence using AI. The desktop app itself is not in this repo — this is the public-facing site that markets it and captures email leads.

## Tech Stack

- **HTML5** static pages (no framework, no build step)
- **Tailwind CSS** via CDN
- **Vanilla JavaScript** for interactivity
- **Node.js + Express** to serve the site and capture email subscriptions to a CSV
- **Lemon Squeezy** for checkout, payments, and license delivery

## Project Structure

```
AuditLens/
├── server.js          # Express server + /subscribe endpoint
├── index.html         # Main landing page
├── privacy.html       # Privacy policy
├── terms.html         # Terms and conditions
├── refund.html        # Refund policy
├── icon.png           # App icon
└── package.json
```

## Running Locally

```bash
npm install
npm start
```

The server listens on `http://localhost:3000` (or `PORT` env var) and writes captured emails to `subscribers.csv`.

## Deployment

The static files can be deployed as-is to any static host. To use the email capture endpoint, deploy `server.js` to a Node host (Railway, Render, Fly, etc.).

## License

Proprietary — all rights reserved.
