import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import * as ChallengeSolver from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeSolver";
import * as Solver from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import WaitingPanel from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingPanel";
import { Fragment, useContext, useEffect, useState } from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { ChallengedStateInfo } from "system/GameStates/GameTypes";
import { BoardState, StateManager } from "system/GameStates/States";
import { TurnManager } from "system/GameStates/TurnManager";
import { ChallengeSolvingState } from "system/types/CommonTypes";

export default function SolverBoard(): JSX.Element {
  /**
   * Turn owner is responsible for solving boards
   * Some states that involve waiting and unchanged are solve at waiting board by owner
   * Some states that solves challenges are solved at Challenger board
   */
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);
  const [jsxElem, setJSX] = useState<JSX.Element>(<WaitingPanel />);
  /**
   * Challenged state solver.
   * Separate because this uses param
   */
  const action = ctx.room.game.action;
  const board = ctx.room.game.state.board;

  function handleChallengeReveals(challengeInfo: ChallengedStateInfo) {
    const [hasIt, iLost] = ChallengeSolver.revealChallenge(
      ctx,
      localCtx,
      challengeInfo
    );
    if (iLost) {
      setJSX(<p>YOU Lost a card...</p>);
    } else {
      if (hasIt) {
        setJSX(<p>SOmeone has this, someone did not have this!</p>);
      } else {
        setJSX(<p>SOmeone has this, someone did not have this!</p>);
      }
    }
  }

  useEffect(() => {
    if (!StateManager.isChallenged(board)) return;
    const challengeInfo: ChallengedStateInfo = action.param;
    switch (challengeInfo.state) {
      case ChallengeSolvingState.Notify:
        ChallengeSolver.warnChallenge(ctx, localCtx, challengeInfo);
        break;
      case ChallengeSolvingState.Reveal:
        handleChallengeReveals(challengeInfo);
        break;
      case ChallengeSolvingState.Solved:
        ChallengeSolver.showResults(localCtx);
        break;
    }
  }, [action]);

  /**
   * Normal state solver
   */
  useEffect(() => {
    if (StateManager.isChallenged(board)) {
      return;
    }
    Solver.solveState(ctx, localCtx);
  }, []);

  if (!isMyTurn) return <WaitingBoard />;
  return <div className={classes.container}>{jsxElem}</div>;
}
