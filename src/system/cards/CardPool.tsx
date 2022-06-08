import {Card, CardRole} from "system/cards/Card";
import {ObjectPool} from "system/cards/ObjectPool";

export class CardPool extends ObjectPool<CardRole, Card> {
    instantiate(key: CardRole): Card {
        return new Card(key);
    }
}

export const cardPool = new CardPool();
