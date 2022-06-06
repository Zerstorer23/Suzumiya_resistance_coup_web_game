import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./TableItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {inferStateInfo} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";
import {CardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";

type Props = {
    playerId: string;
    isMain: boolean;
} & IProps;
export default function TableItem(props: Props) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const player = ctx.room.playerMap.get(props.playerId);
    const {t} = useTranslation();
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        if (player === null || player === undefined) return;
        const stateElem: JSX.Element = inferStateInfo(t, ctx, localCtx, props.playerId, props.isMain);
        setJSX(stateElem);
    }, [ctx.room.game.state.board, ctx.room.game.action]);

    if (player === null || player === undefined) return <Fragment/>;
    const lastCard = CardPool.getCard(player.lastClaimed);
    return (
        <HorizontalLayout className={`${props.className}`}>
            <div className={classes.profileContainer}>
                <img
                    src={`${lastCard.getImage()}`}
                    alt={lastCard.getName(t)}
                    className={classes.imgLastUsed}
                />
                <p className={classes.textLastClaim}>{insert(t, "_last_claim", lastCard.getName(t))}</p>
                <p className={classes.playerName}>{player?.name}</p>
            </div>
            <div className={classes.actionContainer}>
                {elem}
            </div>
        </HorizontalLayout>
    );
}
