import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard";
import {useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {BoardState} from "system/GameStates/States";
import classes from "./ActionBoards.module.css";
import {getBoardElemFromRoom} from "pages/ingame/Center/ActionBoards/StateManagers/ActionBoardManager";
import {IProps} from "system/types/CommonTypes";

type Props = IProps & { code: number }
export default function ActionBoards(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [boardElem, setBoardElem] = useState(<BaseBoard/>);
    const boardState: BoardState = ctx.room.game.state.board;
    useEffect(() => {
        const elem = getBoardElemFromRoom(ctx, localCtx);
        setBoardElem(elem);
    }, [boardState, ctx.room.playerMap.size]);

    return (
        <div className={`${gc.round_border} ${classes.container}`}>{boardElem}</div>
    );
}
