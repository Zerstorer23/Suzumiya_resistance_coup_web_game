import { db } from "system/Database/Firebase";
import { Player } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import { DB_HEADER_hostId, DB_PLAYERS } from "system/Database/RoomDatabase";

export function getDefaultPlayer() {
  const newPlayer: Player = {
    isSpectating: false,
    isConnected: true,
    lastActive: firebase.database.ServerValue.TIMESTAMP,
    name: "ㅇㅇ",
    cards: 0,
    coins: 0,
  };
  return newPlayer;
}

export async function joinLocalPlayer(asHost: boolean): Promise<string> {
  const playersRef = db.ref(DB_PLAYERS);
  const player = getDefaultPlayer();
  const myRef = playersRef.push();
  myRef.set(player);
  const myId = await myRef.key;
  if (asHost) {
    db.ref(DB_HEADER_hostId).set(myId); //.setValue().update();
  }
  return myId!;
}
