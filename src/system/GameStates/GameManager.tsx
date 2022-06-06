import {GameAction, KillActionTypes, KillInfo} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {CardRole} from "system/cards/Card";
import {BoardState} from "system/GameStates/States";


export const GameManager = {
    createGameAction(
        pierId: string,
        targetId = "",
        challengerId = ""
    ): GameAction {
        return {
            pierId,
            targetId,
            challengerId,
            param: "",
            time: firebase.database.ServerValue.TIMESTAMP,
        };
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
    createKillInfo(cause: KillActionTypes, ownerId: string): KillInfo {
        return {
            cause,
            card: CardRole.None,
            ownerId,
            removed: [-1, -1],
            nextState: BoardState.ChoosingBaseAction
        };
    }
};
