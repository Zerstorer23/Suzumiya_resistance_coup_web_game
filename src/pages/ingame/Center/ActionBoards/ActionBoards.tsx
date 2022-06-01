import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import {useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState} from "system/GameStates/States";
import classes from "./ActionBoards.module.css";
import {getBoardElemFromRoom} from "pages/ingame/Center/ActionBoards/StateManagers/ActionBoardManager";

export default function ActionBoards(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [boardElem, setBoardElem] = useState(<BaseBoard/>);
    const boardState: BoardState = ctx.room.game.state.board;
    useEffect(() => {
        const elem = getBoardElemFromRoom(ctx, localCtx);
        setBoardElem(elem);
    }, [boardState]);

    return (
        <div className={`${gc.round_border} ${classes.container}`}>{boardElem}</div>
    );
}
