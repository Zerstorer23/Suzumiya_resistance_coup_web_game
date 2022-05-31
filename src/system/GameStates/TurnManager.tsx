import {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import { RoomContextType } from "system/context/room-context";
import { getNullable } from "system/GameConstants";
import { Player } from "system/GameStates/GameTypes";

export const TurnManager = {
  getFirstTurn(): number {
    return 0;
  },
  getNextTurn(): number {
    /*
     * ++
     * % size
     * push
     */
    /*
     * %size
     * use it
     */
    return 0;
  },
  getCurrentPlayerId(ctx: RoomContextType, localCtx: LocalContextType) {
    return localCtx.getVal(LocalField.SortedList)[ctx.room.game.state.turn];
  },
  getNextPlayerId(localCtx: LocalContextType) {
    const nextTurn = this.getNextTurn();
    return localCtx.getVal(LocalField.SortedList)[nextTurn];
  },
  isMyTurn(ctx: RoomContextType, localCtx: LocalContextType) {
    return (
      localCtx.getVal(LocalField.Id) === this.getCurrentPlayerId(ctx, localCtx)
    );
  },
  getMyInfo(
    ctx: RoomContextType,
    localCtx: LocalContextType
  ): [string, Player] {
    const myId = localCtx.getVal(LocalField.Id);
    const localPlayer = ctx.room.playerMap.get(myId)!;
    return [myId, localPlayer];
  },

  getShareholders(
    ctx: RoomContextType
  ): [Player | null, Player | null, Player | null] {
    const action = ctx.room.game.action;
    const playerMap = ctx.room.playerMap;
    const pier = getNullable<Player>(playerMap, action.pierId);
    const target = getNullable<Player>(playerMap, action.targetId);
    const challenger = getNullable<Player>(playerMap, action.challengerId);
    return [pier, target, challenger];
  },
};
