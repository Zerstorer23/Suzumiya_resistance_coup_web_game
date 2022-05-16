export type Player = {
  isSpectating: boolean;
  isConnected: boolean;
  lastActive: Object;
  id: string;
  name: string;
  cards: number;
  coins: number;
};
export type GameAction = {
  id: string;
  action: number;
  time: Object;
};
export type Game = {
  deck: string;
  currentTurn: number;
  pierAction: GameAction;
  clientAction: GameAction;
  seed: number;
};

export type Room = {
  playerList: Player[];
  game: Game;
  hostId: string | null;
};
