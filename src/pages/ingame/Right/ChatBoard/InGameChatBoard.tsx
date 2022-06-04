import gc from "global.module.css";
import classes from "./InGameChatBoard.module.css";
import chatClasses from "pages/lobby/chat/ChatComponent.module.css";
import React from "react";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";

export default function InGameChatBoard(): JSX.Element {
    const chatList: string[] = [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
    ];

    return (
        <div className={`${gc.round_border} ${classes.container}`}>

            <div className={chatClasses.chatbox}>
                {chatList.map((chat) => (
                    <p key={Math.random().toString()}>{chat}</p>
                ))}
            </div>
            <HorizontalLayout className={chatClasses.sendBox}>
                <input type="text" className={chatClasses.inputField}></input>
                <button className={chatClasses.buttonSend}>Send</button>
            </HorizontalLayout>
        </div>
    );
}
