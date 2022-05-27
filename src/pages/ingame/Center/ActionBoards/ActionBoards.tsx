import gc from "global.module.css";
import AmbassadorBoard from "pages/ingame/Center/ActionBoards/BaseBoard/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/BaseBoard/CounterBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/BaseBoard/WaitingBoard";
import { useContext, useEffect, useState } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState, StateManager } from "system/GameStates/States";
import classes from "./ActionBoards.module.css";
import { Game } from "system/GameStates/GameTypes";
import SolverBoard from "pages/ingame/Center/ActionBoards/BaseBoard/SolverBoard";
export default function ActionBoards(): JSX.Element {
  //TODO decode
  //ENUM
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const [boardElem, setBoardElem] = useState(<BaseBoard />);
  const boardState: BoardState = ctx.room.game.state.board;
  useEffect(() => {
    const playerList: string[] = localCtx.getVal(LocalField.SortedList);
    const currentTurn = ctx.room.game.state.turn;
    const currentTurnId = playerList[currentTurn];
    const myId = localCtx.getVal(LocalField.Id);
    const elem = getBoardElemFromRoom(
      boardState,
      ctx.room.game,
      currentTurnId,
      myId
    );
    setBoardElem(elem);
  }, [boardState]);

  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <div className={classes.header}>Do my action...</div>
      {boardElem}
    </div>
  );
}

function getBoardElemFromRoom(
  boardState: BoardState,
  game: Game,
  currentTurnId: string,
  myId: string
): JSX.Element {
  const isMyTurn: boolean = currentTurnId === myId;
  const isTargetted: boolean = game.pierAction.dstId === myId;
  //Counterable only if no one is countering.
  const isCounterable: boolean = game.pierAction.srcId.length === 0;
  console.log(
    `Turn: ${currentTurnId} / isme?${isMyTurn} / isTarget? ${isTargetted} / state:${boardState}`
  );
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
      }
    }
  } else if (isTargetted) {
    //Coup Steal Assassin has targets
    return <SolverBoard />;
  } else if (isCounterable) {
    //Called and blocked are counterable.
    //Else wait
    if (StateManager.isCounterable(boardState)) {
      return <CounterBoard />;
    } else {
      return <WaitingBoard />;
    }
  } else {
    //I am not being targetted but someone is acting
    return <WaitingBoard />;
  }
  return <p>Exception</p>;
}
