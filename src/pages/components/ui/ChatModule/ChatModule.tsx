import React, {useContext, useEffect, useRef} from "react";
import classes from "./ChatModule.module.css";
import ChatContext, {ChatEntryToElem, ChatFormat,} from "system/context/chatInfo/ChatContextProvider";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {useTranslation} from "react-i18next";

export default function ChatModule() {
    const chatCtx = useContext(ChatContext);
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();

    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatFieldRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        console.log("Focus: " + localCtx.getVal(LocalField.InputFocus));
    }, []);
    useEffect(() => {
        messagesEndRef.current!.scrollIntoView({behavior: "smooth"});
    }, [chatCtx.chatList.length]);
    ///====Key listener====///
    useKeyListener([KeyCode.Enter], onKeyDown);

    function onKeyDown(keyCode: KeyCode) {
        if (keyCode === KeyCode.Undefined) return;
        if (document.activeElement === chatFieldRef.current!) {
            handleSend();
        } else {
            chatFieldRef.current!.focus();
        }
    }

    function handleSend() {
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
        chatFieldRef.current!.blur();
    }

    function toggleFocus(toggle: boolean) {
        localCtx.setVal(LocalField.InputFocus, (toggle) ? InputCursor.Chat : InputCursor.Idle);
    }

    return (
        <div className={`${classes.container}`}>
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
                    {t("_send")}
                </button>
            </HorizontalLayout>
        </div>
    );
}
