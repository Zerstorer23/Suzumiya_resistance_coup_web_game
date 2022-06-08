import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {formatInsert, insert} from "lang/i18nHelper";
import {
    ChallengeResultBoard,
    claimElem,
    inferPostDiscard,
    rejectionElem
} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";

export function inferPierPanel(
    t: any,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    pierId: string,
): JSX.Element {
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === undefined || pier === null) return <Fragment/>;
    const board = ctx.room.game.state.board;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(t, ctx, pierId);
    }
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return <Fragment><p>{insert(t, "_choosing_action", pier.name)}</p></Fragment>;
        case BoardState.CalledCoup:
            return formatInsert(t, "_call_coup", pier.name, t("_action_Coup"), target?.name);
        case BoardState.GetOneAccepted:
            return claimElem(t, pier, t("_action_income"), "_accept_getone");
        case BoardState.CalledGetThree:
            return (<Fragment>
                {claimElem(t, pier!, CardPool.getCard(CardRole.Duke).getName(t), "_call_get_three")}
                {rejectionElem(t)}
            </Fragment>);
        case BoardState.CalledSteal:
            return <Fragment>
                <p>{formatInsert(t, "_call_steal", pier.name,
                    CardPool.getCard(CardRole.Captain).getName(t), target?.name)}</p>
                {rejectionElem(t)}
            </Fragment>;
        case BoardState.CalledAssassinate:
            return (<Fragment>
                <p>{formatInsert(t, "_call_assassinate", pier.name,
                    CardPool.getCard(CardRole.Assassin).getName(t), target?.name)}</p>
                {rejectionElem(t)}
            </Fragment>);

        //Blocks
        case BoardState.CalledGetTwoBlocked:
        case BoardState.StealBlocked:
        case BoardState.AssassinBlocked:
            return <p>{formatInsert(t, "_target_is_deciding", pier.name)}</p>;
        case BoardState.DukeBlocksAccepted:
            return <p>{formatInsert(t, "_accept_blocks", pier.name)}</p>;
        case BoardState.ForeignAidAccepted:
            return claimElem(t, pier, t("_action_foreign_aid"), "_accept_gettwo");
        case BoardState.GetThreeAccepted:
            return claimElem(t, pier, CardPool.getCard(CardRole.Duke).getName(t), "_accept_get_three");
        case BoardState.CalledChangeCards:
            return <Fragment>
                {claimElem(t, pier,
                    CardPool.getCard(CardRole.Ambassador).getName(t),
                    "_call_ambassador")}
                {rejectionElem(t)}
            </Fragment>;
        case BoardState.CalledGetTwo:
            return (<Fragment>
                {claimElem(t, pier, t("_action_foreign_aid"), "_call_foreign_aid")}
                {rejectionElem(t)}
            </Fragment>);
        case BoardState.AmbassadorAccepted:
            return (
                <Fragment>
                    <p>{formatInsert(t, "_accept_ambassador", pier!.name)}</p>
                </Fragment>
            );
        case BoardState.StealAccepted:
            if (target === null || target === undefined) return <p>{formatInsert(t, "_accept_steal_fallback", pier?.name)}</p>;
            return <p>{formatInsert(t, "_accept_steal", pier?.name, Math.min(target.coins, 2), target.name)}</p>;
        case BoardState.StealBlockAccepted:
            return <p>{formatInsert(t, "_accept_steal_block", pier?.name)}</p>;
        case BoardState.ContessaAccepted:
            return <p>{formatInsert(t, "_accept_contessa", pier?.name)}</p>;
        case BoardState.DiscardingCard:
            return inferDiscarding(t, ctx, pierId, pier);
        case BoardState.DiscardingFinished:
            return inferPostDiscard(t, ctx, pierId);
    }
    /**
     return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
    return <Fragment/>;
}

function inferChallenged(
    t: any,
    ctx: RoomContextType,
    pierId: string
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let susCard = killInfo.card;
    if (StateManager.targetIsChallenged(board)) {
        //Target Is challenged. Who challenged it?
        if (target === null) return <Fragment/>;
        if (action.challengerId !== pierId) return <Fragment/>;
        //I challenged Target
        return <p>{formatInsert(t, "_challenge_the_card",
            pier.name, target.name,
            CardPool.getCard(susCard).getName(t))}
        </p>;
    }
    //I am challenged
    return <p>
        {formatInsert(t, "_notify_challenge_reveal",
            pier.name, CardPool.getCard(susCard).getName(t))}
    </p>;
}

function inferDiscarding(t: any, ctx: RoomContextType, pierId: string, pier: Player): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.cause === ActionType.IsALie) {
        return ChallengeResultBoard(t, ctx, pier, pierId, action.challengerId, killInfo);
    }
    const target = ctx.room.playerMap.get(action.targetId);
    if (target === undefined) return <Fragment/>;
    return <p>{formatInsert(t, "_waiting_choosing_discard", target.name)}</p>;
}

