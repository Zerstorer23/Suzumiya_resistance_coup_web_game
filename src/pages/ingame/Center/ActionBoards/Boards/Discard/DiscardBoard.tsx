import {Fragment, useContext, useEffect, useState} from "react";
import {KillInfo} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {handleDiscardState} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {inferWaitTime} from "pages/ingame/Center/MainTableBoard/TimeInferer";
import {DS} from "system/Debugger/DS";
import {BoardState} from "system/GameStates/States";


export default function DiscardBoard(): JSX.Element {
    //Displayed on Coup Target
    //Or Assassinate Target
    //Or Challenge Loser
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const killInfo = ctx.room.game.action.param as KillInfo;

    const [jsxElem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        if (BoardState.DiscardingCard !== (ctx.room.game.state.board)) return;
        const time = inferWaitTime(ctx.room.game.state.board, ctx.room.game.action);
        setMyTimer(localCtx, time, () => {
            if (DS.StrictRules && killInfo.removed[0] < 0) {
                //TODO kill himself
            }
        });
        const elem = handleDiscardState(ctx, localCtx, killInfo);
        setJSX(elem);
    }, [killInfo.removed]);


    return jsxElem;
}
