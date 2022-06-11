import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {BoardState, StateManager} from "system/GameStates/States";
import {PostKillPanel} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {formatInsert} from "lang/i18nHelper";
import {Card, CardRole} from "system/cards/Card";

export function rejectionElem(t: any) {
    return (<Fragment>
        <br/>
        <p>{t("_ask_rejection")}</p>
    </Fragment>);
}


export function claimElem(t: any, player: Player, roleText: string, descKey: string): JSX.Element {
    return formatInsert(t, "_call_general", player.name, roleText, t(descKey));
}

function handleLostChallenge(iChallenged: boolean, t: any, myPlayer: Player, susCard: CardRole) {
    if (iChallenged) {//I lost because I challenged wrong
        return (<p>{formatInsert(t, "_notify_lose_card", myPlayer.name)}</p>);
    }
    //I lost because I was challenged and didn't have card.
    return (<p>{formatInsert(t, "_notify_i_lost_card", myPlayer.name, Card.getName(t, susCard))}</p>);
}

function handleNotLostNotChallenge(killInfo: KillInfo, ctx: RoomContextType, t: any, playerId: string, myPlayer: Player, susCard: CardRole) {
    const nextState = killInfo.nextState;
    const action = ctx.room.game.action;
    const prevState = killInfo.prevState;
    if (StateManager.targetIsChallenged(prevState)) {
        //Target was challenged and target won and I didn't challenge this.
        if (playerId === action.targetId) {
            return <p>{formatInsert(t, "_is_satisfied", myPlayer.name)}</p>;
        } else {
            return <p>{formatInsert(t, "_is_comforted", myPlayer.name)}</p>;
        }
    }
    //Pier was challenged and pier won but I did not challenge this
    if (playerId === action.pierId) {
        //I am that pier who won.
        let nextStateElem = <Fragment/>;
        const [pier, target] = TurnManager.getShareholders(ctx);
        if (pier === null) return <Fragment/>;
        switch (nextState) {
            case BoardState.GetThreeAccepted:
                nextStateElem = <p>{formatInsert(t, "_next_get_three", pier.name)}</p>;
                break;
            case BoardState.CalledAssassinate:
                nextStateElem = <p>{formatInsert(t, "_next_assassinate", pier.name, target?.name)}</p>;
                break;
            case BoardState.AmbassadorAccepted:
                nextStateElem = <p>{formatInsert(t, "_next_ambassador", pier.name)}</p>;
                break;
            case BoardState.StealAccepted:
                nextStateElem = <p>{formatInsert(t, "_next_steal", pier.name, target?.name)}</p>;
                break;
            case BoardState.ForeignAidAccepted:
                nextStateElem = <p>{formatInsert(t, "_next_foreign_aid", pier.name)}</p>;
                break;
            case BoardState.InquisitionAccepted:
                nextStateElem = <p>{formatInsert(t, "_next_inquisition", pier.name, target?.name)}</p>;
                break;
            default:
                nextStateElem = <Fragment/>;
                break;
        }
        return (<Fragment>
            <p>{formatInsert(t, "_challenge_has_card", myPlayer.name, Card.getName(t, susCard))}</p>
            <p>{formatInsert(t, "_challenge_replace_card", myPlayer.name)}</p>
            {nextStateElem}
        </Fragment>);
    }
    //I am the target
    if (killInfo.ownerId === action.pierId) {
        return <p>{formatInsert(t, "_is_satisfied", myPlayer.name)}</p>;
    }
    return <p>{formatInsert(t, "_in_trouble", myPlayer.name)}</p>;
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
    if (iLost) {
        return handleLostChallenge(iChallenged, t, myPlayer, killInfo.challengedCard);
    }
    //I didn't lose and I challenged correctly
    if (iChallenged) {
        return (<p>{formatInsert(t, "_challenge_success", myPlayer.name)}</p>);
    }
    //I didn't lose, not a challenger.
    return handleNotLostNotChallenge(killInfo, ctx, t, playerId, myPlayer, killInfo.challengedCard);
}

export function inferPostDiscard(t: any, ctx: RoomContextType, playerId: string, player: Player): JSX.Element {
    const action = ctx.room.game.action;
    const killInfo: KillInfo = action.param as KillInfo;
    if (killInfo.removed === undefined) return <Fragment/>;
    if (playerId === killInfo.ownerId) {
        return (<PostKillPanel/>);
    }
    const nextState = killInfo.nextState;
    if (StateManager.isTargetAcceptedState(nextState as BoardState) && playerId === action.targetId) {
        return <p>{formatInsert(t, "_in_trouble", player.name)}</p>;
    }
    return (<p>{formatInsert(t, "_is_satisfied", player.name)}</p>);
}

