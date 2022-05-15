import React from "react";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./LobbySettings";

export default function Lobby() {
  return (
    <div className={classes.container}>
      <LobbySettings />
      <PlayersPanel />
      <ChatComponent />
    </div>
  );
}
