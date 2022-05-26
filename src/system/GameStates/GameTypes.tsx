import { ActionType } from "system/GameStates/States";

export type Player = {
  isSpectating: boolean; //may not need it
  isConnected: boolean;
  lastActive: Object;
  name: string;
  fcard: string; //TODO chance to icard : number
  scard: string; //TODO remove
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
