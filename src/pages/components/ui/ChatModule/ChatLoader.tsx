import {Fragment, useContext, useEffect} from "react";
import ChatContext, {ChatEntry} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {LISTEN_CHILD_ADDED, Snapshot} from "system/types/CommonTypes";
import {DbReferences, ReferenceManager} from "system/Database/ReferenceManager";

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