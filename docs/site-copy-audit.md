# valhallaco.org copy audit vs. the canonical company doc

Audited 2026-08-13 against the "VALHALLA — One Civilization" source document.

**Method.** Live pages on valhallaco.org were read in a browser and matched back to the strings
that produce them. Live company descriptions come from four rendered surfaces plus one
AI surface:

| Surface | File | Where it shows |
|---|---|---|
| Hero kicker (`DOMAIN · PILLAR`), name | `src/data/schedule.js` | top of every company page |
| Headline / support / "What this is" body | `src/data/companyProducts.js` | every company page |
| "What X is building" + cadence + per-product pages | `src/data/hallMatrices.js`, `src/data/wolfMatrix.js` | product matrix + `/product/*` |
| Roadmap item summaries | `src/data/roadmaps.js` | `/roadmap` |
| Ask-chat AI grounding pack | `api/_lib/hallKnowledge.js` | Ask widget answers on every page |

Plus `src/data/pressRelease.js` (`/press`) and `src/data/networkFlow.js` (`/flow`).

**Two files that look authoritative but are not rendered anywhere** — see §5 before editing them.

---

## 1. Platform-level discrepancies

### 1.1 Meridian does not exist on the site — MISSING ENTITY

`grep -ri meridian src api public docs index.html` → **zero hits.**

The doc defines Meridian as the material layer beneath all four domains: tagline
"Worn by everyone. Built to last forever."; Earth product (one pair of self-cleaning
white stain-trapping polymer pants, one garment replacing 65 purchases/year, launching
September 2026); Space product (spacesuit rated for Venus, plus the Stealth body-armor
supply chain). None of it appears — no page, no mosaic tile, no mention in the press
release, no route.

The closest thing on the site is one word in the press release: `pressRelease.js:16` lists
"movement, habitation, energy production, **materials**, and intelligence" — the layer is
gestured at but never named or described.

### 1.2 The third pillar is labeled "Substrate" site-wide; the doc calls it Energy / Intelligence — FACTUAL

Live evidence: `https://valhallaco.org/corvus` renders **`SPACE · SUBSTRATE`** in the hero.

| Company | Site label | Doc |
|---|---|---|
| Demeter | Land · Substrate (`schedule.js:111`) | Land · **Energy** |
| Njord | Water · Substrate (`schedule.js:156`) | Water · **Energy** |
| Aeolus | Air · Substrate (`schedule.js:201`) | Air · **Energy** |
| Corvus | Space · Substrate (`schedule.js:246`) | Space · **Intelligence** |

Also in: `src/lib/companies.js:123,133,143,153` (`pillar: 'substrate'`),
`src/i18n/locales/en.js:45` ("Movement → Habitation → **Substrate**", shown on `/flow`),
`src/components/NetworkWebBoard.jsx:20` (axis label "Substrate").

**Internal inconsistency:** `api/_lib/hallKnowledge.js:114` tells the Ask chatbot the axis is
"movement/habitation/**energy/intelligence**", and `pressRelease.js:35` describes Space as
"launch systems, habitation platforms, **intelligence infrastructure**". So the chatbot and the
press release use the doc's naming while every visible label uses "Substrate."

### 1.3 Company taglines are absent site-wide — TAGLINE MISSING

The doc assigns each company a tagline. Only one survives on a live surface, and it is altered:

| Company | Doc tagline | Live headline (`companyProducts.js`) |
|---|---|---|
| Wolf | The pack moves first. | Ride the path. (`:13`) |
| Holm | Built for the terrain you chose. | A home that lands where the site allows. (`:34`) |
| Demeter | The same acre feeds a family and powers twenty homes. | Fields that work twice. (`:55`) |
| Viking | Board as yourself. Disembark as **Ragnar**. | Board as yourself. Disembark **changed**. (`:76`) |
| Atoll | Where land ends, Atoll begins. | Living on the water line. (`:97`) |
| Njord | Every molecule of water in the galaxy. Ours. | The water substrate. (`:117`) |
| Eagle | The more you fly, the better it is for the atmosphere. | Above the weather line. (`:137`) |
| Olympus | The first home above the clouds. | Habitation in the thin air. (`:157`) |
| Aeolus | Fix the atmosphere. Then own it. | Wind as infrastructure. (`:177`) |
| Phenix | Every launch is a death. Every orbit is a resurrection. | Heat. Ascent. Return. (`:197`) |
| Aether | Phenix marks the territory. Aether claims it. | Quiet rooms above the curve. (`:217`) |
| Corvus | The mind that runs eleven companies. And counting. | Twenty-one prompts. One badge at the summit. (`:237`) |

