# Product-in-environment images — fastest path

Goal: every matrix cell that should show a still uses  
`public/images/products/{company}/{slug}.jpg`  
(e.g. `wolf/hati-01.jpg`, `viking/knarr-01.jpg`).

Matrix + detail pages pick up files automatically via the manifest  
(`npm run sync:product-images` after you drop new JPGs).

---

## Fastest workflow (tonight)

1. **Pick one hero plate per hall** from `public/images/sites/` or `public/images/products/_plates/`.  
   Reuse the same plate for that hall’s whole batch so lighting stays coherent.

2. **Open Gemini image edit** (Nano Banana / Gemini 2.5 Flash Image) — ranked #1 for plate lock.  
   Fallback: ChatGPT image edit → Flux Kontext/Fill → Midjourney (weakest plate fidelity).

3. **Upload the plate** + paste the prompt skeleton below with the vehicle/module noun swapped.  
   One plate, many products: keep the background instruction identical; only change the subject.

4. **Batch by vehicle type**, not by row:  
   e.g. all Wolf wheeled machines on the snow plate, then rotor/rail on a second plate.  
   Save as `{slug}.jpg` (lowercase, hyphenated, matches cell `id`).

5. **Drop files** into `public/images/products/{company}/`.  
   Run:
   ```bash
   npm run sync:product-images
   ```
   Reload the site — cells light up without hand-editing matrix JS.

6. **Priority order** (visual impact first):  
   Wolf 01 row (all 6 lines) → other halls’ **01 lead cell** → Wolf 02/03 → remaining 02 rows → vision cells last.

7. **Optional polish**: regenerate Fenrir / seeds with Gemini on the real plates for final production (seed assets from GenerateImage are stand-ins).

---

## Prompt skeleton (paste with plate attached)

```
Photoreal [PRODUCT NOUN] (matte charcoal / dark iron, no logos, no brand badges)
standing / resting in THIS exact photograph. Preserve the original landscape,
architecture, water/sky texture, and camera grain. Match the plate’s light and
cast a soft, physically consistent shadow. Ground contact must feel real
(tires/hull/feet slightly sunk or wet where appropriate). No people, no UI,
no purple color grade, no CGI glow, no neon. Documentary product photo,
three-quarter view, sharp subject, natural depth of field.
```

Swap `[PRODUCT NOUN]` from the checklist below. Keep materials quiet: charcoal, bronze, pale timber, sea-glass, brushed silver — never purple or candy gradients.

---

## Naming + folders

| Path | Purpose |
|------|---------|
| `public/images/products/{company}/{slug}.jpg` | Production still for cell `id` |
| `public/images/products/_plates/` | Shared environment plates (not shown in UI) |
| `public/images/sites/*.jpg` | Hall atmosphere photos → also usable as plates |
| `src/data/productImageManifest.js` | Auto-generated “which files exist” map |

Company folder names = company ids:  
`wolf`, `viking`, `eagle`, `phenix`, `holm`, `atoll`, `olympus`, `aether`, `demeter`, `njord`, `aeolus`, `corvus`.

---

## Recommended plate per hall

| Hall | Primary plate | Alt plate |
|------|---------------|-----------|
| wolf | `_plates/wolf-snow-alt.jpg` or `sites/wolf-ref.jpg` | `_plates/luke-frost-meadow-bridge.jpg` |
| viking | `sites/viking-fjord.jpg` | `sites/viking-shore.jpg`, `viking-dawn.jpg` |
| eagle | `sites/air-clouds.jpg` | `sites/aeolus-wind.jpg` |
| phenix | `sites/aether-orbit.jpg` | `sites/city-bridge.jpg` |
| holm | `sites/holm-cabin.jpg` | `sites/holm-meadow.jpg`, `holm-fjord-house.jpg` |
| atoll | `sites/atoll-lagoon.jpg` | `sites/water-orcas.jpg` |
| olympus | `sites/air-clouds.jpg` | `sites/aeolus-wind.jpg` |
| aether | `sites/aether-orbit.jpg` | `sites/air-clouds.jpg` |
| demeter | `sites/demeter-field.jpg` | `sites/demeter-solar.jpg` |
| njord | `sites/njord-ocean.jpg` | `sites/water-orcas.jpg` |
| aeolus | `sites/aeolus-wind.jpg` | `sites/air-clouds.jpg` |
| corvus | `sites/city-canyon.jpg` | `sites/city-towers.jpg`, `city-plaza.jpg` |

---

## Batch checklist — all 12 halls

Mark status: `[ ]` todo · `[~]` seed/stand-in · `[x]` Gemini/GPT plate-composite final.

### Wolf (land · movement) — plate: snow / wolf-ref / Luke bridge

