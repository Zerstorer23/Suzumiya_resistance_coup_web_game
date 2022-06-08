import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {formatInsert} from "lang/i18nHelper";
import {
    ChallengeResultBoard,
    claimElem,
    inferPostDiscard
} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";
import {TurnManager} from "system/GameStates/TurnManager";

export function inferTargetPanel(
    t: any,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    targetId: string,
    target: Player | undefined,
): JSX.Element {
    if (target === undefined) return <Fragment/>;
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(t, ctx, targetId, target);
    }
    switch (board) {
        case BoardState.CalledCoup:
            return <p>{formatInsert(t, "_in_trouble", target.name)}</p>;
        case BoardState.CalledSteal:
            return <p>{formatInsert(t, "_target_is_deciding", target.name)}</p>;
        case BoardState.CalledAssassinate:
            return <p>{formatInsert(t, "_target_is_deciding", target.name)}</p>;
        case BoardState.DukeBlocksAccepted:
            return claimElem(t, target!, CardPool.getCard(CardRole.Duke).getName(t), "_call_aid_block");

        //====BLOCKS
        case BoardState.CalledGetTwoBlocked:
            return claimElem(t, target, CardPool.getCard(CardRole.Duke).getName(t), "_call_aid_block");
        case BoardState.StealBlocked:
            return claimElem(t, target, CardPool.getCard(action.param as CardRole).getName(t), "_call_steal_block");
        case BoardState.AssassinBlocked:
            return claimElem(t, target, CardPool.getCard(CardRole.Contessa).getName(t), "_call_assassinate_block");
        case BoardState.StealAccepted:
            return <p>{formatInsert(t, "_got_stolen", target?.name)}</p>;
        case BoardState.StealBlockAccepted:
            return <p>{formatInsert(t, "_is_safe_from_action", target?.name)}</p>;
        case BoardState.ContessaAccepted:
            return <p>{formatInsert(t, "_is_safe_from_action", target?.name)}</p>;
        case BoardState.DukeBlocksChallenged:
        case BoardState.StealBlockChallenged:
        case BoardState.ContessaChallenged:
            const killInfo: KillInfo = action.param as KillInfo;
            let susCard = killInfo.card;
            return <p>{formatInsert(t, "_notify_challenge_reveal", target.name, CardPool.getCard(susCard).getName(t))}</p>;
        ///===Discarding
        case BoardState.DiscardingCard:
            return inferDiscarding(t, ctx, targetId, target);
        case BoardState.DiscardingFinished:
            return inferPostDiscard(t, ctx, targetId);
    }
    return <Fragment/>;
}

function inferChallenged(
    t: any,
    ctx: RoomContextType,
    targetId: string,
    targetPlayer: Player
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let susCard = killInfo.card;
    if (StateManager.targetIsChallenged(board)) {
        return <p>
            {formatInsert(t, "_notify_challenge_reveal",
                targetPlayer.name, CardPool.getCard(susCard).getName(t))}
        </p>;
    }
    switch (board) {
        //I am targeted
        case BoardState.AssassinateChallenged:
        case BoardState.StealChallenged:
            if (pier === null || challenger === null) return <Fragment/>;
            if (action.challengerId !== targetId) return <Fragment/>;
            //I challenged Pier
            return <p>{formatInsert(t, "_challenge_the_card",
                targetPlayer.name, pier.name,
                CardPool.getCard(susCard).getName(t))}
            </p>;
    }
    return <Fragment/>;
}

function inferDiscarding(t: any, ctx: RoomContextType, targetId: string, target: Player): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.cause === ActionType.IsALie) {
        return ChallengeResultBoard(t, ctx, target, targetId, action.challengerId, killInfo);
    }
    return <p>{formatInsert(t, "_is_choosing_discard", target.name)}</p>;
}



