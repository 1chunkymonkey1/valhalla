/**
 * Bridge copy linking each hall to the next in REVEAL_ORDER.
 * `{blank}` is shown until the next preview unlock, then replaced by the linked name.
 */
export const NEXT_DOOR_CUES = {
  wolf: {
    before: 'Drive your wolf to your',
    after: 'Drive your wolf to your',
  },
  holm: {
    before: 'Open your holm onto',
    after: 'Open your holm onto',
  },
  demeter: {
    before: "Carry demeter's harvest to",
    after: "Carry demeter's harvest to",
  },
  viking: {
    before: 'Sail your viking toward',
    after: 'Sail your viking toward',
  },
  atoll: {
    before: 'Drift from your atoll to',
    after: 'Drift from your atoll to',
  },
  njord: {
    before: 'Rise with njord into',
    after: 'Rise with njord into',
  },
  eagle: {
    before: 'Follow your eagle to',
    after: 'Follow your eagle to',
  },
  olympus: {
    before: 'Step from olympus into',
    after: 'Step from olympus into',
  },
  aeolus: {
    before: 'Let aeolus carry you to',
    after: 'Let aeolus carry you to',
  },
  phenix: {
    before: 'Ascend with Phénix toward',
    after: 'Ascend with Phénix toward',
  },
  aether: {
    before: 'Cross aether to meet',
    after: 'Cross aether to meet',
  },
}

export function getNextDoorCue(fromId) {
  return (
    NEXT_DOOR_CUES[fromId] || {
      before: 'Continue to',
      after: 'Continue to',
    }
  )
}
