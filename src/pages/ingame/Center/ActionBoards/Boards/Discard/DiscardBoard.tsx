import {Fragment, useContext, useEffect, useState} from "react";
import {KillInfo} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {handleDiscardState} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardSolver";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {inferWaitTime} from "pages/ingame/Center/MainTableBoard/TimeInferer";
import {BoardState} from "system/GameStates/States";
import {autoKillCard} from "pages/ingame/Center/ActionBoards/Boards/Discard/DiscardPanels";
import {useTranslation} from "react-i18next";


export default function DiscardBoard(): JSX.Element {
    //Displayed on Coup Target
    //Or Assassinate Target
    //Or Challenge Loser
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const killInfo = ctx.room.game.action.param as KillInfo;
    const myId = localCtx.getVal(LocalField.Id);
    const {t} = useTranslation();
    const [jsxElem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        if (BoardState.DiscardingCard !== (ctx.room.game.state.board)) return;
        const time = inferWaitTime(ctx.room.game.state.board, ctx.room.game.action);

        setMyTimer(localCtx, time, () => {
            if (myId === killInfo.ownerId && killInfo.ownerId === myId) {
                //I didnt choose anything for 15 sec....
                autoKillCard(t, ctx, ctx.room.playerMap.get(myId)!);
            }
        });
        const elem = handleDiscardState(ctx, localCtx, killInfo);
        setJSX(elem);
    }, [killInfo.removed]);


    return jsxElem;
}
