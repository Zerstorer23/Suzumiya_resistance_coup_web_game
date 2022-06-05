/* eslint-disable react-hooks/exhaustive-deps */
import {useContext, useEffect, useState} from "react";
import {KeyCode} from "system/hooks/useKeyListener";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";

export function keyCodeToIndex(code: number, max: number) {
    const n = code - 49;
    if (n < 0 || n > max) return -1;
    return n;
}

export type KeyIndexType = {
    counter: number,
    index: number
}
export type KeyInfoType = {
    counter: number,
    index: number
}
const targets = [
    KeyCode.One,
    KeyCode.Two,
    KeyCode.Three,
    KeyCode.Four,
    KeyCode.Five,
    KeyCode.Six,
    KeyCode.Seven,
];


export function useShortcutEffect(size: number) {
    const localCtx = useContext(LocalContext);
    const [keyInfo, setKeyInfo] = useState<KeyIndexType>({counter: 0, index: -1});
    ///====Key listener====///
    useEffect(() => {
        document.addEventListener('keydown', onKeyEvent);
        return () => {
            document.removeEventListener('keydown', onKeyEvent);
        };
    }, []);

    function onKeyEvent(event: any) {
        if (!targets.includes(event.keyCode)) return;
        const index = keyCodeToIndex(event.keyCode, size - 1);
        if (index < 0) return;
        if (localCtx.getVal(LocalField.InputFocus) !== InputCursor.Idle) return;
        setKeyInfo((prevState) => ({counter: prevState.counter + 1, index}));
    }

    return keyInfo;
}
