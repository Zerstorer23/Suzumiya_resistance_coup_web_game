import VerticalLayout from "pages/components/ui/VerticalLayout";
import gc from "global.module.css";
import classes from "./MainTableBoard.module.css";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {ActionType, BoardState, StateManager} from "system/GameStates/States";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {KillInfo} from "system/GameStates/GameTypes";
import {useTranslation} from "react-i18next";
import PierItem from "pages/ingame/Center/MainTableBoard/TableItem/Pier/PierItem";
import TargetItem from "pages/ingame/Center/MainTableBoard/TableItem/Target/TargetItem";
import ChallengerItem from "pages/ingame/Center/MainTableBoard/TableItem/Challenger/ChallengerItem";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";

export default function MainTableBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const mainId: string = getMainPlayerFromState(ctx);
    const subId: string = getSubPlayerFromState(ctx);
    const {t} = useTranslation();
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <p className={classes.timer}>
                    <MyTimer/>{t("_seconds_remaining")}
                </p>
                <PierItem className={classes.pierContainer}/>
                {/*<TableItem isMain={true} className={classes.topContainer} playerId={mainId}/>*/}
                <HorizontalLayout className={classes.horizontalContainer}>
                    <TargetItem className={classes.targetContainer}/>
                    <ChallengerItem className={classes.challengerContainer}/>
                </HorizontalLayout>
                {/*<TableItem isMain={false} className={classes.bottomContainer} playerId={subId}/>*/}
            </VerticalLayout>
        </div>
    );
}

export function getMainPlayerFromState(ctx: RoomContextType): string {
    const board = ctx.room.game.state.board;
    if (StateManager.targetIsChallenged(board))
        return ctx.room.game.action.targetId;
    /*    if (board === BoardState.DiscardingCard) {
            const killInfo = ctx.room.game.action.param as KillInfo;
            if (killInfo.cause === ActionType.IsALie) {
                return ctx.room.game.action.pierId;
            } else {
                return ctx.room.game.action.pierId;
            }
        }*/
    return ctx.room.game.action.pierId;
}

export function getSubPlayerFromState(ctx: RoomContextType): string {
    const board = ctx.room.game.state.board;
    if (StateManager.isChallenged(board))
        return ctx.room.game.action.challengerId;
    if (BoardState.DiscardingCard === (board)) {
        const killInfo = ctx.room.game.action.param as KillInfo;
        if (killInfo.cause === ActionType.IsALie) {
            if (ctx.room.game.action.pierId === killInfo.ownerId) {
                return ctx.room.game.action.challengerId;
            } else {
                return killInfo.ownerId;
            }
        }
    }
    return ctx.room.game.action.targetId;
}