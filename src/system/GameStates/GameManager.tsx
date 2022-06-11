import {
    GameAction,
    KillActionTypes,
    KillInfo,
    Player,
    PlayerEntry,
    PrevDiscardStates,
    SimpleRoom
} from "system/GameStates/GameTypes";
import "firebase/compat/database";
import {CardRole} from "system/cards/Card";
import {BoardState} from "system/GameStates/States";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";


export class GameManager {
    public static createGameAction(
        pierId: string,
        targetId = "",
        challengerId = ""
    ): GameAction {
        return {
            pierId,
            targetId,
            challengerId,
            param: "",
        };
    }

    public static copyGameAction(action: GameAction): GameAction {
        return {
            pierId: action.pierId,
            challengerId: action.challengerId,
            targetId: action.targetId,
            param: action.param,
        };
    }

    public static createKillInfo(cause: KillActionTypes, prevState: PrevDiscardStates, ownerId: string): KillInfo {
        return {
            cause,
            challengedCard: CardRole.None,
            prevState,
            ownerId,
            removed: [-1, -1],
            nextState: BoardState.ChoosingBaseAction
        };
    }

    public static createPlayerEntry(id: string, player: Player): PlayerEntry {
        return {id, player};
    }

    public static parseRoom(ctx: RoomContextType): SimpleRoom {
        return {
            game: ctx.room.game,
            deck: ctx.room.game.deck,
            action: ctx.room.game.action,
            turn: ctx.room.game.state.turn,
            board: ctx.room.game.state.board,
            playerList: ctx.room.playerList,
            playerMap: ctx.room.playerMap,
        };
    }
}
