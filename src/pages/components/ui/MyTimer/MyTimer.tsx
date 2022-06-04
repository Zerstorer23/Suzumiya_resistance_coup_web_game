import {Fragment, useContext, useEffect} from "react";
import {useTimer} from "react-timer-hook";
import LocalContext, {LocalContextType, LocalField, TimerOptionType,} from "system/context/localInfo/local-context";
import {TimerReturnType} from "system/types/CommonTypes";

export const TimerCode = [0];

export function MyTimer(): JSX.Element {
    const expiryTimestamp = new Date();
    const localCtx = useContext(LocalContext);
    const option: TimerOptionType = localCtx.getVal(LocalField.Timer);
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + option.duration); // 10 minutes timer
    const timer: TimerReturnType = useTimer({
        expiryTimestamp,
        onExpire: () => {
            if (TimerCode[0] === option.code) {
                option.onExpire();
            } else {
                console.warn("Wrong timer");
            }
        },
    });
    useEffect(() => {
        timer.restart(expiryTimestamp, true);
    }, [option.code]);

    return <Fragment>{timer.seconds}</Fragment>;
}

export function setMyTimer(
    localCtx: LocalContextType,
    duration: number,
    onExpire: () => void
) {
    TimerCode[0]++;
    const option = createTimeOption(duration, TimerCode[0], onExpire);
    localCtx.setVal(LocalField.Timer, option);
}

/**
 * Easily generates Option object for you.
 * @param duration
 * @param onExpire
 */
function createTimeOption(
    duration: number,
    code: number,
    onExpire: () => void
): TimerOptionType {
    return {
        duration,
        code,
        onExpire,
    };
}
