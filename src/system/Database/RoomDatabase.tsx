import { db } from "system/Database/Firebase";
import { joinLocalPlayer } from "system/Database/PlayerDatabase";
import {
  Game,
  GameAction,
  Player,
  PlayerMap,
  Room,
  RoomHeader,
} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import { randomInt } from "system/GameConstants";
import { DbRef, Listeners, ListenerTypes } from "system/types/CommonTypes";
import { ActionType } from "system/GameStates/States";

export const DB_GAME = "/game";
export const DB_GAME_deck = `${DB_GAME}/deck`;
export const DB_GAME_currentTurn = `${DB_GAME}/currentTurn`;
export const DB_GAME_pierAction = `${DB_GAME}/pierAction`;
export const DB_GAME_clientAction = `${DB_GAME}/clientAction`;
export const DB_PLAYERS = `/playerMap`;
export const DB_HEADER = `/header`;
export const DB_HEADER_hostId = `${DB_HEADER}/hostId`;
export const DB_HEADER_seed = `${DB_HEADER}/seed`;

export function getDefaultAction(): GameAction {
  return {
    id: "",
    action: ActionType.None,
    time: firebase.database.ServerValue.TIMESTAMP,
  };
}
export function getDefaultGame(): Game {
  return {
    currentTurn: -1,
    deck: "",
    pierAction: getDefaultAction(),
    clientAction: getDefaultAction(),
  };
}
export function getDefaultHeader(): RoomHeader {
  return {
    hostId: "",
    seed: randomInt(0, 100),
  };
}
export function getDefaultRoom(): Room {
  return {
    playerMap: new Map<string, Player>(),
    game: getDefaultGame(),
    header: getDefaultHeader(),
  };
}
export async function initialiseRoom() {
  const roomRef = db.ref("/");
  const defaultRoom = getDefaultRoom();
  await roomRef.set(defaultRoom);
  const myId = await joinLocalPlayer(true);
  return myId;
}

export async function joinLobby(): Promise<string> {
  return await joinLocalPlayer(false);
}

export async function loadRoom(): Promise<Room> {
  const roomRef = db.ref("/");
  const snapshot = await roomRef.get();
  if (!snapshot.exists()) {
    console.log("no data");
    return getDefaultRoom();
  } else {
    const room: Room = snapshot.val();
    if (room["playerMap"] === undefined) {
      room.playerMap = new Map<string, Player>();
    } else {
      room.playerMap = parsePlayerMap(room.playerMap);
    }
    return room;
  }
}

function parseGame(listeners: Listeners) {
  const deckRef = db.ref(DB_GAME_deck);
  const turnRef = db.ref(DB_GAME_currentTurn);
  const pierRef = db.ref(DB_GAME_pierAction);
  const clientRef = db.ref(DB_GAME_clientAction);

  listeners.set(ListenerTypes.Deck, deckRef);
  listeners.set(ListenerTypes.Turn, turnRef);
  listeners.set(ListenerTypes.Pier, pierRef);
  listeners.set(ListenerTypes.Client, clientRef);
}
function parseHeader(listeners: Listeners) {
  const headerRef = db.ref(DB_HEADER);
  listeners.set(ListenerTypes.Header, headerRef);

  const playersRef = db.ref(DB_PLAYERS);
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
// export async function loadAndListenLobby(): Promise<RoomStateType | null> {
//   //TODO DONT EVEN LOAD>
//   //JUST LISTEN
//   const roomRef = db.ref("/");
//   const snapshot = await roomRef.get();
//   if (!snapshot.exists()) {
//     console.log("no data");
//     return null;
//   } else {
//     const room: Room = snapshot.val();
//     room.playerMap = parsePlayerMap(room.playerMap);
//     const listeners = parseListeners();
//     console.log("Loaded Room: ");
//     console.log(room);
//     return { room, listeners };
//   }
// }

export function registerListeners(): Listeners {
  const listeners = parseListeners();
  return listeners;
}
