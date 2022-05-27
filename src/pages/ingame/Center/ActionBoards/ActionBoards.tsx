import gc from "global.module.css";
import ActionCounteredBoard from "pages/ingame/Center/ActionBoards/BaseBoard/ActionCounteredBoard";
import AmbassadorBoard from "pages/ingame/Center/ActionBoards/BaseBoard/AmbassadorBoard";
import BaseBoard from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard";
import ContessaReactBoard from "pages/ingame/Center/ActionBoards/BaseBoard/ContessaReactBoard";
import CounterBoard from "pages/ingame/Center/ActionBoards/BaseBoard/CounterBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/BaseBoard/WaitingBoard";
import { Fragment, useContext, useEffect, useState } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState, readStateFromRoom } from "system/GameStates/States";
import classes from "./ActionBoards.module.css";
import { Game } from "system/GameStates/GameTypes";
export default function ActionBoards(): JSX.Element {
  //TODO decode
  //ENUM
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const [boardElem, setBoardElem] = useState(<BaseBoard />);
  const boardState: BoardState = readStateFromRoom(
    ctx.room.game.pierAction.action,
    ctx.room.game.clientAction.action
  );
  useEffect(() => {
    const playerList: string[] = localCtx.getVal(LocalField.SortedList);
    const currentTurn = ctx.room.game.currentTurn;
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
  if (boardState === BoardState.Exception) {
    return (
      <p>{`Exception : Turn: ${currentTurnId} / isme?${isMyTurn} / isTarget? ${isTargetted} / state:${boardState}`}</p>
    );
  }

  if (isMyTurn) {
    switch (boardState) {
      case BoardState.ChoosingBaseAction:
        return <BaseBoard />;
      case BoardState.CalledAmbassador:
        return <AmbassadorBoard />;
      case BoardState.ContessaBlockedAssassin:
      case BoardState.CaptainBlockedCaptain:
      case BoardState.AmbassadorBlockedCaptain:
        return <ActionCounteredBoard />;
      default:
        return <WaitingBoard />;
      // case BoardState.SolveActions:
      // case BoardState.CalledForeignAid:
      // case BoardState.CalledCoup:
      // case BoardState.CalledDuke:
      // case BoardState.CalledCaptain:
      // case BoardState.CalledAssassin:
      // case BoardState.ClientIsALie:
      // case BoardState.PierIsALie:
    }
  } else if (isTargetted) {
    //All the pier actions that has a target
    switch (boardState) {
      case BoardState.CalledCoup:
      case BoardState.CalledCaptain:
      case BoardState.CalledAssassin:
      case BoardState.ClientIsALie:
        return <AmbassadorBoard />;
      //Others cannot have targets set.
    }
  } else if (isCounterable) {
    //All others, either lie or wait
    switch (boardState) {
      //Countable Actions
      case BoardState.CalledForeignAid:
      case BoardState.CalledDuke:
      case BoardState.CalledAmbassador:
        return <CounterBoard />;
      //None Countable actions
      // case BoardState.ChoosingBaseAction:
      // case BoardState.SolveActions:
      // case BoardState.CalledCoup:
      // case BoardState.CalledCaptain:
      // case BoardState.CalledAssassin:
      // case BoardState.ClientIsALie:
      // case BoardState.PierIsALie:
      default:
        return <WaitingBoard />;
    }
  } else {
    //I am not being targetted but someone is acting
    return <WaitingBoard />;
  }
  return <p>Exception</p>;
}
