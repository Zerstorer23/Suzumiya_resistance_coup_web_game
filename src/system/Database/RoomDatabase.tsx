import { db } from "system/Database/Firebase";
import { DB_PLAYER, joinLocalPlayer } from "system/Database/PlayerDatabase";
import { Game, GameAction, Player, Room } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import { randomInt } from "system/GameConstants";
import {
  DbRef,
  GameListenerMap,
  PlayerListenerMap,
  voidReturn,
} from "system/types/CommonTypes";

export const DB_GAME = "game";

export function getDefaultAction(): GameAction {
  return {
    id: "",
    action: 0,
    time: firebase.database.ServerValue.TIMESTAMP,
  };
}
export function getDefaultGame(): Game {
  return {
    currentTurn: -1,
    deck: "",
    pierAction: getDefaultAction(),
    clientAction: getDefaultAction(),
    seed: randomInt(0, 100),
  };
}

export async function setUpGame() {
  const gameRef = db.ref(DB_GAME);
  const game = getDefaultGame();
  gameRef.set(game);
  await joinLocalPlayer();
}

export async function joinLobby() {
  await joinLocalPlayer();
}

export async function loadRoom(onLoaded: (data: Room | null) => void) {
  const roomRef = db.ref("/");
  const snapshot = await roomRef.get();
  if (!snapshot.exists()) {
    console.log("no data");
    onLoaded(null);
  } else {
    const data = snapshot.val();
    console.log(data);
    const players = data.players;
    const game = data.game;
    const playerList: Player[] = [];
    for (const k in players) {
      playerList.push({
        id: k,
        name: players[k].name,
        cards: players[k].cards,
        coins: players[k].coins,
        isConnected: players[k].isConnected,
        isSpectating: players[k].isSpectating,
        lastActive: players[k].lastActive,
      });
    }
    const room: Room = {
      playerList,
      game: {
        deck: game.deck,
        currentTurn: game.currentTurn,
        pierAction: game.pierAction,
        clientAction: game.clientAction,
        seed: game.randomSeed,
      },
      hostId: data.hostId,
    };

    onLoaded(room);
  }
}
export type LobbyReferences = {
  room: Room;
  listenerMap: PlayerListenerMap;
};
export async function loadAndListenLobby(): Promise<LobbyReferences | null> {
  const roomRef = db.ref("/");
  const snapshot = await roomRef.get();
  const listenerMap = new Map<string, firebase.database.Reference>();

  if (!snapshot.exists()) {
    console.log("no data");
    return null;
  } else {
    const data = snapshot.val();
    console.log(data);
    const players = data.players;
    const game = data.game;
    const playerList: Player[] = [];

    for (const k in players) {
      const playerRef = db.ref(`/${DB_PLAYER}/${k}`);
      playerList.push({
        id: k,
        name: players[k].name,
        cards: players[k].cards,
        coins: players[k].coins,
        isConnected: players[k].isConnected,
        isSpectating: players[k].isSpectating,
        lastActive: players[k].lastActive,
      });
      listenerMap.set(k, playerRef);
    }
    let room: Room = {
      playerList,
      game: {
        deck: game.deck,
        currentTurn: game.currentTurn,
        pierAction: game.pierAction,
        clientAction: game.clientAction,
        seed: game.randomSeed,
      },
      hostId: data.hostId,
    };
    return { room, listenerMap };
  }
}

export async function loadAndListenGame(
  onLoaded: (
    data: Room,
    listenerMap: PlayerListenerMap,
    gameListenerMap: GameListenerMap
  ) => void,
  onFail: voidReturn
) {
  const roomRef = db.ref("/");
  const snapshot = await roomRef.get();
  if (!snapshot.exists()) {
    console.log("no data");
    onFail();
  } else {
    const data = snapshot.val();
    console.log(data);
    const players = data.players;
    const game = data.game;
    const playerList: Player[] = [];

    const listenerMap = new Map<string, firebase.database.Reference>();
    for (const k in players) {
      const playerRef = db.ref(`/${DB_PLAYER}/${k}`);
      playerList.push({
        id: k,
        name: players[k].name,
        cards: players[k].cards,
        coins: players[k].coins,
        isConnected: players[k].isConnected,
        isSpectating: players[k].isSpectating,
        lastActive: players[k].lastActive,
      });
      listenerMap.set(k, playerRef);
    }
    const room: Room = {
      playerList,
      game: {
        deck: game.deck,
        currentTurn: game.currentTurn,
        pierAction: game.pierAction,
        clientAction: game.clientAction,
        seed: game.randomSeed,
      },
      hostId: data.hostId,
    };

    const gameRefUrl = `/${DB_GAME}`;
    const gameListener: GameListenerMap = {
      deckListener: db.ref(`${gameRefUrl}/deck`),
      pierListener: db.ref(`${gameRefUrl}/pierAction`),
      clientListener: db.ref(`${gameRefUrl}/clientAction`),
      seedListener: db.ref(`${gameRefUrl}/seed`),
      turnListener: db.ref(`${gameRefUrl}/currentTurn`),
    };

    onLoaded(room, listenerMap, gameListener);
  }
}
