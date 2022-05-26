import { GameAction } from "system/GameStates/GameTypes";

export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";

export enum BoardState {
  ChoosingBaseAction,
  SolveActions, //+1 / None
  CalledForeignAid, //+2 None
  CalledCoup, //coup None
  CalledDuke, //duke None
  CalledCaptain, //captain None
  CalledAssassin, //assassin None
  CalledAmbassador, //amba None
  ContessaBlockedAssassin, //assassin contessa
  ClientIsALie, //lie any
  CaptainBlockedCaptain, //Cap Cap
  AmbassadorBlockedCaptain, //Cap Amba
  PierIsALie, //Any Lie
  Exception,
}

export enum ActionType {
  None,
  GetOne,
  GetForeignAid,
  Coup,
  Steal,
  GetThree,
  Assassinate,
  ContessaBlocksAssassination,
  ChangeCards,
  IsALie,
  DefendWithCaptain,
  DefendWithAmbassador,
  Accept,
}
//https://docs.google.com/spreadsheets/d/1pXbooNl6BwfQAUUKAWGwR-WAyPyP9LX71ek3_Odfvlw/edit#gid=0

export function readStateFromRoom(
  pierAction: ActionType,
  clientAction: ActionType
) {
  if (clientAction === ActionType.IsALie) {
    return BoardState.PierIsALie;
  }
  if (clientAction === ActionType.Accept || pierAction === ActionType.Accept) {
    return BoardState.SolveActions;
  }

  switch (pierAction) {
    case ActionType.None:
      return BoardState.ChoosingBaseAction;
    case ActionType.GetOne:
      return BoardState.SolveActions;
    case ActionType.Coup:
      return BoardState.CalledCoup;
    case ActionType.GetForeignAid:
      return BoardState.CalledForeignAid;
    case ActionType.GetThree:
      return BoardState.CalledDuke;
    case ActionType.Steal:
      switch (clientAction) {
        case ActionType.DefendWithAmbassador:
          return BoardState.AmbassadorBlockedCaptain;
        case ActionType.DefendWithCaptain:
          return BoardState.CaptainBlockedCaptain;
        case ActionType.None:
          return BoardState.CalledCaptain;
      }
      return BoardState.Exception;
    case ActionType.Assassinate:
      switch (clientAction) {
        case ActionType.ContessaBlocksAssassination:
          return BoardState.ContessaBlockedAssassin;
        case ActionType.None:
          return BoardState.CalledAssassin;
      }
      return BoardState.Exception;
    case ActionType.ChangeCards:
      return BoardState.CalledAmbassador;
    case ActionType.IsALie:
      return BoardState.ClientIsALie;
    default:
      return BoardState.Exception;
  }
}

export function getActionsFromState(state: BoardState): ActionType[] {
  switch (state) {
    case BoardState.ChoosingBaseAction:
      return [
        ActionType.GetOne,
        ActionType.GetThree,
        ActionType.GetForeignAid,
        ActionType.Steal,
        ActionType.Coup,
        ActionType.Assassinate,
        ActionType.ChangeCards,
      ];
    case BoardState.ChoosingBaseAction:
      return [
        ActionType.Accept,
        ActionType.IsALie,
        ActionType.ContessaBlocksAssassination,
      ];
    case BoardState.ChoosingBaseAction:
      return [
        ActionType.Accept,
        ActionType.IsALie,
        ActionType.DefendWithCaptain,
        ActionType.DefendWithAmbassador,
      ];
    case BoardState.ChoosingBaseAction:
      return [ActionType.Accept, ActionType.IsALie];
    default:
      return [ActionType.Accept, ActionType.IsALie];
  }
}
