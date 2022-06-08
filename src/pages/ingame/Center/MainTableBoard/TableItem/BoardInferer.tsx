import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {TurnManager} from "system/GameStates/TurnManager";
import {Fragment} from "react";
import {cardPool} from "system/cards/CardPool";
import {KillInfo, Player} from "system/GameStates/GameTypes";
import {BoardState} from "system/GameStates/States";
import {PostKillPanel} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {formatInsert} from "lang/i18nHelper";

export function rejectionElem(t: any) {
    return (<Fragment>
        <br/>
        <p>{t("_ask_rejection")}</p>
    </Fragment>);
}


export function claimElem(t: any, player: Player, roleText: string, descKey: string): JSX.Element {
    return formatInsert(t, "_call_general", player.name, roleText, t(descKey));
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
    const susCard = cardPool.get(killInfo.card);
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

