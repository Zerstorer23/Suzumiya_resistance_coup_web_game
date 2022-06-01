import {CardRole} from "system/cards/Card";
import {BoardState} from "system/GameStates/States";
import {ChallengeState} from "system/types/CommonTypes";

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
export type RemovedCard = {
    idx: number;//-1 if unchosen yet.
    playerId: string;
}
export type ChallengeInfo = {
    state: ChallengeState;
    susCard: CardRole;
};
export type GameAction = {
    pierId: string;
    targetId: string;
    challengerId: string;
    param: string | RemovedCard | ChallengeInfo;
    time: Object | number;
};
export type TurnState = {
    turn: number;
    board: BoardState;
};
export type Game = {
    deck: CardRole[];
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
