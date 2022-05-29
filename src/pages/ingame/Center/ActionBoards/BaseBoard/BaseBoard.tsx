import BaseActionButton from "pages/ingame/Center/ActionBoards/BaseBoard/BaseActionButton";
import { Fragment, useContext, useEffect, useState } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { CursorState } from "system/context/localInfo/LocalContextProvider";
import RoomContext from "system/context/room-context";

import { ActionInfo } from "system/GameStates/ActionInfo";
import { GameManager } from "system/GameStates/GameManager";
import { ActionType, StateManager } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import classes from "./BaseBoard.module.css";

export default function BaseBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id)!;
  const currentTurn = ctx.room.game.state.turn;
  //For target actions, save which button we pressed
  const [savedAction, setSaved] = useState(ActionType.None);
  const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);
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

  const pSelector = localCtx.getVal(LocalField.PlayerSelector);
  function clearSelector() {
    if (savedAction === ActionType.None) {
      return;
    }
    setSaved(ActionType.None);
    localCtx.setVal(LocalField.PlayerSelector, CursorState.Idle);
  }
  useEffect(() => {
    //Only do something whenn selector has name AND we saved Action.
    if (pSelector === CursorState.Selecting || pSelector === CursorState.Idle)
      return;
    if (!StateManager.isTargetableAction(savedAction)) return;
    //You selected something
    const gameAction = GameManager.createGameAction(myId, pSelector);
    //Convert Action into state
    const newBoard = StateManager.getCalledState(savedAction);
    if (newBoard === null) return;
    //Push
    StateManager.pushBoardState(newBoard, gameAction, currentTurn);
    //Clear states
    clearSelector();
  }, [pSelector, savedAction]);

  function onMakeAction(action: ActionType) {
    if (!isMyTurn) return;
    //What to do when button is clicked
    console.log(`Clicked ${action}`);
    const gameAction = GameManager.createGameAction(myId);
    if (StateManager.isTargetableAction(action)) {
      setSaved(action);
      localCtx.setVal(
        LocalField.PlayerSelector,
        pSelector === CursorState.Selecting
          ? CursorState.Idle
          : CursorState.Selecting
      );
    } else {
      clearSelector();
      const newBoard = StateManager.getCalledState(action);
      if (newBoard === null) return;
      StateManager.pushBoardState(newBoard, gameAction, currentTurn);
    }
  }

  return (
    <Fragment>
      <div className={classes.header}>Do my action...</div>
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
    </Fragment>
  );
}
