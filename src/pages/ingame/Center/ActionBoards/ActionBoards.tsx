import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/BaseBoard/BaseBoard";
import WaitingBoard from "pages/ingame/Center/ActionBoards/WaitingBoard/WaitingBoard";
import { Fragment, useContext, useEffect } from "react";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { PlayerEntry } from "system/GameStates/GameTypes";
import { BoardState, readStateFromRoom } from "system/GameStates/States";
import classes from "./ActionBoards.module.css";

export default function ActionBoards(): JSX.Element {
  //TODO decode
  //ENUM
  const ctx = useContext(RoomContext);
  const localCtx = useContext(LocalContext);

  const boardState: BoardState = readStateFromRoom(
    ctx.room.game.pierAction.action,
    ctx.room.game.clientAction.action
  );
  let boardElem = <Fragment />;

  useEffect(() => {
    const playerList: PlayerEntry[] = localCtx.getVal(LocalField.SortedList);
    const currentTurn = ctx.room.game.currentTurn;
    const currentTurnId = playerList[currentTurn].id;
    const isMyTurn: boolean = currentTurnId === localCtx.getVal(LocalField.Id);
    if (isMyTurn) {
      switch (boardState) {
        case BoardState.ChoosingBaseAction:
          boardElem = <BaseBoard />;
          break;
        case BoardState.SolveActions:
          boardElem = <WaitingBoard />;
          break; //+1 / None
        case BoardState.CalledForeignAid:
          boardElem = <BaseBoard />;
          break; //+2 None
        case BoardState.CalledCoup:
          boardElem = <BaseBoard />;
          break; //coup None
        case BoardState.CalledDuke:
          boardElem = <BaseBoard />;
          break; //duke None
        case BoardState.CalledCaptain:
          boardElem = <BaseBoard />;
          break; //captain None
        case BoardState.CalledAssassin:
          boardElem = <BaseBoard />;
          break; //assassin None
        case BoardState.CalledAmbassador:
          boardElem = <BaseBoard />;
          break; //amba None
        case BoardState.ContessaBlockedAssassin:
          boardElem = <BaseBoard />;
          break; //assassin contessa
        case BoardState.ReactionIsALie:
          boardElem = <BaseBoard />;
          break; //lie any
        case BoardState.CaptainBlockedCaptain:
          boardElem = <BaseBoard />;
          break; //Cap Cap
        case BoardState.AmbassadorBlockedCaptain:
          boardElem = <BaseBoard />;
          break; //Cap Amba
        case BoardState.PierIsALie:
          boardElem = <BaseBoard />;
          break; //Any Lie
        case BoardState.Exception:
          boardElem = <BaseBoard />;
          break;
      }
    } else {
      switch (boardState) {
        case BoardState.ChoosingBaseAction:
          boardElem = <BaseBoard />;
          break;
        case BoardState.SolveActions:
          boardElem = <BaseBoard />;
          break; //+1 / None
        case BoardState.CalledForeignAid:
          boardElem = <BaseBoard />;
          break; //+2 None
        case BoardState.CalledCoup:
          boardElem = <BaseBoard />;
          break; //coup None
        case BoardState.CalledDuke:
          boardElem = <BaseBoard />;
          break; //duke None
        case BoardState.CalledCaptain:
          boardElem = <BaseBoard />;
          break; //captain None
        case BoardState.CalledAssassin:
          boardElem = <BaseBoard />;
          break; //assassin None
        case BoardState.CalledAmbassador:
          boardElem = <BaseBoard />;
          break; //amba None
        case BoardState.ContessaBlockedAssassin:
          boardElem = <BaseBoard />;
          break; //assassin contessa
        case BoardState.ReactionIsALie:
          boardElem = <BaseBoard />;
          break; //lie any
        case BoardState.CaptainBlockedCaptain:
          boardElem = <BaseBoard />;
          break; //Cap Cap
        case BoardState.AmbassadorBlockedCaptain:
          boardElem = <BaseBoard />;
          break; //Cap Amba
        case BoardState.PierIsALie:
          boardElem = <BaseBoard />;
          break; //Any Lie
        case BoardState.Exception:
          boardElem = <BaseBoard />;
          break;
      }
    }
  }, [boardState]);

  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <div className={classes.header}>Do my action...</div>
      {boardElem}
    </div>
  );
}
