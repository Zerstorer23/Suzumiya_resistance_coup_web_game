import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {LocalContextType, LocalField} from "system/context/localInfo/local-context";
import {WaitTime} from "system/GameConstants";
import {ChallengeState, GameAction, KillInfo, Player,} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";


export function solveChallenges(ctx: RoomContextType, localCtx: LocalContextType) {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.nextState !== ChallengeState.Notify) return;
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        handleReveal(ctx, localCtx, killInfo);
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

function handleReveal(ctx: RoomContextType, localCtx: LocalContextType, killInfo: KillInfo) {
    console.log("Challenge Game status");
    console.log(ctx.room.game);
    const board = ctx.room.game.state.board;
    const susId = prepareChallenge(ctx.room.game.action, board);
    const susPlayer = ctx.room.playerMap.get(susId)!;
    const loserId = determineLoser(ctx, susId, susPlayer, killInfo.card);
    const pierWon = loserId !== ctx.room.game.action.pierId;
    const myId = localCtx.getVal(LocalField.Id);
    console.log(`Pay penalty?  loser: ${loserId}  / lost? ${loserId === myId}`);
    killInfo.ownerId = loserId;
    killInfo.nextState = inferNextStateFromChallenge(pierWon, board);
    if (myId === loserId) {
        ActionManager.pushPrepareDiscarding(ctx, killInfo);
    }
}

function prepareChallenge(action: GameAction, board: BoardState): string {
    if (StateManager.targetIsChallenged(board)) return action.targetId;
    return action.pierId;
}

function determineLoser(ctx: RoomContextType, susId: string, susPlayer: Player, susCard: CardRole): string {
    const hasTheCard = DeckManager.playerHasCard(ctx.room.game.deck, susCard, susPlayer);
    console.log(`Check if ${susId} has ${susPlayer} ? has = ${hasTheCard}`);
    if (hasTheCard) {
        return ctx.room.game.action.challengerId;
    } else {
        return susId;
    }
}


