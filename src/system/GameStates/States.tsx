import {Fragment} from "react";
import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/roomInfo/room-context";
import {WaitTime} from "system/GameConstants";

import {ChallengeInfo, GameAction, RemovedCard, TurnState} from "system/GameStates/GameTypes";
import {TurnManager} from "system/GameStates/TurnManager";
import {ChallengeState} from "system/types/CommonTypes";

export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";

/**
 *
 *    switch (board) {
      case BoardState.ChoosingBaseAction:
        break;
      case BoardState.GetOneAccepted:
        break;
      case BoardState.CalledGetTwo:
        break;
      case BoardState.AidBlocked:
        break;
      case BoardState.DukeBlocksAccepted:
        break;
      case BoardState.DukeBlocksChallenged:
        break;
      case BoardState.CalledCoup:
        break;
      case BoardState.CoupAccepted:
        break;
      case BoardState.CalledGetThree:
        break;
      case BoardState.GetThreeChallenged:
        break;
      case BoardState.CalledChangeCards:
        break;
      case BoardState.AmbassadorAccepted:
        break;
      case BoardState.AmbassadorChallenged:
        break;
      case BoardState.CalledSteal:
        break;
      case BoardState.StealAccepted:
        break;
      case BoardState.StealChallenged:
        break;
      case BoardState.StealBlocked:
        break;
      case BoardState.StealBlockAccepted:
        break;
      case BoardState.StealBlockChallenged:
        break;
      case BoardState.CalledAssassinate:
        break;
      case BoardState.AssissinateAccepted:
        break;
      case BoardState.AssassinateChallenged:
        break;
      case BoardState.AssassinBlocked:
        break;
      case BoardState.ContessaChallenged:
        break;
      case BoardState.ContessaAccepted:
        break;
    }
 */
//Determined from pier and client action combination
export enum BoardState {
    ChoosingBaseAction,
    GetOneAccepted,
    CalledGetTwo,
    CalledGetTwoBlocked,
    DukeBlocksAccepted,
    DukeBlocksChallenged,
    CalledCoup,
    CalledGetThree,
    GetThreeChallenged,
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
    DiscardingCard,
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
    IsALie,
    DefendWithCaptain,
    DefendWithAmbassador,
    Accept,
}

