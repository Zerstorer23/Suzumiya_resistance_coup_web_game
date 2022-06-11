import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {formatInsert} from "lang/i18nHelper";
import {ChallengeResultBoard, inferPostDiscard} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";
import {Card} from "system/cards/Card";

export function inferChallengerPanel(
    t: any,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    challengerId: string,
    challenger: Player | undefined,
): JSX.Element {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    if (challenger === null || challenger === undefined) return <Fragment/>;
    if (challengerId === action.targetId || challengerId === action.pierId) return <Fragment/>;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(t, ctx);
    }
    switch (board) {
        case BoardState.DiscardingCard:
            return inferDiscarding(t, ctx, challengerId, challenger);
        case BoardState.DiscardingFinished:
            return inferPostDiscard(t, ctx, challengerId, challenger);
    }
    return <Fragment/>;
}

function inferChallenged(
    t: any,
    ctx: RoomContextType
): JSX.Element {
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (challenger === null) return <Fragment/>;
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let susCard = killInfo.challengedCard;
    if (StateManager.targetIsChallenged(board)) {
        if (target === null) return <Fragment/>;
        return <p>{formatInsert(t, "_challenge_the_card",
            challenger.name, target.name,
            Card.getName(t, susCard))}
        </p>;
    }
    if (pier === null) return <Fragment/>;
    return <p>{formatInsert(t, "_challenge_the_card",
        challenger.name, pier.name,
        Card.getName(t, susCard))}
    </p>;
}


function inferDiscarding(t: any, ctx: RoomContextType, challengerId: string, challenger: Player): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.cause !== ActionType.IsALie) return <Fragment/>;
    return ChallengeResultBoard(t, ctx, challenger, challengerId, action.challengerId, killInfo);
}


