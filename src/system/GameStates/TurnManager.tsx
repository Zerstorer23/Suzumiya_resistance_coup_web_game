import {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import { RoomContextType } from "system/context/room-context";

export const TurnManager = {
  getFirstTurnId() {},
  getNextTurn(): number {
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
};