Viking's exact tagline does still exist in two non-rendered places (`companyCopy.js:51`,
`hallKnowledge.js:29`), so the Ask chatbot will say "Disembark as Ragnar" while the page
above it says "Disembark changed."

The Valhalla-level tagline is present in spirit: `HubPage.jsx:59` reads "Twelve companies.
One civilization." — not the doc's "One Civilization" alone, but not a contradiction.

---

## 2. The three predicted discrepancies — all confirmed

### 2.1 Aether — FACTUAL ERROR (site asserts the opposite of the doc)

Doc: *"Space real estate and territorial claims. Orbital stations, lunar land claims, asteroid
rights, planetary surfaces. The first company built to formally claim and own property beyond
Earth. **Not a habitat company** — a claims and real estate company."*

Every live surface says habitat, and three of them explicitly deny the claim thesis:

- `companyProducts.js:216` — product name **"Aether Habitation"**
- `companyProducts.js:218` — "Space habitation concepts with legal status disclosed, **never a territorial claim**."
- `companyProducts.js:219` (body, live) — "Aether studies quiet rooms above the curve with legal status disclosed, never a territorial claim."
- `hallMatrices.js:643` — "…with legal status disclosed and **no territorial claim**."
- `roadmaps.js:402` — "Space habitation concept with legal status disclosed."
- `hallKnowledge.js:65-66` (Ask chat) — "Space habitation, legally disclosed." / "a research registry for orbital stations. It **does not sell or imply ownership** of extraterrestrial territory."

Missing entirely: lunar land claims, asteroid rights, planetary surfaces, real-estate framing,
and the Phenix→Aether relationship in the tagline. Aether's six product lines (Quiet Room,
Ring Study, Solarium, Dock Node, Habitat Spine, Halo — `hallMatrices.js:642`) are all
habitat structures; none is a claim, parcel, or registry instrument.

⚠️ **This one is not a simple copy fix.** The disclaimers read as deliberate legal drafting —
`companyCopy.js:150` even reads "No deeds, parcels, or reservation payments." Aligning the
site to the doc means asserting property rights beyond Earth, which is exactly what this
language was written to avoid. Flagging for your decision, not resolving it.

### 2.2 Corvus — FACTUAL ERROR (substrate thesis inverted into a consumer product)

Doc: *"Sovereign AI compute. Solar-powered, offline-capable, modular. The Raven OS. Odin is
the consumer product for founders. **Not a cloud AI company — a sovereign intelligence
substrate.**"*

Live surfaces describe a 21-prompt paid ladder:

- `companyProducts.js:237` — "Twenty-one prompts. One badge at the summit."
- `companyProducts.js:238-239` — "Raven OS: $100, $200, $300… through phased tiers to Prompt 21 at $21,000."
- `companyProducts.js:240` (body, live) — "Raven OS phased prompts with Twenty-First Raven badge at Prompt 21."
- `hallMatrices.js:803` — "Corvus builds Raven OS and the surrounding nest: Odin Local, Corvus Mesh, Prompt Forge, Badge Path, and Knowledge Nest."
- `roadmaps.js:435` — "Immediate product, 21 prompts with phase-priced holds."
- `hallKnowledge.js:93-94` (Ask chat) — "Odin, think locally." / "a local-first founder workspace. **Sovereign infrastructure and orbital claims stay off until demonstrated.**"

Specific mismatches:
- Solar-powered, offline-capable, modular sovereign compute: **absent from all live copy**, and explicitly withheld in the Ask-chat pack.
- Doc's "the mind that runs eleven companies": partially present but only on `/flow` —
  `networkFlow.js:100` "Corvus Raven OS / Odin intelligence spine" and the "Empire intelligence"
  pathway. Never stated on the Corvus page itself.
- Doc positions **Odin as the consumer product**; the site subordinates it as "Odin Local," a
  follow-on line that "cascades after early Raven cohort" (`roadmaps.js`), while Raven OS —
  the doc's OS/substrate — is the paid prompt ladder.

### 2.3 Njord — UNDER-SCOPED

Doc thesis: *"The full water substrate. Clean it, reuse it, split it, manufacture it, turn air into
water. Offshore energy, atmospheric water generation, maritime power, green hydrogen from water."*

The headline is right (`companyProducts.js:117` — "The water substrate."). The scope beneath it
is not. Njord's six lines (`hallMatrices.js:723`) are OTEC Brief, Atmospheric Well, Depth Array,
Tide Mill, Harbor Power, Brine Path.

