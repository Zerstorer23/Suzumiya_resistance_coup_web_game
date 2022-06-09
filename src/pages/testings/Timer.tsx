import React from "react";
import {useTimer} from "react-timer-hook";
import "firebase/compat/database";
import {TimerReturnType} from "system/types/CommonTypes";
//https://www.npmjs.com/package/react-timer-hook

export default function TestTimer() {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 600); // 10 minutes timer
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    }: TimerReturnType = useTimer({
        expiryTimestamp,
        onExpire: () => console.warn("onExpire called"),
    });

    return (
        <div style={{textAlign: "center"}}>
            <h1>react-timer-hook </h1>
            <p>{}</p>
            <p>{new Date().getUTCMilliseconds()}</p>
            <p>Timer Demo</p>
            <div style={{fontSize: "100px"}}>
                <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
                <span>{seconds}</span>
            </div>
            <p>{isRunning ? "Running" : "Not running"}</p>
            <button onClick={start}>Start</button>
            <button onClick={pause}>Pause</button>
            <button onClick={resume}>Resume</button>
            <button
                onClick={() => {
                    // Restarts to 5 minutes timer
                    const time = new Date();
                    time.setSeconds(time.getSeconds() + 300);
                    restart(time);
                }}
            >
                Restart
            </button>
        </div>
    );
}
