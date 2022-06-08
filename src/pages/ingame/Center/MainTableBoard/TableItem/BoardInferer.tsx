import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {LocalContextType} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {PostKillPanel} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {formatInsert, insert} from "lang/i18nHelper";

export function inferStateInfo(
    t: any,
    ctx: RoomContextType,
    localCtx: LocalContextType,
    playerId: string,
    isMain: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null) return <Fragment/>;
    if (StateManager.isChallenged(board)) {
        return inferChallenged(t, ctx, playerId, isMain);
    }
    if (StateManager.isTargetableState(board)) {
        return inferTargeted(t, ctx, playerId);
    }
    if (StateManager.pierIsBlocked(board)) {
        return inferBlocked(t, ctx, playerId);
    }
    switch (board) {
        case BoardState.ChoosingBaseAction:
            return <Fragment><p>{insert(t, "_choosing_action", pier.name)}</p></Fragment>;
        case BoardState.GetOneAccepted:
            return claimElem(t, pier, t("_action_income"), "_accept_getone");
        case BoardState.ForeignAidAccepted:
            return claimElem(t, pier, t("_action_foreign_aid"), "_accept_gettwo");
        case BoardState.GetThreeAccepted:
            return claimElem(t, pier,
                CardPool.getCard(CardRole.Duke).getName(t),
                "_accept_get_three");
        case BoardState.CalledChangeCards:
            return <Fragment>
                {claimElem(t, pier,
                    CardPool.getCard(CardRole.Ambassador).getName(t),
                    "_call_ambassador")}
                {rejectionElem(t)}
            </Fragment>;
        case BoardState.CalledGetTwo:
            return (
                <Fragment>
                    {claimElem(t, pier, t("_action_foreign_aid"), "_call_foreign_aid")}
                    {rejectionElem(t)}
                </Fragment>
            );
        case BoardState.DukeBlocksAccepted:
            return isMain ? (
                <Fragment>
                    <p>
                        {formatInsert(t, "_accept_blocks", pier.name)}
                    </p>
                </Fragment>
            ) : (
                <Fragment>
                    {claimElem(t, target!, CardPool.getCard(CardRole.Duke).getName(t), "_call_aid_block")}
                </Fragment>
            );
        case BoardState.CalledGetThree:
            return (
                <Fragment>
                    {claimElem(t, pier!, CardPool.getCard(CardRole.Duke).getName(t), "_call_get_three")}
                    {rejectionElem(t)}
                </Fragment>
            );
        case BoardState.AmbassadorAccepted:
            return (
                <Fragment>
                    <p>{formatInsert(t, "_accept_ambassador", pier!.name)}</p>
                </Fragment>
            );
        case BoardState.StealAccepted:
            if (isMain) {
                if (target === null || target === undefined) return <p>{formatInsert(t, "_accept_steal_fallback", pier?.name)}</p>;
                return <p>{formatInsert(t, "_accept_steal", pier?.name, Math.min(target.coins, 2), target.name)}</p>;
            } else {
                return <p>{formatInsert(t, "_got_stolen", target?.name)}</p>;
            }
        case BoardState.StealBlockAccepted:
            if (isMain) {
                return <p>{formatInsert(t, "_accept_steal_block", pier?.name)}</p>;
            } else {
                return <p>{formatInsert(t, "_is_safe_from_action", target?.name)}</p>;
            }
        case BoardState.ContessaAccepted:
            if (isMain) {
                return <p>{formatInsert(t, "_accept_contessa", pier?.name)}</p>;
            } else {
                return <p>{formatInsert(t, "_is_safe_from_action", target?.name)}</p>;
            }
        case BoardState.DiscardingCard:
        case BoardState.DiscardingFinished:
            return inferDiscardState(t, ctx, playerId);
    }
    /**
     return <p>{`${localPlayer.name} gained 1 coin...`}</p>; */
    return <Fragment/>;
}

