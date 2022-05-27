import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import RemainingDeckDisplay from "pages/ingame/Right/GameDeckBoard/RemainingDeckDisplay/RemainingDeckDisplay";
import RevealedDeckDisplay from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/RevealedDeckDisplay";
import gc from "global.module.css";
import classes from "./GameDeckBoard.module.css";
import { CardRole } from "system/cards/Card";

export default function GameDeckBoard(): JSX.Element {
  //pass deck
  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      {/* <p>Game Deck</p> */}
      <HorizontalLayout>
        <RemainingDeckDisplay />
        <RevealedDeckDisplay />
      </HorizontalLayout>
    </div>
  );
}
