import {Card, CardRole} from "system/cards/Card";
import {RoomContextType} from "system/context/roomInfo/room-context";
import {shuffleArray} from "system/GameConstants";
import {Player} from "system/GameStates/GameTypes";
import {DbReferences, ReferenceManager} from "system/Database/RoomDatabase";


/*
Manager file that helps decoding deck string into cards
*/
//TODO read card from player
export const DeckManager = {
    isDead(role: CardRole): boolean {
        switch (role) {
            case CardRole.DEAD_Duke:
            case CardRole.DEAD_Captain:
            case CardRole.DEAD_Assassin:
            case CardRole.DEAD_Contessa:
            case CardRole.DEAD_Ambassador:
            case CardRole.None:
                return true;
            default:
                return false;
        }
    },
    playerIsDead(deck: CardRole[], id: string): boolean {
        return false;
    },
    playerHasCard(card: CardRole, player: Player): boolean {
        //TODO return if player has the card
        return true;
    },
    getRoleFromChar(val: string): CardRole {
        // return val as CardRole;
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
        const role = this.getRoleFromChar(val);
        return new Card(role);
    },

    pushDeck(ctx: RoomContextType, deckArr: CardRole[]) {
        ReferenceManager.updateReference(DbReferences.GAME_deck, deckArr);
    },

    swap(index1: number, index2: number, deckArr: string[]) {
        let temp = deckArr[index1];
        deckArr[index1] = deckArr[index2];
        deckArr[index2] = temp;
    },

    generateStartingDeck(numPlayers: number): CardRole[] {
        let numCards = 15;
        if (numPlayers > 6) numCards = (numPlayers - 6) * 5 + 15;
        let arr: CardRole[] = [];////
        for (let i = 0; i < numCards / 5; i++) {
            arr.push(CardRole.Duke);
            arr.push(CardRole.Captain);
            arr.push(CardRole.Assassin);
            arr.push(CardRole.Contessa);
            arr.push(CardRole.Ambassador);
        }
        arr = shuffleArray(arr);
        console.log(arr);
        return arr;
    },

    peekTopIndex(ctx: RoomContextType): number {
        let max = 0;
        const playerMap = ctx.room.playerMap;
        playerMap.forEach((player, key, map) => {
            max = Math.max(player.icard);
        });
        max += 2;
        return max;
    },
    peekCards(deck: CardRole[], startIndex: number, maxNumber: number): CardRole[] {
        const maxIndex = Math.min(deck.length, startIndex + maxNumber);
        const roles: CardRole[] = [];
        for (let i = startIndex; i < maxIndex; i++) {
            roles.push(deck[i]);
        }
        console.log("My cards");
        console.log(roles);
        return roles;
    }
};
