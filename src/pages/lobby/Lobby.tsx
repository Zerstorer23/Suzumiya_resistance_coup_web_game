import { useContext, useEffect } from "react";
import PlayersContext from "system/context/room-context";
import PlayersPanel from "./Center/PlayersPanel";
import ChatComponent from "./chat/ChatComponent";
import classes from "./Lobby.module.css";
import LobbySettings from "./Left/LobbySettings";
import { loadAndListenLobby } from "system/Database/RoomDatabase";
import { RoomStateType } from "system/context/RoomContextProvider";

export default function Lobby() {
  const context = useContext(PlayersContext);

  useEffect(() => {
    loadAndListenLobby().then((snap: RoomStateType | null) => {
      if (snap == null) return;
      const snapshot: RoomStateType = snap;
      console.log(snapshot);
      context.onRoomLoaded(snapshot);

      for (const playerId in context.playerListeners) {
        context.playerListeners.get(playerId)?.on("value", (snapshot) => {
          console.log(snapshot);
          //https://firebase.google.com/docs/reference/node/firebase.database.Reference#on
          //Do something
          const value = snapshot.val();
          if (value != null) {
            //Update
            context.onUpdatePlayer(value);
          }
          //If is mine, link onDisconnect Listener
        });
      }
      //Add PLayer child delete , added listener.
      //Add Host listener
      //Add game listener

      //Turn on listeners.
    });
    //if (snapshot instanceof LobbyReferences) {

    return () => {
      for (const playerId in context.playerListeners) {
        //  const listnerKey: ListenerTypes = key;
        context.playerListeners.get(playerId)?.off();
      }
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
