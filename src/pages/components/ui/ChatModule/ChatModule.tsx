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
    const chatFieldRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        console.log("Scroll");
        messagesEndRef.current!.scrollIntoView({behavior: 'smooth'});
    }, [chatCtx.chatList.length]);
    ///====Key listener====///
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    function onKeyDown(event: any) {
        // console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        if (event.keyCode === 13) {//Enter
            if (document.activeElement === chatFieldRef.current) {
                handleSend();
            } else {
                chatFieldRef.current!.focus();
            }
        }
    }

    function handleSend() {
        if (chatFieldRef.current!.value.length <= 0) {
            chatFieldRef.current!.blur();
        } else {
            chatCtx.sendChat(ChatFormat.normal, myPlayer.name, chatFieldRef.current!.value.toString());
            chatFieldRef.current!.value = "";
        }
    }


    function onSendChat(e: any) {
        handleSend();
    }

    return (<div className={`${classes.container}`} onKeyDown={onKeyDown} onKeyDownCapture={onKeyDown}>
        <div className={classes.chatbox}>
            {
                chatCtx.chatList.map((chat, index) => {
                    return ChatEntryToElem(index, chat);
                })
            }
            <div ref={messagesEndRef}/>
        </div>
        <HorizontalLayout className={classes.sendBox}>
            <input ref={chatFieldRef} type="text" className={classes.inputField} onBlur={onSendChat}></input>
            <button className={classes.buttonSend}>Send</button>
        </HorizontalLayout>
    </div>);
}
