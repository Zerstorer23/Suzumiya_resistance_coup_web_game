import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/WaitingBoard";
import { useContext, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { REACTION_MAX_SEC } from "system/GameConstants";
import { BoardState } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import { TimerReturnType } from "system/types/CommonTypes";

export enum SolvingState {
  Init,
  TriggerWait,
  Waiting,
  Finished,
}

export default function SolverBoard(): JSX.Element {
  //TODO change by board state
  //Do all the kills, coins, replace cards, next turn
  //Turn owner is responsible for this
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);
  const [solvingState, setSolvingState] = useState<SolvingState>(
    SolvingState.Init
  );
  const [jsxElem, setJSX] = useState<JSX.Element>(<h1>Solve this Action?</h1>);

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + REACTION_MAX_SEC); // 10 minutes timer
  const timer: TimerReturnType = useTimer({
    expiryTimestamp,
    onExpire: () => {
      setSolvingState(SolvingState.Finished);
    },
  });
  useEffect(() => {
    if (solvingState === SolvingState.TriggerWait) {
      setSolvingState(SolvingState.Waiting);
      timer.start();
    }
  }, [solvingState]);

  useEffect(() => {
    const board = ctx.room.game.state.board;
    let jsx = jsxElem;
    switch (board) {
      case BoardState.GetOneAccepted:
        jsx = Solver.handleGetOne(ctx, localCtx, solvingState, setSolvingState);
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
    setJSX(jsx);
  }, [solvingState]);

  if (!isMyTurn) return <WaitingBoard />;
  return <div className={classes.container}>{jsxElem}</div>;
}
