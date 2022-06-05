import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import RoomProvider from "system/context/roomInfo/RoomContextProvider";
import LocalProvider from "system/context/localInfo/LocalContextProvider";
import {ChatProvider} from "system/context/chatInfo/ChatContextProvider";
// import { enableMapSet } from "immer";
//enableMapSet()
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <BrowserRouter>
        <RoomProvider>
            <LocalProvider>
                <ChatProvider>
                    <App/>
                </ChatProvider>
            </LocalProvider>
        </RoomProvider>
    </BrowserRouter>
);
