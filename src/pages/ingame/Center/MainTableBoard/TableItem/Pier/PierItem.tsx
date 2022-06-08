import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./PierItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {CardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";
import {inferPierPanel} from "pages/ingame/Center/MainTableBoard/TableItem/Pier/PierInferer";


export default function PierItem(props: IProps) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const action = ctx.room.game.action;
    const pier = ctx.room.playerMap.get(action.pierId);
    const {t} = useTranslation();
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        const stateElem: JSX.Element = inferPierPanel(t, ctx, localCtx, action.pierId);
        setJSX(stateElem);
    }, [ctx.room.game.state.board, ctx.room.game.action]);

    if (pier === null || pier === undefined) return <Fragment/>;
    const lastCard = CardPool.getCard(pier.lastClaimed);
    return (
        <HorizontalLayout className={`${props.className}`}>
            <div className={classes.profileContainer}>
                <img
                    src={`${lastCard.getImage()}`}
                    alt={lastCard.getName(t)}
                    className={classes.imgLastUsed}
                />
                <p className={classes.textLastClaim}>{insert(t, "_last_claim", lastCard.getName(t))}</p>
                <p className={classes.playerName}>{pier.name}</p>
            </div>
            <div className={classes.actionContainer}>
                {elem}
            </div>
        </HorizontalLayout>
    );
}
