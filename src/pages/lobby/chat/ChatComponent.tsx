import React from "react";
import classes from "./ChatComponent.module.css";
import gc from "global.module.css";
import ChatModule from "pages/components/ui/ChatModule/ChatModule";

export default function ChatComponent() {
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <ChatModule/>
        </div>
    );
}
