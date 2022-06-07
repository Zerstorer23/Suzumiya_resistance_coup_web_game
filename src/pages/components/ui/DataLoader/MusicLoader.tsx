import {Fragment, useContext, useEffect, useState} from "react";
import {LISTEN_CHILD_ADDED, LISTEN_VALUE, LoadStatus, Snapshot} from "system/types/CommonTypes";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import MusicContext, {MusicContextType, MusicEntry} from "system/context/musicInfo/MusicContextProvider";

export default function MusicLoader() {
    const [loadStatus, setStatus] = useState<LoadStatus>(LoadStatus.init);
    const musicCtx = useContext(MusicContext);

    function onMusicAdded(snapshot: Snapshot) {
        const ce: MusicEntry = snapshot.val();
        if (ce === null || ce === undefined) return;
        // musicCtx.loadChat(ce);
    }

    function onMusicSet(snapshot: Snapshot) {

    }


    useEffect(() => {
        switch (loadStatus) {
            case LoadStatus.init:
                loadMusic().then((musicRoom) => {
                    if (musicRoom !== null) {
                        musicCtx.loadData(musicRoom);
                    }
                    setStatus(LoadStatus.loaded);
                });
                break;
            case LoadStatus.loaded:
                const queueRef = ReferenceManager.getRef(DbReferences.MUSIC_queue);
                const currRef = ReferenceManager.getRef(DbReferences.MUSIC_current);
                queueRef.on(LISTEN_CHILD_ADDED, onMusicAdded);
                currRef.on(LISTEN_VALUE, onMusicSet);
                break;
            case LoadStatus.listening:
                break;
            case LoadStatus.joined:
                break;
            case LoadStatus.outerSpace:
                break;
        }
    }, [loadStatus]);


    return <Fragment/>;
}

export async function loadMusic(): Promise<MusicContextType | null> {
    const musicRef = ReferenceManager.getRef(DbReferences.MUSIC);
    const snapshot = await musicRef.get();
    if (!snapshot.exists()) return null;
    return snapshot.val();
}

function connectListeners() {

}
