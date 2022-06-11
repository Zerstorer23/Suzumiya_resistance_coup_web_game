import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import Sanitizer from "pages/components/ui/LoadingPage/Sanitizer";
import gc from "global.module.css";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";

export default function Lobby() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);

    return (<Sanitizer>
        <div className={`${classes.container} ${gc.panelBackground}`}>
            <LobbySettings/>
            <PlayersPanel/>
            <ChatComponent/>
        </div>
    </Sanitizer>);
}
