const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.csv');

app.use(express.json());
app.use(express.static(__dirname));

// Ensure CSV exists with headers
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
  fs.writeFileSync(SUBSCRIBERS_FILE, 'name,email,subscribed_at\n');
}

app.post('/subscribe', (req, res) => {
  const { name, email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  // Read existing entries to check for duplicates
  const existing = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
  if (existing.includes(email)) {
    return res.status(409).json({ error: 'Already subscribed.' });
  }

  const safeName = (name || '').replace(/,/g, ' ').replace(/\n/g, ' ').trim();
  const safeEmail = email.replace(/,/g, '').replace(/\n/g, '').trim();
  const timestamp = new Date().toISOString();

  fs.appendFileSync(SUBSCRIBERS_FILE, `"${safeName}","${safeEmail}","${timestamp}"\n`);

  console.log(`New subscriber: ${safeEmail}`);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`AuditLens landing page running at http://localhost:${PORT}`);
  console.log(`Subscriber emails saved to: ${SUBSCRIBERS_FILE}`);
});
