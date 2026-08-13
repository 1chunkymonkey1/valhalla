# Valhalla Mosaic — Handoff Brief for Claude

Copy everything below this line into a new Claude chat.

---

## Who you are / what to do

You are implementing the **Valhalla Multi-Launch Hub** mosaic UI (React + Vite + Tailwind). The previous agent failed to make the column atmospheres feel alive and distinctive. Do **not** make subtle CSS that looks the same as a flat border. Make effects **obvious at a glance** in a screenshot.

Repo: `valhalla-multi-launch-hub`  
Stack: React, Vite, Tailwind v4, React Router  
Key files: `src/pages/HubPage.jsx`, `src/components/MosaicFrame.jsx`, `src/data/schedule.js`, `src/index.css`, `src/utils/demoTime.js`  
Brand images: `public/brands/{slug}.png` (only `wolf.png` exists so far)

---

## Product concept (context)

Single white page that becomes a **4×3 mosaic** of 12 companies launching Aug 13, 8:00 AM–8:00 PM PDT (skip 12–1 lunch).

**Grid (row-major, left→right):**

```
Wolf      Viking     Eagle      Phenix
Holm      Atoll      Olympus    Aether
Demeter   Njord      Aeolus     Corvus
```

**Columns = domains:**

| Col | Companies | Theme |
|---|---|---|
| 1 Land | Wolf, Holm, Demeter | Forest green + gold |
| 2 Water | Viking, Atoll, Njord | Silver + deep navy ocean |
| 3 Air | Eagle, Olympus, Aeolus | Light blue, silver, white, wispy sky + lightning |
| 4 Space | Phenix, Aether, Corvus | Mostly black, sparks/twinkles, faint fire/rocket ember |

Rows = Movement / Habitation / Substrate.

Hub stays **white**. Company pages are separate routes (`/wolf`, etc.).

---

## Frame lifecycle (per hall, relative to that hall’s launch hour)

1. **T−60 min** — miniature ~20px construction workers appear; frame starts building  
2. **T−20 min** — frame fully built, empty window  
3. **T−0** — image materializes into the window  
4. **T+5 sec** — the word **click** appears **very small, below the frame** (not overlaid on the image)  
5. Click opens the full company page  

Wolf is first at 8:00 AM PDT → workers at 7:00, frame done 7:40, image at 8:00.

Demo mode already exists: `/?demo=1` starts at T−1h and runs time at **100×**. Keep it. Other halls without art = themed placeholders, still clickable.

---

## What the user asked for visually (do this well)

### Overall
- Frames should feel **interwoven / fluid**, not rigid identical boxes  
- **~28px gap** between cells (20px extra cushion beyond a tight grid)  
- Tile aspect **3:2** (user crops like 820×558 / recommend masters 1200×800)  
- Effects must remain **visible** even when a photo is inside — use a **living mat/rim** around the inner window (~12–16px), not atmosphere buried under the image  

### Land (green/gold)
- Miniature **vines** growing/weaving along the frame  
- Leaves that sway  
- Forest green + gold palette  

### Water (navy/silver)
- Miniature **writhing ocean** in the frame rim — moving waves, not a static navy stroke  
- Silver highlights / foam drift  

### Air (sky)
- **Air physics**: soft currents, floating motes/particles, wispy shear  
- Occasional lightning flash  
- Light blue / silver / white  

### Space (black)
- Rim/mat mostly **black**  
- Little **sparks that light up and twinkle** now and then  
- Subtle fiery ember / rocket glow at the bottom edge — abyss, not a busy fireball  

### Click
- Tiny typography  
- **Below** the frame, not on the photo  

### Images
- User provides real photos (Wolf snow wolf already at `public/brands/wolf.png`)  
- Placeholders until art arrives; add slug to `READY_BRANDS` when art lands  

---

## What failed before (avoid repeating)

- Subtle CSS that looked identical to the old flat borders in screenshots  
- Atmosphere layers drawn *under* the full-bleed photo so they disappeared  
- Stale Vite servers so the user refreshed and saw no change  
- Over-claiming “done” when the DOM/effects weren’t obviously different  

**Success test:** a single screenshot of the mosaic must clearly show four different living column treatments without reading the code.

---

## Implementation preferences

- Stay in the existing Vite React app (don’t rebuild the whole platform)  
- Prefer CSS/SVG animations in the frame rim; JS only for phase timing (already in `getFramePhase` / demo clock)  
- Respect `prefers-reduced-motion`  
- Keep demo: `/?demo=1` + Restart button  
- Do not invent operational claims on company pages; status labels stay concept/waitlist/research  

---

## Optional: Midjourney prompts for hall photos (user fills frames)

Shared negative:
```
no text, no letters, no logo, no watermark, no UI, no collage, no plastic skin, no anime, no cartoon
```

Aspect: `--ar 3:2 --style raw --stylize 50–80`

Use real photography when possible (Wolf is already a real photo). AI only if needed; user prefers not looking AI-generated.

---

## Definition of done

1. Mosaic order + column themes match the table above  
2. Living rim effects are unmistakable for Land / Water / Air / Space  
3. click is small and under each ready frame  
4. Gaps ~28px  
5. Demo 100× from T−1h still works  
6. Wolf photo sits in an inner window with Land vine rim visible around it  
7. Paste a screenshot in your reply proving the four columns look different  

---

## First message to send Claude (short)

```
Read docs/valhalla-mosaic-handoff.md in the valhalla-multi-launch-hub repo (or the brief I pasted). Rebuild MosaicFrame so Land=vines, Water=writhing ocean, Air=air physics, Space=black+twinkles — as a visible 14px living rim around each 3:2 window. click below frames, 28px gaps, keep ?demo=1 at 100× from T−1h. Make it obvious in a screenshot. Don’t bury effects under the photo.
```
