import gc from "global.module.css";
import BaseBoard from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard";
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

    const board = ctx.room.game.state.board;
    const turn = ctx.room.game.state.turn;
    useEffect(() => {
        const elem = getBoardElemFromRoom(ctx, localCtx);
        setBoardElem((prev) => elem);
    }, [board, turn, ctx.room.playerMap.size]);

    return (
        <div className={`${gc.round_border} ${gc.borderColor} ${classes.container}`}>{boardElem}</div>
    );
}
