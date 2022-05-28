import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import { useContext } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
export default function WaitingBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id)!;
  const playerList: string[] = localCtx.getVal(LocalField.SortedList);
  const currentTurn = ctx.room.game.state.turn;
  const currentTurnId = playerList[currentTurn];

  const isMyTurn: boolean = currentTurnId === myId;
  if (isMyTurn) {
    return (
      <div className={classes.singleContainer}>
        <h1>Waiting for other player's reaction...</h1>
      </div>
    );
  } else {
    return (
      <div className={classes.singleContainer}>
        <h1>
          Waiting for player {ctx.room.playerMap.get(currentTurnId)?.name}'s
          action...
        </h1>
      </div>
    );
  }
}
