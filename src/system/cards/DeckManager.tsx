import { CardRole } from "system/cards/Card";
/*
Manager file that helps decoding deck string into cards
*/
//TODO read card from player
export const DeckManager = {
  readCard(deck: string, playerIndex: number): CardRole[] {
    return [CardRole.None];
  },
};
