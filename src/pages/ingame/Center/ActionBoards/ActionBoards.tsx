import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import { useContext, useEffect, useState } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { BoardState } from "system/GameStates/States";
import classes from "./ActionBoards.module.css";
import { TurnManager } from "system/GameStates/TurnManager";
import { getBoardElemFromRoom } from "pages/ingame/Center/ActionBoards/ActionBoardManager";
export default function ActionBoards(): JSX.Element {
  //TODO decode
  //ENUM
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const [boardElem, setBoardElem] = useState(<BaseBoard />);
  const boardState: BoardState = ctx.room.game.state.board;
  useEffect(() => {
    const currentTurnId = TurnManager.getCurrentPlayerId(ctx, localCtx);
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
    <div className={`${gc.round_border} ${classes.container}`}>{boardElem}</div>
  );
}
