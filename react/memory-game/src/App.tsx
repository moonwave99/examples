import useBoard from "./useBoard.ts";
import cx from "clsx";
import { getCards } from "./utils.ts";
import "./index.css";

const DEBUG = window.location.href.indexOf("debug") > -1;

export type Card = {
  id: number;
  match_id: number;
  src: string;
  player: 1 | 2 | null;
  revealed?: boolean;
};

export type GameStatus = "TIE" | 1 | 2 | null;

export default function App() {
  const {
    player,
    cards,
    onCardClick,
    reset,
    canClick,
    onTransitionEnd,
    gameStatus,
  } = useBoard(getCards());

  return (
    <div className={cx("app", { disabled: !canClick })}>
      <header>
        <h1 className={`player-${player}`}>
          Player <span>{player}</span> plays
        </h1>
      </header>
      <div className="board" onTransitionEnd={onTransitionEnd}>
        {cards.map((x) => (
          <CardView key={x.id} onCardClick={onCardClick} {...x} />
        ))}
      </div>
      <button onClick={() => reset(getCards())}>Start Over</button>
      <footer>
        made with{" "}
        <span role="img" aria-label="love">
          🖤
        </span>{" "}
        at <a href="https://github.com/moonwave99">mwlabs</a>
      </footer>
      <Modal gameStatus={gameStatus} onContinue={() => reset(getCards())} />
    </div>
  );
}

type CardViewProps = Card & {
  onCardClick: (id: number) => void;
  shaking?: boolean;
};

function CardView({
  id,
  match_id,
  revealed,
  player,
  src,
  onCardClick,
  shaking,
}: CardViewProps) {
  return (
    <div
      onClick={() => onCardClick(id)}
      className={cx("card", player && `player-${player}`, {
        revealed: revealed || player,
        shaking,
      })}
    >
      <div className="content">
        <div className="front">{DEBUG ? match_id : null}</div>
        <div className="back">
          <img src={src} alt="Card" />
        </div>
      </div>
    </div>
  );
}

type ModalProps = {
  gameStatus: GameStatus;
  onContinue: () => void;
};

function Modal({ gameStatus, onContinue }: ModalProps) {
  const message =
    gameStatus === "TIE" ? "It's a tie!" : `Player ${gameStatus} won!`;
  return (
    <div
      className={cx("modal", `status-${gameStatus}`, { visible: !!gameStatus })}
    >
      <div className="modal-content">
        <h2>{message}</h2>
        <p>
          <button onClick={onContinue}>Play Again</button>
        </p>
      </div>
    </div>
  );
}
