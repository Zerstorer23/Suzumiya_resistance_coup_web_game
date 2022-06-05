import React, {useContext, useEffect, useRef} from "react";
import classes from "./ChatModule.module.css";
import ChatContext, {ChatEntryToElem, ChatFormat} from "system/context/chatInfo/ChatContextProvider";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";

export default function ChatModule() {

    const chatCtx = useContext(ChatContext);
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };
    useEffect(() => {
        console.log("Scroll");
        messagesEndRef.current!.scrollIntoView({behavior: 'smooth'});
    }, [chatCtx.chatList.length]);

    /**
     * TODO
     * Format Chats.
     * Scroll to bottom
     * listen to enter or on blur
     * press enter to start chat,
     * if in chat, press enter to end chat
     *              useRef, send what is in to db
     */
    function onSendChat(e: any) {
        console.log("Blue");
        chatCtx.sendChat(ChatFormat.normal, myPlayer.name, Math.random().toString());
    }

    return (<div className={`${classes.container}`}>
        <div className={classes.chatbox}>
            {
                chatCtx.chatList.map((chat, index) => {
                    return ChatEntryToElem(index, chat);
                })
            }
            <div ref={messagesEndRef}/>
        </div>
        <HorizontalLayout className={classes.sendBox}>
            <input type="text" className={classes.inputField} onBlur={onSendChat}></input>
            <button className={classes.buttonSend}>Send</button>
        </HorizontalLayout>
    </div>);
}
