import {Card, CardRole} from "system/cards/Card";


const map = new Map<CardRole, Card>();
export const CardPool = {
    getCard(role: CardRole): Card {
        if (!map.has(role)) {
            map.set(role, new Card(role));
        }
        return map.get(role)!;
    }
};