import {LocalContextType} from "system/context/localInfo/local-context";
import {useEffect} from "react";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {WaitTime} from "system/GameConstants";
import {DS} from "system/Debugger/DS";

export default function useDefaultAction(localCtx: LocalContextType, onExpire: () => void) {
    useEffect(() => {
        if (!DS.StrictRules) return;
        setMyTimer(localCtx, WaitTime.MakingDecision, () => {
            onExpire();
        });
    }, []);

}