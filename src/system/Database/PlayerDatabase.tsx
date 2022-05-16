import { db } from "system/Database/Firebase";
import { Player } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";

export const DB_PLAYER = "players";

export function getDefaultPlayer() {
  const newPlayer: Player = {
    isSpectating: false,
    isConnected: true,
    lastActive: firebase.database.ServerValue.TIMESTAMP,
    id: "?",
    name: "ㅇㅇ",
    cards: 0,
    coins: 0,
  };
  return newPlayer;
}

export async function InsertNewPlayer() {}
export async function joinLocalPlayer() {
  const playersRef = db.ref(DB_PLAYER);
  const player = getDefaultPlayer();
  const myRef = playersRef.push();
  myRef.set(player);
  const myId = await myRef.key;
  db.ref("/").child("hostId").set(myId); //.setValue().update();
}

export function RemovePlayer() {}

export function UpdatePlayer() {}

export async function LoadPlayers(onLoaded: (players: Player[]) => void) {
  const playersRef = db.ref(DB_PLAYER);
  const snapshot = await playersRef.get();

  if (!snapshot.exists()) {
    console.log("no data");
    onLoaded([]);
  } else {
    const data = snapshot.val();
    onLoaded(data);
  }
}
