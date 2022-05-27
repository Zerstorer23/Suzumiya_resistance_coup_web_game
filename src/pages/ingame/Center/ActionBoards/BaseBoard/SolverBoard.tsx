import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import { useContext, useEffect } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState, readStateFromRoom } from "system/GameStates/States";
export default function SolverBoard(): JSX.Element {
  //TODO change by board state
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const boardState: BoardState = readStateFromRoom(
    ctx.room.game.pierAction.action,
    ctx.room.game.clientAction.action
  );
  const playerList: string[] = localCtx.getVal(LocalField.SortedList);
  const currentTurn = ctx.room.game.currentTurn;
  const currentTurnId = playerList[currentTurn];
  const myId = localCtx.getVal(LocalField.Id);
  const isMyTurn = currentTurnId === myId;
  return (
    <div className={classes.container}>
      <h1>Counter this Action?</h1>
    </div>
  );
}
