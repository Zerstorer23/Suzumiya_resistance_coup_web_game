import { GameAction } from "system/GameStates/GameTypes";

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
  isCounterable(state: BoardState): boolean {
    switch (state) {
      case BoardState.CalledGetTwo:
      case BoardState.CalledCoup:
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
    switch (action) {
      case ActionType.Coup:
      case ActionType.Steal:
      case ActionType.Assassinate:
        return true;
      default:
        return false;
    }
  },
};
//https://docs.google.com/spreadsheets/d/1pXbooNl6BwfQAUUKAWGwR-WAyPyP9LX71ek3_Odfvlw/edit#gid=0
/*
State Table
?PierAction-> [next state]
/Client Action->[next state]

[ChoosingBaseAction]
//None challengable
Get 1 : ?GetOne-> [CalledGetOne : Solve Wait NextTurn]
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
//==Only targetted can challenge
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
