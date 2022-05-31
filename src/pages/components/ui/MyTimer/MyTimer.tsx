import {useContext} from "react";
import {Fragment, useEffect} from "react";
import {useTimer} from "react-timer-hook";
import LocalContext, {
    LocalContextType,
    LocalField,
    TimerOptionType,
} from "system/context/localInfo/local-context";
import {IProps, TimerReturnType} from "system/types/CommonTypes";

export function MyTimer(props: IProps): JSX.Element {
    const expiryTimestamp = new Date();
    const localCtx = useContext(LocalContext);
    const option: TimerOptionType = localCtx.getVal(LocalField.Timer);
    // REACTION_MAX_SEC
    /**
     *Behavoir when this element is removed
     *
     */
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + option.duration); // 10 minutes timer
    const timer: TimerReturnType = useTimer({
        expiryTimestamp,
        onExpire: () => {
            option.onExpire();
        },
    });
    console.log("Timer loaded / " + timer.seconds);
    useEffect(() => {
        timer.restart(expiryTimestamp, true);
    }, [option]);

    return <Fragment>{timer.seconds}</Fragment>;
}

export function setMyTimer(
    localCtx: LocalContextType,
    duration: number,
    onExpire: () => void
) {
    const option = createTimeOption(duration, onExpire);
    localCtx.setVal(LocalField.Timer, option);
}

/**
 * Easily generates Option object for you.
 * @param duration
 * @param onExpire
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
