import { GameAction } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const GameManager = {
  createGameAction(hostId: string): GameAction {
    const gameAction: GameAction = {
      hostId,
      challengerId: "",
      targetId: "",
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
  copyGameAction(action: GameAction): GameAction {
    const gameAction: GameAction = {
      hostId: action.hostId,
      challengerId: action.hostId,
      targetId: action.targetId,
      param: action.param,
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
};
