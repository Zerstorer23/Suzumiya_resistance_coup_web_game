import React, {useCallback, useContext, useEffect, useRef} from "react";
import classes from "./ChatModule.module.css";
import ChatContext, {
    ChatContextType,
    ChatEntryToElem,
    ChatFormat,
    sendChat,
} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {useTranslation} from "react-i18next";
import MusicContext, {
    MusicContextType,
    MusicResponse,
    pushMusicToQueue,
} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import {PlayerEntry} from "system/GameStates/GameTypes";
import {MAX_MUSIC_QUEUE, MAX_PERSONAL_QUEUE,} from "pages/components/ui/MusicModule/MusicModule";
import {CommandParser} from "pages/components/ui/ChatModule/CommandParser";
import sendToPort from "sendSocket/sendSocket";

const LF = String.fromCharCode(10);
const CR = String.fromCharCode(13);
export default function ChatModule() {
    const chatCtx = useContext(ChatContext);
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const musicCtx = useContext(MusicContext);
    const {t} = useTranslation();

    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
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

    /*    const focused = document.activeElement === chatFieldRef.current!;
        useEffect(() => {
            console.log("focused ? " + focused);
            localCtx.setVal(LocalField.InputFocus, focused ? InputCursor.Chat : InputCursor.Idle);
        }, [focused]);*/
    /*  useEffect(() => {
          const active = document.activeElement === chatFieldRef.current!;
          // console.log("active ? " + active);
          localCtx.setVal(LocalField.InputFocus, active ? InputCursor.Chat : InputCursor.Idle);
      }, [document.activeElement]);*/


    const handleSpecials = useCallback(
        (text: string) => {
            if (text.length < 2) return false;
            const firstChar = text.at(0);
            const theRest = text.substring(1);
            if (firstChar === "!") {
                handleMusic(t, chatCtx, musicCtx, theRest, myEntry);
            } else if (firstChar === "/") {
                CommandParser.handleCommands(t, ctx, localCtx, chatCtx, musicCtx, theRest);
            } else {
                return false;
            }
            return true;
        },
        [myEntry.id, chatCtx, musicCtx]
    );

    const handleSend = useCallback(() => {
        let text = chatFieldRef.current!.value.toString();
        chatFieldRef.current!.value = "";
        text = text.replaceAll(LF, ""); //LF
        text = text.replaceAll(CR, ""); //LF
        if (text.length <= 0) {
            chatFieldRef.current!.blur();
            return;
        }
        if (handleSpecials(text)) return;
        if (text.length > 128) {
            text = text.substring(0, 128);
        }
        sendToPort(text);
        sendChat(ChatFormat.normal, myEntry.player.name, text);
    }, [handleSpecials, myEntry.player]);

    function toggleFocus(toggle: boolean) {
        localCtx.setVal(LocalField.InputFocus,
            toggle ? InputCursor.Chat : InputCursor.Idle);
        // console.log("Toggle " + toggle);
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
            placeholder={t("_chat_hint")}
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

function handleMusic(
    t: any,
    chatCtx: ChatContextType,
    musicCtx: MusicContextType,
    videoId: string,
    myEntry: PlayerEntry,
) {
    const response = pushMusicToQueue(musicCtx, videoId, myEntry.id);
    switch (response) {
        case MusicResponse.Success:
            sendChat(
                ChatFormat.announcement,
                "",
                `${myEntry.player.name}${t("_music_success_enqueue")}`
            );
            break;
        case MusicResponse.InvalidURL:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: t("_music_invalid_url"),
            });
            break;
        case MusicResponse.FullQueue:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: `${t("_music_queue_full")} (${MAX_MUSIC_QUEUE}max)`,
            });
            break;
        case MusicResponse.Overloading:
            chatCtx.loadChat({
                name: "",
                format: ChatFormat.announcement,
                msg: `${t("_music_personal_full")} (${MAX_PERSONAL_QUEUE}max)`,
            });
            break;
    }
}

