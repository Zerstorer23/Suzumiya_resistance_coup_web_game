import {joinLocalPlayer} from "system/Database/PlayerDatabase";
import {Player, PlayerMap, Room} from "system/GameStates/GameTypes";
import {getDefaultRoom, getSortedListFromMap,} from "system/GameStates/RoomGenerator";
import {DbRef, Listeners, ListenerTypes} from "system/types/CommonTypes";
import {ActionType} from "system/GameStates/States";
import {CardRole} from "system/cards/Card";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";


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