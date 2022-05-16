import React, { useContext, useEffect } from "react";
import PlayersContext from "system/context/players-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import {
  loadAndListenLobby,
  LobbyReferences,
} from "system/Database/RoomDatabase";
import { Game, Room } from "system/GameStates/GameTypes";
import { PlayerListenerMap } from "system/types/CommonTypes";

export default function Lobby() {
  const context = useContext(PlayersContext);

  useEffect(() => {
    let snapshot: LobbyReferences | any;
    loadAndListenLobby().then((snap: LobbyReferences | null) => {
      snapshot = snap;
      console.log(snapshot);
    });
    //if (snapshot instanceof LobbyReferences) {
    if (snapshot != null) {
      context.onRoomLoaded(snapshot.room);
    }
    return () => {
      //Turn off listeners
    };
  }, []);
  return (
    <div className={classes.container}>
      <LobbySettings />
      <PlayersPanel />
      <ChatComponent />
    </div>
  );
}
