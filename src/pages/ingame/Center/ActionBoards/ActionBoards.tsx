import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import {useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import classes from "./ActionBoards.module.css";
import {getBoardElemFromRoom} from "pages/ingame/Center/ActionBoards/StateManagers/ActionBoardManager";
import {IProps} from "system/types/CommonTypes";

type Props = IProps & { code: number }
export default function ActionBoards(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [boardElem, setBoardElem] = useState(<BaseBoard/>);
    
    useEffect(() => {
        const elem = getBoardElemFromRoom(ctx, localCtx);
        setBoardElem((prev) => elem);
    }, [
        // ctx.room.game.state.turn,
        ctx.room.game.state.board, ctx.room.playerMap.size]);


    return (
        <div className={`${gc.round_border} ${classes.container}`}>{boardElem}</div>
    );
}
