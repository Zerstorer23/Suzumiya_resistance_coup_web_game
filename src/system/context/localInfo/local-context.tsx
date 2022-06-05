import React from "react";

export type ContextFieldType<T> = {
    val: T | null;
    set: (nv: T) => void;
};
export type LocalContextType = {
    map: Map<LocalField, ContextFieldType<any>>;
    getVal: (field: LocalField) => any;
    setVal: (field: LocalField, val: any) => void;
};

export enum LocalField {
    Id,
    PlayerSelector,
    TutorialSelector,
    Timer,
    InputFocus
}

export type TimerOptionType = {
    duration: number;
    onExpire: any;
};
const LocalContext = React.createContext<LocalContextType>({
    map: new Map<LocalField, any>(),
    getVal: (field: LocalField) => {
    },
    setVal: (field: LocalField, val: any) => {
    },
});
export default LocalContext;
