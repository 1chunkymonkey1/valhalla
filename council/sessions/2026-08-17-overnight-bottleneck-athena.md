# Overnight Bottleneck — Athena seat record

**Session:** OVERNIGHT BOTTLENECK, 17 August 2026. Council mode set by Icarus.
**Seat:** Athena, strategic intelligence.
**Classification:** L2 Council. No L3/L4 material in this record.

Facts as of the session brief. BALLAST governs operating-company speech: Demeter and
Argo Atomics only. Atoll is not an operating company to SAFE offerees. The Space
war-council seat is OPEN. Seven claims remain unsubstantiated and stay off live public
and investor surfaces. Meridian Earth Line targets September 2026. The merch work is
unmerged. Apollo Music has no public surface. Admin has no founder queue.

---

## Unifying bottleneck

**Every hall's only output is a claim, and only one person can authorize a claim.**

BALLAST removed the verbs from eleven of twelve halls and nothing was put in their
place. Each hall's public surface now terminates in an email field. The two artifacts
that are claim-free by construction, Meridian cloth and Apollo sound, are the only
things all twelve halls can ship without counsel, capital, an entity, or a founder
signature. Neither is live. Merch sits in an unmerged branch. Music has no surface at
all.

The bottleneck is not the founder's calendar and not capital. It is that the portfolio
has no non-claim deliverable, so every question routes back to the one person who can
authorize a claim. The founder queue is the symptom. Claim-dependency is the disease.

This is why the founder queue is sequenced last. A queue makes the founder faster at
being the bottleneck. It does not remove him from the path.

---

## Build order

Technical dependency order, not calendar.

1. **Land the merch trunk.** `meridianMerch.js`, the merch routes, and the merch test
   must be on the trunk before anything imports them. Every downstream artifact depends
   on this shape. Unmerged code has zero strategic value.
2. **Make the claim quarantine executable.** The seven lines currently live as prose in
   `docs/valhalla-context.md` while `api/_lib/councilAgentDefs.js` still states five of
   them as fact and `api/_lib/hallKnowledge.js` carries Spirit 2.0 language into the
   public hub chat. A failing test converts doctrine into mechanism and takes Lex off
   the critical path for every future edit.
3. **Mirror the merch schema for Apollo Music.** Same shape, same arity, same posture
   line. One guard should cover both artifacts.
4. **Encode the bottleneck register as data** with an `automatable` flag per hall.
   Twelve rows. This is what makes the memo queryable instead of re-derivable.
5. **Coverage guard.** One test asserting every mosaic hall has merch, has music, has a
   register row, and carries no banned phrase. Fail closed.
6. **Derive the founder queue** from `automatable === false`. Never hand-maintained.

Step 1 precedes step 3 because music copies merch's shape. Step 2 precedes step 4 so
the register does not itself become a place banned claims live. Step 5 depends on all
of them. Step 6 is computed, not authored.

**Failure mode.** If merch does not land, steps 3 and 5 build against a phantom import
and the tree breaks. This is observable in the workspace right now: a `bottlenecks.js`
importing `./meridianMerch.js` and `./apolloMusic.js` while both files are absent from
disk.

**Rejected.** Building the Admin founder queue first. It is the most visible gap and the
wrong loop to optimize. Amdahl, not Boyd.

---

## Halls

Format: `hall: bottleneck | music | merch | auto | eason`

- **wolf:** OEM outreach is founder-gated and the surface must never read "partnered." | Pack mark, land movement. | Pack Shirt, Pack Jacket. | auto: yes, copy guard. | eason: authorize the QJ Motor / SSR send.
- **viking:** Tickets wait on a licensed maritime operator, a third party we do not control. | Embark mark, water movement. | Deck Shirt, Deck Jacket. | auto: yes. | eason: none until an operator exists.
- **eagle:** Two of the seven unsubstantiated lines live here, and Spirit 2.0 is still reachable through the public hub chat. | Bird-species mark. Never a celebrity anthem. | Flight Shirt, Flight Jacket. | auto: yes, highest priority. | eason: none. A document only if Spirit is ever restored.
- **phenix:** Space war-council seat OPEN and marked critical. Three halls sit behind it. | Ember mark, space movement. | Launch Shirt, Launch Jacket. | auto: no. | eason: appoint the seat.
- **holm:** The product is a configurator the site promises and does not have. | Terrain mark, land habitation. | House Shirt, House Jacket. | auto: yes, most buildable hall in the mosaic. | eason: none.
- **atoll:** BALLAST bars operating speech to SAFE offerees and "pre-sale live" keeps trying to re-enter copy. | Shoreline mark, water habitation. | Shore Shirt, Shore Jacket. | auto: yes, quarantine. | eason: the Aquaria intro. Warm lead, not a deal.
- **olympus:** No near-term falsifiable milestone. 2035 Venus is the only date on the surface. | Above mark, air habitation. | Cloud Shirt, Cloud Jacket. | auto: yes. | eason: none.
- **aether:** Extra-Earth ownership is the one unsubstantiated claim with a legal remedy rather than an editorial one. | Quiet Orbit mark, space habitation. | Claim Shirt, Claim Jacket, no deed language. | auto: partial, copy only. | eason: one counsel question.
- **demeter:** The only live instrument, and the farmland-to-grid line keeps migrating from thesis to investor fact. | The Acre mark, land energy. | Field Shirt, Field Jacket. | auto: partial, quarantine the number. | eason: SAFE terms and send.
- **njord:** Widest scope, no first project. Nothing is scoped small enough to finish. | The Molecule mark, water energy. | Water Shirt, Water Jacket. | auto: yes, editorial narrowing. | eason: none.
- **aeolus:** "Own the atmosphere" is a governance claim with no governance work behind it. | Wind mark, air energy. | Sky Shirt, Sky Jacket. | auto: yes. | eason: none.
- **corvus:** Not a gap. A deliberate hold, since BALLAST sequences Corvus after Demeter. | Night Desk mark, intelligence. | Mind Shirt, Mind Jacket. | auto: yes, hold enforcement. | eason: whether the brief goes out. Default no.

