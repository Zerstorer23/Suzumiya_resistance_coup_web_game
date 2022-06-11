import {AcceptedStates, CalledStates, PrevDiscardStates} from "system/GameStates/GameTypes";

export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";


//Determined from pier and client action combination
export enum BoardState {
    ChoosingBaseAction,
    GetOneAccepted,
    CalledGetTwo,
    ForeignAidAccepted,
    CalledGetTwoBlocked,
    DukeBlocksAccepted,
    DukeBlocksChallenged,
    CalledCoup,
    CalledGetThree,
    GetThreeChallenged,
    GetThreeAccepted,
    CalledChangeCards,
    AmbassadorAccepted,
    AmbassadorChallenged,
    CalledSteal,
    StealAccepted,
    StealChallenged,
    StealBlocked,
    StealBlockAccepted,
    StealBlockChallenged,
    CalledAssassinate,
    AssassinateChallenged,
    AssassinBlocked,
    ContessaChallenged,
    ContessaAccepted,
    CalledInquisition,
    InquisitionAccepted,
    InquisitionChallenged,
    DiscardingCard,
    DiscardingFinished,
}

//These are actions that each player can make
export enum ActionType {
    None,
    GetOne,
    GetForeignAid,
    Coup,
    Steal,
    GetThree,
    Assassinate,
    ContessaBlocksAssassination,
    DukeBlocksForeignAid,
    ChangeCards,
    InquisiteCards,
    IsALie,
    DefendWithCaptain,
    DefendWithAmbassador,
    Accept,
}

export class StateManager {
    /*    isDiscardingState(state: BoardState): boolean {
            return state === BoardState.DiscardingCard || state === BoardState.DiscardingCard2;
        },*/
    public static pierIsBlocked(state: BoardState): boolean {
        /**
         * States that require HOST to react LIE or ACCEPT
         */
        switch (state) {
            case BoardState.CalledGetTwoBlocked:
            case BoardState.StealBlocked:
            case BoardState.AssassinBlocked:
                return true;
            default:
                return false;
        }
    }

    public static isCounterable(state: BoardState): boolean {
        /**
         * States that can be countered with LIE
         */
        switch (state) {
            case BoardState.CalledGetThree:
            case BoardState.CalledChangeCards:
            case BoardState.CalledSteal:
            case BoardState.CalledGetTwoBlocked:
            case BoardState.StealBlocked:
            case BoardState.CalledInquisition:
                return true;
            default:
                return false;
        }
    }

    public static isFinal(state: BoardState): boolean {
        /**
         * States that no require further actions
         * Just resolve and end turn
         */
        switch (state) {
            case BoardState.GetOneAccepted:
            case BoardState.ForeignAidAccepted:
            case BoardState.GetThreeAccepted:
            case BoardState.DukeBlocksAccepted:
            case BoardState.StealAccepted:
            case BoardState.StealBlockAccepted:
            case BoardState.ContessaAccepted:
            case BoardState.DukeBlocksChallenged:
            case BoardState.GetThreeChallenged:
            case BoardState.AmbassadorChallenged:
            case BoardState.StealChallenged:
            case BoardState.StealBlockChallenged:
            case BoardState.AssassinateChallenged:
            case BoardState.ContessaChallenged:
            case BoardState.InquisitionChallenged:
            case BoardState.InquisitionAccepted:
                return true;
            default:
                return false;
        }
    }

    public static isChallenged(state: BoardState): boolean {
        switch (state) {
            case BoardState.DukeBlocksChallenged:
            case BoardState.GetThreeChallenged:
            case BoardState.StealBlockChallenged:
            case BoardState.AssassinateChallenged:
            case BoardState.ContessaChallenged:
            case BoardState.AmbassadorChallenged:
            case BoardState.StealChallenged:
            case BoardState.InquisitionChallenged:
                return true;
            default:
                return false;
        }
    }

    public static targetIsChallenged(state: BoardState) {
        switch (state) {
            case BoardState.DukeBlocksChallenged:
            case BoardState.StealBlockChallenged:
            case BoardState.ContessaChallenged:
                return true;
            default:
                return false;
        }
    }

    public static isTargetableState(state: BoardState): boolean {
        /**
         * States that require TargetId set
         */
        switch (state) {
            case BoardState.CalledCoup:
            case BoardState.CalledSteal:
            case BoardState.CalledAssassinate:
            case BoardState.CalledInquisition:
                return true;
            default:
                return false;
        }
    }

    public static isTargetableAction(action: ActionType): boolean {
        /**
         * Actions that require TargetId set
         */
        switch (action) {
            case ActionType.Coup:
            case ActionType.Steal:
            case ActionType.Assassinate:
            case ActionType.InquisiteCards:
                return true;
            default:
                return false;
        }
    }

