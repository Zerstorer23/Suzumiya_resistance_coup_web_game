import {Fragment, useContext, useEffect} from "react";
import {useTimer} from "react-timer-hook";
import LocalContext, {LocalContextType, LocalField, TimerOptionType,} from "system/context/localInfo/local-context";
import {TimerReturnType} from "system/types/CommonTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {inferWaitTime} from "pages/ingame/Center/ActionBoards/StateManagers/TimeInferer";


function getTimeAfter(sec: number) {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + sec); // 10 minutes time
    return expiryTimestamp;
}

export function MyTimer(): JSX.Element {
    const localCtx = useContext(LocalContext);
    const option: TimerOptionType = localCtx.getVal(LocalField.Timer);
    const timer: TimerReturnType = useTimer({
        expiryTimestamp: getTimeAfter(option.duration),
        onExpire: () => {
            option.onExpire();
        },
    });
    useEffect(() => {
        timer.restart(getTimeAfter(option.duration), true);
    }, [option]);

    return <Fragment>{timer.seconds}</Fragment>;
}

export function setMyTimer(
    ctx: RoomContextType,
    localCtx: LocalContextType,
    onExpire: () => void,
) {
    const duration = inferWaitTime(ctx.room.game.state.board);
    // console.trace("Set timer");
    const option = createTimeOption(duration, onExpire);
    localCtx.setVal(LocalField.Timer, option);
}

export function forceSetTimer(
    localCtx: LocalContextType,
    duration: number,
    onExpire: () => void) {
    const option = createTimeOption(duration, onExpire);
    localCtx.setVal(LocalField.Timer, option);
}

/**
 * Easily generates Option object for you.

 */
function createTimeOption(
    duration: number,
    onExpire: () => void
): TimerOptionType {
    return {
        duration,
        onExpire,
    };
}
