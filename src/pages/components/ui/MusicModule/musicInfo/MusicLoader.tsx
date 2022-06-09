import {Fragment, useContext, useEffect} from "react";
import {LISTEN_CHILD_ADDED, LISTEN_CHILD_REMOVED, LISTEN_VALUE, Snapshot} from "system/types/CommonTypes";
import MusicContext, {
    CounterMusicType,
    MusicEntry
} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";

export default function MusicLoader() {
    const musicCtx = useContext(MusicContext);

    function onMusicAdded(snapshot: Snapshot) {
        const ce: MusicEntry = snapshot.val();
        if (ce === null || ce === undefined) return;
        ce.key = snapshot.key!;
        musicCtx.enqueue(ce);
    }

    function onMusicRemoved(snapshot: Snapshot) {
        const ce: MusicEntry = snapshot.val();
        if (ce === null || ce === undefined) return;
        ce.key = snapshot.key!;
        musicCtx.remove(ce);
    }

    function onMusicSet(snapshot: Snapshot) {
        const current: CounterMusicType = snapshot.val();
        if (current === null || current === undefined) return;
        musicCtx.setMusic(current);
    }

    useEffect(() => {
        const queueRef = ReferenceManager.getRef(DbReferences.MUSIC_queue);
        const currRef = ReferenceManager.getRef(DbReferences.MUSIC_current);
        queueRef.on(LISTEN_CHILD_ADDED, onMusicAdded);
        queueRef.on(LISTEN_CHILD_REMOVED, onMusicRemoved);
        currRef.get().then((snapshot) => {
            if (!snapshot.exists()) return;
            onMusicSet(snapshot);
        });
        currRef.on(LISTEN_VALUE, onMusicSet);
        return () => {
            queueRef.off();
            currRef.off();
        };
    }, []);


    return <Fragment/>;
}

/*export async function loadMusic(): Promise<MusicDBType | null> {
    const musicRef = ReferenceManager.getRef(DbReferences.MUSIC);
    const snapshot = await musicRef.get();
    if (!snapshot.exists()) return null;
    return snapshot.val();
}*/