    public static getChallengedState(state: BoardState): PrevDiscardStates | null {
        /**
         * States that are after challenged
         */
        switch (state) {
            case BoardState.CalledGetThree:
                return BoardState.GetThreeChallenged;
            case BoardState.CalledChangeCards:
                return BoardState.AmbassadorChallenged;
            case BoardState.CalledSteal:
                return BoardState.StealChallenged;
            case BoardState.CalledAssassinate:
                return BoardState.AssassinateChallenged;
            case BoardState.CalledGetTwoBlocked:
                return BoardState.DukeBlocksChallenged;
            case BoardState.StealBlocked:
                return BoardState.StealBlockChallenged;
            case BoardState.AssassinBlocked:
                return BoardState.ContessaChallenged;
            case BoardState.CalledInquisition:
                return BoardState.InquisitionChallenged;
            default: //Exception
                console.log("Invalid State");
                return null;
        }
    }

    public static getAcceptedState(state: BoardState): AcceptedStates | null {
        /**
         * States that are after Accepted
         * Targettables, blocks,
         */
        switch (state) {
            //Targettables
            case BoardState.CalledCoup:
            case BoardState.CalledAssassinate:
                return BoardState.DiscardingCard;
            case BoardState.CalledSteal:
                return BoardState.StealAccepted;
            case BoardState.CalledGetTwo:
                return BoardState.ForeignAidAccepted;
            case BoardState.CalledChangeCards:
                return BoardState.AmbassadorAccepted;
            case BoardState.CalledGetThree:
                return BoardState.GetThreeAccepted;
            case BoardState.CalledInquisition:
                return BoardState.InquisitionAccepted;
            //Block calls
            case BoardState.AssassinBlocked:
                return BoardState.ContessaAccepted;
            case BoardState.CalledGetTwoBlocked:
                return BoardState.DukeBlocksAccepted;
            case BoardState.StealBlocked:
                return BoardState.StealBlockAccepted;
            default: //Exception
                return null;
        }
    }

    public static getCalledState(action: ActionType): CalledStates | null {
        switch (action) {
            case ActionType.GetOne:
                return BoardState.GetOneAccepted;
            case ActionType.GetForeignAid:
                return BoardState.CalledGetTwo;
            case ActionType.GetThree:
                return BoardState.CalledGetThree;
            case ActionType.ChangeCards:
                return BoardState.CalledChangeCards;
            case ActionType.Assassinate:
                return BoardState.CalledAssassinate;
            case ActionType.Coup:
                return BoardState.CalledCoup;
            case ActionType.Steal:
                return BoardState.CalledSteal;
            case ActionType.InquisiteCards:
                return BoardState.CalledInquisition;
            default:
                console.trace("INVALID BOARD");
                return null;
        }
    }
}

/*
State Table
?PierAction-> [next state]
/Client Action->[next state]
Final - Accepted / Challenged
Called -
[ChoosingBaseAction]
//None challengable
Get 1 : ?GetOne-> [GetOneAccepted : Solve Wait NextTurn]
Get 2 : ?GetTwo-> [CalledGetTwo: Wait]
                  Unchanged-> [*CalledGetTwoAccepted : Solve NextTurn]
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
                                                          [3sec let people knoww that it is challenge]
                                                          [Reveal Solve = determine who lost]
                                                          [Lost = He has to choose which to, show a new action]
                                                          [Reveal result , which card is discard]
Coup  : ?Coup-> [CalledCoup: Wait]
                /Accept->[Discard :param, Solve Wait NextTurn]
//==Anyone can challenge
Duke  : ?GetThree->[CalledGetThree: Wait]
                   Unchanged->  [CalledGetThreeAccepted : Solve NextTurn]
                  /Lie-> [GetThreeChallenged:-> *Discard Solve Wait NextTurn]
Ambassador: ?ChangeCards->[CalledChangeCards : Wait]
                          Unchallenged->[AmbassadorAccepted: Solve Wait NextTurn]
                          /Lie->        [AmbassadorChallenged: Solve Wait NextTurn]

Captain: ?Steal-> [CalledSteal:Wait]
                  /Accept->     [StealAccepted: Solve NextTurn]
                  /Lie->        [StealChallenged:Solve Wait NextTurn]
                  /Block;param->[StealBlocked: Wait]
                                ?Accept;param->[StealBlockedAccepted: Solve Wait NextTurn]
                                ?Lie;param->[StealBlockedChallenged: Solve Wait NextTurn]
Assassin: ?Assassin->[CalledAssassinate: Wait]
                      /Accept-> [*Discard :Solve Wait NextTurn]
                      /Lie->    [AssassinateChallenged:Solve Wait NextTurn]
                      /Block->  [AssassinateChallengedWithContessa : Wait]
                                        ?Lie->[ContessaChallenged:Solve Wait NextTurn]
                                        ?Accept->[ContessaAccepted:Solve Wait NextTurn]
Inquisitor: ?Inquisite->[CalledInquisition:Wait]
                        /Accept -> [InquisitionAccepted : solve]
                        /Lie -> [InquisitionChallenged : solve]
*/

