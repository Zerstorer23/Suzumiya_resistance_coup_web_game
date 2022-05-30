import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { ActionType } from "system/GameStates/States";
import RoomContext from "system/context/room-context";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { getSortedListFromMap } from "system/GameStates/RoomGenerator";
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
  const sortedList: string[] = getSortedListFromMap(playerMap);
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

  function onMakeAction(action: Card) {}

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
