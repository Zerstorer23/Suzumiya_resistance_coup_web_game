import {useContext} from "react";
import {Card, CardRole} from "system/cards/Card";
import {
    LocalContextType,
    LocalField,
} from "system/context/localInfo/local-context";
import RoomContext, {RoomContextType} from "system/context/room-context";
import {shuffleArray} from "system/GameConstants";
import {Player} from "system/GameStates/GameTypes";

/*
Manager file that helps decoding deck string into cards
*/
//TODO read card from player
export const DeckManager = {
    readCard(deck: string, playerIndex: number): CardRole[] {
        return [CardRole.None];
    },
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
    }
    ,
    /**
     *
     * @param val character form of card
     * @returns Card UI form
     */
    getCardFromChar(val: string) {
        const role = this.getRoleFromChar(val);
        return new Card(role);
    },

    changeDeck(ctx: RoomContextType, deckArr: string[]) {
        ctx.room.game.deck = deckArr + "";
    },

    swap(index1: number, index2: number, deckArr: string[]) {
        let temp = deckArr[index1];
        deckArr[index1] = deckArr[index2];
        deckArr[index2] = temp;
    },

    generateStartingDeck(numPlayers: number): string {
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
        return arr + "";
    },

    generateStartingDeck2(numPlayers: number): string {
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
        let deckString = "";////
        arr.forEach((role) => {
            deckString = deckString.concat(role);
        });
        return deckString;
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
    peekCards(deck: string, startIndex: number, maxNumber: number): CardRole[] {
        const maxIndex = Math.min(deck.length, startIndex + maxNumber);
        const roles: CardRole[] = [];
        for (let i = startIndex; i < maxIndex; i++) {
            const character = deck.at(i);
            if (character === undefined) continue;
            roles.push(this.getRoleFromChar(character));
        }
        return roles;
    }
};
