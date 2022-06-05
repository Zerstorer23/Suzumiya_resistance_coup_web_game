/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useContext, useEffect} from "react";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";

export function keyCodeToIndex(code: number, max: number) {
    const n = code - 49;
    if (n < 0 || n > max) return -1;
    return n;
}

export default function useShortcut(size: number, onIndexSelected: (n: number) => void) {

    const localCtx = useContext(LocalContext);
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const onKeyDown = useCallback((event: any) => {
        if (localCtx.getVal(LocalField.InputFocus) !== InputCursor.Idle) return;
        const idx = keyCodeToIndex(event.keyCode, size - 1);
        if (idx < 0) return;
        onIndexSelected(idx);
    }, []);

    // return {onKeyDown};
};
