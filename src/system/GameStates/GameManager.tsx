import ActionBoards from "pages/ingame/Center/ActionBoards/ActionBoards";
import { GameAction } from "system/GameStates/GameTypes";
import { ActionType } from "system/GameStates/States";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const GameManager = {
  createGameAction(action: ActionType, srcId: string): GameAction {
    const gameAction: GameAction = {
      action,
      srcId,
      dstId: "",
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
};
