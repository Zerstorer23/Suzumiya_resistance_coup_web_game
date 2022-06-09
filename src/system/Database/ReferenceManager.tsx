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
    CHAT = "/chat",
    MUSIC = "/music",
    MUSIC_queue = "/music/queue",
    MUSIC_current = "/music/current",
    PLAYER_name = "name",
    PLAYER_isReady = "isReady",
}

/**
 * Reference Manager is responsible for
 * uploading data to Firebase.
 */
class RefPool extends ObjectPool<string, DbRef> {
    instantiate(key: string): DbRef {
        return db.ref(key);
    }
}

export const refPool = new RefPool();

class _ReferenceManager {
    /**
     * @param field
     * @param value
     * UPdates a single value
     */
    updateReference<T>(field: DbReferences, value: T) {
        const ref = this.getRef(field);
        ref.set(value);
    }

    /**
     *
     * @param playerId
     * @param player
     * UPdates a player
     */
    updatePlayerReference(playerId: string, player: Player) {
        const ref = this.getPlayerReference(playerId);
        ref.set(player);
    }

    getRoomRef(): DbRef {
        return this.getRef(DbReferences.ROOM);
    }

    getRef(refName: DbReferences): DbRef {
        //NOTE USE DB TAGS
        return refPool.get(refName);

    }

    getPlayerReference(playerId: string): DbRef {
        return refPool.get(`${DbReferences.PLAYERS}/${playerId}`);
    }

    getPlayerFieldReference(playerId: string, ref: DbReferences): DbRef {
        return refPool.get(`${DbReferences.PLAYERS}/${playerId}/${ref}`);
    }
}

export const ReferenceManager = new _ReferenceManager();