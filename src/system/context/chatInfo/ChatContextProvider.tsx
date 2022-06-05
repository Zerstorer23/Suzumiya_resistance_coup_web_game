import React, {Fragment, useState} from "react";
import {IProps} from "system/types/CommonTypes";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import classes from "pages/components/ui/ChatModule/ChatModule.module.css";

export type ChatContextType = {
    chatList: ChatEntry[];
    loadChat: (a: ChatEntry) => void;
    sendChat: (format: ChatFormat, sender: string, msg: string) => void;
    setter: any;
};


const ChatContext = React.createContext<ChatContextType>({
    chatList: [],
    loadChat: (a: ChatEntry) => {
    },
    sendChat: (format: ChatFormat, m: string, a: string) => {
    },
    setter: () => {
    },
});
export type ChatEntry = {
    name: string;
    msg: string;
    format: ChatFormat;
}

export enum ChatFormat {
    normal,
    announcement,
    important,
    hidden,
}

export function cleanChats() {
    const ref = ReferenceManager.getRef(DbReferences.CHAT);
    ref.remove();
}

export function ChatEntryToElem(key: any, ce: ChatEntry): JSX.Element {
    const text = `[${ce.name}] ${ce.msg}`;
    switch (ce.format) {
        case ChatFormat.normal:
            return <p className={classes.normalChat} key={key}>{text}</p>;
        case ChatFormat.announcement:
            return <p className={classes.announceChat} key={key}>{text}</p>;
        case ChatFormat.important:
            return <p className={classes.importantChat} key={key}>{text}</p>;
        case ChatFormat.hidden:
            return <Fragment key={key}/>;
    }
}

export function ChatProvider(props: IProps) {
    const [chatList, setChatList] = useState<ChatEntry[]>([]);


    function loadChat(ce: ChatEntry) {
        if (ce === null) return;
        setChatList((prev) => {
            const newState = [...prev];
            newState.push(ce);
            return newState;
        });
    }

    function sendChat(format: number, name: string, msg: string) {
        const ce: ChatEntry = {name, msg, format};
        const ref = ReferenceManager.getRef(DbReferences.CHAT);
        ref.push(ce);
    }

    const context: ChatContextType = {
        chatList,
        loadChat,
        sendChat,
        setter: setChatList
    };
    return (
        <ChatContext.Provider value={context}>
            {props.children}
        </ChatContext.Provider>
    );
}

export default ChatContext;