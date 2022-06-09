import {PlayerMap} from "system/GameStates/GameTypes";

export var PING = 100;

/**
 * Enum for Waiting times.
 */
export enum WaitTime {
    MakingDecision = 15,
    WaitReactions = 5,
    WaitConfirms = 3,
}

/**
 *
 * @param min
 * @param max
 * @returns Random number betwen min[inclusive] and max [inclusive]
 */
export function randomInt(min: number, max: number): number {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomSeed() {
    return randomInt(0, 100);
}

/**
 *
 * @param array
 * @returns SHuffle given array
 */
export function shuffleArray(array: any) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
        // Pick a remaining element
        let randId = Math.floor(Math.random() * curId);
        curId -= 1;
        // Swap it with the current element.
        let tmp = array[curId];
        array[curId] = array[randId];
        array[randId] = tmp;
    }
    return array;
}

/**
 *
 * @param map
 * @param key
 * @returns Return NULL instead of UNDEFINED when key is not found in map
 */
export function getNullable<T>(map: Map<any, T>, key: any): T | null {
    if (map.has(key)) {
        return map.get(key)!;
    }
    return null;
}


export function isSafe(id: string, map: PlayerMap): boolean {
    if (id.length === 0) return true;
    return map.has(id);
}

export function isNull(obj: any): boolean {
    return obj === null || obj === undefined;
}