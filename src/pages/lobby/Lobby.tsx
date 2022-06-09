import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import Sanitizer from "pages/components/ui/LoadingPage/Sanitizer";

export default function Lobby() {
    return (<Sanitizer>
        <div className={classes.container}>
            <LobbySettings/>
            <PlayersPanel/>
            <ChatComponent/>
        </div>
    </Sanitizer>);
}
