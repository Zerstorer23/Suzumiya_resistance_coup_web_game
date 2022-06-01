import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {waitAndEnd} from "pages/ingame/Center/ActionBoards/Boards/Solver/Solver";
import {CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import {LocalContextType, LocalField} from "system/context/localInfo/local-context";
import {RoomContextType} from "system/context/roomInfo/room-context";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {WaitTime} from "system/GameConstants";
import {ChallengeInfo, GameAction, Player,} from "system/GameStates/GameTypes";
import {BoardState} from "system/GameStates/States";
import {ChallengeState} from "system/types/CommonTypes";
import {Fragment} from "react";
import DiscardCardPanel from "pages/ingame/Center/ActionBoards/Boards/Solver/DiscardCardPanel";
import {
    ChallengeResultBoard,
    preChallengeBoard
} from "pages/ingame/Center/ActionBoards/Boards/Solver/ChallengeHelperPanels";


export function solveChallenges(ctx: RoomContextType, localCtx: LocalContextType): JSX.Element {
    const action = ctx.room.game.action;
    const challengeInfo: ChallengeInfo = action.param as ChallengeInfo;
    switch (challengeInfo.state) {
        case ChallengeState.Notify:
            warnChallenge(action, localCtx);
            console.log("Return waiting");
            return preChallengeBoard;
        case ChallengeState.Reveal:
            console.log("Revealing...");
            const e = handleReveal(ctx, localCtx, challengeInfo);
            console.log(e);
            return e;
    }
}

function warnChallenge(
    action: GameAction,
    localCtx: LocalContextType
) {
    setMyTimer(localCtx, WaitTime.WaitConfirms, () => {
        (action.param as ChallengeInfo).state = ChallengeState.Reveal;
        ReferenceManager.updateReference(DbReferences.GAME_action, action);
    });
}

export function handleReveal(ctx: RoomContextType, localCtx: LocalContextType, challengeInfo: ChallengeInfo): JSX.Element {
    console.log("Challenge Game status");
    console.log(ctx.room.game);
    const [susId, susCard] = prepareChallenge(ctx.room.game.action, ctx.room.game.state.board);
    if (susId.length <= 0) return <p>Critical Error... wrong board at challenge state</p>;
    const susPlayer = ctx.room.playerMap.get(susId)!;
    const [loserId, hasTheCard] = determineLoser(ctx, susId, susPlayer, susCard);
    const loser = ctx.room.playerMap.get(loserId)!;
    const myId = localCtx.getVal(LocalField.Id);
    console.log(`Pay penalty?  loser: ${loserId} / me ${myId} / lost? ${loserId === myId}`);
    if (loserId === myId) {
        return (
            <Fragment>
                <p>YOU Lost a card...</p>
                <DiscardCardPanel/>
            </Fragment>
        );
    } else {
        return <ChallengeResultBoard loser={loser} susCard={susCard} susPlayer={susPlayer} hasTheCard={hasTheCard}/>;
    }
}

function prepareChallenge(
    action: GameAction,
    board: BoardState
): [string, CardRole] {
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
            return ["", CardRole.None];
    }
    return [susId, (action.param as ChallengeInfo).susCard];
}

function determineLoser(
    ctx: RoomContextType,
    susId: string,
    susPlayer: Player,
    susCard: CardRole,
): [string, boolean] {
    const hasTheCard = DeckManager.playerHasCard(susCard, susPlayer);
    console.log(`Check if ${susId} has ${susPlayer} ? has = ${hasTheCard}`);
    let loserId;
    if (hasTheCard) {
        loserId = ctx.room.game.action.challengerId;
    } else {
        loserId = susId;
    }
    return [loserId, hasTheCard];
}

function showResults(ctx: RoomContextType, localCtx: LocalContextType) {
    waitAndEnd(ctx, localCtx);
}
