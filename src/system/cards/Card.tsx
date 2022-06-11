import get, { Images } from "resources/Resources";
import { DeckManager } from "system/cards/DeckManager";
import { Fragment } from "react";
import { formatInsert } from "lang/i18nHelper";

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
  Inquisitor = "I",
  DEAD_Duke = "d",
  DEAD_Captain = "c",
  DEAD_Assassin = "a",
  DEAD_Contessa = "t",
  DEAD_Ambassador = "s",
  DEAD_Inquisitor = "i",
}

export const BASE_CARDS = [
  CardRole.Duke,
  CardRole.Captain,
  CardRole.Assassin,
  CardRole.Ambassador,
  CardRole.Contessa,
];
export const EXPANSION_CARDS = [
  CardRole.Duke,
  CardRole.Captain,
  CardRole.Assassin,
  CardRole.Ambassador,
  CardRole.Inquisitor,
];

/*
This class is intended to be used as UI purposed
does not go into database
*/
export class Card {
  public static isDead(role: CardRole): boolean {
    return DeckManager.isDead(role);
  }

  public static getImage(role: CardRole) {
    switch (role) {
      case CardRole.Inquisitor:
        return get(Images.Mikuru);
      case CardRole.DEAD_Inquisitor:
        return get(Images.MikuruDead);
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

  public static getName(t: any, role: CardRole): string {
    switch (role) {
      case CardRole.Duke:
      case CardRole.DEAD_Duke:
        return t("_duke_name");
      case CardRole.DEAD_Captain:
      case CardRole.Captain:
        return t("_captain_name");
      case CardRole.DEAD_Assassin:
      case CardRole.Assassin:
        return t("_assaassin_name");
      case CardRole.DEAD_Contessa:
      case CardRole.Contessa:
        return t("_contessa_name");
      case CardRole.DEAD_Ambassador:
      case CardRole.Ambassador:
        return t("_ambassador_name");
      case CardRole.DEAD_Inquisitor:
      case CardRole.Inquisitor:
        return t("_inquisitor_name");
      case CardRole.None:
      default:
        return t("_unknown_name");
    }
  }

  public static getDesc(t: any, role: CardRole): JSX.Element {
    switch (role) {
      case CardRole.Duke:
      case CardRole.DEAD_Duke:
        return formatInsert(t, "_duke_desc");
      case CardRole.Captain:
      case CardRole.DEAD_Captain:
        return formatInsert(t, "_captain_desc");
      case CardRole.Assassin:
      case CardRole.DEAD_Assassin:
        return formatInsert(t, "_assaassin_desc");
      case CardRole.Contessa:
      case CardRole.DEAD_Contessa:
        return formatInsert(t, "_contessa_desc");
      case CardRole.Ambassador:
      case CardRole.DEAD_Ambassador:
        return formatInsert(t, "_ambassador_desc");
      case CardRole.Inquisitor:
      case CardRole.DEAD_Inquisitor:
        return formatInsert(t, "_inquisitor_desc");
      case CardRole.None:
      default:
        return <Fragment />;
    }
  }
}
