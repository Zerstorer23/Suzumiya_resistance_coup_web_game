import React, {useCallback, useContext, useEffect, useRef} from "react";
import classes from "./ChatModule.module.css";
import ChatContext, {
    ChatContextType,
    ChatEntryToElem,
    ChatFormat,
    sendChat,
} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {useTranslation} from "react-i18next";
import MusicContext, {
    MusicContextType,
    MusicResponse,
    pushMusicToQueue
} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import {Player} from "system/GameStates/GameTypes";
import {MAX_MUSIC_QUEUE, MAX_PERSONAL_QUEUE} from "pages/components/ui/MusicModule/MusicModule";

export default function ChatModule() {
    const chatCtx = useContext(ChatContext);
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const musicCtx = useContext(MusicContext);
    const {t} = useTranslation();

    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatFieldRef = useRef<HTMLTextAreaElement>(null);

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

    const handleSpecials = useCallback((text: string) => {
        if (text.length < 2) return false;
        const firstChar = text.at(0);
        const theRest = text.substring(1);
        if (firstChar === "!") {
            handleMusic(chatCtx, musicCtx, theRest, myId, myPlayer);
        } else if (firstChar === "/") {

        } else {
            return false;
        }
        return true;
    }, [myId, chatCtx, musicCtx]);

    const handleSend = useCallback(() => {
        let text = chatFieldRef.current!.value.toString();
        chatFieldRef.current!.blur();
        chatFieldRef.current!.value = "";
        if (text.length <= 0) return;
        if (handleSpecials(text)) return;
        if (text.length > 128) {
            text = text.substring(0, 128);
        }
        sendChat(ChatFormat.normal, myPlayer.name, text);
    }, [handleSpecials, myPlayer]);


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
                <textarea
                    ref={chatFieldRef}
                    className={classes.inputField}
                    onBlur={() => {
                        toggleFocus(false);
                    }}
                    onFocus={() => {
                        toggleFocus(true);
                    }}
                ></textarea>
                <button className={classes.buttonSend} onClick={handleSend}>
                    {t("_send")}
                </button>
            </HorizontalLayout>
        </div>
    );
}

function handleMusic(chatCtx: ChatContextType, musicCtx: MusicContextType, videoId: string, myId: string, myPlayer: Player) {
    const response = pushMusicToQueue(musicCtx, videoId, myId);
    switch (response) {
        case MusicResponse.Success:
            sendChat(ChatFormat.announcement, "", `${myPlayer.name}님이 1곡을 넣었습니다.`);
            break;
        case MusicResponse.InvalidURL:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: "URL의 태도가 불량합니다"
            });
            break;
        case MusicResponse.FullQueue:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: `신청곡 큐가 다 찼습니다. (${MAX_MUSIC_QUEUE}개)`
            });
            break;
        case MusicResponse.Overloading:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: `너무 많은곡을 신청하셨습니다. (${MAX_PERSONAL_QUEUE})개`
            });
            break;

    }
}