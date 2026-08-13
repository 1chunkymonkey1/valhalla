# Launch reveal / demo clock

The hub and company sites share one **simulation clock** (`src/lib/simulationClock.js`).

## Public demo

- `/?demo=1` — enter demo mode (persists in localStorage), start at **T−1h**, run at **100×** by default.
- `/?demo=0` — exit to live wall time.
- Hub demo strip: **Pause / Resume**, **Restart**, **Live**.

## Founder admin (`/admin` → Reveal)

Uses the same localStorage keys (this browser only — not a server override):

| Control | Effect |
|---|---|
| **Watch full reveal** | Demo on, reset to T−1h, open hub in a new tab |
| **Pause / Resume** | Freeze or continue simulated time |
| **Speed** | 1× / 10× / 50× / 100× / 500× (keeps current sim moment) |
| **Time scrub** | Jump along the launch timeline (auto-pauses) |
| **Jump bookmarks** | Event open, Demeter, Njord, Wave 2, etc. |
| **Exit to live** | Clear demo mode for this browser |

Open the hub in a second tab while adjusting controls; both tabs listen for `storage` / `valhalla-clock` events.

Countdown, mosaic construction, tile unlocks, and NextDoor countdowns all read `getSimulatedNow()` — there is no separate fake animation path.
