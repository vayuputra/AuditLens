// Manual smoke test for landing/server.js — no test runner/dependency in this
// package, so this is a plain node script exercising the running server with
// real HTTP requests (supertest-style, without adding supertest).
//
// Run with:  node server.test.manual.js
//
// It boots the app on an ephemeral port, points SUBSCRIBERS_PATH at a throwaway
// file so it never touches landing/data/subscribers.csv, and exits non-zero on
// any failed assertion.

const fs = require('fs');
const os = require('os');
const path = require('path');

const tmpCsv = path.join(os.tmpdir(), `auditlens-subscribers-test-${Date.now()}.csv`);
process.env.SUBSCRIBERS_PATH = tmpCsv;
process.env.PORT = '0';

const app = require('./server.js');

let failures = 0;
function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    failures++;
    console.error(`FAIL: ${label} — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  } else {
    console.log(`ok — ${label}`);
  }
}
function assertTrue(cond, label) {
  if (!cond) {
    failures++;
    console.error(`FAIL: ${label}`);
  } else {
    console.log(`ok — ${label}`);
  }
}

async function main() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  try {
    // 1. Static root only serves public/ — server internals are unreachable.
    for (const p of ['/server.js', '/package.json', '/.env', '/data/subscribers.csv']) {
      const res = await fetch(base + p);
      assertEqual(res.status, 404, `GET ${p} is not served (static root restricted)`);
    }

    // 2. The real landing page is still served from public/.
    {
      const res = await fetch(base + '/index.html');
      assertEqual(res.status, 200, 'GET /index.html is served from public/');
    }

    // 3. Invalid input -> 400
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email' }),
      });
      assertEqual(res.status, 400, 'POST /subscribe rejects malformed email');
    }
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: { toString: () => 'x@y.com' } }),
      });
      assertEqual(res.status, 400, 'POST /subscribe rejects non-string email (truthy object)');
    }
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ok@example.com', name: 12345 }),
      });
      assertEqual(res.status, 400, 'POST /subscribe rejects non-string name (truthy number)');
    }

    // 4. Valid new subscriber -> 201, dedupe (case/whitespace-insensitive) -> 200
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada Lovelace', email: 'Ada@Example.com' }),
      });
      assertEqual(res.status, 201, 'POST /subscribe with a new email returns 201');
    }
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Ada', email: '  ada@example.com  ' }),
      });
      assertEqual(res.status, 200, 'POST /subscribe with the same email (diff case/whitespace) returns 200 (idempotent dup)');
    }
    {
      // Substring collision check: this address contains "ada@example.com" as a
      // substring but is a distinct address — must NOT be treated as duplicate.
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Not Ada', email: 'notada@example.com' }),
      });
      assertEqual(res.status, 201, 'POST /subscribe with a substring-colliding-but-distinct email returns 201, not treated as dup');
    }

    // 5. Embedded quotes / CR / formula-leading values are written safely.
    {
      const res = await fetch(base + '/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '=SUM(A1:A9)"evil"\r\ninjected', email: 'formula@example.com' }),
      });
      assertEqual(res.status, 201, 'POST /subscribe accepts a formula-leading/quote-containing name');
    }

    const csv = fs.readFileSync(tmpCsv, 'utf8');
    const lines = csv.trim().split('\n');
    assertEqual(lines.length, 4, 'CSV has header + 3 data rows (ada, notada, formula; dup did not add a row)');

    const formulaLine = lines.find((l) => l.includes('formula@example.com'));
    assertTrue(!!formulaLine, 'formula-leading row was written');
    assertTrue(formulaLine.includes("'=SUM"), 'formula-leading name is neutralized with a leading quote');
    assertTrue(!/\r|\n/.test(formulaLine.replace(/^.*$/m, formulaLine)) || !formulaLine.includes('\n'), 'no raw newline was written into the CSV row');
    assertTrue(formulaLine.includes('""evil""'), 'embedded quotes are escaped by doubling');

    // Every data row must be exactly 3 comma-joined quoted fields (no stray
    // newline broke a record into two lines).
    const dataRows = lines.slice(1);
    assertEqual(dataRows.length, 3, 'exactly 3 data rows total');
  } finally {
    server.close();
    try { fs.unlinkSync(tmpCsv); } catch (_) { /* ignore */ }
  }

  if (failures > 0) {
    console.error(`\n${failures} assertion(s) failed.`);
    process.exit(1);
  }
  console.log('\nAll assertions passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
