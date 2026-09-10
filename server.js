const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Only this directory is ever served as static assets. server.js, package.json,
// the subscribers CSV and any .env file all live outside it, so they cannot be
// reached through the static middleware no matter how it is configured.
const PUBLIC_DIR = path.join(__dirname, 'public');

// Subscriber records live outside the public root. Overridable via env so a
// deployment can point this at a persistent volume; defaults to landing/data/.
const SUBSCRIBERS_FILE = process.env.SUBSCRIBERS_PATH
  ? path.resolve(process.env.SUBSCRIBERS_PATH)
  : path.join(__dirname, 'data', 'subscribers.csv');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_NAME_LEN = 120;

// Belt-and-suspenders: even if the static root is ever misconfigured, never
// serve these regardless of where the request resolves.
const DENIED_BASENAMES = new Set(['server.js', 'package.json', 'package-lock.json']);

function isDeniedPath(reqPath) {
  const base = path.basename(reqPath);
  if (DENIED_BASENAMES.has(base)) return true;
  if (base.toLowerCase().endsWith('.csv')) return true;
  if (base === '.env' || base.startsWith('.env.')) return true;
  return false;
}

function ensureSubscribersFile() {
  const dir = path.dirname(SUBSCRIBERS_FILE);
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, 'name,email,subscribed_at\n');
  }
}

// Strip CR/LF (keeps every record on one CSV line), neutralize values that
// would be interpreted as a spreadsheet formula, then quote + escape.
function csvField(value) {
  const str = String(value == null ? '' : value).replace(/[\r\n]+/g, ' ').trim();
  const neutralized = /^[=+\-@\t]/.test(str) ? `'${str}` : str;
  return `"${neutralized.replace(/"/g, '""')}"`;
}

// Minimal RFC-4180 style parser sufficient for our own 3-column quoted format.
function parseCsvLine(line) {
  const fields = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      fields.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  fields.push(cur);
  return fields;
}

function readSubscribers() {
  const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
  const lines = raw.split(/\r\n|\n/).filter((l) => l.length > 0);
  return lines.slice(1).map((line) => {
    const [name, email, subscribedAt] = parseCsvLine(line);
    return { name, email, subscribedAt };
  });
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

app.use(express.json());

app.use((req, res, next) => {
  if (isDeniedPath(req.path)) {
    return res.status(404).end();
  }
  next();
});

app.use(express.static(PUBLIC_DIR));

app.post('/subscribe', (req, res) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { name, email } = body;

  if (typeof email !== 'string' || email.length === 0 || email.length > MAX_EMAIL_LEN) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  const trimmedEmail = email.trim();
  if (!EMAIL_RE.test(trimmedEmail)) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  if (name !== undefined && name !== null && typeof name !== 'string') {
    return res.status(400).json({ error: 'Name must be text.' });
  }
  if (typeof name === 'string' && name.length > MAX_NAME_LEN) {
    return res.status(400).json({ error: 'Name is too long.' });
  }

  const normalizedEmail = normalizeEmail(trimmedEmail);
  const safeName = typeof name === 'string' ? name.trim() : '';

  let existing;
  try {
    ensureSubscribersFile();
    existing = readSubscribers();
  } catch (err) {
    return res.status(500).json({ error: 'Could not read subscriber list.' });
  }

  const isDuplicate = existing.some((row) => normalizeEmail(row.email || '') === normalizedEmail);
  if (isDuplicate) {
    // Idempotent: subscribing again is a success, not an error.
    return res.status(200).json({ success: true, duplicate: true });
  }

  const timestamp = new Date().toISOString();
  const line = [safeName, normalizedEmail, timestamp].map(csvField).join(',') + '\n';

  try {
    fs.appendFileSync(SUBSCRIBERS_FILE, line);
  } catch (err) {
    return res.status(500).json({ error: 'Could not save subscription.' });
  }

  console.log(`New subscriber: ${normalizedEmail}`);
  res.status(201).json({ success: true });
});

if (require.main === module) {
  ensureSubscribersFile();
  app.listen(PORT, () => {
    console.log(`AuditLens landing page running at http://localhost:${PORT}`);
    console.log(`Subscriber emails saved to: ${SUBSCRIBERS_FILE}`);
  });
}

module.exports = app;