export function rejectionElem(t: any) {
    return (<Fragment>
        <br/>
        <p>{t("_ask_rejection")}</p>
    </Fragment>);
}


export function claimElem(t: any, player: Player, roleText: string, descKey: string): JSX.Element {
    return formatInsert(t, "_call_general", player.name, roleText, t(descKey));
}


export function notifyChallengedElem(t: any, amChallenger: boolean, challenger: Player, sus: Player, susCard: CardRole): JSX.Element {
    if (amChallenger) {
        return (
            <Fragment>
                <p>{formatInsert(t, "_challenge_the_card",
                    challenger.name, sus.name,
                    CardPool.getCard(susCard).getName(t))}
                </p>
            </Fragment>
        );
    } else {
        return <Fragment>
            <p>{formatInsert(t, "_notify_challenge_reveal",
                sus.name, CardPool.getCard(susCard).getName(t))}
            </p>
        </Fragment>;
    }
}


export function ChallengeResultBoard(
    t: any,
    ctx: RoomContextType,
    myPlayer: Player,
    playerId: string,
    challengerId: string,
    killInfo: KillInfo): JSX.Element {
    const iLost = killInfo.ownerId === playerId;
    const iChallenged = playerId === challengerId;
    const susCard = CardPool.getCard(killInfo.card);
    if (iLost) {
        if (iChallenged) {//I lost because I challenged wrong
            return (<p>{formatInsert(t, "_notify_lose_card", myPlayer.name)}</p>);
        }
        //I lost because I was challenged and didn't have card.
        return (<p>{formatInsert(t, "_notify_i_lost_card",
            myPlayer.name, susCard.getName(t))}</p>);
    }
    //I won and I challenged correctly
    if (iChallenged) {
        return (<p>{formatInsert(t, "_challenge_success", myPlayer.name)}</p>);
    }
    const nextState = killInfo.nextState;
    let nextStateElem = <Fragment/>;
    const [pier, target] = TurnManager.getShareholders(ctx);
    switch (nextState) {
        case BoardState.GetThreeAccepted:
            nextStateElem = <p>{formatInsert(t, "_next_get_three", myPlayer.name)}</p>;
            break;
        case BoardState.CalledAssassinate:
            nextStateElem = <p>{formatInsert(t, "_next_assassinate", myPlayer.name, target?.name)}</p>;
            break;
        case BoardState.AmbassadorAccepted:
            nextStateElem = <p>{formatInsert(t, "_next_ambassador", myPlayer.name)}</p>;
            break;
        case BoardState.StealAccepted:
            nextStateElem = <p>{formatInsert(t, "_next_steal", myPlayer.name, target?.name)}</p>;
            break;
        case BoardState.ForeignAidAccepted:
            nextStateElem = <p>{formatInsert(t, "_next_foreign_aid", myPlayer.name)}</p>;
            break;
        case BoardState.ChoosingBaseAction:
            nextStateElem = <Fragment/>;
            break;

    }
    //I won and I was challenged and I had card
    return (<Fragment>
        <p>{formatInsert(t, "_challenge_has_card", myPlayer.name, susCard.getName(t))}</p>
        <p>{formatInsert(t, "_challenge_replace_card", myPlayer.name)}</p>
        {nextStateElem}
    </Fragment>);
}

export function inferPostDiscard(t: any, ctx: RoomContextType, playerId: string): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.removed === undefined) return <Fragment/>;
    if (playerId === killInfo.ownerId) {
        return (<PostKillPanel/>);
    } else {
        return (<p>{formatInsert(t, "_is_satisfied", ctx.room.playerMap.get(playerId)?.name)}</p>);
    }
}

function inferChallenged(
    t: any,
    ctx: RoomContextType,
    playerId: string,
    isMain: boolean
): JSX.Element {
    const board = ctx.room.game.state.board;
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    if (pier === null || challenger === null) return <Fragment/>;
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    let susPlayer = pier;
    let susCard = killInfo.card;
    if (StateManager.targetIsChallenged(board)) {
        susPlayer = target!;
    }
    return notifyChallengedElem(t, !isMain, challenger!, susPlayer, susCard);
}

