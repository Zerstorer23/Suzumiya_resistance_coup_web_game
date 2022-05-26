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
import { randomInt } from "system/GameConstants";
import { ActionType } from "system/GameStates/States";
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

//TODO make a sorted list by ID
export function getSortedListFromMap(map: PlayerMap): Player[] {
  return [];
}

function setStartingPlayerMap(map: PlayerMap, deck: string): string {
  //TODO
  //set coints 2
  //distribute cards

  return "";
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

export function setStartingRoom(prevRoom: Room) {
  const numPlayer = prevRoom.playerMap.size;
  let deck: string = generateStartingDeck(numPlayer);
  deck = setStartingPlayerMap(prevRoom.playerMap, deck);
  prevRoom.game = getStartingGame(deck);
  prevRoom.header.seed = randomInt(0, 100);
  console.log("New map");
  console.log(prevRoom);
}
