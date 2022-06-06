import {useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";

export default function Lobby() {
    const context = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();

    const myId = localCtx.getVal(LocalField.Id);
    const turns = context.room.game.state.turn;
    if (myId === null) {
        history.replace("/suzumiya/");
    }
    useEffect(() => {
        if (turns >= 0) {
            history.replace("/suzumiya/game");
        }
    }, [turns]);

    return (
        <div className={classes.container}>
            {/* <p>{JSON.stringify(context.room)}</p> */}
            <LobbySettings/>
            <PlayersPanel/>
            <ChatComponent/>
        </div>
    );
}
