import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./TableItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {inferStateInfo} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";
import {CardPool} from "system/cards/CardPool";
import {ReferenceManager} from "system/Database/RoomDatabase";

type Props = {
    playerId: string;
    isMain: boolean;
} & IProps;
export default function TableItem(props: Props) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const player = ctx.room.playerMap.get(props.playerId);
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        if (player === null || player === undefined) return;
        const stateElem: JSX.Element = inferStateInfo(ctx, localCtx, props.playerId, props.isMain);
        setJSX(stateElem);
    }, [ctx.room.game.state.board, ctx.room.game.action]);

    if (player === null || player === undefined) return <Fragment/>;
    const lastCard = CardPool.getCard(player.lastClaimed);
    ReferenceManager;
    return (
        <HorizontalLayout className={`${props.className} ${classes.container}`}>
            <div className={classes.profileContainer}>
                <img
                    src={`${lastCard.getImage()}`}
                    alt={lastCard.getName()}
                    className={classes.imgLastUsed}
                />
                <p className={classes.textLastClaim}>{`Last claim: ${lastCard.getName()}`}</p>
                <p className={classes.playerName}>{player?.name}</p>
            </div>
            <div className={classes.actionContainer}>
                <p className={classes.textMainAction}>{elem}</p>
            </div>
        </HorizontalLayout>
    );
}
