import {GameAction, KillActionTypes, KillInfo} from "system/GameStates/GameTypes";
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
        };
    },
    copyGameAction(action: GameAction): GameAction {
        const gameAction: GameAction = {
            pierId: action.pierId,
            challengerId: action.challengerId,
            targetId: action.targetId,
            param: action.param,
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
