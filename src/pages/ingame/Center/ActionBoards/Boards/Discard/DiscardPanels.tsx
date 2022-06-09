import {Fragment, useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {KillInfo} from "system/GameStates/GameTypes";
import {cardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";


export function PostKillPanel(): JSX.Element {
    const ctx = useContext(RoomContext);
    const {t} = useTranslation();
    const info = ctx.room.game.action.param as KillInfo;
    if (info.removed === undefined) return <Fragment/>;
    const player = ctx.room.playerMap.get(info.ownerId)!;
    const cardRole = ctx.room.game.deck[info.removed[0]];
    let secondElem = <Fragment/>;
    if (info.removed[1] >= 0) {
        const secCard = ctx.room.game.deck[info.removed[1]];
        secondElem = <p>{formatInsert(t, "_discard_result_challenge", player.name,
            cardPool.get(secCard).getName(t))}</p>;
    }

    if (player === undefined) return <Fragment/>;
    const isDead = DeckManager.playerIsDead(ctx.room.game.deck, player);
    return (
        <Fragment>
            <p>{formatInsert(t, "_discard_result", player.name,
                cardPool.get(cardRole).getName(t))}</p>
            {secondElem}
            {isDead && <p>{formatInsert(t, "_is_removed", player.name)}</p>}
        </Fragment>
    );
}