Nine automatable, two partial, one blocked on a founder appointment.

---

## Apollo Music

Apollo Music is not a label and must not be built as one. It is the second half of the
materials layer. Meridian is what a hall feels like. Apollo Music is what a hall sounds
like. Both are claim-free by construction, which is exactly why they are the only two
artifacts eleven non-operating halls can legitimately ship.

Build the slot and the guard, not the content. Twelve marks plus a house mark, mirroring
the merch schema so one coverage test covers both. Posture line parallel to merch:
**this is the mark, not a release.** No streaming links, no named artists, no dates.
Authorship belongs to the Apollo seat.

One warning. Do not put a date on the music surface. Meridian already carries the only
dated promise in the materials layer. A second dated promise doubles the exposure for
no additional proof.

---

## Meridian apparel

The most valuable stalled asset in the portfolio, and it is stalled on a merge rather
than on a mill. The work is complete: twenty-four hall-marked pieces, three Carbon
founding pieces, detail routes, and a test that already asserts no "in stock,"
"shipping now," or "buy now" language reaches a public surface.

Two exposures worth naming rather than repeating.

- September 2026 is the only dated commitment in the materials layer. Keeping the
  surface a list rather than a cart is what makes that date survivable if it slips.
- "Self-cleaning stain-trapping polymer" on the founding piece is a performance claim,
  not a description. It is fine as aspirational site copy and it is a representation if
  it reaches an investor surface. It needs substantiation before it crosses that line.

---

## Automate

No founder, no tool, no meeting required.

- Claim quarantine test over public surfaces, failing the build on the seven phrases.
  Start with `api/_lib/hallKnowledge.js`, which feeds the unauthenticated hub chat and
  currently names Spirit 2.0, then `api/_lib/councilAgentDefs.js`, which still states
  Spirit, the celebrity consumer, Atoll pre-sale, the farmland-grid figure, and the
  gigatonne range as fact.
- Coverage parity test over the grid order: merch, music, register row, all twelve.
- BALLAST speech guard. Only Demeter and Argo Atomics carry operating-company verbs.
  Atoll explicitly does not.
- Posture-string assertions. "Not a cart" on merch, "not a release" on music, no funds
  language anywhere.
- Founder queue derived from `automatable === false` rather than typed by hand.

Two defects that keep the automation layer from firing at all. The `test` script on the
merch branch is pinned to a single file, so every future test written will silently
never run; it should be `node --test` with discovery. And there is no `.github`
directory, so nothing executes on push. Guards that do not run are documentation.

---

## Tools

Only where automation cannot decide. Two, and no more.

- A read-only completeness view in Admin or Council rendering coverage and the derived
  founder queue. A dashboard that reports what automation computed, not a second place
  to type tasks.
- A single pre-publish posture command, once the test script actually discovers tests.

---

## Founder queue

Only what survived automation and tools. Three items.

1. Appoint the Space war-council seat. Phénix, Aether, and Corvus all sit behind it.
2. Demeter SAFE. Terms and send. The only live instrument in the portfolio.
3. Aether extra-Earth ownership. One counsel question, because it is the only
   unsubstantiated claim whose remedy is legal rather than editorial.

Everything else that looks founder-gated is a send. The QJ Motor outreach, the Aquaria
intro, and the Corvus brief are all sends, and the draft-and-approve path in
`/capital` already handles sends. Building a second queue duplicates it. Nothing is
sent without the founder authorizing that specific send.

---

## Hidden move

**The Council's real product is not advice. It is constraints, and constraints compile.**

Every governing rule in this organization currently lives in prose that a human has to
remember to apply. BALLAST, the seven claims, list-not-cart, the classification
boundary. Eighteen seats exist as prompts, which means every act of enforcement is a
conversation, and conversations do not run on push.

Convert each seat's standing doctrine into one executable assertion. Eighteen seats,
eighteen tests. Lex stops being someone you consult and becomes a check that fails.
Apollo and Helios stop being asked whether every hall is covered and are told. Athena's
own register stops being a memo and becomes a queryable object with a computed founder
queue hanging off it.

The second-order effect is the one that matters. Once doctrine is executable, halls can
be operated by agents without founder review, because the guardrails are mechanical
instead of editorial. That is the only path that reaches twelve halls with one founder.

Tonight is the proof. This same analysis is being produced in more than one place in
this repository at this moment. Chatted, it is produced again next week. Compiled, it
is never produced again.

---

*These are the first 12 halls of the Skáli. The Skáli of Valhalla holds 24. The second
wing opens when the first is won.*
