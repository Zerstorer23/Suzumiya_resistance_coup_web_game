import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/WaitingBoard";
import { useContext, useEffect } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";

export default function SolverBoard(): JSX.Element {
  //TODO change by board state
  //Do all the kills, coins, replace cards, next turn
  //Turn owner is responsible for this
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);
  const solvingState = localCtx.getVal(LocalField.Solver);
  useEffect(() => {
    const board = ctx.room.game.state.board;

    switch (board) {
      case BoardState.GetOneAccepted:
        Solver.handleGetOne(ctx, localCtx);
        // Solver.handleGetOne()
        break;
      case BoardState.CalledGetTwo:
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
  }, [solvingState]);

  if (!isMyTurn) return <WaitingBoard />;
  return (
    <div className={classes.container}>
      <h1>Solve this Action?</h1>
    </div>
  );
}
