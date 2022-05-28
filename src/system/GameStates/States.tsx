import { GameAction, TurnState } from "system/GameStates/GameTypes";

export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";

//Determined from pier and client action combination
export enum BoardState {
  ChoosingBaseAction,
  GetOneAccepted,
  CalledGetTwo,
  AidBlocked,
  DukeBlocksAccepted,
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
      case BoardState.AidBlocked:
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
      case BoardState.AidBlocked:
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
      case BoardState.CoupAccepted:
      case BoardState.DukeBlocksChallenged:
      case BoardState.GetThreeChallenged:
      case BoardState.AmbassadorChallenged:
      case BoardState.StealAccepted:
      case BoardState.StealChallenged:
      case BoardState.StealBlockAccepted:
      case BoardState.StealBlockChallenged:
      case BoardState.AssissinateAccepted:
      case BoardState.AssassinateChallenged:
      case BoardState.ContessaChallenged:
      case BoardState.ContessaAccepted:
        return true;
      default:
        return false;
    }
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
      case BoardState.AidBlocked:
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
        return BoardState.CoupAccepted;
      case BoardState.CalledAssassinate:
        return BoardState.AssissinateAccepted;
      case BoardState.CalledSteal:
        return BoardState.StealAccepted;
      case BoardState.CalledChangeCards:
        return BoardState.AmbassadorAccepted;
      //Block calls
      case BoardState.AssassinBlocked:
        return BoardState.ContessaAccepted;
      case BoardState.AidBlocked:
        return BoardState.DukeBlocksAccepted;
      case BoardState.StealBlocked:
        return BoardState.StealBlockAccepted;
      default: //Exception
        console.log("Invalid State");
        return null;
    }
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
