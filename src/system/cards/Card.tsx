import get, {Images} from "resources/Resources";
import {DeckManager} from "system/cards/DeckManager";

/*
Card role corresponding to database
make sure each enum is 1 char long
CAPITAL = alive
small = dead card
*/
export type CardDeck = CardRole[];

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
            case CardRole.DEAD_Duke:
                return get(Images.KoihimeDead);
            case CardRole.Captain:
                return get(Images.Nagato);
            case CardRole.DEAD_Captain:
                return get(Images.NagatoDead);
            case CardRole.Assassin:
                return get(Images.Asakura);
            case CardRole.DEAD_Assassin:
                return get(Images.AsakuraDead);
            case CardRole.Contessa:
                return get(Images.Kyonko);
            case CardRole.DEAD_Contessa:
                return get(Images.KyonkoDead);
            case CardRole.Ambassador:
                return get(Images.Haruhi);
            case CardRole.DEAD_Ambassador:
                return get(Images.HaruhiDead);
            case CardRole.None:
            default:
                return get(Images.UnknownCard);
        }
    }

    getName() {
        switch (this.cardRole) {
            case CardRole.Duke:
            case CardRole.DEAD_Duke:
                return "Duke";
            case CardRole.DEAD_Captain:
            case CardRole.Captain:
                return "Captain";
            case CardRole.DEAD_Assassin:
            case CardRole.Assassin:
                return "Assassin";
            case CardRole.DEAD_Contessa:
            case CardRole.Contessa:
                return "Contessa";
            case CardRole.DEAD_Ambassador:
            case CardRole.Ambassador:
                return "Ambassdor";
            case CardRole.None:
            default:
                return "Unknown";
        }
    }

    getElemName() {
        return <strong>{this.getName()}</strong>;
    }

    getDesc() {
        switch (this.cardRole) {
            case CardRole.Duke:
            case CardRole.DEAD_Duke:
                return "Description for Duke";
            case CardRole.Captain:
            case CardRole.DEAD_Captain:
                return "Description for Captain";
            case CardRole.Assassin:
            case CardRole.DEAD_Assassin:
                return "Description for Assassin";
            case CardRole.Contessa:
            case CardRole.DEAD_Contessa:
                return "Description for Contessa";
            case CardRole.Ambassador:
            case CardRole.DEAD_Ambassador:
                return "Description for Ambassador";
            case CardRole.None:
            default:
                return "";
        }
    }
}
