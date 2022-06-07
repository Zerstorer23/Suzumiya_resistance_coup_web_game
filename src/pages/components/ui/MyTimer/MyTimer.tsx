import {Fragment, useContext, useEffect} from "react";
import {useTimer} from "react-timer-hook";
import LocalContext, {LocalContextType, LocalField, TimerOptionType,} from "system/context/localInfo/local-context";
import {TimerReturnType} from "system/types/CommonTypes";

export const TimerCode = [0];

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
        console.log("Start timer " + option.duration);
        timer.restart(getTimeAfter(option.duration), true);
    }, [option]);

    return <Fragment>{timer.seconds}</Fragment>;
}

export function setMyTimer(
    localCtx: LocalContextType,
    duration: number,
    onExpire: () => void
) {
    console.trace("Set timer");
    TimerCode[0]++;
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
