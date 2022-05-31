import { proceedTurn } from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import { LocalContextType } from "system/context/localInfo/local-context";
import { RoomContextType } from "system/context/room-context";
import { ReferenceManager } from "system/Database/RoomDatabase";
import { TurnManager } from "system/GameStates/TurnManager";

/*
Get 2 : ?GetTwo-> [CalledGetTwo: Wait] 
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
*/

export function handleGetTwo(ctx: RoomContextType, localCtx: LocalContextType) {
  const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  console.log("Solve get two");
  localPlayer.coins += 2;
  ReferenceManager.updatePlayerReference(myId, localPlayer);
  proceedTurn();
}

export function handleGetThree(
  ctx: RoomContextType,
  localCtx: LocalContextType
) {}
export function handleSteal(ctx: RoomContextType, localCtx: LocalContextType) {}
export function handleAssassinate(
  ctx: RoomContextType,
  localCtx: LocalContextType
) {}
export function handleContessa(
  ctx: RoomContextType,
  localCtx: LocalContextType
) {}