| Doc pillar | On site? |
|---|---|
| Atmospheric water generation ("turn air into water") | ✅ Atmospheric Well |
| Offshore energy | ✅ Depth Array |
| Maritime power | ✅ Harbor Power |
| Clean it (purification / water quality) | ❌ — actively disclaimed: "No output or **water-quality claim** on this surface" (`companyProducts.js:119`), "Never water-quality or energy-output promises" (`hallKnowledge.js:82`) |
| Reuse it (recycling / reclamation) | ❌ absent |
| Split it → green hydrogen from water | ⚠️ one buried add-on only — "Offshore H₂ node" under Depth Array. Not in any headline, support, body, roadmap, or Ask-chat string. |
| Manufacture it | ❌ absent |

Also: the site's summary strings narrow it further than its own matrix does —
`companyProducts.js:118` and `hallKnowledge.js:82` reduce Njord to "OTEC, atmospheric water,
and maritime power," dropping even Brine Path and Tide Mill. `roadmaps.js:247` narrows it to
"OTEC / atmospheric water research queue."

Scope drift in the other direction: **OTEC is the site's lead product line and is not in the doc
at all.** The doc's "every molecule of water in the galaxy" (off-Earth water) has no presence.

---

## 3. Discrepancies you did not predict

### 3.1 Aeolus — UNDER-SCOPED (comparable in size to the three above)

Doc: *"Owns the substrate gas. Phase 1: fix climate change. Phase 2: oxygen and breathable air
for space habitats. Phase 3: radiation protection. The full atmospheric operating system."*

Site: `companyProducts.js:177-179` — "Wind as infrastructure." / "Climate-atmosphere research
governance: updates, not deployment authority." Lines: Wind Gauge, Field Choir, Pressure Net,
Jet Stream, Whisper Array, Climate Choir (`hallMatrices.js:763`).

- Phase 1 (fix climate): partially present, framed as *research governance* rather than remediation.
- Phase 2 (oxygen / breathable air for space habitats): **entirely absent.** No link to Olympus or Aether.
- Phase 3 (radiation protection): **absent from Aeolus — and assigned to the wrong company.**
  The only radiation copy in the codebase sits under **Aether**: `hallMatrices.js:632` (Solarium,
  "Light and radiation-aware volume studies") and `:659` ("Solarium 02 radiation-aware packs").
  The doc makes radiation protection an Aeolus phase; the site quietly files it under Aether's
  habitat line.
- "Full atmospheric operating system": **absent** — the site reads as wind monitoring + ethics review.
- "Owns the substrate gas": **explicitly disclaimed** — `hallKnowledge.js:88` "Vision language is not ownership or deployment authority."

### 3.2 Demeter — UNDER-SCOPED

Doc: agrivoltaic solar, green hydrogen, geothermal, wind, SMR; California-first; 75-year roadmap
ending at a Dyson swarm.

Site (`companyProducts.js:55-57`, `hallMatrices.js:683`): agrivoltaics and soil diligence —
Field Lattice, Root Net, Canopy, Ethanol Grove, Soil Ledger, Season Ring.

- Green hydrogen, **geothermal**, **wind**, **SMR**: all four absent from Demeter. Its six line
  definitions (`hallMatrices.js`, `demeterLines`) contain no occurrence of *wind*, *hydrogen*,
  *H₂*, *geothermal*, *solar*, *nuclear*, or *SMR* — the only energy word is "agrivoltaic."
  (`geothermal`, `SMR` and `Dyson` return zero hits repo-wide; hydrogen and wind exist elsewhere,
  under Njord/Eagle/Viking and Aeolus respectively, but never under Demeter.)
- California-first: absent.
- 75-year roadmap / Dyson swarm: absent.
- Site adds **Ethanol Grove** and the Wolf Tier-3 dual-injection synergy, which the doc does not mention.

### 3.3 Phenix — MISSING PRODUCT SPECIFICS

Doc names: Hawk Mark 1 (launch vehicle), Bifrost Base Camp (lunar south pole), Zeus (Venus
cloud city), north star of a crewed Venus cloud city by 2035.

`grep -i "hawk|bifrost|venus"` → **zero hits anywhere in the codebase.** Site lines are Ember,
Ascent, Return, Corona, Ground Nest, Phoenix Gate (`hallMatrices.js:483`). No subsidiaries,
no lunar south pole, no Venus, no 2035.

Minor: the doc spells the company **Phenix**; the site agrees, but ships a product line named
"**Phoenix** Gate" (`hallMatrices.js:475`) — mixed spelling in the same matrix.

