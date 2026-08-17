/**
 * Rewrite hall HTML stubs as charter one-pagers.
 * No FILL leads. No twelve-company raise. Demeter founder named.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'public/investors/company-decks')
const founderHalls = new Set(['demeter', 'njord'])

for (const file of readdirSync(dir).filter((f) => f.endsWith('.html'))) {
  const id = file.replace(/\.html$/, '')
  let text = readFileSync(join(dir, file), 'utf8')
  text = text.replace(
    /<title>([^<]+) — Valhalla Company Deck Stub<\/title>/,
    '<title>$1 — Hall charter one-pager</title>',
  )
  text = text.replace('Dedicated company deck ·', 'Hall charter one-pager ·')
  text = text.replace('<h3>Lead</h3>', '<h3>Hall lead</h3>')
  text = text.replace(/<p class="fill">\[\[FILL: [^<\]]+\]\]<\/p>/, founderHalls.has(id)
    ? '<p>Eason Greene, founder</p>'
    : '<p>OPEN</p>')
  const seat =
    id === 'demeter'
      ? '<p class="small">Charter room. Capital desk: Demeter Energy $1.0–1.5M SAFE at $8M cap. Gothenburg is a lead, not a lease. Entity in formation. Not a civilization raise.</p>'
      : founderHalls.has(id)
        ? '<p class="small">Charter room. Founder named. Not an operating-company bio. Not a securities offer.</p>'
        : '<p class="small">Charter room. Hall lead seat is OPEN. Not an operating-company bio. Not a securities offer.</p>'
  text = text.replace(/<p class="small">Seat title: Hall Lead — [^<]+<\/p>/, seat)
  text = text.replace(
    'This is the <strong>dedicated per-company deck stub</strong> for',
    'This is the <strong>hall charter one-pager</strong> for',
  )
  text = text.replace(
    'within the Valhalla mosaic of 12.',
    'within the Valhalla mosaic of twelve halls. Not a twelve-issuer raise.',
  )
  writeFileSync(join(dir, file), text)
}

writeFileSync(
  join(root, 'public/investors/halls.html'),
  `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Valhalla — Twelve hall charters</title>
<style>
body { font-family: "IBM Plex Sans", Helvetica, Arial, sans-serif; max-width: 40rem; margin: 2rem auto; padding: 0 1rem; color: #111; }
h1 { font-size: 1.75rem; }
.note { border: 1px solid #111; padding: 1rem; }
ul { line-height: 1.6; }
.small { color: #555; font-size: 0.9rem; }
</style>
</head>
<body>
<p class="small">VALHALLA · ONE CIVILIZATION</p>
<h1>Twelve hall charters</h1>
<div class="note">
  <p>These are rooms of One Civilization, not twelve companies raising.</p>
  <p>The capital-desk conversation is Demeter Energy: $1.0–1.5M SAFE at $8M cap. Land in Gothenburg is a lead, not a lease. Entity in formation.</p>
  <p>Atoll is a hall. It is not a SAFE issuer. Space seat is OPEN.</p>
</div>
<h2>Land</h2>
<ul>
  <li><a href="company-decks/wolf.html">Wolf</a> — the pack moves</li>
  <li><a href="company-decks/holm.html">Holm</a> — the house stands</li>
  <li><a href="company-decks/demeter.html">Demeter</a> — the acre feeds</li>
</ul>
<h2>Water</h2>
<ul>
  <li><a href="company-decks/viking.html">Viking</a> — the deck boards</li>
  <li><a href="company-decks/atoll.html">Atoll</a> — the shore begins</li>
  <li><a href="company-decks/njord.html">Njord</a> — the hall holds water</li>
</ul>
<h2>Air</h2>
<ul>
  <li><a href="company-decks/eagle.html">Eagle</a> — flight rises</li>
  <li><a href="company-decks/olympus.html">Olympus</a> — home above the clouds</li>
  <li><a href="company-decks/aeolus.html">Aeolus</a> — the sky presses</li>
</ul>
<h2>Space</h2>
<ul>
  <li><a href="company-decks/phenix.html">Phénix</a> — launch returns</li>
  <li><a href="company-decks/aether.html">Aether</a> — orbit is marked, not titled</li>
  <li><a href="company-decks/corvus.html">Corvus</a> — the mind that runs the mosaic</li>
</ul>
<p class="small">Meridian cuts cloth. Apollo Music stays interior. valhallaco.org</p>
<p class="small">These are the first 12 halls of the Skáli. The Skáli of Valhalla holds 24. The second wing opens when the first is won.</p>
</body>
</html>
`,
)

console.log('hall charters rewritten')
