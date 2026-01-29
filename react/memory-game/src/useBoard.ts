import { useState, useEffect, type TransitionEvent } from "react";
import type { Card, GameStatus } from "./App";

const REVEAL_TIMEOUT = 1500;

type Turn = {
  player: 1 | 2;
  first: Pick<Card, "id" | "match_id"> | null;
  second: Pick<Card, "id" | "match_id"> | null;
};

export default function useBoard(initialCards: Card[] = []) {
  const [turn, setTurn] = useState<Turn>({
    player: 1,
    first: null,
    second: null,
  });
  const [cards, setCards] = useState(initialCards);
  const [canClick, setCanClick] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>(null);

  function onCardClick(id: number) {
    if (!canClick) {
      return;
    }
    const { match_id, player, revealed } = cards.find(
      (x) => x.id === id,
    ) as Card;
    if (player || revealed) {
      return;
    }
    if (!turn.first) {
      setTurn((prev) => ({ ...prev, first: { id, match_id } }));
      return;
    }
    if (!turn.second) {
      setTurn((prev) => ({ ...prev, second: { id, match_id } }));
    }
  }

  function onTransitionEnd(event: TransitionEvent) {
    const { first, second, player } = turn;
    const target = (event.target as HTMLElement).parentNode;
    const isRevealed = (target as HTMLElement).classList.contains("revealed");
    const isMatch = first?.match_id === second?.match_id;

    if (!isRevealed) {
      setCanClick(true);
      return;
    }

    if (!second) {
      return;
    }

    setCards((prev) =>
      prev.map((x) =>
        [first?.id, second.id].includes(x.id) && isMatch
          ? {
              ...x,
              revealed: false,
              player,
            }
          : { ...x, shaking: [first?.id, second.id].includes(x.id) },
      ),
    );

    if (isMatch) {
      setTurn({ player, first: null, second: null });
      return;
    }

    // avoid clicks during the reveal timeout
    setCanClick(false);
    setTimeout(() => {
      setTurn({ player: player === 1 ? 2 : 1, first: null, second: null });
      setCards((prev) =>
        prev.map((x) => ({ ...x, revealed: false, shaking: false })),
      );
    }, REVEAL_TIMEOUT);
  }

  function reset(newCards: Card[]) {
    setCards(newCards);
    setTurn({ player: 1, first: null, second: null });
    setGameStatus(null);
  }

  useEffect(() => {
    const { first, second } = turn;
    if (!first) {
      return;
    }
    setCards((prev) =>
      prev.map((x) => ({
        ...x,
        revealed: !second
          ? x.id === first.id
          : x.revealed || x.id === second.id,
      })),
    );
  }, [turn]);

  useEffect(() => {
    const totalPlayerOne = cards.filter((x) => x.player === 1).length;
    const totalPlayerTwo = cards.filter((x) => x.player === 2).length;
    const isBoardFull = totalPlayerOne + totalPlayerTwo === cards.length;
    if (!isBoardFull) {
      return;
    }
    const isTie = totalPlayerOne === totalPlayerTwo;
    setGameStatus(isTie ? "TIE" : totalPlayerOne > totalPlayerTwo ? 1 : 2);
  }, [cards]);

  return {
    cards,
    onCardClick,
    reset,
    canClick,
    onTransitionEnd,
    player: turn.player,
    gameStatus,
  };
}