function inferTargeted(
    t: any,
    ctx: RoomContextType,
    playerId: string
): JSX.Element {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null || target === null) return <Fragment/>;
    const isPier = playerId === action.pierId;
    switch (board) {
        case BoardState.CalledCoup:
            if (isPier) {
                return <Fragment>
                    <p>{formatInsert(t, "_call_coup", pier.name, target.name)}</p>
                </Fragment>;
            } else {
                return <Fragment>
                    <p>{formatInsert(t, "_in_trouble", target.name)}</p>
                </Fragment>;
            }
        case BoardState.CalledSteal:
            if (isPier) {
                return <Fragment>
                    <p>{formatInsert(t, "_call_steal", pier.name,
                        CardPool.getCard(CardRole.Captain).getName(t), target.name)}</p>
                    {rejectionElem(t)}
                </Fragment>;
            } else {
                return <Fragment><p>{formatInsert(t, "_target_is_deciding", target.name)}</p></Fragment>;
            }

        case BoardState.CalledAssassinate:
            if (isPier) {
                return (
                    <Fragment>
                        <p>{formatInsert(t, "_call_assassinate", pier.name,
                            CardPool.getCard(CardRole.Assassin).getName(t), target.name)}</p>
                        {rejectionElem(t)}
                    </Fragment>);
            } else {
                return <Fragment><p>{formatInsert(t, "_target_is_deciding", target.name)}</p></Fragment>;
            }
        default:
            return <Fragment/>;
    }
}

function inferBlocked(
    t: any,
    ctx: RoomContextType,
    playerId: string,
): JSX.Element {
    const board = ctx.room.game.state.board;
    const action = ctx.room.game.action;
    const [pier, target] = TurnManager.getShareholders(ctx);
    if (pier === null || target === null) return <Fragment/>;
    if (playerId === action.pierId) {
        return <Fragment><p>{formatInsert(t, "_target_is_deciding", pier.name)}</p></Fragment>;
    }
    switch (board) {
        case BoardState.CalledGetTwoBlocked:
            return claimElem(t, target, CardPool.getCard(CardRole.Duke).getName(t), "_call_aid_block");
        case BoardState.StealBlocked:
            return claimElem(t, target, CardPool.getCard(action.param as CardRole).getName(t), "_call_steal_block");
        case BoardState.AssassinBlocked:
            return claimElem(t, target, CardPool.getCard(CardRole.Contessa).getName(t), "_call_assassinate_block");
        default:
            return <Fragment/>;
    }
}


export function inferDiscardState(t: any, ctx: RoomContextType, playerId: string): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.removed === undefined) return <Fragment/>;
    const cardSelected = killInfo.removed[0] >= 0;
    if (cardSelected) {
        if (playerId === killInfo.ownerId) {
            return (<PostKillPanel/>);
        } else {
            return (<p>{formatInsert(t, "_is_satisfied", ctx.room.playerMap.get(playerId)?.name)}</p>);
        }
    } else {
        const myPlayer = ctx.room.playerMap.get(playerId);
        const lostPlayer = ctx.room.playerMap.get(killInfo.ownerId);
        if (myPlayer === undefined || lostPlayer === undefined) return <Fragment/>;
        if (killInfo.cause === ActionType.IsALie) {
            return ChallengeResultBoard(t, ctx, myPlayer, playerId, action.challengerId, killInfo);
        } else {
            //Coup or assassin
            if (playerId === killInfo.ownerId) {
                return <p>{formatInsert(t, "_is_choosing_discard", myPlayer.name)}</p>;
            } else {
                return <p>{formatInsert(t, "_waiting_choosing_discard", lostPlayer.name)}</p>;
            }
        }

    }

}


