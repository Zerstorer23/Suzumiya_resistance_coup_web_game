import React, {useState} from "react";
import {IProps} from "system/types/CommonTypes";
import "firebase/compat/database";
import {MAX_MUSIC_QUEUE, MAX_PERSONAL_QUEUE,} from "pages/components/ui/MusicModule/MusicModule";
import {randomInt} from "system/GameConstants";
import {DbFields, ReferenceManager,} from "system/Database/ReferenceManager";

export type MusicEntry = {
    key: string;
    pid: string;
    vid: string;
};
// export type MusicDBType = MusicContextType & { queue: any };
export type MusicContextType = {
    list: MusicEntry[];
    current: CounterMusicType;
    enqueue: (a: MusicEntry) => void;
    remove: (a: MusicEntry) => void;
    dequeue: () => MusicEntry | null;
    smartRandom: () => MusicEntry | null;
    setMusic: (cm: CounterMusicType) => void;
};
export type CounterMusicType = {
    c: number;
    entry: MusicEntry;
};
const defaultEntry: CounterMusicType = {
    c: -1,
    entry: {key: "", pid: "", vid: ""},
};

const MusicContext = React.createContext<MusicContextType>({
    list: [],
    current: {...defaultEntry},
    enqueue: (a: MusicEntry) => {
    },
    remove: (a: MusicEntry) => {
    },
    dequeue: () => null,
    smartRandom: () => null,
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
            });
            return newState;
        });
    }

    function dequeue(): MusicEntry | null {
        if (list.length === 0) return null;
        const me = list.shift()!;
        remove(me);
        ReferenceManager.getRef(DbFields.MUSIC_queue).child(me.key).remove();
        return me!;
    }

    function smartRandom(): MusicEntry | null {
        if (list.length === 0) return null;
        const random = randomInt(0, Math.min(5, list.length - 1));
        const me = list[random];
        remove(me);
        ReferenceManager.getRef(DbFields.MUSIC_queue).child(me.key).remove();
        return me!;
    }

    function setMusic(cm: CounterMusicType) {
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
        smartRandom,
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

function filterVidID(url: string) {
    if (url.length === 11) {
        return url;
    } else if (url.includes("youtu.be")) {
        //share url
        let temp = url.lastIndexOf("/");
        return url.substring(temp + 1, temp + 12);
    } else {
        let temp = url.indexOf("v=");
        return url.substring(temp + 2, temp + 13);
    }
}

export function pushMusicToQueue(
    musicCtx: MusicContextType,
    url: string,
    requesterId: string,
): MusicResponse {
    const myList = musicCtx.list.filter((entry) => {
        return entry.pid === requesterId;
    });
    if (myList.length >= MAX_PERSONAL_QUEUE) return MusicResponse.Overloading;
    if (musicCtx.list.length >= MAX_MUSIC_QUEUE) return MusicResponse.FullQueue;
    const id = filterVidID(url);
    if (id.length !== 11) return MusicResponse.InvalidURL;
    const minfo: MusicEntry = {
        key: "",
        pid: requesterId,
        vid: id,
    };
    console.log("c ", musicCtx.current.c);
    if (musicCtx.current.c < 0) {
        const currRef = ReferenceManager.getRef(DbFields.MUSIC_current);
        currRef.set({c: 0, entry: minfo});
    } else {
        console.log("UPdate push arr");
        const ref = ReferenceManager.getRef(DbFields.MUSIC_queue);
        ref.push(minfo);
    }
    return MusicResponse.Success;
}

export function pushCurrentMusic(c: number, me: MusicEntry) {
    ReferenceManager.updateReference(DbFields.MUSIC_current, {
        c: c + 1,
        entry: me,
    });
}

export function cleanMusic() {
    const cRef = ReferenceManager.getRef(DbFields.MUSIC_current);
    const qRef = ReferenceManager.getRef(DbFields.MUSIC_queue);
    qRef.remove();
    cRef.set(defaultEntry);
}

export default MusicContext;
