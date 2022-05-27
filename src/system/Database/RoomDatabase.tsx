import { db } from "system/Database/Firebase";
import { joinLocalPlayer } from "system/Database/PlayerDatabase";
import { Player, PlayerMap, Room } from "system/GameStates/GameTypes";
import { getDefaultRoom } from "system/GameStates/RoomGenerator";
import { DbRef, Listeners, ListenerTypes } from "system/types/CommonTypes";
export enum DbReferences {
  ROOM = "/",
  GAME = "/game",
  GAME_deck = `/game/deck`,
  GAME_state = `/game/state`,
  GAME_pierAction = `/game/pierAction`,
  GAME_clientAction = `/game/clientAction`,
  PLAYERS = `/playerMap`,
  HEADER = `/header`,
  HEADER_hostId = `/header/hostId`,
  HEADER_seed = `/header/seed`,
}

export const ReferenceManager = {
  updateReference(field: DbReferences, value: any) {
    const ref = this.getRef(field);
    ref.set(value);
    // console.log(`set ${field} to ${value}`);
  },
  updatePlayerReference(playerId: string, player: Player) {
    const ref = ReferenceManager.getPlayerReference(playerId);
    ref.set(player);
  },
  getRoomRef(): DbRef {
    return this.getRef(DbReferences.ROOM);
  },
  getRef(refName: DbReferences): DbRef {
    //NOTE USE DB TAGS
    return db.ref(refName);
  },
  getPlayerReference(playerId: string): DbRef {
    return db.ref(`${DbReferences.PLAYERS}/${playerId}`);
  },
};

export async function initialiseRoom() {
  const roomRef = ReferenceManager.getRoomRef();
  const defaultRoom = getDefaultRoom();
  await roomRef.set(defaultRoom);
  const myId = await joinLocalPlayer(true);
  return myId;
}

export async function joinLobby(): Promise<string> {
  return await joinLocalPlayer(false);
}

export async function loadRoom(): Promise<Room> {
  const roomRef = ReferenceManager.getRoomRef();
  const snapshot = await roomRef.get();
  if (!snapshot.exists()) {
    console.log("no data");
    return getDefaultRoom();
  } else {
    // const val: any = snapshot.val();
    const room: Room = snapshot.val();
    console.log("Room val = ");
    console.log(room);
    if (room["playerMap"] === undefined) {
      room.playerMap = new Map<string, Player>();
    }
    room.playerMap = parsePlayerMap(room.playerMap);
    return room;
  }
}

function parseGame(listeners: Listeners) {
  const deckRef = ReferenceManager.getRef(DbReferences.GAME_deck);
  const turnRef = ReferenceManager.getRef(DbReferences.GAME_currentTurn); //db.r
  const pierRef = ReferenceManager.getRef(DbReferences.GAME_pierAction); // db.
  const clientRef = ReferenceManager.getRef(DbReferences.GAME_clientAction);

  listeners.set(ListenerTypes.Deck, deckRef);
  listeners.set(ListenerTypes.Turn, turnRef);
  listeners.set(ListenerTypes.Pier, pierRef);
  listeners.set(ListenerTypes.Client, clientRef);
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
  const listeners = parseListeners();
  return listeners;
}
