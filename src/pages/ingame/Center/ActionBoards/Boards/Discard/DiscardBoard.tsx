import {Fragment, useContext, useEffect, useState} from "react";
import {KillInfo} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {handleDiscardState} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";


export default function DiscardBoard(): JSX.Element {
    //Displayed on Coup Target
    //Or Assassinate Target
    //Or Challenge Loser
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const killInfo = ctx.room.game.action.param as KillInfo;

    /**
     * If I am killInfo.target
     *
     *
     *   if idx > 0
     *
     *
     *  if i am not target
     *    show bboard based on index
     */
    const [jsxElem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        const elem = handleDiscardState(ctx, localCtx, killInfo);
        setJSX(elem);
    }, [killInfo.removed]);


    return jsxElem;
}
