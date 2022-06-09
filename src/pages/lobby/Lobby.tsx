import {Fragment, useContext, useEffect, useState} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {Navigation} from "App";

export default function Lobby() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const turns = ctx.room.game.state.turn;

    const [valid, setValid] = useState(false);
    useEffect(() => {
        if (myId === null) {
            setValid(false);
            history.replace(Navigation.Loading);
            return;
        }
        if (!ctx.room.playerMap.has(myId)) {
            setValid(false);
            localCtx.setVal(LocalField.Id, null);
            history.replace(Navigation.Loading);
            return;
        }
        setValid(true);
        if (turns >= 0) {
            history.replace(Navigation.InGame);
            return;
        }
    }, [turns, myId]);

    return (<Fragment>
        {(valid) && <div className={classes.container}>
            <LobbySettings/>
            <PlayersPanel/>
            <ChatComponent/>
        </div>}
    </Fragment>);
}
