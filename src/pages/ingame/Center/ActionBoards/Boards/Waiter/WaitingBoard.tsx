import { setMyTimer } from "pages/components/ui/MyTimer/MyTimer";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import * as Waiter from "pages/ingame/Center/ActionBoards/Boards/Waiter/Waiter";
import { useContext, useEffect } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { WaitTime } from "system/GameConstants";
import { BoardState } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
export default function WaitingBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const myId: string = localCtx.getVal(LocalField.Id)!;
  const playerList: string[] = localCtx.getVal(LocalField.SortedList);
  const currentTurn = ctx.room.game.state.turn;
  const currentTurnId = playerList[currentTurn];
  const isMyTurn: boolean = currentTurnId === myId;

  useEffect(() => {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    //TODO load context live?
    if (ctx.room.game.action.pierId === myId) {
      setMyTimer(localCtx, WaitTime.WaitReactions, () => {
        switch (ctx.room.game.state.board) {
          case BoardState.CalledGetTwo:
            Waiter.handleGetTwo(ctx, localCtx);
            break;
          case BoardState.DukeBlocksAccepted:
            break;
          case BoardState.DukeBlocksChallenged:
            break;
          case BoardState.CoupAccepted:
            break;
          case BoardState.CalledGetThree:
            break;
          case BoardState.GetThreeChallenged:
            break;
          case BoardState.AmbassadorAccepted:
            break;
          case BoardState.AmbassadorChallenged:
            break;
          case BoardState.CalledSteal:
            break;
          case BoardState.StealAccepted:
            break;
          case BoardState.StealChallenged:
            break;
          case BoardState.StealBlocked:
            break;
          case BoardState.StealBlockAccepted:
            break;
          case BoardState.StealBlockChallenged:
            break;
          case BoardState.CalledAssassinate:
            break;
          case BoardState.AssissinateAccepted:
            break;
          case BoardState.AssassinateChallenged:
            break;
          case BoardState.AssassinBlocked:
            break;
          case BoardState.ContessaChallenged:
            break;
          case BoardState.ContessaAccepted:
            break;
        }
      });
    } else {
    }
  }, []);

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
