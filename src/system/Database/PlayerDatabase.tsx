import {Player} from "system/GameStates/GameTypes";
import firebase from "firebase/compat/app";
import {randomInt} from "system/GameConstants";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {TurnManager} from "system/GameStates/TurnManager";
import {RoomContextType} from "system/context/roomInfo/room-context";

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

export function pushPlayerUpdate(ctx: RoomContextType, playerId: string, changer: (id: string, player: Player) => boolean) {
    const [id, player] = TurnManager.getPlayerInfoById(ctx, playerId);
    const result = changer(id, player);
    if (!result) return;
    ReferenceManager.updatePlayerReference(id, player);

}
