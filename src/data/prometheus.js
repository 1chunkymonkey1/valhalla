export const systems = [
  {
    id: '01',
    name: 'SENTINEL',
    klass: 'Structural Defense System',
    body: 'Wall-integrated thermal arrays linked to the home water supply. Detects heat before open flame. Zone suppression in under three seconds.',
  },
  {
    id: '02',
    name: 'TITAN',
    klass: 'Autonomous Ground Defense Unit',
    body: 'Tracked rover for perimeter and fire line. 2,800 PSI water plus Class-A retardant. Autonomous via LiDAR and thermal, or remote command.',
  },
  {
    id: '03',
    name: 'ATLAS',
    klass: 'Humanoid Rescue System',
    body: 'Bipedal platform for structural penetration and extraction. Built for conditions lethal to human responders. Atlas goes in when no one else can.',
  },
]

export const audiences = [
  {
    id: '01',
    name: 'WUI homeowners',
    weight: 'Primary — Model One',
    notes:
      'High-value properties on the wildland-urban interface in CA, OR, WA, CO, AZ. They have already lived through evacuation. Buy on fear converted to control, not on gadget novelty.',
  },
  {
    id: '02',
    name: 'HOAs / estate managers',
    weight: 'Primary — clustered Sentinel',
    notes:
      'One decision-maker, many structures. Pitch zone isolation, shared Command Interface, and insurance documentation. Avoid consumer-app language.',
  },
  {
    id: '03',
    name: 'Municipal / fire agencies',
    weight: 'Secondary — Titan + Atlas',
    notes:
      'Procurement cycles are slow. Lead with Titan as a force multiplier on the line, Atlas as a tool that keeps firefighters out of unsurvivable interiors. Never claim to replace crews.',
  },
  {
    id: '04',
    name: 'Insurers / capital',
    weight: 'Secondary — data + loss prevention',
    notes:
      'Post-2025 LA fires, carriers want mitigation they can underwrite. Offer detection logs, response times, and structure-save evidence. Do not overclaim actuarial proof before field data exists.',
  },
]

export const competitors = [
  {
    name: 'Residential sprinklers',
    stance: 'Reactive, interior, code-driven',
    vs: 'Sentinel detects before open flame and zones the house. We do not compete with code sprinklers — we sit in front of them.',
  },
  {
    name: 'IoT forest sensors (Dryad et al.)',
    stance: 'Landscape ignition detection',
    vs: 'They watch the woods. We defend the structure and the people in it. Complementary, not a substitute.',
  },
  {
    name: 'Airbus Wildfire Sentinel',
    stance: 'Agency aerial / C2 ecosystem',
    vs: 'Same word, different war. Their Sentinel coordinates aircraft. Ours is a wall. Never blur the names in press.',
  },
  {
    name: 'Consumer cameras + alerts',
    stance: 'Notify, then wait',
    vs: 'Notification is not defense. Our cycle is detect → suppress in under three seconds. If a pitch sounds like a doorbell camera, rewrite it.',
  },
]

export const objections = [
  {
    objection: 'What if it false-alarms and floods the house?',
    answer:
      'Dual-spectrum thermal plus zone isolation. Water is a cheaper mistake than fire. Still: never joke about flooding. Spec the threshold, then stop talking.',
  },
  {
    objection: 'This belongs to the fire department.',
    answer:
      'Departments arrive after the structure is already in the window. We are the minutes they cannot have. Titan and Atlas are built to stand with them, not instead of them.',
  },
  {
    objection: "Isn't fighting fire the wrong ecology?",
    answer:
      'Use the Oath. We support prescribed and cultural fire. We defend human life when fire forgets its place. This is the only answer. Do not skip it.',
  },
  {
    objection: 'Price.',
    answer:
      'Do not lead with cost. Lead with the 2025 LA and Sierra events, then the sub-3-second cycle. Quote after a site survey. Early access is invitation, not a checkout.',
  },
]

export const channels = [
  { channel: 'Direct / founder', use: 'Every early-access conversation. Eason on Sierra WUI. Chris on LA.' },
  { channel: 'Valhalla / Phenix', use: 'Internal only. Kenaz gate. Never listed on the mosaic or investor decks.' },
  { channel: 'Insurance partners', use: 'After 20+ instrumented installs. Bring logs, not a vision deck.' },
  { channel: 'Press', use: 'Short form only. No render-as-product unless labeled in development.' },
]

export const talkingPoints = [
  'We respect fire. We command it.',
  'The Sierra Nevada has burned for ten thousand years. We did not come here to stop that.',
  'When the fire comes for your home — something stands in its way.',
  'Three systems. One mission. Zero compromise.',
  'Built in the ash. Built for what comes next.',
]

export const principles = [
  {
    label: 'RESPECT',
    sub: 'Not arrogance',
    body: 'Fire has sustained ecosystems and civilizations for millennia. We defend against it without losing sight of what it is.',
  },
  {
    label: 'KNOWLEDGE',
    sub: 'Not paranoia',
    body: 'We support prescribed burns, cultural fire stewardship, and land management. Understanding fire is part of defending against it.',
  },
  {
    label: 'AUTONOMY',
    sub: 'Not dependency',
    body: 'Seconds separate a structure fire from a catastrophe. Our systems act before you can dial emergency services.',
  },
  {
    label: 'PROTECTION',
    sub: 'Not resignation',
    body: 'Atlas was built because no one should have to die trying to save another. We build so that calculus is never necessary.',
  },
]

export const voiceTraits = [
  {
    trait: 'RESOLUTE',
    not: 'Not alarmist',
    note: 'We speak with certainty. Our confidence is earned from the field, not performed from a boardroom.',
  },
  {
    trait: 'REVERENT',
    not: 'Not precious',
    note: 'We honor fire’s power and the cultures that have stewarded it responsibly for millennia.',
  },
  {
    trait: 'TECHNICAL',
    not: 'Not cold',
    note: 'Precision signals competence. We never sacrifice warmth for accuracy — both are required.',
  },
  {
    trait: 'PROTECTIVE',
    not: 'Not fearful',
    note: 'We stand between. We do not warn about fire — we act against it before the warning is necessary.',
  },
]

export const palette = [
  { name: 'Forge Black', hex: '#09090B' },
  { name: 'Ember Gold', hex: '#C89B0A' },
  { name: 'Wildfire', hex: '#D95B0F' },
  { name: 'Crimson Ash', hex: '#8B1A1A' },
  { name: 'Battle Steel', hex: '#6B7FA0' },
  { name: 'Parchment', hex: '#EDE8DA' },
]