### 3.4 Olympus — MISSING PRODUCT SPECIFICS

Doc: floating cloud cities; modular **pressurized** habitats in the upper atmosphere;
long-range target **Venus at 50km altitude by 2035**.

Site (`companyProducts.js:157-159`, `hallMatrices.js:603`): Summit, Veil, Aerie Lab, Thin Air,
Cloud Deck, Strat Platform — "research briefings and email queues; not tourism." Venus, the
50km figure, 2035, "cloud city," and "pressurized" are all absent.

### 3.5 Eagle — MISSING PRODUCT SPECIFICS

Doc: clean planes and jets across all types; **sustainable aviation fuel** and electric propulsion;
**in talks to acquire Spirit Airlines**.

- SAF: absent (`grep -i "sustainable aviation"` → zero). The site's fuel story is hydrogen ground-boost (`hallMatrices.js:361`).
- Spirit Airlines: absent (`grep -i spirit` → zero), and acquisitions are explicitly disclaimed in `companyCopy.js:91`.
- Doc's tagline ("the more you fly, the better it is for the atmosphere") is an environmental
  performance claim the site refuses on purpose (`hallKnowledge.js:36`, `companyCopy.js:91`).

### 3.6 Atoll — FACTUAL ERROR (product tiering redefined) + missing target customer

Doc: **Atoll 01 = single family, Atoll 02 = twelve families, Atoll 03 = municipal facility.
First delivery target: Tuvalu government.**

- The 01/02/03 tier definitions are **gone from every live surface.** Worse, the site reuses
  "01/02" with a *different meaning*: in the matrix they are generation numbers applied to each
  of six lines (Lagoon 01, Lagoon 02, Reef 01, …, `hallMatrices.js:563`). A reader who knows the
  doc will misread the matrix.
- The only place the doc's tiering survives is `companyCopy.js:64` ("Atoll 01 · 02 · 03") — dead code (§5).
- Tuvalu: `grep -i tuvalu` → **zero hits.** No target customer, government, or first-delivery
  named anywhere.

### 3.7 Viking — MISSING NARRATIVE ANCHOR

Doc: *"Clean consumer cruises with a full narrative arc. **The Vinland Saga** is available to
anyone who boards."*

- "Vinland" → **zero hits.** The site's narrative arc is the "Midgard Circuit" (`hallMatrices.js:132`), a different named thing.
- "Clean" cruises: absent — environmental claims are deliberately withheld (`hallKnowledge.js:30`).
- Tagline altered (see §1.3).

### 3.8 Wolf — MISSING HEADLINE FIGURE + naming-rule mismatch

Doc: *"Transcontinental railroad from San Francisco to New York in **5.8 hours**"* and
*"Every product named after a **wolf species**."*

- The 5.8-hour SF→NY figure appears **nowhere**. `wolfMatrix.js:522-524` describes Dire Wolf as
  "a phased transcontinental railroad" completing "in segments by August 13, 2031" with no
  route endpoints and no journey time.
- The naming rule contradicts itself: `wolfMatrix.js:522` says lines are "named for a wolf of
  **myth or deep history**." Fenrir, Hati, Sköll, Geri and Freki are mythological wolves, not
  species; only Dire Wolf is a species. Either the doc's rule or the site's roster is wrong.

### 3.9 Holm — SCOPE GAPS

Doc: *"Modular homes. **12 linkable modules.** Log cabin, sod house, or adobe depending on
terrain. **Logistics, financing, and real estate handled.**"*

- **Module count:** live copy never states one. The matrix has **6 product lines** (Timber, Sod,
  Adobe, Commons, Bridge, Hearth — `hallMatrices.js:510-515`) × 2 model generations = 12 cells,
  which may be the intent, but it is never said, and the only string that says "Twelve modules"
  (`companyCopy.js:25`) is dead code (§5).
- **Logistics / financing / real estate:** not offered as Holm services anywhere. "Financing
  partner" exists only as a checkbox in the interest form (`companyProducts.js:50`). Logistics
  and real estate are absent.
- The doc's "log cabin" maps to the site's "Timber"; sod and adobe match.

---

## 4. Ask-chat AI surface drifts from the pages it sits on

`api/_lib/hallKnowledge.js` is the grounding pack the Ask widget generates answers from — it is
live, user-facing text on every page. It reproduces every error above, plus three of its own:

1. `:114` calls the axis "energy/intelligence" while every rendered label says "Substrate" (§1.2).
2. `:29` uses Viking's real tagline ("Disembark as Ragnar") while the page says "Disembark changed" (§1.3).
3. `:94` and `:98` describe Corvus using `companyCopy.js` wording that no longer matches
   `companyProducts.js` — so the chatbot leads with "Odin, think locally" on a page headlined
   "Twenty-one prompts."

