import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import { db } from "system/Database/Firebase";
import {
  joinLobby,
  initialiseRoom,
  DB_PLAYERS,
} from "system/Database/RoomDatabase";
import { PAGE_LOBBY } from "system/GameStates/States";

export default function LoadingHome() {
  const history = useHistory();
  const localCtx = useContext(LocalContext);
  const ctx = useContext(RoomContext);
  console.log("Render Loading");
  console.log(ctx.room);
  useEffect(() => {
    function onDisconnectCleanUp(id: string) {
      localCtx.setMyId(id);
      const rootRef = db.ref(`${DB_PLAYERS}/${id}`);
      rootRef.onDisconnect().remove();
    }
    async function setUpRoom() {
      const myId = await initialiseRoom();
      onDisconnectCleanUp(myId);
      history.replace(PAGE_LOBBY);
    }
    async function playerJoin() {
      const myId = await joinLobby();
      onDisconnectCleanUp(myId);
      history.replace(PAGE_LOBBY);
    }
    if (localCtx.myId !== null) return;
    if (ctx.room.playerMap.size === 0) {
      //Join as host
      console.log("Join as host");
      setUpRoom();
    } else {
      //Join as client
      console.log("Join as client");
      playerJoin();
    }
  }, []);

  return <h1>Connecting...</h1>;
}
