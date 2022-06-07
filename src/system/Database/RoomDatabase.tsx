import {db} from "system/Database/Firebase";
import {joinLocalPlayer} from "system/Database/PlayerDatabase";
import {Player, PlayerMap, Room} from "system/GameStates/GameTypes";
import {getDefaultRoom, getSortedListFromMap,} from "system/GameStates/RoomGenerator";
import {DbRef, Listeners, ListenerTypes} from "system/types/CommonTypes";
import {ActionType} from "system/GameStates/States";
import {CardRole} from "system/cards/Card";

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
}

/**
 * Reference Manager is responsible for
 * uploading data to Firebase.
 */
const RefPool = new Map<string, DbRef>();

function queryRef(tag: string): DbRef {
    if (!RefPool.has(tag)) {
        RefPool.set(tag, db.ref(tag));
    }
    return RefPool.get(tag)!;
}

export const ReferenceManager = {
    /**
     * @param field
     * @param value
     * UPdates a single value
     */
    updateReference<T>(field: DbReferences, value: T) {
        const ref = this.getRef(field);
        ref.set(value);
    },
    /**
     *
     * @param playerId
     * @param player
     * UPdates a player
     */
    updatePlayerReference(playerId: string, player: Player) {
        const ref = ReferenceManager.getPlayerReference(playerId);
        ref.set(player);
    },
    getRoomRef(): DbRef {
        return this.getRef(DbReferences.ROOM);
    },
    getRef(refName: DbReferences): DbRef {
        //NOTE USE DB TAGS
        return queryRef(refName);

    },
    getPlayerReference(playerId: string): DbRef {
        return queryRef(`${DbReferences.PLAYERS}/${playerId}`);
    },
};

export async function initialiseRoom(turn: number) {
    const roomRef = ReferenceManager.getRoomRef();
    const defaultRoom = getDefaultRoom();
    await roomRef.set(defaultRoom);
    return await joinLocalPlayer(turn, true);
}

export async function joinLobby(turn: number): Promise<string> {
    return await joinLocalPlayer(turn, false);
}

export async function loadRoom(): Promise<Room> {
    const roomRef = ReferenceManager.getRoomRef();
    const snapshot = await roomRef.get();
    if (!snapshot.exists()) {
        return getDefaultRoom();
    } else {
        const room: Room = snapshot.val();
        if (room["playerMap"] === undefined) {
            room.playerMap = new Map<string, Player>();
        }
        room.playerMap = parsePlayerMap(room.playerMap);
        room.playerList = getSortedListFromMap(room.playerMap);
        console.log("LOaded room");
        console.log(room);
        return room;
    }
}

function parseGame(listeners: Listeners) {
    listeners.set(
        ListenerTypes.Deck,
        ReferenceManager.getRef(DbReferences.GAME_deck)
    );
    listeners.set(
        ListenerTypes.State,
        ReferenceManager.getRef(DbReferences.GAME_state)
    );
    listeners.set(
        ListenerTypes.gameAction,
        ReferenceManager.getRef(DbReferences.GAME_action)
    );
}

function parseHeader(listeners: Listeners) {
    const headerRef = ReferenceManager.getRef(DbReferences.HEADER);
    listeners.set(ListenerTypes.Header, headerRef);

    const playersRef = ReferenceManager.getRef(DbReferences.PLAYERS);
    listeners.set(ListenerTypes.PlayerList, playersRef);
}

function parseListeners(): Listeners {
    const listeners = new Map<ListenerTypes, DbRef>();
    parseGame(listeners);
    parseHeader(listeners);
    return listeners;
}

function parsePlayerMap(roomMap: PlayerMap): PlayerMap {
    const playerMap = new Map<string, Player>();
    if (roomMap === undefined) return playerMap;
    Object.entries(roomMap).forEach(([key, value]) => {
        playerMap.set(key, value);
    });
    return playerMap;
}

export function registerListeners(): Listeners {
    return parseListeners();
}

export function playerClaimedRole(id: string, player: Player, action: ActionType) {
    switch (action) {
        case ActionType.Steal:
        case ActionType.DefendWithCaptain:
            player.lastClaimed = CardRole.Captain;
            break;
        case ActionType.GetThree:
            player.lastClaimed = CardRole.Duke;
            break;
        case ActionType.Assassinate:
            player.lastClaimed = CardRole.Assassin;
            break;
        case ActionType.ContessaBlocksAssassination:
            player.lastClaimed = CardRole.Contessa;
            break;
        case ActionType.DukeBlocksForeignAid:
            player.lastClaimed = CardRole.Duke;
            break;
        case ActionType.ChangeCards:
        case ActionType.DefendWithAmbassador:
            player.lastClaimed = CardRole.Ambassador;
            break;
        default:
            return;
    }
    ReferenceManager.updatePlayerReference(id, player);
}