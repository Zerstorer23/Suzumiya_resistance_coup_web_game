import {useState} from "react";
import LocalContext, {LocalContextType, LocalField, TimerOptionType,} from "system/context/localInfo/local-context";
import {WaitTime} from "system/GameConstants";
import {IProps} from "system/types/CommonTypes";

/*
Local context holds local data that does not go into database
*/

export enum CursorState {
    Idle = "Idle",
    Selecting = "Selecting",
}

export enum InputCursor {
    Idle,
    Chat,
}

export default function LocalProvider(props: IProps) {
    const [myId, setMyId] = useState<string | null>(null);
    const [tutorialSelector, setTutorialSelected] = useState<CursorState>(CursorState.Idle);
    const [inputFocused, setInputFocused] = useState<InputCursor>(InputCursor.Idle);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [timerOption, setTimerOption] = useState<TimerOptionType>({
        duration: WaitTime.MakingDecision,
        onExpire: () => {
        },
    });

    //https://immerjs.github.io/immer/example-setstate

    const map = new Map();
    map.set(LocalField.Id, {
        val: myId,
        set: setMyId,
    });

    map.set(LocalField.TutorialSelector, {
        val: tutorialSelector,
        set: setTutorialSelected,
    });
    map.set(LocalField.Timer, {
        val: timerOption,
        set: setTimerOption,
    });
    map.set(LocalField.InputFocus, {
        val: inputFocused,
        set: setInputFocused,
    });
    map.set(LocalField.Muted, {
        val: isMuted,
        set: setIsMuted,
    });

    /*
    Map is not supposed to be used by other classes
    use get and set
    */
    const context: LocalContextType = {
        map,
        getVal: (field: LocalField) => {
            return map.get(field).val!;
        },
        setVal: (field: LocalField, val: any) => {
            map.get(field).set(val);
        },
    };
    return (
        <LocalContext.Provider value={context}>
            {props.children}
        </LocalContext.Provider>
    );
}
