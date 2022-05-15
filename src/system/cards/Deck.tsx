import { Card } from "system/cards/Card";

export class Deck {
  remain: Card[];
  revealed: Card[];
  constructor() {
    this.remain = [];
    this.revealed = [];
  }
}
