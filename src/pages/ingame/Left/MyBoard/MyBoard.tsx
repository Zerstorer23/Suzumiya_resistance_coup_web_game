import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import { Card, CardRole } from "system/cards/Card";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";
import { Fragment } from "react";

export default function MyBoard(): JSX.Element {
  //useContext Room context
  //localContext
  //get myId from local
  //get myPlyaer from room
  //put data below
  const card1 = new Card(CardRole.Duke, true);
  const card2 = new Card(CardRole.Captain, true);
  const showCards = true;
  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <VerticalLayout>
        <div className={classes.infoContainer}>
          {showCards && (
            <Fragment>
              <p>My Cards</p>
              <MyCardComponent card={card1} />
              <MyCardComponent card={card2} />
            </Fragment>
          )}
          {!showCards && (
            <div className={classes.tutorialContainer}>Tutorial board</div>
          )}
        </div>
        <CoinDisplayComponent coins={10} />
      </VerticalLayout>
    </div>
  );
}
