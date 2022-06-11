import {BASE_CARDS, CardDeck, CardRole, EXPANSION_CARDS} from "system/cards/Card";
import {randomInt, shuffleArray} from "system/GameConstants";
import {Player, Room} from "system/GameStates/GameTypes";
import {RoomContextType} from "system/context/roomInfo/RoomContextProvider";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";

/*
Manager file that helps decoding deck string into cards
*/

export class DeckManager {
    public static isDead(role: CardRole): boolean {
        switch (role) {
            case CardRole.DEAD_Duke:
            case CardRole.DEAD_Captain:
            case CardRole.DEAD_Assassin:
            case CardRole.DEAD_Contessa:
            case CardRole.DEAD_Ambassador:
            case CardRole.DEAD_Inquisitor:
            case CardRole.None:
            case undefined:
                return true;
            default:
                return false;
        }
    }

    public static playerIsDead(deck: CardDeck, player: Player): boolean {
        const cards = this.peekCards(deck, player.icard, 2);
        return this.isDead(cards[0]) && this.isDead(cards[1]);
    }

    public static playerHasCard(deck: CardDeck, card: CardRole, player: Player): boolean {
        const cards = this.peekCards(deck, player.icard, 2);
        return cards[0] === card || cards[1] === card;
    }

    public static getRoleFromChar(val: string): CardRole {
        switch (val) {
            case CardRole.None:
            case CardRole.Duke:
            case CardRole.Captain:
            case CardRole.Assassin:
            case CardRole.Ambassador:
            case CardRole.Contessa:
            case CardRole.Inquisitor:
            case CardRole.DEAD_Captain:
            case CardRole.DEAD_Duke:
            case CardRole.DEAD_Assassin:
            case CardRole.DEAD_Ambassador:
            case CardRole.DEAD_Contessa:
            case CardRole.DEAD_Inquisitor:
                return val as CardRole;
            default:
                return CardRole.None;
        }
    }

    public static killCardAt(deck: CardRole[], index: number) {
        const role = deck[index];
        deck[index] = role.toLowerCase() as CardRole;
        /* switch (role) {
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
             case CardRole.Inquisitor:
                 deck[index] = CardRole.DEAD;
                 break;
             default:
                 break;
         }*/
    }

    public static pushDeck(ctx: RoomContextType, deckArr: CardRole[]) {
        ReferenceManager.updateReference(DbFields.GAME_deck, deckArr);
    }

    public static swap(index1: number, index2: number, deckArr: CardDeck) {
        let temp = deckArr[index1];
        deckArr[index1] = deckArr[index2];
        deckArr[index2] = temp;
    }

    public static findIndexOfCardIn(deck: CardDeck, player: Player, card: CardRole): number {
        if (deck[player.icard] === card) return player.icard;
        if (deck[player.icard + 1] === card) return player.icard + 1;
        return -1;
    }

    public static generateStartingDeck(room: Room): CardRole[] {
        const numPlayer = room.playerMap.size;
        const expansionPack = room.header.settings.expansion;
        let arr: CardRole[] = [];
        const baseDeck = (expansionPack) ? EXPANSION_CARDS : BASE_CARDS;
        while (
            (numPlayer > 6 && (arr.length - numPlayer * 2) < 2)//If > 6, scale with min remainder 2
            || arr.length < 15) {//Min 15
            for (const card of baseDeck) {
                arr.push(card);
            }
        }
        arr = shuffleArray(arr);
        return arr;
    }

    public static peekTopIndex(ctx: RoomContextType): number {
        let max = 0;
        const playerMap = ctx.room.playerMap;
        playerMap.forEach((player) => {
            max = Math.max(player.icard);
        });
        max += 2;
        return max;
    }

    public static getRandomFromDeck(ctx: RoomContextType): number {
        const top = this.peekTopIndex(ctx);
        return randomInt(top, ctx.room.game.deck.length - 1);
    }

    //Returns offset + 0 ~ 1 range
    public static getRandomFromPlayer(player: Player, deck: CardDeck, bias: CardRole = CardRole.None): number | null {
        const offset = player.icard;
        if (bias !== CardRole.None) {
            //There is bias. search this bias and return
            if (deck[offset] === bias) return offset;
            if (deck[offset + 1] === bias) return offset + 1;
        }
        //Bias not found.
        const dead: boolean[] = [DeckManager.isDead(deck[offset]), DeckManager.isDead(deck[offset + 1])];
        if (!dead[0] && !dead[1]) {
            //Both Alive. get random
            return randomInt(offset, offset + 1);
        }
        //One of them is dead
        if (!dead[0]) return offset;
        if (!dead[1]) return offset + 1;
        //Can never happen
        return null;
    }

    public static peekCards(
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
    }

    public static countCards(deck: CardDeck, role: CardRole): number {
        let counts = 0;
        deck.forEach((value) => {
            if (value === role) counts++;
        });
        return counts;
    }

    public static playerAliveCardNum(deck: CardRole[], index: number) {
        let num = 2;
        const myCards = this.peekCards(deck, index, 2);
        myCards.forEach((card) => {
            if (this.isDead(card)) {
                num--;
            }
        });
        return num;
    }

    public static checkGameOver(ctx: RoomContextType): string {
        const playerMap = ctx.room.playerMap;
        const deck = ctx.room.game.deck;
        let alive: string = "";
        let numAlive = 0;
        playerMap.forEach((player, id) => {
            if (player.icard < 0) return;
            if (!this.isDead(deck[player.icard]) || !this.isDead(deck[player.icard + 1])) {
                alive = id;
                numAlive++;
            }
        });
        if (numAlive === 1) return alive;
        return "";
    }

    public static countAlivePlayers(ctx: RoomContextType): number {
        const playerMap = ctx.room.playerMap;
        const deck = ctx.room.game.deck;
        let numAlive = 0;
        playerMap.forEach((player) => {
            if (!this.isDead(deck[player.icard]) || !this.isDead(deck[player.icard + 1])) {
                numAlive++;
            }
        });
        return numAlive;
    }
}
