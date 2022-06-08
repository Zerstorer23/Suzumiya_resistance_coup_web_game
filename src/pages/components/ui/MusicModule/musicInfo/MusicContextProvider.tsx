import React, {useState} from "react";
import {IProps} from "system/types/CommonTypes";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import "firebase/compat/database";

export type MusicEntry = {
    key: string,
    pid: string,
    vid: string,
}
// export type MusicDBType = MusicContextType & { queue: any };
export type MusicContextType = {
    list: MusicEntry[];
    current: CounterMusicType,
    enqueue: (a: MusicEntry) => void;
    remove: (a: MusicEntry) => void;
    dequeue: () => MusicEntry | null;
    setMusic: (cm: CounterMusicType) => void;
};
export type CounterMusicType = {
    c: number,
    entry: MusicEntry
};
const defaultEntry: CounterMusicType = {
    c: -1,
    entry: {key: "", pid: "", vid: ""}
};

const MusicContext = React.createContext<MusicContextType>({
    list: [],
    current: {...defaultEntry},
    enqueue: (a: MusicEntry) => {
    },
    remove: (a: MusicEntry) => {
    },
    dequeue: () => null,
    setMusic: (a: any) => {
    },
});


export function MusicProvider(props: IProps) {
    const [list, setList] = useState<MusicEntry[]>([]);
    const [current, setCurrent] = useState<CounterMusicType>({...defaultEntry});

    function enqueue(me: MusicEntry) {
        setList((prev) => {
            return [...prev, me];
        });
    }

    function remove(removed: MusicEntry) {
        setList((prev) => {
            const newState = prev.filter((entry) => {
                return entry.key !== removed.key;
                //  return entry.vid !== removed.vid && entry.pid !== removed.pid;
            });
            return (newState);
        });
    }

    function dequeue(): MusicEntry | null {
        if (list.length === 0) return null;
        const me = list.shift()!;
        remove(me);
        ReferenceManager.getRef(DbReferences.MUSIC_queue).child(me.key).remove();
        return me!;
    }

    function setMusic(cm: CounterMusicType) {
        console.log("set current");
        setCurrent(cm);
    }


    /*    function loadData(a: MusicDBType) {
            const queueObj = a.queue;
            const list: MusicEntry[] = [];
            if (queueObj !== undefined) {
                Object.entries(queueObj).forEach(([key, value]) => {
                    list.push(value as MusicEntry);
                });
                setList(getSortedMusicList(list));
            }
            console.log("Load data ", a);
            setCurrent(a.current);
        }*/

    const context: MusicContextType = {
        list,
        current,
        enqueue,
        remove,
        dequeue,
        setMusic,
    };
    return (
        <MusicContext.Provider value={context}>
            {props.children}
        </MusicContext.Provider>
    );
}

export enum MusicResponse {
    Success,
    InvalidURL,
    FullQueue,
    Overloading,
}

export const MAX_MUSIC_QUEUE = 20;
export const MAX_PERSONAL_QUEUE = 5;

export function pushMusicToQueue(musicCtx: MusicContextType, url: string, requesterId: string): MusicResponse {
    const myList = musicCtx.list.filter((entry) => {
        return entry.pid === requesterId;
    });
    if (myList.length >= MAX_PERSONAL_QUEUE) return MusicResponse.Overloading;
    if (musicCtx.list.length >= MAX_MUSIC_QUEUE) return MusicResponse.FullQueue;
    const urlToken = url.split("=");
    const id = urlToken[urlToken.length - 1];
    if (id.length !== 11) return MusicResponse.InvalidURL;
    const minfo: MusicEntry = {
        key: "",
        pid: requesterId,
        vid: id,
    };
    console.log("c ", musicCtx.current.c);
    if (musicCtx.current.c < 0) {
        const currRef = ReferenceManager.getRef(DbReferences.MUSIC_current);
        currRef.set({c: 0, entry: minfo});
    } else {
        console.log("UPdate push arr");
        const ref = ReferenceManager.getRef(DbReferences.MUSIC_queue);
        ref.push(minfo);
    }
    return MusicResponse.Success;
}

export function pushCurrentMusic(c: number, me: MusicEntry) {
    ReferenceManager.updateReference(DbReferences.MUSIC_current, {c: c + 1, entry: me});
}

export function cleanMusic() {
    const cRef = ReferenceManager.getRef(DbReferences.MUSIC_current);
    const qRef = ReferenceManager.getRef(DbReferences.MUSIC_queue);
    qRef.remove();
    cRef.set(defaultEntry);
}


/*export function getSortedMusicList(list: MusicEntry[]): MusicEntry[] {
    if (list === undefined) return [];
    console.log("sort ");
    console.log(list);
    return list.sort((e1: MusicEntry, e2: MusicEntry) =>
        e1.time > e2.time ? 1 : e1.time < e2.time ? -1 : 0
    );
}*/

export default MusicContext;