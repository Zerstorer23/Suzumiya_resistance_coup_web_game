import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import getImage, {Images} from "resources/Resources";
import classes from "./TableItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {inferStateInfo} from "pages/ingame/Center/MainTableBoard/TableItem/BoardInferer";

type Props = {
    playerId: string;
    isMain: boolean;
} & IProps;
export default function TableItem(props: Props) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const player = ctx.room.playerMap.get(props.playerId);
    const lastChar = getImage(Images.Haruhi);
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        const stateElem: JSX.Element = inferStateInfo(ctx, localCtx, props.playerId, props.isMain);
        setJSX(stateElem);
    }, [ctx.room.game.state.board, ctx.room.game.action]);
    if (player === null) return <Fragment/>;

    return (
        <HorizontalLayout className={`${props.className} ${classes.container}`}>
            <div className={classes.profileContainer}>
                <img
                    src={`${lastChar}`}
                    alt="lastchar"
                    className={classes.imgLastUsed}
                />
                <p className={classes.textLastClaim}>Last claim: Spy</p>
                <p className={classes.playerName}>{player?.name}</p>
            </div>
            <div className={classes.actionContainer}>
                <p className={classes.textMainAction}>{elem}</p>
            </div>
        </HorizontalLayout>
    );
}
