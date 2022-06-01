import {CardRole} from "system/cards/Card";
import {BoardState} from "system/GameStates/States";
import {ChallengeSolvingState} from "system/types/CommonTypes";

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

export type ChallengedStateInfo = {
    state: ChallengeSolvingState;
    with: CardRole | null;
    selected: CardRole | null;
};
export type GameAction = {
    pierId: string;
    targetId: string;
    challengerId: string;
    param: any;
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
