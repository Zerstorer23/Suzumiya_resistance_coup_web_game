import BaseActionButton from "pages/ingame/Center/ActionBoards/BaseBoard/BaseActionButton";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";

import { ActionInfo } from "system/GameStates/ActionInfo";
import { GameManager } from "system/GameStates/GameManager";
import { ActionType } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  //useState(isAssassinating)
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id)!;
  const myPlayer = ctx.room.playerMap.get(localCtx.getVal(LocalField.Id))!;
  //TODO change by board state
  const actions = [
    ActionType.GetOne,
    ActionType.GetThree,
    ActionType.GetForeignAid,
    ActionType.Steal,
    ActionType.Coup,
    ActionType.Assassinate,
    ActionType.None,
    ActionType.ChangeCards,
  ];

  function onMakeAction(action: ActionType) {
    if (action === ActionType.None) return;
    //What to do when button is clicked
    const pierAction = GameManager.createGameAction(action, myId);
    ReferenceManager.updateReference(DbReferences.GAME_pierAction, pierAction);
    switch (action) {
      case ActionType.GetOne:
        //+1 is clicked
        // add coin +1
        // currentturn++
        //set
        //header
        //My player Info
        break;
      case ActionType.GetThree:
        break;
      case ActionType.GetForeignAid:
        break;
      case ActionType.Steal:
        break;
      case ActionType.Coup:
        break;
      case ActionType.Assassinate:
        break;
      case ActionType.ChangeCards:
        break;
      case ActionType.Assassinate:
        //Prompt who to kill
        //fill dst, src, action, pieraction
        break;
    }
    //probably wait 3 seconds
    //clear game action
    console.log(`Clicked ${action}`);
  }
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
