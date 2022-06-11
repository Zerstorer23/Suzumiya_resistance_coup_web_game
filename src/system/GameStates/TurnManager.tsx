import {LocalContextType, LocalField,} from "system/context/localInfo/local-context";
import {getNullable} from "system/GameConstants";
import {Player, PlayerEntry, PlayerMap} from "system/GameStates/GameTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";

export enum PlayerType {
    Pier,
    Target,
    Challenger,
    CurrentTurn,
}

export class TurnManager {
    /**
     *
     * @returns  use room hash to get first player
     */
    public static getFirstTurn(seed: number, playerSize: number): number {
        return seed % playerSize;
    }

    /**
     *
     * @returns Get next safe turn
     */
    public static getNextTurn(playerMap: PlayerMap, playerList: string[], turn: number, startWithIncrement = true): number {
        let newTurn = (startWithIncrement) ? turn + 1 : turn;
        newTurn %= playerList.length;
        let currPlayer = playerMap.get(playerList[newTurn]);
        while (currPlayer?.isSpectating) {
            newTurn = (newTurn + 1) % playerList.length;
            currPlayer = playerMap.get(playerList[newTurn]);
        }
        return newTurn;
    }

    public static amHost(ctx: RoomContextType, localCtx: LocalContextType) {
        const myId = localCtx.getVal(LocalField.Id);
        return ctx.room.header.hostId === myId;
    }

    /**
     *
     * @param ctx
     * @returns this turn player's id
     */
    public static getCurrentPlayerId(ctx: RoomContextType) {
        return ctx.room.playerList[ctx.room.game.state.turn];
    }

    /**
     *
     * @param ctx
     * @returns next turn player's id
     */
    public static getNextPlayerId(ctx: RoomContextType) {
        const nextTurn = this.getNextTurn(
            ctx.room.playerMap,
            ctx.room.playerList,
            ctx.room.game.state.turn
        );
        return ctx.room.playerList[nextTurn];
    }

    /**
     *
     * @param ctx
     * @param localCtx
     * @returns is this turn MY turn?
     */
    public static isMyTurn(ctx: RoomContextType, localCtx: LocalContextType) {
        return localCtx.getVal(LocalField.Id) === this.getCurrentPlayerId(ctx);
    }

    /**
     *
     * @param ctx
     * @param localCtx
     * @returns My player Id , my Player
     */
    public static getMyInfo(
        ctx: RoomContextType,
        localCtx: LocalContextType
    ): PlayerEntry {
        return this.getPlayerInfoById(ctx, localCtx.getVal(LocalField.Id));
    }

    public static getPlayerInfo(
        ctx: RoomContextType,
        playerType: PlayerType
    ): PlayerEntry {
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
            case PlayerType.CurrentTurn:
                playerId = ctx.room.playerList[ctx.room.game.state.turn];
                break;
        }
        return this.getPlayerInfoById(ctx, playerId);
    }

    public static getPlayerInfoById(ctx: RoomContextType, playerId: string): PlayerEntry {
        const player = ctx.room.playerMap.get(playerId)!;
        return {id: playerId, player};
    }

    /**
     *
     * @param ctx
     * @returns Players who are related to this game,
     * Pier, Target, Challenger
     */
    public static getShareholders(
        ctx: RoomContextType
    ): [Player | null, Player | null, Player | null] {
        const action = ctx.room.game.action;
        const playerMap = ctx.room.playerMap;
        const pier = getNullable<Player>(playerMap, action.pierId);
        const target = getNullable<Player>(playerMap, action.targetId);
        const challenger = getNullable<Player>(playerMap, action.challengerId);
        return [pier, target, challenger];
    }

}
