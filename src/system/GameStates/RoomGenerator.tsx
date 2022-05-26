import {
  Game,
  GameAction,
  Player,
  PlayerEntry,
  PlayerMap,
  Room,
  RoomHeader,
} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getRandomSeed, randomInt } from "system/GameConstants";
import { ActionType } from "system/GameStates/States";
import {
  DB_GAME_currentTurn,
  DB_GAME_deck,
  DB_HEADER_seed,
  updatePlayerReference,
  updateReference,
} from "system/Database/RoomDatabase";
export function getDefaultAction(): GameAction {
  return {
    srcId: "", //NOTE set when press action button
    dstId: "",
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
    seed: getRandomSeed(),
  };
}
export function getDefaultRoom(): Room {
  return {
    playerMap: new Map<string, Player>(),
    game: getDefaultGame(),
    header: getDefaultHeader(),
  };
}

//TODO make a sorted list by ID
export function getSortedListFromMap(map: PlayerMap): PlayerEntry[] {
  const arr: PlayerEntry[] = [];
  map.forEach((player, key) => {
    const e: PlayerEntry = {
      id: key,
      player,
    };
    arr.push(e);
  });
  //TODO how does string comparison wwork?
  const sortedArr = arr.sort((e1: PlayerEntry, e2: PlayerEntry) => {
    if (e1.id > e2.id) {
      return 1;
    }

    if (e1.id < e2.id) {
      return -1;
    }

    return 0;
  });

  return sortedArr;
}

//TODO generate deck
function generateStartingDeck(numPlayers: number): string {
  return "?";
}
function getStartingGame(deck: string): Game {
  return {
    currentTurn: 0,
    deck: deck,
    pierAction: getDefaultAction(),
    clientAction: getDefaultAction(),
  };
}

export function setStartingRoom(room: Room, playerList: PlayerEntry[]) {
  const numPlayer = room.playerMap.size;
  //Set Header
  updateReference(DB_HEADER_seed, getRandomSeed());
  //Set Player Cards
  playerList.forEach((playerEntry, index) => {
    const player = playerEntry.player;
    player.coins = 2;
    player.icard = index * 2;
    player.isSpectating = false;
    updatePlayerReference(playerEntry.id, player);
  });
  //Set Room
  const deck: string = generateStartingDeck(numPlayer);
  updateReference(DB_GAME_deck, deck);
  updateReference(DB_GAME_currentTurn, 0);
}
