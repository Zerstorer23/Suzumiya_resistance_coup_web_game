import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {waitAndEnd} from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/room-context";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {WaitTime} from "system/GameConstants";
import {GameManager} from "system/GameStates/GameManager";
import {
    ChallengedStateInfo,
    GameAction,
    Player,
} from "system/GameStates/GameTypes";
import {BoardState} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";
import {ChallengeSolvingState} from "system/types/CommonTypes";

export function warnChallenge(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    challengeInfo: ChallengedStateInfo
) {
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        const action: GameAction = {...ctx.room.game.action.param};
        challengeInfo.state = ChallengeSolvingState.Reveal;
        action.param = challengeInfo;
        ReferenceManager.updateReference(DbReferences.GAME_action, action);
    });
}

export function revealChallenge(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    challengeInfo: ChallengedStateInfo
): [boolean, boolean] {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [myId, localPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    let cardRole: CardRole = CardRole.None; ///Which card is challenged?
    let sus = pier; //Who should have this card?
    let susId = action.pierId;
    switch (board) {
        case BoardState.DukeBlocksChallenged:
            cardRole = CardRole.Duke;
            sus = target;
            susId = action.targetId;
            break;
        case BoardState.StealBlockChallenged:
            cardRole = challengeInfo.with!;
            sus = target;
            susId = action.targetId;
            break;
        case BoardState.ContessaChallenged:
            cardRole = CardRole.Contessa;
            sus = target;
            susId = action.targetId;
            break;
        case BoardState.GetThreeChallenged:
            cardRole = CardRole.Duke;
            break;
        case BoardState.AmbassadorChallenged:
            cardRole = CardRole.Ambassador;
            break;
        case BoardState.StealChallenged:
            cardRole = CardRole.Captain;
            break;
        case BoardState.AssassinateChallenged:
            cardRole = CardRole.Assassin;
            break;
        default:
            return [false, false];
    }
    //TODO who checks this?
    const hasIt = DeckManager.playerHasCard(cardRole, sus!);
    let needToPayPenalty = false;
    if (hasIt) {
        needToPayPenalty = action.challengerId === myId;
    } else {
        needToPayPenalty = susId === myId;
    }
    return [hasIt, needToPayPenalty];
}

export function showResults(ctx: RoomContextType, localCtx: LocalContextType) {
    waitAndEnd(ctx, localCtx);
}
