const RANKS = "23456789TJQKA";
const SUITS = "cdhs";
const RANK_VALUE = Object.fromEntries([...RANKS].map((r, i) => [r, i + 2]));

const HAND_NAMES = [
  "High card",
  "One pair",
  "Two pair",
  "Three of a kind",
  "Straight",
  "Flush",
  "Full house",
  "Four of a kind",
  "Straight flush",
  "Royal flush",
];

export function makeDeck() {
  const deck = [];
  for (const r of RANKS) {
    for (const s of SUITS) deck.push(`${r}${s}`);
  }
  return deck;
}

export function shuffle(deck, rng = Math.random) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function combinations(arr, k) {
  const out = [];
  const rec = (start, picked) => {
    if (picked.length === k) {
      out.push(picked);
      return;
    }
    for (let i = start; i < arr.length; i++) rec(i + 1, [...picked, arr[i]]);
  };
  rec(0, []);
  return out;
}

function isStraight(ranks) {
  const uniq = [...new Set(ranks)].sort((a, b) => b - a);
  if (uniq.length < 5) return 0;
  for (let i = 0; i <= uniq.length - 5; i++) {
    if (uniq[i] - uniq[i + 4] === 4) return uniq[i];
  }
  if (uniq.includes(14) && uniq.includes(5) && uniq.includes(4) && uniq.includes(3) && uniq.includes(2)) {
    return 5;
  }
  return 0;
}

function scoreFive(cards) {
  const ranks = cards.map((c) => RANK_VALUE[c[0]]).sort((a, b) => b - a);
  const suits = cards.map((c) => c[1]);
  const flush = suits.every((s) => s === suits[0]);
  const straightHigh = isStraight(ranks);
  const counts = {};
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1;
  const groups = Object.entries(counts)
    .map(([r, n]) => ({ r: Number(r), n }))
    .sort((a, b) => b.n - a.n || b.r - a.r);
  const kickers = groups.flatMap((g) => Array(g.n).fill(g.r));

  if (flush && straightHigh === 14) return [9, 14];
  if (flush && straightHigh) return [8, straightHigh];
  if (groups[0].n === 4) return [7, groups[0].r, groups[1].r];
  if (groups[0].n === 3 && groups[1]?.n === 2) return [6, groups[0].r, groups[1].r];
  if (flush) return [5, ...kickers];
  if (straightHigh) return [4, straightHigh];
  if (groups[0].n === 3) return [3, groups[0].r, ...groups.slice(1).map((g) => g.r)];
  if (groups[0].n === 2 && groups[1]?.n === 2) {
    const pairs = [groups[0].r, groups[1].r].sort((a, b) => b - a);
    return [2, pairs[0], pairs[1], groups[2].r];
  }
  if (groups[0].n === 2) return [1, groups[0].r, ...groups.slice(1).map((g) => g.r)];
  return [0, ...kickers];
}

function cmpScore(a, b) {
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    if (d) return d;
  }
  return 0;
}

export function evaluateHand(cards) {
  if (cards.length < 5) return { rank: 0, name: HAND_NAMES[0], score: [0] };
  const fives = cards.length === 5 ? [cards] : combinations(cards, 5);
  let best = null;
  for (const five of fives) {
    const score = scoreFive(five);
    if (!best || cmpScore(score, best.score) > 0) best = { score, five };
  }
  return {
    rank: best.score[0],
    name: HAND_NAMES[best.score[0]],
    score: best.score,
    five: best.five,
  };
}

export function compareHands(a, b) {
  return cmpScore(evaluateHand(a).score, evaluateHand(b).score);
}

export function cardLabel(code) {
  const r = { T: "10", J: "J", Q: "Q", K: "K", A: "A" }[code[0]] || code[0];
  const s = { c: "♣", d: "♦", h: "♥", s: "♠" }[code[1]];
  return `${r}${s}`;
}

export function cardRed(code) {
  return code[1] === "d" || code[1] === "h";
}

export const POKER_RANKS = HAND_NAMES.map((name, i) => ({ rank: i, name })).reverse();

export const POKER_LESSONS = [
  {
    id: "goal",
    title: "The goal",
    body: "Texas Hold’em is a five-card showdown. You get two private hole cards. Five community cards are dealt in the middle. Best five-card mix of those seven wins. This trainer is practice only — no money, no rake.",
  },
  {
    id: "streets",
    title: "The streets",
    body: "Preflop: hole cards dealt. Flop: three community cards. Turn: fourth. River: fifth. After the river, remaining players show down. In this trainer you always go to showdown so you can see the ranking.",
  },
  {
    id: "rankings",
    title: "Hand rankings",
    body: "High card < pair < two pair < trips < straight < flush < full house < quads < straight flush < royal flush. Aces play high or low in a wheel (A-2-3-4-5).",
  },
  {
    id: "kickers",
    title: "Kickers",
    body: "When two players have the same pair, the leftover cards (kickers) break the tie. Always use the five-card combination, not just the pair.",
  },
];