export const StateManager = {
    isBlockedState(state: BoardState): boolean {
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
    },
    isCounterable(state: BoardState): boolean {
        /**
         * States that can be countered with LIE
         */
        switch (state) {
            case BoardState.CalledGetThree:
            case BoardState.CalledChangeCards:
            case BoardState.CalledSteal:
            case BoardState.CalledAssassinate:
            case BoardState.CalledGetTwoBlocked:
            case BoardState.StealBlocked:
            case BoardState.AssassinBlocked:
                return true;
            default:
                return false;
        }
    },
    isFinal(state: BoardState): boolean {
        /**
         * States that no require further actions
         * Just resolve and end turn
         */
        switch (state) {
            case BoardState.GetOneAccepted:
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
            case BoardState.DiscardingCard:
                return true;
            default:
                return false;
        }
    },
    isChallenged(state: BoardState): boolean {
        switch (state) {
            case BoardState.DukeBlocksChallenged:
            case BoardState.GetThreeChallenged:
            case BoardState.StealBlockChallenged:
            case BoardState.AssassinateChallenged:
            case BoardState.ContessaChallenged:
            case BoardState.AmbassadorChallenged:
            case BoardState.StealChallenged:
                return true;
            default:
                return false;
        }
    },
    needToPromptCardLoss(state: BoardState, action: GameAction) {
    },
    isTargetableState(state: BoardState): boolean {
        /**
         * States that require TargetId set
         */
        switch (state) {
            case BoardState.CalledCoup:
            case BoardState.CalledSteal:
            case BoardState.CalledAssassinate:
                return true;
            default:
                return false;
        }
    },
    isTargetableAction(action: ActionType): boolean {
        /**
         * Actions that require TargetId set
         */
        switch (action) {
            case ActionType.Coup:
            case ActionType.Steal:
            case ActionType.Assassinate:
                return true;
            default:
                return false;
        }
    },
    getChallengedState(state: BoardState): BoardState | null {
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
            default: //Exception
                console.log("Invalid State");
                return null;
        }
    },

    getAcceptedState(state: BoardState): BoardState | null {
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
            case BoardState.CalledChangeCards:
                return BoardState.AmbassadorAccepted;
            //Block calls
            case BoardState.AssassinBlocked:
                return BoardState.ContessaAccepted;
            case BoardState.CalledGetTwoBlocked:
                return BoardState.DukeBlocksAccepted;
            case BoardState.StealBlocked:
                return BoardState.StealBlockAccepted;
            default: //Exception
                console.log("Invalid State");
                return null;
        }
    },
    getCalledState(action: ActionType): BoardState | null {
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
                return BoardState.GetOneAccepted;
            case ActionType.Coup:
                return BoardState.CalledGetTwo;
            case ActionType.Steal:
                return BoardState.CalledGetThree;
            default:
                return null;
        }
    },
    inferWaitTime(board: BoardState, action: GameAction): number {
        function inferChallengeTime(action: GameAction): WaitTime {
            const challInfo = action.param as ChallengeInfo;
            switch (challInfo.state) {
                case ChallengeState.Notify:
                    return WaitTime.WaitConfirms;
                case ChallengeState.Reveal:
                    return WaitTime.MakingDecision;
            }

        }

        function inferDiscardingTime(action: GameAction) {
            const removedInfo = action.param as RemovedCard;
            if (removedInfo.idx < 0) return WaitTime.MakingDecision;
            return WaitTime.WaitConfirms;
        }

        switch (board) {
            case BoardState.DiscardingCard:
                return inferDiscardingTime(action);
            case BoardState.AmbassadorChallenged:
            case BoardState.DukeBlocksChallenged:
            case BoardState.GetThreeChallenged:
            case BoardState.StealBlockChallenged:
            case BoardState.AssassinateChallenged:
                return inferChallengeTime(action);
            case BoardState.ChoosingBaseAction:
            case BoardState.CalledCoup:
            case BoardState.AmbassadorAccepted:
            case BoardState.StealChallenged:
            case BoardState.StealBlocked:
            case BoardState.CalledGetTwoBlocked:
            case BoardState.CalledAssassinate:
            case BoardState.AssassinBlocked:
                return WaitTime.MakingDecision;
            case BoardState.CalledGetTwo:
            case BoardState.CalledGetThree:
            case BoardState.CalledChangeCards:
            case BoardState.CalledSteal:
                return WaitTime.WaitReactions;
            case BoardState.GetOneAccepted:
            case BoardState.DukeBlocksAccepted:
            case BoardState.StealAccepted:
            case BoardState.StealBlockAccepted:
            case BoardState.ContessaChallenged:
            case BoardState.ContessaAccepted:
                return WaitTime.WaitConfirms;
        }
    },
    inferStateInfo(
        ctx: RoomContextType,
        localCtx: LocalContextType,
        isPier: boolean
    ): JSX.Element {
        const board = ctx.room.game.state.board;
        const [pier, target, challenger] = TurnManager.getShareholders(ctx);
        if (pier === null) return <Fragment/>;
        switch (board) {
            case BoardState.ChoosingBaseAction:
                return <Fragment>{`${pier.name} is choosing action ...`}</Fragment>;
            case BoardState.GetOneAccepted:
                return (
                    <Fragment>
                        {`${pier.name} claimed `}
                        <strong>income</strong>
                        {` \n receives 1 coin ...`}
                    </Fragment>
                );
            case BoardState.CalledGetTwo:
                return (
                    <Fragment>
                        {`${pier.name} claimed `}
                        <strong>foriegn aid</strong>
                        <br/>
                        {`\n Any rejections?...`}
                    </Fragment>
                );
            case BoardState.CalledGetTwoBlocked:
                return isPier ? (
                    <Fragment>
                        {`${pier.name} is deciding if he wants to challenge it...`}
                    </Fragment>
                ) : (
                    <Fragment>
                        {`${target?.name} claimed `}
                        <strong>Duke</strong>
                        {`to block the foreign aid!`}
                    </Fragment>
                );

            case BoardState.DukeBlocksAccepted:
                return isPier ? (
                    <Fragment>
                        {`${pier.name} accepted Duke and receives nothing...`}
                    </Fragment>
                ) : (
                    <Fragment>
                        {`${challenger?.name} claimed `}
                        <strong>Duke</strong>{" "}
                        {`to block the
           foreign aid!`}
                    </Fragment>
                );
            case BoardState.DukeBlocksChallenged:
                return (
                    <Fragment>
                        {isPier
                            ? `${pier.name} does not think ${challenger?.name} has Duke! \n Cards will be revealed...`
                            : `${challenger?.name} claimed ${(
                                <strong>Duke</strong>
                            )} to block the foreign aid!`}
                    </Fragment>
                );
            case BoardState.CalledCoup:
                return (
                    <Fragment>
                        {isPier
                            ? `${pier.name}${(<strong>Coup</strong>)}  ${target?.name}!`
                            : `${target?.name} is choosing a card to discard...`}
                    </Fragment>
                );

            case BoardState.CalledGetThree:
                break;
            case BoardState.GetThreeChallenged:
                break;
            case BoardState.CalledChangeCards:
                break;
            case BoardState.AmbassadorAccepted:
                break;
            case BoardState.AmbassadorChallenged:
                break;
            case BoardState.CalledSteal:
                break;
            case BoardState.StealAccepted:
                break;
            case BoardState.StealChallenged:
                break;
            case BoardState.StealBlocked:
                break;
            case BoardState.StealBlockAccepted:
                break;
            case BoardState.StealBlockChallenged:
                break;
            case BoardState.CalledAssassinate:
                break;
            case BoardState.AssassinateChallenged:
                break;
            case BoardState.AssassinBlocked:
                break;
            case BoardState.ContessaChallenged:
                break;
            case BoardState.ContessaAccepted:
                break;
            case BoardState.DiscardingCard:
                break;
        }
        /**
         return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
        return <Fragment/>;
    },
    createState(prevState: TurnState, board: BoardState): TurnState {
        return {
            turn: prevState.turn,
            board,
        };
    },

};
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
                  Unchanged-> Solve NextTurn
                  /Duke-> [DukeBlocks: Wait]
                          ?Accept->[DukeBlocksAccepted:Solve Wait NextTurn]
                          ?Lie->   [DukeBlocksChallenged: Solve Wait NextTurn]
                                                          [3sec let people knoww that it is challenge]
                                                          [Reveal Solve = determine who lost]
                                                          [Lost = He has to choose which to, show a new action]
                                                          [Reveal result , which card is discard]
Coup  : ?Coup-> [CalledCoup: Wait]
                /Accept->[CoupAccepted :param, Solve Wait NextTurn]
//==Anyone can challenge
Duke  : ?GetThree->[CalledGetThree: Wait]
                   Unchanged->  Solve NextTurn
                  /Lie-> [GetThreeChallenged:Solve Wait NextTurn]
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
                      /Accept-> [AssissinateAccepted :Solve Wait NextTurn]
                      /Lie->    [AssassinateChallenged:Solve Wait NextTurn]
                      /Block->  [AssassinateChallengedWithContessa : Wait]
                                        ?Lie->[ContessaChallenged:Solve Wait NextTurn]
                                        ?Accept->[ContessaAccepted:Solve Wait NextTurn]
*/
/**
 * State responsibilities for Pier
 * Base
 *   ChoosingBaseAction,
 *
 * Solver
 GetOneAccepted,
 DukeBlocksAccepted,
 *
 * Waiter
 CalledGetTwo,
 *
 ReactForeign Aid

 Counter
 AidBlocked,
 ReactAssassin
 DukeBlocksChallenged,
 CalledCoup,
 CoupAccepted,
 CalledGetThree,
 GetThreeChallenged,
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
 AssissinateAccepted,
 AssassinateChallenged,
 AssassinBlocked,
 ContessaChallenged,
 ContessaAccepted,
 *
 */
