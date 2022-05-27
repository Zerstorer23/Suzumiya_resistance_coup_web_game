import { GameAction } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

export const GameManager = {
  createGameAction(srcId: string): GameAction {
    const gameAction: GameAction = {
      srcId,
      dstId: "",
      time: firebase.database.ServerValue.TIMESTAMP,
    };
    return gameAction;
  },
};
