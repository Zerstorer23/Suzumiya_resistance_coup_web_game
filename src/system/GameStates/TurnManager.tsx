import {
    LocalContextType,
    LocalField,
} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/room-context";
import {getNullable} from "system/GameConstants";
import {Player, TurnState} from "system/GameStates/GameTypes";
import {BoardState} from "system/GameStates/States";

export enum PlayerType {
    Pier,
    Target,
    Challenger,
}

export const TurnManager = {
    endTurn(): TurnState {
        return {
            board: BoardState.ChoosingBaseAction,
            turn: TurnManager.getNextTurn(),
        };
    },
    /**
     *
     * @returns TODO: use room hash to get first player
     */
    getFirstTurn(): number {
        return 0;
    },
    /**
     *
     * @returns Get next safe turn
     */
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
    /**
     *
     * @param ctx
     * @param localCtx
     * @returns this turn player's id
     */
    getCurrentPlayerId(ctx: RoomContextType, localCtx: LocalContextType) {
        return localCtx.getVal(LocalField.SortedList)[ctx.room.game.state.turn];
    },
    /**
     *
     * @param localCtx
     * @returns next turn player's id
     */
    getNextPlayerId(localCtx: LocalContextType) {
        const nextTurn = this.getNextTurn();
        return localCtx.getVal(LocalField.SortedList)[nextTurn];
    },
    /**
     *
     * @param ctx
     * @param localCtx
     * @returns is this turn MY turn?
     */
    isMyTurn(ctx: RoomContextType, localCtx: LocalContextType) {
        return (
            localCtx.getVal(LocalField.Id) === this.getCurrentPlayerId(ctx, localCtx)
        );
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
        const myId = localCtx.getVal(LocalField.Id);
        const localPlayer = ctx.room.playerMap.get(myId)!;
        return [myId, localPlayer];
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
