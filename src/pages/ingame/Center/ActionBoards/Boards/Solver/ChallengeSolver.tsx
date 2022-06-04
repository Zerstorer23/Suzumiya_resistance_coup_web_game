import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {LocalContextType} from "system/context/localInfo/local-context";
import {WaitTime} from "system/GameConstants";
import {ChallengeState, GameAction, KillInfo, Player,} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {TurnManager} from "system/GameStates/TurnManager";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";


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
    const action = ctx.room.game.action;
    const susId = prepareChallenge(action, board);
    const susPlayer = ctx.room.playerMap.get(susId)!;
    const [winnerId, loserId] = determineLoser(ctx, susId, susPlayer, killInfo.card);
    const pierWon = loserId !== action.pierId;
    const [myId] = TurnManager.getMyInfo(ctx, localCtx);
    console.log(`Pay penalty?  loser: ${loserId}  / lost? ${loserId === myId}`);
    killInfo.ownerId = loserId;
    killInfo.nextState = inferNextStateFromChallenge(pierWon, board);
    if (myId === loserId) {
        pushPostChallengeState(ctx, susId, winnerId, susPlayer, killInfo);
    }
}

function pushPostChallengeState(ctx: RoomContextType, susId: string, winnerId: string, susPlayer: Player, killInfo: KillInfo) {
    //Loser handles everything
    if (susId === winnerId) {
        //replace card if challenged won, meaning he didnt lose card.
        //I was sus and won, have my card changed.
        const deck = ctx.room.game.deck;
        const index = DeckManager.findIndexOfCardIn(deck, susPlayer, killInfo.card);
        if (index === -1) {
            console.trace("WTF no card?");
            return;
        }
        const random = DeckManager.getRandomFromDeck(ctx);
        console.log(`Swap ${deck[index]} to ${deck[random]}`);
        DeckManager.swap(index, random, deck);
        ReferenceManager.updateReference(DbReferences.GAME_deck, deck);
    }
    ActionManager.pushPrepareDiscarding(ctx, killInfo);
}

function prepareChallenge(action: GameAction, board: BoardState): string {
    if (StateManager.targetIsChallenged(board)) return action.targetId;
    return action.pierId;
}

function determineLoser(ctx: RoomContextType, susId: string, susPlayer: Player, susCard: CardRole): [string, string] {
    const hasTheCard = DeckManager.playerHasCard(ctx.room.game.deck, susCard, susPlayer);
    console.log(`Check if ${susId} has ${susPlayer} ? has = ${hasTheCard}`);
    const loserId = (hasTheCard) ? ctx.room.game.action.challengerId : susId;
    const winnerId = (hasTheCard) ? susId : ctx.room.game.action.challengerId;
    return [winnerId, loserId];
}


