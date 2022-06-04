import React from "react";
import classes from "./ChatComponent.module.css";
import gc from "../../../global.module.css";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";

export default function ChatComponent() {
    const chatList: string[] = [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam harumvoluptatem consequuntur, repudiandae cum explicabo corporis ducimusdoloribus vitae illo reiciendis cumque autem eaque voluptas rationedicta dolor. Magnam, cum.",
    ];

    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <div className={classes.chatbox}>
                {chatList.map((chat) => (
                    <p key={Math.random().toString()}>{chat}</p>
                ))}
            </div>
            <HorizontalLayout className={classes.sendBox}>
                <input type="text" className={classes.inputField}></input>
                <button className={classes.buttonSend}>Send</button>
            </HorizontalLayout>
        </div>
    );
}
