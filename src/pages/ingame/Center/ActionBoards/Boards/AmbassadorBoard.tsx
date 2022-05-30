import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
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
  let max = 0;
  for (let id in sortedList) {
    if (playerMap.get(id)!.icard >= max) {
      max = playerMap.get(id)!.icard;
    }
  }
  max += 2;

  let charArr = [
    arr[myPlayer!.icard],
    arr[myPlayer!.icard + 1],
    arr[max],
    arr[max + 1],
  ];

  const cardArr: Card[] = charArr.map((val) => {
    return DeckManager.getCardFromChar(val);
  });

  //TODO Show cards and accept two
  const actions = [
    ActionType.Accept,
    ActionType.Accept,
    ActionType.Accept,
    ActionType.Accept,
  ];

  function onMakeAction(action: ActionType) {}

  return (
    <div className={classes.container}>
      {actions.map((action: ActionType, index: number) => {
        const baseIndex = index + 1;
        const cssName = classes[`cell${baseIndex}`];
        return (
          <BaseActionButton
            key={index}
            className={`${cssName}`}
            actionInfo={new ActionInfo(action)}
            onClickButton={() => {
              onMakeAction(action);
            }}
          />
        );
      })}
    </div>
  );
}
