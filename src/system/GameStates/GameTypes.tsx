import {CardDeck, CardRole} from "system/cards/Card";
import {ActionType, BoardState} from "system/GameStates/States";

export type Player = {
    isSpectating: boolean; //may not need it
    lastActive: Object | number;
    lastClaimed: CardRole;
    name: string;
    icard: number;
    coins: number;
};
export type PlayerEntry = {
    id: string;
    player: Player;
};

export enum ChallengeState {
    Notify = "ntc",
}

export type KillActionTypes =
    ActionType.IsALie
    // | ActionType.DefendWithAmbassador
    // | ActionType.DefendWithCaptain
    | ActionType.Assassinate
    | ActionType.Coup;
export type KillInfo = {
    cause: KillActionTypes; //What caused this kill
    card: CardRole; //If lie, what was expected?
    ownerId: string; //id of player whos killed
    removed: number; //card index in deck that is removed. -1 when none chosne
    nextState: BoardState | ChallengeState; //
};
/*
* Coup = Coup / None / target / -1 / choose
* Assassin = Assassin / None/  target / -1  / choose
* Challengers = IsALie / susCard / target=sus / next = accepted if success / -1
* */
export type GameAction = {
    pierId: string;
    targetId: string;
    challengerId: string;
    param: CardRole | KillInfo | "";
    time: Object | number;
};
export type TurnState = {
    turn: number;
    board: BoardState;
};
export type Game = {
    deck: CardDeck;
    action: GameAction;
    state: TurnState;
};
export type RoomHeader = {
    seed: number;
    hostId: string;
};
export type PlayerMap = Map<string, Player>;
export type Room = {
    playerMap: PlayerMap;
    playerList: string[];
    game: Game;
    header: RoomHeader;
};
