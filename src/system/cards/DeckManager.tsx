import { useContext } from "react";
import { Card, CardRole } from "system/cards/Card";
import {
  LocalContextType,
  LocalField,
} from "system/context/localInfo/local-context";
import RoomContext, { RoomContextType } from "system/context/room-context";
import { shuffleArray } from "system/GameConstants";
import { Player } from "system/GameStates/GameTypes";

/*
Manager file that helps decoding deck string into cards
*/
//TODO read card from player
export const DeckManager = {
  readCard(deck: string, playerIndex: number): CardRole[] {
    return [CardRole.None];
  },

  playerHasCard(card: CardRole, player: Player): boolean {
    //TODO return if player has the card
    return true;
  },
  /**
   *
   * @param val character form of card
   * @returns Card UI form
   */
  getCardFromChar(val: string) {
    let card: Card;
    switch (val) {
      case CardRole.Duke:
        card = new Card(CardRole.Duke, true);
        break;
      case CardRole.Captain:
        card = new Card(CardRole.Captain, true);
        break;
      case CardRole.Assassin:
        card = new Card(CardRole.Assassin, true);
        break;
      case CardRole.Contessa:
        card = new Card(CardRole.Contessa, true);
        break;
      case CardRole.Ambassador:
        card = new Card(CardRole.Ambassador, true);
        break;

      //TODO Add Dead cases
      default:
        card = new Card(CardRole.None, true);
        break;
    }

    return card;
  },

  changeDeck(ctx: RoomContextType, deckArr: string[]) {
    ctx.room.game.deck = deckArr + "";
  },

  generateStartingDeck(numPlayers: number): string {
    let numCards = 15;
    if (numPlayers > 6) numCards = (numPlayers - 6) * 5 + 15;
    let arr = [];
    for (let i = 0; i < numCards / 5; i++) {
      arr.push(CardRole.Duke);
      arr.push(CardRole.Captain);
      arr.push(CardRole.Assassin);
      arr.push(CardRole.Contessa);
      arr.push(CardRole.Ambassador);
    }
    arr = shuffleArray(arr);
    console.log(arr);

    return arr + "";
  },

  peekTopIndex(ctx: RoomContextType, localCtx: LocalContextType): number {
    let max = 0;
    const sortedList = localCtx.getVal(LocalField.SortedList);
    const playerMap = ctx.room.playerMap;
    for (let id in sortedList) {
      if (playerMap.get(id)!.icard >= max) {
        max = playerMap.get(id)!.icard;
      }
    }
    max += 2;
    return max;
  },
};
