import get, { Images } from "resources/Resources";

export enum CardRole {
  Duke,
  Captain,
  Assassin,
  Contessa,
  Ambassador,
}

export class Card {
  cardRole: CardRole;
  isDead: boolean;

  constructor(role: CardRole, dead: boolean) {
    this.cardRole = role;
    this.isDead = dead;
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
}
