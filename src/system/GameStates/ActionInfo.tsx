import { ActionType } from "system/GameStates/States";

export class ActionInfo {
  actionType: ActionType;

  constructor(actionType: ActionType) {
    this.actionType = actionType;
  }

  getName(): string {
    switch (this.actionType) {
      case ActionType.Accept:
        return "Accept";
      case ActionType.Assassinate:
        return "Assassinate";
      case ActionType.ChangeCards:
        return "Change Cards";
      case ActionType.ContessaBlocksAssassination:
        return "Block Assassination with Contessa";
      case ActionType.Coup:
        return "Coup d'etat";
      case ActionType.DefendWithAmbassador:
        return "Block with Ambassador";
      case ActionType.DefendWithCaptain:
        return "Block with Captain";
      case ActionType.GetForeignAid:
        return "Foreign Aid";
      case ActionType.GetOne:
        return "+1";
      case ActionType.GetThree:
        return "+3";
      case ActionType.IsALie:
        return "That's a lie!";
      case ActionType.None:
        return "none";
      case ActionType.Steal:
        return "Steal";
      case ActionType.DukeBlocksForeignAid:
        return "Block aid";
    }
  }
  getImage() {}
}
