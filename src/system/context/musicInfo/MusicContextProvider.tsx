import React, {useCallback, useState} from "react";
import {IProps} from "system/types/CommonTypes";

export type MusicEntry = {
    pid: string,
    vid: string,
    time: Object | number,
}
export type MusicContextType = {
    queue: MusicEntry[];
    current: CounterMusicType,
    enqueue: (a: MusicEntry) => void;
    setMusic: (a: any) => void;
    loadData: (a: MusicContextType) => void
};
export type CounterMusicType = {
    c: number,
    entry: MusicEntry
};
const defaultEntry: CounterMusicType = {c: -1, entry: {pid: "", vid: "", time: 0}};

const MusicContext = React.createContext<MusicContextType>({
    queue: [],
    current: {...defaultEntry},
    enqueue: (a: MusicEntry) => {
    },
    setMusic: (a: any) => {
    },
    loadData: (a: MusicContextType) => {
    }
});


export function MusicProvider(props: IProps) {
    const [queue, setQueue] = useState<MusicEntry[]>([]);
    const [current, setCurrent] = useState<CounterMusicType>({...defaultEntry});

    function enqueue(me: MusicEntry) {
        if (me === null) return;
        setQueue((prev) => {
            const newState = [...prev];
            newState.push(me);
            return newState;
        });
    }

    function setMusic(me: MusicEntry) {
        setCurrent((prev) => {
            return {
                c: prev.c + 1,
                entry: me,
            };
        });
    }

    const loadData = useCallback((a: MusicContextType) => {
        setQueue(a.queue);
        setCurrent(a.current);
    }, []);

    const context: MusicContextType = {
        queue,
        current,
        enqueue,
        setMusic,
        loadData,
    };
    return (
        <MusicContext.Provider value={context}>
            {props.children}
        </MusicContext.Provider>
    );
}


export default MusicContext;