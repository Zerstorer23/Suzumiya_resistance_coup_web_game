import { db } from "system/Database/Firebase";
import { Player } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import { DB_HEADER_hostId, DB_PLAYERS } from "system/Database/RoomDatabase";
import { randomInt } from "system/GameConstants";
import { DbRef } from "system/types/CommonTypes";

export function getMyRef(myId: string): DbRef {
  return db.ref(`${DB_PLAYERS}/${myId}`);
}

export function getDefaultPlayer() {
  const newPlayer: Player = {
    isSpectating: false,
    isConnected: true,
    lastActive: firebase.database.ServerValue.TIMESTAMP,
    name: `ㅇㅇ (${randomInt(1, 255)}.${randomInt(1, 255)})`,
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
