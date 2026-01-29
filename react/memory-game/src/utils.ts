import type { Card } from "./App";

const INITIAL_CARDS = [
  "caravaggio",
  "kandisky",
  "haring",
  "klimt",
  "monet",
  "mucha",
  "munch",
  "van_gogh",
].map((x, index) => ({
  match_id: index + 1,
  src: `pics/${x}.jpg`,
}));

const PREPARE_WIN = window.location.href.indexOf("prepareWin") > -1;

export function getCards(): Card[] {
  return [...INITIAL_CARDS, ...INITIAL_CARDS]
    .sort(() => Math.random() - 0.5)
    .map((x, index) => ({
      ...x,
      id: index + 1,
      player: PREPARE_WIN && x.match_id !== 1 ? 1 : null,
    }));
}