| Slug | Subject noun | Status |
|------|--------------|--------|
| fenrir-01 | electric adventure motorcycle | [~] seed |
| fenrir-02 | adventure motorcycle (gen 2) | [~] seed |
| fenrir-03 | adventure motorcycle (gen 3) | [~] seed |
| hati-01 | tri-fuel utility ATV | [~] seed |
| hati-02 | work ATV fleet variant | [~] seed |
| hati-03 | ATV with soft driver-assist cues | [~] seed |
| skoll-01 | compact electric/hydrogen hatchback | [~] seed |
| skoll-02 | compact car longer-range pack | [~] seed |
| skoll-03 | compact shared-fleet car | [~] seed |
| geri-01 | electric utility pickup truck | [~] seed |
| geri-02 | heavier utility truck | [~] seed |
| geri-03 | rail-yard hybrid truck | [~] seed |
| freki-01 | compact rescue helicopter | [~] seed |
| freki-02 | rescue heli night/ice kit | [~] seed |
| freki-03 | rescue heli corridor basing | [~] seed |
| dire-wolf-01 | modern passenger/freight train (western corridor) | [~] seed |
| dire-wolf-02 | high-speed train on plains | [~] seed |
| dire-wolf-03 | train approaching eastern terminal | [~] seed |

### Viking (water · movement) — plate: fjord / shore

| Slug | Subject noun | Status |
|------|--------------|--------|
| knarr-01 | electric coastal workboat | [~] seed |
| knarr-02 | coastal craft follow-on | |
| dreki-01 | expedition longship (modern quiet hull) | [~] seed |
| dreki-02 | expedition hull follow-on | |
| skidbladnir-01 | modular ferry | |
| skidbladnir-02 | winter modular ferry | |
| harbor-ring-01 | harbor charging / bunkering pier | |
| harbor-ring-02 | expanded harbor logistics | |
| saga-cabin-01 | cold-country voyage cabin | [~] seed |
| saga-cabin-02 | group berth cabin | |
| midgard-01 | multi-leg coastal circuit montage (single craft hero) | |
| midgard-02 | secondary circuit craft | |

### Eagle (air · movement) — plate: cloud deck

| Slug | Subject noun | Status |
|------|--------------|--------|
| talon-01 | STOL utility aircraft | [~] seed |
| talon-02 | cold-strip STOL aircraft | |
| thermal-01 | research glider | |
| thermal-02 | night research glider | |
| aerie-01 | regional access turboprop | |
| aerie-02 | regional aircraft follow-on | |
| skyway-01 | abstract air-corridor beacon (subtle ground station) | |
| skyway-02 | multi-region corridor station | |
| nest-01 | aviation ground support / charging cart | |
| nest-02 | hydrogen ground staging | |
| apex-01 | long-range concept aircraft | |
| apex-02 | long-range follow-on | |

### Phenix (space · movement) — plate: orbit / pad mood

| Slug | Subject noun | Status |
|------|--------------|--------|
| ember-01 | small suborbital vehicle | [~] seed |
| ember-02 | payload bay study vehicle | |
| ascent-01 | ascent stack architecture | |
| ascent-02 | ascent options | |
| return-01 | recovery vehicle | |
| return-02 | recovery contingency craft | |
| corona-01 | heat-shield test article | |
| corona-02 | advanced thermal shield | |
| ground-nest-01 | launch-pad ground ops module | |
| ground-nest-02 | pad energy node | |
| phoenix-gate-01 | mission gate facility | |
| phoenix-gate-02 | multi-partner gate | |

### Holm (land · habitation) — plate: cabin / meadow

| Slug | Subject noun | Status |
|------|--------------|--------|
| timber-01 | timber modular dwelling | [~] seed |
| timber-02 | family timber volume | |
| sod-01 | sod-inspired earth-backed module | [~] seed |
| sod-02 | linked sod pair | |
| adobe-01 | adobe-inspired desert module | [~] seed |
| adobe-02 | adobe courtyard link | |
| commons-01 | shared courtyard utility ring | |
| commons-02 | multi-household commons | |
| bridge-01 | short link module between homes | |
| bridge-02 | longer link hall | |
| hearth-01 | central hearth gather volume | |
| hearth-02 | workshop hearth | |

### Atoll (water · habitation) — plate: lagoon

| Slug | Subject noun | Status |
|------|--------------|--------|
| lagoon-01 | floating calm-water habitat | [~] seed |
| lagoon-02 | linked lagoon pair | |
| reef-01 | edge floating habitat | |
| reef-02 | second-ring habitat | |
| tide-01 | tide-aware platform | |
| tide-02 | tide energy assist platform | |
| dock-01 | harbor dock ring | |
| dock-02 | multi-berth dock | |
| ring-01 | floating village ring | |
| ring-02 | village-scale ring | |
| deep-01 | deep-water mooring buoy system | |
| deep-02 | deep mooring follow-on | |

### Olympus (air · habitation) — plate: high clouds

