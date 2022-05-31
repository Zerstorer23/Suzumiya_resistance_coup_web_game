import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import RoomContext from "system/context/room-context";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { DeckManager } from "system/cards/DeckManager";
import { Card } from "system/cards/Card";

export default function AmbassadorBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const playerMap = ctx.room.playerMap;
  const deck = ctx.room.game.deck;
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id);
  let arr = deck.split(",");
  const myPlayer = playerMap.get(myId);
  //get 2 cards from top of the deck
  const topIndex = DeckManager.peekTopIndex(ctx, localCtx);

  let charArr = [
    arr[myPlayer!.icard],
    arr[myPlayer!.icard + 1],
    arr[topIndex],
    arr[topIndex + 1],
  ];

  const cardArr: Card[] = charArr.map((val) => {
    return DeckManager.getCardFromChar(val);
  });

  let thisIsFirstCard: boolean = true;

  function onMakeAction(action: Card) {
    if (thisIsFirstCard) {
      thisIsFirstCard = false;
      if (arr[topIndex] === action.cardRole) {
        let temp = arr[myPlayer!.icard];
        arr[myPlayer!.icard] = arr[topIndex];
        arr[topIndex] = temp;
      } else {
        let temp = arr[myPlayer!.icard];
        arr[myPlayer!.icard] = arr[topIndex + 1];
        arr[topIndex + 1] = temp;
      }
    } else if (arr[topIndex + 1] === action.cardRole) {
      thisIsFirstCard = true;
      if (arr[topIndex] === action.cardRole) {
        let temp = arr[myPlayer!.icard + 1];
        arr[myPlayer!.icard + 1] = arr[topIndex];
        arr[topIndex] = temp;
      } else {
        let temp = arr[myPlayer!.icard + 1];
        arr[myPlayer!.icard + 1] = arr[topIndex + 1];
        arr[topIndex + 1] = temp;
      }
    }

    DeckManager.changeDeck(ctx, arr);
  }

  return (
    <div className={classes.container}>
      {cardArr.map((action: Card, index: number) => {
        const baseIndex = index + 1;
        const cssName = classes[`cell${baseIndex}`];
        return (
          <BaseActionButton
            key={index}
            className={`${cssName}`}
            param={action}
            onClickButton={() => {
              onMakeAction(action);
            }}
          />
        );
      })}
    </div>
  );
}
