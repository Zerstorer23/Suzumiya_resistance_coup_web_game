import AmbassadorBoard from "pages/ingame/Center/ActionBoards/Boards/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/Boards/CounterBoard";
import ForeignAidReactBoard from "pages/ingame/Center/ActionBoards/Boards/ForeignAidReactBoard";
import SolverBoard from "pages/ingame/Center/ActionBoards/Boards/Solver/SolverBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/Boards/Waiter/WaitingBoard";
import { Game } from "system/GameStates/GameTypes";
import { BoardState, StateManager } from "system/GameStates/States";

export function getBoardElemFromRoom(
  boardState: BoardState,
  game: Game,
  currentTurnId: string,
  myId: string
): JSX.Element {
  const isMyTurn: boolean = currentTurnId === myId;
  const isTargetted: boolean = game.action.targetId === myId;
  //Counterable only if no one is countering.
  const noReaction: boolean = game.action.challengerId.length === 0;
  const debugstr = `Turn: ${currentTurnId} / isme?${isMyTurn} / isTarget? ${isTargetted} / state:${boardState}`;
  console.log(debugstr);
  if (isMyTurn) {
    /*
      Called = Wait
      Challenged or Accepted = Solver
      Blocked = Counter
      Amba = Amba
      */
    if (StateManager.isFinal(boardState)) {
      return <SolverBoard />;
    } else {
      switch (boardState) {
        case BoardState.ChoosingBaseAction:
          return <BaseBoard />;
        case BoardState.AidBlocked:
        case BoardState.StealBlocked:
        case BoardState.AssassinBlocked:
          return <CounterBoard />;
        case BoardState.AmbassadorAccepted:
          return <AmbassadorBoard />;
        default:
          return <WaitingBoard />;
      }
    }
  } else {
    if (isTargetted) {
      //Coup Steal Assassin has targets
      return <SolverBoard />;
    } else if (noReaction) {
      //Called and blocked are counterable.
      //Else wait
      if (boardState === BoardState.CalledGetTwo) {
        return <ForeignAidReactBoard />;
      } else if (StateManager.isCounterable(boardState)) {
        return <CounterBoard />;
      } else {
        return <WaitingBoard />;
      }
    } else {
      //I am not being targetted but someone is acting
      return <WaitingBoard />;
    }
  }
}
