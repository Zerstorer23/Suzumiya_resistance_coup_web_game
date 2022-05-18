export const PAGE_INGAME = "game";
export const PAGE_LOBBY = "lobby";

export enum BoardState {
  MyTurn,
  ReactForeignAid,
  ReactCaptain,
  ReactAssassin,
  ReactContessa,
  ReactAnyting,
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

export function getActionsFromState(state: BoardState): ActionType[] {
  switch (state) {
    case BoardState.MyTurn:
      return [
        ActionType.GetOne,
        ActionType.GetThree,
        ActionType.GetForeignAid,
        ActionType.Steal,
        ActionType.Coup,
        ActionType.Assassinate,
        ActionType.ChangeCards,
      ];
    case BoardState.ReactAssassin:
      return [
        ActionType.Accept,
        ActionType.IsALie,
        ActionType.ContessaBlocksAssassination,
      ];
    case BoardState.ReactCaptain:
      return [
        ActionType.Accept,
        ActionType.IsALie,
        ActionType.DefendWithCaptain,
        ActionType.DefendWithAmbassador,
      ];
    case BoardState.ReactContessa:
      return [ActionType.Accept, ActionType.IsALie];
    default:
      return [ActionType.Accept, ActionType.IsALie];
  }
}
