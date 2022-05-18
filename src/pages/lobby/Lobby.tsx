import { useContext } from "react";
import RoomContext from "system/context/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import LocalContext from "system/context/localInfo/local-context";
import { useHistory } from "react-router-dom";

export default function Lobby() {
  const context = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const history = useHistory();
  if (localCtx.myId === null) {
    history.replace("/");
  }
  console.log("Lobbby loaded" + localCtx.myId);

  return (
    <div className={classes.container}>
      {/* <p>{JSON.stringify(context.room)}</p> */}
      <LobbySettings />
      <PlayersPanel playerMap={context.room.playerMap} />
      <ChatComponent />
    </div>
  );
}
