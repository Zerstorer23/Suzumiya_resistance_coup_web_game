import { useContext } from "react";
import PlayersContext from "system/context/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import LocalContext from "system/context/localInfo/local-context";
import { useHistory } from "react-router-dom";

export default function Lobby() {
  const context = useContext(PlayersContext);
  const localCtx = useContext(LocalContext);
  const history = useHistory();
  if (localCtx.myId === null) {
    history.replace("/");
  }

  return (
    <div className={classes.container}>
      {/* <p>{JSON.stringify(context.room)}</p> */}
      <LobbySettings />
      <PlayersPanel playerMap={context.room.playerMap} />
      <ChatComponent />
    </div>
  );
}
