import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import RoomProvider from "system/context/roomInfo/RoomContextProvider";
import LocalProvider from "system/context/localInfo/LocalContextProvider";
import {ChatProvider} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";
import {MusicProvider} from "pages/components/ui/MusicModule/musicInfo/MusicContextProvider";
import 'lang/i18n';

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <BrowserRouter>
        <RoomProvider>
            <LocalProvider>
                <ChatProvider>
                    <MusicProvider>
                        <App/>
                    </MusicProvider>
                </ChatProvider>
            </LocalProvider>
        </RoomProvider>
    </BrowserRouter>
);
