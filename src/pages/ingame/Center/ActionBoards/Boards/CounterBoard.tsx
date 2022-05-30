import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { ActionInfo } from "system/GameStates/ActionInfo";
import { GameManager } from "system/GameStates/GameManager";
import { ActionType, StateManager } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
export default function CounterBoard(): JSX.Element {
  //TODO change by board state
  const actions = [ActionType.Accept, ActionType.IsALie];
  /*
      case BoardState.CalledGetThree:
      case BoardState.CalledChangeCards:
      case BoardState.CalledSteal:
      case BoardState.CalledAssassinate:
      case BoardState.AidBlocked:
      case BoardState.StealBlocked:
      case BoardState.AssassinBlocked:
*/
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId = localCtx.getVal(LocalField.Id);

  function onMakeAction(action: ActionType) {
    const board = ctx.room.game.state.board;
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    let newBoard = null;
    if (action === ActionType.IsALie) {
      newBoard = StateManager.getChallengedState(board);
      gameAction.challengerId = myId;
    } else {
      //only a few case actually triggers accepted state
      //when is my turn && state is block type
      const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);
      if (!isMyTurn) return;
      if (!StateManager.isBlockedState(board)) return;
      newBoard = StateManager.getAcceptedState(board);
    }
    if (newBoard === null) return;
    return StateManager.createState(ctx.room.game.state, newBoard);
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
