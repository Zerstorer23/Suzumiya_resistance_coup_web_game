/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useContext} from "react";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";

export function keyCodeToIndex(code: number, max: number) {
    const n = code - 49;
    if (n < 0 || n > max) return -1;
    return n;
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
export default function useShortcut(size: number, onIndexSelected: (n: number) => void) {
    const localCtx = useContext(LocalContext);
    const onKeyDown = useCallback(
        (keyCode: KeyCode) => {
            const idx = keyCodeToIndex(keyCode, size - 1);
            if (idx < 0) return;
            // console.log("index seleted " + idx + " / cursor " + localCtx.getVal(LocalField.InputFocus));
            if (localCtx.getVal(LocalField.InputFocus) !== InputCursor.Idle) return;
            onIndexSelected(idx);
        }
        , [localCtx]);
    useKeyListener(targets, onKeyDown);
};
