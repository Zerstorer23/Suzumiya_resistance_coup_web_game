import { ActionType } from "system/GameStates/States";

export class ActionInfo {
  actionType: ActionType;

  constructor(actionType: ActionType) {
    this.actionType = actionType;
  }

  getName(): string {
    return "";
  }
  getImage() {}
}