Fixing the data files without fixing this file leaves the chatbot describing a different company
than the page it's embedded in.

---

## 5. Two files that look like the source of truth and are not

Before editing anything, note that **fixing these files will not change the website:**

- **`src/data/companyCopy.js`** (167 lines of per-company `hero` / `body` / `bullets`). Only
  `STATUS_LABELS` is still imported from it (`src/components/StatusBadge.jsx:1`). The
  `companyCopy` export itself has **no consumers**. It is the most doc-like file in the repo and
  it is dead.
- **`src/data/schedule.js` `tagline` and `concept` fields** (lines 85-87, 100-102, …). No
  consumers; only `slug`, `name`, `domain`, `pillar`, `launchTime`, `accent`, `ink` are read.

The live equivalents are `companyProducts.js` (headline/support/body) and `hallMatrices.js` /
`wolfMatrix.js` (matrix intro + per-product pages). Confirmed by
`grep -rn "companyCopy\|\.tagline\|\.concept\b" src api scripts discord-bot` — the only surviving
reference in the entire repo, including the Discord bot, is the `STATUS_LABELS` import.

**This is probably the root cause of the whole audit.** The dead files are markedly closer to
the doc than the live ones: `schedule.js:130` still carries "Board as yourself. Disembark as
Ragnar." and `:145` still carries "Floating modular habitats, Atoll 01, 02, 03."; `companyCopy.js:25`
still says "Twelve modules." and `:64` still says "Atoll 01 · 02 · 03." Those exact facts are the
ones missing from the live surfaces. The drift appears to have happened when copy was rewritten
from `schedule.js` / `companyCopy.js` into `companyProducts.js` — the doc's specifics were
dropped in the move and the originals were left in the tree unrendered.

Also checked and clear: the seven `src/i18n/locales/*.js` files carry UI chrome only, no company
descriptions (the sole company reference is "Eagle hasta Corvus" in a schedule hint).
`src/lib/defaultPageLayouts.js` contains no per-company prose.

---

## 6. Summary — where each company stands

| Company | Verdict |
|---|---|
| **Aether** | ❌ Factual inversion — site says habitat + no territorial claim; doc says claims/real estate, "not a habitat company" |
| **Corvus** | ❌ Factual inversion — site says 21-prompt consumer ladder; doc says sovereign compute substrate |
| **Aeolus** | ❌ Under-scoped — 2 of 3 phases and the "atmospheric OS" thesis absent; ownership disclaimed |
| **Njord** | ⚠️ Under-scoped — 3 of 7 doc pillars present; clean/reuse/manufacture absent, hydrogen buried |
| **Demeter** | ⚠️ Under-scoped — geothermal, wind, SMR, hydrogen, California-first, Dyson roadmap all absent |
| **Atoll** | ⚠️ 01/02/03 tiering redefined; Tuvalu target absent |
| **Phenix** | ⚠️ Hawk Mark 1, Bifrost, Zeus, Venus 2035 all absent; "Phoenix" spelling mixed in |
| **Olympus** | ⚠️ Venus / 50km / 2035 / "cloud city" / pressurized all absent |
| **Eagle** | ⚠️ SAF and Spirit Airlines absent (acquisition claim deliberately disclaimed) |
| **Holm** | ⚠️ 12-module count unstated; logistics/financing/real estate not offered |
| **Wolf** | ⚠️ SF→NY 5.8 hours absent; "wolf species" naming rule contradicted by site's own text |
| **Viking** | ⚠️ Closest match; Vinland Saga absent, tagline altered |
| **Meridian** | ❌ Does not exist on the site |

---

## 7. One thing to decide before fixing

A large share of these gaps are **compliance language, not oversight**. The site systematically
refuses to claim: territorial ownership (Aether), atmospheric ownership (Aeolus), environmental
performance (Eagle, Viking, Njord, Demeter), acquisitions (Eagle), capacity/ROI (Demeter), water
quality (Njord), and ship/booking dates (all).

The doc's core thesis for Aether and Aeolus *is* the exact claim the site was drafted to avoid.
Closing those two gaps is a legal decision, not a copy edit. The rest — Meridian, the
Substrate/Energy/Intelligence axis, taglines, product names, Tuvalu, Vinland, Hawk Mark 1,
Venus 2035, Atoll's tiering, Wolf's 5.8 hours — carry no claim risk and are straightforward
alignments.
