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
import { Card, CardRole } from "system/cards/Card";

export function getDefaultAction(): GameAction {
  return {
    hostId: "",
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

//TODO make a sorted list by ID
export function getSortedListFromMap(map: PlayerMap): string[] {
  const arr: string[] = [];
  map.forEach((_player, id) => {
    arr.push(id);
  });

  //TODO how does string comparison wwork?
  const sortedArr = arr.sort((e1: string, e2: string) =>
    e1 > e2 ? 1 : e1 < e2 ? -1 : 0
  );
  return sortedArr;
}

function shuffleArray(array: any) {
  let curId = array.length;
  // There remain elements to shuffle
  while (0 !== curId) {
    // Pick a remaining element
    let randId = Math.floor(Math.random() * curId);
    curId -= 1;
    // Swap it with the current element.
    let tmp = array[curId];
    array[curId] = array[randId];
    array[randId] = tmp;
  }
  return array;
}

//TODO generate deck
function generateStartingDeck(numPlayers: number): string {
  let numCards = 15;
  if (numPlayers > 6) numCards = (numPlayers - 6) * 5 + 15;
  let arr = [];
  for (let i = 0; i < numCards / 5; i++) {
    arr.push("D");
    arr.push("C");
    arr.push("A");
    arr.push("T");
    arr.push("S");
  }
  arr = shuffleArray(arr);
  console.log(arr);

  return arr + "";
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
  const state: TurnState = { turn: 0, board: BoardState.ChoosingBaseAction };
  ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
  ReferenceManager.updateReference(DbReferences.GAME_state, state);
}
