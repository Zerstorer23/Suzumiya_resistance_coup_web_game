import get, {Images} from "resources/Resources";
import {DeckManager} from "system/cards/DeckManager";

/*
Card role corresponding to database
make sure each enum is 1 char long
CAPITAL = alive
small = dead card
*/
export enum CardRole {
    None = "N",
    Duke = "D",
    Captain = "C",
    Assassin = "A",
    Contessa = "T",
    Ambassador = "S",
    DEAD_Duke = "d",
    DEAD_Captain = "c",
    DEAD_Assassin = "a",
    DEAD_Contessa = "t",
    DEAD_Ambassador = "s",
}

/*
This class is intended to be used as UI purposed
does not go into database
*/
export class Card {
    cardRole: CardRole;

    constructor(role: CardRole) {
        this.cardRole = role;
    }

    isDead(): boolean {
        return DeckManager.isDead(this.cardRole);
    }

    getImage() {
        switch (this.cardRole) {
            case CardRole.Duke:
                return get(Images.Koihime);
            case CardRole.Captain:
                return get(Images.Nagato);
            case CardRole.Assassin:
                return get(Images.Asakura);
            case CardRole.Contessa:
                return get(Images.Kyon);
            case CardRole.Ambassador:
                return get(Images.Haruhi);
            default:
                return "";
        }
    }

    getName() {
        switch (this.cardRole) {
            case CardRole.Duke:
                return "Duke";
            case CardRole.Captain:
                return "Captain";
            case CardRole.Assassin:
                return "Assassin";
            case CardRole.Contessa:
                return "Contessa";
            case CardRole.Ambassador:
                return "Ambassdor";
            default:
                return "";
        }
    }

    getElemName() {
        return <strong>{this.getName()}</strong>;
    }

    getDesc() {
        switch (this.cardRole) {
            case CardRole.Duke:
                return "Description for Duke";
            case CardRole.Captain:
                return "Description for Captain";
            case CardRole.Assassin:
                return "Description for Assassin";
            case CardRole.Contessa:
                return "Description for Contessa";
            case CardRole.Ambassador:
                return "Description for Ambassador";
            default:
                return "";
        }
    }
}
