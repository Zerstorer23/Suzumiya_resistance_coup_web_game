import classes from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard.module.css";
import { useContext, useEffect } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState, readStateFromRoom } from "system/GameStates/States";
export default function WaitingBoard(): JSX.Element {
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
  useEffect(() => {
    if (isMyTurn) {
      switch (boardState) {
        case BoardState.AcceptedState:
          //Wait 2 sec
          //Solve the status
          //Clear and End Turn
          //Action:None / None = (temporarily show nothing)
          //Turn increment
          break;
        case BoardState.CalledForeignAid:
          //Wait 3 sec for reaction
          //then if client none, solve clear and end turn
          break;
        case BoardState.CalledCoup:
          //Wait until dst resolves situation
          break;
        case BoardState.CalledDuke:
          //Wait 3 sec for reaction
          //then if client none, solve clear and end turn
          break;
        case BoardState.CalledCaptain:
          //Wait until dst resolves situation
          break;
        case BoardState.CalledAssassin:
          //Wait until dst resolves situation
          break;
        case BoardState.CalledAmbassador:
          //Wait 3 sec for reaction
          //then if client none, show cards, resolve soon.
          break;
        case BoardState.ContessaBlockedAssassin:
          //I Resolve for 3 sec
          break;
        // case BoardState.ClientIsALie:
        //Open results for 3 sec
        //Loser removes card and Loser resolves
        // break;
        case BoardState.CaptainBlockedCaptain:
          //I Resolve for 3 sec
          break;
        case BoardState.AmbassadorBlockedCaptain:
          //I Resolve for 3 sec
          break;
        // case BoardState.PierIsALie:
        //Open results for 3 sec
        //Loser removes card and Loser resolves
        // break;
      }
    } else {
      //Show waiting panel that infers situation
    }
  }, [isMyTurn, boardState]);

  /*
Resolving stage
if pier is me.

else Waiting stage of counter stage
*/

  return (
    <div className={classes.singleContainer}>
      <h1>Waiting for other player's action...</h1>
    </div>
  );
}
