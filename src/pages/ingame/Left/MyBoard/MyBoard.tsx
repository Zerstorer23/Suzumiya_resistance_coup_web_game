import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import { Card, CardRole } from "system/cards/Card";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";

export default function MyBoard(): JSX.Element {
  const card1 = new Card(CardRole.Duke, true);
  const card2 = new Card(CardRole.Captain, true);

  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <p>My Cards</p>
      <VerticalLayout>
        <MyCardComponent card={card1} />
        <MyCardComponent card={card2} />
        <CoinDisplayComponent coins={10} />
      </VerticalLayout>
    </div>
  );
}
