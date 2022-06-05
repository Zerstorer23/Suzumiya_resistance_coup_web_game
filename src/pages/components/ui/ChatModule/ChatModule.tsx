import React, {useContext, useEffect, useRef} from "react";
import classes from "./ChatModule.module.css";
import ChatContext, {ChatEntryToElem, ChatFormat,} from "system/context/chatInfo/ChatContextProvider";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";

export default function ChatModule() {
    const chatCtx = useContext(ChatContext);
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatFieldRef = useRef<HTMLInputElement>(null);
    const focusedTarget: InputCursor = localCtx.getVal(LocalField.InputFocus);

    useEffect(() => {
        messagesEndRef.current!.scrollIntoView({behavior: "smooth"});
    }, [chatCtx.chatList.length]);
    ///====Key listener====///
    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);
    //====Chaat===///
    /*       useEffect(() => {
               switch (focusedTarget) {
                   case InputCursor.Idle:
                       chatFieldRef.current!.focus();
                       break;
                   case InputCursor.Chat:
                       handleSend();
                       break;
                   case InputCursor.Name:
                       break;
               }
           }, [focusedTarget]);*/


    function onKeyDown(event: any) {
        // console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        if (event.keyCode !== 13) return;
        if (document.activeElement === chatFieldRef.current!) {
            handleSend();
        } else {
            console.log("Focus");
            chatFieldRef.current!.focus();
        }
    }

    function handleSend() {
        if (document.activeElement !== chatFieldRef.current) return;
        if (chatFieldRef.current!.value.length <= 0) {
            chatFieldRef.current!.blur();
            return;
        }
        chatCtx.sendChat(
            ChatFormat.normal,
            myPlayer.name,
            chatFieldRef.current!.value.toString()
        );
        chatFieldRef.current!.value = "";
    }

    function toggleFocus(toggle: boolean) {
        if (toggle && document.activeElement !== chatFieldRef.current) {
            localCtx.setVal(LocalField.InputFocus, InputCursor.Chat);
        } else if (!toggle && document.activeElement === chatFieldRef.current) {
            localCtx.setVal(LocalField.InputFocus, InputCursor.Idle);
        }
    }

    return (
        <div
            className={`${classes.container}`}
            onKeyDown={onKeyDown}
            onKeyDownCapture={onKeyDown}
        >
            <div className={classes.chatbox}>
                {chatCtx.chatList.map((chat, index) => {
                    return ChatEntryToElem(index, chat);
                })}
                <div ref={messagesEndRef}/>
            </div>
            <HorizontalLayout className={classes.sendBox}>
                <input
                    ref={chatFieldRef}
                    type="text"
                    className={classes.inputField}
                    onBlur={() => {
                        toggleFocus(false);
                    }}
                    onFocus={() => {
                        toggleFocus(true);
                    }}
                ></input>
                <button className={classes.buttonSend} onClick={handleSend}>
                    Send
                </button>
            </HorizontalLayout>
        </div>
    );
}
