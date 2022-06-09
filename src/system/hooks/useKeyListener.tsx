import {useEffect, useState} from "react";

export enum KeyCode {
    Undefined = -1,
    Enter = 13,
    Space = 32,
    One = 49,
    Two = 50,
    Three = 51,
    Four = 52,
    Five = 53,
    Six = 54,
    Seven = 55,
}

export default function useKeyListener(targets: KeyCode[], onKeyDown: (keyCode: KeyCode) => void) {
    const [keyInfo, setKeyInfo] = useState<{ idx: number, code: KeyCode }>({idx: 0, code: KeyCode.Undefined});
    ///====Key listener====///
    useEffect(() => {
        document.addEventListener('keydown', onKeyEvent);
        return () => {
            document.removeEventListener('keydown', onKeyEvent);
        };
    }, []);

    function onKeyEvent(event: any) {
        if (!targets.includes(event.keyCode)) return;
        setKeyInfo((prevState) => ({idx: prevState.idx + 1, code: event.keyCode}));
    }

    useEffect(() => {
        if (keyInfo.code === KeyCode.Undefined) return;
        onKeyDown(keyInfo.code);
    }, [keyInfo.idx]);

}

