import {LocalContextType} from "system/context/localInfo/local-context";
import {useEffect} from "react";
import {setMyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {DS} from "system/Debugger/DS";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";

export default function useDefaultAction(ctx: RoomContextType, localCtx: LocalContextType, onExpire: () => void) {
    useEffect(() => {
        if (!DS.StrictRules) return;
        setMyTimer(ctx, localCtx, () => {
            onExpire();
        });
    }, []);

}