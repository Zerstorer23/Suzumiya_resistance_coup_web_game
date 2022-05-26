import { ActionType } from "system/GameStates/States";

export type Player = {
  isSpectating: boolean; //may not need it
  lastActive: Object;
  name: string;
  icard: number;
  coins: number;
};
export type PlayerEntry = {
  id: string;
  player: Player;
};

export type GameAction = {
  srcId: string;
  dstId: string;
  action: ActionType;
  time: Object;
};
export type Game = {
  deck: string;
  currentTurn: number;
  pierAction: GameAction;
  clientAction: GameAction;
};
export type RoomHeader = {
  seed: number;
  hostId: string | null;
};
export type PlayerMap = Map<string, Player>;
export type Room = {
  playerMap: PlayerMap;
  game: Game;
  header: RoomHeader;
};
