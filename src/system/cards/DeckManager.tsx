import { Card, CardRole } from "system/cards/Card";
import { shuffleArray } from "system/GameConstants";

/*
Manager file that helps decoding deck string into cards
*/
//TODO read card from player
export const DeckManager = {
  readCard(deck: string, playerIndex: number): CardRole[] {
    return [CardRole.None];
  },

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
      default:
        card = new Card(CardRole.None, true);
        break;
    }

    return card;
  },

  //TODO generate deck
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
};
