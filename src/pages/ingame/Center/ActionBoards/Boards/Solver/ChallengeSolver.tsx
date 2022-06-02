import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {waitAndEnd} from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {LocalContextType, LocalField} from "system/context/localInfo/local-context";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {WaitTime} from "system/GameConstants";
import {ChallengeState, GameAction, KillInfo, Player,} from "system/GameStates/GameTypes";
import {BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {preChallengeBoard} from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeHelperPanels";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";


export function solveChallenges(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    switch (killInfo.nextState) {
        case ChallengeState.Notify:
            warnChallenge(action, localCtx);
            return preChallengeBoard;
        case ChallengeState.Reveal:
            handleReveal(ctx, localCtx, killInfo);
            return preChallengeBoard;
        //TODO ERROR
        default:
            return preChallengeBoard;
    }
}

function warnChallenge(
    action: GameAction,
    localCtx: LocalContextType
) {
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        (action.param as KillInfo).nextState = ChallengeState.Reveal;
        ReferenceManager.updateReference(DbReferences.GAME_action, action);
    });
}

function inferNextStateFromChallenge(doPierAction: boolean, board: BoardState): BoardState {
    if (!doPierAction) return BoardState.ChoosingBaseAction;
    switch (board) {
        case BoardState.GetThreeChallenged:
            return BoardState.GetThreeAccepted;
        case BoardState.AssassinateChallenged:
            return BoardState.CalledAssassinate;
        case BoardState.AmbassadorChallenged:
            return BoardState.AmbassadorAccepted;
        case BoardState.StealChallenged:
            return BoardState.StealAccepted;
        case BoardState.DukeBlocksChallenged:
            return BoardState.ForeignAidAccepted;
        case BoardState.StealBlockChallenged:
        case BoardState.ContessaChallenged:
        default:
            console.trace("WTF");
            return BoardState.ChoosingBaseAction;
    }
}

export function handleReveal(ctx: RoomContextType, localCtx: LocalContextType, killInfo: KillInfo) {
    console.log("Challenge Game status");
    console.log(ctx.room.game);
    const board = ctx.room.game.state.board;
    const susId = prepareChallenge(ctx.room.game.action, board);
    if (susId.length <= 0) return <p>Critical Error... wrong board at challenge state</p>;
    const susPlayer = ctx.room.playerMap.get(susId)!;
    const loserId = determineLoser(ctx, susId, susPlayer, killInfo.card);
    const pierWon = loserId !== ctx.room.game.action.pierId;
    const myId = localCtx.getVal(LocalField.Id);
    console.log(`Pay penalty?  loser: ${loserId}  / lost? ${loserId === myId}`);
    killInfo.ownerId = loserId;
    //TODO if equals pier, or challenger
    killInfo.nextState = inferNextStateFromChallenge(pierWon, board);//TODO infer this
    ActionManager.pushPrepareDiscarding(ctx, killInfo);
}

function prepareChallenge(
    action: GameAction,
    board: BoardState
): string {
    let susId = action.pierId;
    switch (board) {
        case BoardState.DukeBlocksChallenged:
            susId = action.targetId;
            break;
        case BoardState.StealBlockChallenged:
            susId = action.targetId;
            break;
        case BoardState.ContessaChallenged:
            susId = action.targetId;
            break;
        case BoardState.GetThreeChallenged:
        case BoardState.AmbassadorChallenged:
        case BoardState.StealChallenged:
        case BoardState.AssassinateChallenged:
            susId = action.pierId;
            break;
        default:
            console.error("WTF");
            console.trace();
            return "";
    }
    return susId;
}

function determineLoser(
    ctx: RoomContextType,
    susId: string,
    susPlayer: Player,
    susCard: CardRole,
): string {
    const hasTheCard = DeckManager.playerHasCard(susCard, susPlayer);
    console.log(`Check if ${susId} has ${susPlayer} ? has = ${hasTheCard}`);
    let loserId;
    if (hasTheCard) {
        loserId = ctx.room.game.action.challengerId;
    } else {
        loserId = susId;
    }
    return loserId;
}

function showResults(ctx: RoomContextType, localCtx: LocalContextType) {
    waitAndEnd(ctx, localCtx);
}
