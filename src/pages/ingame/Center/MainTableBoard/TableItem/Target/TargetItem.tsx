import {IProps} from "system/types/CommonTypes";
import classes from "./TargetItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import {cardPool} from "system/cards/CardPool";
import {useTranslation} from "react-i18next";
import {isNull} from "system/GameConstants";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {inferTargetPanel} from "pages/ingame/Center/MainTableBoard/TableItem/Target/TargetInferer";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";
import {BoardState, StateManager} from "system/GameStates/States";


export default function TargetItem(props: IProps) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const action = ctx.room.game.action;
    const board = ctx.room.game.state.board;
    const target = ctx.room.playerMap.get(action.targetId);
    const {t} = useTranslation();
    const [elem, setJSX] = useState<JSX.Element>(<Fragment/>);
    const panelCss = useAnimFocus(ctx.room.game.state.board, AnimType.FadeIn);
    useEffect(() => {
        const stateElem: JSX.Element = inferTargetPanel(t, ctx, localCtx, action.targetId, target);
        setJSX(stateElem);
    }, [board, action]);
    if (isNull(target)) return <Fragment/>;

    const showIcon = (StateManager.pierIsBlocked(board)
        || StateManager.isChallenged(board)
        || board === BoardState.DiscardingCard
        || board === BoardState.DiscardingFinished);
    
    const lastCard = cardPool.get(target!.lastClaimed);
    return (
        <VerticalLayout className={`${props.className}`}>
            <div className={classes.nameContainer}>
                <p className={classes.playerName}>{target!.name}</p>
            </div>
            <HorizontalLayout>
                <Fragment>
                    {(showIcon) && <img
                        className={classes.mainImg}
                        src={`${lastCard.getImage()}`}
                        alt={lastCard.getName(t)}
                    />}
                </Fragment>
                <div className={`${classes.actionContainer} ${panelCss}`}>
                    {elem}
                </div>
            </HorizontalLayout>
        </VerticalLayout>
    );
}
