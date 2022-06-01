import {ChallengeInfo, GameAction, RemovedCard} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import {ChallengeState} from "system/types/CommonTypes";
import {CardRole} from "system/cards/Card";

function createChallengeInfo(): ChallengeInfo {
    return {
        state: ChallengeState.Notify,
        susCard: CardRole.None
    };
}

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
    setChallengeInfo(action: GameAction, susCard: CardRole) {
        const ci = createChallengeInfo();
        ci.susCard = susCard;
        action.param = ci;
    },
    createRemovedCard(index: number, ownerId: string): RemovedCard {
        return {
            idx: index,
            playerId: ownerId
        };
    }
};
