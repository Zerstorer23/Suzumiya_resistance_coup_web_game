import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./ChallengerItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import {inferChallengerPanel} from "pages/ingame/Center/MainTableBoard/TableItem/Challenger/ChallengeInferer";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";

export default function ChallengerItem(props: IProps) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const action = ctx.room.game.action;
    const challenger = ctx.room.playerMap.get(action.challengerId);
    const {t} = useTranslation();
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    const panelCss = useAnimFocus(ctx.room.game.state.board, AnimType.FadeIn);
    useEffect(() => {
        const stateElem: JSX.Element = inferChallengerPanel(t, ctx, localCtx, action.challengerId, challenger);
        setJSX(stateElem);
    }, [ctx.room.game.state.board, ctx.room.game.action]);
    if (challenger === null || challenger === undefined) return <Fragment/>;
    if (action.challengerId === action.pierId || action.challengerId === action.targetId) return <Fragment/>;
    // const lastCard = cardPool.get(challenger.lastClaimed);
    return (
        <VerticalLayout className={`${props.className}`}>
            <div className={classes.nameContainer}>
                <p className={classes.playerName}>{challenger!.name}</p>
            </div>
            <HorizontalLayout>
                {/*           <img
                    className={classes.mainImg}
                    src={`${lastCard.getImage()}`}
                    alt={lastCard.getName(t)}
                />*/}
                <div className={`${classes.actionContainer} ${panelCss}`}>
                    {elem}
                </div>
            </HorizontalLayout>
        </VerticalLayout>
    );
}
