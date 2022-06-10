import {Player} from "system/GameStates/GameTypes";
import {DbRef} from "system/types/CommonTypes";
import {ObjectPool} from "system/cards/ObjectPool";
import {db} from "system/Database/Firebase";

export enum DbReferences {
    ROOM = "/room",
    GAME = "/room/game",
    GAME_deck = `/room/game/deck`,
    GAME_state = `/room/game/state`,
    GAME_action = `/room/game/action`,
    PLAYERS = `/room/playerMap`,
    HEADER = `/room/header`,
    HEADER_hostId = `/room/header/hostId`,
    HEADER_seed = `/room/header/seed`,
    HEADER_games = `/room/header/games`,
    CHAT = "/chat",
    MUSIC = "/music",
    MUSIC_queue = "/music/queue",
    MUSIC_current = "/music/current",
    PLAYER_name = "name",
    PLAYER_isReady = "isReady",
    PLAYER_wins = "wins",
}

/**
 * Reference Manager is responsible for
 * uploading data to Firebase.
 */
class _RefPool extends ObjectPool<string, DbRef> {
    instantiate(key: string): DbRef {
        return db.ref(key);
    }
}

export const RefPool = new _RefPool();

export class ReferenceManager {
    /**
     * @param field
     * @param value
     * UPdates a single value
     */
    public static updateReference<T>(field: DbReferences, value: T) {
        const ref = ReferenceManager.getRef(field);
        ref.set(value);
    }

    /**
     *
     * @param playerId
     * @param player
     * UPdates a player
     */
    public static updatePlayerReference(playerId: string, player: Player) {
        const ref = ReferenceManager.getPlayerReference(playerId);
        ref.set(player);
    }

    public static getRoomRef(): DbRef {
        return ReferenceManager.getRef(DbReferences.ROOM);
    }

    public static getRef(refName: DbReferences): DbRef {
        //NOTE USE DB TAGS
        return RefPool.get(refName);

    }

    public static getPlayerReference(playerId: string): DbRef {
        return RefPool.get(`${DbReferences.PLAYERS}/${playerId}`);
    }

    public static getPlayerFieldReference(playerId: string, ref: DbReferences): DbRef {
        return RefPool.get(`${DbReferences.PLAYERS}/${playerId}/${ref}`);
    }

    public static updatePlayerFieldReference(playerId: string, tag: DbReferences, value: any) {
        const ref = ReferenceManager.getPlayerFieldReference(playerId, tag);
        ref.set(value);
    }
}
