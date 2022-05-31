import { Player } from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import { randomInt } from "system/GameConstants";
import { DbReferences, ReferenceManager } from "system/Database/RoomDatabase";

export function getDefaultName(): string {
  return `ㅇㅇ (${randomInt(1, 255)}.${randomInt(1, 255)})`;
}
export function getDefaultPlayer() {
  const newPlayer: Player = {
    isSpectating: false,
    lastActive: firebase.database.ServerValue.TIMESTAMP,
    name: getDefaultName(),
    icard: -2,
    coins: 0,
  };
  return newPlayer;
}

export async function joinLocalPlayer(asHost: boolean): Promise<string> {
  const playersRef = ReferenceManager.getRef(DbReferences.PLAYERS);
  const player = getDefaultPlayer();
  const myRef = playersRef.push();
  myRef.set(player);
  const myId = await myRef.key;
  if (asHost) {
    ReferenceManager.updateReference(DbReferences.HEADER_hostId, myId);
  }
  return myId!;
}
