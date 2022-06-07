import {Fragment, useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {Navigation} from "App";

export default function Lobby() {
    const context = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const turns = context.room.game.state.turn;

    useEffect(() => {
        if (myId === null) {
            history.replace(Navigation.Loading);
        }
        if (turns >= 0) {
            history.replace(Navigation.InGame);
        }
    }, [turns, myId]);
    const panelElem = (
        <div className={classes.container}>
            {/* <p>{JSON.stringify(context.room)}</p> */}
            <LobbySettings/>
            <PlayersPanel/>
            <ChatComponent/>
        </div>
    );
    return (myId === null) ? <Fragment/> : panelElem;
}
