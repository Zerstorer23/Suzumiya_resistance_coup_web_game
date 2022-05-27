import {
  Game,
  GameAction,
  Player,
  PlayerMap,
  Room,
  RoomHeader,
} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getRandomSeed } from "system/GameConstants";
import { ActionType } from "system/GameStates/States";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
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
export function getSortedListFromMap(map: PlayerMap): string[] {
  const arr: string[] = [];
  map.forEach((_player, id) => {
    arr.push(id);
  });

  //TODO how does string comparison wwork?
  const sortedArr = arr.sort((e1: string, e2: string) => {
    return e1 > e2 ? 1 : e1 < e2 ? -1 : 0;
    // if (e1 > e2) {
    //   return 1;
    // }
    // if (e1 < e2) {
    //   return -1;
    // }
    // return 0;
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

export function setStartingRoom(room: Room, playerList: string[]) {
  const numPlayer = room.playerMap.size;
  //Set Header
  ReferenceManager.updateReference(DbReferences.HEADER_seed, getRandomSeed());
  //Set Player Cards
  playerList.forEach((playerId, index) => {
    const player = room.playerMap.get(playerId)!;
    player.coins = 2;
    player.icard = index * 2;
    player.isSpectating = false;
    ReferenceManager.updatePlayerReference(playerId, player);
  });
  //Set Room
  const deck: string = generateStartingDeck(numPlayer);
  ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
  ReferenceManager.updateReference(DbReferences.GAME_currentTurn, 0);
}
