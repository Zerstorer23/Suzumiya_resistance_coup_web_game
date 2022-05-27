import { GameAction } from "system/GameStates/GameTypes";

export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";

//Determined from pier and client action combination
export enum BoardState {
  ChoosingBaseAction, //None
  AcceptedState,
  /*
  Either one Accepts
  GetOne 

  */
  CalledForeignAid, //+2 None
  CalledCoup, //coup None
  CalledDuke, //duke None
  CalledCaptain, //captain None
  CalledAssassin, //assassin None
  CalledAmbassador, //amba None
  ContessaBlockedAssassin, //assassin contessa
  CaptainBlockedCaptain, //Cap Cap
  AmbassadorBlockedCaptain, //Cap Amba
  ClientIsALie, //lie any
  PierIsALie, //Any Lie
  Exception,
}
/*
    switch (boardState) {
      case BoardState.ChoosingBaseAction:
        break;
      case BoardState.SolveActions:
        break;
      case BoardState.CalledForeignAid:
        break;
      case BoardState.CalledCoup:
        break;
      case BoardState.CalledDuke:
        break;
      case BoardState.CalledCaptain:
        break;
      case BoardState.CalledAssassin:
        break;
      case BoardState.CalledAmbassador:
        break;
      case BoardState.ContessaBlockedAssassin:
        break;
      case BoardState.ClientIsALie:
        break;
      case BoardState.CaptainBlockedCaptain:
        break;
      case BoardState.AmbassadorBlockedCaptain:
        break;
      case BoardState.PierIsALie:
        break;
      case BoardState.Exception:
        break;
    }
*/
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
    return BoardState.ClientIsALie;
  }
  if (pierAction === ActionType.IsALie) {
    return BoardState.PierIsALie;
  }
  if (clientAction === ActionType.Accept || pierAction === ActionType.Accept) {
    return BoardState.AcceptedState;
  }

  switch (pierAction) {
    case ActionType.None:
      return BoardState.ChoosingBaseAction;
    case ActionType.GetOne:
      return BoardState.AcceptedState;
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
    default:
      return BoardState.Exception;
  }
}
