import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import { Card, CardRole } from "system/cards/Card";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";
import { Fragment } from "react";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { Player } from "system/GameStates/GameTypes";
import RoomContext from "system/context/room-context";

export default function MyBoard(): JSX.Element {
  //useContext Room context
  //localContext
  //get myId from local
  //get myPlyaer from room
  //put data below

  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id);
  const myPlayer: Player = ctx.room.playerMap.get(myId)!;
  const cardIndex = myPlayer.icard;
  const myCoin = myPlayer.coins;
  const deck = ctx.room.game.deck;

  let arr = deck.split(",");
  let firstChar = arr[cardIndex];
  let secondChar = arr[cardIndex + 1];
  let card1: Card;
  let card2: Card;

  switch (firstChar) {
    case "D":
      card1 = new Card(CardRole.Duke, true);
      break;
    case "C":
      card1 = new Card(CardRole.Captain, true);
      break;
    case "A":
      card1 = new Card(CardRole.Assassin, true);
      break;
    case "T":
      card1 = new Card(CardRole.Contessa, true);
      break;
    case "S":
      card1 = new Card(CardRole.Ambassador, true);
      break;
    default:
      card1 = new Card(CardRole.None, true);
      console.log(firstChar);
      break;
  }

  switch (secondChar) {
    case "D":
      card2 = new Card(CardRole.Duke, true);
      break;
    case "C":
      card2 = new Card(CardRole.Captain, true);
      break;
    case "A":
      card2 = new Card(CardRole.Assassin, true);
      break;
    case "T":
      card2 = new Card(CardRole.Contessa, true);
      break;
    case "S":
      card2 = new Card(CardRole.Ambassador, true);
      break;
    default:
      card2 = new Card(CardRole.None, true);
      console.log(secondChar);
      break;
  }

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
        <CoinDisplayComponent coins={myCoin} />
      </VerticalLayout>
    </div>
  );
}
