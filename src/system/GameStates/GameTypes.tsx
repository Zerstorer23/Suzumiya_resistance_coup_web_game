import { BoardState } from "system/GameStates/States";

export type Player = {
  isSpectating: boolean; //may not need it
  lastActive: Object | number;
  name: string;
  icard: number;
  coins: number;
};
export type PlayerEntry = {
  id: string;
  player: Player;
};

export type GameAction = {
  pierId: string;
  targetId: string;
  challengerId: string;
  param?: any | undefined;
  time: Object | number;
};
export type TurnState = {
  turn: number;
  board: BoardState;
};
export type Game = {
  deck: string;
  action: GameAction;
  state: TurnState;
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
