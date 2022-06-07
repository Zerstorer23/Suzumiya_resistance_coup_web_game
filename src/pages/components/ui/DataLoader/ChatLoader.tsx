import {Fragment, useContext, useEffect} from "react";
import ChatContext, {ChatEntry} from "system/context/chatInfo/ChatContextProvider";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {LISTEN_CHILD_ADDED, Snapshot} from "system/types/CommonTypes";

export default function ChatLoader() {
    const chatCtx = useContext(ChatContext);

    function onChatAdded(snapshot: Snapshot) {
        const ce: ChatEntry = snapshot.val();
        if (ce === null || ce === undefined) return;
        chatCtx.loadChat(ce);
    }

    useEffect(() => {
        const chatRef = ReferenceManager.getRef(DbReferences.CHAT);
        chatRef.on(LISTEN_CHILD_ADDED, onChatAdded);
    }, []);


    return <Fragment/>;
}