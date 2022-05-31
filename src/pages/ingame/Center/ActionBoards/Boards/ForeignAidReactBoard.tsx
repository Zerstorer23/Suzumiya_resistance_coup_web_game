import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { GameManager } from "system/GameStates/GameManager";
import { ActionType, BoardState, StateManager } from "system/GameStates/States";
export default function ForeignAidReactBoard(): JSX.Element {
  //TODO change by board state
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const actions = [ActionType.Accept, ActionType.DukeBlocksForeignAid];

  function onMakeAction(action: ActionType) {
    if (action !== ActionType.DukeBlocksForeignAid) return;
    const currentTurn = ctx.room.game.state.turn;
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    //Target == the one who blocks
    gameAction.targetId = localCtx.getVal(LocalField.Id);
    StateManager.pushBoardState(BoardState.AidBlocked, gameAction, currentTurn);
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
            param={new ActionInfo(action)}
            onClickButton={() => {
              onMakeAction(action);
            }}
          />
        );
      })}
    </div>
  );
}
