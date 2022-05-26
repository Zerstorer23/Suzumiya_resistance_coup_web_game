export var PING = 100;
export var COUNTDOWN_MAX_MILLS = 5 * 1000;
export var REACTION_MAX_MILLS = 3 * 1000;

export function randomInt(min: number, max: number): number {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomSeed() {
  return randomInt(0, 100);
}
