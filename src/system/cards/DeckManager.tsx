import {CardDeck, CardRole} from "system/cards/Card";
import {randomInt, shuffleArray} from "system/GameConstants";
import {Player} from "system/GameStates/GameTypes";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";
import {CardPool} from "system/cards/CardPool";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {getSortedListFromMap} from "system/GameStates/RoomGenerator";

/*
Manager file that helps decoding deck string into cards
*/
export const DeckManager = {
    isDead(role: CardRole): boolean {
        switch (role) {
            case CardRole.DEAD_Duke:
            case CardRole.DEAD_Captain:
            case CardRole.DEAD_Assassin:
            case CardRole.DEAD_Contessa:
            case CardRole.DEAD_Ambassador:
            case CardRole.None:
            case undefined:
                return true;
            default:
                return false;
        }
    },
    playerIsDead(deck: CardDeck, player: Player): boolean {
        const cards = this.peekCards(deck, player.icard, 2);
        return this.isDead(cards[0]) && this.isDead(cards[1]);
    },
    playerHasCard(deck: CardDeck, card: CardRole, player: Player): boolean {
        const cards = this.peekCards(deck, player.icard, 2);
        return cards[0] === card || cards[1] === card;
    },
    getRoleFromChar(val: string): CardRole {
        switch (val) {
            case CardRole.None:
            case CardRole.Duke:
            case CardRole.Captain:
            case CardRole.Assassin:
            case CardRole.Ambassador:
            case CardRole.Contessa:
            case CardRole.DEAD_Captain:
            case CardRole.DEAD_Duke:
            case CardRole.DEAD_Assassin:
            case CardRole.DEAD_Ambassador:
            case CardRole.DEAD_Contessa:
                return val as CardRole;
            default:
                return CardRole.None;
        }
    },
    killCardAt(deck: CardRole[], index: number) {
        const role = deck[index];
        switch (role) {
            case CardRole.Duke:
                deck[index] = CardRole.DEAD_Duke;
                break;
            case CardRole.Captain:
                deck[index] = CardRole.DEAD_Captain;
                break;
            case CardRole.Assassin:
                deck[index] = CardRole.DEAD_Assassin;
                break;
            case CardRole.Ambassador:
                deck[index] = CardRole.DEAD_Ambassador;
                break;
            case CardRole.Contessa:
                deck[index] = CardRole.DEAD_Contessa;
                break;
            default:
                break;
        }
    },
    /**
     *
     * @param val character form of card
     * @returns Card UI form
     */
    getCardFromChar(val: string) {
        return CardPool.getCard(this.getRoleFromChar(val));
    },

    pushDeck(ctx: RoomContextType, deckArr: CardRole[]) {
        ReferenceManager.updateReference(DbReferences.GAME_deck, deckArr);
    },

    swap(index1: number, index2: number, deckArr: CardDeck) {
        let temp = deckArr[index1];
        deckArr[index1] = deckArr[index2];
        deckArr[index2] = temp;
    },
    findIndexOfCardIn(deck: CardDeck, player: Player, card: CardRole): number {
        if (deck[player.icard] === card) return player.icard;
        if (deck[player.icard + 1] === card) return player.icard + 1;
        return -1;
    },

    generateStartingDeck(numPlayers: number): CardRole[] {
        let numCards = 15;
        while (numCards - 2 * numPlayers < 2) {
            numCards += 5;
        }
        let arr: CardRole[] = [];
        for (let i = 0; i < numCards / 5; i++) {
            arr.push(CardRole.Duke);
            arr.push(CardRole.Captain);
            arr.push(CardRole.Assassin);
            arr.push(CardRole.Contessa);
            arr.push(CardRole.Ambassador);
        }
        arr = shuffleArray(arr);
        return arr;
    },

    peekTopIndex(ctx: RoomContextType): number {
        let max = 0;
        const playerMap = ctx.room.playerMap;
        playerMap.forEach((player) => {
            max = Math.max(player.icard);
        });
        max += 2;
        return max;
    },
    getRandomFromDeck(ctx: RoomContextType) {
        const top = this.peekTopIndex(ctx);
        return randomInt(top, ctx.room.game.deck.length - 1);
    },
    peekCards(
        deck: CardRole[],
        startIndex: number,
        maxNumber: number
    ): CardRole[] {
        const maxIndex = Math.min(deck.length, startIndex + maxNumber);
        const roles: CardRole[] = [];
        for (let i = startIndex; i < maxIndex; i++) {
            roles.push(deck[i]);
        }
        return roles;
    },
    countCards(deck: CardDeck, role: CardRole): number {
        let counts = 0;
        deck.forEach((value) => {
            if (value === role) counts++;
        });
        return counts;
    },
    playerAliveCardNum(deck: CardRole[], index: number) {
        let num = 2;
        const myCards = this.peekCards(deck, index, 2);
        myCards.forEach((card) => {
            if (this.isDead(card)) {
                num--;
            }
        });
        return num;
    },

    checkGameOver(ctx: RoomContextType): string {
        const playerMap = ctx.room.playerMap;
        const deck = ctx.room.game.deck;
        const sortedList: string[] = getSortedListFromMap(playerMap);
        let player: Player;
        let playerCards: CardRole[];
        let alive: string = "";
        let numAlive = 0;

        for (let playerID of sortedList) {
            player = playerMap.get(playerID)!;
            playerCards = this.peekCards(deck, player.icard, 2);
            if (!this.isDead(playerCards[0]) || !this.isDead(playerCards[1])) {
                alive = playerID;
                numAlive++;
            }
        }
        if (numAlive === 1) return alive;
        return "";
    },
};
