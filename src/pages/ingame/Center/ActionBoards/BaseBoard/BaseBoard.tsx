import BaseActionButton from "pages/ingame/Center/ActionBoards/BaseBoard/BaseActionButton";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";

import { ActionInfo } from "system/GameStates/ActionInfo";
import { GameManager } from "system/GameStates/GameManager";
import { TurnState } from "system/GameStates/GameTypes";
import { ActionType, BoardState, StateManager } from "system/GameStates/States";
import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id)!;
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
    //What to do when button is clicked
    console.log(`Clicked ${action}`);
    const gameAction = GameManager.createGameAction(myId);
    let newBoard = BoardState.GetOneAccepted;
    if (StateManager.isTargetableAction(action)) {
      //TODO
      return;
    }
    switch (action) {
      case ActionType.GetOne:
        newBoard = BoardState.GetOneAccepted;
        break;
      case ActionType.GetForeignAid:
        newBoard = BoardState.CalledGetTwo;
        break;
      case ActionType.GetThree:
        newBoard = BoardState.CalledGetThree;
        break;
      case ActionType.ChangeCards:
        newBoard = BoardState.CalledChangeCards;
        break;
      default:
        return;
    }
    const newState: TurnState = {
      turn: ctx.room.game.state.turn,
      board: newBoard,
    };
    ReferenceManager.updateReference(DbReferences.GAME_gameAction, gameAction);
    ReferenceManager.updateReference(DbReferences.GAME_state, newState);
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
