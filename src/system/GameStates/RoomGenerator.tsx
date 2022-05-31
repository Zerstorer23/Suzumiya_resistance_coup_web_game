import {
  Game,
  GameAction,
  Player,
  PlayerMap,
  Room,
  RoomHeader,
  TurnState,
} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { getRandomSeed } from "system/GameConstants";
import { BoardState } from "system/GameStates/States";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";
import { DeckManager } from "system/cards/DeckManager";

export function getDefaultAction(): GameAction {
  return {
    pierId: "",
    targetId: "",
    challengerId: "",
    time: firebase.database.ServerValue.TIMESTAMP,
  };
}
export function getDefaultGame(): Game {
  return {
    deck: "",
    state: {
      turn: -1,
      board: BoardState.ChoosingBaseAction,
    },
    action: getDefaultAction(),
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

/**
 *
 * @param map
 * @returns Sorted list that is used for determining turns
 */
export function getSortedListFromMap(map: PlayerMap): string[] {
  const arr: string[] = [];
  map.forEach((_player, id) => {
    arr.push(id);
  });
  const sortedArr = arr.sort((e1: string, e2: string) =>
    e1 > e2 ? 1 : e1 < e2 ? -1 : 0
  );
  return sortedArr;
}
/**
 *
 * Called by Player Panel to initialise the game start state
 * @param room
 * @param playerList
 */
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
  const deck: string = DeckManager.generateStartingDeck(numPlayer);
  const state: TurnState = { turn: 0, board: BoardState.ChoosingBaseAction };
  ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
  ReferenceManager.updateReference(DbReferences.GAME_state, state);
}
