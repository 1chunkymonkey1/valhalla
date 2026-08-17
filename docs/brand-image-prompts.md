# Valhalla Brand Image Prompts

## Image export sizes (mosaic geometry)

Mosaic is **4 columns × 3 rows**, tiles at **3:2** (matches an 820×558 crop).

| Use | Size | Notes |
|---|---|---|
| **Master export (recommended)** | **1200 × 800** | Clean 3:2; sharp on retina when scaled down |
| **Your current crop** | **820 × 558** | Perfect working size; matches tile aspect |
| **Retina master** | **1640 × 1116** | Exact 2× of 820×558 |
| **Displayed tile (approx.)** | ~240 × 160 @ desktop | Inside `max-w-5xl` grid with gaps |

**Rule of thumb:** export every hall photo at **1200×800 (3:2)** — or keep **820×558** if that’s your pipeline. Don’t use square (1:1) for these tiles.

---

Copy each block into your generator. Keep the **Shared negative** for every run.

## Best generator for this job

**Use Midjourney (v6 / v7)** for the hall stills.

| Tool | Verdict |
|---|---|
| **Midjourney** | **Best match.** Strongest cinematic worlds, material coherence, and “monument in a place” look. Use `--stylize 50–120`, `--style raw`, and one shared `--sref` once you have a hero frame you like. |
| **Flux 1.1 Pro** (Fal / Freepik / etc.) | Best runner-up for photoreal textures; slightly less art-directed than MJ. Great if you want less “illustration.” |
| **ChatGPT / DALL·E** | Convenient, but usually the most obvious AI look for branded deities. Skip for finals. |
| **Ideogram** | Strong if you need on-image text later; weaker for sacred 3D monuments. |
| **Unreal / Blender (real 3D)** | Highest “not AI” ceiling if budget allows — prompts below still work as art briefs for a 3D artist. |

**Workflow:** Generate Wolf first → lock that as style reference → run the other 11 with the same aspect, lighting language, and sref so the mosaic feels like one civilization, not twelve random models.

**Specs:** `1:1` for mosaic tiles · optional `16:9` or `3:4` hero crops later · export PNG · avoid watermarks.

---

## Shared negative (append every time)

```text
no text, no letters, no logo, no watermark, no UI, no collage, no split panel,
no plastic skin, no waxy face, no oversharpened edges, no HDR glow spam,
no neon cyberpunk, no anime, no cartoon, no stock-photo smile,
no busy particle soup, no illegible machinery, no extra limbs
```

## Shared positive suffix (append every time)

```text
single subject centered in deep architectural space, photographed as if peering
through a quiet portal, museum-grade lighting, believable materials,
subtle film grain, restrained color grade, square composition, no text
```

---

## 01 · Wolf · Land × Movement

```text
Monumental wolf deity sculpture of dark basalt and brushed steel standing in a
narrow Sierra granite canyon at dusk, faint electric adventure-motorcycle silhouette
integrated into the stone plinth, single warm volumetric shaft of light from above,
rugged concrete and iron textures, antiquity fused with industrial precision,
cinematic still, --ar 1:1 --style raw --stylize 80
```

## 02 · Holm · Land × Habitation

```text
Quiet hearth-guardian figure of carved oak, adobe, and pale timber watching over
linked modular cabin modules in a misted forest clearing, morning softbox light,
architectural visualization mood, tactile wood grain and sod roof details,
habitation shrine not fantasy castle, calm and grounded, --ar 1:1 --style raw --stylize 70
```

## 03 · Demeter · Land × Energy

```text
Bronze harvest deity among California agrivoltaic fields, solar arrays above
low crops, late-afternoon amber light, sacred agriculture meeting clean energy
infrastructure, documentary-cinematic frame, earth pigments only, --ar 1:1 --style raw --stylize 75
```

## 04 · Viking · Water × Movement

```text
Towering sea-voyage guardian of weathered bronze and sea-glass aboard a sleek
clean longship on a dark fjord, storm-break light on the horizon, mythic narrative
cruise atmosphere without fantasy excess, wet metal and rope texture, --ar 1:1 --style raw --stylize 85
```

## 05 · Atoll · Water × Habitation

```text
Floating modular habitat ring of white composite decks and warm timber rails on
open tropical water, serene coral-stone water guardian at the center plaza,
soft overcast daylight, luxury research outpost, calm horizon, --ar 1:1 --style raw --stylize 70
```

## 06 · Njord · Water × Energy

```text
Stone-and-kelp bronze sea deity beside a restrained OTEC ocean platform and
atmospheric water condensers, deep blue mist, maritime engineering shrine,
scientific not magical, cold natural light, --ar 1:1 --style raw --stylize 75
```

## 07 · Eagle · Air × Movement

```text
Monumental eagle of brushed titanium and white feather-metal soaring above a
stratospheric cloud deck, distant abstract clean aircraft shapes only as silhouettes,
cold blue air, aviation research shrine, no airline markings, --ar 1:1 --style raw --stylize 80
```

## 08 · Olympus · Air × Habitation

```text
Upper-atmosphere modular cloud city of translucent habitats and pale stone decks,
quiet sky figure among the platforms, soft violet-white light, concept research
visualization, weightless calm, --ar 1:1 --style raw --stylize 85
```

## 09 · Aeolus · Air × Energy

```text
Wind deity formed from translucent air currents and pale metal instruments inside
a vast sky chamber, climate-research apparatus floating with restraint, teal-silver
grade, governance-of-atmosphere mood not disaster spectacle, --ar 1:1 --style raw --stylize 75
```

## 10 · Phénix · Space × Movement

```text
Phoenix of copper embers and dark alloy rising beside a conceptual launch vehicle
on a remote pad under starfield, mission-concept shrine, no operational claims,
ember light only, --ar 1:1 --style raw --stylize 90
```

## 11 · Aether · Space × Habitation

```text
Translucent glass-and-starlight aether spirit near quiet orbital habitat rings,
indigo void, contemplative space-habitation research image, no maps no deeds no
territory graphics, soft silver rim light, --ar 1:1 --style raw --stylize 80
```

## 12 · Corvus · Space × Energy (Odin)

```text
Matte-black raven deity of obsidian metal perched above a local-first founder desk
with paper documents and quiet glowing tablets, intimate sanctum, high-tech but
human-scale, single lamp light, no neon city, --ar 1:1 --style raw --stylize 70
```

---

## Consistency tips

1. Generate **Wolf** until one frame feels right.
2. Use that image as Midjourney **style reference** (`--sref`) for the rest.
3. Keep **camera language** identical: portal view, centered monument, deep space behind.
4. Prefer **fewer adjectives**; more material + place + light.
5. If it still looks “AI,” lower stylize (`--stylize 40–60`) and add: `shot on 50mm, f/2.8, practical lighting only`.
