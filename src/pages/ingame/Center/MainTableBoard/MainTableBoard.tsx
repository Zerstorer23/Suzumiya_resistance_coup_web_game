import VerticalLayout from "pages/components/ui/VerticalLayout";
import TableItem from "pages/ingame/Center/MainTableBoard/TableItem/TableItem";
import gc from "global.module.css";
import classes from "./MainTableBoard.module.css";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {StateManager} from "system/GameStates/States";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";

export default function MainTableBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const mainId: string = getMainPlayerFromState(ctx);
    const subId: string = getSubPlayerFromState(ctx);
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <p className={classes.timer}>
                    <MyTimer/> seconds remaining...
                </p>
                <TableItem isMain={true} className={classes.topContainer} playerId={mainId}/>
                <TableItem isMain={false} className={classes.bottomContainer} playerId={subId}/>
            </VerticalLayout>
        </div>
    );
}

export function getMainPlayerFromState(ctx: RoomContextType): string {
    const board = ctx.room.game.state.board;
    if (StateManager.targetIsChallenged(board))
        return ctx.room.game.action.targetId;
    return ctx.room.game.action.pierId;
}

export function getSubPlayerFromState(ctx: RoomContextType): string {
    const board = ctx.room.game.state.board;
    if (StateManager.targetIsChallenged(board))
        return ctx.room.game.action.challengerId;
    return ctx.room.game.action.targetId;
}