| Slug | Subject noun | Status |
|------|--------------|--------|
| summit-01 | thin-air research platform | [~] seed |
| summit-02 | longer-duration summit | |
| veil-01 | cloud-veil research lab | |
| veil-02 | multi-instrument veil lab | |
| aerie-lab-01 | high-altitude lab module | |
| aerie-lab-02 | aerie lab follow-on | |
| thin-air-01 | pressure / life-support skid | |
| thin-air-02 | advanced life support | |
| cloud-deck-01 | structural cloud deck | |
| cloud-deck-02 | extended deck | |
| strat-01 | stratospheric platform (vision) | |
| strat-02 | strat follow-on | |

### Aether (space · habitation) — plate: Earth from orbit

| Slug | Subject noun | Status |
|------|--------------|--------|
| quiet-room-01 | orbital habitation cell | [~] seed |
| quiet-room-02 | multi-cell cluster | |
| ring-study-01 | orbital ring segment | |
| ring-study-02 | extended ring | |
| solarium-01 | orbital light volume | |
| solarium-02 | radiation-aware solarium | |
| dock-node-01 | orbital docking node | |
| dock-node-02 | multi-craft dock | |
| spine-01 | habitat structural spine | |
| spine-02 | long spine | |
| halo-01 | large halo architecture (vision) | |
| halo-02 | halo follow-on | |

### Demeter (land · substrate) — plate: wheat / solar field

| Slug | Subject noun | Status |
|------|--------------|--------|
| field-01 | agrivoltaic lattice over crops | [~] seed |
| field-02 | multi-parcel lattice | |
| root-01 | soil sensor network stakes | |
| root-02 | regional sensor mesh | |
| canopy-01 | crop-shade canopy array | |
| canopy-02 | vision canopy | |
| ethanol-01 | ethanol feedstock grove + still study | [~] seed |
| ethanol-02 | regional still | |
| ledger-01 | land diligence field station (subtle) | |
| ledger-02 | partner ledger kiosk | |
| season-01 | seasonal field planning markers | |
| season-02 | multi-climate season | |

### Njord (water · substrate) — plate: deep ocean

| Slug | Subject noun | Status |
|------|--------------|--------|
| otec-01 | OTEC research buoy / plant concept | [~] seed |
| otec-02 | OTEC site cohort | |
| atmo-01 | atmospheric water collector | |
| atmo-02 | arid-site collector | |
| depth-01 | offshore energy lattice | |
| depth-02 | vision offshore lattice | |
| tide-mill-01 | modern tidal mill | |
| tide-mill-02 | tidal vision | |
| harbor-power-01 | harbor energy pier node | [~] seed |
| harbor-power-02 | multi-pier harbor power | |
| brine-01 | brine research skid | |
| brine-02 | brine follow-on | |

### Aeolus (air · substrate) — plate: turbines / wind sky

| Slug | Subject noun | Status |
|------|--------------|--------|
| gauge-01 | wind governance instrument mast | [~] seed |
| gauge-02 | multi-jurisdiction gauge | |
| choir-01 | multi-region sensing array | |
| choir-02 | denser sensing mesh | |
| pressure-01 | pressure mesh instruments | |
| pressure-02 | pressure vision | |
| jet-01 | high-altitude research probe | |
| jet-02 | jet vision | |
| whisper-01 | low-impact quiet sensors | |
| whisper-02 | expanded whisper array | |
| climate-01 | program climate choir (abstract instruments) | |
| climate-02 | climate follow-on | |

### Corvus (space · substrate / intelligence) — plate: city canyon

| Slug | Subject noun | Status |
|------|--------------|--------|
| raven-os-01 | quiet founder desk / prompt workstation (no UI chrome) | [~] seed |
| raven-os-02 | cohort workspace | |
| odin-local-01 | local machine workspace | |
| odin-local-02 | team local sync desk | |
| mesh-01 | abstract hall-mesh node hardware | |
| mesh-02 | mesh vision | |
| forge-01 | prompt forge toolbench | |
| forge-02 | review workflow desk | |
| badge-path-01 | subtle raven badge object on desk | |
| badge-path-02 | community ritual object | |
| knowledge-01 | knowledge nest library shelf / nest | |
| knowledge-02 | per-hall knowledge packs | |

---

## Tool ranking (plate + product insert)

1. **Gemini image edit** — best keep-background lock  
2. **GPT-image edit** — strong lighting match  
3. **Flux** (Kontext / Fill / Redux) — photoreal; good with cutouts  
4. **Midjourney** — beautiful subjects, drifts off plate unless locked  

In-repo seed generation (Cursor GenerateImage) is for scaffolding only — replace with Gemini/GPT plate edits for finals.

---

## Scripts

```bash
# After dropping JPGs — refresh manifest + print remaining 01-priority gaps
npm run sync:product-images

# Print markdown table of missing slots only
npm run sync:product-images -- --missing

# Regenerated snapshot of gaps (also kept in-repo):
#   docs/product-images-remaining.md
```

Live fill count is whatever `productImageManifest.js` reports after sync (seed stills count as filled until Gemini/GPT plate finals replace them).
