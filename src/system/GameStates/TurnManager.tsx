import {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import { getNullable } from "system/GameConstants";
import { Player } from "system/GameStates/GameTypes";
import { RoomContextType } from "system/context/roomInfo/RoomContextProvider";

export enum PlayerType {
  Pier,
  Target,
  Challenger,
  CurrentTurn,
}

export const TurnManager = {
  /**
   *
   * @returns  use room hash to get first player
   */
  getFirstTurn(seed: number, playerSize: number): number {
    return seed % playerSize;
  },
  /**
   *
   * @returns Get next safe turn
   */
  getNextTurn(ctx: RoomContextType, curr: number, playerSize: number): number {
    curr = (curr + 1) % playerSize;
    let currID = ctx.room.playerList[curr];
    let currPlayer = ctx.room.playerMap.get(currID);
    while (currPlayer!.isSpectating) {
      curr = (curr + 1) % playerSize;
      currID = ctx.room.playerList[curr];
      currPlayer = ctx.room.playerMap.get(currID);
    }
    console.log("current turn:" + curr);
    return curr;
  },

  modifyTurn(ctx: RoomContextType, curr: number, playerSize: number): number {
    let currID = ctx.room.playerList[curr];
    let currPlayer = ctx.room.playerMap.get(currID);
    while (currPlayer!.isSpectating) {
      curr = (curr + 1) % playerSize;
      currID = ctx.room.playerList[curr];
      currPlayer = ctx.room.playerMap.get(currID);
    }
    return curr;
  },
  /**
   *
   * @param ctx
   * @param localCtx
   * @returns this turn player's id
   */
  getCurrentPlayerId(ctx: RoomContextType) {
    return ctx.room.playerList[ctx.room.game.state.turn];
  },
  /**
   *
   * @param ctx
   * @returns next turn player's id
   */
  getNextPlayerId(ctx: RoomContextType) {
    const nextTurn = this.getNextTurn(
      ctx,
      ctx.room.game.state.turn,
      ctx.room.playerMap.size
    );
    return ctx.room.playerList[nextTurn];
  },
  /**
   *
   * @param ctx
   * @param localCtx
   * @returns is this turn MY turn?
   */
  isMyTurn(ctx: RoomContextType, localCtx: LocalContextType) {
    return localCtx.getVal(LocalField.Id) === this.getCurrentPlayerId(ctx);
  },
  /**
   *
   * @param ctx
   * @param localCtx
   * @returns My player Id , my Player
   */
  getMyInfo(
    ctx: RoomContextType,
    localCtx: LocalContextType
  ): [string, Player] {
    return this.getPlayerInfoById(ctx, localCtx.getVal(LocalField.Id));
  },
  getPlayerInfo(
    ctx: RoomContextType,
    playerType: PlayerType
  ): [string, Player] {
    let playerId = "";
    switch (playerType) {
      case PlayerType.Pier:
        playerId = ctx.room.game.action.pierId;
        break;
      case PlayerType.Target:
        playerId = ctx.room.game.action.targetId;
        break;
      case PlayerType.Challenger:
        playerId = ctx.room.game.action.challengerId;
        break;
    }
    return this.getPlayerInfoById(ctx, playerId);
  },
  getPlayerInfoById(ctx: RoomContextType, playerId: string): [string, Player] {
    const player = ctx.room.playerMap.get(playerId)!;
    return [playerId, player];
  },
  /**
   *
   * @param ctx
   * @returns Players who are related to this game,
   * Pier, Target, Challenger
   */
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
