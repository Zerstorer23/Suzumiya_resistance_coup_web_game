import { GameAction } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const GameManager = {
  createGameAction(
    pierId: string,
    targetId = "",
    challengerId = ""
  ): GameAction {
    const gameAction: GameAction = {
      pierId,
      targetId,
      challengerId,
      param: null,
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
  copyGameAction(action: GameAction): GameAction {
    const gameAction: GameAction = {
      pierId: action.pierId,
      challengerId: action.challengerId,
      targetId: action.targetId,
      param: action.param,
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
};
