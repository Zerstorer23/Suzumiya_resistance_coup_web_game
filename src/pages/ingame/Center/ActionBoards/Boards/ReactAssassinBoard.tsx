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
export default function ReactAssassinBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId = localCtx.getVal(LocalField.Id);

  const actions = [
    ActionType.Accept,
    ActionType.IsALie,
    ActionType.ContessaBlocksAssassination,
  ];

  function onMakeAction(action: ActionType) {
    const board = ctx.room.game.state.board;
    const gameAction = GameManager.copyGameAction(ctx.room.game.action);
    let newBoard = null;
    if (action === ActionType.IsALie) {
      newBoard = StateManager.getChallengedState(board);
      gameAction.challengerId = myId;
    } else if (action === ActionType.Accept) {
      newBoard = StateManager.getAcceptedState(board);
    } else if (action === ActionType.ContessaBlocksAssassination) {
      newBoard = BoardState.AssassinBlocked;
    }
    if (newBoard === null) return;
    StateManager.createState(ctx.room.game.state, newBoard);
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
