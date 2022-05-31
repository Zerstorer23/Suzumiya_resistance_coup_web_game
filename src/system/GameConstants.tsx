export var PING = 100;

export enum WaitTime {
  MakingDecision = 10,
  WaitReactions = 4,
  WaitConfirms = 3,
}
export function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomSeed() {
  return randomInt(0, 100);
}

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

export function getNullable<T>(map: Map<any, T>, key: any): T | null {
  if (map.has(key)) {
    return map.get(key)!;
  }
  return null;
}
