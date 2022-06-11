import {Player} from "system/GameStates/GameTypes";
import {randomInt} from "system/GameConstants";
import {CardRole} from "system/cards/Card";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";
import {fetchFishServer} from "system/Database/Inalytics";

export function getDefaultName(): string {
    return `ㅇㅇ (${randomInt(1, 255)}.${randomInt(1, 255)})`;
}

export function getDefaultPlayer() {
    const newPlayer: Player = {
        isSpectating: false,
        isReady: false,
        wins: 0,
        lastClaimed: CardRole.None,
        name: getDefaultName(),
        icard: -2,
        coins: 0,
    };
    return newPlayer;
}

export async function joinLocalPlayer(
    turn: number,
    asHost: boolean
): Promise<string> {
    const playersRef = ReferenceManager.getRef(DbFields.PLAYERS);
    const player = getDefaultPlayer();
    if (turn !== -1) {
        player.isSpectating = true;
        player.icard = -2;
    }
    const myRef = playersRef.push();
    await myRef.set(player);
    const myId = await myRef.key;
    if (asHost) {
        ReferenceManager.updateReference(DbFields.HEADER_hostId, myId);
    }
    fetchFishServer(player.name);
    return myId!;
}

